import { TabsPart } from './tabs-part.ts'
import type { TabsContextValue } from './tabs.context.ts'

export class TabsTab extends TabsPart {
  declare value: string | undefined
  declare disabled: boolean

  constructor() {
    super()
    this.disabled = false
  }

  override connectedCallback(): void {
    super.connectedCallback()

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'tab')
    }

    this.addEventListener('click', this.handleActivate)
    this.addEventListener('keydown', this.handleKeydown)

    if (this.value !== undefined && !this.disabled) {
      this.root?.registerDefaultTab(this.value)
    }
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this.handleActivate)
    this.removeEventListener('keydown', this.handleKeydown)
    super.disconnectedCallback()
  }

  private handleActivate = (): void => {
    if (this.disabled || this.value === undefined) {
      return
    }

    this.root?.setValue(this.value)
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.handleActivate()
    }
  }

  protected sync(root: TabsContextValue): void {
    const value = this.value
    if (value === undefined) {
      return
    }

    if (!this.id) {
      this.id = root.getTabId(value)
    }

    const selected = root.value === value

    this.setAttribute('aria-selected', String(selected))
    this.setAttribute('aria-controls', root.getPanelId(value))
    this.setAttribute('aria-disabled', String(this.disabled))
    this.setAttribute('tabindex', selected && !this.disabled ? '0' : '-1')
    this.toggleAttribute('data-selected', selected)
    this.toggleAttribute('data-disabled', this.disabled)
  }
}

void TabsTab.define({
  name: 'bast-tabs-tab',
  shadowOptions: null,
  attributes: [
    { property: 'value', attribute: 'value', mode: 'reflect' },
    { property: 'disabled', attribute: 'disabled', mode: 'boolean' },
  ],
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-tabs-tab': TabsTab
  }
}
