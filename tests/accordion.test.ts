// @vitest-environment happy-dom
import { beforeEach, expect, test } from 'vite-plus/test'
import '../src/index.ts'
import type { AccordionRoot } from '../src/index.ts'

interface Item {
  item: HTMLElement
  trigger: HTMLElement
  panel: HTMLElement
}

interface Fixture {
  root: AccordionRoot
  items: Item[]
}

function mount(
  options: { value?: string; multiple?: boolean; orientation?: string; disabled?: boolean } = {},
  labels = ['one', 'two', 'three'],
): Fixture {
  const root = document.createElement('bast-accordion')
  if (options.value !== undefined) {
    root.setAttribute('value', options.value)
  }
  if (options.multiple) {
    root.setAttribute('multiple', '')
  }
  if (options.orientation) {
    root.setAttribute('orientation', options.orientation)
  }
  if (options.disabled) {
    root.setAttribute('disabled', '')
  }

  const items = labels.map((value) => {
    const item = document.createElement('bast-accordion-item')
    item.setAttribute('value', value)

    const trigger = document.createElement('bast-accordion-trigger')
    trigger.textContent = value

    const panel = document.createElement('bast-accordion-panel')
    panel.textContent = `Panel ${value}`

    item.append(trigger, panel)
    root.append(item)

    return { item, trigger, panel }
  })

  document.body.append(root)

  return { root, items }
}

beforeEach(() => {
  document.body.innerHTML = ''
})

test('all panels are collapsed by default', () => {
  const { items } = mount()

  for (const { trigger, panel } of items) {
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(panel.hidden).toBe(true)
  }
})

test('initial value attribute expands the matching item', () => {
  const { items } = mount({ value: 'two' })

  expect(items[1]!.trigger.getAttribute('aria-expanded')).toBe('true')
  expect(items[1]!.panel.hidden).toBe(false)
  expect(items[1]!.item.hasAttribute('data-open')).toBe(true)
  expect(items[0]!.panel.hidden).toBe(true)
})

test('aria wiring links each trigger to its panel', () => {
  const { items } = mount()
  const { trigger, panel } = items[0]!

  expect(trigger.getAttribute('role')).toBe('button')
  expect(panel.getAttribute('role')).toBe('region')
  expect(trigger.getAttribute('aria-controls')).toBe(panel.id)
  expect(panel.getAttribute('aria-labelledby')).toBe(trigger.id)
})

test('single mode: opening an item collapses the previously open one', () => {
  const { root, items } = mount()

  const events: string[][] = []
  root.addEventListener('valuechange', (event) => {
    events.push((event as CustomEvent<{ value: string[] }>).detail.value)
  })

  items[0]!.trigger.click()
  expect(items[0]!.panel.hidden).toBe(false)

  items[1]!.trigger.click()
  expect(items[0]!.panel.hidden).toBe(true)
  expect(items[1]!.panel.hidden).toBe(false)

  expect(events).toEqual([['one'], ['two']])
})

test('single mode: clicking an open item collapses it', () => {
  const { items } = mount({ value: 'one' })

  items[0]!.trigger.click()

  expect(items[0]!.panel.hidden).toBe(true)
  expect(items[0]!.trigger.getAttribute('aria-expanded')).toBe('false')
})

test('multiple mode: several items can be open at once', () => {
  const { root, items } = mount({ multiple: true })

  items[0]!.trigger.click()
  items[2]!.trigger.click()

  expect(items[0]!.panel.hidden).toBe(false)
  expect(items[2]!.panel.hidden).toBe(false)
  expect(items[1]!.panel.hidden).toBe(true)
  expect(root.value).toBe('one,three')
})

test('Enter and Space toggle the item', () => {
  const { items } = mount()

  items[0]!.trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
  expect(items[0]!.panel.hidden).toBe(false)

  items[0]!.trigger.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
  expect(items[0]!.panel.hidden).toBe(true)
})

test('triggers stay in the tab order (no roving tabindex)', () => {
  const { items } = mount()

  for (const { trigger } of items) {
    expect(trigger.getAttribute('tabindex')).toBe('0')
  }
})

test('arrow keys move focus between triggers and wrap around', () => {
  const { items } = mount()
  items[0]!.trigger.focus()

  items[0]!.trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
  expect(document.activeElement).toBe(items[1]!.trigger)

  items[1]!.trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
  items[2]!.trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
  expect(document.activeElement).toBe(items[0]!.trigger)

  items[0]!.trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
  expect(document.activeElement).toBe(items[2]!.trigger)
})

test('horizontal orientation navigates with left and right arrows', () => {
  const { items } = mount({ orientation: 'horizontal' })
  items[0]!.trigger.focus()

  items[0]!.trigger.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
  )
  expect(document.activeElement).toBe(items[1]!.trigger)

  items[1]!.trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
  expect(document.activeElement).toBe(items[0]!.trigger)
})

test('Home and End jump to the first and last trigger', () => {
  const { items } = mount()
  items[1]!.trigger.focus()

  items[1]!.trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
  expect(document.activeElement).toBe(items[2]!.trigger)

  items[2]!.trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
  expect(document.activeElement).toBe(items[0]!.trigger)
})

test('a disabled item cannot be toggled and is skipped by navigation', () => {
  const { items } = mount()
  items[1]!.item.setAttribute('disabled', '')

  items[1]!.trigger.click()
  expect(items[1]!.panel.hidden).toBe(true)
  expect(items[1]!.trigger.getAttribute('aria-disabled')).toBe('true')

  items[0]!.trigger.focus()
  items[0]!.trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
  expect(document.activeElement).toBe(items[2]!.trigger)
})

test('a disabled root ignores all activation', () => {
  const { root, items } = mount({ disabled: true })

  items[0]!.trigger.click()

  expect(root.value).toBe('')
  expect(items[0]!.panel.hidden).toBe(true)
  expect(items[0]!.trigger.getAttribute('aria-disabled')).toBe('true')
})
