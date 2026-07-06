# bast-ui

Headless, accessible UI primitives as native **web components** — a
[Base UI](https://base-ui.com) / [Radix](https://www.radix-ui.com)-style layer
built on [FAST](https://github.com/microsoft/fast), with no framework runtime.

Base UI and Radix are excellent but React-only. `bast-ui` mirrors their
component anatomy and styling contract (`data-open`, `data-closed`,
`data-disabled`, matching ARIA) as framework-agnostic custom elements, so the
same primitives work in any page — and stay small enough for browser extensions
(Collapsible + Dialog + Popover + Tabs + Menu + Tooltip + Accordion + runtime is
~7.6 kB gzipped).

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
- **Platform-first behavior.** Dialog and Popover render in the native top
  layer via the `popover` API (feature-detected), escaping overflow and
  stacking contexts without portaling the DOM. Popover positioning is a pure,
  unit-tested function — no layout engine required to verify it.
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

### Popover

```html
<bast-popover side="bottom" align="center" side-offset="8">
  <bast-popover-trigger>Toggle</bast-popover-trigger>
  <bast-popover-positioner>
    <bast-popover-popup>
      <bast-popover-title>Title</bast-popover-title>
      <bast-popover-description>Description</bast-popover-description>
      <bast-popover-close>Close</bast-popover-close>
    </bast-popover-popup>
  </bast-popover-positioner>
</bast-popover>
```

Non-modal. The positioner anchors the popup to the trigger with `side`,
`align`, and `side-offset` / `align-offset` config, flipping and shifting to
stay in view, and exposes the resolved side as `data-side`. It moves focus into
the popup on open and light-dismisses on outside click or `Escape`.

### Tabs

```html
<bast-tabs value="overview">
  <bast-tabs-list>
    <bast-tabs-tab value="overview">Overview</bast-tabs-tab>
    <bast-tabs-tab value="usage">Usage</bast-tabs-tab>
  </bast-tabs-list>
  <bast-tabs-panel value="overview">Overview content</bast-tabs-panel>
  <bast-tabs-panel value="usage">Usage content</bast-tabs-panel>
</bast-tabs>
```

Roving tabindex over the list: only the selected tab is tabbable, and arrow
keys move between tabs (Left/Right when `orientation="horizontal"`, the default;
Up/Down when `"vertical"`), wrapping around, with Home / End jumping to the
ends. Activation is automatic by default (focus selects); set
`activation-mode="manual"` to require Enter/Space. Each tab and panel is linked
by a shared `value`, wiring `role`, `aria-selected`, `aria-controls`, and
`aria-labelledby`. Omit the root `value` to default to the first enabled tab,
mark a tab `disabled` to skip it, and the root emits a `valuechange` event.

### Menu

```html
<bast-menu>
  <bast-menu-trigger>Actions</bast-menu-trigger>
  <bast-menu-positioner>
    <bast-menu-popup>
      <bast-menu-item value="cut">Cut</bast-menu-item>
      <bast-menu-item value="copy">Copy</bast-menu-item>
      <bast-menu-item value="paste" disabled>Paste</bast-menu-item>
    </bast-menu-popup>
  </bast-menu-positioner>
</bast-menu>
```

A dropdown menu button. The trigger (`aria-haspopup="menu"`) opens on click,
Enter/Space, or Arrow keys — `ArrowDown` focuses the first item, `ArrowUp` the
last. Inside the `role="menu"` popup, items take roving focus: arrow keys move
between them (wrapping), Home / End jump to the ends, and typing focuses the
next item matching the typed prefix. Selecting an item (click, Enter, or Space)
emits an `itemselect` event with its `value`, closes the menu, and restores
focus to the trigger; `Escape`, `Tab`, or an outside click also dismiss it.
Disabled items are skipped. The positioner anchors the popup with the same
`side` / `align` / `side-offset` config as Popover, using the native top layer
when available.

### Tooltip

```html
<bast-tooltip delay="600" side="top">
  <bast-tooltip-trigger tabindex="0">Hover me</bast-tooltip-trigger>
  <bast-tooltip-positioner>
    <bast-tooltip-popup>Helpful hint</bast-tooltip-popup>
  </bast-tooltip-positioner>
</bast-tooltip>
```

Shows on pointer hover after `delay` ms (default `600`) and on focus
immediately; hides on pointer leave after `close-delay` ms (default `0`), on
blur, or on `Escape`. Hovering the tooltip itself keeps it open. While open the
trigger gains `aria-describedby` pointing at the `role="tooltip"` popup. The
positioner anchors the popup with the same `side` / `align` / `side-offset`
config as Popover and Menu, using the native top layer when available, and
exposes the resolved side as `data-side`. The trigger must be focusable (give
it `tabindex="0"` or wrap a focusable element) for the focus behavior.

### Accordion

```html
<bast-accordion value="what">
  <bast-accordion-item value="what">
    <bast-accordion-trigger>What is bast-ui?</bast-accordion-trigger>
    <bast-accordion-panel>A headless web-component layer.</bast-accordion-panel>
  </bast-accordion-item>
  <bast-accordion-item value="how">
    <bast-accordion-trigger>How do I style it?</bast-accordion-trigger>
    <bast-accordion-panel>With data-attributes.</bast-accordion-panel>
  </bast-accordion-item>
</bast-accordion>
```

Collapsible items sharing one root. Each item is keyed by a `value`; the root's
`value` holds the open item(s) as a comma-separated list (`value="what,how"`)
and emits `valuechange` with the open values as an array. Single-expansion by
default — opening one collapses the rest; add `multiple` to allow several open
at once. Triggers stay in the tab order (not roving) and wire `aria-expanded` /
`aria-controls`; arrow keys move focus between headers (Up/Down, or Left/Right
under `orientation="horizontal"`), wrapping, with Home / End jumping to the
ends. Mark an item `disabled` (or the whole root) to lock it — disabled items
are skipped by navigation. Style with `data-open` / `data-closed` /
`data-disabled`.

See [`examples/collapsible.html`](examples/collapsible.html),
[`examples/dialog.html`](examples/dialog.html),
[`examples/popover.html`](examples/popover.html),
[`examples/tabs.html`](examples/tabs.html),
[`examples/menu.html`](examples/menu.html),
[`examples/tooltip.html`](examples/tooltip.html), and
[`examples/accordion.html`](examples/accordion.html) for styled demos (serve the
repo root and open them — the import map resolves FAST from `node_modules`).

## Development

```bash
vp install   # install dependencies
vp test      # run unit tests (happy-dom)
vp check     # format, lint, type check
vp pack      # build the library
```

## Roadmap

**Collapsible**, **Dialog**, **Popover**, **Tabs**, **Menu**, **Tooltip**, and
**Accordion** are implemented. See [`ROADMAP.md`](ROADMAP.md) for the full
checklist — next up are **Menu** submenus, **Select** (reusing the positioner),
form primitives (**Switch** / **Checkbox** / **Radio Group**), and a thin React
wrapper over the same elements.
