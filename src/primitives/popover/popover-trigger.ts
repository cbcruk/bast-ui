import { PopoverPart } from './popover-part.ts'
import type { PopoverContextValue } from './popover.context.ts'

export class PopoverTrigger extends PopoverPart {
  protected readonly observedKeys = ['open'] as const

  override connectedCallback(): void {
    super.connectedCallback()

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button')
    }
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0')
    }
    this.setAttribute('aria-haspopup', 'dialog')
    this.root?.setTrigger(this)

    this.addEventListener('click', this.handleActivate)
    this.addEventListener('keydown', this.handleKeydown)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this.handleActivate)
    this.removeEventListener('keydown', this.handleKeydown)
    this.root?.setTrigger(null)
    super.disconnectedCallback()
  }

  private handleActivate = (): void => {
    this.root?.setReturnFocus(this)
    this.root?.toggle()
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.handleActivate()
    }
  }

  protected sync(root: PopoverContextValue): void {
    if (!this.id) {
      this.id = root.triggerId
    }

    this.setAttribute('aria-expanded', String(root.open))
    this.setAttribute('aria-controls', root.popupId)
    this.toggleAttribute('data-open', root.open)
    this.toggleAttribute('data-closed', !root.open)
  }
}

void PopoverTrigger.define({
  name: 'bast-popover-trigger',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-popover-trigger': PopoverTrigger
  }
}
