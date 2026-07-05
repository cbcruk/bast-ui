import { DialogPart } from './dialog-part.ts'
import type { DialogContextValue } from './dialog.context.ts'

export class DialogTitle extends DialogPart {
  protected readonly observedKeys = [] as const

  override disconnectedCallback(): void {
    this.root?.setHasTitle(false)
    super.disconnectedCallback()
  }

  protected sync(root: DialogContextValue): void {
    if (!this.id) {
      this.id = root.titleId
    }

    root.setHasTitle(true)
  }
}

void DialogTitle.define({
  name: 'bast-dialog-title',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-dialog-title': DialogTitle
  }
}
