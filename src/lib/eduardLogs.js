import { supabase } from './supabase'

const LOG_SESSION_RPC = 'log_eduarddev_session_event'
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

function normalizeChatTurn(chatTurn) {
  if (!chatTurn || typeof chatTurn !== 'object') {
    return null
  }

  const role = typeof chatTurn.role === 'string' ? chatTurn.role : null
  const content = typeof chatTurn.content === 'string' ? chatTurn.content : null
  const source = typeof chatTurn.source === 'string' ? chatTurn.source : null

  if (!role || !content) {
    return null
  }

  return {
    role,
    content,
    source,
    occurred_at: new Date().toISOString(),
  }
}

export async function logEduardDevEvent({
  eventName,
  eventType = eventName,
  pageUrl = null,
  pagePath = null,
  referrer = null,
  metadata = {},
  chatTurn = null,
}) {
  if (!supabase || typeof window === 'undefined') {
    return
  }

  const searchParams = new URLSearchParams(window.location.search)
  const attribution = getAttribution(searchParams)
  const userAgent = navigator.userAgent
  const occurredAt = new Date().toISOString()

  const { error } = await supabase.rpc(LOG_SESSION_RPC, {
    p_session_id: getOrCreateSessionId(),
    p_event_name: eventName,
    p_event_type: eventType,
    p_occurred_at: occurredAt,
    p_page_url: pageUrl ?? window.location.href,
    p_page_path: pagePath ?? `${window.location.pathname}${window.location.search}`,
    p_referrer: referrer ?? document.referrer ?? null,
    p_utm_source: attribution.utm_source,
    p_utm_medium: attribution.utm_medium,
    p_utm_campaign: attribution.utm_campaign,
    p_utm_term: attribution.utm_term,
    p_utm_content: attribution.utm_content,
    p_device_type: detectDeviceType(),
    p_browser: detectBrowser(userAgent),
    p_os: detectOS(userAgent),
    p_viewport_width: window.innerWidth || null,
    p_viewport_height: window.innerHeight || null,
    p_language: navigator.language || null,
    p_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
    p_user_agent: userAgent,
    p_metadata: {
      site: 'eduard-dev.io',
      recruiter_name: attribution.recruiter_name,
      recruiter_company: attribution.recruiter_company,
      recruiter_industry: attribution.recruiter_industry,
      ...metadata,
    },
    p_chat_turn: normalizeChatTurn(chatTurn),
  })

  if (error && import.meta.env.DEV) {
    console.warn('Eduard.dev log insert failed:', error.message)
  }
}
