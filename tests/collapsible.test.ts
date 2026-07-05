// @vitest-environment happy-dom
import { beforeEach, expect, test } from 'vite-plus/test'
import '../src/index.ts'
import type { CollapsibleRoot } from '../src/index.ts'

interface Fixture {
  root: CollapsibleRoot
  trigger: HTMLElement
  panel: HTMLElement
}

function mount(open = false): Fixture {
  const root = document.createElement('bast-collapsible')
  if (open) {
    root.setAttribute('open', '')
  }

  const trigger = document.createElement('bast-collapsible-trigger')
  trigger.textContent = 'Toggle'

  const panel = document.createElement('bast-collapsible-panel')
  panel.textContent = 'Content'

  root.append(trigger, panel)
  document.body.append(root)

  return { root, trigger, panel }
}

beforeEach(() => {
  document.body.innerHTML = ''
})

test('panel is hidden and trigger collapsed when closed', () => {
  const { trigger, panel } = mount(false)

  expect(panel.hidden).toBe(true)
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
  expect(panel.hasAttribute('data-closed')).toBe(true)
})

test('initial open attribute reveals the panel', () => {
  const { trigger, panel } = mount(true)

  expect(panel.hidden).toBe(false)
  expect(trigger.getAttribute('aria-expanded')).toBe('true')
  expect(panel.hasAttribute('data-open')).toBe(true)
})

test('trigger click toggles the panel and emits openchange', () => {
  const { root, trigger, panel } = mount(false)

  const events: boolean[] = []
  root.addEventListener('openchange', (event) => {
    events.push((event as CustomEvent<{ open: boolean }>).detail.open)
  })

  trigger.click()
  expect(root.open).toBe(true)
  expect(panel.hidden).toBe(false)
  expect(trigger.getAttribute('aria-expanded')).toBe('true')

  trigger.click()
  expect(root.open).toBe(false)
  expect(panel.hidden).toBe(true)

  expect(events).toEqual([true, false])
})

test('aria wiring links trigger and panel', () => {
  const { trigger, panel } = mount(false)

  expect(trigger.getAttribute('aria-controls')).toBe(panel.id)
  expect(panel.getAttribute('aria-labelledby')).toBe(trigger.id)
  expect(trigger.getAttribute('role')).toBe('button')
})

test('Enter and Space keys toggle the panel', () => {
  const { root, trigger } = mount(false)

  trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
  expect(root.open).toBe(true)

  trigger.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
  expect(root.open).toBe(false)
})

test('disabled root ignores activation', () => {
  const { root, trigger, panel } = mount(false)
  root.setAttribute('disabled', '')

  trigger.click()

  expect(root.open).toBe(false)
  expect(panel.hidden).toBe(true)
  expect(trigger.getAttribute('aria-disabled')).toBe('true')
  expect(trigger.getAttribute('tabindex')).toBe('-1')
})
