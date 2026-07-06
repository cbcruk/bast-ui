import { FASTElement } from '@microsoft/fast-element'

export interface ToggleCheckedChangeDetail {
  checked: boolean
}

/**
 * Shared behavior for single on/off controls (Switch, Checkbox): `checked` /
 * `disabled` state, Space-to-toggle, `aria-checked`, and `data-*` reflection.
 * Concrete subclasses supply the ARIA role and call `define()` with their own
 * attribute list.
 */
export abstract class ToggleElement extends FASTElement {
  declare checked: boolean
  declare disabled: boolean

  protected abstract readonly toggleRole: string

  constructor() {
    super()
    this.checked = false
    this.disabled = false
  }

  override connectedCallback(): void {
    super.connectedCallback()

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', this.toggleRole)
    }

    this.addEventListener('click', this.handleActivate)
    this.addEventListener('keydown', this.handleKeydown)
    this.reflect()
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this.handleActivate)
    this.removeEventListener('keydown', this.handleKeydown)
    super.disconnectedCallback()
  }

  checkedChanged(): void {
    if (this.isConnected) {
      this.reflect()
    }
  }

  disabledChanged(): void {
    if (this.isConnected) {
      this.reflect()
    }
  }

  toggle(): void {
    this.setChecked(!this.checked)
  }

  setChecked(checked: boolean): void {
    if (this.disabled || checked === this.checked) {
      return
    }

    this.checked = checked
    this.$emit('checkedchange', { checked } satisfies ToggleCheckedChangeDetail)
  }

  protected resolveAriaChecked(): string {
    return String(this.checked)
  }

  protected reflect(): void {
    this.setAttribute('aria-checked', this.resolveAriaChecked())
    this.setAttribute('aria-disabled', String(this.disabled))
    this.setAttribute('tabindex', this.disabled ? '-1' : '0')
    this.toggleAttribute('data-checked', this.checked)
    this.toggleAttribute('data-unchecked', !this.checked)
    this.toggleAttribute('data-disabled', this.disabled)
  }

  private handleActivate = (): void => {
    this.toggle()
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === ' ') {
      event.preventDefault()
      this.toggle()
    }
  }
}
