import { Context } from '@microsoft/fast-element/context.js'
import type { Align, Side } from '../../utilities/position.ts'

export interface PopoverContextValue {
  readonly open: boolean
  readonly side: Side
  readonly align: Align
  readonly sideOffset: number
  readonly alignOffset: number
  readonly triggerId: string
  readonly popupId: string
  readonly titleId: string
  readonly descriptionId: string
  readonly hasTitle: boolean
  readonly hasDescription: boolean
  requestOpen(): void
  requestClose(): void
  toggle(): void
  setOpen(open: boolean): void
  setHasTitle(value: boolean): void
  setHasDescription(value: boolean): void
  getTrigger(): HTMLElement | null
  setTrigger(element: HTMLElement | null): void
  getReturnFocus(): HTMLElement | null
  setReturnFocus(element: HTMLElement | null): void
}

export const PopoverContext = Context.create<PopoverContextValue>('bast-popover')
