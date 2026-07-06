import { Context } from '@microsoft/fast-element/context.js'
import type { AccordionOrientation } from './accordion.types.ts'

export interface AccordionContextValue {
  readonly value: string
  readonly orientation: AccordionOrientation
  readonly disabled: boolean
  isOpen(itemValue: string): boolean
  toggle(itemValue: string): void
  getTriggerId(itemValue: string): string
  getPanelId(itemValue: string): string
}

export const AccordionContext = Context.create<AccordionContextValue>('bast-accordion')
