import assert from 'node:assert/strict'
import test from 'node:test'
import { buildInventorySearchText, buildInventorySearchUrl } from '../lib/inventory-search.ts'
import { BUSINESS } from '../lib/utils.ts'

test('buildInventorySearchText joins non-empty fields in order', () => {
  const text = buildInventorySearchText({
    year: '2019',
    make: 'Ford',
    model: ' F-150 ',
    partType: 'Alternator',
  })

  assert.equal(text, '2019 Ford F-150 Alternator')
})

test('buildInventorySearchUrl returns base inventory URL when search is empty', () => {
  const url = buildInventorySearchUrl({})
  assert.equal(url, BUSINESS.inventory)
})

test('buildInventorySearchUrl appends search query to inventory URL', () => {
  const url = buildInventorySearchUrl({
    year: '2020',
    make: 'Toyota',
    model: 'Tacoma',
    partType: 'Door',
  })

  const parsed = new URL(url)
  assert.equal(parsed.origin + parsed.pathname, 'https://trade3466.car-part.com/')
  assert.equal(parsed.searchParams.get('q'), '2020 Toyota Tacoma Door')
})
