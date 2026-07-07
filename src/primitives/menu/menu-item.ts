import { MenuPart } from './menu-part.ts'
import type { MenuContextValue } from './menu.context.ts'

export class MenuItem extends MenuPart {
  protected readonly observedKeys = [] as const

  declare value: string | undefined
  declare disabled: boolean

  constructor() {
    super()
    this.disabled = false
  }

  override connectedCallback(): void {
    super.connectedCallback()

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'menuitem')
    }
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '-1')
    }
    this.reflectDisabled()

    this.addEventListener('click', this.handleActivate)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this.handleActivate)
    super.disconnectedCallback()
  }

  disabledChanged(): void {
    if (this.isConnected) {
      this.reflectDisabled()
    }
  }

  private reflectDisabled(): void {
    this.setAttribute('aria-disabled', String(this.disabled))
    this.toggleAttribute('data-disabled', this.disabled)
    if (this.disabled) {
      this.setAttribute('tabindex', '-1')
    }
  }

  private handleActivate = (): void => {
    if (this.disabled) {
      return
    }

    this.root?.selectItem(this)
  }

  protected sync(_root: MenuContextValue): void {}
}

void MenuItem.define({
  name: 'bast-menu-item',
  shadowOptions: null,
  attributes: [
    { property: 'value', attribute: 'value', mode: 'reflect' },
    { property: 'disabled', attribute: 'disabled', mode: 'boolean' },
  ],
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-menu-item': MenuItem
  }
}
