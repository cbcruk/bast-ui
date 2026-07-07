import { FASTElement } from '@microsoft/fast-element'
import { TabsContext, type TabsContextValue } from './tabs.context.ts'
import type { TabsActivationMode, TabsOrientation, TabsValueChangeDetail } from './tabs.types.ts'
import { createId } from '../../utilities/id.ts'

export class TabsRoot extends FASTElement implements TabsContextValue {
  declare value: string | undefined
  declare orientation: TabsOrientation
  declare activationMode: TabsActivationMode

  readonly baseId: string = createId('bast-tabs')

  constructor() {
    super()
    this.orientation = 'horizontal'
    this.activationMode = 'automatic'
  }

  override connectedCallback(): void {
    super.connectedCallback()
    TabsContext.provide(this, this)
  }

  setValue(value: string): void {
    if (value === this.value) {
      return
    }

    this.value = value
    this.$emit('valuechange', { value } satisfies TabsValueChangeDetail)
  }

  registerDefaultTab(value: string): void {
    if (this.value === undefined) {
      this.value = value
    }
  }

  getTabId(value: string): string {
    return `${this.baseId}-tab-${value}`
  }

  getPanelId(value: string): string {
    return `${this.baseId}-panel-${value}`
  }
}

void TabsRoot.define({
  name: 'bast-tabs',
  shadowOptions: null,
  attributes: [
    { property: 'value', attribute: 'value', mode: 'reflect' },
    { property: 'orientation', attribute: 'orientation', mode: 'reflect' },
    { property: 'activationMode', attribute: 'activation-mode', mode: 'reflect' },
  ],
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-tabs': TabsRoot
  }
}
