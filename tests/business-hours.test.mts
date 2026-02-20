import assert from 'node:assert/strict'
import test from 'node:test'
import { isCurrentlyOpenAt } from '../lib/utils.ts'

const ET = 'America/New_York'

test('isCurrentlyOpenAt is open at 8:00 AM ET Monday', () => {
  const mondayAtOpen = new Date('2026-02-16T13:00:00.000Z') // 08:00 ET
  assert.equal(isCurrentlyOpenAt(mondayAtOpen, ET), true)
})

test('isCurrentlyOpenAt is closed before opening time', () => {
  const mondayBeforeOpen = new Date('2026-02-16T12:59:00.000Z') // 07:59 ET
  assert.equal(isCurrentlyOpenAt(mondayBeforeOpen, ET), false)
})

test('isCurrentlyOpenAt is closed at Friday close boundary', () => {
  const fridayAtClose = new Date('2026-02-20T21:00:00.000Z') // 16:00 ET
  assert.equal(isCurrentlyOpenAt(fridayAtClose, ET), false)
})

test('isCurrentlyOpenAt is closed on Saturday', () => {
  const saturdayNoon = new Date('2026-02-21T17:00:00.000Z') // 12:00 ET
  assert.equal(isCurrentlyOpenAt(saturdayNoon, ET), false)
})
