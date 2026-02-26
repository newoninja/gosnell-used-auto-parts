'use client'

import { useCallback, useRef, useState } from 'react'
import { X, Upload, Camera, Loader2 } from 'lucide-react'
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

  function openCamera() {
    const cameraInput = document.createElement('input')
    cameraInput.type = 'file'
    cameraInput.accept = 'image/*'
    cameraInput.capture = 'environment'
    cameraInput.onchange = (ev) => {
      const target = ev.target as HTMLInputElement
      if (target.files) validateAndAdd(target.files)
    }
    cameraInput.click()
  }

  return (
    <div>
      {/* Preview grid — bigger on mobile */}
      {images.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-2">
          {images.map((src, i) => (
            <div key={src} className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <img src={src} alt={`Part photo ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition-opacity md:opacity-0 md:group-hover:opacity-100"
                aria-label={`Remove photo ${i + 1}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload buttons */}
      {canAdd && (
        <>
          {uploading ? (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 p-6">
              <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
              <span className="text-sm font-medium text-orange-700">Uploading...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
              {/* Camera button — primary on mobile */}
              <button
                type="button"
                onClick={openCamera}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 p-6 text-center transition-colors hover:border-orange-400 hover:bg-orange-100 active:bg-orange-100 sm:hidden"
              >
                <Camera className="h-8 w-8 text-orange-500" />
                <span className="text-sm font-bold text-orange-700">Take Photo</span>
              </button>

              {/* File picker */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => inputRef.current?.click()}
                className={cn(
                  'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors',
                  dragActive
                    ? 'border-orange-400 bg-orange-50'
                    : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'
                )}
              >
                <Upload className="mb-2 h-6 w-6 text-slate-400" />
                <p className="text-sm font-medium text-slate-600">
                  <span className="hidden sm:inline">Drop photos here or click to upload</span>
                  <span className="sm:hidden">Choose Photos</span>
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {images.length}/{maxImages} &middot; Max 10MB each
                </p>

                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Camera on desktop — smaller link */}
              <button
                type="button"
                onClick={openCamera}
                className="mt-2 hidden items-center justify-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 sm:inline-flex"
              >
                <Camera className="h-4 w-4" />
                Or take a photo with camera
              </button>
            </div>
          )}
        </>
      )}

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  )
}
