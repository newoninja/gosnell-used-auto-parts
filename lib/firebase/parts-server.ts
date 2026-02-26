import { unstable_cache } from 'next/cache'
import { adminDb } from './admin'

import type { Part } from '@/lib/types/inventory'
import type { PartCategory } from '@/lib/types/inventory'

const PARTS_COLLECTION = 'parts'
const CACHE_TTL = 60 // seconds

function docToPart(doc: FirebaseFirestore.QueryDocumentSnapshot): Part {
  const data = doc.data()
  return { id: doc.id, ...data } as Part
}

interface PublicPartsQuery {
  category?: PartCategory
  make?: string
  model?: string
  year?: number
  search?: string
  pageSize?: number
  offset?: number
}

async function _getAvailableParts(options: PublicPartsQuery = {}): Promise<{
  parts: Part[]
  total: number
}> {
  const { category, make, model, year, search, pageSize = 24, offset = 0 } = options

  // Fetch all available parts with a simple query (no composite index needed)
  const snapshot = await adminDb()
    .collection(PARTS_COLLECTION)
    .where('stockStatus', '==', 'Available')
    .orderBy('createdAt', 'desc')
    .get()

  let parts = snapshot.docs.map(docToPart)

  // Filter in JavaScript (case-insensitive, avoids Firestore composite index issues)
  if (category) {
    parts = parts.filter((p) => p.category === category)
  }
  if (make) {
    const makeLower = make.toLowerCase()
    parts = parts.filter((p) => p.vehicleMake.toLowerCase().includes(makeLower))
  }
  if (model) {
    const modelLower = model.toLowerCase()
    parts = parts.filter((p) => p.vehicleModel.toLowerCase().includes(modelLower))
  }
  if (year) {
    parts = parts.filter((p) => p.vehicleYear === year)
  }
  if (search) {
    const q = search.toLowerCase()
    parts = parts.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.vehicleMake.toLowerCase().includes(q) ||
      p.vehicleModel.toLowerCase().includes(q) ||
      (p.notes && p.notes.toLowerCase().includes(q))
    )
  }

  const total = parts.length

  // Paginate
  parts = parts.slice(offset, offset + pageSize)

  return { parts, total }
}

export async function getAvailableParts(options: PublicPartsQuery = {}): Promise<{
  parts: Part[]
  total: number
}> {
  const { category, make, model, year, pageSize = 24, offset = 0 } = options
  const cacheKey = `parts-${category || 'all'}-${make || 'all'}-${model || 'all'}-${year || 'all'}-${pageSize}-${offset}`

  const cached = unstable_cache(
    () => _getAvailableParts(options),
    [cacheKey],
    { revalidate: CACHE_TTL, tags: ['parts'] }
  )

  return cached()
}

async function _getPartById(id: string): Promise<Part | null> {
  const doc = await adminDb().collection(PARTS_COLLECTION).doc(id).get()
  if (!doc.exists) return null
  return { id: doc.id, ...doc.data() } as Part
}

export async function getPartById(id: string): Promise<Part | null> {
  const cached = unstable_cache(
    () => _getPartById(id),
    [`part-${id}`],
    { revalidate: CACHE_TTL, tags: ['parts'] }
  )

  return cached()
}

async function _getRecentParts(limit: number): Promise<Part[]> {
  const snapshot = await adminDb()
    .collection(PARTS_COLLECTION)
    .where('stockStatus', '==', 'Available')
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get()

  return snapshot.docs.map(docToPart)
}

export async function getRecentParts(limit = 5): Promise<Part[]> {
  const cached = unstable_cache(
    () => _getRecentParts(limit),
    [`recent-parts-${limit}`],
    { revalidate: CACHE_TTL, tags: ['parts'] }
  )

  return cached()
}

export async function getAllPartIds(): Promise<string[]> {
  const cached = unstable_cache(
    async () => {
      const snapshot = await adminDb()
        .collection(PARTS_COLLECTION)
        .where('stockStatus', '==', 'Available')
        .select()
        .get()

      return snapshot.docs.map((doc) => doc.id)
    },
    ['all-part-ids'],
    { revalidate: CACHE_TTL, tags: ['parts'] }
  )

  return cached()
}
