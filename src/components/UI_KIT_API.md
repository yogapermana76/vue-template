# UI Kit — Public API & Dependencies Audit

Audit for extracting `src/components/ui/` into a shareable package (Fase 0
preparation). Read this together with `COMPONENT_STRUCTURE.md`.

Numbers reflect the state of the repo at the time this file was written; run
`scripts/audit-ui.sh` (or the one-liners at the bottom) to refresh.

## Peer dependencies (external)

Everything the UI kit needs from consumers. When extracted, these become
`peerDependencies` in the package.json — consumers install them once, we don't
bundle them.

### Core (always required)

| Package                    | Usage sites | Notes                                                                    |
| -------------------------- | ----------- | ------------------------------------------------------------------------ |
| `vue`                      | 185         | v3.5+ (Composition API + defineModel)                                    |
| `reka-ui`                  | 127         | Headless primitives (Radix Vue's successor). Almost every folder.        |
| `@vueuse/core`             | 43          | Utility composables (useVModel, reactiveOmit, useMediaQuery, useStorage) |
| `lucide-vue-next`          | 39          | Icons. Every composite with an icon imports from here.                   |
| `vaul-vue`                 | 12          | Drawer / bottom-sheet primitive                                          |
| `class-variance-authority` | 10          | Variant styling for Button, Badge, PillTab                               |

### Optional (used by a single component — could be `peerDependenciesMeta.optional`)

| Package                   | Component                         | Notes                                                  |
| ------------------------- | --------------------------------- | ------------------------------------------------------ |
| `vue-sonner`              | `ui/sonner/`                      | Toaster; skip if consumer doesn't render `<Toaster />` |
| `quill`                   | `ui/rich-editor/`                 | Rich text editor; heavy dep, keep optional             |
| `@internationalized/date` | `ui/date-picker/`, `ui/calendar/` | Date manipulation                                      |
| `vue-qrcode-reader`       | `ui/qr-scanner/`                  | Camera-based scanner                                   |
| `@vueuse/gesture`         | `ui/swipeable-tabs/`              | Touch gestures                                         |

## Internal dependencies (`@/`)

Things `ui/` imports from _within_ this project. These become a problem when
extracting because they don't exist inside the package. Each one is either:

- **Inlined** into the package (small utility, unlikely to change)
- **Extracted** as a sibling package (shared across kit + apps)
- **Removed** by refactoring (layer violation)

| Import                                                                           | Sites             | Recommended action                                                                         |
| -------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------ |
| `@/utils/cn`                                                                     | **127**           | ⭐ **Move into `packages/ui/src/lib/cn.ts`** — trivial 3-line helper, no reason to share.  |
| `@/composables/ui/*` (useDataTable, useStickyColumns, useTableColumns, useImage) | 9                 | Move into `packages/ui/src/composables/` — they only exist to serve `ui/` components.      |
| `@/config/input-formats`                                                         | 1 (TextField)     | Move into `packages/ui/src/lib/input-formats.ts`                                           |
| `@/assets/illustrations/*` (mascot-confirm, disappointed, pensive, check)        | 4 (ConfirmDialog) | Move into `packages/ui/src/assets/illustrations/`                                          |
| `@/components/layout`                                                            | 1 (QrScanner)     | ❌ **Layer violation**. Refactor QrScanner to not import from `layout/` before extraction. |

## Public API surface

What `ui/` currently exports through `src/components/ui/index.ts`. This is the
contract consumers depend on — **removing anything here is a breaking change.**

Categories (auto-generated from the barrel):

- **Layout primitives** — Card, Divider, CurvedEdge, Item, Skeleton
- **Typography** — Label, Badge
- **Buttons** — Button, IconButton, FloatingScanButton
- **Overlays** — Dialog, DialogWrapper, ConfirmDialog, DetailDialog, FormDialog,
  RightSheet, DetailSheet, CrudFormSheet, DetailSection, DetailField,
  FormSection, SheetHeader, Sheet, Drawer, Popover, Tooltip, Sonner (Toaster)
- **Data display** — Table (+ subs), DataTable, TablePagination, TableActions,
  Accordion, ExpandableItem, AccordionList
- **Forms** — Input, InputGroup, TextField, TextAreaField, PasswordField,
  FormField, Textarea, Checkbox, Switch, RadioGroup, NativeSelect,
  SelectOption, SelectOptionField, Combobox, SearchableSelectField,
  MultiSelectField, DatePicker, TimePicker, TagInput, NumberStepper,
  Calendar, RichEditor, CountryCodeSelector, Flag
- **Feedback** — Alert, AlertBox, EmptyState
- **Media** — Image, ImageUploader
- **Utility** — InfiniteScrollTrigger, SwipeableTabs, Swiper, PillTab,
  ScrollablePillTabs, Command, DropdownMenu, Breadcrumb, QrScanner

## Design tokens

The visual language currently lives in `src/assets/css/main.css`. When the kit
is extracted, tokens must ship with it — otherwise consumer apps import
components but don't get the color / radius / spacing they expect.

Recommendation: split the CSS into two files that both live inside the kit:

- `packages/ui/src/styles/tokens.css` — `@theme` block with color, radius,
  spacing, typography tokens. Consumed via `@import "@your-org/ui/tokens.css";`
- `packages/ui/src/styles/base.css` — layer 3 utilities (font-face, base body
  styles) — optional, consumers may want their own base.

Both are re-exported from `packages/ui/src/index.ts` as string paths so
consumers can `@import` them in their own CSS entry.

## What is NOT public API

Files that are internal to a component folder are not part of the contract.
They may change without a major version bump:

- Anything under `ui/*/composite/` when consumed via a nested import
  (`@your-org/ui/dialog/composite/…`) — always go through the folder barrel
  (`@your-org/ui/dialog`)
- The `types.ts` sibling files in `ui/table`, `ui/combobox` — use only the
  re-exports from the barrel

## Migration blockers (fix before extracting)

- [ ] Refactor `ui/qr-scanner/QrScanner.vue` to not import from
      `@/components/layout` (layer violation).
- [ ] Verify tsconfig `paths` in the future `packages/ui/` — `@/` alias must
      resolve to `packages/ui/src/` inside the package, not the app's root.
- [ ] All `@/assets/illustrations/*.png` imports need to be part of the
      package's `assets/` folder so bundlers can resolve them.
