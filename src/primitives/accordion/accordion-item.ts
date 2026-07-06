import { AccordionPart } from './accordion-part.ts'
import type { AccordionContextValue } from './accordion.context.ts'

export class AccordionItem extends AccordionPart {
  declare value: string | undefined
  declare disabled: boolean

  constructor() {
    super()
    this.disabled = false
  }

  disabledChanged(): void {
    if (!this.isConnected) {
      return
    }

    this.resync()
    for (const part of this.querySelectorAll<AccordionPart>(
      'bast-accordion-trigger, bast-accordion-panel',
    )) {
      // Descendants may not be upgraded yet during initial parse; skip until they are.
      if (typeof part.resync === 'function') {
        part.resync()
      }
    }
  }

  protected sync(root: AccordionContextValue): void {
    const value = this.value
    if (value === undefined) {
      return
    }

    const open = root.isOpen(value)
    const disabled = this.disabled || root.disabled

    this.toggleAttribute('data-open', open)
    this.toggleAttribute('data-closed', !open)
    this.toggleAttribute('data-disabled', disabled)
  }
}

void AccordionItem.define({
  name: 'bast-accordion-item',
  shadowOptions: null,
  attributes: [
    { property: 'value', attribute: 'value', mode: 'reflect' },
    { property: 'disabled', attribute: 'disabled', mode: 'boolean' },
  ],
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-accordion-item': AccordionItem
  }
}
