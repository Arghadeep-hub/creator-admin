/** Set a cookie. If `days` is omitted the cookie is session-scoped. */
export function setCookie(name: string, value: string, days?: number): void {
  let expires = ''
  if (days !== undefined) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = `; expires=${date.toUTCString()}`
  }
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Strict${secure}`
}

export function getCookie(name: string): string | null {
  const key = `${name}=`
  for (const part of document.cookie.split('; ')) {
    if (part.startsWith(key)) {
      return decodeURIComponent(part.slice(key.length))
    }
  }
  return null
}

export function removeCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`
}
