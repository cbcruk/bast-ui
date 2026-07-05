# bast-ui

Headless, accessible UI primitives as native **web components** — a
[Base UI](https://base-ui.com) / [Radix](https://www.radix-ui.com)-style layer
built on [FAST](https://github.com/microsoft/fast), with no framework runtime.

Base UI and Radix are excellent but React-only. `bast-ui` mirrors their
component anatomy and styling contract (`data-open`, `data-closed`,
`data-disabled`, matching ARIA) as framework-agnostic custom elements, so the
same primitives work in any page — and stay small enough for browser extensions
(the current build is ~1 kB gzipped).

## Design

- **Composition, not inheritance.** Primitives are assembled from anatomical
  parts (`<bast-collapsible>` → `<bast-collapsible-trigger>` +
  `<bast-collapsible-panel>`), mirroring Base UI's `Root` / `Trigger` / `Panel`.
- **Light DOM by default** (`shadowOptions: null`) so consumers style parts
  directly. In an extension content script, wrap the tree in your own shadow
  root for isolation from the host page.
- **State shared via the [W3C Context Protocol](https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/context.md)**,
  which survives portals — the foundation for Dialog/Popover next.
- **Style with data-attributes**, never internal classes:
  `data-open` / `data-closed` / `data-disabled`.

## Usage

```ts
import 'bast-ui'
```

```html
<bast-collapsible>
  <bast-collapsible-trigger>Details</bast-collapsible-trigger>
  <bast-collapsible-panel>Hidden content</bast-collapsible-panel>
</bast-collapsible>
```

The trigger toggles the panel on click / Enter / Space, wires
`aria-expanded` + `aria-controls`, and the root emits an `openchange` event.
Add the `open` attribute for a default-open panel, `disabled` to lock it.

See [`examples/collapsible.html`](examples/collapsible.html) for a styled demo
(serve the repo root and open it — the import map resolves FAST from
`node_modules`).

## Development

```bash
vp install   # install dependencies
vp test      # run unit tests (happy-dom)
vp check     # format, lint, type check
vp pack      # build the library
```

## Roadmap

Collapsible is the first vertical slice, proving the composition + shared-state
architecture. Next: **Dialog** (portal, focus trap, dismiss), **Popover**
(anchor positioning), **Tabs** (roving tabindex).
