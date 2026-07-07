// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, test, vi } from 'vite-plus/test'
import '../src/index.ts'
import type { TooltipRoot } from '../src/index.ts'

interface Fixture {
  root: TooltipRoot
  trigger: HTMLElement
  positioner: HTMLElement
  popup: HTMLElement
}

function mount(options: { delay?: number; closeDelay?: number; side?: string } = {}): Fixture {
  const root = document.createElement('bast-tooltip')
  if (options.delay !== undefined) {
    root.setAttribute('delay', String(options.delay))
  }
  if (options.closeDelay !== undefined) {
    root.setAttribute('close-delay', String(options.closeDelay))
  }
  if (options.side) {
    root.setAttribute('side', options.side)
  }

  const trigger = document.createElement('bast-tooltip-trigger')
  trigger.textContent = 'Hover me'
  trigger.setAttribute('tabindex', '0')

  const positioner = document.createElement('bast-tooltip-positioner')
  const popup = document.createElement('bast-tooltip-popup')
  popup.textContent = 'Helpful hint'

  positioner.append(popup)
  root.append(trigger, positioner)
  document.body.append(root)

  return { root, trigger, positioner, popup }
}

beforeEach(() => {
  document.body.innerHTML = ''
  vi.useFakeTimers()
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

test('tooltip starts closed with the positioner hidden', () => {
  const { root, positioner, popup } = mount()

  expect(root.open).toBe(false)
  expect(positioner.hidden).toBe(true)
  expect(popup.getAttribute('role')).toBe('tooltip')
  expect(positioner.style.position).toBe('fixed')
})

test('pointer enter opens after the delay elapses', () => {
  const { root, trigger, positioner } = mount({ delay: 600 })

  trigger.dispatchEvent(new Event('pointerenter'))
  expect(root.open).toBe(false)

  vi.advanceTimersByTime(599)
  expect(root.open).toBe(false)

  vi.advanceTimersByTime(1)
  expect(root.open).toBe(true)
  expect(positioner.hidden).toBe(false)
})

test('leaving before the delay elapses cancels the pending open', () => {
  const { root, trigger } = mount({ delay: 600 })

  trigger.dispatchEvent(new Event('pointerenter'))
  vi.advanceTimersByTime(300)
  trigger.dispatchEvent(new Event('pointerleave'))
  vi.advanceTimersByTime(600)

  expect(root.open).toBe(false)
})

test('focus opens the tooltip immediately and wires aria-describedby', () => {
  const { root, trigger, popup } = mount()

  trigger.dispatchEvent(new Event('focusin', { bubbles: true }))

  expect(root.open).toBe(true)
  expect(trigger.getAttribute('aria-describedby')).toBe(popup.id)
})

test('aria-describedby is removed once closed', () => {
  const { trigger } = mount()

  trigger.dispatchEvent(new Event('focusin', { bubbles: true }))
  expect(trigger.hasAttribute('aria-describedby')).toBe(true)

  trigger.dispatchEvent(new Event('focusout', { bubbles: true }))
  expect(trigger.hasAttribute('aria-describedby')).toBe(false)
})

test('blur closes the tooltip', () => {
  const { root, trigger } = mount()

  trigger.dispatchEvent(new Event('focusin', { bubbles: true }))
  expect(root.open).toBe(true)

  trigger.dispatchEvent(new Event('focusout', { bubbles: true }))
  expect(root.open).toBe(false)
})

test('pointer leave closes after the close delay', () => {
  const { root, trigger } = mount({ delay: 0, closeDelay: 200 })

  trigger.dispatchEvent(new Event('pointerenter'))
  vi.advanceTimersByTime(0)
  expect(root.open).toBe(true)

  trigger.dispatchEvent(new Event('pointerleave'))
  expect(root.open).toBe(true)

  vi.advanceTimersByTime(200)
  expect(root.open).toBe(false)
})

test('hovering the popup cancels a pending close', () => {
  const { root, trigger, positioner } = mount({ delay: 0, closeDelay: 200 })

  trigger.dispatchEvent(new Event('pointerenter'))
  vi.advanceTimersByTime(0)
  expect(root.open).toBe(true)

  trigger.dispatchEvent(new Event('pointerleave'))
  positioner.dispatchEvent(new Event('pointerenter'))
  vi.advanceTimersByTime(200)

  expect(root.open).toBe(true)
})

test('Escape closes an open tooltip', () => {
  const { root, trigger } = mount()

  trigger.dispatchEvent(new Event('focusin', { bubbles: true }))
  expect(root.open).toBe(true)

  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
  expect(root.open).toBe(false)
})

test('positioner records the resolved side while open', () => {
  const { trigger, positioner } = mount({ delay: 0 })

  trigger.dispatchEvent(new Event('pointerenter'))
  vi.advanceTimersByTime(0)

  expect(positioner.hasAttribute('data-side')).toBe(true)
})

test('delay and side are reflected configuration attributes', () => {
  const { root } = mount({ side: 'right' })

  expect(root.side).toBe('right')
  expect(root.delay).toBe(600)

  root.setAttribute('delay', '100')
  expect(root.delay).toBe(100)
})
