import { SelectPart } from './select-part.ts'
import type { SelectContextValue } from './select.context.ts'

export class SelectOption extends SelectPart {
  protected readonly observedKeys = ['value'] as const

  declare value: string | undefined
  declare disabled: boolean

  constructor() {
    super()
    this.disabled = false
  }

  override connectedCallback(): void {
    super.connectedCallback()

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'option')
    }
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '-1')
    }

    this.addEventListener('click', this.handleActivate)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this.handleActivate)
    super.disconnectedCallback()
  }

  disabledChanged(): void {
    if (this.isConnected) {
      this.resync()
    }
  }

  private handleActivate = (): void => {
    if (this.disabled || this.value === undefined) {
      return
    }

    this.root?.selectValue(this.value)
  }

  protected sync(root: SelectContextValue): void {
    const selected = this.value !== undefined && root.value === this.value

    this.setAttribute('aria-selected', String(selected))
    this.setAttribute('aria-disabled', String(this.disabled))
    this.toggleAttribute('data-selected', selected)
    this.toggleAttribute('data-disabled', this.disabled)
  }
}

void SelectOption.define({
  name: 'bast-select-option',
  shadowOptions: null,
  attributes: [
    { property: 'value', attribute: 'value', mode: 'reflect' },
    { property: 'disabled', attribute: 'disabled', mode: 'boolean' },
  ],
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-select-option': SelectOption
  }
}
