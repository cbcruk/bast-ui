import { FASTElement } from '@microsoft/fast-element'

export class ToastRegion extends FASTElement {
  override connectedCallback(): void {
    super.connectedCallback()

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'region')
    }
    if (!this.hasAttribute('aria-label') && !this.hasAttribute('aria-labelledby')) {
      this.setAttribute('aria-label', 'Notifications')
    }
  }
}

void ToastRegion.define({
  name: 'bast-toast-region',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-toast-region': ToastRegion
  }
}
