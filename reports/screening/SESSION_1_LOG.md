# Session 1 — Backport Log

**Date**: 2026-07-07
**Objective**: Backport Versace's improvements ke Template, jadikan Template
sebagai canonical source untuk 3 project (vite-vue-template, versace,
reward-loyalty-microapps-v2).

## Files Backported dari Versace ke Template

### New components (13 files added to template)

| Component                                                            | Rationale                               |
| -------------------------------------------------------------------- | --------------------------------------- |
| `ui/calendar/Calendar.vue` (replaced)                                | Versace decomposed monolithic Calendar  |
| `ui/calendar/CalendarHeader.vue`                                     | Sub-component from decomposition        |
| `ui/calendar/CalendarHolidayLegend.vue`                              | Sub-component                           |
| `ui/calendar/CalendarMonthGrid.vue`                                  | Sub-component                           |
| `ui/calendar/CalendarMonthPicker.vue`                                | Sub-component                           |
| `ui/calendar/CalendarYearPicker.vue`                                 | Sub-component                           |
| `ui/calendar/composables/useCalendarClasses.ts`                      | Composable extracted                    |
| `ui/calendar/composables/useHolidayMap.ts`                           | Composable extracted                    |
| `ui/calendar/index.ts` (replaced)                                    | Updated exports                         |
| `ui/form/DatePickerField.vue`                                        | Combined DatePicker + FormField pattern |
| `shared/date-picker-bottom-sheet/DatePickerBottomSheet.vue`          | Mobile date picker                      |
| `shared/date-picker-bottom-sheet/index.ts`                           | Barrel                                  |
| `ui/radio-group/RadioOptionCard.vue`                                 | Card-style radio option                 |
| `shared/ticket-quantity-selector/TicketQuantitySelectorSkeleton.vue` | Loading state                           |
| `shared/search-input/variants.ts`                                    | CVA variants for SearchInput            |

### V-diverged files backported (10 files updated in template)

| File                                                          | Improvement                                                                              |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `ui/alert/AlertBox.vue`                                       | Support HTML in description via `v-html`                                                 |
| `ui/empty-state/EmptyState.vue`                               | Add `titleClass`, `descriptionClass` props + `v-html` support + `whitespace-pre-line`    |
| `ui/image/Image.vue`                                          | Remove `bg-neutral-100` from container (transparent-safe)                                |
| `ui/bottom-sheet/BottomSheet.vue`                             | Add `nested` prop for nested sheets + `#header` slot                                     |
| `ui/form/FormField.vue`                                       | Simplify Label class                                                                     |
| `ui/badge/index.ts`                                           | Add soft variants (primary-soft, secondary-soft, warning-soft, error-soft, neutral-soft) |
| `ui/radio-group/index.ts`                                     | Export RadioOptionCard                                                                   |
| `ui/swipeable-tabs/*.vue` (4 files)                           | Add `scrollFlow` prop + refactored panels                                                |
| `shared/bottom-sheets/information/InformationBottomSheet.vue` | Minor refinements                                                                        |
| `shared/ticket-quantity-selector/TicketQuantitySelector.vue`  | Major refactor (~50% larger)                                                             |
| `shared/search-input/SearchInput.vue`                         | Add `variant`, `clearable` props + hybrid `size` prop for template's toolbar use         |

### L-diverged files backported (1 file)

| File                   | Improvement                                                     |
| ---------------------- | --------------------------------------------------------------- |
| `ui/sonner/Sonner.vue` | Loyalty's production safe area handling for iOS/Android webview |

## Metrics

### Before Session 1

- **73%** identical (103/141 shared files)
- 14 V-diverged, 7 T-diverged, 1 L-diverged, 6 all-diverged

### After Session 1

- **Same 73%** identical (numbers unchanged because we shifted divergence pattern, not resolved it)
- T=V for most files (backported Versace's work into T)
- L still using old version for most files → next session must propagate T=V version to L

**Key insight**: Session 1 aligned T with V. Session 2 must align L (production)
with T=V, but requires a controlled release window.

## Template Now Contains

- All improvements from Versace (14 files added or updated)
- Loyalty's Safe Area Sonner (1 file)
- Template's own recent additions (Dialog, Table, RightSheet, etc — 118 T-only files)

Template is now the **canonical source of truth** for all future improvements.

## What Wasn't Done (Deferred to Session 2+)

- **Propagate T=V version to Loyalty** (production) — requires release window,
  QA cycle, and coordination with production deploy schedule.
- **T-diverged files** (Badge, Button, Card, Checkbox, TextField, Input,
  InputGroup) — Template's improvements (`soft` variant, `dot` prop,
  indeterminate checkbox, etc.) not yet in V and L. Wait for template
  release cycle.
- **New template folders** (Dialog, Table, Sheet, RightSheet, DropdownMenu,
  Popover, Combobox, Command, DatePicker, TimePicker, TagInput, RichEditor,
  ImageUploader, Breadcrumb, NativeSelect) — 15 folders = 118 files.
  Propagate on-demand when V or L roadmap requires it.

## Type-check Status

`npx vue-tsc --noEmit`: **Clean** — zero errors after all backports.

## Files Modified

Track all changes with `git diff` in the template repo. Each backport is
atomic and can be reverted individually if issues surface.
