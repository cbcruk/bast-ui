import { MenuPart } from './menu-part.ts'
import type { MenuContextValue } from './menu.context.ts'

export class MenuTrigger extends MenuPart {
  protected readonly observedKeys = ['open'] as const

  override connectedCallback(): void {
    super.connectedCallback()

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button')
    }
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0')
    }
    this.setAttribute('aria-haspopup', 'menu')
    this.root?.setTrigger(this)

    this.addEventListener('click', this.handleActivate)
    this.addEventListener('keydown', this.handleKeydown)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this.handleActivate)
    this.removeEventListener('keydown', this.handleKeydown)
    this.root?.setTrigger(null)
    super.disconnectedCallback()
  }

  private handleActivate = (): void => {
    this.root?.setReturnFocus(this)
    this.root?.setInitialFocus('first')
    this.root?.toggle()
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    const root = this.root
    if (!root) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.handleActivate()
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      root.setReturnFocus(this)
      root.setInitialFocus('first')
      root.requestOpen()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      root.setReturnFocus(this)
      root.setInitialFocus('last')
      root.requestOpen()
    }
  }

  protected sync(root: MenuContextValue): void {
    if (!this.id) {
      this.id = root.triggerId
    }

    this.setAttribute('aria-expanded', String(root.open))
    this.setAttribute('aria-controls', root.popupId)
    this.toggleAttribute('data-open', root.open)
    this.toggleAttribute('data-closed', !root.open)
  }
}

void MenuTrigger.define({
  name: 'bast-menu-trigger',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-menu-trigger': MenuTrigger
  }
}
