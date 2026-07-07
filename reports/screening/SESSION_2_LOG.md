# Session 2 — Full Alignment (T → V, T → L)

**Date:** 2026-07-07
**Direction:** Template (T) is canonical → propagate to Versace (V) and Loyalty (L)
**Result:** 271/271 UI + shared files IDENTICAL across all three projects. V and L type-check clean.

---

## Starting state (after Session 1)

| Layer              | T   | V   | L   |
| ------------------ | --- | --- | --- |
| `ui/*` folders     | 47  | 33  | 31  |
| `shared/*` folders | 6   | 5   | 6   |

Session 1 pulled improvements from V and L into T. Session 2 pushes T back out.

---

## Actions

### 1. ui/\* folder adoption

Copied 14 folders from `T/src/components/ui/` to `V/src/components/ui/`:

```
breadcrumb, combobox, command, date-picker, dropdown-menu,
image-uploader, native-select, popover, rich-editor, right-sheet,
sheet, table, tag-input, time-picker
```

Copied 16 folders from `T/src/components/ui/` to `L/src/components/ui/`:

```
breadcrumb, calendar, combobox, command, date-picker, dialog,
dropdown-menu, image-uploader, native-select, popover, rich-editor,
right-sheet, sheet, table, tag-input, time-picker
```

### 2. Barrel sync

- `src/components/ui/index.ts` → V, L
- `src/components/shared/index.ts` → V, L

### 3. shared/\* folder adoption

- `location-picker/` → V

### 4. File-level residual fixes

- `ui/radio-group/RadioOptionCard.vue` → L (was ONLY_IN_TV)
- `shared/ticket-quantity-selector/TicketQuantitySelectorSkeleton.vue` → L (was ONLY_IN_TV)
- `ui/sonner/Sonner.vue` → V (V had older 17-line-diverged version; T & L already had the `useSafeArea` production version)

---

## Verification

### Screening report (`reports/screening/detailed.tsv`)

```
Total rows scanned: 271
IDENTICAL:          271
Non-identical:        0
```

### Type-check

- `versace`: `npx vue-tsc --noEmit` → exit 0, no errors
- `reward-loyalty-microapps-v2`: `npx vue-tsc --noEmit` → exit 0, no errors

### Final folder counts

| Layer              | T   | V   | L   |
| ------------------ | --- | --- | --- |
| `ui/*` folders     | 47  | 47  | 47  |
| `shared/*` folders | 6   | 6   | 6   |

---

## What changed vs. Session 1 scope

Session 1 was **backport** (V/L → T). Session 2 was **forward-port** (T → V, T → L).
After both sessions, the three projects share a byte-identical UI kit and shared layer.

This is the pre-condition for Phase 1 of `MONOREPO_MIGRATION.md`: `packages/ui/`
can now be extracted from T with zero merge conflicts against V and L.

---

## Next steps (not executed this session)

1. Manually smoke-test each app's dev server to confirm no runtime regressions
   (type-check catches most, but Vue template errors may only surface on render).
2. Commit alignment changes to V and L on dedicated branches
   (`chore/ui-alignment-2026-07`) before the monorepo extraction.
3. Proceed with `MONOREPO_MIGRATION.md` Phase 0 cleanup items
   (QrScanner layer violation, move `@/utils/cn`, move `@/composables/ui/*`).
