import { Context } from '@microsoft/fast-element/context.js'
import type { TabsActivationMode, TabsOrientation } from './tabs.types.ts'

export interface TabsContextValue {
  readonly value: string | undefined
  readonly orientation: TabsOrientation
  readonly activationMode: TabsActivationMode
  setValue(value: string): void
  registerDefaultTab(value: string): void
  getTabId(value: string): string
  getPanelId(value: string): string
}

export const TabsContext = Context.create<TabsContextValue>('bast-tabs')
