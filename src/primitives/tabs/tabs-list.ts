import { TabsPart } from './tabs-part.ts'
import type { TabsContextValue } from './tabs.context.ts'
import { getActiveElement } from '../../utilities/focus.ts'

export class TabsList extends TabsPart {
  override connectedCallback(): void {
    super.connectedCallback()

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'tablist')
    }

    this.addEventListener('keydown', this.handleKeydown)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('keydown', this.handleKeydown)
    super.disconnectedCallback()
  }

  private getEnabledTabs(): HTMLElement[] {
    return Array.from(this.querySelectorAll<HTMLElement>('bast-tabs-tab')).filter(
      (tab) => !tab.hasAttribute('disabled'),
    )
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    const root = this.root
    if (!root) {
      return
    }

    const horizontal = root.orientation === 'horizontal'
    const nextKey = horizontal ? 'ArrowRight' : 'ArrowDown'
    const prevKey = horizontal ? 'ArrowLeft' : 'ArrowUp'

    const tabs = this.getEnabledTabs()
    if (tabs.length === 0) {
      return
    }

    const current = tabs.indexOf(getActiveElement() as HTMLElement)
    let next = -1

    if (event.key === nextKey) {
      next = current < 0 ? 0 : (current + 1) % tabs.length
    } else if (event.key === prevKey) {
      next = current < 0 ? tabs.length - 1 : (current - 1 + tabs.length) % tabs.length
    } else if (event.key === 'Home') {
      next = 0
    } else if (event.key === 'End') {
      next = tabs.length - 1
    } else {
      return
    }

    event.preventDefault()

    const target = tabs[next]!
    target.focus()

    if (root.activationMode === 'automatic') {
      const value = target.getAttribute('value')
      if (value !== null) {
        root.setValue(value)
      }
    }
  }

  protected sync(root: TabsContextValue): void {
    this.setAttribute('aria-orientation', root.orientation)
  }
}

void TabsList.define({
  name: 'bast-tabs-list',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-tabs-list': TabsList
  }
}
