// @vitest-environment happy-dom
import { beforeEach, expect, test } from 'vite-plus/test'
import '../src/index.ts'
import type { TabsRoot } from '../src/index.ts'

interface Fixture {
  root: TabsRoot
  list: HTMLElement
  tabs: HTMLElement[]
  panels: HTMLElement[]
}

function mount(
  options: { value?: string; orientation?: string; activationMode?: string } = {},
): Fixture {
  const root = document.createElement('bast-tabs')
  if (options.value) {
    root.setAttribute('value', options.value)
  }
  if (options.orientation) {
    root.setAttribute('orientation', options.orientation)
  }
  if (options.activationMode) {
    root.setAttribute('activation-mode', options.activationMode)
  }

  const list = document.createElement('bast-tabs-list')
  const tabs = ['one', 'two', 'three'].map((value) => {
    const tab = document.createElement('bast-tabs-tab')
    tab.setAttribute('value', value)
    tab.textContent = value
    return tab
  })
  list.append(...tabs)

  const panels = ['one', 'two', 'three'].map((value) => {
    const panel = document.createElement('bast-tabs-panel')
    panel.setAttribute('value', value)
    panel.textContent = `Panel ${value}`
    return panel
  })

  root.append(list, ...panels)
  document.body.append(root)

  return { root, list, tabs, panels }
}

beforeEach(() => {
  document.body.innerHTML = ''
})

test('first tab is selected by default when no value is set', () => {
  const { root, tabs, panels } = mount()

  expect(root.value).toBe('one')
  expect(tabs[0]!.getAttribute('aria-selected')).toBe('true')
  expect(tabs[1]!.getAttribute('aria-selected')).toBe('false')
  expect(panels[0]!.hidden).toBe(false)
  expect(panels[1]!.hidden).toBe(true)
})

test('initial value attribute selects the matching tab and panel', () => {
  const { tabs, panels } = mount({ value: 'two' })

  expect(tabs[1]!.getAttribute('aria-selected')).toBe('true')
  expect(panels[1]!.hidden).toBe(false)
  expect(panels[0]!.hidden).toBe(true)
})

test('roving tabindex keeps only the selected tab tabbable', () => {
  const { tabs } = mount({ value: 'one' })

  expect(tabs[0]!.getAttribute('tabindex')).toBe('0')
  expect(tabs[1]!.getAttribute('tabindex')).toBe('-1')
  expect(tabs[2]!.getAttribute('tabindex')).toBe('-1')
})

test('clicking a tab selects it and emits valuechange', () => {
  const { root, tabs, panels } = mount({ value: 'one' })

  const events: string[] = []
  root.addEventListener('valuechange', (event) => {
    events.push((event as CustomEvent<{ value: string }>).detail.value)
  })

  tabs[2]!.click()

  expect(root.value).toBe('three')
  expect(tabs[2]!.getAttribute('aria-selected')).toBe('true')
  expect(panels[2]!.hidden).toBe(false)
  expect(panels[0]!.hidden).toBe(true)
  expect(events).toEqual(['three'])
})

test('aria wiring links each tab to its panel', () => {
  const { tabs, panels } = mount({ value: 'one' })

  expect(tabs[0]!.getAttribute('role')).toBe('tab')
  expect(panels[0]!.getAttribute('role')).toBe('tabpanel')
  expect(tabs[0]!.getAttribute('aria-controls')).toBe(panels[0]!.id)
  expect(panels[0]!.getAttribute('aria-labelledby')).toBe(tabs[0]!.id)
})

test('tablist exposes role and orientation', () => {
  const { list } = mount({ orientation: 'vertical' })

  expect(list.getAttribute('role')).toBe('tablist')
  expect(list.getAttribute('aria-orientation')).toBe('vertical')
})

test('arrow keys move selection in automatic mode and wrap around', () => {
  const { root, list, tabs } = mount({ value: 'one' })
  tabs[0]!.focus()

  list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
  expect(root.value).toBe('two')

  tabs[1]!.focus()
  list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
  expect(root.value).toBe('three')

  tabs[2]!.focus()
  list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
  expect(root.value).toBe('one')
})

test('vertical orientation navigates with up and down arrows', () => {
  const { root, list, tabs } = mount({ value: 'one', orientation: 'vertical' })
  tabs[0]!.focus()

  list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
  expect(root.value).toBe('two')

  tabs[1]!.focus()
  list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
  expect(root.value).toBe('one')
})

test('Home and End jump to the first and last tab', () => {
  const { root, list, tabs } = mount({ value: 'two' })
  tabs[1]!.focus()

  list.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
  expect(root.value).toBe('three')

  tabs[2]!.focus()
  list.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
  expect(root.value).toBe('one')
})

test('manual activation moves focus without selecting until Enter or Space', () => {
  const { root, list, tabs } = mount({ value: 'one', activationMode: 'manual' })
  tabs[0]!.focus()

  list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
  expect(root.value).toBe('one')
  expect(document.activeElement).toBe(tabs[1])

  tabs[1]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
  expect(root.value).toBe('two')

  root.setValue('one')
  tabs[0]!.focus()
  list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
  tabs[1]!.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
  expect(root.value).toBe('two')
})

test('disabled tabs are skipped during keyboard navigation and ignore activation', () => {
  const { root, list, tabs } = mount({ value: 'one' })
  tabs[1]!.setAttribute('disabled', '')

  tabs[0]!.focus()
  list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
  expect(root.value).toBe('three')
  expect(document.activeElement).toBe(tabs[2])

  root.setValue('one')
  tabs[1]!.click()
  expect(root.value).toBe('one')
  expect(tabs[1]!.getAttribute('aria-disabled')).toBe('true')
  expect(tabs[1]!.getAttribute('tabindex')).toBe('-1')
})
