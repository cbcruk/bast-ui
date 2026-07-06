import { ToastPart } from './toast-part.ts'
import type { ToastContextValue } from './toast.context.ts'

export class ToastTitle extends ToastPart {
  protected readonly observedKeys = [] as const

  override disconnectedCallback(): void {
    this.root?.setHasTitle(false)
    super.disconnectedCallback()
  }

  protected sync(root: ToastContextValue): void {
    if (!this.id) {
      this.id = root.titleId
    }

    root.setHasTitle(true)
  }
}

void ToastTitle.define({
  name: 'bast-toast-title',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-toast-title': ToastTitle
  }
}
