import type { Metadata } from 'next'
import { BUSINESS } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Gosnell Used Auto Parts.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl font-black text-slate-950">Privacy Policy</h1>
        <p className="mt-4 text-sm text-slate-600">
          This policy explains how {BUSINESS.name} handles information submitted through our website.
        </p>

        <div className="mt-8 space-y-5 text-sm text-slate-700">
          <section>
            <h2 className="font-heading text-lg font-bold text-slate-900">Information We Collect</h2>
            <p className="mt-2">
              We collect contact and vehicle details you provide in forms, including name, phone,
              email, vehicle details, and requested part information.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-slate-900">How We Use It</h2>
            <p className="mt-2">
              We use your information to respond to part requests, confirm availability, provide pricing,
              and contact you about your request.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-slate-900">Data Sharing</h2>
            <p className="mt-2">
              We do not sell your personal information. We only share data with services required to run
              this site and process form submissions.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-slate-900">Contact</h2>
            <p className="mt-2">
              Questions about this policy can be directed to us at {BUSINESS.phones.main}.
            </p>
          </section>
        </div>
      </section>
    </main>
  )
}
