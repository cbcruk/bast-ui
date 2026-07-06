import { FASTElement, nullableNumberConverter } from '@microsoft/fast-element'
import { SelectContext, type SelectContextValue } from './select.context.ts'
import type { SelectOpenChangeDetail, SelectValueChangeDetail } from './select.types.ts'
import type { Align, Side } from '../../utilities/position.ts'
import { createId } from '../../utilities/id.ts'

export class SelectRoot extends FASTElement implements SelectContextValue {
  declare open: boolean
  declare value: string | undefined
  declare side: Side
  declare align: Align
  declare sideOffset: number
  declare alignOffset: number
  declare disabled: boolean

  readonly triggerId: string = createId('bast-select-trigger')
  readonly popupId: string = createId('bast-select-popup')

  private trigger: HTMLElement | null = null
  private returnFocus: HTMLElement | null = null

  constructor() {
    super()
    this.open = false
    this.side = 'bottom'
    this.align = 'start'
    this.sideOffset = 4
    this.alignOffset = 0
    this.disabled = false
  }

  override connectedCallback(): void {
    super.connectedCallback()
    SelectContext.provide(this, this)
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
    if (open === this.open || (open && this.disabled)) {
      return
    }

    if (open && !this.returnFocus) {
      this.returnFocus = document.activeElement as HTMLElement | null
    }

    this.open = open
    this.$emit('openchange', { open } satisfies SelectOpenChangeDetail)
  }

  selectValue(value: string): void {
    if (value !== this.value) {
      this.value = value
      this.$emit('valuechange', { value } satisfies SelectValueChangeDetail)
    }

    this.requestClose()
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

void SelectRoot.define({
  name: 'bast-select',
  shadowOptions: null,
  attributes: [
    { property: 'open', attribute: 'open', mode: 'boolean' },
    { property: 'value', attribute: 'value', mode: 'reflect' },
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
    { property: 'disabled', attribute: 'disabled', mode: 'boolean' },
  ],
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-select': SelectRoot
  }
}
