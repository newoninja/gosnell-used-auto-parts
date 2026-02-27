import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  BadgeCheck,
  Car,
  CheckCircle2,
  Clock3,
  ExternalLink,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  ShieldCheck,
  Star,
  Truck,
  Users,
  Wrench,
} from 'lucide-react'
import { RequestPartForm } from '@/components/request-part-form'
import { Testimonials } from '@/components/testimonials'
import { HeroSearch } from '@/components/hero-search'
import { JunkCarsCta } from '@/components/junk-cars-cta'
import { BUSINESS, isCurrentlyOpen } from '@/lib/utils'
import { getRecentParts } from '@/lib/firebase/parts-server'
import type { Part } from '@/lib/types/inventory'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Gosnell Used Auto Parts | OEM Used Car & Truck Parts Flat Rock NC | (828) 696-2500',
  description:
    'Family-owned used auto parts yard in Flat Rock, NC. Search live inventory, request parts, and get fast local service across Henderson County and Western NC.',
  alternates: { canonical: '/' },
}

const trustBadges = [
  { icon: Users, label: 'Family Owned' },
  { icon: ShieldCheck, label: 'OEM Parts Only' },
  { icon: Truck, label: 'Local Delivery' },
  { icon: Clock3, label: 'Mon-Thu 8-5, Fri 8-4' },
  { icon: Star, label: 'Google Reviews ★★★★★' },
]

const startCards = [
  {
    title: 'Search Inventory',
    copy: 'Browse our in-house parts inventory, updated as we pull new stock.',
    icon: Search,
    href: '/inventory',
    external: false,
    cta: 'Browse Inventory',
  },
  {
    title: 'Services',
    copy: 'Part pulling, fitment matching, local delivery, and recycling support.',
    icon: Wrench,
    href: '/services',
    external: false,
    cta: 'View Services',
  },
  {
    title: 'Request a Part',
    copy: 'Tell us what you need and we will follow up within one business day.',
    icon: MessageSquare,
    href: '/contact',
    external: false,
    cta: 'Submit Request',
  },
]

const whyChoose = [
  'Over 30 years serving Western North Carolina',
  'Late-model OEM parts, not cheap aftermarket copies',
  'Fast same-day pull and match on many parts',
  'Straight pricing with no hidden fees',
  'Responsible recycling and salvage practices',
  'Real local people answering your call',
]

const galleryItems = [
  { src: '/hendersonville11.jpg', alt: 'Gosnell yard and service area' },
  { src: '/hendersonville.jpg', alt: 'Blue Ridge foothills near Flat Rock location' },
  { src: '/hendersonville11.jpg', alt: 'Inventory yard overview from entrance' },
  { src: '/hendersonville.jpg', alt: 'Western NC service region' },
  { src: '/hendersonville11.jpg', alt: 'Parts yard lanes and storage areas' },
  { src: '/hendersonville.jpg', alt: 'Local roads near Gosnell Used Auto Parts' },
]

const faqs = [
  {
    question: 'Do your parts include a warranty?',
    answer:
      'Many parts include a limited warranty window. Ask our team about warranty terms for your specific part type before purchase.',
  },
  {
    question: 'How quickly can you pull a part?',
    answer:
      'Timing depends on yard volume and part location, but many common requests are handled same day when called in early.',
  },
  {
    question: 'Do you offer local delivery?',
    answer:
      'Yes. We offer local delivery options in Henderson County and nearby areas depending on part size and schedule.',
  },
  {
    question: 'Can you help match parts with VIN?',
    answer:
      'Yes. VIN is one of the best ways to verify compatibility and speed up matching, especially for electrical and trim parts.',
  },
  {
    question: 'Do you buy junk cars?',
    answer:
      'Yes, we purchase select end-of-life vehicles. Call us with year, make, model, and condition for an offer.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'Call us for the latest accepted payment options. We will confirm methods before pickup or delivery.',
  },
]

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export default async function HomePage() {
  const currentlyOpen = isCurrentlyOpen()

  let recentParts: Part[] = []
  try {
    recentParts = await getRecentParts(8)
  } catch {
    // Firebase may not be available during build or if credentials are missing
  }

  return (
    <main id="home" className="bg-slate-100">
      <section className="border-b border-slate-200 bg-slate-900/90 text-center text-xs font-bold tracking-wide text-orange-200">
        <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2">
          <Car className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Mention this website for $10 off your first order.
        </p>
      </section>

      <section className="relative isolate overflow-hidden">
        <Image
          src="/hendersonville11.jpg"
          alt="Gosnell Used Auto Parts service area in Flat Rock, NC"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/65 to-forest-900/70" />

        <div className="relative mx-auto flex min-h-[82vh] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-300/35 bg-orange-500/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-100">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Trusted Local Salvage Yard
          </span>

          <h1 className="mt-6 max-w-4xl font-heading text-4xl font-black leading-[1.03] text-white sm:text-5xl lg:text-6xl">
            Quality OEM Used Auto Parts
            <span className="text-orange-300"> • </span>
            Flat Rock, NC
          </h1>

          <p className="mt-5 max-w-2xl text-base text-slate-200 sm:text-lg">
            Family-owned since the 90s. Late-model cars and trucks. Honest prices, fast local service,
            and real people ready to help you find the right part.
          </p>

          <div className="mt-8 grid max-w-xl gap-3 sm:flex sm:flex-wrap">
            <a
              href={BUSINESS.phones.mainHref}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-base font-black text-white transition-colors hover:bg-orange-400 sm:w-auto"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call {BUSINESS.phones.main}
            </a>
            <Link
              href="/inventory"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-forest-800 px-6 py-3 text-base font-black text-white transition-colors hover:bg-forest-700 sm:w-auto"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Browse Inventory
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-slate-200/40 bg-white/10 px-6 py-3 text-base font-black text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:w-auto"
            >
              Request a Part
            </Link>
          </div>

          <HeroSearch />
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-950 text-slate-100">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          {trustBadges.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm">
              <Icon className="h-4 w-4 shrink-0 text-orange-300" aria-hidden="true" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-forest-200 bg-forest-50 px-4 py-3 text-sm font-semibold text-forest-900 sm:px-6">
          {currentlyOpen ? 'Open now • Speak to a local team member today.' : 'Currently closed • Leave a request and we will call back next business day.'}
        </div>
      </section>

      <section id="start-here" className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-black text-slate-950 sm:text-4xl">Start Here</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {startCards.map((card) => {
            const Icon = card.icon
            return (
              <article key={card.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-forest-50 text-forest-700">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-heading text-xl font-black text-slate-900">{card.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{card.copy}</p>
                {card.external ? (
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-900 hover:bg-slate-100"
                  >
                    {card.cta}
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : (
                  <Link
                    href={card.href}
                    className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-900 hover:bg-slate-100"
                  >
                    {card.cta}
                  </Link>
                )}
              </article>
            )
          })}
        </div>
      </section>

      <section id="about" className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-forest-700">About Us</p>
            <h2 className="mt-3 font-heading text-3xl font-black text-slate-950 sm:text-4xl">
              Reliable local service, not call-center service.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              {BUSINESS.name} serves Flat Rock, Hendersonville, and Western North Carolina with quality
              used OEM parts and straightforward help. We keep it simple: clear answers, fair prices,
              and local people who know the yard.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              Not sure what you need? Call us. We help drivers and repair shops every day with matching,
              pulling, and fast part sourcing.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Main Line</p>
              <p className="mt-2 text-lg font-black text-slate-950">{BUSINESS.phones.main}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Secondary</p>
              <p className="mt-2 text-lg font-black text-slate-950">{BUSINESS.phones.secondary}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Address</p>
              <p className="mt-2 text-base font-bold text-slate-900">{BUSINESS.address.full}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-black text-slate-950 sm:text-4xl">Why Drivers in WNC Choose Gosnell</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {whyChoose.map((item) => (
            <div key={item} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="flex items-start gap-2 text-sm font-medium text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-forest-700" aria-hidden="true" />
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="inventory" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-forest-700">Live Inventory</p>
              <h2 className="mt-3 font-heading text-3xl font-black text-slate-950 sm:text-4xl">Recently Added Parts</h2>
              <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
                Browse our latest stock below, or search the full inventory for exactly what you need.
              </p>
            </div>
            <Link
              href="/inventory"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-orange-400"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              View All Inventory
            </Link>
          </div>

          {recentParts.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recentParts.map((part) => (
                <Link
                  key={part.id}
                  href={`/inventory/${part.id}`}
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] bg-slate-100">
                    {part.photos?.[0] ? (
                      <Image
                        src={part.photos[0]}
                        alt={part.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-400">No photo</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-slate-900 transition-colors group-hover:text-orange-600">
                      {part.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {part.vehicleYear} {part.vehicleMake} {part.vehicleModel}
                    </p>
                    <p className="mt-2 text-lg font-black text-slate-900">{formatPrice(part.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-sm text-slate-600">
                No parts listed yet. Call us at{' '}
                <a href={BUSINESS.phones.mainHref} className="font-bold text-orange-600 hover:text-orange-700">
                  {BUSINESS.phones.main}
                </a>{' '}
                to ask about available stock.
              </p>
            </div>
          )}
        </div>
      </section>

      <JunkCarsCta />

      <section id="request-part" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-forest-700">Request a Part</p>
            <h2 className="mt-3 font-heading text-3xl font-black text-slate-950 sm:text-4xl">
              Tell us what you need. We will do the legwork.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              This is our #1 conversion tool and fastest way to quote accurately. Share vehicle details,
              part type, and urgency. Our team responds within one business day.
            </p>
            <div className="mt-5 rounded-xl border border-forest-200 bg-forest-50 p-4 text-sm font-semibold text-forest-900">
              Need urgent help? Call {BUSINESS.phones.main} now.
            </div>
          </div>

          <RequestPartForm />
        </div>
      </section>

      <section id="gallery" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-black text-slate-950 sm:text-4xl">Gallery</h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
            Local yard, local team, local service. We are continually adding new photos of inventory and operations.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((item, index) => (
              <div key={`${item.src}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      <section id="location" className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="font-heading text-3xl font-black text-slate-950 sm:text-4xl">Location & Hours</h2>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">Visit us at {BUSINESS.address.full}</p>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-heading text-lg font-black text-slate-900">Business Hours</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li className="flex justify-between"><span>Monday-Thursday</span><span>8:00 AM-5:00 PM</span></li>
                <li className="flex justify-between"><span>Friday</span><span>8:00 AM-4:00 PM</span></li>
                <li className="flex justify-between"><span>Saturday-Sunday</span><span>Closed</span></li>
              </ul>
            </div>

            <div className="mt-5 grid gap-3 sm:flex sm:flex-wrap">
              <a
                href="https://maps.google.com/?q=110+Tabor+Road+Extension,+Flat+Rock,+NC+28731"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-forest-800 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-forest-700 sm:w-auto"
              >
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Get Directions
              </a>
              <a
                href={BUSINESS.phones.mainHref}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-900 transition-colors hover:bg-slate-100 sm:w-auto"
              >
                Call Front Desk
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <iframe
              title="Gosnell Used Auto Parts map"
              src="https://maps.google.com/maps?q=110+Tabor+Road+Extension,+Flat+Rock,+NC+28731&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="h-[360px] w-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-black text-slate-950 sm:text-4xl">FAQ</h2>
        <div className="mt-6 space-y-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer list-none text-sm font-black text-slate-900">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-950 text-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-center sm:flex-row sm:text-left sm:px-6 lg:px-8">
          <p className="text-sm">Need help now? A local person can help in minutes.</p>
          <a href={BUSINESS.phones.mainHref} className="inline-flex min-h-11 items-center rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-black text-white hover:bg-orange-400">
            Call {BUSINESS.phones.main}
          </a>
        </div>
      </section>
    </main>
  )
}
