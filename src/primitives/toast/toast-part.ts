import { ToastContext, type ToastContextValue } from './toast.context.ts'
import { ContextConsumer } from '../shared/context-consumer.ts'
import { requestContext } from '../shared/context-consumer.utils.ts'

export abstract class ToastPart extends ContextConsumer<ToastContextValue> {
  protected resolveRoot(): ToastContextValue | undefined {
    return requestContext(this, ToastContext, 'bast-toast')
  }
}
