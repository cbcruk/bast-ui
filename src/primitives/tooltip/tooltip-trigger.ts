import { TooltipPart } from './tooltip-part.ts'
import type { TooltipContextValue } from './tooltip.context.ts'

export class TooltipTrigger extends TooltipPart {
  protected readonly observedKeys = ['open'] as const

  override connectedCallback(): void {
    super.connectedCallback()

    this.root?.setTrigger(this)

    this.addEventListener('pointerenter', this.handlePointerEnter)
    this.addEventListener('pointerleave', this.handlePointerLeave)
    this.addEventListener('focusin', this.handleFocusIn)
    this.addEventListener('focusout', this.handleFocusOut)
    this.addEventListener('keydown', this.handleKeydown)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('pointerenter', this.handlePointerEnter)
    this.removeEventListener('pointerleave', this.handlePointerLeave)
    this.removeEventListener('focusin', this.handleFocusIn)
    this.removeEventListener('focusout', this.handleFocusOut)
    this.removeEventListener('keydown', this.handleKeydown)
    this.root?.setTrigger(null)
    super.disconnectedCallback()
  }

  private handlePointerEnter = (): void => {
    this.root?.scheduleOpen()
  }

  private handlePointerLeave = (): void => {
    this.root?.scheduleClose()
  }

  private handleFocusIn = (): void => {
    this.root?.requestOpen()
  }

  private handleFocusOut = (): void => {
    this.root?.requestClose()
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.root?.open) {
      this.root.requestClose()
    }
  }

  protected sync(root: TooltipContextValue): void {
    if (!this.id) {
      this.id = root.triggerId
    }

    if (root.open) {
      this.setAttribute('aria-describedby', root.popupId)
    } else {
      this.removeAttribute('aria-describedby')
    }

    this.toggleAttribute('data-open', root.open)
    this.toggleAttribute('data-closed', !root.open)
  }
}

void TooltipTrigger.define({
  name: 'bast-tooltip-trigger',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-tooltip-trigger': TooltipTrigger
  }
}
