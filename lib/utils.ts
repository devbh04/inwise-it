import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type CookieOptions = {
  maxAgeSeconds?: number
  path?: string
  sameSite?: "Lax" | "Strict" | "None"
  secure?: boolean
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const encodedName = `${encodeURIComponent(name)}=`
  const cookies = document.cookie ? document.cookie.split("; ") : []
  for (const cookie of cookies) {
    if (cookie.startsWith(encodedName)) {
      return decodeURIComponent(cookie.slice(encodedName.length))
    }
  }
  return null
}

export function setCookie(name: string, value: string, options: CookieOptions = {}) {
  if (typeof document === "undefined") return
  const path = options.path ?? "/"
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=${path}`
  if (options.maxAgeSeconds !== undefined) {
    cookie += `; max-age=${options.maxAgeSeconds}`
  }
  if (options.sameSite) {
    cookie += `; samesite=${options.sameSite}`
  }
  if (options.secure) {
    cookie += "; secure"
  }
  document.cookie = cookie
}

const GUEST_DOWNLOAD_COOKIE = "guest_downloads"
export const GUEST_DOWNLOAD_LIMIT = 5

export function getGuestDownloadCount(): number {
  const raw = getCookie(GUEST_DOWNLOAD_COOKIE)
  const parsed = raw ? Number.parseInt(raw, 10) : 0
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
}

export function setGuestDownloadCount(count: number) {
  const safeCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0
  setCookie(GUEST_DOWNLOAD_COOKIE, String(safeCount), {
    maxAgeSeconds: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "Lax",
  })
}
