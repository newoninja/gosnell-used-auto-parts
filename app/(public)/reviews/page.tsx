import type { Metadata } from 'next'
import { Testimonials } from '@/components/testimonials'
import { Footer } from '@/components/footer'
import { Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Reviews | Gosnell Used Auto Parts – Flat Rock, NC',
  description:
    'See what customers say about Gosnell Used Auto Parts in Flat Rock, NC. Rated 4.8 stars on Google and Yelp. Serving Henderson County and Western NC.',
  alternates: { canonical: '/reviews' },
}

export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="relative pt-32 pb-14 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm font-semibold text-orange-600 mb-6">
            <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            Customer Reviews
          </div>
          <h1 className="font-heading text-5xl font-black text-slate-900 sm:text-6xl leading-tight">
            What Our{' '}
            <span className="gradient-text-orange">Neighbors</span> Say
          </h1>
          <p className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Rated 4.8 stars by customers across Henderson County and Western North Carolina.
          </p>
        </div>
      </div>

      <Testimonials />
      <Footer />
    </main>
  )
}
