import { ToastPart } from './toast-part.ts'
import type { ToastContextValue } from './toast.context.ts'

export class ToastClose extends ToastPart {
  protected readonly observedKeys = [] as const

  override connectedCallback(): void {
    super.connectedCallback()

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button')
    }
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0')
    }

    this.addEventListener('click', this.handleClose)
    this.addEventListener('keydown', this.handleKeydown)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this.handleClose)
    this.removeEventListener('keydown', this.handleKeydown)
    super.disconnectedCallback()
  }

  private handleClose = (): void => {
    this.root?.requestClose()
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.handleClose()
    }
  }

  protected sync(_root: ToastContextValue): void {}
}

void ToastClose.define({
  name: 'bast-toast-close',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-toast-close': ToastClose
  }
}
