import { defineConfig } from 'vite-plus'

export default defineConfig({
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
