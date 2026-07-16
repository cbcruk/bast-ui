// A tiny, dependency-free doc widget that renders an attributes table for the
// given custom elements straight from the project's Custom Elements Manifest
// (custom-elements.json). Usage:
//
//   <bast-api-table tags="bast-select bast-select-option"></bast-api-table>
//   <script type="module" src="api-table.js"></script>
//
// The manifest URL is resolved relative to this script, so the widget works
// whether the repo root is served locally or the site is deployed under a
// subpath. It reuses the same manifest that ships in the package, so the tables
// stay in sync with the source with no hand-maintenance.

const MANIFEST_URL = new URL('../custom-elements.json', import.meta.url)

let manifestPromise

function loadManifest() {
  manifestPromise ??= fetch(MANIFEST_URL).then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to load custom-elements.json (${response.status})`)
    }

    return response.json()
  })

  return manifestPromise
}

function collectElements(manifest) {
  const elements = new Map()
  for (const module of manifest.modules ?? []) {
    for (const declaration of module.declarations ?? []) {
      if (declaration.customElement && declaration.tagName) {
        elements.set(declaration.tagName, declaration)
      }
    }
  }

  return elements
}

const STYLES = `
  :host { display: block; font-family: system-ui, sans-serif; }
  .element { margin: 0 0 1.25rem; }
  .tag {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.9375rem;
    font-weight: 600;
    background: color-mix(in srgb, currentColor 8%, transparent);
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
  }
  table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; font-size: 0.875rem; }
  th, td { text-align: left; padding: 0.375rem 0.5rem; border-bottom: 1px solid color-mix(in srgb, currentColor 12%, transparent); }
  th { font-weight: 600; opacity: 0.7; font-size: 0.8125rem; text-transform: uppercase; letter-spacing: 0.02em; }
  code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  .type { opacity: 0.75; }
  .empty { margin: 0.375rem 0 0; opacity: 0.6; font-size: 0.875rem; }
  .error { color: #b91c1c; }
`

class BastApiTable extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' })
    }

    void this.render()
  }

  async render() {
    const tags = (this.getAttribute('tags') ?? '')
      .split(/\s+/)
      .map((tag) => tag.trim())
      .filter(Boolean)

    let elements
    try {
      elements = collectElements(await loadManifest())
    } catch (error) {
      this.shadowRoot.innerHTML = `<style>${STYLES}</style><p class="error">${String(error)}</p>`

      return
    }

    const sections = tags.map((tag) => {
      const declaration = elements.get(tag)
      const attributes = declaration?.attributes ?? []

      const body = attributes.length
        ? `<table>
            <thead><tr><th>Attribute</th><th>Type</th></tr></thead>
            <tbody>
              ${attributes
                .map(
                  (attribute) =>
                    `<tr><td><code>${attribute.name}</code></td><td class="type"><code>${attribute.type?.text ?? 'string'}</code></td></tr>`,
                )
                .join('')}
            </tbody>
          </table>`
        : `<p class="empty">No configurable attributes.</p>`

      return `<div class="element"><span class="tag">&lt;${tag}&gt;</span>${body}</div>`
    })

    this.shadowRoot.innerHTML = `<style>${STYLES}</style>${sections.join('')}`
  }
}

customElements.define('bast-api-table', BastApiTable)
