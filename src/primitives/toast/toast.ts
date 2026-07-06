import { FASTElement, Observable, nullableNumberConverter } from '@microsoft/fast-element'
import { ToastContext, type ToastContextValue } from './toast.context.ts'
import type { ToastOpenChangeDetail, ToastType } from './toast.types.ts'
import { createId } from '../../utilities/id.ts'

export class ToastRoot extends FASTElement implements ToastContextValue {
  declare open: boolean
  declare duration: number
  declare type: ToastType
  declare hasTitle: boolean
  declare hasDescription: boolean

  readonly titleId: string = createId('bast-toast-title')
  readonly descriptionId: string = createId('bast-toast-description')

  private timer: ReturnType<typeof setTimeout> | undefined
  private remaining = 0
  private startedAt = 0
  private ready = false

  constructor() {
    super()
    this.open = false
    this.duration = 5000
    this.type = 'background'
    this.hasTitle = false
    this.hasDescription = false
  }

  override connectedCallback(): void {
    super.connectedCallback()

    this.applyLiveRegion()
    ToastContext.provide(this, this)

    this.addEventListener('pointerenter', this.pause)
    this.addEventListener('pointerleave', this.resume)
    this.addEventListener('focusin', this.pause)
    this.addEventListener('focusout', this.resume)

    this.reflect()
    if (this.open) {
      this.startTimer()
    }
    this.ready = true
  }

  override disconnectedCallback(): void {
    this.ready = false
    this.clearTimer()
    this.removeEventListener('pointerenter', this.pause)
    this.removeEventListener('pointerleave', this.resume)
    this.removeEventListener('focusin', this.pause)
    this.removeEventListener('focusout', this.resume)
    super.disconnectedCallback()
  }

  typeChanged(): void {
    if (this.isConnected) {
      this.applyLiveRegion()
    }
  }

  // Reacts to `open` changing after connect — whether via the attribute/property
  // or setOpen(). The initial state is handled in connectedCallback (no event).
  openChanged(): void {
    if (!this.ready) {
      return
    }

    this.reflect()

    if (this.open) {
      this.startTimer()
    } else {
      this.clearTimer()
    }

    this.$emit('openchange', { open: this.open } satisfies ToastOpenChangeDetail)
  }

  requestClose(): void {
    this.setOpen(false)
  }

  setOpen(open: boolean): void {
    if (open !== this.open) {
      this.open = open
    }
  }

  setHasTitle(value: boolean): void {
    this.hasTitle = value
    if (this.isConnected) {
      this.reflect()
    }
  }

  setHasDescription(value: boolean): void {
    this.hasDescription = value
    if (this.isConnected) {
      this.reflect()
    }
  }

  private applyLiveRegion(): void {
    const foreground = this.type === 'foreground'
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', foreground ? 'alert' : 'status')
    }
    this.setAttribute('aria-live', foreground ? 'assertive' : 'polite')
    this.setAttribute('aria-atomic', 'true')
  }

  private reflect(): void {
    if (this.hasTitle) {
      this.setAttribute('aria-labelledby', this.titleId)
    } else {
      this.removeAttribute('aria-labelledby')
    }

    if (this.hasDescription) {
      this.setAttribute('aria-describedby', this.descriptionId)
    } else {
      this.removeAttribute('aria-describedby')
    }

    this.hidden = !this.open
    this.toggleAttribute('data-open', this.open)
    this.toggleAttribute('data-closed', !this.open)
  }

  private startTimer(): void {
    if (this.duration <= 0) {
      return
    }

    this.remaining = this.duration
    this.run()
  }

  private run(): void {
    this.startedAt = Date.now()
    this.timer = setTimeout(() => {
      this.timer = undefined
      this.requestClose()
    }, this.remaining)
  }

  private clearTimer(): void {
    if (this.timer !== undefined) {
      clearTimeout(this.timer)
      this.timer = undefined
    }
  }

  private pause = (): void => {
    if (this.timer === undefined) {
      return
    }

    clearTimeout(this.timer)
    this.timer = undefined
    this.remaining -= Date.now() - this.startedAt
  }

  private resume = (): void => {
    if (this.open && this.duration > 0 && this.timer === undefined && this.remaining > 0) {
      this.run()
    }
  }
}

Observable.defineProperty(ToastRoot.prototype, 'hasTitle')
Observable.defineProperty(ToastRoot.prototype, 'hasDescription')

void ToastRoot.define({
  name: 'bast-toast',
  shadowOptions: null,
  attributes: [
    { property: 'open', attribute: 'open', mode: 'boolean' },
    { property: 'type', attribute: 'type', mode: 'reflect' },
    {
      property: 'duration',
      attribute: 'duration',
      mode: 'reflect',
      converter: nullableNumberConverter,
    },
  ],
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-toast': ToastRoot
  }
}
