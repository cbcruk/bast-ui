# Roadmap

Tracks bast-ui's path from proof-of-concept to a usable headless web-component
layer. Each primitive mirrors its Base UI counterpart's anatomy and styling
contract (`data-*` attributes, matching ARIA).

## Shipped

- [x] **Project scaffolding** — Vite+, happy-dom tests, `dist` build, package metadata
- [x] **Shared architecture** — `ContextConsumer` base (W3C Context Protocol),
      `createId`, light-DOM (`shadowOptions: null`) convention
- [x] **Behavior utilities** — focus trap / `getFocusable`, scroll lock, inert
      background, `computePosition` (anchor positioning)
- [x] **Collapsible** — root / trigger / panel
- [x] **Dialog** — root / trigger / backdrop / popup / title / description / close
      (modal, focus trap, scroll lock, inert, top layer, dismiss)
- [x] **Popover** — root / trigger / positioner / popup / title / description / close
      (non-modal, anchor positioning, light dismiss)
- [x] **Tabs** — root / list / tab / panel (roving tabindex, `aria-selected`,
      horizontal/vertical orientation, automatic/manual activation)
- [x] **Menu** — root / trigger / positioner / popup / item (roving focus,
      arrow-key navigation, typeahead, anchor positioning, light dismiss,
      focus restore) — submenus still to come
- [x] **Tooltip** — root / trigger / positioner / popup (hover/focus intent,
      open/close delays, `aria-describedby`, anchor positioning, hoverable,
      `Escape` dismiss)
- [x] **Accordion** — root / item / trigger / panel (single/multiple expansion,
      `value` list, arrow-key header navigation, per-item + root `disabled`)
- [x] **Switch / Checkbox / Radio Group** — `aria-checked` form primitives
      (Switch + Checkbox share a toggle base; Checkbox adds indeterminate; Radio
      Group has roving tabindex + arrow selection)

## Next primitives

- [ ] **Menu submenus** — nested `Menu` items that open on hover / `ArrowRight`
- [ ] **Select / Combobox** — listbox, typeahead, reuses the positioner
- [ ] **Toast** — region + queue, timed dismissal

## Cross-cutting

- [ ] **Controlled vs uncontrolled** — support both `open` (controlled) and
      `default-open`, consistently across primitives
- [ ] **`Popover.Arrow` / `Dialog` arrow** — positioned arrow element
- [ ] **Form association** — `ElementInternals` `name` / `value` submission for
      Switch / Checkbox / Radio Group (currently state + events only)
- [ ] **Animation hooks** — keep elements mounted during exit (`data-closed`
      transition window) before hiding
- [ ] **RTL** — mirror `align` / side logic under `dir="rtl"`
- [ ] **Real-browser verification** — Playwright/WebdriverIO smoke tests for
      top layer, focus, and positioning (happy-dom can't render layout)
- [ ] **`@floating-ui/dom` adapter** — optional dependency for advanced
      collision handling, swappable behind `computePosition`

## Packaging & DX

- [ ] **Per-primitive entry points** — `bast-ui/dialog` etc. for tree-shaking
- [ ] **Custom Elements Manifest** — generate `custom-elements.json` for IDE/docs
- [ ] **React wrapper** — thin `@lit-labs/react`-style bindings over the same elements
- [ ] **Docs site** — anatomy, props/attributes, styling recipes, a11y notes
- [ ] **First npm release** — set version, changesets, publish
