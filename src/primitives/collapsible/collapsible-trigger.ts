import { CollapsiblePart } from './collapsible-part.ts'
import type { CollapsibleContextValue } from './collapsible.context.ts'

export class CollapsibleTrigger extends CollapsiblePart {
  override connectedCallback(): void {
    super.connectedCallback()

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button')
    }

    this.addEventListener('click', this.handleActivate)
    this.addEventListener('keydown', this.handleKeydown)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this.handleActivate)
    this.removeEventListener('keydown', this.handleKeydown)
    super.disconnectedCallback()
  }

  private handleActivate = (): void => {
    this.root?.toggle()
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.root?.toggle()
    }
  }

  protected sync(root: CollapsibleContextValue): void {
    if (!this.id) {
      this.id = root.triggerId
    }

    this.setAttribute('aria-expanded', String(root.open))
    this.setAttribute('aria-controls', root.panelId)
    this.setAttribute('aria-disabled', String(root.disabled))
    this.setAttribute('tabindex', root.disabled ? '-1' : '0')
    this.toggleAttribute('data-open', root.open)
    this.toggleAttribute('data-closed', !root.open)
    this.toggleAttribute('data-disabled', root.disabled)
  }
}

void CollapsibleTrigger.define({
  name: 'bast-collapsible-trigger',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-collapsible-trigger': CollapsibleTrigger
  }
}
