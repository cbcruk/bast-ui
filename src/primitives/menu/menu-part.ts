import { MenuContext, type MenuContextValue } from './menu.context.ts'
import { ContextConsumer } from '../shared/context-consumer.ts'
import { requestContext } from '../shared/context-consumer.utils.ts'

export abstract class MenuPart extends ContextConsumer<MenuContextValue> {
  protected resolveRoot(): MenuContextValue | undefined {
    return requestContext(this, MenuContext, 'bast-menu')
  }
}
