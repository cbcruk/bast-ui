import { expect, test } from 'vite-plus/test'
import { computePosition, type PositionOptions } from '../src/utilities/position.ts'

const anchor = { x: 100, y: 100, width: 80, height: 40 }
const floating = { width: 120, height: 60 }
const viewport = { width: 1000, height: 800 }

function options(overrides: Partial<PositionOptions> = {}): PositionOptions {
  return {
    side: 'bottom',
    align: 'center',
    sideOffset: 8,
    alignOffset: 0,
    padding: 8,
    ...overrides,
  }
}

test('bottom-center places below and horizontally centered', () => {
  const result = computePosition(anchor, floating, viewport, options())

  expect(result.side).toBe('bottom')
  expect(result.y).toBe(anchor.y + anchor.height + 8)
  expect(result.x).toBe(anchor.x + anchor.width / 2 - floating.width / 2)
})

test('top places above the anchor', () => {
  const result = computePosition(anchor, floating, viewport, options({ side: 'top' }))

  expect(result.side).toBe('top')
  expect(result.y).toBe(anchor.y - floating.height - 8)
})

test('start alignment left-aligns to the anchor', () => {
  const result = computePosition(anchor, floating, viewport, options({ align: 'start' }))

  expect(result.x).toBe(anchor.x)
})

test('flips to top when there is no room below', () => {
  const nearBottom = { x: 100, y: 760, width: 80, height: 40 }

  const result = computePosition(nearBottom, floating, viewport, options())

  expect(result.side).toBe('top')
  expect(result.y).toBe(nearBottom.y - floating.height - 8)
})

test('does not flip when the opposite side also overflows', () => {
  const tall = { width: 120, height: 790 }
  const nearBottom = { x: 100, y: 760, width: 80, height: 40 }

  const result = computePosition(nearBottom, tall, viewport, options())

  expect(result.side).toBe('bottom')
})

test('shifts back inside the viewport padding', () => {
  const nearRightEdge = { x: 960, y: 100, width: 80, height: 40 }

  const result = computePosition(nearRightEdge, floating, viewport, options())

  expect(result.x).toBe(viewport.width - floating.width - 8)
})

test('right side offsets horizontally from the anchor', () => {
  const result = computePosition(anchor, floating, viewport, options({ side: 'right' }))

  expect(result.side).toBe('right')
  expect(result.x).toBe(anchor.x + anchor.width + 8)
})
