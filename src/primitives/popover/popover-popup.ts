import { PopoverPart } from './popover-part.ts'
import type { PopoverContextValue } from './popover.context.ts'

export class PopoverPopup extends PopoverPart {
  protected readonly observedKeys = ['open', 'hasTitle', 'hasDescription'] as const

  override connectedCallback(): void {
    super.connectedCallback()

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'dialog')
    }
  }

  protected sync(root: PopoverContextValue): void {
    if (!this.id) {
      this.id = root.popupId
    }

    if (root.hasTitle) {
      this.setAttribute('aria-labelledby', root.titleId)
    } else {
      this.removeAttribute('aria-labelledby')
    }

    if (root.hasDescription) {
      this.setAttribute('aria-describedby', root.descriptionId)
    } else {
      this.removeAttribute('aria-describedby')
    }

    this.toggleAttribute('data-open', root.open)
    this.toggleAttribute('data-closed', !root.open)
  }
}

void PopoverPopup.define({
  name: 'bast-popover-popup',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-popover-popup': PopoverPopup
  }
}
