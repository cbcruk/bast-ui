const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.hasAttribute('inert') && !element.hidden,
  )
}

export function trapFocus(event: KeyboardEvent, container: HTMLElement): void {
  const focusable = getFocusable(container)

  if (focusable.length === 0) {
    event.preventDefault()
    container.focus()

    return
  }

  const first = focusable[0]!
  const last = focusable[focusable.length - 1]!
  const active = getActiveElement()

  if (!container.contains(active)) {
    event.preventDefault()
    first.focus()

    return
  }

  if (event.shiftKey && active === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}

export function getActiveElement(): Element | null {
  let active = document.activeElement

  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement
  }

  return active
}
