import { SelectContext, type SelectContextValue } from './select.context.ts'
import { ContextConsumer } from '../shared/context-consumer.ts'
import { requestContext } from '../shared/context-consumer.utils.ts'

export abstract class SelectPart extends ContextConsumer<SelectContextValue> {
  protected resolveRoot(): SelectContextValue | undefined {
    return requestContext(this, SelectContext, 'bast-select')
  }

  resync(): void {
    if (this.root) {
      this.sync(this.root)
    }
  }
}
