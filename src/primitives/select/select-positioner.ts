import { SelectPart } from './select-part.ts'
import type { SelectContextValue } from './select.context.ts'
import { computePosition } from '../../utilities/position.ts'

const SUPPORTS_POPOVER =
  typeof HTMLElement !== 'undefined' && typeof HTMLElement.prototype.showPopover === 'function'

const VIEWPORT_PADDING = 8

export class SelectPositioner extends SelectPart {
  protected readonly observedKeys = ['open', 'side', 'align', 'sideOffset', 'alignOffset'] as const

  private teardown: (() => void) | undefined

  override connectedCallback(): void {
    super.connectedCallback()

    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '-1')
    }
    this.style.position = 'fixed'
    this.style.margin = '0'
  }

  override disconnectedCallback(): void {
    this.deactivate()
    super.disconnectedCallback()
  }

  protected sync(root: SelectContextValue): void {
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

  private activate(root: SelectContextValue): void {
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

    const handlePointerDown = (event: Event): void => {
      const target = event.target as Node | null
      if (!target || this.contains(target)) {
        return
      }
      if (root.getTrigger()?.contains(target)) {
        return
      }
      root.requestClose()
    }
    document.addEventListener('pointerdown', handlePointerDown, true)

    const handleKeydown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault()
        root.requestClose()
      }
    }
    document.addEventListener('keydown', handleKeydown, true)

    this.teardown = () => {
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
      document.removeEventListener('pointerdown', handlePointerDown, true)
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

    const returnFocus = this.root?.getReturnFocus() ?? null
    this.root?.setReturnFocus(null)
    returnFocus?.focus()
  }

  private reposition(root: SelectContextValue): void {
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

void SelectPositioner.define({
  name: 'bast-select-positioner',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-select-positioner': SelectPositioner
  }
}
