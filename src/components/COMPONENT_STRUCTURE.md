# Component Structure Convention

This document describes how components in this project are organized. Follow it
when adding new UI. Consistency here is what makes the codebase scale.

## Layer Model

```
src/components/
├── ui/           ← Layer 1 · Base UI (shadcn-vue primitives + third-party wrappers)
├── layout/       ← Layer 2 · App shell (sidebar, header, breadcrumb, dashboard chrome)
├── shared/       ← Layer 3 · App-wide reusable patterns (PageHeader, CardSection, SearchInput, …)
└── (features)    ← Layer 4 · Feature-specific components live under `src/features/**`
```

The layers form a **strict dependency hierarchy**:

- `layout/`, `shared/`, `features/` may import from `ui/`
- `features/` may import from `shared/` and `ui/`
- `ui/` may NOT import from any of the higher layers

## Layer 1 — `ui/`

Each folder represents **one UI concept** (button, dialog, table, form, …).
Inside a folder there are up to two tiers of files:

### Primitive-tier (root of the folder)

Thin wrappers over headless libraries such as `reka-ui`, `vaul-vue`, or a raw
HTML element. They mirror the shadcn-vue upstream API.

```
ui/dialog/
├── Dialog.vue          ← DialogRoot wrapper
├── DialogContent.vue   ← DialogContent primitive
├── DialogTrigger.vue   ← DialogTrigger primitive
├── …
└── index.ts
```

Rule of thumb: **if it's part of the shadcn-vue registry, it lives at the root
of its folder.**

### Composite-tier (`composite/` subfolder)

Higher-level patterns built by composing several primitives above. They add
opinionated defaults (padding, close button, footer layout, illustrations, …)
but stay generic enough to be reused across features.

```
ui/dialog/
├── Dialog.vue                       ← primitive
├── DialogContent.vue                ← primitive
├── …
└── composite/
    ├── DialogWrapper.vue            ← preset layout for a "content dialog"
    ├── ConfirmDialog.vue            ← delete/warning confirm pattern
    ├── DetailDialog.vue             ← card-in-dialog detail viewer
    ├── FormDialog.vue               ← card-in-dialog form (create/edit)
    └── index.ts
```

Rule of thumb: **if it combines two or more primitives OR carries product-level
defaults (e.g. teal color, mascot illustration), it belongs in `composite/`.**

### Folders that only contain composites

Folders whose entire contents are composite-tier (built on top of a primitive
from _another_ folder) stay flat — no `composite/` subfolder needed. Examples:

- `ui/form/` — TextField, PasswordField, TextAreaField, FormField compose
  `ui/input` + `ui/label` + `ui/textarea`
- `ui/bottom-sheet/` — a single composite on top of `ui/drawer`
- `ui/right-sheet/` at the root — `RightSheet.vue` and `SheetHeader.vue`
  are the local primitives; the rest live in `composite/`

### Third-party wrappers

Components that wrap a large third-party library (Swiper, RichEditor, QRScanner,
…) live in the same layer as primitives — one folder per library. They expose a
Vue-idiomatic API on top of the vendor's own component surface.

## Barrel exports

Every folder in `ui/` exposes its public API through `index.ts`:

```ts
// ui/dialog/index.ts
export { default as Dialog } from './Dialog.vue'
export { default as DialogContent } from './DialogContent.vue'
// …primitives…
export * from './composite' // re-exports everything from ./composite/index.ts
```

```ts
// ui/dialog/composite/index.ts
export { default as DialogWrapper } from './DialogWrapper.vue'
export { default as ConfirmDialog } from './ConfirmDialog.vue'
// …
```

Consumers import from the folder root, never from a file path:

```ts
// ✅ Good
import { Dialog, DialogContent, ConfirmDialog } from '@/components/ui/dialog'

// ❌ Avoid
import ConfirmDialog from '@/components/ui/dialog/composite/ConfirmDialog.vue'
```

This keeps composite/primitive internals free to move without breaking imports.

## Layer 2 — `layout/`

Dashboard chrome and app shell components: sidebar, layout header, breadcrumb,
navigation groups. These are the pieces that render around `<RouterView />`.
Anything that describes the outer skeleton of a page lives here.

## Layer 3 — `shared/`

Small, opinionated components that are reused across many pages but aren't
generic enough to belong in `ui/`. Rule of thumb: **if a component is used by
2+ features/pages but is not a UI primitive**, it lives here.

Examples: `PageHeader`, `CardSection`, `SearchInput`, `TransitionedRouterView`,
domain-agnostic bottom sheets used across the app.

## Layer 4 — `features/`

Domain-specific components live under `src/features/<domain>/components/` next
to their composable, types, and constants. See any existing feature (e.g.
`features/products/`) for the pattern.

## Naming

- **Folder** — kebab-case (`data-picker/`, `right-sheet/`)
- **File** — PascalCase Vue SFCs (`DatePicker.vue`, `RightSheet.vue`)
- **Barrel** — always `index.ts`

## When to add a `composite/` subfolder

Add one when a folder starts to hold **both** primitives _and_ higher-level
patterns. If the folder is homogeneous — either "all primitives" or "all
composites" — keep it flat.

## When to add a new folder at the `ui/` root

Add a folder when you introduce a new UI concept. Do _not_ add a folder for a
single-purpose composite built from an existing primitive; put it inside that
primitive's `composite/` subfolder instead. Example: a "user-avatar dialog"
belongs in `ui/dialog/composite/`, not in `ui/user-avatar-dialog/`.

## Migration & library extraction

The structure above maps cleanly onto a future package split, should you
extract this UI kit as a library:

- `ui/` root files → `@your-org/ui-primitives`
- `ui/*/composite/**` + `shared/` → `@your-org/ui-patterns`
- `layout/` → application-specific, stays private
