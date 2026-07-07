import { TabsPart } from './tabs-part.ts'
import type { TabsContextValue } from './tabs.context.ts'

export class TabsPanel extends TabsPart {
  declare value: string | undefined

  override connectedCallback(): void {
    super.connectedCallback()

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'tabpanel')
    }

    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0')
    }
  }

  protected sync(root: TabsContextValue): void {
    const value = this.value
    if (value === undefined) {
      return
    }

    if (!this.id) {
      this.id = root.getPanelId(value)
    }

    const selected = root.value === value

    this.setAttribute('aria-labelledby', root.getTabId(value))
    this.hidden = !selected
    this.toggleAttribute('data-selected', selected)
  }
}

void TabsPanel.define({
  name: 'bast-tabs-panel',
  shadowOptions: null,
  attributes: [{ property: 'value', attribute: 'value', mode: 'reflect' }],
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-tabs-panel': TabsPanel
  }
}
