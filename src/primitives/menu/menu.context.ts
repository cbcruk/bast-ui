import { Context } from '@microsoft/fast-element/context.js'
import type { Align, Side } from '../../utilities/position.ts'
import type { MenuInitialFocus } from './menu.types.ts'

export interface MenuContextValue {
  readonly open: boolean
  readonly side: Side
  readonly align: Align
  readonly sideOffset: number
  readonly alignOffset: number
  readonly triggerId: string
  readonly popupId: string
  requestOpen(): void
  requestClose(): void
  toggle(): void
  setOpen(open: boolean): void
  getTrigger(): HTMLElement | null
  setTrigger(element: HTMLElement | null): void
  getReturnFocus(): HTMLElement | null
  setReturnFocus(element: HTMLElement | null): void
  getInitialFocus(): MenuInitialFocus
  setInitialFocus(value: MenuInitialFocus): void
  selectItem(item: HTMLElement): void
}

export const MenuContext = Context.create<MenuContextValue>('bast-menu')
