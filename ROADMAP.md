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

## Next primitives

- [ ] **Menu submenus** — nested `Menu` items that open on hover / `ArrowRight`
- [ ] **Tooltip** — hover/focus intent + delay, reuses the positioner
- [ ] **Accordion** — Collapsible items with single/multiple expansion
- [ ] **Select / Combobox** — listbox, typeahead, reuses the positioner
- [ ] **Switch / Checkbox / Radio Group** — form primitives, `aria-checked`
- [ ] **Toast** — region + queue, timed dismissal

## Cross-cutting

- [ ] **Controlled vs uncontrolled** — support both `open` (controlled) and
      `default-open`, consistently across primitives
- [ ] **`Popover.Arrow` / `Dialog` arrow** — positioned arrow element
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
