import { DialogPart } from './dialog-part.ts'
import type { DialogContextValue } from './dialog.context.ts'

export class DialogBackdrop extends DialogPart {
  protected readonly observedKeys = ['open'] as const

  override connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('click', this.handleClick)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this.handleClick)
    super.disconnectedCallback()
  }

  private handleClick = (): void => {
    this.root?.requestClose()
  }

  protected sync(root: DialogContextValue): void {
    this.hidden = !root.open
    this.toggleAttribute('data-open', root.open)
    this.toggleAttribute('data-closed', !root.open)
  }
}

void DialogBackdrop.define({
  name: 'bast-dialog-backdrop',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-dialog-backdrop': DialogBackdrop
  }
}
