import { TooltipContext, type TooltipContextValue } from './tooltip.context.ts'
import { ContextConsumer } from '../shared/context-consumer.ts'
import { requestContext } from '../shared/context-consumer.utils.ts'

export abstract class TooltipPart extends ContextConsumer<TooltipContextValue> {
  protected resolveRoot(): TooltipContextValue | undefined {
    return requestContext(this, TooltipContext, 'bast-tooltip')
  }
}
