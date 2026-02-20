'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion'
import {
  Send,
  Phone,
  CheckCircle2,
  Loader2,
  User,
  Mail,
  MessageSquare,
  Paperclip,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { isSupportedContactEndpoint } from '@/lib/contact'
import { BUSINESS } from '@/lib/utils'

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  phone: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  vehicleYear: z.string().optional(),
  vehicleMake: z.string().optional(),
  vehicleModel: z.string().optional(),
  partNeeded: z.string().min(3, 'Please describe the part you need'),
  message: z.string().optional(),
})

type ContactFormData = z.infer<typeof contactSchema>

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 35 }, (_, i) => String(currentYear - i))

// ─── Confetti burst ───────────────────────────────────────────────────────────
function ConfettiParticle({ delay, prefersReduced }: { delay: number; prefersReduced: boolean }) {
  const colors = ['#f97316', '#0f5132', '#f8fafc', '#fb923c', '#34d399', '#fbbf24']
  const color = colors[Math.floor(Math.random() * colors.length)]
  const startX = Math.random() * 100
  const endX = startX + (Math.random() - 0.5) * 60
  const rotate = Math.random() * 720 - 360
  const size = Math.random() * 8 + 4

  if (prefersReduced) return null

  return (
    <motion.span
      className="pointer-events-none fixed rounded-sm"
      style={{
        left: `${startX}vw`,
        top: '-5vh',
        width: size,
        height: size * 0.6,
        background: color,
        zIndex: 999,
      }}
      initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
      animate={{ y: '115vh', x: `${endX - startX}vw`, rotate, opacity: [1, 1, 0] }}
      transition={{
        duration: 1.8 + Math.random() * 1.2,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      aria-hidden="true"
    />
  )
}

function ConfettiBurst({ prefersReduced }: { prefersReduced: boolean }) {
  if (prefersReduced) return null
  return (
    <>
      {Array.from({ length: 45 }, (_, i) => (
        <ConfettiParticle key={i} delay={i * 0.025} prefersReduced={prefersReduced} />
      ))}
    </>
  )
}

// ─── Animated label input ────────────────────────────────────────────────────
function AnimatedField({
  id,
  label,
  children,
  error,
  prefersReduced,
}: {
  id: string
  label: string
  children: React.ReactNode
  error?: string
  prefersReduced: boolean
}) {
  return (
    <motion.div
      initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
      >
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            id={`${id}-error`}
            className="mt-1 text-xs text-red-500 overflow-hidden"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function ContactForm({ showHeader = true }: { showHeader?: boolean }) {
  const prefersReduced = useReducedMotion()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) })

  async function onSubmit(data: ContactFormData) {
    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT
    if (!isSupportedContactEndpoint(endpoint)) {
      setStatus('error')
      setErrorMessage('Online form is temporarily unavailable. Please call')
      return
    }

    setErrorMessage(null)
    setStatus('loading')

    try {
      const body = new FormData()
      Object.entries(data).forEach(([k, v]) => {
        if (v) body.append(k, v)
      })
      if (uploadedFile) body.append('photo', uploadedFile)

      const res = await fetch(endpoint, {
        method: 'POST',
        body,
        headers: { Accept: 'application/json' },
      })

      if (!res.ok) throw new Error(`Contact submit failed with status ${res.status}`)

      setStatus('success')
      setShowConfetti(true)
      reset()
      setUploadedFile(null)
      setFileError(null)
      setTimeout(() => setShowConfetti(false), 3800)
    } catch {
      setStatus('error')
      setErrorMessage("We couldn't send your request. Please call")
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFileError('Max file size is 5MB.')
        setUploadedFile(null)
        e.target.value = ''
        return
      }
      setFileError(null)
      setUploadedFile(file)
    }
  }

  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={prefersReduced ? { duration: 0.3 } : { duration: 0.4, ease: 'easeOut' }}
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-slate-50"
      aria-label="Part request form"
    >
      {showConfetti && <ConfettiBurst prefersReduced={!!prefersReduced} />}

      <div className="absolute left-0 top-1/3 h-64 w-64 rounded-full bg-forest-50 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl">
        {showHeader && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm font-semibold text-orange-600 mb-4">
              <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
              Get In Touch
            </div>
            <h2 id="contact-heading" className="font-heading text-4xl font-black text-slate-900 sm:text-5xl">
              Request a <span className="gradient-text-orange">Part</span>
            </h2>
            <p className="mt-4 text-slate-500 max-w-xl mx-auto">
              Fill out the form and our team will get back to you within 24 hours.
              Or just call — it&apos;s faster!
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={prefersReduced ? { duration: 0.3 } : { type: 'spring', stiffness: 90, damping: 18 }}
            className="lg:col-span-3"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="flex flex-col items-center text-center py-12 gap-4"
                    role="alert"
                  >
                    {/* Animated checkmark */}
                    <div className="relative flex h-20 w-20 items-center justify-center">
                      <motion.div
                        className="absolute inset-0 rounded-full bg-green-100 border border-green-200"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                      />
                      <motion.div
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.3, ease: 'easeInOut' }}
                      >
                        <CheckCircle2 className="h-10 w-10 text-green-600" aria-hidden="true" />
                      </motion.div>
                    </div>
                    <motion.h3
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="font-heading text-2xl font-bold text-slate-900"
                    >
                      Request Sent!
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-slate-500 max-w-sm"
                    >
                      Thanks! Greg, Rodney, or Dustin will respond within 24 hours. Need faster?{' '}
                      <a href={BUSINESS.phones.mainHref} className="text-orange-500 font-semibold">
                        Call {BUSINESS.phones.main}
                      </a>
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Button
                        onClick={() => {
                          setStatus('idle')
                          setErrorMessage(null)
                        }}
                        variant="outline"
                        className="mt-2 border-slate-200 hover:border-slate-300"
                      >
                        Send Another Request
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                    noValidate
                    aria-label="Part request contact form"
                  >
                    {/* Name + Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <AnimatedField id="name" label="Your Name *" error={errors.name?.message} prefersReduced={!!prefersReduced}>
                        <div className="relative">
                          <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
                          <Input
                            id="name"
                            placeholder="John Smith"
                            className="pl-9"
                            aria-describedby={errors.name ? 'name-error' : undefined}
                            {...register('name')}
                          />
                        </div>
                      </AnimatedField>
                      <AnimatedField id="phone" label="Phone Number" prefersReduced={!!prefersReduced}>
                        <div className="relative">
                          <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(828) 555-0000"
                            className="pl-9"
                            {...register('phone')}
                          />
                        </div>
                      </AnimatedField>
                    </div>

                    {/* Email */}
                    <AnimatedField id="email" label="Email Address *" error={errors.email?.message} prefersReduced={!!prefersReduced}>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-9"
                          aria-describedby={errors.email ? 'email-error' : undefined}
                          {...register('email')}
                        />
                      </div>
                    </AnimatedField>

                    {/* Vehicle info */}
                    <AnimatedField id="vehicle" label="Vehicle Information" prefersReduced={!!prefersReduced}>
                      <fieldset>
                        <legend className="sr-only">Vehicle Year, Make, and Model</legend>
                        <div className="grid grid-cols-3 gap-3">
                          <select
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
                            aria-label="Vehicle year"
                            {...register('vehicleYear')}
                          >
                            <option value="">Year</option>
                            {years.map((y) => <option key={y} value={y}>{y}</option>)}
                          </select>
                          <Input placeholder="Make (e.g. Ford)" aria-label="Vehicle make" {...register('vehicleMake')} />
                          <Input placeholder="Model" aria-label="Vehicle model" {...register('vehicleModel')} />
                        </div>
                      </fieldset>
                    </AnimatedField>

                    {/* Part needed */}
                    <AnimatedField id="partNeeded" label="Part Needed *" error={errors.partNeeded?.message} prefersReduced={!!prefersReduced}>
                      <Input
                        id="partNeeded"
                        placeholder="e.g. Driver's side door, alternator, radiator..."
                        aria-describedby={errors.partNeeded ? 'partNeeded-error' : undefined}
                        {...register('partNeeded')}
                      />
                    </AnimatedField>

                    {/* Message */}
                    <AnimatedField id="message" label="Additional Notes" prefersReduced={!!prefersReduced}>
                      <Textarea
                        id="message"
                        placeholder="Any additional details — color, condition needed, deadline..."
                        {...register('message')}
                      />
                    </AnimatedField>

                    {/* File upload */}
                    <AnimatedField id="photo" label="Photo of Part (optional)" prefersReduced={!!prefersReduced}>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFile}
                        className="sr-only"
                        id="photo-upload"
                        aria-label="Upload a photo of the part you need"
                      />
                      <div className="flex items-center gap-3">
                        <motion.button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          whileHover={prefersReduced ? {} : { borderColor: 'rgba(249,115,22,0.4)' }}
                          whileTap={prefersReduced ? {} : { scale: 0.97 }}
                          className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                        >
                          <Paperclip className="h-4 w-4" aria-hidden="true" />
                          {uploadedFile ? uploadedFile.name : 'Choose photo...'}
                        </motion.button>
                        <AnimatePresence>
                          {uploadedFile && (
                            <motion.button
                              type="button"
                              initial={{ opacity: 0, scale: 0.7 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.7 }}
                              onClick={() => setUploadedFile(null)}
                              className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                              aria-label="Remove uploaded file"
                            >
                              <X className="h-4 w-4" aria-hidden="true" />
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">Max 5MB · JPG, PNG, HEIC</p>
                      {fileError && (
                        <p className="mt-1 text-xs text-red-500" role="alert">
                          {fileError}
                        </p>
                      )}
                    </AnimatedField>

                    {/* Error */}
                    <AnimatePresence>
                      {status === 'error' && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 overflow-hidden"
                          role="alert"
                        >
                          {errorMessage || 'Something went wrong. Call'}{' '}
                          <a href={BUSINESS.phones.mainHref} className="font-semibold underline">
                            {BUSINESS.phones.main}
                          </a>
                          .
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <motion.div
                      whileHover={prefersReduced ? {} : { scale: 1.01 }}
                      whileTap={prefersReduced ? {} : { scale: 0.97 }}
                    >
                      <Button
                        type="submit"
                        size="lg"
                        disabled={status === 'loading'}
                        className="w-full relative overflow-hidden bg-orange-500 hover:bg-orange-400 text-white font-black shadow-md hover:shadow-orange-300/40 transition-all duration-300 disabled:opacity-70"
                      >
                        {/* Shimmer on idle */}
                        {status === 'idle' && !prefersReduced && (
                          <motion.span
                            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                            animate={{ x: ['-110%', '110%'] }}
                            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
                            aria-hidden="true"
                          />
                        )}
                        {status === 'loading' ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" aria-hidden="true" />
                            Send Part Request
                          </>
                        )}
                      </Button>
                    </motion.div>

                    <p className="text-center text-xs text-slate-400">
                      We typically respond within 24 hours during business hours.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={prefersReduced ? { duration: 0.3 } : { type: 'spring', stiffness: 90, damping: 18, delay: 0.1 }}
            className="lg:col-span-2 space-y-5"
          >
            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6">
              <h3 className="font-heading font-bold text-slate-900 text-lg mb-1">Prefer to Call?</h3>
              <p className="text-sm text-slate-500 mb-4">Phone calls get the fastest response.</p>
              <div className="space-y-2">
                <motion.a
                  href={BUSINESS.phones.mainHref}
                  whileHover={prefersReduced ? {} : { scale: 1.02, y: -1 }}
                  whileTap={prefersReduced ? {} : { scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="flex items-center gap-3 rounded-xl bg-orange-500 hover:bg-orange-400 px-4 py-3 text-white font-bold transition-colors shadow-sm"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {BUSINESS.phones.main}
                  <span className="ml-auto text-xs text-orange-100">Main</span>
                </motion.a>
                <a
                  href={BUSINESS.phones.secondaryHref}
                  className="flex items-center gap-3 rounded-xl border border-orange-200 hover:border-orange-300 bg-white px-4 py-3 text-orange-600 font-semibold transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {BUSINESS.phones.secondary}
                  <span className="ml-auto text-xs text-slate-400">Secondary</span>
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-heading font-bold text-slate-900 text-base mb-3">When to Call</h3>
              <div className="space-y-2 text-sm">
                {[
                  { days: 'Mon – Thu', hours: '8:00 AM – 5:00 PM' },
                  { days: 'Friday', hours: '8:00 AM – 4:00 PM' },
                  { days: 'Sat – Sun', hours: 'Closed', closed: true },
                ].map((h) => (
                  <div key={h.days} className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0">
                    <span className={h.closed ? 'text-slate-400' : 'text-slate-700'}>{h.days}</span>
                    <span className={h.closed ? 'text-slate-300 text-xs' : 'font-mono text-forest-700 text-xs'}>{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-heading font-bold text-slate-900 text-base mb-3">Visit in Person</h3>
              <address className="not-italic text-sm text-slate-600 leading-relaxed">
                110 Tabor Road Extension<br />
                Flat Rock, NC 28731
              </address>
              <a
                href="https://maps.google.com/?q=110+Tabor+Road+Extension+Flat+Rock+NC+28731"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600 transition-colors"
              >
                Get directions →
              </a>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500 leading-relaxed">
              <strong className="text-slate-700 block mb-1">Pro Tip:</strong>
              Have your vehicle's VIN ready when you call — it helps us find the exact match.
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
