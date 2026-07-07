import { ToastPart } from './toast-part.ts'
import type { ToastContextValue } from './toast.context.ts'

export class ToastDescription extends ToastPart {
  protected readonly observedKeys = [] as const

  override disconnectedCallback(): void {
    this.root?.setHasDescription(false)
    super.disconnectedCallback()
  }

  protected sync(root: ToastContextValue): void {
    if (!this.id) {
      this.id = root.descriptionId
    }

    root.setHasDescription(true)
  }
}

void ToastDescription.define({
  name: 'bast-toast-description',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-toast-description': ToastDescription
  }
}
