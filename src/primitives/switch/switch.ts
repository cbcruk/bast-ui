import { ToggleElement } from '../shared/toggle-element.ts'

export class Switch extends ToggleElement {
  protected readonly toggleRole = 'switch'
}

void Switch.define({
  name: 'bast-switch',
  shadowOptions: null,
  attributes: [
    { property: 'checked', attribute: 'checked', mode: 'boolean' },
    { property: 'disabled', attribute: 'disabled', mode: 'boolean' },
  ],
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-switch': Switch
  }
}
