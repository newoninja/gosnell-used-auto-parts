import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const BUSINESS = {
  name: 'Gosnell Used Auto Parts',
  shortName: "Gosnell's",
  tagline: 'Quality Used Parts from the Blue Ridge Mountains',
  taglineAlt: 'Mountain-Tough Salvage – Honest Prices, Fast Service',
  address: {
    street: '110 Tabor Road Extension',
    city: 'Flat Rock',
    state: 'NC',
    zip: '28731',
    full: '110 Tabor Road Extension, Flat Rock, NC 28731',
  },
  phones: {
    main: '(828) 696-2500',
    mainHref: 'tel:+18286962500',
    secondary: '(828) 696-2719',
    secondaryHref: 'tel:+18286962719',
    fax: '(828) 698-3350',
  },
  hours: [
    { days: 'Monday – Thursday', open: '8:00 AM', close: '5:00 PM', isOpen: true },
    { days: 'Friday', open: '8:00 AM', close: '4:00 PM', isOpen: true },
    { days: 'Saturday', open: null, close: null, isOpen: false },
    { days: 'Sunday', open: null, close: null, isOpen: false },
  ],
  inventory: 'https://trade3466.car-part.com/',
  timeZone: 'America/New_York',
  coordinates: { lat: 35.2715, lng: -82.4546 },
  social: {
    yelp: 'https://www.yelp.com/biz/gosnell-used-auto-parts-flat-rock',
  },
  staff: ['Greg', 'Rodney', 'Dustin'],
} as const

const WEEKDAY_TO_NUMBER: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
}

function getTimePartsInZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const weekday = parts.find((part) => part.type === 'weekday')?.value
  const hour = Number(parts.find((part) => part.type === 'hour')?.value)
  const minute = Number(parts.find((part) => part.type === 'minute')?.value)

  if (!weekday || Number.isNaN(hour) || Number.isNaN(minute)) {
    throw new Error(`Unable to derive local time for timezone: ${timeZone}`)
  }

  return { day: WEEKDAY_TO_NUMBER[weekday], hour, minute }
}

export function isCurrentlyOpenAt(date: Date, timeZone = BUSINESS.timeZone): boolean {
  const { day, hour, minute } = getTimePartsInZone(date, timeZone)
  const timeMinutes = hour * 60 + minute

  if (day === 0 || day === 6) return false // Closed Sat & Sun
  const openTime = 8 * 60 // 8:00 AM
  const closeTime = day === 5 ? 16 * 60 : 17 * 60 // 4 PM Fri, 5 PM Mon–Thu

  return timeMinutes >= openTime && timeMinutes < closeTime
}

export function isCurrentlyOpen(): boolean {
  return isCurrentlyOpenAt(new Date(), BUSINESS.timeZone)
}
