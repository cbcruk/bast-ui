import { RadioGroupPart } from './radio-group-part.ts'
import type { RadioGroupContextValue } from './radio-group.context.ts'

export class Radio extends RadioGroupPart {
  declare value: string | undefined
  declare disabled: boolean

  constructor() {
    super()
    this.disabled = false
  }

  override connectedCallback(): void {
    super.connectedCallback()

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'radio')
    }

    this.addEventListener('click', this.handleActivate)
    this.addEventListener('keydown', this.handleKeydown)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this.handleActivate)
    this.removeEventListener('keydown', this.handleKeydown)
    super.disconnectedCallback()
  }

  disabledChanged(): void {
    if (!this.isConnected) {
      return
    }

    // A radio's disabled state can shift which radio is tabbable, so re-sync
    // every radio in the group (guarded — siblings may not be upgraded yet).
    const group = this.closest('bast-radio-group')
    if (!group) {
      this.resync()

      return
    }

    for (const radio of group.querySelectorAll<Radio>('bast-radio')) {
      if (typeof radio.resync === 'function') {
        radio.resync()
      }
    }
  }

  private isDisabled(): boolean {
    return this.disabled || (this.root?.disabled ?? false)
  }

  private getEnabledRadios(): HTMLElement[] {
    const group = this.closest('bast-radio-group')
    if (!group) {
      return []
    }

    return Array.from(group.querySelectorAll<HTMLElement>('bast-radio')).filter(
      (radio) => !radio.hasAttribute('disabled'),
    )
  }

  private handleActivate = (): void => {
    if (this.isDisabled() || this.value === undefined) {
      return
    }

    this.root?.setValue(this.value)
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === ' ') {
      event.preventDefault()
      this.handleActivate()

      return
    }

    const horizontal = this.root?.orientation === 'horizontal'
    const nextKey = horizontal ? 'ArrowRight' : 'ArrowDown'
    const prevKey = horizontal ? 'ArrowLeft' : 'ArrowUp'

    const radios = this.getEnabledRadios()
    if (radios.length === 0) {
      return
    }

    const current = radios.indexOf(this)
    let next = -1

    if (event.key === nextKey) {
      next = current < 0 ? 0 : (current + 1) % radios.length
    } else if (event.key === prevKey) {
      next = current < 0 ? radios.length - 1 : (current - 1 + radios.length) % radios.length
    } else if (event.key === 'Home') {
      next = 0
    } else if (event.key === 'End') {
      next = radios.length - 1
    } else {
      return
    }

    event.preventDefault()

    const target = radios[next]!
    target.focus()
    const value = target.getAttribute('value')
    if (value !== null) {
      this.root?.setValue(value)
    }
  }

  private isFirstEnabled(): boolean {
    return this.getEnabledRadios()[0] === this
  }

  protected sync(root: RadioGroupContextValue): void {
    const value = this.value
    if (value === undefined) {
      return
    }

    const checked = root.value === value
    const disabled = this.isDisabled()
    const noneChecked = !root.value

    this.setAttribute('aria-checked', String(checked))
    this.setAttribute('aria-disabled', String(disabled))

    if (disabled) {
      this.setAttribute('tabindex', '-1')
    } else if (checked || (noneChecked && this.isFirstEnabled())) {
      this.setAttribute('tabindex', '0')
    } else {
      this.setAttribute('tabindex', '-1')
    }

    this.toggleAttribute('data-checked', checked)
    this.toggleAttribute('data-unchecked', !checked)
    this.toggleAttribute('data-disabled', disabled)
  }
}

void Radio.define({
  name: 'bast-radio',
  shadowOptions: null,
  attributes: [
    { property: 'value', attribute: 'value', mode: 'reflect' },
    { property: 'disabled', attribute: 'disabled', mode: 'boolean' },
  ],
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-radio': Radio
  }
}
