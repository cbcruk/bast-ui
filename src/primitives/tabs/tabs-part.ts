import { TabsContext, type TabsContextValue } from './tabs.context.ts'
import { ContextConsumer } from '../shared/context-consumer.ts'
import { requestContext } from '../shared/context-consumer.utils.ts'

export abstract class TabsPart extends ContextConsumer<TabsContextValue> {
  protected readonly observedKeys = ['value', 'orientation', 'activationMode'] as const

  protected resolveRoot(): TabsContextValue | undefined {
    return requestContext(this, TabsContext, 'bast-tabs')
  }
}
