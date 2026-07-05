import { Context } from '@microsoft/fast-element/context.js'

export interface CollapsibleContextValue {
  readonly open: boolean
  readonly disabled: boolean
  readonly triggerId: string
  readonly panelId: string
  toggle(): void
  setOpen(open: boolean): void
}

export const CollapsibleContext = Context.create<CollapsibleContextValue>('bast-collapsible')
