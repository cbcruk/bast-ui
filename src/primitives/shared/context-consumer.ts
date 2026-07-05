import { FASTElement, Observable, type Subscriber } from '@microsoft/fast-element'

export abstract class ContextConsumer<T extends object> extends FASTElement implements Subscriber {
  protected root: T | undefined

  protected abstract readonly observedKeys: readonly string[]

  protected abstract resolveRoot(): T | undefined

  protected abstract sync(root: T): void

  override connectedCallback(): void {
    super.connectedCallback()

    const root = this.resolveRoot()
    if (!root) {
      return
    }

    this.root = root
    const notifier = Observable.getNotifier(root)
    for (const key of this.observedKeys) {
      notifier.subscribe(this, key)
    }
    this.sync(root)
  }

  override disconnectedCallback(): void {
    if (this.root) {
      const notifier = Observable.getNotifier(this.root)
      for (const key of this.observedKeys) {
        notifier.unsubscribe(this, key)
      }
      this.root = undefined
    }

    super.disconnectedCallback()
  }

  handleChange(): void {
    if (this.root) {
      this.sync(this.root)
    }
  }
}
