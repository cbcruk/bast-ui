export type Side = 'top' | 'bottom' | 'left' | 'right'
export type Align = 'start' | 'center' | 'end'

export interface Size {
  width: number
  height: number
}

export interface Rect extends Size {
  x: number
  y: number
}

export interface PositionOptions {
  side: Side
  align: Align
  sideOffset: number
  alignOffset: number
  padding: number
}

export interface PositionResult {
  x: number
  y: number
  side: Side
}

const OPPOSITE: Record<Side, Side> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
}

function alignInline(anchor: Rect, floating: Size, align: Align, offset: number): number {
  if (align === 'start') {
    return anchor.x + offset
  }
  if (align === 'end') {
    return anchor.x + anchor.width - floating.width - offset
  }

  return anchor.x + anchor.width / 2 - floating.width / 2
}

function alignBlock(anchor: Rect, floating: Size, align: Align, offset: number): number {
  if (align === 'start') {
    return anchor.y + offset
  }
  if (align === 'end') {
    return anchor.y + anchor.height - floating.height - offset
  }

  return anchor.y + anchor.height / 2 - floating.height / 2
}

function place(
  side: Side,
  anchor: Rect,
  floating: Size,
  options: PositionOptions,
): { x: number; y: number } {
  const { sideOffset, alignOffset, align } = options

  if (side === 'top' || side === 'bottom') {
    const y =
      side === 'bottom'
        ? anchor.y + anchor.height + sideOffset
        : anchor.y - floating.height - sideOffset

    return { x: alignInline(anchor, floating, align, alignOffset), y }
  }

  const x =
    side === 'right' ? anchor.x + anchor.width + sideOffset : anchor.x - floating.width - sideOffset

  return { x, y: alignBlock(anchor, floating, align, alignOffset) }
}

function overflowsMainAxis(
  side: Side,
  coords: { x: number; y: number },
  floating: Size,
  viewport: Size,
  padding: number,
): boolean {
  switch (side) {
    case 'top':
      return coords.y < padding
    case 'bottom':
      return coords.y + floating.height > viewport.height - padding
    case 'left':
      return coords.x < padding
    case 'right':
      return coords.x + floating.width > viewport.width - padding
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max))
}

export function computePosition(
  anchor: Rect,
  floating: Size,
  viewport: Size,
  options: PositionOptions,
): PositionResult {
  let side = options.side
  let coords = place(side, anchor, floating, options)

  const opposite = OPPOSITE[side]
  const overflows = overflowsMainAxis(side, coords, floating, viewport, options.padding)
  const oppositeCoords = place(opposite, anchor, floating, options)
  const oppositeOverflows = overflowsMainAxis(
    opposite,
    oppositeCoords,
    floating,
    viewport,
    options.padding,
  )

  if (overflows && !oppositeOverflows) {
    side = opposite
    coords = oppositeCoords
  }

  return {
    x: clamp(coords.x, options.padding, viewport.width - floating.width - options.padding),
    y: clamp(coords.y, options.padding, viewport.height - floating.height - options.padding),
    side,
  }
}
