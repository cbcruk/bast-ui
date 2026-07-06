import { TooltipPart } from './tooltip-part.ts'
import type { TooltipContextValue } from './tooltip.context.ts'

export class TooltipPopup extends TooltipPart {
  protected readonly observedKeys = ['open'] as const

  override connectedCallback(): void {
    super.connectedCallback()

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'tooltip')
    }
  }

  protected sync(root: TooltipContextValue): void {
    if (!this.id) {
      this.id = root.popupId
    }

    this.toggleAttribute('data-open', root.open)
    this.toggleAttribute('data-closed', !root.open)
  }
}

void TooltipPopup.define({
  name: 'bast-tooltip-popup',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-tooltip-popup': TooltipPopup
  }
}
