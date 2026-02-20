'use client'

import { FormEvent, useState } from 'react'
import { isSupportedContactEndpoint } from '@/lib/contact'
import { BUSINESS } from '@/lib/utils'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export function SimpleContactForm() {
  const [status, setStatus] = useState<SubmitState>('idle')
  const [notice, setNotice] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT

    if (!isSupportedContactEndpoint(endpoint)) {
      setStatus('error')
      setNotice(`Online form is unavailable right now. Please call ${BUSINESS.phones.main}.`)
      return
    }

    setStatus('submitting')
    setNotice('')

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      setStatus('success')
      setNotice('Thanks. We received your request and will follow up during business hours.')
      form.reset()
    } catch {
      setStatus('error')
      setNotice(`We could not send your message. Please call ${BUSINESS.phones.main}.`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Name *
          <input
            type="text"
            name="name"
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Phone
          <input
            type="tel"
            name="phone"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Email
        <input
          type="email"
          name="email"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Vehicle (year/make/model)
        <input
          type="text"
          name="vehicle"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Part Needed *
        <input
          type="text"
          name="part_needed"
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Message
        <textarea
          name="message"
          rows={4}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        />
      </label>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center rounded-md bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === 'submitting' ? 'Sending...' : 'Send Request'}
      </button>

      {notice && (
        <p
          className={`text-sm ${status === 'success' ? 'text-green-700' : 'text-red-700'}`}
          role="status"
        >
          {notice}
        </p>
      )}
    </form>
  )
}
