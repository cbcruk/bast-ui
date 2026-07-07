import { FASTElement, nullableNumberConverter } from '@microsoft/fast-element'
import { TooltipContext, type TooltipContextValue } from './tooltip.context.ts'
import type { TooltipOpenChangeDetail } from './tooltip.types.ts'
import type { Align, Side } from '../../utilities/position.ts'
import { createId } from '../../utilities/id.ts'

export class TooltipRoot extends FASTElement implements TooltipContextValue {
  declare open: boolean
  declare side: Side
  declare align: Align
  declare sideOffset: number
  declare alignOffset: number
  declare delay: number
  declare closeDelay: number

  readonly triggerId: string = createId('bast-tooltip-trigger')
  readonly popupId: string = createId('bast-tooltip-popup')

  private trigger: HTMLElement | null = null
  private timer: ReturnType<typeof setTimeout> | undefined

  constructor() {
    super()
    this.open = false
    this.side = 'top'
    this.align = 'center'
    this.sideOffset = 8
    this.alignOffset = 0
    this.delay = 600
    this.closeDelay = 0
  }

  override connectedCallback(): void {
    super.connectedCallback()
    TooltipContext.provide(this, this)
  }

  override disconnectedCallback(): void {
    this.cancelPending()
    super.disconnectedCallback()
  }

  requestOpen(): void {
    this.setOpen(true)
  }

  requestClose(): void {
    this.setOpen(false)
  }

  scheduleOpen(): void {
    this.cancelPending()
    this.timer = setTimeout(() => this.setOpen(true), this.delay)
  }

  scheduleClose(): void {
    this.cancelPending()
    this.timer = setTimeout(() => this.setOpen(false), this.closeDelay)
  }

  cancelPending(): void {
    if (this.timer !== undefined) {
      clearTimeout(this.timer)
      this.timer = undefined
    }
  }

  setOpen(open: boolean): void {
    this.cancelPending()

    if (open === this.open) {
      return
    }

    this.open = open
    this.$emit('openchange', { open } satisfies TooltipOpenChangeDetail)
  }

  getTrigger(): HTMLElement | null {
    return this.trigger
  }

  setTrigger(element: HTMLElement | null): void {
    this.trigger = element
  }
}

void TooltipRoot.define({
  name: 'bast-tooltip',
  shadowOptions: null,
  attributes: [
    { property: 'open', attribute: 'open', mode: 'boolean' },
    { property: 'side', attribute: 'side', mode: 'reflect' },
    { property: 'align', attribute: 'align', mode: 'reflect' },
    {
      property: 'sideOffset',
      attribute: 'side-offset',
      mode: 'reflect',
      converter: nullableNumberConverter,
    },
    {
      property: 'alignOffset',
      attribute: 'align-offset',
      mode: 'reflect',
      converter: nullableNumberConverter,
    },
    {
      property: 'delay',
      attribute: 'delay',
      mode: 'reflect',
      converter: nullableNumberConverter,
    },
    {
      property: 'closeDelay',
      attribute: 'close-delay',
      mode: 'reflect',
      converter: nullableNumberConverter,
    },
  ],
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-tooltip': TooltipRoot
  }
}
