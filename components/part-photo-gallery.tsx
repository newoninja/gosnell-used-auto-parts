'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface PartPhotoGalleryProps {
  photos: string[]
  partName: string
}

export function PartPhotoGallery({ photos, partName }: PartPhotoGalleryProps) {
  const [selected, setSelected] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <>
      {/* Main image */}
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 cursor-zoom-in"
      >
        <Image
          src={photos[selected]}
          alt={`${partName} — photo ${selected + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </button>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {photos.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setSelected(i)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                i === selected ? 'border-orange-500' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Image
                src={src}
                alt={`${partName} — thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="h-5 w-5" />
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setSelected((s) => (s > 0 ? s - 1 : photos.length - 1))}
                className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setSelected((s) => (s < photos.length - 1 ? s + 1 : 0))}
                className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Next photo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <div className="relative mx-auto h-[80vh] w-[90vw] max-w-4xl">
            <Image
              src={photos[selected]}
              alt={`${partName} — photo ${selected + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {photos.length > 1 && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/60">
              {selected + 1} / {photos.length}
            </p>
          )}
        </div>
      )}
    </>
  )
}
