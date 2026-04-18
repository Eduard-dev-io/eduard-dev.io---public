import { supabase } from './supabase'

const FALLBACK_PROJECTS = [
  {
    id: 'say-i-do-weddings',
    slug: 'say-i-do-weddings',
    title: 'Say I Do Weddings',
    category: 'Wedding · Web Design',
    industry: 'Luxury Events',
    image: '/projects/SayIDoWeddings - Home.webp',
    beforeImage: null,
    brandColor: '#f6c7c1',
    description:
      'A romantic, conversion-focused site for a UK wedding planner. Designed to feel premium quickly and support higher-value enquiries.',
    summary:
      'Designed to feel more refined, reassure quickly, and support higher-value enquiries.',
    highlights: ['Mobile First', 'SEO Ready', 'Booking Integrated'],
    liveUrl: null,
    caseStudy:
      'We rebuilt the presentation around trust, polish, and enquiry clarity so the brand felt more premium from the first scroll.',
    featured: true,
    published: true,
    sortOrder: 1,
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'the-memory-corners',
    slug: 'the-memory-corners',
    title: 'The Memory Corners',
    category: 'Events · Booking Site',
    industry: 'Experiential Brand',
    image: '/projects/TheMemoryCorner - Home.webp',
    beforeImage: null,
    brandColor: '#57d6c4',
    description:
      'A polished site for a photo booth company with online booking flows, event galleries, and a layout built to convert busy visitors fast.',
    summary:
      'Upgraded visual confidence and offer presentation for a more polished buyer journey.',
    highlights: ['Online Booking', 'Gallery Ready', 'Event Focused'],
    liveUrl: null,
    caseStudy:
      'The project focused on making the offer easier to understand at speed while keeping the experience warm, visual, and event-led.',
    featured: false,
    published: true,
    sortOrder: 2,
    createdAt: '2025-01-02T00:00:00.000Z',
  },
  {
    id: 'txengo',
    slug: 'txengo',
    title: 'Txengo',
    category: 'Creative · Portfolio',
    industry: 'Creative Consultant',
    image: '/projects/Txengo - Home.webp',
    beforeImage: null,
    brandColor: '#ff5f8f',
    description:
      'A bold creative portfolio with punchy visuals, structured storytelling, and smooth motion that keeps the work front and centre.',
    summary:
      'Editorial storytelling and premium pacing to make the portfolio feel more ownable and valuable.',
    highlights: ['Bold Visuals', 'Motion Led', 'Grid Layout'],
    liveUrl: null,
    caseStudy:
      'We leaned into editorial rhythm and stronger story framing so the work felt sharper, more intentional, and easier to value.',
    featured: false,
    published: true,
    sortOrder: 3,
    createdAt: '2025-01-03T00:00:00.000Z',
  },
  {
    id: 'proveit',
    slug: 'proveit',
    title: 'ProveIt',
    category: 'Automation · Platform',
    industry: 'Lead Generation Platform',
    image: '/projects/ProvieIt - CF1.webp',
    beforeImage: '/projects/Before - Proveit.webp',
    brandColor: '#6f9bff',
    description:
      'Designed backend workflows handling 50+ daily leads and 250+ API requests across website, Facebook, TikTok, and manual lead sources. Built automation pipelines connected to CRM and third-party APIs (180+ automated workflows/day), implemented post-lead email sequences reducing advisory phone time by ~30 minutes per client, developed an end-to-end financial claim qualification calculator, and led production deployment/debugging via GitHub and Wix CLI.',
    summary:
      'Develop and maintain a lead-generation and automation platform serving 10k+ monthly users and 50+ daily leads, working closely with leadership on product architecture and automation systems.',
    highlights: [
      '50+ daily leads across website, Facebook, TikTok, and manual sources',
      '250+ API requests/day with 180+ automated workflows/day',
      'Automated post-lead email sequences reducing advisory calls by ~30 min/client',
      'Built end-to-end financial claim qualification calculator',
      'Led GitHub + Wix CLI deployments and production debugging',
      'Migrated 27,000 leads with batch processing, retry logic, and checkpoints',
    ],
    liveUrl: null,
    caseStudy:
      'Lead Database Migration Project: designed and implemented an automated migration system updating 27,000 existing leads with unique partnership links. Built batch processing to bypass Wix backend execution limits (~14 seconds), with retry logic and checkpoint tracking for safe resume after interruptions. Result: all 27k records migrated and future lead link generation automated.',
    featured: false,
    published: true,
    sortOrder: 4,
    createdAt: '2025-01-04T00:00:00.000Z',
  },
  {
    id: 'study-and-succeed',
    slug: 'study-and-succeed',
    title: 'Study and Succeed',
    category: 'Education · Agency',
    industry: 'Education Brand',
    image: '/projects/StudyAndSucceed - Home.webp',
    beforeImage: null,
    brandColor: '#4fc4ff',
    description:
      'A bilingual language travel site with clearer programme filtering, student-first navigation, and a cleaner path from discovery to enquiry.',
    summary:
      'Improved hierarchy and conversion flow so visitors understand the offer faster and act sooner.',
    highlights: ['Bilingual', 'Programme Filters', 'Student First'],
    liveUrl: null,
    caseStudy:
      'The main work here was simplifying choice, improving page hierarchy, and making the next step feel obvious for prospective students.',
    featured: false,
    published: true,
    sortOrder: 5,
    createdAt: '2025-01-05T00:00:00.000Z',
  },
]

const projectSelect =
  'id, slug, title, category, industry, brand_color, description, summary, highlights, live_url, case_study, featured, published, sort_order, created_at'
const projectSelectWithoutBrandColor =
  'id, slug, title, category, industry, description, summary, highlights, live_url, case_study, featured, published, sort_order, created_at'

const LOCAL_PROJECT_IMAGE_FILES = [
  'AuraProCosmetics - Home.webp',
  'Before - Proveit.webp',
  'Before - The Bus Stop.webp',
  'ProvieIt - CF1.webp',
  'Resevia-Agent - Sandbox.webp',
  'Resevia-Website - Home.webp',
  'SayIDoWeddings - Home.webp',
  'StudyAndSucceed - Home.webp',
  'TheBusStop - Home.webp',
  'TheMemoryCorner - Home.webp',
  'Txengo - Home.webp',
]

const BEFORE_PREFIX = /^before[-\s]+/i

const toKey = (value = '') => value.toLowerCase().replace(/[^a-z0-9]/g, '')
const singularize = (value = '') => (value.endsWith('s') ? value.slice(0, -1) : value)

function levenshtein(a, b) {
  if (a === b) return 0
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const previous = Array.from({ length: b.length + 1 }, (_, index) => index)
  const current = new Array(b.length + 1)

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i
    for (let j = 1; j <= b.length; j += 1) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + substitutionCost)
    }
    for (let j = 0; j <= b.length; j += 1) {
      previous[j] = current[j]
    }
  }

  return previous[b.length]
}

const LOCAL_PROJECT_IMAGE_ENTRIES = LOCAL_PROJECT_IMAGE_FILES.map((filename) => {
  const stem = filename.replace(/\.[^.]+$/, '').trim()
  const kind = BEFORE_PREFIX.test(stem) ? 'before' : 'after'
  const withoutPrefix = kind === 'before' ? stem.replace(BEFORE_PREFIX, '') : stem
  const [base] = withoutPrefix.split(/\s*-\s*/, 1)

  return {
    src: `/projects/${filename}`,
    kind,
    key: toKey(base),
  }
})

function resolveLocalImages(project) {
  const slugKey = toKey(project.slug)
  const slugKeySingular = singularize(slugKey)
  const titleKey = toKey(project.title)
  const titleKeySingular = singularize(titleKey)

  const scoreEntry = (entry) => {
    if (entry.key === titleKey) return -1
    if (entry.key === titleKeySingular || singularize(entry.key) === titleKey) return 0
    if (entry.key === slugKey) return 0
    if (entry.key === slugKeySingular || singularize(entry.key) === slugKey) return 1
    if (slugKey.includes(entry.key) || entry.key.includes(slugKey)) return 2

    const distance = levenshtein(entry.key, slugKey)
    if (distance <= 2) return 3 + distance
    return Number.POSITIVE_INFINITY
  }

  const pick = (kind) => {
    const candidates = LOCAL_PROJECT_IMAGE_ENTRIES
      .filter((entry) => entry.kind === kind)
      .map((entry) => ({ entry, score: scoreEntry(entry) }))
      .filter(({ score }) => Number.isFinite(score))
      .sort((a, b) => (a.score === b.score ? a.entry.src.localeCompare(b.entry.src) : a.score - b.score))

    return candidates[0]?.entry.src ?? null
  }

  return {
    image: pick('after'),
    beforeImage: pick('before'),
  }
}

function normalizeHighlights(value) {
  if (Array.isArray(value)) {
    return value
  }

  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

function normalizeBrandColor(value) {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  const shortHexMatch = /^#([0-9a-fA-F]{3})$/.exec(trimmed)
  if (shortHexMatch) {
    const [r, g, b] = shortHexMatch[1].split('')
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase()
  }

  if (/^#([0-9a-fA-F]{6})$/.test(trimmed)) {
    return trimmed.toLowerCase()
  }

  return null
}

function normalizeProject(project) {
  const localImages = resolveLocalImages(project)

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    category: project.category ?? 'Project',
    industry: project.industry ?? 'Client Work',
    image: localImages.image ?? null,
    beforeImage: localImages.beforeImage ?? null,
    brandColor: normalizeBrandColor(project.brand_color ?? project.brandColor),
    description: project.description ?? '',
    summary: project.summary ?? project.description ?? '',
    highlights: normalizeHighlights(project.highlights),
    liveUrl: project.live_url ?? null,
    caseStudy: project.case_study ?? null,
    featured: Boolean(project.featured),
    published: project.published ?? true,
    sortOrder: project.sort_order ?? 100,
    createdAt: project.created_at ?? new Date(0).toISOString(),
  }
}

export async function getPublishedProjects() {
  if (!supabase) {
    return FALLBACK_PROJECTS
  }

  const runProjectsQuery = async (selectClause) =>
    supabase
      .from('projects')
      .select(selectClause)
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

  let data = null
  let error = null

  const selectVariants = [
    projectSelect,
    projectSelectWithoutBrandColor,
  ]

  for (const selectClause of selectVariants) {
    const result = await runProjectsQuery(selectClause)

    if (!result.error) {
      data = result.data
      error = null
      break
    }

    data = result.data
    error = result.error

    const message = error.message?.toLowerCase() ?? ''
    const isMissingColumnError =
      message.includes('does not exist') || message.includes('unknown column')

    // Stop trying variants for non-column errors (auth/network/etc).
    if (!isMissingColumnError) {
      break
    }
  }

  if (error) {
    if (import.meta.env.DEV) {
      console.warn('Projects query failed, using fallback:', error.message)
    }
    return FALLBACK_PROJECTS
  }

  const projects = (data ?? []).map(normalizeProject)
  return projects.length > 0 ? projects : FALLBACK_PROJECTS
}
