import { FASTElement, Observable, nullableNumberConverter } from '@microsoft/fast-element'
import { PopoverContext, type PopoverContextValue } from './popover.context.ts'
import type { PopoverOpenChangeDetail } from './popover.types.ts'
import type { Align, Side } from '../../utilities/position.ts'
import { createId } from '../../utilities/id.ts'

export class PopoverRoot extends FASTElement implements PopoverContextValue {
  declare open: boolean
  declare side: Side
  declare align: Align
  declare sideOffset: number
  declare alignOffset: number
  declare hasTitle: boolean
  declare hasDescription: boolean

  readonly triggerId: string = createId('bast-popover-trigger')
  readonly popupId: string = createId('bast-popover-popup')
  readonly titleId: string = createId('bast-popover-title')
  readonly descriptionId: string = createId('bast-popover-description')

  private trigger: HTMLElement | null = null
  private returnFocus: HTMLElement | null = null

  constructor() {
    super()
    this.open = false
    this.side = 'bottom'
    this.align = 'center'
    this.sideOffset = 8
    this.alignOffset = 0
    this.hasTitle = false
    this.hasDescription = false
  }

  override connectedCallback(): void {
    super.connectedCallback()
    PopoverContext.provide(this, this)
  }

  requestOpen(): void {
    this.setOpen(true)
  }

  requestClose(): void {
    this.setOpen(false)
  }

  toggle(): void {
    this.setOpen(!this.open)
  }

  setOpen(open: boolean): void {
    if (open === this.open) {
      return
    }

    if (open && !this.returnFocus) {
      this.returnFocus = document.activeElement as HTMLElement | null
    }

    this.open = open
    this.$emit('openchange', { open } satisfies PopoverOpenChangeDetail)
  }

  setHasTitle(value: boolean): void {
    this.hasTitle = value
  }

  setHasDescription(value: boolean): void {
    this.hasDescription = value
  }

  getTrigger(): HTMLElement | null {
    return this.trigger
  }

  setTrigger(element: HTMLElement | null): void {
    this.trigger = element
  }

  getReturnFocus(): HTMLElement | null {
    return this.returnFocus
  }

  setReturnFocus(element: HTMLElement | null): void {
    this.returnFocus = element
  }
}

Observable.defineProperty(PopoverRoot.prototype, 'hasTitle')
Observable.defineProperty(PopoverRoot.prototype, 'hasDescription')

void PopoverRoot.define({
  name: 'bast-popover',
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
  ],
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-popover': PopoverRoot
  }
}
