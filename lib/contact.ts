export function isSupportedContactEndpoint(endpoint?: string): endpoint is string {
  if (!endpoint) return false

  try {
    const parsed = new URL(endpoint)
    const isHttp = parsed.protocol === 'http:' || parsed.protocol === 'https:'
    const isFormspree = parsed.hostname === 'formspree.io' || parsed.hostname.endsWith('.formspree.io')
    return isHttp && isFormspree
  } catch {
    return false
  }
}
