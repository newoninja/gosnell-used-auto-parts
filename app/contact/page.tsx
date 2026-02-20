import type { Metadata } from 'next'
import { Clock, MapPin, Phone } from 'lucide-react'
import { SimpleContactForm } from '@/components/simple-contact-form'
import { BUSINESS, isCurrentlyOpen } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Gosnell Used Auto Parts in Flat Rock, NC. Call us or send a part request form.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  const currentlyOpen = isCurrentlyOpen()

  return (
    <main className="min-h-screen">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-forest-700">Contact</p>
          <h1 className="mt-3 font-heading text-4xl font-black text-slate-900 sm:text-5xl">Get in touch</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Call us for the fastest response, or send your request below.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="flex items-start gap-2 text-sm text-slate-700">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" aria-hidden="true" />
                {BUSINESS.address.full}
              </p>
              <p className="mt-3 flex items-start gap-2 text-sm text-slate-700">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" aria-hidden="true" />
                <span>
                  <a href={BUSINESS.phones.mainHref} className="font-semibold text-slate-900 hover:text-orange-600">
                    {BUSINESS.phones.main}
                  </a>
                  <br />
                  <a href={BUSINESS.phones.secondaryHref} className="font-semibold text-slate-900 hover:text-orange-600">
                    {BUSINESS.phones.secondary}
                  </a>
                </span>
              </p>
              <p className="mt-3 flex items-start gap-2 text-sm text-slate-700">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" aria-hidden="true" />
                <span>
                  Mon-Thu: 8:00 AM-5:00 PM
                  <br />
                  Fri: 8:00 AM-4:00 PM
                  <br />
                  Sat-Sun: Closed
                </span>
              </p>
              <p className="mt-3 text-sm font-semibold text-forest-700">
                {currentlyOpen ? 'We are currently open.' : 'We are currently closed.'}
              </p>
            </div>

            <iframe
              title="Gosnell Used Auto Parts map"
              src="https://maps.google.com/maps?q=110+Tabor+Road+Extension,+Flat+Rock,+NC+28731&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="h-64 w-full rounded-lg border border-slate-200"
              loading="lazy"
            />
          </div>

          <SimpleContactForm />
        </div>
      </section>
    </main>
  )
}
