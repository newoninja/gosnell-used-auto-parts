'use client'

import { useCallback, useRef, useState } from 'react'
import { X, Upload, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  images: string[]
  onAdd: (files: File[]) => void
  onRemove: (index: number) => void
  uploading?: boolean
  maxImages?: number
}

const MAX_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

export function ImageUpload({
  images,
  onAdd,
  onRemove,
  uploading = false,
  maxImages = 6,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')

  const canAdd = images.length < maxImages

  const validateAndAdd = useCallback(
    (files: FileList | File[]) => {
      setError('')
      const validFiles: File[] = []
      const remaining = maxImages - images.length

      for (const file of Array.from(files).slice(0, remaining)) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          setError('Only JPEG, PNG, WebP, and HEIC images are allowed')
          continue
        }
        if (file.size > MAX_SIZE) {
          setError('Images must be under 10MB')
          continue
        }
        validFiles.push(file)
      }

      if (validFiles.length > 0) {
        onAdd(validFiles)
      }
    },
    [images.length, maxImages, onAdd]
  )

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragActive(false)
    if (canAdd && e.dataTransfer.files.length > 0) {
      validateAndAdd(e.dataTransfer.files)
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragActive(true)
  }

  function handleDragLeave() {
    setDragActive(false)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAdd(e.target.files)
      e.target.value = ''
    }
  }

  return (
    <div>
      {/* Preview grid */}
      {images.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {images.map((src, i) => (
            <div key={src} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              <img src={src} alt={`Part photo ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label={`Remove photo ${i + 1}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      {canAdd && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
            dragActive
              ? 'border-orange-400 bg-orange-50'
              : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'
          )}
        >
          <Upload className="mb-2 h-6 w-6 text-slate-400" />
          <p className="text-sm font-medium text-slate-600">
            {uploading ? 'Uploading...' : 'Drop photos here or click to upload'}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {images.length}/{maxImages} photos &middot; Max 10MB each
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Mobile camera button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              const cameraInput = document.createElement('input')
              cameraInput.type = 'file'
              cameraInput.accept = 'image/*'
              cameraInput.capture = 'environment'
              cameraInput.onchange = (ev) => {
                const target = ev.target as HTMLInputElement
                if (target.files) validateAndAdd(target.files)
              }
              cameraInput.click()
            }}
            className="mt-3 flex items-center gap-1.5 text-xs font-medium text-orange-600 hover:text-orange-700 md:hidden"
          >
            <Camera className="h-4 w-4" />
            Take Photo
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  )
}
