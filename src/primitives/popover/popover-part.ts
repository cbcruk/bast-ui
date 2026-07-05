import { PopoverContext, type PopoverContextValue } from './popover.context.ts'
import { ContextConsumer } from '../shared/context-consumer.ts'
import { requestContext } from '../shared/context-consumer.utils.ts'

export abstract class PopoverPart extends ContextConsumer<PopoverContextValue> {
  protected resolveRoot(): PopoverContextValue | undefined {
    return requestContext(this, PopoverContext, 'bast-popover')
  }
}
