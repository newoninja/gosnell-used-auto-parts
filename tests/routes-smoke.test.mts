import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import test from 'node:test'

const requiredPaths = [
  new URL('../app/page.tsx', import.meta.url),
  new URL('../app/about/page.tsx', import.meta.url),
  new URL('../app/services/page.tsx', import.meta.url),
  new URL('../app/inventory/page.tsx', import.meta.url),
  new URL('../app/contact/page.tsx', import.meta.url),
  new URL('../public/og-image.svg', import.meta.url),
]

test('top routes and social image asset exist', () => {
  for (const path of requiredPaths) {
    assert.equal(existsSync(path), true, `Missing expected file: ${path.pathname}`)
  }
})
