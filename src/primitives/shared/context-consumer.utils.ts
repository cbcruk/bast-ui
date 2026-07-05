import type { FASTContext } from '@microsoft/fast-element/context.js'

export function requestContext<T extends object>(
  element: HTMLElement,
  context: FASTContext<T>,
  closestSelector: string,
): T | undefined {
  let resolved: T | undefined
  context.request(
    element,
    (value) => {
      resolved = value
    },
    false,
  )

  resolved ??= (element.closest(closestSelector) as unknown as T | null) ?? undefined

  return resolved
}
