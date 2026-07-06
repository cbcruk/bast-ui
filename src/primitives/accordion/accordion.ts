import { FASTElement } from '@microsoft/fast-element'
import { AccordionContext, type AccordionContextValue } from './accordion.context.ts'
import type { AccordionOrientation, AccordionValueChangeDetail } from './accordion.types.ts'
import { createId } from '../../utilities/id.ts'

export class AccordionRoot extends FASTElement implements AccordionContextValue {
  declare value: string
  declare orientation: AccordionOrientation
  declare multiple: boolean
  declare disabled: boolean

  readonly baseId: string = createId('bast-accordion')

  constructor() {
    super()
    this.value = ''
    this.orientation = 'vertical'
    this.multiple = false
    this.disabled = false
  }

  override connectedCallback(): void {
    super.connectedCallback()
    AccordionContext.provide(this, this)
  }

  private parse(): string[] {
    return this.value ? this.value.split(',').filter(Boolean) : []
  }

  isOpen(itemValue: string): boolean {
    return this.parse().includes(itemValue)
  }

  toggle(itemValue: string): void {
    if (this.disabled) {
      return
    }

    const open = this.parse()
    const next = open.includes(itemValue)
      ? open.filter((value) => value !== itemValue)
      : this.multiple
        ? [...open, itemValue]
        : [itemValue]

    this.value = next.join(',')
    this.$emit('valuechange', { value: next } satisfies AccordionValueChangeDetail)
  }

  getTriggerId(itemValue: string): string {
    return `${this.baseId}-trigger-${itemValue}`
  }

  getPanelId(itemValue: string): string {
    return `${this.baseId}-panel-${itemValue}`
  }
}

void AccordionRoot.define({
  name: 'bast-accordion',
  shadowOptions: null,
  attributes: [
    { property: 'value', attribute: 'value', mode: 'reflect' },
    { property: 'orientation', attribute: 'orientation', mode: 'reflect' },
    { property: 'multiple', attribute: 'multiple', mode: 'boolean' },
    { property: 'disabled', attribute: 'disabled', mode: 'boolean' },
  ],
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-accordion': AccordionRoot
  }
}
