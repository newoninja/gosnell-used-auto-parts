import assert from 'node:assert/strict'
import test from 'node:test'
import { isSupportedContactEndpoint } from '../lib/contact.ts'

test('accepts Formspree HTTPS endpoint', () => {
  assert.equal(isSupportedContactEndpoint('https://formspree.io/f/abc123'), true)
})

test('accepts Formspree subdomain endpoint', () => {
  assert.equal(isSupportedContactEndpoint('https://submit.formspree.io/f/xyz789'), true)
})

test('rejects non-Formspree endpoint', () => {
  assert.equal(isSupportedContactEndpoint('https://example.com/contact'), false)
})

test('rejects malformed endpoint', () => {
  assert.equal(isSupportedContactEndpoint('not-a-url'), false)
})
