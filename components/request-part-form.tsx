'use client'

import { FormEvent, useState } from 'react'
import { isSupportedContactEndpoint } from '@/lib/contact'
import { BUSINESS } from '@/lib/utils'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

const commonParts = [
  'Engine',
  'Transmission',
  'Front Bumper',
  'Rear Bumper',
  'Fender',
  'Door',
  'Headlight',
  'Taillight',
  'Alternator',
  'Starter',
  'Mirror',
  'Radiator',
  'Other',
]

export function RequestPartForm() {
  const [status, setStatus] = useState<SubmitState>('idle')
  const [notice, setNotice] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT
    const form = event.currentTarget

    if (!isSupportedContactEndpoint(endpoint)) {
      setStatus('error')
      setNotice(`Online form is unavailable right now. Please call ${BUSINESS.phones.main}.`)
      return
    }

    setStatus('submitting')
    setNotice('')

    const body = new FormData(form)
    body.append('_subject', 'New part request from Gosnell website')

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      setStatus('success')
      setNotice('Thanks. We got your request and will call you within one business day.')
      form.reset()
    } catch {
      setStatus('error')
      setNotice(`We could not send your request. Please call ${BUSINESS.phones.main}.`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">
          Name *
          <input
            type="text"
            name="name"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/25"
          />
        </label>

        <label className="text-sm font-semibold text-slate-700">
          Phone *
          <input
            type="tel"
            name="phone"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/25"
          />
        </label>

        <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
          Email *
          <input
            type="email"
            name="email"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/25"
          />
        </label>

        <label className="text-sm font-semibold text-slate-700">
          Year *
          <input
            type="text"
            name="vehicle_year"
            required
            placeholder="e.g. 2018"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/25"
          />
        </label>

        <label className="text-sm font-semibold text-slate-700">
          Make *
          <input
            type="text"
            name="vehicle_make"
            required
            placeholder="e.g. Ford"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/25"
          />
        </label>

        <label className="text-sm font-semibold text-slate-700">
          Model *
          <input
            type="text"
            name="vehicle_model"
            required
            placeholder="e.g. F-150"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/25"
          />
        </label>

        <label className="text-sm font-semibold text-slate-700">
          Trim
          <input
            type="text"
            name="vehicle_trim"
            placeholder="Optional"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/25"
          />
        </label>

        <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
          VIN (optional)
          <input
            type="text"
            name="vin"
            placeholder="17-character VIN helps us match faster"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/25"
          />
        </label>

        <label className="text-sm font-semibold text-slate-700">
          Part Type *
          <select
            name="part_type"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/25"
          >
            <option value="">Select a part</option>
            {commonParts.map((part) => (
              <option key={part} value={part}>
                {part}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-semibold text-slate-700">
          Urgency
          <select
            name="urgency"
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/25"
          >
            <option value="standard">Standard</option>
            <option value="same_day">Same Day</option>
            <option value="rush">Rush</option>
          </select>
        </label>

        <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
          Part Needed Details *
          <textarea
            name="part_needed"
            rows={4}
            required
            placeholder="Tell us exactly what part you need and any damage/condition requirements."
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/25"
          />
        </label>

        <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
          Notes
          <textarea
            name="notes"
            rows={3}
            placeholder="Any extra info, pickup timing, or delivery needs."
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/25"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === 'submitting' ? 'Sending Request...' : 'Submit Request'}
      </button>

      {notice && (
        <p className={`mt-3 text-sm ${status === 'success' ? 'text-green-700' : 'text-red-700'}`} role="status">
          {notice}
        </p>
      )}
    </form>
  )
}
