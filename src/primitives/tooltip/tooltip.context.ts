import { Context } from '@microsoft/fast-element/context.js'
import type { Align, Side } from '../../utilities/position.ts'

export interface TooltipContextValue {
  readonly open: boolean
  readonly side: Side
  readonly align: Align
  readonly sideOffset: number
  readonly alignOffset: number
  readonly delay: number
  readonly closeDelay: number
  readonly triggerId: string
  readonly popupId: string
  requestOpen(): void
  requestClose(): void
  scheduleOpen(): void
  scheduleClose(): void
  cancelPending(): void
  getTrigger(): HTMLElement | null
  setTrigger(element: HTMLElement | null): void
}

export const TooltipContext = Context.create<TooltipContextValue>('bast-tooltip')
