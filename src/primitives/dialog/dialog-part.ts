import { DialogContext, type DialogContextValue } from './dialog.context.ts'
import { ContextConsumer } from '../shared/context-consumer.ts'
import { requestContext } from '../shared/context-consumer.utils.ts'

export abstract class DialogPart extends ContextConsumer<DialogContextValue> {
  protected resolveRoot(): DialogContextValue | undefined {
    return requestContext(this, DialogContext, 'bast-dialog')
  }
}
