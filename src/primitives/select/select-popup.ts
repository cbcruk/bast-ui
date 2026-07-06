import { SelectPart } from './select-part.ts'
import type { SelectContextValue } from './select.context.ts'
import { getActiveElement } from '../../utilities/focus.ts'

const TYPEAHEAD_RESET_MS = 500

export class SelectPopup extends SelectPart {
  protected readonly observedKeys = ['open', 'value'] as const

  private wasOpen = false
  private typeahead = ''
  private typeaheadTimer: ReturnType<typeof setTimeout> | undefined

  override connectedCallback(): void {
    super.connectedCallback()

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'listbox')
    }

    this.addEventListener('keydown', this.handleKeydown)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('keydown', this.handleKeydown)
    clearTimeout(this.typeaheadTimer)
    super.disconnectedCallback()
  }

  protected sync(root: SelectContextValue): void {
    if (!this.id) {
      this.id = root.popupId
    }

    this.toggleAttribute('data-open', root.open)
    this.toggleAttribute('data-closed', !root.open)

    if (root.open && !this.wasOpen) {
      this.wasOpen = true
      this.focusInitial(root)
    } else if (!root.open && this.wasOpen) {
      this.wasOpen = false
      this.typeahead = ''
    }
  }

  private getOptions(): HTMLElement[] {
    return Array.from(this.querySelectorAll<HTMLElement>('bast-select-option'))
  }

  private getEnabledOptions(): HTMLElement[] {
    return this.getOptions().filter((option) => !option.hasAttribute('disabled'))
  }

  private setActive(option: HTMLElement): void {
    for (const other of this.getOptions()) {
      other.setAttribute('tabindex', other === option ? '0' : '-1')
    }
    option.focus()
  }

  private focusInitial(root: SelectContextValue): void {
    const options = this.getEnabledOptions()
    if (options.length === 0) {
      return
    }

    const selected =
      root.value === undefined
        ? undefined
        : options.find((option) => option.getAttribute('value') === root.value)
    this.setActive(selected ?? options[0]!)
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    const root = this.root
    if (!root) {
      return
    }

    const options = this.getEnabledOptions()
    const active = getActiveElement() as HTMLElement | null
    const current = active ? options.indexOf(active) : -1

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (options.length > 0) {
        this.setActive(options[current < 0 ? 0 : (current + 1) % options.length]!)
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (options.length > 0) {
        this.setActive(
          options[
            current < 0 ? options.length - 1 : (current - 1 + options.length) % options.length
          ]!,
        )
      }
    } else if (event.key === 'Home') {
      event.preventDefault()
      if (options.length > 0) {
        this.setActive(options[0]!)
      }
    } else if (event.key === 'End') {
      event.preventDefault()
      if (options.length > 0) {
        this.setActive(options[options.length - 1]!)
      }
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (active && current >= 0) {
        const value = active.getAttribute('value')
        if (value !== null) {
          root.selectValue(value)
        }
      }
    } else if (event.key === 'Tab') {
      event.preventDefault()
      root.requestClose()
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      this.handleTypeahead(event.key)
    }
  }

  private handleTypeahead(char: string): void {
    clearTimeout(this.typeaheadTimer)
    this.typeahead += char.toLowerCase()
    this.typeaheadTimer = setTimeout(() => {
      this.typeahead = ''
    }, TYPEAHEAD_RESET_MS)

    const match = this.getEnabledOptions().find((option) =>
      (option.textContent ?? '').trim().toLowerCase().startsWith(this.typeahead),
    )
    if (match) {
      this.setActive(match)
    }
  }
}

void SelectPopup.define({
  name: 'bast-select-popup',
  shadowOptions: null,
})

declare global {
  interface HTMLElementTagNameMap {
    'bast-select-popup': SelectPopup
  }
}
