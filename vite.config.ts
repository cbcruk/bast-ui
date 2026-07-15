import { defineConfig } from 'vite-plus'

// The demo site (examples/) is built as a Vite multi-page app via `vp build`.
// `base` defaults to '/' for local dev/preview; the Pages workflow sets
// VITE_BASE=/bast-ui/ so absolute asset URLs resolve under the project subpath.
const EXAMPLE_PAGES = [
  'index',
  'collapsible',
  'dialog',
  'popover',
  'tabs',
  'menu',
  'tooltip',
  'accordion',
  'forms',
  'select',
  'toast',
]

export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  build: {
    outDir: 'site',
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(
        EXAMPLE_PAGES.map((page) => [
          page,
          new URL(`./examples/${page}.html`, import.meta.url).pathname,
        ]),
      ),
    },
  },
  staged: {
    '*': 'vp check --fix',
  },
  pack: {
    entry: {
      index: 'src/index.ts',
      collapsible: 'src/primitives/collapsible/index.ts',
      dialog: 'src/primitives/dialog/index.ts',
      popover: 'src/primitives/popover/index.ts',
      tabs: 'src/primitives/tabs/index.ts',
      menu: 'src/primitives/menu/index.ts',
      tooltip: 'src/primitives/tooltip/index.ts',
      accordion: 'src/primitives/accordion/index.ts',
      switch: 'src/primitives/switch/index.ts',
      checkbox: 'src/primitives/checkbox/index.ts',
      'radio-group': 'src/primitives/radio-group/index.ts',
      select: 'src/primitives/select/index.ts',
      toast: 'src/primitives/toast/index.ts',
    },
    dts: {
      tsgo: true,
    },
    exports: true,
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    semi: false,
    singleQuote: true,
  },
})
