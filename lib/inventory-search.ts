import { BUSINESS } from './utils.ts'

export type QuickSearchInput = {
  year?: string
  make?: string
  model?: string
  partType?: string
}

function normalize(value?: string): string {
  return value?.trim().replace(/\s+/g, ' ') ?? ''
}

export function buildInventorySearchText(input: QuickSearchInput): string {
  return [input.year, input.make, input.model, input.partType]
    .map(normalize)
    .filter(Boolean)
    .join(' ')
}

export function buildInventorySearchUrl(input: QuickSearchInput): string {
  const searchText = buildInventorySearchText(input)
  if (!searchText) return BUSINESS.inventory

  const url = new URL(BUSINESS.inventory)
  url.searchParams.set('q', searchText)
  return url.toString()
}
