// @vitest-environment happy-dom
import { beforeEach, expect, test } from 'vite-plus/test'
import '../src/index.ts'
import type { DialogRoot } from '../src/index.ts'

interface Fixture {
  root: DialogRoot
  trigger: HTMLElement
  backdrop: HTMLElement
  popup: HTMLElement
  title: HTMLElement
  description: HTMLElement
  close: HTMLElement
  input: HTMLInputElement
}

function mount(): Fixture {
  const root = document.createElement('bast-dialog')
  const trigger = document.createElement('bast-dialog-trigger')
  trigger.textContent = 'Open'

  const backdrop = document.createElement('bast-dialog-backdrop')
  const popup = document.createElement('bast-dialog-popup')
  const title = document.createElement('bast-dialog-title')
  title.textContent = 'Title'
  const description = document.createElement('bast-dialog-description')
  description.textContent = 'Description'
  const input = document.createElement('input')
  const close = document.createElement('bast-dialog-close')
  close.textContent = 'Close'

  popup.append(title, description, input, close)
  root.append(trigger, backdrop, popup)
  document.body.append(root)

  return { root, trigger, backdrop, popup, title, description, close, input }
}

beforeEach(() => {
  document.body.innerHTML = ''
})

test('dialog starts closed with popup hidden', () => {
  const { root, popup, trigger } = mount()

  expect(root.open).toBe(false)
  expect(popup.hidden).toBe(true)
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
  expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
})

test('trigger opens the dialog and reveals the popup', () => {
  const { root, trigger, popup } = mount()

  trigger.click()

  expect(root.open).toBe(true)
  expect(popup.hidden).toBe(false)
  expect(popup.hasAttribute('data-open')).toBe(true)
  expect(trigger.getAttribute('aria-expanded')).toBe('true')
})

test('popup is labelled and described by title and description', () => {
  const { trigger, popup, title, description } = mount()

  trigger.click()

  expect(popup.getAttribute('role')).toBe('dialog')
  expect(popup.getAttribute('aria-modal')).toBe('true')
  expect(popup.getAttribute('aria-labelledby')).toBe(title.id)
  expect(popup.getAttribute('aria-describedby')).toBe(description.id)
})

test('focus moves to the first focusable element on open', () => {
  const { trigger, input } = mount()

  trigger.click()

  expect(document.activeElement).toBe(input)
})

test('Escape closes the dialog', () => {
  const { root, trigger, popup } = mount()

  trigger.click()
  expect(root.open).toBe(true)

  popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

  expect(root.open).toBe(false)
  expect(popup.hidden).toBe(true)
})

test('clicking the backdrop closes the dialog', () => {
  const { root, trigger, backdrop } = mount()

  trigger.click()
  backdrop.click()

  expect(root.open).toBe(false)
})

test('close button closes the dialog', () => {
  const { root, trigger, close } = mount()

  trigger.click()
  close.click()

  expect(root.open).toBe(false)
})

test('focus returns to the trigger after closing', () => {
  const { root, trigger, close } = mount()

  trigger.focus()
  trigger.click()
  close.click()

  expect(root.open).toBe(false)
  expect(document.activeElement).toBe(trigger)
})

test('modal dialog locks body scroll while open', () => {
  const { trigger, close } = mount()

  trigger.click()
  expect(document.body.style.overflow).toBe('hidden')

  close.click()
  expect(document.body.style.overflow).not.toBe('hidden')
})

test('background siblings become inert while open', () => {
  const sibling = document.createElement('div')
  document.body.append(sibling)

  const { trigger, close } = mount()

  trigger.click()
  expect(sibling.hasAttribute('inert')).toBe(true)

  close.click()
  expect(sibling.hasAttribute('inert')).toBe(false)
})

test('non-modal dialog does not lock scroll', () => {
  const { root, trigger } = mount()
  root.setAttribute('modal', 'false')

  trigger.click()

  expect(root.modal).toBe(false)
  expect(document.body.style.overflow).not.toBe('hidden')
})
