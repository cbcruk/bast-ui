// @vitest-environment happy-dom
import { beforeEach, expect, test } from 'vite-plus/test'
import '../src/index.ts'
import type { Checkbox } from '../src/index.ts'

function mount(
  attrs: { checked?: boolean; disabled?: boolean; indeterminate?: boolean } = {},
): Checkbox {
  const el = document.createElement('bast-checkbox')
  if (attrs.checked) {
    el.setAttribute('checked', '')
  }
  if (attrs.disabled) {
    el.setAttribute('disabled', '')
  }
  if (attrs.indeterminate) {
    el.setAttribute('indeterminate', '')
  }
  document.body.append(el)

  return el as Checkbox
}

beforeEach(() => {
  document.body.innerHTML = ''
})

test('exposes checkbox role and unchecked state by default', () => {
  const el = mount()

  expect(el.getAttribute('role')).toBe('checkbox')
  expect(el.getAttribute('aria-checked')).toBe('false')
})

test('click toggles checked and emits checkedchange', () => {
  const el = mount()
  const events: boolean[] = []
  el.addEventListener('checkedchange', (event) => {
    events.push((event as CustomEvent<{ checked: boolean }>).detail.checked)
  })

  el.click()
  expect(el.checked).toBe(true)
  el.click()
  expect(el.checked).toBe(false)
  expect(events).toEqual([true, false])
})

test('indeterminate reports aria-checked mixed and a data attribute', () => {
  const el = mount({ indeterminate: true })

  expect(el.getAttribute('aria-checked')).toBe('mixed')
  expect(el.hasAttribute('data-indeterminate')).toBe(true)
})

test('clicking a mixed checkbox resolves to checked and clears indeterminate', () => {
  const el = mount({ indeterminate: true })

  el.click()

  expect(el.checked).toBe(true)
  expect(el.indeterminate).toBe(false)
  expect(el.getAttribute('aria-checked')).toBe('true')
  expect(el.hasAttribute('data-indeterminate')).toBe(false)
})

test('Space toggles the checkbox', () => {
  const el = mount()

  el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
  expect(el.checked).toBe(true)
})

test('disabled checkbox ignores activation', () => {
  const el = mount({ disabled: true })

  el.click()
  expect(el.checked).toBe(false)
  expect(el.getAttribute('aria-disabled')).toBe('true')
  expect(el.getAttribute('tabindex')).toBe('-1')
})
