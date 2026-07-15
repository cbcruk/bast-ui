# bast-ui

Headless, accessible UI primitives as native **web components** — a
[Base UI](https://base-ui.com) / [Radix](https://www.radix-ui.com)-style layer
built on [FAST](https://github.com/microsoft/fast), with no framework runtime.

Base UI and Radix are excellent but React-only. `bast-ui` mirrors their
component anatomy and styling contract (`data-open`, `data-closed`,
`data-disabled`, matching ARIA) as framework-agnostic custom elements, so the
same primitives work in any page — and stay small enough for browser extensions
(the full set — Collapsible, Dialog, Popover, Tabs, Menu, Tooltip, Accordion,
Switch, Checkbox, Radio Group, Select, Toast — plus runtime is ~10.7 kB
gzipped).

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
import 'bast-ui' // registers every primitive
```

Or import just the primitives you use — each has its own entry point, so a
bundler only ships the ones you touch (the shared runtime is split into a chunk
they reference):

```ts
import 'bast-ui/dialog'
import 'bast-ui/select'
```

Subpaths mirror the primitive names: `bast-ui/collapsible`, `bast-ui/dialog`,
`bast-ui/popover`, `bast-ui/tabs`, `bast-ui/menu`, `bast-ui/tooltip`,
`bast-ui/accordion`, `bast-ui/switch`, `bast-ui/checkbox`,
`bast-ui/radio-group`, `bast-ui/select`, `bast-ui/toast`.

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

### Switch, Checkbox & Radio Group

```html
<bast-switch></bast-switch>

<bast-checkbox></bast-checkbox>
<bast-checkbox indeterminate></bast-checkbox>

<bast-radio-group value="md" aria-label="Size">
  <bast-radio value="sm"></bast-radio>
  <bast-radio value="md"></bast-radio>
  <bast-radio value="lg"></bast-radio>
</bast-radio-group>
```

Form controls that carry state and ARIA but no built-in styling. **Switch**
(`role="switch"`) and **Checkbox** (`role="checkbox"`) toggle on click or Space,
reflect `aria-checked` and `data-checked` / `data-unchecked`, and emit
`checkedchange`; Checkbox also supports `indeterminate` (`aria-checked="mixed"`,
`data-indeterminate`), which a click resolves to checked. **Radio Group**
(`role="radiogroup"`) tracks the selected `value` and emits `valuechange`; its
radios use roving tabindex (only the checked one — or the first when none is
selected — is tabbable) and arrow keys move focus **and** selection together
(Up/Down, or Left/Right under `orientation="horizontal"`), wrapping, with
Home / End. All three honor `disabled` (per-radio and whole-group), skipping
disabled radios during navigation. Form submission via `ElementInternals` is on
the roadmap — for now, read state from the element or the change events.

### Select

```html
<bast-select value="green">
  <bast-select-trigger>
    <bast-select-value placeholder="Pick a color"></bast-select-value>
  </bast-select-trigger>
  <bast-select-positioner>
    <bast-select-popup>
      <bast-select-option value="red">Red</bast-select-option>
      <bast-select-option value="green">Green</bast-select-option>
      <bast-select-option value="blue">Blue</bast-select-option>
    </bast-select-popup>
  </bast-select-positioner>
</bast-select>
```

A listbox select. The trigger (`role="combobox"`, `aria-haspopup="listbox"`)
opens on click, Enter/Space, or Arrow keys. Inside the `role="listbox"` popup,
options (`role="option"`, `aria-selected`) take roving focus — arrow keys
navigate with wraparound, Home / End jump to the ends, and typing focuses the
next option matching the prefix; opening focuses the currently selected option
(or the first). Choosing an option (click, Enter, or Space) sets the root
`value`, emits `valuechange`, closes, and restores focus to the trigger;
`Escape`, `Tab`, or an outside click also dismiss. `bast-select-value` renders
the selected option's label (or its `placeholder`, marked `data-placeholder`).
Disabled options are skipped, and a `disabled` root won't open. Positioning
reuses the same `side` / `align` / `side-offset` config as Popover and Menu.

### Toast

```html
<bast-toast-region>
  <bast-toast open duration="5000">
    <bast-toast-title>Saved</bast-toast-title>
    <bast-toast-description>Your changes were saved.</bast-toast-description>
    <bast-toast-close aria-label="Dismiss">✕</bast-toast-close>
  </bast-toast>
</bast-toast-region>
```

A self-managing toast. While `open`, it auto-dismisses after `duration` ms
(default `5000`; `0` disables), and the timer pauses while the toast is hovered
or focused and resumes on leave/blur. It emits `openchange` when it dismisses —
listen for that to remove it from the DOM (after your exit transition). Setting
the `open` attribute or property shows it, so the same element works
declaratively or driven from script. A background toast (default) is a polite
`role="status"` live region; `type="foreground"` makes it an assertive
`role="alert"`. `bast-toast-title` / `bast-toast-description` wire
`aria-labelledby` / `aria-describedby`, `bast-toast-close` dismisses, and
`bast-toast-region` is the labelled `role="region"` landmark that holds the
stack. Style entrance/exit via `data-open` / `data-closed`.

See [`examples/collapsible.html`](examples/collapsible.html),
[`examples/dialog.html`](examples/dialog.html),
[`examples/popover.html`](examples/popover.html),
[`examples/tabs.html`](examples/tabs.html),
[`examples/menu.html`](examples/menu.html),
[`examples/tooltip.html`](examples/tooltip.html),
[`examples/accordion.html`](examples/accordion.html),
[`examples/forms.html`](examples/forms.html),
[`examples/select.html`](examples/select.html), and
[`examples/toast.html`](examples/toast.html) for styled demos — run them from
the demo site below.

## Examples

The [`examples/`](examples) directory is a small demo site, built as a Vite
multi-page app. [`examples/index.html`](examples/index.html) is a gallery
linking every primitive's live demo, and each demo page renders an
**Attributes** table generated from `custom-elements.json` (via the tiny
[`examples/api-table.js`](examples/api-table.js) `<bast-api-table>` element), so
the API reference stays in sync with the source for free.

```bash
vp dev      # run the demo site locally, then open /examples/
vp build    # build the static site into site/
vp preview  # serve the production build
```

The site is deployed to GitHub Pages on every push to `main` by
[`.github/workflows/pages.yml`](.github/workflows/pages.yml), which builds with
`VITE_BASE=/bast-ui/` so assets resolve under the project subpath.

## Development

```bash
vp install   # install dependencies
vp test      # run unit tests (happy-dom)
vp check     # format, lint, type check
vp pack      # build the library
vp run cem   # regenerate custom-elements.json
```

The package ships a [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest)
(`custom-elements.json`, referenced by the `customElements` field) describing
every element's tag name and attributes, so editors and doc tools get
autocomplete and hovers. Regenerate it with `vp run cem` after changing a
primitive's anatomy or attributes.

## Roadmap

**Collapsible**, **Dialog**, **Popover**, **Tabs**, **Menu**, **Tooltip**,
**Accordion**, **Switch**, **Checkbox**, **Radio Group**, **Select**, and
**Toast** are implemented. See [`ROADMAP.md`](ROADMAP.md) for the full checklist
— next up are a **Toast** queue/manager, **Combobox** (editable Select),
**Menu** submenus, and a thin React wrapper over the same elements.
