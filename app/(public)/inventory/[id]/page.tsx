import type { Metadata } from 'next'
import { PartDetail } from '@/components/part-detail'

export const metadata: Metadata = {
  title: 'Part Details',
  description: 'View part details at Gosnell Used Auto Parts in Flat Rock, NC.',
  alternates: { canonical: '/inventory' },
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PartDetailPage({ params }: PageProps) {
  const { id } = await params

  return (
    <main className="min-h-screen">
      <PartDetail partId={id} />
    </main>
  )
}
