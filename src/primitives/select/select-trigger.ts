import { SelectPart } from './select-part.ts'
import type { SelectContextValue } from './select.context.ts'

export class SelectTrigger extends SelectPart {
  protected readonly observedKeys = ['open', 'value', 'disabled'] as const

  override connectedCallback(): void {
    super.connectedCallback()

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'combobox')
    }
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0')
    }
    this.setAttribute('aria-haspopup', 'listbox')
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
    if (this.root?.disabled) {
      return
    }

    this.root?.setReturnFocus(this)
    this.root?.toggle()
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    const root = this.root
    if (!root || root.disabled) {
      return
    }

    if (
      event.key === 'Enter' ||
      event.key === ' ' ||
      event.key === 'ArrowDown' ||
      event.key === 'ArrowUp'
    ) {
      event.preventDefault()
      root.setReturnFocus(this)
      root.requestOpen()
    }
  }

  protected sync(root: SelectContextValue): void {
    if (!this.id) {
      this.id = root.triggerId
    }

    this.setAttribute('aria-expanded', String(root.open))
    this.setAttribute('aria-controls', root.popupId)
    this.setAttribute('aria-disabled', String(root.disabled))
    this.toggleAttribute('data-open', root.open)
    this.toggleAttribute('data-closed', !root.open)
    this.toggleAttribute('data-disabled', root.disabled)
  }
}

void SelectTrigger.define({
  name: 'bast-select-trigger',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-select-trigger': SelectTrigger
  }
}
