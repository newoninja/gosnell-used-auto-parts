import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, Clock, MapPin, MessageSquare, Phone, Search, Wrench } from 'lucide-react'
import { BUSINESS, isCurrentlyOpen } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Used OEM auto parts in Flat Rock, NC. Search inventory online or call Gosnell Used Auto Parts for fast local help.',
  alternates: { canonical: '/' },
}

const quickLinks = [
  {
    href: '/inventory',
    title: 'Search Inventory',
    description: 'Open our live inventory at Car-Part.com and find the part you need.',
    icon: Search,
  },
  {
    href: '/services',
    title: 'Services',
    description: 'Part pulling, matching assistance, delivery options, and recycling support.',
    icon: Wrench,
  },
  {
    href: '/contact',
    title: 'Request a Part',
    description: 'Send your request online or call us directly for the fastest response.',
    icon: MessageSquare,
  },
]

const valuePoints = [
  'Family-owned and operated',
  'Straightforward pricing',
  'Used OEM parts from our local yard',
  'Serving Henderson County and Western NC',
]

export default function HomePage() {
  const currentlyOpen = isCurrentlyOpen()

  return (
    <main className="min-h-screen">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-wide text-forest-700">Gosnell Used Auto Parts</p>
          <h1 className="mt-3 max-w-3xl font-heading text-3xl font-black leading-tight text-slate-900 sm:text-5xl">
            Quality used auto parts in Flat Rock, North Carolina.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600 sm:mt-5 sm:text-lg">
            Search inventory online or call our team for help finding the right part.
            We keep it simple: honest answers, fair prices, and local service.
          </p>

          <div className="mt-7 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap">
            <a
              href={BUSINESS.inventory}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-400 sm:w-auto"
            >
              Search Inventory
            </a>
            <a
              href={BUSINESS.phones.mainHref}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-100 sm:w-auto"
            >
              Call {BUSINESS.phones.main}
            </a>
          </div>

          <div className="mt-7 grid gap-3 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-700 sm:p-4">
              <Phone className="mb-2 h-4 w-4 text-orange-500" aria-hidden="true" />
              Main: {BUSINESS.phones.main}
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-700 sm:p-4">
              <MapPin className="mb-2 h-4 w-4 text-orange-500" aria-hidden="true" />
              {BUSINESS.address.city}, {BUSINESS.address.state}
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-700 sm:p-4">
              <Clock className="mb-2 h-4 w-4 text-orange-500" aria-hidden="true" />
              Mon-Thu 8-5, Fri 8-4
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-700 sm:p-4">
              <CheckCircle2 className="mb-2 h-4 w-4 text-orange-500" aria-hidden="true" />
              {currentlyOpen ? 'Open now' : 'Currently closed'}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <h2 className="font-heading text-2xl font-bold text-slate-900">Start Here</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {quickLinks.map(({ href, title, description, icon: Icon }) => (
            <Link key={href} href={href} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300">
              <Icon className="h-5 w-5 text-orange-500" aria-hidden="true" />
              <h3 className="mt-3 font-heading text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-slate-900">Why customers call us first</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {valuePoints.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-forest-700" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
