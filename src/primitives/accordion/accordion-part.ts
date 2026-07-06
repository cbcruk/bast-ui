import { AccordionContext, type AccordionContextValue } from './accordion.context.ts'
import { ContextConsumer } from '../shared/context-consumer.ts'
import { requestContext } from '../shared/context-consumer.utils.ts'

export abstract class AccordionPart extends ContextConsumer<AccordionContextValue> {
  protected readonly observedKeys = ['value', 'orientation', 'disabled'] as const

  protected resolveRoot(): AccordionContextValue | undefined {
    return requestContext(this, AccordionContext, 'bast-accordion')
  }

  protected itemValue(): string | undefined {
    return this.closest('bast-accordion-item')?.getAttribute('value') ?? undefined
  }

  protected itemDisabled(): boolean {
    return this.closest('bast-accordion-item')?.hasAttribute('disabled') ?? false
  }

  resync(): void {
    if (this.root) {
      this.sync(this.root)
    }
  }
}
