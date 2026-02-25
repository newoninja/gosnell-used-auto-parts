import {
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  type QueryConstraint,
  type DocumentSnapshot,
} from 'firebase/firestore'
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { db, storage } from './client'
import type { Part, PartFormData, PartCategory, StockStatus } from '@/lib/types/inventory'

const PARTS_COLLECTION = 'parts'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildSearchableText(data: PartFormData): string {
  return [
    data.name,
    data.category,
    data.vin,
    data.vehicleYear?.toString(),
    data.vehicleMake,
    data.vehicleModel,
    data.vehicleTrim,
    data.notes,
    data.yardLocation,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function docToPart(docSnap: DocumentSnapshot): Part {
  const data = docSnap.data()!
  return { id: docSnap.id, ...data } as Part
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

/** Generate a new part document ID without writing to Firestore yet */
export function generatePartId(): string {
  return doc(collection(db, PARTS_COLLECTION)).id
}

export async function createPart(data: PartFormData, id?: string): Promise<string> {
  if (id) {
    // Use pre-generated ID (for image uploads before save)
    await setDoc(doc(db, PARTS_COLLECTION, id), {
      ...data,
      searchableText: buildSearchableText(data),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return id
  }

  const docRef = await addDoc(collection(db, PARTS_COLLECTION), {
    ...data,
    searchableText: buildSearchableText(data),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export async function updatePart(id: string, data: Partial<PartFormData>): Promise<void> {
  const docRef = doc(db, PARTS_COLLECTION, id)
  const updateData: Record<string, unknown> = {
    ...data,
    updatedAt: serverTimestamp(),
  }

  // Rebuild searchable text if any text fields changed
  if (data.name || data.vehicleMake || data.vehicleModel || data.vin || data.notes) {
    const existing = await getDoc(docRef)
    if (existing.exists()) {
      const merged = { ...existing.data(), ...data } as PartFormData
      updateData.searchableText = buildSearchableText(merged)
    }
  }

  await updateDoc(docRef, updateData)
}

export async function deletePart(id: string): Promise<void> {
  await deleteDoc(doc(db, PARTS_COLLECTION, id))
}

export async function getPart(id: string): Promise<Part | null> {
  const docSnap = await getDoc(doc(db, PARTS_COLLECTION, id))
  if (!docSnap.exists()) return null
  return docToPart(docSnap)
}

// ---------------------------------------------------------------------------
// List / Query
// ---------------------------------------------------------------------------

export interface ListPartsOptions {
  status?: StockStatus
  category?: PartCategory
  make?: string
  searchText?: string
  pageSize?: number
  cursor?: DocumentSnapshot
  sortField?: 'createdAt' | 'price' | 'vehicleYear'
  sortDirection?: 'asc' | 'desc'
}

export interface ListPartsResult {
  parts: Part[]
  lastDoc: DocumentSnapshot | null
  hasMore: boolean
}

export async function listParts(options: ListPartsOptions = {}): Promise<ListPartsResult> {
  const {
    status,
    category,
    make,
    pageSize = 20,
    cursor,
    sortField = 'createdAt',
    sortDirection = 'desc',
  } = options

  const constraints: QueryConstraint[] = []

  if (status) {
    constraints.push(where('stockStatus', '==', status))
  }
  if (category) {
    constraints.push(where('category', '==', category))
  }
  if (make) {
    constraints.push(where('vehicleMake', '==', make))
  }

  constraints.push(orderBy(sortField, sortDirection))

  if (cursor) {
    constraints.push(startAfter(cursor))
  }

  // Fetch one extra to determine if there are more pages
  constraints.push(limit(pageSize + 1))

  const q = query(collection(db, PARTS_COLLECTION), ...constraints)
  const snapshot = await getDocs(q)

  const hasMore = snapshot.docs.length > pageSize
  const docs = hasMore ? snapshot.docs.slice(0, pageSize) : snapshot.docs
  const parts = docs.map(docToPart)
  const lastDoc = docs.length > 0 ? docs[docs.length - 1] : null

  return { parts, lastDoc, hasMore }
}

// ---------------------------------------------------------------------------
// Status updates
// ---------------------------------------------------------------------------

export async function updatePartStatus(id: string, status: StockStatus): Promise<void> {
  await updateDoc(doc(db, PARTS_COLLECTION, id), {
    stockStatus: status,
    updatedAt: serverTimestamp(),
  })
}

export async function bulkUpdateStatus(ids: string[], status: StockStatus): Promise<void> {
  await Promise.all(ids.map((id) => updatePartStatus(id, status)))
}

export async function bulkDelete(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id) => deletePart(id)))
}

// ---------------------------------------------------------------------------
// Image upload / delete
// ---------------------------------------------------------------------------

export async function uploadPartImage(
  partId: string,
  file: File
): Promise<string> {
  const timestamp = Date.now()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `parts/${partId}/${timestamp}_${safeName}`
  const storageRef = ref(storage, path)

  await uploadBytes(storageRef, file, {
    contentType: file.type,
  })

  return getDownloadURL(storageRef)
}

export async function deletePartImage(imageUrl: string): Promise<void> {
  try {
    const storageRef = ref(storage, imageUrl)
    await deleteObject(storageRef)
  } catch (error) {
    // Image may have already been deleted — don't throw
    console.warn('Failed to delete image:', error)
  }
}

// ---------------------------------------------------------------------------
// Stats (for dashboard)
// ---------------------------------------------------------------------------

export interface PartStats {
  total: number
  available: number
  sold: number
  onHold: number
  addedThisWeek: number
}

export async function getPartStats(): Promise<PartStats> {
  const allParts = await getDocs(collection(db, PARTS_COLLECTION))

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  let available = 0
  let sold = 0
  let onHold = 0
  let addedThisWeek = 0

  allParts.forEach((docSnap) => {
    const data = docSnap.data()
    switch (data.stockStatus) {
      case 'Available':
        available++
        break
      case 'Sold':
        sold++
        break
      case 'On Hold':
        onHold++
        break
    }
    if (data.createdAt?.toDate && data.createdAt.toDate() >= weekAgo) {
      addedThisWeek++
    }
  })

  return {
    total: allParts.size,
    available,
    sold,
    onHold,
    addedThisWeek,
  }
}
