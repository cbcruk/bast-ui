// @vitest-environment happy-dom
import { beforeEach, expect, test } from 'vite-plus/test'
import '../src/index.ts'
import type { PopoverRoot } from '../src/index.ts'

interface Fixture {
  root: PopoverRoot
  trigger: HTMLElement
  positioner: HTMLElement
  popup: HTMLElement
  title: HTMLElement
  description: HTMLElement
  close: HTMLElement
  input: HTMLInputElement
}

function mount(): Fixture {
  const root = document.createElement('bast-popover')
  const trigger = document.createElement('bast-popover-trigger')
  trigger.textContent = 'Open'

  const positioner = document.createElement('bast-popover-positioner')
  const popup = document.createElement('bast-popover-popup')
  const title = document.createElement('bast-popover-title')
  title.textContent = 'Title'
  const description = document.createElement('bast-popover-description')
  description.textContent = 'Description'
  const input = document.createElement('input')
  const close = document.createElement('bast-popover-close')
  close.textContent = 'Close'

  popup.append(title, description, input, close)
  positioner.append(popup)
  root.append(trigger, positioner)
  document.body.append(root)

  return { root, trigger, positioner, popup, title, description, close, input }
}

beforeEach(() => {
  document.body.innerHTML = ''
})

test('popover starts closed with the positioner hidden', () => {
  const { root, positioner, trigger } = mount()

  expect(root.open).toBe(false)
  expect(positioner.hidden).toBe(true)
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
  expect(positioner.style.position).toBe('fixed')
})

test('trigger toggles the popover open and closed', () => {
  const { root, trigger, positioner } = mount()

  trigger.click()
  expect(root.open).toBe(true)
  expect(positioner.hidden).toBe(false)
  expect(trigger.getAttribute('aria-expanded')).toBe('true')

  trigger.click()
  expect(root.open).toBe(false)
  expect(positioner.hidden).toBe(true)
})

test('popup is labelled and described by title and description', () => {
  const { trigger, popup, title, description } = mount()

  trigger.click()

  expect(popup.getAttribute('role')).toBe('dialog')
  expect(popup.getAttribute('aria-labelledby')).toBe(title.id)
  expect(popup.getAttribute('aria-describedby')).toBe(description.id)
})

test('focus moves into the popup on open', () => {
  const { trigger, input } = mount()

  trigger.click()

  expect(document.activeElement).toBe(input)
})

test('positioner records the resolved side while open', () => {
  const { trigger, positioner } = mount()

  trigger.click()

  expect(positioner.hasAttribute('data-side')).toBe(true)
})

test('Escape closes the popover', () => {
  const { root, trigger } = mount()

  trigger.click()
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

  expect(root.open).toBe(false)
})

test('outside pointer interaction dismisses the popover', () => {
  const outside = document.createElement('button')
  document.body.append(outside)

  const { root, trigger } = mount()

  trigger.click()
  expect(root.open).toBe(true)

  outside.dispatchEvent(new Event('pointerdown', { bubbles: true }))

  expect(root.open).toBe(false)
})

test('pointer interaction inside the popup keeps it open', () => {
  const { root, trigger, input } = mount()

  trigger.click()
  input.dispatchEvent(new Event('pointerdown', { bubbles: true }))

  expect(root.open).toBe(true)
})

test('close button closes the popover and restores focus', () => {
  const { root, trigger, close } = mount()

  trigger.focus()
  trigger.click()
  close.click()

  expect(root.open).toBe(false)
  expect(document.activeElement).toBe(trigger)
})

test('side is a reflected configuration attribute', () => {
  const { root } = mount()

  expect(root.side).toBe('bottom')

  root.setAttribute('side', 'top')
  expect(root.side).toBe('top')
})
