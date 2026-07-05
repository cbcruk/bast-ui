import { CollapsiblePart } from './collapsible-part.ts'
import type { CollapsibleContextValue } from './collapsible.context.ts'

export class CollapsiblePanel extends CollapsiblePart {
  override connectedCallback(): void {
    super.connectedCallback()

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'region')
    }
  }

  protected sync(root: CollapsibleContextValue): void {
    if (!this.id) {
      this.id = root.panelId
    }

    this.setAttribute('aria-labelledby', root.triggerId)
    this.hidden = !root.open
    this.toggleAttribute('data-open', root.open)
    this.toggleAttribute('data-closed', !root.open)
  }
}

void CollapsiblePanel.define({
  name: 'bast-collapsible-panel',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-collapsible-panel': CollapsiblePanel
  }
}
