import type { MetadataRoute } from 'next'
import { getAllPartIds } from '@/lib/firebase/parts-server'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gosnellautoparts.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/inventory`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Add dynamic inventory part pages
  let partPages: MetadataRoute.Sitemap = []
  try {
    const partIds = await getAllPartIds()
    partPages = partIds.map((id) => ({
      url: `${siteUrl}/inventory/${id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  } catch {
    // Firestore may not be available during build — skip dynamic pages
  }

  return [...staticPages, ...partPages]
}
