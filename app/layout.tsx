import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gosnellusedautoparts.com'
const socialImage = '/og-image.svg'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Gosnell Used Auto Parts | Flat Rock, NC',
    template: '%s | Gosnell Used Auto Parts',
  },
  description:
    'Family-owned used auto parts yard in Flat Rock, NC. Quality used OEM parts, honest pricing, and local service for Henderson County and Western NC.',
  keywords: [
    'used auto parts',
    'salvage yard Flat Rock',
    'Hendersonville used auto parts',
    'Asheville used parts',
    'OEM used parts NC',
    'Gosnell Used Auto Parts',
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Gosnell Used Auto Parts',
    title: 'Gosnell Used Auto Parts | Flat Rock, NC',
    description:
      'Used OEM parts, friendly service, and fast help from a family-owned salvage yard in Flat Rock.',
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: 'Gosnell Used Auto Parts in Flat Rock, North Carolina',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gosnell Used Auto Parts | Flat Rock, NC',
    description: 'Family-owned salvage yard serving Henderson County and Western NC.',
    images: [socialImage],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f5132',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'AutoPartsStore'],
  name: 'Gosnell Used Auto Parts',
  url: siteUrl,
  telephone: ['(828) 696-2500', '(828) 696-2719'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: '110 Tabor Road Extension',
    addressLocality: 'Flat Rock',
    addressRegion: 'NC',
    postalCode: '28731',
    addressCountry: 'US',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '08:00',
      closes: '17:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Friday'],
      opens: '08:00',
      closes: '16:00',
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased">
        <SiteHeader />
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  )
}
