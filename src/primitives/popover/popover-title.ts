import { PopoverPart } from './popover-part.ts'
import type { PopoverContextValue } from './popover.context.ts'

export class PopoverTitle extends PopoverPart {
  protected readonly observedKeys = [] as const

  override disconnectedCallback(): void {
    this.root?.setHasTitle(false)
    super.disconnectedCallback()
  }

  protected sync(root: PopoverContextValue): void {
    if (!this.id) {
      this.id = root.titleId
    }

    root.setHasTitle(true)
  }
}

void PopoverTitle.define({
  name: 'bast-popover-title',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-popover-title': PopoverTitle
  }
}
