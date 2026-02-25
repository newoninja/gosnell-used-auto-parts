import type { Metadata } from 'next'
import { Phone } from 'lucide-react'
import { BUSINESS } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Services at Gosnell Used Auto Parts: used OEM parts, part pulling, matching help, local delivery options, and scrap recycling.',
  alternates: { canonical: '/services' },
}

const services = [
  {
    title: 'Used OEM Parts',
    description: 'Engines, transmissions, body parts, electrical components, and interior parts from our local yard.',
  },
  {
    title: 'Part Pulling',
    description: 'Our staff pulls parts for you. Call with your vehicle details and we will confirm availability.',
  },
  {
    title: 'Part Matching Help',
    description: 'Not sure what fits? We can help cross-check by vehicle details or part number.',
  },
  {
    title: 'Local Service',
    description: 'Ask about local pickup and delivery options in Henderson County and nearby areas.',
  },
  {
    title: 'Scrap and Recycling',
    description: 'We also handle end-of-life vehicles and scrap recycling support.',
  },
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-forest-700">Services</p>
          <h1 className="mt-3 font-heading text-3xl font-black text-slate-900 sm:text-5xl">What we do</h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            Simple, practical support for finding the right used part quickly.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <article key={service.title} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <h2 className="font-heading text-xl font-bold text-slate-900">{service.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{service.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-orange-200 bg-orange-50 p-4 sm:p-5">
          <p className="text-sm text-slate-700">
            Need help now? Call us and speak to a real person.
          </p>
          <a
            href={BUSINESS.phones.mainHref}
            className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-400 sm:w-auto"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {BUSINESS.phones.main}
          </a>
        </div>
      </section>
    </main>
  )
}
