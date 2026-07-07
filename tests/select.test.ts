// @vitest-environment happy-dom
import { beforeEach, expect, test } from 'vite-plus/test'
import '../src/index.ts'
import type { SelectRoot } from '../src/index.ts'

interface Fixture {
  root: SelectRoot
  trigger: HTMLElement
  value: HTMLElement
  positioner: HTMLElement
  popup: HTMLElement
  options: HTMLElement[]
}

function mount(
  options: { value?: string; disabled?: boolean } = {},
  labels = ['Red', 'Green', 'Blue'],
): Fixture {
  const root = document.createElement('bast-select')
  if (options.value) {
    root.setAttribute('value', options.value)
  }
  if (options.disabled) {
    root.setAttribute('disabled', '')
  }

  const trigger = document.createElement('bast-select-trigger')
  const value = document.createElement('bast-select-value')
  value.setAttribute('placeholder', 'Pick one')
  trigger.append(value)

  const positioner = document.createElement('bast-select-positioner')
  const popup = document.createElement('bast-select-popup')
  const optionEls = labels.map((label) => {
    const option = document.createElement('bast-select-option')
    option.setAttribute('value', label.toLowerCase())
    option.textContent = label
    return option
  })

  popup.append(...optionEls)
  positioner.append(popup)
  root.append(trigger, positioner)
  document.body.append(root)

  return { root, trigger, value, positioner, popup, options: optionEls }
}

beforeEach(() => {
  document.body.innerHTML = ''
})

test('select starts closed with a combobox trigger and hidden positioner', () => {
  const { root, trigger, positioner } = mount()

  expect(root.open).toBe(false)
  expect(trigger.getAttribute('role')).toBe('combobox')
  expect(trigger.getAttribute('aria-haspopup')).toBe('listbox')
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
  expect(positioner.hidden).toBe(true)
})

test('value shows the placeholder until a selection is made', () => {
  const { value } = mount()

  expect(value.textContent).toBe('Pick one')
  expect(value.hasAttribute('data-placeholder')).toBe(true)
})

test('initial value selects the matching option and renders its label', () => {
  const { value, options } = mount({ value: 'green' })

  expect(value.textContent).toBe('Green')
  expect(value.hasAttribute('data-placeholder')).toBe(false)
  expect(options[1]!.getAttribute('aria-selected')).toBe('true')
  expect(options[0]!.getAttribute('aria-selected')).toBe('false')
})

test('trigger click opens the listbox and focuses the first option when none selected', () => {
  const { root, trigger, popup, options } = mount()

  trigger.click()

  expect(root.open).toBe(true)
  expect(popup.getAttribute('role')).toBe('listbox')
  expect(document.activeElement).toBe(options[0])
})

test('opening focuses the selected option', () => {
  const { trigger, options } = mount({ value: 'blue' })

  trigger.click()

  expect(document.activeElement).toBe(options[2])
})

test('ArrowDown on the trigger opens the listbox', () => {
  const { root, trigger } = mount()

  trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))

  expect(root.open).toBe(true)
})

test('arrow keys move focus between options and wrap', () => {
  const { trigger, popup, options } = mount()
  trigger.click()

  popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
  expect(document.activeElement).toBe(options[1])

  popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
  popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
  expect(document.activeElement).toBe(options[2])
})

test('typeahead focuses the option matching the typed prefix', () => {
  const { trigger, popup, options } = mount()
  trigger.click()

  popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', bubbles: true }))
  expect(document.activeElement).toBe(options[2])
})

test('clicking an option selects it, emits valuechange, closes, and restores focus', () => {
  const { root, trigger, value, options } = mount()
  trigger.focus()
  trigger.click()

  const events: string[] = []
  root.addEventListener('valuechange', (event) => {
    events.push((event as CustomEvent<{ value: string }>).detail.value)
  })

  options[1]!.click()

  expect(events).toEqual(['green'])
  expect(root.value).toBe('green')
  expect(value.textContent).toBe('Green')
  expect(root.open).toBe(false)
  expect(document.activeElement).toBe(trigger)
})

test('Enter selects the focused option', () => {
  const { root, trigger, popup, options } = mount()
  trigger.click()

  popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
  options[1]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

  expect(root.value).toBe('green')
  expect(root.open).toBe(false)
})

test('disabled options are skipped by navigation and ignore activation', () => {
  const { root, trigger, popup, options } = mount()
  options[1]!.setAttribute('disabled', '')

  trigger.click()
  expect(document.activeElement).toBe(options[0])

  popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
  expect(document.activeElement).toBe(options[2])

  options[1]!.click()
  expect(root.open).toBe(true)
  expect(options[1]!.getAttribute('aria-disabled')).toBe('true')
})

test('a disabled select does not open', () => {
  const { root, trigger } = mount({ disabled: true })

  trigger.click()

  expect(root.open).toBe(false)
  expect(trigger.getAttribute('aria-disabled')).toBe('true')
})

test('Escape closes the listbox and restores focus to the trigger', () => {
  const { root, trigger } = mount()
  trigger.focus()
  trigger.click()

  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

  expect(root.open).toBe(false)
  expect(document.activeElement).toBe(trigger)
})

test('outside pointer interaction dismisses the listbox', () => {
  const outside = document.createElement('button')
  document.body.append(outside)

  const { root, trigger } = mount()
  trigger.click()
  expect(root.open).toBe(true)

  outside.dispatchEvent(new Event('pointerdown', { bubbles: true }))
  expect(root.open).toBe(false)
})
