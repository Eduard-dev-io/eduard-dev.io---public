import { useEffect } from 'react'
import { logEduardDevEvent } from '../lib/eduardLogs'

function classNameToString(className) {
  if (typeof className === 'string') {
    return className || null
  }

  if (className && typeof className === 'object' && 'baseVal' in className) {
    return className.baseVal || null
  }

  return null
}

function textFromElement(element) {
  const attr =
    element.getAttribute('aria-label') ||
    element.getAttribute('data-track-label') ||
    element.getAttribute('title')

  if (attr) {
    return attr.slice(0, 160)
  }

  const text = element.textContent?.replace(/\s+/g, ' ').trim()
  return text ? text.slice(0, 160) : null
}

function sectionFromElement(element) {
  if (element.closest('nav')) return 'nav'
  if (element.closest('footer')) return 'footer'
  if (element.closest('header')) return 'header'
  if (element.closest('main')) return 'main'
  if (element.closest('#chat')) return 'chat'
  return 'unknown'
}

function PortfolioLogger() {
  useEffect(() => {
    void logEduardDevEvent({
      eventName: 'page_view',
      eventType: 'page_view',
      metadata: {
        title: document.title || null,
      },
    })
  }, [])

  useEffect(() => {
    const onClick = (event) => {
      const target = event.target
      if (!(target instanceof Element)) {
        return
      }

      const clickable = target.closest(
        "a,button,[role='button'],input[type='button'],input[type='submit']",
      )

      if (!(clickable instanceof HTMLElement)) {
        return
      }

      const tag = clickable.tagName.toLowerCase()
      const anchor = tag === 'a' ? clickable : null

      void logEduardDevEvent({
        eventName: tag === 'a' ? 'link_click' : 'button_click',
        eventType: 'click',
        metadata: {
          tag,
          label: textFromElement(clickable),
          id: clickable.id || null,
          class_name: classNameToString(clickable.className),
          href: anchor?.href || null,
          target: anchor?.target || null,
          section: sectionFromElement(clickable),
        },
      })
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}

export default PortfolioLogger
