import { AccordionPart } from './accordion-part.ts'
import type { AccordionContextValue } from './accordion.context.ts'

export class AccordionTrigger extends AccordionPart {
  override connectedCallback(): void {
    super.connectedCallback()

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button')
    }
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0')
    }

    this.addEventListener('click', this.handleActivate)
    this.addEventListener('keydown', this.handleKeydown)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this.handleActivate)
    this.removeEventListener('keydown', this.handleKeydown)
    super.disconnectedCallback()
  }

  private handleActivate = (): void => {
    const value = this.itemValue()
    if (value === undefined || this.itemDisabled()) {
      return
    }

    this.root?.toggle(value)
  }

  private getTriggers(): HTMLElement[] {
    const root = this.closest('bast-accordion')
    if (!root) {
      return []
    }

    return Array.from(root.querySelectorAll<HTMLElement>('bast-accordion-trigger')).filter(
      (trigger) => !(trigger.closest('bast-accordion-item')?.hasAttribute('disabled') ?? false),
    )
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.handleActivate()

      return
    }

    const horizontal = this.root?.orientation === 'horizontal'
    const nextKey = horizontal ? 'ArrowRight' : 'ArrowDown'
    const prevKey = horizontal ? 'ArrowLeft' : 'ArrowUp'

    const triggers = this.getTriggers()
    if (triggers.length === 0) {
      return
    }

    const current = triggers.indexOf(this)
    let next = -1

    if (event.key === nextKey) {
      next = current < 0 ? 0 : (current + 1) % triggers.length
    } else if (event.key === prevKey) {
      next = current < 0 ? triggers.length - 1 : (current - 1 + triggers.length) % triggers.length
    } else if (event.key === 'Home') {
      next = 0
    } else if (event.key === 'End') {
      next = triggers.length - 1
    } else {
      return
    }

    event.preventDefault()
    triggers[next]!.focus()
  }

  protected sync(root: AccordionContextValue): void {
    const value = this.itemValue()
    if (value === undefined) {
      return
    }

    if (!this.id) {
      this.id = root.getTriggerId(value)
    }

    const open = root.isOpen(value)
    const disabled = this.itemDisabled() || root.disabled

    this.setAttribute('aria-expanded', String(open))
    this.setAttribute('aria-controls', root.getPanelId(value))
    this.setAttribute('aria-disabled', String(disabled))
    this.toggleAttribute('data-open', open)
    this.toggleAttribute('data-closed', !open)
    this.toggleAttribute('data-disabled', disabled)
  }
}

void AccordionTrigger.define({
  name: 'bast-accordion-trigger',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-accordion-trigger': AccordionTrigger
  }
}
