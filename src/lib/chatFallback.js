const FALLBACK_RESPONSES = [
  {
    patterns: ['skill', 'stack', 'technology', 'tech'],
    answer:
      "Eduard works with JavaScript, TypeScript, React, Next.js, HTML, CSS, Supabase, REST APIs, webhooks, Gemini 2.5 Pro, Twilio infrastructure, iCal.eu booking flows, WordPress, and automation tools like Zapier and Google Apps Script.",
  },
  {
    patterns: ['project', 'portfolio', 'work', 'built'],
    answer:
      'Recent work includes a lead-generation and automation platform, a hospitality booking system, multiple client websites, and production integrations connecting web apps with third-party APIs.',
  },
  {
    patterns: ['hire', 'available', 'role', 'job'],
    answer:
      "Eduard is open to full-stack developer opportunities and can contribute across frontend work, API integrations, and automation-heavy features. You can reach him via the contact section on this page.",
  },
  {
    patterns: ['contact', 'email', 'linkedin', 'cv', 'resume'],
    answer:
      'Use the contact section to email Eduard directly or connect on LinkedIn. You can also download his CV from the hero section.',
  },
  {
    patterns: ['ai', 'chatbot', 'assistant', 'gemini', 'automation'],
    answer:
      'This chat assistant demonstrates Eduard’s AI integration direction. It can run through a Gemini-backed server endpoint using the portfolio prompt and project data.',
  },
]

export const CHAT_SUGGESTIONS = [
  'What kind of projects has Eduard built?',
  'Which technologies does he use the most?',
  'Is Eduard currently available for roles?',
  'How can I get in touch with him?',
]

export function getPortfolioFallbackReply(message) {
  const normalized = message.toLowerCase()

  const match = FALLBACK_RESPONSES.find((entry) =>
    entry.patterns.some((pattern) => normalized.includes(pattern)),
  )

  if (match) {
    return match.answer
  }

  return "I can help with Eduard's projects, skills, and availability. Try asking about his tech stack, recent client work, or how to contact him."
}
