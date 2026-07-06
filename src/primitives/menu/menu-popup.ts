import { MenuPart } from './menu-part.ts'
import type { MenuContextValue } from './menu.context.ts'
import { getActiveElement } from '../../utilities/focus.ts'

const TYPEAHEAD_RESET_MS = 500

export class MenuPopup extends MenuPart {
  protected readonly observedKeys = ['open'] as const

  private wasOpen = false
  private typeahead = ''
  private typeaheadTimer: ReturnType<typeof setTimeout> | undefined

  override connectedCallback(): void {
    super.connectedCallback()

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'menu')
    }

    this.addEventListener('keydown', this.handleKeydown)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('keydown', this.handleKeydown)
    clearTimeout(this.typeaheadTimer)
    super.disconnectedCallback()
  }

  protected sync(root: MenuContextValue): void {
    if (!this.id) {
      this.id = root.popupId
    }

    this.setAttribute('aria-labelledby', root.triggerId)
    this.toggleAttribute('data-open', root.open)
    this.toggleAttribute('data-closed', !root.open)

    if (root.open && !this.wasOpen) {
      this.wasOpen = true
      this.focusInitial(root)
    } else if (!root.open && this.wasOpen) {
      this.wasOpen = false
      this.typeahead = ''
    }
  }

  private getItems(): HTMLElement[] {
    return Array.from(this.querySelectorAll<HTMLElement>('bast-menu-item'))
  }

  private getEnabledItems(): HTMLElement[] {
    return this.getItems().filter((item) => !item.hasAttribute('disabled'))
  }

  private setActive(item: HTMLElement): void {
    for (const other of this.getItems()) {
      other.setAttribute('tabindex', other === item ? '0' : '-1')
    }
    item.focus()
  }

  private focusInitial(root: MenuContextValue): void {
    const items = this.getEnabledItems()
    if (items.length === 0) {
      return
    }

    const target = root.getInitialFocus() === 'last' ? items[items.length - 1]! : items[0]!
    this.setActive(target)
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    const root = this.root
    if (!root) {
      return
    }

    const items = this.getEnabledItems()
    const active = getActiveElement() as HTMLElement | null
    const current = active ? items.indexOf(active) : -1

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (items.length > 0) {
        this.setActive(items[current < 0 ? 0 : (current + 1) % items.length]!)
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (items.length > 0) {
        this.setActive(
          items[current < 0 ? items.length - 1 : (current - 1 + items.length) % items.length]!,
        )
      }
    } else if (event.key === 'Home') {
      event.preventDefault()
      if (items.length > 0) {
        this.setActive(items[0]!)
      }
    } else if (event.key === 'End') {
      event.preventDefault()
      if (items.length > 0) {
        this.setActive(items[items.length - 1]!)
      }
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (active && current >= 0) {
        root.selectItem(active)
      }
    } else if (event.key === 'Tab') {
      event.preventDefault()
      root.requestClose()
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      this.handleTypeahead(event.key)
    }
  }

  private handleTypeahead(char: string): void {
    clearTimeout(this.typeaheadTimer)
    this.typeahead += char.toLowerCase()
    this.typeaheadTimer = setTimeout(() => {
      this.typeahead = ''
    }, TYPEAHEAD_RESET_MS)

    const match = this.getEnabledItems().find((item) =>
      (item.textContent ?? '').trim().toLowerCase().startsWith(this.typeahead),
    )
    if (match) {
      this.setActive(match)
    }
  }
}

void MenuPopup.define({
  name: 'bast-menu-popup',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-menu-popup': MenuPopup
  }
}
