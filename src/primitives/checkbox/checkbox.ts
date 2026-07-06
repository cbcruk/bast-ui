import { ToggleElement } from '../shared/toggle-element.ts'

export class Checkbox extends ToggleElement {
  declare indeterminate: boolean

  protected readonly toggleRole = 'checkbox'

  constructor() {
    super()
    this.indeterminate = false
  }

  indeterminateChanged(): void {
    if (this.isConnected) {
      this.reflect()
    }
  }

  override toggle(): void {
    if (this.disabled) {
      return
    }

    // Clicking a mixed checkbox resolves it to checked, matching native behavior.
    if (this.indeterminate) {
      this.indeterminate = false
      this.setChecked(true)

      return
    }

    this.setChecked(!this.checked)
  }

  protected override resolveAriaChecked(): string {
    return this.indeterminate ? 'mixed' : String(this.checked)
  }

  protected override reflect(): void {
    super.reflect()
    this.toggleAttribute('data-indeterminate', this.indeterminate)
  }
}

void Checkbox.define({
  name: 'bast-checkbox',
  shadowOptions: null,
  attributes: [
    { property: 'checked', attribute: 'checked', mode: 'boolean' },
    { property: 'disabled', attribute: 'disabled', mode: 'boolean' },
    { property: 'indeterminate', attribute: 'indeterminate', mode: 'boolean' },
  ],
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-checkbox': Checkbox
  }
}
