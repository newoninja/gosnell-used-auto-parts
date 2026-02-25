import { z } from 'zod'
import { PART_CATEGORIES, PART_CONDITIONS, STOCK_STATUSES } from '@/lib/types/inventory'

export const partSchema = z.object({
  name: z.string().min(1, 'Part name is required').max(200),
  category: z.enum(PART_CATEGORIES, { required_error: 'Category is required' }),
  vin: z
    .string()
    .max(17)
    .refine((val) => val === '' || /^[A-HJ-NPR-Z0-9]{17}$/i.test(val), {
      message: 'VIN must be exactly 17 characters (no I, O, or Q)',
    })
    .default(''),
  vehicleYear: z
    .number({ required_error: 'Year is required' })
    .int()
    .min(1900, 'Year must be 1900 or later')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  vehicleMake: z.string().min(1, 'Make is required').max(50),
  vehicleModel: z.string().min(1, 'Model is required').max(50),
  vehicleTrim: z.string().max(50).optional(),
  condition: z.enum(PART_CONDITIONS, { required_error: 'Condition is required' }),
  price: z
    .number({ required_error: 'Price is required' })
    .int('Price must be a whole number (cents)')
    .min(0, 'Price cannot be negative'),
  mileage: z.number().int().min(0).optional(),
  yardLocation: z.string().min(1, 'Yard location is required').max(100),
  photos: z.array(z.string().url()).max(6, 'Maximum 6 photos allowed').default([]),
  stockStatus: z.enum(STOCK_STATUSES).default('Available'),
  notes: z.string().max(2000).default(''),
  addedBy: z.string().min(1, 'Staff member is required'),
})

export type PartSchemaInput = z.input<typeof partSchema>
export type PartSchemaOutput = z.output<typeof partSchema>
