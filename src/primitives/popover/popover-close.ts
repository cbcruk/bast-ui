import { PopoverPart } from './popover-part.ts'
import type { PopoverContextValue } from './popover.context.ts'

export class PopoverClose extends PopoverPart {
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

  protected sync(_root: PopoverContextValue): void {}
}

void PopoverClose.define({
  name: 'bast-popover-close',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-popover-close': PopoverClose
  }
}
