// @vitest-environment happy-dom
import { beforeEach, expect, test } from 'vite-plus/test'
import '../src/index.ts'
import type { MenuRoot } from '../src/index.ts'

interface Fixture {
  root: MenuRoot
  trigger: HTMLElement
  positioner: HTMLElement
  popup: HTMLElement
  items: HTMLElement[]
}

function mount(labels = ['Cut', 'Copy', 'Paste']): Fixture {
  const root = document.createElement('bast-menu')
  const trigger = document.createElement('bast-menu-trigger')
  trigger.textContent = 'Actions'

  const positioner = document.createElement('bast-menu-positioner')
  const popup = document.createElement('bast-menu-popup')
  const items = labels.map((label) => {
    const item = document.createElement('bast-menu-item')
    item.setAttribute('value', label.toLowerCase())
    item.textContent = label
    return item
  })

  popup.append(...items)
  positioner.append(popup)
  root.append(trigger, positioner)
  document.body.append(root)

  return { root, trigger, positioner, popup, items }
}

beforeEach(() => {
  document.body.innerHTML = ''
})

test('menu starts closed with the positioner hidden', () => {
  const { root, positioner, trigger } = mount()

  expect(root.open).toBe(false)
  expect(positioner.hidden).toBe(true)
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
  expect(trigger.getAttribute('aria-haspopup')).toBe('menu')
})

test('trigger toggles the menu open and closed', () => {
  const { root, trigger, positioner } = mount()

  trigger.click()
  expect(root.open).toBe(true)
  expect(positioner.hidden).toBe(false)
  expect(trigger.getAttribute('aria-expanded')).toBe('true')

  trigger.click()
  expect(root.open).toBe(false)
  expect(positioner.hidden).toBe(true)
})

test('popup exposes menu role and is labelled by the trigger', () => {
  const { trigger, popup } = mount()

  expect(popup.getAttribute('role')).toBe('menu')
  expect(popup.getAttribute('aria-labelledby')).toBe(trigger.id)
})

test('items expose the menuitem role', () => {
  const { items } = mount()

  expect(items[0]!.getAttribute('role')).toBe('menuitem')
})

test('opening focuses the first item', () => {
  const { trigger, items } = mount()

  trigger.click()

  expect(document.activeElement).toBe(items[0])
  expect(items[0]!.getAttribute('tabindex')).toBe('0')
  expect(items[1]!.getAttribute('tabindex')).toBe('-1')
})

test('ArrowUp on the trigger opens the menu focused on the last item', () => {
  const { trigger, items } = mount()

  trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))

  expect(document.activeElement).toBe(items[2])
})

test('arrow keys move focus between items and wrap around', () => {
  const { trigger, popup, items } = mount()
  trigger.click()

  popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
  expect(document.activeElement).toBe(items[1])

  popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
  popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
  expect(document.activeElement).toBe(items[0])

  popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
  expect(document.activeElement).toBe(items[2])
})

test('Home and End jump to the first and last item', () => {
  const { trigger, popup, items } = mount()
  trigger.click()

  popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
  expect(document.activeElement).toBe(items[2])

  popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
  expect(document.activeElement).toBe(items[0])
})

test('typeahead focuses the item matching the typed prefix', () => {
  const { trigger, popup, items } = mount()
  trigger.click()

  popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'p', bubbles: true }))
  expect(document.activeElement).toBe(items[2])
})

test('clicking an item selects it, emits itemselect, and closes the menu', () => {
  const { root, trigger, items } = mount()
  trigger.focus()
  trigger.click()

  const events: (string | null)[] = []
  root.addEventListener('itemselect', (event) => {
    events.push((event as CustomEvent<{ value: string | null }>).detail.value)
  })

  items[1]!.click()

  expect(events).toEqual(['copy'])
  expect(root.open).toBe(false)
  expect(document.activeElement).toBe(trigger)
})

test('Enter activates the focused item', () => {
  const { root, trigger, popup, items } = mount()
  trigger.click()

  const events: (string | null)[] = []
  root.addEventListener('itemselect', (event) => {
    events.push((event as CustomEvent<{ value: string | null }>).detail.value)
  })

  popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
  items[1]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

  expect(events).toEqual(['copy'])
  expect(root.open).toBe(false)
})

test('disabled items are skipped by navigation and ignore activation', () => {
  const { root, trigger, popup, items } = mount()
  items[1]!.setAttribute('disabled', '')

  trigger.click()
  expect(document.activeElement).toBe(items[0])

  popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
  expect(document.activeElement).toBe(items[2])

  items[1]!.click()
  expect(root.open).toBe(true)
  expect(items[1]!.getAttribute('aria-disabled')).toBe('true')
})

test('Escape closes the menu and restores focus to the trigger', () => {
  const { root, trigger } = mount()
  trigger.focus()
  trigger.click()

  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

  expect(root.open).toBe(false)
  expect(document.activeElement).toBe(trigger)
})

test('Tab closes the menu', () => {
  const { root, trigger, popup } = mount()
  trigger.click()

  popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))

  expect(root.open).toBe(false)
})

test('outside pointer interaction dismisses the menu', () => {
  const outside = document.createElement('button')
  document.body.append(outside)

  const { root, trigger } = mount()
  trigger.click()
  expect(root.open).toBe(true)

  outside.dispatchEvent(new Event('pointerdown', { bubbles: true }))
  expect(root.open).toBe(false)
})
