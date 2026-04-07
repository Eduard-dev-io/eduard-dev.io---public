import { supabase } from './supabase'

const LOGS_TABLE = 'logs-eduarddev'
const SESSION_KEY = 'eduard-dev-session-id'

function safeStorageGet(storage, key) {
  try {
    return storage.getItem(key)
  } catch {
    return null
  }
}

function safeStorageSet(storage, key, value) {
  try {
    storage.setItem(key, value)
  } catch {
    // Ignore storage write failures in private/restricted browsing contexts.
  }
}

function getOrCreateSessionId() {
  const existing = safeStorageGet(window.localStorage, SESSION_KEY)
  if (existing) {
    return existing
  }

  const id = crypto.randomUUID()
  safeStorageSet(window.localStorage, SESSION_KEY, id)
  return id
}

function detectDeviceType() {
  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

function detectBrowser(userAgent) {
  if (userAgent.includes('Edg/')) return 'edge'
  if (userAgent.includes('Chrome/')) return 'chrome'
  if (userAgent.includes('Safari/') && !userAgent.includes('Chrome/')) return 'safari'
  if (userAgent.includes('Firefox/')) return 'firefox'
  return 'other'
}

function detectOS(userAgent) {
  if (userAgent.includes('Windows')) return 'windows'
  if (userAgent.includes('Mac OS')) return 'macos'
  if (userAgent.includes('Android')) return 'android'
  if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'ios'
  if (userAgent.includes('Linux')) return 'linux'
  return 'other'
}

function readAttributionValue(searchParams, lowercaseKey, uppercaseKey) {
  return (
    searchParams.get(lowercaseKey) ??
    searchParams.get(uppercaseKey) ??
    safeStorageGet(window.localStorage, uppercaseKey) ??
    null
  )
}

function getAttribution(searchParams) {
  return {
    utm_source: readAttributionValue(searchParams, 'utm_source', 'UTM_SOURCE'),
    utm_medium: readAttributionValue(searchParams, 'utm_medium', 'UTM_MEDIUM'),
    utm_campaign: readAttributionValue(searchParams, 'utm_campaign', 'UTM_CAMPAIGN'),
    utm_term: readAttributionValue(searchParams, 'utm_term', 'UTM_TERM'),
    utm_content: readAttributionValue(searchParams, 'utm_content', 'UTM_CONTENT'),
    recruiter_name: safeStorageGet(window.localStorage, 'UTM_NAME'),
    recruiter_company: safeStorageGet(window.localStorage, 'UTM_COMPANY'),
    recruiter_industry: safeStorageGet(window.localStorage, 'UTM_INDUSTRY'),
  }
}

export async function logEduardDevEvent({
  eventName,
  eventType = eventName,
  pageUrl = null,
  pagePath = null,
  referrer = null,
  metadata = {},
}) {
  if (!supabase || typeof window === 'undefined') {
    return
  }

  const searchParams = new URLSearchParams(window.location.search)
  const attribution = getAttribution(searchParams)
  const userAgent = navigator.userAgent

  const payload = {
    session_id: getOrCreateSessionId(),
    event_name: eventName,
    event_type: eventType,
    occurred_at: new Date().toISOString(),
    page_url: pageUrl ?? window.location.href,
    page_path: pagePath ?? `${window.location.pathname}${window.location.search}`,
    referrer: referrer ?? document.referrer ?? null,
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    utm_term: attribution.utm_term,
    utm_content: attribution.utm_content,
    device_type: detectDeviceType(),
    browser: detectBrowser(userAgent),
    os: detectOS(userAgent),
    viewport_width: window.innerWidth || null,
    viewport_height: window.innerHeight || null,
    language: navigator.language || null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
    user_agent: userAgent,
    metadata: {
      site: 'eduard-dev.io',
      recruiter_name: attribution.recruiter_name,
      recruiter_company: attribution.recruiter_company,
      recruiter_industry: attribution.recruiter_industry,
      ...metadata,
    },
  }

  const { error } = await supabase.from(LOGS_TABLE).insert([payload])
  if (error && import.meta.env.DEV) {
    console.warn('Eduard.dev log insert failed:', error.message)
  }
}
