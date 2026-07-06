// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, test, vi } from 'vite-plus/test'
import '../src/index.ts'
import type { ToastRoot } from '../src/index.ts'

interface Fixture {
  toast: ToastRoot
  title: HTMLElement
  description: HTMLElement
  close: HTMLElement
}

function mount(attrs: { open?: boolean; duration?: number; type?: string } = {}): Fixture {
  const toast = document.createElement('bast-toast')
  if (attrs.open ?? true) {
    toast.setAttribute('open', '')
  }
  if (attrs.duration !== undefined) {
    toast.setAttribute('duration', String(attrs.duration))
  }
  if (attrs.type) {
    toast.setAttribute('type', attrs.type)
  }

  const title = document.createElement('bast-toast-title')
  title.textContent = 'Saved'
  const description = document.createElement('bast-toast-description')
  description.textContent = 'Your changes were saved.'
  const close = document.createElement('bast-toast-close')
  close.textContent = 'Dismiss'

  toast.append(title, description, close)
  document.body.append(toast)

  return { toast, title, description, close }
}

beforeEach(() => {
  document.body.innerHTML = ''
  vi.useFakeTimers()
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

test('a background toast is a polite live region labelled and described by its parts', () => {
  const { toast, title, description } = mount({ duration: 0 })

  expect(toast.getAttribute('role')).toBe('status')
  expect(toast.getAttribute('aria-live')).toBe('polite')
  expect(toast.getAttribute('aria-atomic')).toBe('true')
  expect(toast.getAttribute('aria-labelledby')).toBe(title.id)
  expect(toast.getAttribute('aria-describedby')).toBe(description.id)
  expect(toast.hidden).toBe(false)
})

test('a foreground toast is an assertive alert', () => {
  const { toast } = mount({ duration: 0, type: 'foreground' })

  expect(toast.getAttribute('role')).toBe('alert')
  expect(toast.getAttribute('aria-live')).toBe('assertive')
})

test('a closed toast is hidden', () => {
  const { toast } = mount({ open: false, duration: 0 })

  expect(toast.open).toBe(false)
  expect(toast.hidden).toBe(true)
  expect(toast.hasAttribute('data-closed')).toBe(true)
})

test('auto-dismisses after the duration and emits openchange', () => {
  const { toast } = mount({ duration: 5000 })
  const events: boolean[] = []
  toast.addEventListener('openchange', (event) => {
    events.push((event as CustomEvent<{ open: boolean }>).detail.open)
  })

  vi.advanceTimersByTime(4999)
  expect(toast.open).toBe(true)

  vi.advanceTimersByTime(1)
  expect(toast.open).toBe(false)
  expect(toast.hidden).toBe(true)
  expect(events).toEqual([false])
})

test('duration of 0 keeps the toast open indefinitely', () => {
  const { toast } = mount({ duration: 0 })

  vi.advanceTimersByTime(100000)
  expect(toast.open).toBe(true)
})

test('hovering pauses the timer and leaving resumes it', () => {
  const { toast } = mount({ duration: 5000 })

  vi.advanceTimersByTime(3000)
  toast.dispatchEvent(new Event('pointerenter'))

  // Timer is paused — advancing well past the original duration keeps it open.
  vi.advanceTimersByTime(10000)
  expect(toast.open).toBe(true)

  toast.dispatchEvent(new Event('pointerleave'))
  // 2000ms remained when paused.
  vi.advanceTimersByTime(1999)
  expect(toast.open).toBe(true)
  vi.advanceTimersByTime(1)
  expect(toast.open).toBe(false)
})

test('focus pauses the timer and blur resumes it', () => {
  const { toast } = mount({ duration: 5000 })

  vi.advanceTimersByTime(1000)
  toast.dispatchEvent(new Event('focusin', { bubbles: true }))
  vi.advanceTimersByTime(10000)
  expect(toast.open).toBe(true)

  toast.dispatchEvent(new Event('focusout', { bubbles: true }))
  vi.advanceTimersByTime(4000)
  expect(toast.open).toBe(false)
})

test('the close button dismisses the toast', () => {
  const { toast, close } = mount({ duration: 0 })

  close.click()
  expect(toast.open).toBe(false)
})

test('Enter on the close button dismisses the toast', () => {
  const { toast, close } = mount({ duration: 0 })

  close.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
  expect(toast.open).toBe(false)
})

test('the region exposes a labelled landmark', () => {
  const region = document.createElement('bast-toast-region')
  document.body.append(region)

  expect(region.getAttribute('role')).toBe('region')
  expect(region.getAttribute('aria-label')).toBe('Notifications')
})
