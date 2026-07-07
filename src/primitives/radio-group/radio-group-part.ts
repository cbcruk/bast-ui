import { RadioGroupContext, type RadioGroupContextValue } from './radio-group.context.ts'
import { ContextConsumer } from '../shared/context-consumer.ts'
import { requestContext } from '../shared/context-consumer.utils.ts'

export abstract class RadioGroupPart extends ContextConsumer<RadioGroupContextValue> {
  protected readonly observedKeys = ['value', 'orientation', 'disabled'] as const

  protected resolveRoot(): RadioGroupContextValue | undefined {
    return requestContext(this, RadioGroupContext, 'bast-radio-group')
  }

  resync(): void {
    if (this.root) {
      this.sync(this.root)
    }
  }
}
