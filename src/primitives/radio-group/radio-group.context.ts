import { Context } from '@microsoft/fast-element/context.js'
import type { RadioGroupOrientation } from './radio-group.types.ts'

export interface RadioGroupContextValue {
  readonly value: string | undefined
  readonly orientation: RadioGroupOrientation
  readonly disabled: boolean
  setValue(value: string): void
}

export const RadioGroupContext = Context.create<RadioGroupContextValue>('bast-radio-group')
