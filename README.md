# bast-ui

Headless, accessible UI primitives as native **web components** — a
[Base UI](https://base-ui.com) / [Radix](https://www.radix-ui.com)-style layer
built on [FAST](https://github.com/microsoft/fast), with no framework runtime.

Base UI and Radix are excellent but React-only. `bast-ui` mirrors their
component anatomy and styling contract (`data-open`, `data-closed`,
`data-disabled`, matching ARIA) as framework-agnostic custom elements, so the
same primitives work in any page — and stay small enough for browser extensions
(Collapsible + Dialog + runtime is ~3 kB gzipped).

## Design

- **Composition, not inheritance.** Primitives are assembled from anatomical
  parts (`<bast-collapsible>` → `<bast-collapsible-trigger>` +
  `<bast-collapsible-panel>`), mirroring Base UI's `Root` / `Trigger` / `Panel`.
- **Light DOM by default** (`shadowOptions: null`) so consumers style parts
  directly. In an extension content script, wrap the tree in your own shadow
  root for isolation from the host page.
- **State shared via the [W3C Context Protocol](https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/context.md)**,
  so parts coordinate without DOM coupling — a shared `ContextConsumer` base
  reused by every primitive.
- **Platform-first behavior.** Dialog renders in the native top layer via the
  `popover` API (feature-detected), so it escapes overflow and stacking
  contexts without portaling the DOM.
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

### Dialog

```html
<bast-dialog>
  <bast-dialog-trigger>Open</bast-dialog-trigger>
  <bast-dialog-backdrop></bast-dialog-backdrop>
  <bast-dialog-popup>
    <bast-dialog-title>Title</bast-dialog-title>
    <bast-dialog-description>Description</bast-dialog-description>
    <bast-dialog-close>Cancel</bast-dialog-close>
  </bast-dialog-popup>
</bast-dialog>
```

Modal by default (`modal="false"` to opt out). On open it moves focus into the
popup, traps Tab, wires `aria-modal` / `aria-labelledby` / `aria-describedby`,
locks body scroll, and marks the background `inert`. It closes on `Escape`,
backdrop click, or `<bast-dialog-close>`, restoring focus to the trigger.

See [`examples/collapsible.html`](examples/collapsible.html) and
[`examples/dialog.html`](examples/dialog.html) for styled demos (serve the repo
root and open them — the import map resolves FAST from `node_modules`).

## Development

```bash
vp install   # install dependencies
vp test      # run unit tests (happy-dom)
vp check     # format, lint, type check
vp pack      # build the library
```

## Roadmap

**Collapsible** and **Dialog** are implemented. Next: **Popover** (anchor
positioning via the CSS Anchor API + `@floating-ui/dom` fallback), **Tabs**
(roving tabindex), **Menu**, and a thin React wrapper over the same elements.
