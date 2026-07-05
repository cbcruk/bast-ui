import { FASTElement, Observable, type ValueConverter } from '@microsoft/fast-element'
import { DialogContext, type DialogContextValue } from './dialog.context.ts'
import type { DialogOpenChangeDetail } from './dialog.types.ts'
import { createId } from '../../utilities/id.ts'

const booleanDefaultTrue: ValueConverter = {
  toView(value: boolean): string | null {
    return value ? null : 'false'
  },
  fromView(value: unknown): boolean {
    return value !== 'false' && value !== false
  },
}

export class DialogRoot extends FASTElement implements DialogContextValue {
  declare open: boolean
  declare modal: boolean
  declare hasTitle: boolean
  declare hasDescription: boolean

  readonly triggerId: string = createId('bast-dialog-trigger')
  readonly popupId: string = createId('bast-dialog-popup')
  readonly titleId: string = createId('bast-dialog-title')
  readonly descriptionId: string = createId('bast-dialog-description')

  private returnFocus: HTMLElement | null = null

  constructor() {
    super()
    this.open = false
    this.modal = true
    this.hasTitle = false
    this.hasDescription = false
  }

  override connectedCallback(): void {
    super.connectedCallback()
    DialogContext.provide(this, this)
  }

  requestOpen(): void {
    this.setOpen(true)
  }

  requestClose(): void {
    this.setOpen(false)
  }

  setOpen(open: boolean): void {
    if (open === this.open) {
      return
    }

    if (open && !this.returnFocus) {
      this.returnFocus = document.activeElement as HTMLElement | null
    }

    this.open = open
    this.$emit('openchange', { open } satisfies DialogOpenChangeDetail)
  }

  setHasTitle(value: boolean): void {
    this.hasTitle = value
  }

  setHasDescription(value: boolean): void {
    this.hasDescription = value
  }

  setReturnFocus(element: HTMLElement | null): void {
    this.returnFocus = element
  }

  getReturnFocus(): HTMLElement | null {
    return this.returnFocus
  }
}

Observable.defineProperty(DialogRoot.prototype, 'hasTitle')
Observable.defineProperty(DialogRoot.prototype, 'hasDescription')

void DialogRoot.define({
  name: 'bast-dialog',
  shadowOptions: null,
  attributes: [
    { property: 'open', attribute: 'open', mode: 'boolean' },
    {
      property: 'modal',
      attribute: 'modal',
      mode: 'reflect',
      converter: booleanDefaultTrue,
    },
  ],
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-dialog': DialogRoot
  }
}
