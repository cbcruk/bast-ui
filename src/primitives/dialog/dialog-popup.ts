import { DialogPart } from './dialog-part.ts'
import type { DialogContextValue } from './dialog.context.ts'
import { getFocusable, trapFocus } from '../../utilities/focus.ts'
import { lockScroll, unlockScroll } from '../../utilities/scroll-lock.ts'
import { inertSiblings } from '../../utilities/inert.ts'

const SUPPORTS_POPOVER =
  typeof HTMLElement !== 'undefined' && typeof HTMLElement.prototype.showPopover === 'function'

export class DialogPopup extends DialogPart {
  protected readonly observedKeys = ['open', 'modal', 'hasTitle', 'hasDescription'] as const

  private teardown: (() => void) | undefined

  override connectedCallback(): void {
    super.connectedCallback()

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'dialog')
    }
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '-1')
    }
  }

  override disconnectedCallback(): void {
    this.deactivate()
    super.disconnectedCallback()
  }

  protected sync(root: DialogContextValue): void {
    if (!this.id) {
      this.id = root.popupId
    }

    this.setAttribute('aria-modal', String(root.modal))

    if (root.hasTitle) {
      this.setAttribute('aria-labelledby', root.titleId)
    } else {
      this.removeAttribute('aria-labelledby')
    }

    if (root.hasDescription) {
      this.setAttribute('aria-describedby', root.descriptionId)
    } else {
      this.removeAttribute('aria-describedby')
    }

    this.toggleAttribute('data-open', root.open)
    this.toggleAttribute('data-closed', !root.open)

    if (!SUPPORTS_POPOVER) {
      this.hidden = !root.open
    }

    if (root.open) {
      this.activate(root)
    } else {
      this.deactivate()
    }
  }

  private activate(root: DialogContextValue): void {
    if (this.teardown) {
      return
    }

    if (SUPPORTS_POPOVER) {
      this.setAttribute('popover', 'manual')
      this.showPopover()
    }

    const handleKeydown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault()
        root.requestClose()

        return
      }

      if (event.key === 'Tab') {
        trapFocus(event, this)
      }
    }
    this.addEventListener('keydown', handleKeydown)

    let releaseInert: () => void = () => {}
    if (root.modal) {
      releaseInert = inertSiblings(this)
      lockScroll()
    }

    const focusable = getFocusable(this)
    ;(focusable[0] ?? this).focus()

    this.teardown = () => {
      this.removeEventListener('keydown', handleKeydown)

      if (root.modal) {
        releaseInert()
        unlockScroll()
      }

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
}

void DialogPopup.define({
  name: 'bast-dialog-popup',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-dialog-popup': DialogPopup
  }
}
