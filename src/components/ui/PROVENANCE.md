# Component Provenance

Tracks the **origin** of every component in `src/components/ui/`. Used when:

- Upgrading shadcn-vue upstream (know which components to diff against)
- Extracting into `packages/ui` (know what to license/attribute)
- Onboarding new devs (know which components are "ours" vs "standard")

For categorized usage index, see [`README.md`](./README.md).

Legend:

- **shadcn** — Sourced from [shadcn-vue registry](https://www.shadcn-vue.com/).
  Local modifications may exist; regenerate cautiously.
- **shadcn-composed** — Custom component composed on top of a shadcn primitive.
- **custom** — Original to this project. Not sourced from any registry.
- **third-party wrapper** — Thin wrapper over a non-shadcn library (Quill,
  Swiper, vue-qrcode-reader, etc.).

---

## Inventory

| Component               | Provenance          | Underlying deps                        | Notes                                                                     |
| ----------------------- | ------------------- | -------------------------------------- | ------------------------------------------------------------------------- |
| accordion               | shadcn              | reka-ui                                |                                                                           |
| alert                   | custom              | —                                      | AlertBox with icon slot + `v-html` description                            |
| badge                   | shadcn              | reka-ui                                | Extended with soft variants (primary-soft etc.)                           |
| bottom-sheet            | shadcn-composed     | vaul-vue (via drawer)                  | Bottom drawer wrapper with sticky header/footer + nested support          |
| breadcrumb              | shadcn              | reka-ui                                |                                                                           |
| button                  | shadcn              | reka-ui                                | CVA variants extended                                                     |
| calendar                | shadcn-composed     | reka-ui + @internationalized/date      | Decomposed into Header, MonthGrid, MonthPicker, YearPicker, HolidayLegend |
| card                    | shadcn              | —                                      |                                                                           |
| checkbox                | shadcn              | reka-ui                                |                                                                           |
| combobox                | shadcn-composed     | reka-ui (command + popover)            | SearchableSelect + MultiSelect variants                                   |
| command                 | shadcn              | reka-ui                                |                                                                           |
| country-code-selector   | custom              | —                                      | Uses bottom-sheet for picker                                              |
| curved-edge             | custom              | —                                      | Decorative rounded top overlay (was `rounded-overlap`)                    |
| date-picker             | shadcn-composed     | reka-ui/date + calendar + popover      | DatePickerField (form-integrated) + DatePickerBottomSheet variant         |
| dialog                  | shadcn              | reka-ui                                | Includes ConfirmDialog composite                                          |
| divider                 | custom              | —                                      | Simple `<hr>` primitive                                                   |
| drawer                  | shadcn              | vaul-vue                               | Bottom-drawer primitive                                                   |
| dropdown-menu           | shadcn              | reka-ui                                |                                                                           |
| empty-state             | custom              | —                                      | No-data placeholder with icon + title/description                         |
| flag                    | custom              | —                                      | Country flag component                                                    |
| form                    | shadcn              | vee-validate + zod                     | With TextField, PasswordField, RadioGroupField, etc.                      |
| image                   | custom              | —                                      | Skeleton-aware image with fallback                                        |
| image-uploader          | custom              | —                                      | Multi-file upload with preview and form integration                       |
| infinite-scroll-trigger | custom              | @vueuse/core (useIntersectionObserver) | Pagination sentinel                                                       |
| input                   | shadcn              | reka-ui                                | Includes InputGroup with prefix/suffix slots                              |
| item                    | shadcn              | reka-ui                                | Card-like row with Header/Content/Actions                                 |
| label                   | shadcn              | reka-ui                                |                                                                           |
| native-select           | custom              | —                                      | Wraps HTML `<select>` for accessibility                                   |
| number-stepper          | custom              | —                                      | +/- quantity input                                                        |
| pill-tab                | custom              | —                                      | Pill-shaped horizontally-scrollable tabs                                  |
| popover                 | shadcn              | reka-ui                                |                                                                           |
| progress                | shadcn              | reka-ui                                |                                                                           |
| qr-scanner              | third-party wrapper | vue-qrcode-reader                      | Camera-based QR reader                                                    |
| radio-group             | shadcn              | reka-ui                                | Extended with RadioOptionCard variant                                     |
| rich-editor             | third-party wrapper | quill                                  | Rich text editor                                                          |
| right-sheet             | shadcn-composed     | vaul-vue (via drawer)                  | Side-anchored drawer variant                                              |
| sheet                   | shadcn              | reka-ui                                |                                                                           |
| skeleton                | shadcn              | —                                      |                                                                           |
| sonner                  | shadcn              | vue-sonner                             | Extended with mobile safe-area handling                                   |
| swipeable-tabs          | custom              | @vueuse/gesture                        | Touch-swipeable tab set                                                   |
| swiper                  | third-party wrapper | swiper-vue                             | Carousel                                                                  |
| switch                  | shadcn              | reka-ui                                |                                                                           |
| table                   | shadcn-composed     | reka-ui + @vueuse/core                 | Full DataTable composite with sticky columns, pagination, actions         |
| tag-input               | custom              | —                                      | Multi-tag entry using Badge + Input                                       |
| textarea                | custom              | @vueuse/core                           | Auto-resize                                                               |
| time-picker             | custom              | popover + form + input                 | Hour/minute picker                                                        |
| tooltip                 | shadcn              | reka-ui                                |                                                                           |

---

## Summary

- **shadcn (base primitives)**: 25 components
- **shadcn-composed** (built on shadcn): 8 components
- **custom** (original): 12 components
- **third-party wrapper**: 3 components (qr-scanner, rich-editor, swiper)

**Total**: 47

---

## Peer dependencies

Direct library dependencies used across the kit:

- `vue` ^3.5
- `reka-ui` (headless primitives underlying most shadcn components)
- `vaul-vue` (drawer primitive)
- `@vueuse/core`, `@vueuse/gesture`
- `class-variance-authority` (variant styling)
- `lucide-vue-next` (icons)
- `vee-validate` + `zod` (form)
- `@internationalized/date` (calendar/date-picker)
- `vue-sonner` (toast)
- `quill` (rich-editor)
- `swiper` (swiper)
- `vue-qrcode-reader` (qr-scanner)

Optional peers (only pulled if the wrapping component is used) should be
marked `peerDependenciesMeta.optional = true` when extracted to
`packages/ui`. See [`../../MONOREPO_MIGRATION.md`](../../../MONOREPO_MIGRATION.md).
