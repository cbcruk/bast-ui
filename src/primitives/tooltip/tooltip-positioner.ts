import { TooltipPart } from './tooltip-part.ts'
import type { TooltipContextValue } from './tooltip.context.ts'
import { computePosition } from '../../utilities/position.ts'

const SUPPORTS_POPOVER =
  typeof HTMLElement !== 'undefined' && typeof HTMLElement.prototype.showPopover === 'function'

const VIEWPORT_PADDING = 8

export class TooltipPositioner extends TooltipPart {
  protected readonly observedKeys = ['open', 'side', 'align', 'sideOffset', 'alignOffset'] as const

  private teardown: (() => void) | undefined

  override connectedCallback(): void {
    super.connectedCallback()

    this.style.position = 'fixed'
    this.style.margin = '0'

    this.addEventListener('pointerenter', this.handlePointerEnter)
    this.addEventListener('pointerleave', this.handlePointerLeave)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('pointerenter', this.handlePointerEnter)
    this.removeEventListener('pointerleave', this.handlePointerLeave)
    this.deactivate()
    super.disconnectedCallback()
  }

  private handlePointerEnter = (): void => {
    this.root?.cancelPending()
  }

  private handlePointerLeave = (): void => {
    this.root?.scheduleClose()
  }

  protected sync(root: TooltipContextValue): void {
    this.toggleAttribute('data-open', root.open)
    this.toggleAttribute('data-closed', !root.open)

    if (!SUPPORTS_POPOVER) {
      this.hidden = !root.open
    }

    if (root.open) {
      this.activate(root)
      this.reposition(root)
    } else {
      this.deactivate()
    }
  }

  private activate(root: TooltipContextValue): void {
    if (this.teardown) {
      return
    }

    if (SUPPORTS_POPOVER) {
      this.setAttribute('popover', 'manual')
      this.showPopover()
    }

    const reposition = (): void => {
      this.reposition(root)
    }
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)

    const handleKeydown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        root.requestClose()
      }
    }
    document.addEventListener('keydown', handleKeydown, true)

    this.teardown = () => {
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
      document.removeEventListener('keydown', handleKeydown, true)

      if (SUPPORTS_POPOVER) {
        this.hidePopover()
      }
    }
  }

  private deactivate(): void {
    if (!this.teardown) {
      return
    }

    this.teardown()
    this.teardown = undefined
  }

  private reposition(root: TooltipContextValue): void {
    const trigger = root.getTrigger()
    if (!trigger) {
      return
    }

    const anchor = trigger.getBoundingClientRect()
    const self = this.getBoundingClientRect()
    const result = computePosition(
      { x: anchor.x, y: anchor.y, width: anchor.width, height: anchor.height },
      { width: self.width, height: self.height },
      { width: window.innerWidth, height: window.innerHeight },
      {
        side: root.side,
        align: root.align,
        sideOffset: root.sideOffset,
        alignOffset: root.alignOffset,
        padding: VIEWPORT_PADDING,
      },
    )

    this.style.left = `${result.x}px`
    this.style.top = `${result.y}px`
    this.setAttribute('data-side', result.side)
  }
}

void TooltipPositioner.define({
  name: 'bast-tooltip-positioner',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-tooltip-positioner': TooltipPositioner
  }
}
