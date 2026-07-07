// @vitest-environment happy-dom
import { beforeEach, expect, test } from 'vite-plus/test'
import '../src/index.ts'
import type { RadioGroupRoot } from '../src/index.ts'

interface Fixture {
  group: RadioGroupRoot
  radios: HTMLElement[]
}

function mount(
  options: { value?: string; orientation?: string; disabled?: boolean } = {},
  labels = ['sm', 'md', 'lg'],
): Fixture {
  const group = document.createElement('bast-radio-group')
  if (options.value) {
    group.setAttribute('value', options.value)
  }
  if (options.orientation) {
    group.setAttribute('orientation', options.orientation)
  }
  if (options.disabled) {
    group.setAttribute('disabled', '')
  }

  const radios = labels.map((value) => {
    const radio = document.createElement('bast-radio')
    radio.setAttribute('value', value)
    radio.textContent = value
    group.append(radio)

    return radio
  })

  document.body.append(group)

  return { group, radios }
}

beforeEach(() => {
  document.body.innerHTML = ''
})

test('group and radios expose the correct roles', () => {
  const { group, radios } = mount()

  expect(group.getAttribute('role')).toBe('radiogroup')
  expect(group.getAttribute('aria-orientation')).toBe('vertical')
  expect(radios[0]!.getAttribute('role')).toBe('radio')
})

test('with no value the first radio is the tab stop, none checked', () => {
  const { radios } = mount()

  expect(radios[0]!.getAttribute('tabindex')).toBe('0')
  expect(radios[1]!.getAttribute('tabindex')).toBe('-1')
  expect(radios[0]!.getAttribute('aria-checked')).toBe('false')
})

test('initial value checks the matching radio and makes it the tab stop', () => {
  const { radios } = mount({ value: 'md' })

  expect(radios[1]!.getAttribute('aria-checked')).toBe('true')
  expect(radios[1]!.getAttribute('tabindex')).toBe('0')
  expect(radios[0]!.getAttribute('tabindex')).toBe('-1')
})

test('clicking a radio selects it and emits valuechange', () => {
  const { group, radios } = mount()
  const events: string[] = []
  group.addEventListener('valuechange', (event) => {
    events.push((event as CustomEvent<{ value: string }>).detail.value)
  })

  radios[2]!.click()

  expect(group.value).toBe('lg')
  expect(radios[2]!.getAttribute('aria-checked')).toBe('true')
  expect(radios[0]!.getAttribute('aria-checked')).toBe('false')
  expect(events).toEqual(['lg'])
})

test('Space selects the focused radio', () => {
  const { group, radios } = mount()

  radios[1]!.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
  expect(group.value).toBe('md')
})

test('arrow keys move focus and selection together, wrapping around', () => {
  const { group, radios } = mount({ value: 'sm' })
  radios[0]!.focus()

  radios[0]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
  expect(group.value).toBe('md')
  expect(document.activeElement).toBe(radios[1])

  radios[1]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
  radios[2]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
  expect(group.value).toBe('sm')
  expect(document.activeElement).toBe(radios[0])
})

test('horizontal orientation navigates with left and right arrows', () => {
  const { group, radios } = mount({ value: 'sm', orientation: 'horizontal' })
  radios[0]!.focus()

  radios[0]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
  expect(group.value).toBe('md')

  radios[1]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
  expect(group.value).toBe('sm')
})

test('Home and End select the first and last radio', () => {
  const { group, radios } = mount({ value: 'md' })
  radios[1]!.focus()

  radios[1]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
  expect(group.value).toBe('lg')

  radios[2]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
  expect(group.value).toBe('sm')
})

test('a disabled radio is skipped by navigation and ignores activation', () => {
  const { group, radios } = mount({ value: 'sm' })
  radios[1]!.setAttribute('disabled', '')

  radios[0]!.focus()
  radios[0]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
  expect(group.value).toBe('lg')
  expect(document.activeElement).toBe(radios[2])

  radios[1]!.click()
  expect(group.value).toBe('lg')
  expect(radios[1]!.getAttribute('aria-disabled')).toBe('true')
})

test('a disabled group ignores all activation', () => {
  const { group, radios } = mount({ disabled: true })

  radios[0]!.click()
  expect(group.value).toBeUndefined()
  expect(radios[0]!.getAttribute('aria-disabled')).toBe('true')
  expect(radios[0]!.getAttribute('tabindex')).toBe('-1')
})

test('disabling the first radio moves the tab stop to the next enabled radio', () => {
  const { radios } = mount()
  expect(radios[0]!.getAttribute('tabindex')).toBe('0')

  radios[0]!.setAttribute('disabled', '')

  expect(radios[0]!.getAttribute('tabindex')).toBe('-1')
  expect(radios[1]!.getAttribute('tabindex')).toBe('0')
})
