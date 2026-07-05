import { DialogPart } from './dialog-part.ts'
import type { DialogContextValue } from './dialog.context.ts'

export class DialogDescription extends DialogPart {
  protected readonly observedKeys = [] as const

  override disconnectedCallback(): void {
    this.root?.setHasDescription(false)
    super.disconnectedCallback()
  }

  protected sync(root: DialogContextValue): void {
    if (!this.id) {
      this.id = root.descriptionId
    }

    root.setHasDescription(true)
  }
}

void DialogDescription.define({
  name: 'bast-dialog-description',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-dialog-description': DialogDescription
  }
}
