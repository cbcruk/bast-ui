import { FASTElement, Observable, type Subscriber } from '@microsoft/fast-element'
import { CollapsibleContext, type CollapsibleContextValue } from './collapsible.context.ts'

export abstract class CollapsiblePart extends FASTElement implements Subscriber {
  protected root: CollapsibleContextValue | undefined

  override connectedCallback(): void {
    super.connectedCallback()

    let resolved: CollapsibleContextValue | undefined
    CollapsibleContext.request(
      this,
      (value) => {
        resolved = value
      },
      false,
    )
    resolved ??= this.closest('bast-collapsible') ?? undefined

    if (!resolved) {
      return
    }

    this.root = resolved
    const notifier = Observable.getNotifier(resolved)
    notifier.subscribe(this, 'open')
    notifier.subscribe(this, 'disabled')
    this.sync(resolved)
  }

  override disconnectedCallback(): void {
    if (this.root) {
      const notifier = Observable.getNotifier(this.root)
      notifier.unsubscribe(this, 'open')
      notifier.unsubscribe(this, 'disabled')
      this.root = undefined
    }

    super.disconnectedCallback()
  }

  handleChange(): void {
    if (this.root) {
      this.sync(this.root)
    }
  }

  protected abstract sync(root: CollapsibleContextValue): void
}
