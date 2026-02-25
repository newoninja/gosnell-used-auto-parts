import type { Metadata } from 'next'
import { BUSINESS } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'About',
  description:
    'About Gosnell Used Auto Parts in Flat Rock, NC. Family-owned salvage yard serving Henderson County and Western North Carolina.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-forest-700">About Us</p>
          <h1 className="mt-3 font-heading text-3xl font-black text-slate-900 sm:text-5xl">
            Family-owned and built on honest service
          </h1>
          <p className="mt-4 max-w-3xl text-base text-slate-600 sm:text-lg">
            {BUSINESS.name} has served drivers, shops, and mechanics across Henderson County and
            Western North Carolina with quality used auto parts and straightforward help.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-heading text-xl font-bold text-slate-900">Our approach</h2>
            <p className="mt-3 text-sm text-slate-600">
              We keep things simple: listen to what you need, check inventory, and give you a clear answer.
              If we have it, we help you get it quickly. If we do not, we tell you directly.
            </p>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-heading text-xl font-bold text-slate-900">Where we serve</h2>
            <p className="mt-3 text-sm text-slate-600">
              Based in Flat Rock, we regularly serve Hendersonville, Asheville, and surrounding
              communities across Western North Carolina.
            </p>
          </article>
        </div>

        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-heading text-xl font-bold text-slate-900">Location</h2>
          <p className="mt-2 text-sm text-slate-600">{BUSINESS.address.full}</p>
          <p className="mt-1 text-sm text-slate-600">Main phone: {BUSINESS.phones.main}</p>
        </div>
      </section>
    </main>
  )
}
