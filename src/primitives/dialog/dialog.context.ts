import { Context } from '@microsoft/fast-element/context.js'

export interface DialogContextValue {
  readonly open: boolean
  readonly modal: boolean
  readonly hasTitle: boolean
  readonly hasDescription: boolean
  readonly triggerId: string
  readonly popupId: string
  readonly titleId: string
  readonly descriptionId: string
  requestOpen(): void
  requestClose(): void
  setOpen(open: boolean): void
  setHasTitle(value: boolean): void
  setHasDescription(value: boolean): void
  setReturnFocus(element: HTMLElement | null): void
  getReturnFocus(): HTMLElement | null
}

export const DialogContext = Context.create<DialogContextValue>('bast-dialog')
