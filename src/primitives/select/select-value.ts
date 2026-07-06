import { SelectPart } from './select-part.ts'
import type { SelectContextValue } from './select.context.ts'

export class SelectValue extends SelectPart {
  protected readonly observedKeys = ['value'] as const

  protected sync(root: SelectContextValue): void {
    const select = this.closest('bast-select')
    const options = select
      ? Array.from(select.querySelectorAll<HTMLElement>('bast-select-option'))
      : []
    const selected =
      root.value === undefined
        ? undefined
        : options.find((option) => option.getAttribute('value') === root.value)

    this.textContent = selected?.textContent ?? this.getAttribute('placeholder') ?? ''
    this.toggleAttribute('data-placeholder', selected === undefined)
  }
}

void SelectValue.define({
  name: 'bast-select-value',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-select-value': SelectValue
  }
}
