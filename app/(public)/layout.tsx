import { Analytics } from '@vercel/analytics/react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { MobileCallButton } from '@/components/mobile-call-button'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <MobileCallButton />
      <SiteFooter />
      <Analytics />
    </>
  )
}
