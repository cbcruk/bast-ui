import { FASTElement } from '@microsoft/fast-element'
import { RadioGroupContext, type RadioGroupContextValue } from './radio-group.context.ts'
import type { RadioGroupOrientation, RadioGroupValueChangeDetail } from './radio-group.types.ts'

export class RadioGroupRoot extends FASTElement implements RadioGroupContextValue {
  declare value: string | undefined
  declare orientation: RadioGroupOrientation
  declare disabled: boolean

  constructor() {
    super()
    this.orientation = 'vertical'
    this.disabled = false
  }

  override connectedCallback(): void {
    super.connectedCallback()

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'radiogroup')
    }
    this.setAttribute('aria-orientation', this.orientation)
    RadioGroupContext.provide(this, this)
  }

  orientationChanged(): void {
    if (this.isConnected) {
      this.setAttribute('aria-orientation', this.orientation)
    }
  }

  setValue(value: string): void {
    if (this.disabled || value === this.value) {
      return
    }

    this.value = value
    this.$emit('valuechange', { value } satisfies RadioGroupValueChangeDetail)
  }
}

void RadioGroupRoot.define({
  name: 'bast-radio-group',
  shadowOptions: null,
  attributes: [
    { property: 'value', attribute: 'value', mode: 'reflect' },
    { property: 'orientation', attribute: 'orientation', mode: 'reflect' },
    { property: 'disabled', attribute: 'disabled', mode: 'boolean' },
  ],
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-radio-group': RadioGroupRoot
  }
}
