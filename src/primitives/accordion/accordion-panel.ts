import { AccordionPart } from './accordion-part.ts'
import type { AccordionContextValue } from './accordion.context.ts'

export class AccordionPanel extends AccordionPart {
  override connectedCallback(): void {
    super.connectedCallback()

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'region')
    }
  }

  protected sync(root: AccordionContextValue): void {
    const value = this.itemValue()
    if (value === undefined) {
      return
    }

    if (!this.id) {
      this.id = root.getPanelId(value)
    }

    const open = root.isOpen(value)

    this.setAttribute('aria-labelledby', root.getTriggerId(value))
    this.hidden = !open
    this.toggleAttribute('data-open', open)
    this.toggleAttribute('data-closed', !open)
  }
}

void AccordionPanel.define({
  name: 'bast-accordion-panel',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-accordion-panel': AccordionPanel
  }
}
