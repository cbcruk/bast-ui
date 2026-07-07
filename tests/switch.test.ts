// @vitest-environment happy-dom
import { beforeEach, expect, test } from 'vite-plus/test'
import '../src/index.ts'
import type { Switch } from '../src/index.ts'

function mount(attrs: { checked?: boolean; disabled?: boolean } = {}): Switch {
  const el = document.createElement('bast-switch')
  if (attrs.checked) {
    el.setAttribute('checked', '')
  }
  if (attrs.disabled) {
    el.setAttribute('disabled', '')
  }
  document.body.append(el)

  return el as Switch
}

beforeEach(() => {
  document.body.innerHTML = ''
})

test('exposes switch role and unchecked state by default', () => {
  const el = mount()

  expect(el.getAttribute('role')).toBe('switch')
  expect(el.getAttribute('aria-checked')).toBe('false')
  expect(el.getAttribute('tabindex')).toBe('0')
  expect(el.hasAttribute('data-unchecked')).toBe(true)
})

test('initial checked attribute reflects to aria-checked and data-checked', () => {
  const el = mount({ checked: true })

  expect(el.getAttribute('aria-checked')).toBe('true')
  expect(el.hasAttribute('data-checked')).toBe(true)
})

test('click toggles checked and emits checkedchange', () => {
  const el = mount()
  const events: boolean[] = []
  el.addEventListener('checkedchange', (event) => {
    events.push((event as CustomEvent<{ checked: boolean }>).detail.checked)
  })

  el.click()
  expect(el.checked).toBe(true)
  expect(el.getAttribute('aria-checked')).toBe('true')

  el.click()
  expect(el.checked).toBe(false)
  expect(events).toEqual([true, false])
})

test('Space toggles the switch', () => {
  const el = mount()

  el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
  expect(el.checked).toBe(true)
})

test('disabled switch ignores activation', () => {
  const el = mount({ disabled: true })

  el.click()
  expect(el.checked).toBe(false)
  expect(el.getAttribute('aria-disabled')).toBe('true')
  expect(el.getAttribute('tabindex')).toBe('-1')
})

test('toggling disabled dynamically updates reflection', () => {
  const el = mount()

  el.setAttribute('disabled', '')
  expect(el.getAttribute('tabindex')).toBe('-1')
  expect(el.getAttribute('aria-disabled')).toBe('true')

  el.removeAttribute('disabled')
  expect(el.getAttribute('tabindex')).toBe('0')
})
