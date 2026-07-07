import { Context } from '@microsoft/fast-element/context.js'
import type { Align, Side } from '../../utilities/position.ts'

export interface SelectContextValue {
  readonly open: boolean
  readonly value: string | undefined
  readonly side: Side
  readonly align: Align
  readonly sideOffset: number
  readonly alignOffset: number
  readonly disabled: boolean
  readonly triggerId: string
  readonly popupId: string
  requestOpen(): void
  requestClose(): void
  toggle(): void
  setOpen(open: boolean): void
  selectValue(value: string): void
  getTrigger(): HTMLElement | null
  setTrigger(element: HTMLElement | null): void
  getReturnFocus(): HTMLElement | null
  setReturnFocus(element: HTMLElement | null): void
}

export const SelectContext = Context.create<SelectContextValue>('bast-select')
