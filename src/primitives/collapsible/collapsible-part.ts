import { CollapsibleContext, type CollapsibleContextValue } from './collapsible.context.ts'
import { ContextConsumer } from '../shared/context-consumer.ts'
import { requestContext } from '../shared/context-consumer.utils.ts'

export abstract class CollapsiblePart extends ContextConsumer<CollapsibleContextValue> {
  protected readonly observedKeys = ['open', 'disabled'] as const

  protected resolveRoot(): CollapsibleContextValue | undefined {
    return requestContext(this, CollapsibleContext, 'bast-collapsible')
  }
}
