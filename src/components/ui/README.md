# UI Kit

47 components organized as flat siblings under `src/components/ui/`. This
document is the categorized index — the folder layout stays flat because that
is the pattern used by shadcn/ui, Radix, Reka UI, MUI, and Chakra: category is
a **documentation concern**, not a code concern. Consumers import via a stable
path (`@/components/ui/{name}`) and never care where a component sits in the
docs sidebar.

For **origin** (shadcn-vue vs custom) and dependency information, see
[`PROVENANCE.md`](./PROVENANCE.md).

For **API surface**, see [`../UI_KIT_API.md`](../UI_KIT_API.md).

For **structural conventions** (composite/, feature slots, etc.), see
[`../COMPONENT_STRUCTURE.md`](../COMPONENT_STRUCTURE.md).

---

## Categorized index

### Primitives — smallest interactive building blocks

| Component   | Import                        | Notes                      |
| ----------- | ----------------------------- | -------------------------- |
| Button      | `@/components/ui/button`      | CVA variants               |
| Input       | `@/components/ui/input`       | Text input primitive       |
| Textarea    | `@/components/ui/textarea`    | Auto-resize                |
| Label       | `@/components/ui/label`       | Form label                 |
| Checkbox    | `@/components/ui/checkbox`    |                            |
| Radio Group | `@/components/ui/radio-group` | Includes `RadioOptionCard` |
| Switch      | `@/components/ui/switch`      |                            |
| Badge       | `@/components/ui/badge`       | Soft variants supported    |
| Skeleton    | `@/components/ui/skeleton`    | Loading placeholder        |
| Progress    | `@/components/ui/progress`    |                            |
| Card        | `@/components/ui/card`        | Surface                    |
| Item        | `@/components/ui/item`        | Card-like row              |
| Divider     | `@/components/ui/divider`     | Horizontal separator       |

### Overlays — modals, sheets, popovers, tooltips

| Component    | Import                         | Notes                              |
| ------------ | ------------------------------ | ---------------------------------- |
| Dialog       | `@/components/ui/dialog`       | Modal (reka-ui)                    |
| Drawer       | `@/components/ui/drawer`       | Bottom drawer primitive (vaul-vue) |
| Sheet        | `@/components/ui/sheet`        | Side sheet (reka-ui)               |
| Bottom Sheet | `@/components/ui/bottom-sheet` | Composed on Drawer                 |
| Right Sheet  | `@/components/ui/right-sheet`  | Composed on Drawer                 |
| Popover      | `@/components/ui/popover`      | Anchored floating                  |
| Tooltip      | `@/components/ui/tooltip`      | Hover hint                         |
| Sonner       | `@/components/ui/sonner`       | Toast — mobile safe-area aware     |

### Navigation — controls that change what the user sees

| Component               | Import                                    | Notes                  |
| ----------------------- | ----------------------------------------- | ---------------------- |
| Accordion               | `@/components/ui/accordion`               |                        |
| Breadcrumb              | `@/components/ui/breadcrumb`              |                        |
| Dropdown Menu           | `@/components/ui/dropdown-menu`           |                        |
| Command                 | `@/components/ui/command`                 | Cmdk-style palette     |
| Swipeable Tabs          | `@/components/ui/swipeable-tabs`          | Touch-first tabs       |
| Pill Tab                | `@/components/ui/pill-tab`                | Pill-shape scroll tabs |
| Infinite Scroll Trigger | `@/components/ui/infinite-scroll-trigger` | Pagination sentinel    |

### Form — inputs designed for form usage

| Component             | Import                                  | Notes                      |
| --------------------- | --------------------------------------- | -------------------------- |
| Form                  | `@/components/ui/form`                  | vee-validate + zod wrapper |
| Combobox              | `@/components/ui/combobox`              | Searchable + multi-select  |
| Native Select         | `@/components/ui/native-select`         | HTML select primitive      |
| Country Code Selector | `@/components/ui/country-code-selector` | Phone country picker       |
| Calendar              | `@/components/ui/calendar`              | Date grid primitive        |
| Date Picker           | `@/components/ui/date-picker`           | Calendar + popover         |
| Time Picker           | `@/components/ui/time-picker`           | Hour/minute picker         |
| Number Stepper        | `@/components/ui/number-stepper`        | Quantity input             |
| Tag Input             | `@/components/ui/tag-input`             | Multi-tag entry            |
| Image Uploader        | `@/components/ui/image-uploader`        | File upload with preview   |
| Rich Editor           | `@/components/ui/rich-editor`           | Quill wrapper              |

### Data display — surfaces information

| Component   | Import                        | Notes                          |
| ----------- | ----------------------------- | ------------------------------ |
| Table       | `@/components/ui/table`       | Full-featured data table       |
| Image       | `@/components/ui/image`       | Skeleton-aware image           |
| Alert       | `@/components/ui/alert`       | AlertBox with icon + v-html    |
| Empty State | `@/components/ui/empty-state` | No-data placeholder            |
| Flag        | `@/components/ui/flag`        | Country flag                   |
| Swiper      | `@/components/ui/swiper`      | Carousel                       |
| Curved Edge | `@/components/ui/curved-edge` | Decorative rounded top overlay |

### Media

| Component  | Import                       | Notes            |
| ---------- | ---------------------------- | ---------------- |
| QR Scanner | `@/components/ui/qr-scanner` | Camera QR reader |

---

## Why flat, not nested?

Every UI library that has succeeded as an extractable package uses flat
sibling folders per component, even when their docs are categorized:

- **shadcn/ui**: `components/ui/button.tsx` — flat
- **Radix UI**: `@radix-ui/react-dialog` — flat package per component
- **Reka UI**: flat exports
- **MUI**: `@mui/material/Button` — flat
- **Chakra**: flat exports from a single package

Flat lets us:

- Reshuffle categories in this README without breaking any import paths
- Extract into `packages/ui` without moving files
- Keep import paths short: `@/components/ui/button`, not
  `@/components/ui/primitives/button`
- Tree-shake cleanly from a single barrel

Category is UX for readers of this README. Folder structure is UX for the
compiler and consumers. They don't have to match.
