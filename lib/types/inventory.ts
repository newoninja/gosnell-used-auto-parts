import type { Timestamp } from 'firebase/firestore'

export const PART_CATEGORIES = [
  'engine',
  'transmission',
  'body',
  'electrical',
  'interior',
  'suspension',
  'brakes',
  'cooling',
  'exhaust',
  'fuel',
  'steering',
  'wheels-tires',
  'glass',
  'lighting',
  'other',
] as const

export type PartCategory = (typeof PART_CATEGORIES)[number]

export const PART_CATEGORY_LABELS: Record<PartCategory, string> = {
  engine: 'Engine',
  transmission: 'Transmission',
  body: 'Body',
  electrical: 'Electrical',
  interior: 'Interior',
  suspension: 'Suspension',
  brakes: 'Brakes',
  cooling: 'Cooling',
  exhaust: 'Exhaust',
  fuel: 'Fuel',
  steering: 'Steering',
  'wheels-tires': 'Wheels & Tires',
  glass: 'Glass',
  lighting: 'Lighting',
  other: 'Other',
}

export const PART_CONDITIONS = ['Excellent', 'Good', 'Fair', 'Poor'] as const
export type PartCondition = (typeof PART_CONDITIONS)[number]

export const STOCK_STATUSES = ['Available', 'Sold', 'On Hold'] as const
export type StockStatus = (typeof STOCK_STATUSES)[number]

export interface Part {
  id: string
  name: string
  category: PartCategory
  vin: string
  vehicleYear: number
  vehicleMake: string
  vehicleModel: string
  vehicleTrim?: string
  condition: PartCondition
  price: number // stored in cents
  mileage?: number
  yardLocation: string
  photos: string[]
  stockStatus: StockStatus
  notes: string
  addedBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
  searchableText: string
}

export type PartFormData = Omit<Part, 'id' | 'createdAt' | 'updatedAt' | 'searchableText'>
