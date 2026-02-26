import type { Metadata } from 'next'
import { BUSINESS } from '@/lib/utils'
import { AboutSection } from '@/components/about-section'
import { MeetTheOwner } from '@/components/meet-the-owner'
import { Testimonials } from '@/components/testimonials'
import { LocationHours } from '@/components/location-hours'

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

      <MeetTheOwner />
      <AboutSection />
      <Testimonials />
      <LocationHours />
    </main>
  )
}
