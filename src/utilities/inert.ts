function topLevelAncestor(element: HTMLElement): HTMLElement {
  let current: HTMLElement = element

  while (current.parentElement && current.parentElement !== document.body) {
    current = current.parentElement
  }

  return current
}

export function inertSiblings(element: HTMLElement): () => void {
  const top = topLevelAncestor(element)
  const changed: HTMLElement[] = []

  for (const child of Array.from(document.body.children)) {
    if (child === top || !(child instanceof HTMLElement)) {
      continue
    }

    if (child.hasAttribute('inert')) {
      continue
    }

    child.setAttribute('inert', '')
    changed.push(child)
  }

  return () => {
    for (const element of changed) {
      element.removeAttribute('inert')
    }
  }
}
