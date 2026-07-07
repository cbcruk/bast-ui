import { FASTElement, nullableNumberConverter } from '@microsoft/fast-element'
import { MenuContext, type MenuContextValue } from './menu.context.ts'
import type { MenuInitialFocus, MenuItemSelectDetail, MenuOpenChangeDetail } from './menu.types.ts'
import type { Align, Side } from '../../utilities/position.ts'
import { createId } from '../../utilities/id.ts'

export class MenuRoot extends FASTElement implements MenuContextValue {
  declare open: boolean
  declare side: Side
  declare align: Align
  declare sideOffset: number
  declare alignOffset: number

  readonly triggerId: string = createId('bast-menu-trigger')
  readonly popupId: string = createId('bast-menu-popup')

  private trigger: HTMLElement | null = null
  private returnFocus: HTMLElement | null = null
  private initialFocus: MenuInitialFocus = 'first'

  constructor() {
    super()
    this.open = false
    this.side = 'bottom'
    this.align = 'start'
    this.sideOffset = 4
    this.alignOffset = 0
  }

  override connectedCallback(): void {
    super.connectedCallback()
    MenuContext.provide(this, this)
  }

  requestOpen(): void {
    this.setOpen(true)
  }

  requestClose(): void {
    this.setOpen(false)
  }

  toggle(): void {
    this.setOpen(!this.open)
  }

  setOpen(open: boolean): void {
    if (open === this.open) {
      return
    }

    if (open && !this.returnFocus) {
      this.returnFocus = document.activeElement as HTMLElement | null
    }

    this.open = open
    this.$emit('openchange', { open } satisfies MenuOpenChangeDetail)
  }

  getTrigger(): HTMLElement | null {
    return this.trigger
  }

  setTrigger(element: HTMLElement | null): void {
    this.trigger = element
  }

  getReturnFocus(): HTMLElement | null {
    return this.returnFocus
  }

  setReturnFocus(element: HTMLElement | null): void {
    this.returnFocus = element
  }

  getInitialFocus(): MenuInitialFocus {
    return this.initialFocus
  }

  setInitialFocus(value: MenuInitialFocus): void {
    this.initialFocus = value
  }

  selectItem(item: HTMLElement): void {
    this.$emit('itemselect', {
      value: item.getAttribute('value'),
    } satisfies MenuItemSelectDetail)
    this.requestClose()
  }
}

void MenuRoot.define({
  name: 'bast-menu',
  shadowOptions: null,
  attributes: [
    { property: 'open', attribute: 'open', mode: 'boolean' },
    { property: 'side', attribute: 'side', mode: 'reflect' },
    { property: 'align', attribute: 'align', mode: 'reflect' },
    {
      property: 'sideOffset',
      attribute: 'side-offset',
      mode: 'reflect',
      converter: nullableNumberConverter,
    },
    {
      property: 'alignOffset',
      attribute: 'align-offset',
      mode: 'reflect',
      converter: nullableNumberConverter,
    },
  ],
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-menu': MenuRoot
  }
}
