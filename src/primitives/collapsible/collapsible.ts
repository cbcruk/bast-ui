import { FASTElement } from '@microsoft/fast-element'
import { CollapsibleContext, type CollapsibleContextValue } from './collapsible.context.ts'
import type { CollapsibleOpenChangeDetail } from './collapsible.types.ts'
import { createId } from '../../utilities/id.ts'

export class CollapsibleRoot extends FASTElement implements CollapsibleContextValue {
  declare open: boolean
  declare disabled: boolean

  readonly triggerId: string = createId('bast-collapsible-trigger')
  readonly panelId: string = createId('bast-collapsible-panel')

  constructor() {
    super()
    this.open = false
    this.disabled = false
  }

  override connectedCallback(): void {
    super.connectedCallback()
    CollapsibleContext.provide(this, this)
  }

  toggle(): void {
    this.setOpen(!this.open)
  }

  setOpen(open: boolean): void {
    if (this.disabled || open === this.open) {
      return
    }

    this.open = open
    this.$emit('openchange', { open } satisfies CollapsibleOpenChangeDetail)
  }
}

void CollapsibleRoot.define({
  name: 'bast-collapsible',
  shadowOptions: null,
  attributes: [
    { property: 'open', attribute: 'open', mode: 'boolean' },
    { property: 'disabled', attribute: 'disabled', mode: 'boolean' },
  ],
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-collapsible': CollapsibleRoot
  }
}
