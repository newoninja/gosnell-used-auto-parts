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
  pageSize?: number
  offset?: number
}

async function _getAvailableParts(options: PublicPartsQuery = {}): Promise<{
  parts: Part[]
  total: number
}> {
  const { category, make, model, year, pageSize = 24, offset = 0 } = options

  let q: FirebaseFirestore.Query = adminDb().collection(PARTS_COLLECTION).where('stockStatus', '==', 'Available')

  if (category) q = q.where('category', '==', category)
  if (make) q = q.where('vehicleMake', '==', make)
  if (year) q = q.where('vehicleYear', '==', year)

  q = q.orderBy('createdAt', 'desc')

  // Get total count (for pagination display)
  const countSnap = await q.count().get()
  const total = countSnap.data().count

  // Paginate
  if (offset > 0) {
    q = q.offset(offset)
  }
  q = q.limit(pageSize)

  const snapshot = await q.get()
  let parts = snapshot.docs.map(docToPart)

  // Client-side filter for model (Firestore can't do inequality + orderBy on different fields easily)
  if (model) {
    const modelLower = model.toLowerCase()
    parts = parts.filter((p) => p.vehicleModel.toLowerCase().includes(modelLower))
  }

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
