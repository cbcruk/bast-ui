import { Context } from '@microsoft/fast-element/context.js'

export interface ToastContextValue {
  readonly open: boolean
  readonly titleId: string
  readonly descriptionId: string
  readonly hasTitle: boolean
  readonly hasDescription: boolean
  requestClose(): void
  setHasTitle(value: boolean): void
  setHasDescription(value: boolean): void
}

export const ToastContext = Context.create<ToastContextValue>('bast-toast')
