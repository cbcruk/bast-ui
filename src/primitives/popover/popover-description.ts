import { PopoverPart } from './popover-part.ts'
import type { PopoverContextValue } from './popover.context.ts'

export class PopoverDescription extends PopoverPart {
  protected readonly observedKeys = [] as const

  override disconnectedCallback(): void {
    this.root?.setHasDescription(false)
    super.disconnectedCallback()
  }

  protected sync(root: PopoverContextValue): void {
    if (!this.id) {
      this.id = root.descriptionId
    }

    root.setHasDescription(true)
  }
}

void PopoverDescription.define({
  name: 'bast-popover-description',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-popover-description': PopoverDescription
  }
}
