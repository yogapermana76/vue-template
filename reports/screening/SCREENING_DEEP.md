# Deep Screening Report — File-Level Analysis

**Generated**: 2026-07-07
**Method**: File-by-file comparison across `src/components/{ui,shared}/` in
three projects.
**Rows scanned**: 271 files.
**Regenerate with**: `bash scripts/screen-ui-deep.sh`

Legend:

- **T** = `vite-vue-template` (source of improvements)
- **V** = `versace` (QA phase)
- **L** = `reward-loyalty-microapps-v2` (production)

Raw diffs: `reports/screening/deep/{ui,shared}/*.diff`

---

## Executive Summary

| Category         | Count | %   | Meaning                                                            |
| ---------------- | ----- | --- | ------------------------------------------------------------------ |
| **IDENTICAL**    | 103   | 38% | Same across all three. Zero action needed.                         |
| **ONLY_IN_T**    | 118   | 43% | New template work not yet in V/L. Candidates for propagation.      |
| **ONLY_IN_V**    | 13    | 5%  | Versace's own improvements not upstream. Consider adopting into T. |
| **ONLY_IN_TL**   | 7     | 3%  | In T and L, missing in V. Versace may need them.                   |
| **ONLY_IN_TV**   | 2     | 1%  | In T and V, missing in L. Small (Calendar).                        |
| **MEDIUM/MAJOR** | 25    | 9%  | Real divergence with content difference. Case-by-case.             |
| **MINOR**        | 3     | 1%  | Trivial diffs (usually 1–5 lines in `index.ts`).                   |

Of the 141 files present in all three projects: **103 (73%) identical**,
**28 (20%) diverged** with real content differences, plus 10 files barrel/type
files with small drift.

**This confirms the initial hypothesis: ~73% overlap is real, focused
reconciliation on the remaining 27% is feasible.**

---

## Divergence Patterns (the important one)

When three files differ, the divergence pattern tells you what happened:

| Pattern                         | Count | Interpretation                                                                                          | Action                                                                                                                     |
| ------------------------------- | ----- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **T-diverged** (V = L, T alone) | 7     | Template moved forward with new improvements; V and L still on the old shared version.                  | **Propagate T → V, L.** Low risk since V and L are already aligned.                                                        |
| **V-diverged** (T = L, V alone) | 14    | Versace has its own version — either an in-progress QA change or a feature specific to versace's needs. | **Review**: does the divergence contain something worth backporting into T? Or is it noise that should be reverted to T=L? |
| **L-diverged** (T = V, L alone) | 1     | Production has code unique from both template and versace.                                              | **Red flag**. Investigate immediately — production customisation without upstream trace is a maintenance risk.             |
| **All diverged** (3-way)        | 6     | Every project has a different version.                                                                  | **Manual 3-way merge** with human review. Highest-effort category.                                                         |

---

## The 21 Diverged Files — Detailed Manifest

### T-diverged (7 files) — Template's new work

| File                       | T↔V | T↔L | V↔L | What likely changed                                                               |
| -------------------------- | --- | --- | --- | --------------------------------------------------------------------------------- |
| `ui/badge/Badge.vue`       | 26  | 26  | 0   | Added `dot` prop (colored dot indicator for status pills)                         |
| `ui/button/Button.vue`     | 4   | 4   | 0   | Added `soft` prop wiring                                                          |
| `ui/button/index.ts`       | 47  | 47  | 0   | CVA config for `soft` variants + new solid variants (info/success/warning/danger) |
| `ui/card/Card.vue`         | 5   | 5   | 0   | Custom `shadow-card` class instead of `shadow-sm border`                          |
| `ui/checkbox/Checkbox.vue` | 9   | 9   | 0   | Indeterminate rendering + `[tr:hover>&]` cascade fix from DataTable work          |
| `ui/form/TextField.vue`    | 88  | 88  | 0   | Significant refactor (likely prefix icon, footer slot, format props)              |
| `ui/input/Input.vue`       | 11  | 11  | 0   | Group slot / attribute forwarding refactor                                        |

**Propagation strategy for this group**: propagate all seven to V and L in
one batch. V and L are already synchronised for these files (V↔L = 0), so the
merge is unambiguous. Effort: **~1 hour combined review**.

### V-diverged (14 files) — Versace's own work

These are the trickiest because they may represent legitimate versace-specific
features, or QA experiments that should be reverted.

| File                                                          | T↔V | V↔L | Investigation needed                                      |
| ------------------------------------------------------------- | --- | --- | --------------------------------------------------------- |
| `ui/alert/AlertBox.vue`                                       | 3   | 3   | Tiny — probably harmless.                                 |
| `ui/badge/index.ts`                                           | 13  | 13  | Different variant list — align with T's expanded palette. |
| `ui/bottom-sheet/BottomSheet.vue`                             | 17  | 17  | Non-trivial. Check what versace changed.                  |
| `ui/empty-state/EmptyState.vue`                               | 9   | 9   | Modest change.                                            |
| `ui/form/FormField.vue`                                       | 5   | 5   | Minor.                                                    |
| `ui/image/Image.vue`                                          | 6   | 6   | Minor.                                                    |
| `ui/radio-group/index.ts`                                     | 1   | 1   | Trivial (probably a new export for `RadioOptionCard`).    |
| `ui/swipeable-tabs/SwipeableTabBar.vue`                       | 3   | 3   | Minor.                                                    |
| `ui/swipeable-tabs/SwipeableTabPanel.vue`                     | 18  | 18  | Non-trivial.                                              |
| `ui/swipeable-tabs/SwipeableTabs.vue`                         | 27  | 27  | Non-trivial. Versace has its own tabs impl.               |
| `ui/swipeable-tabs/types.ts`                                  | 3   | 3   | Follows Tabs.vue change.                                  |
| `shared/bottom-sheets/information/InformationBottomSheet.vue` | 5   | 5   | Minor.                                                    |
| `shared/ticket-quantity-selector/TicketQuantitySelector.vue`  | 97  | 97  | Large. Versace overhauled it. Worth backporting?          |
| `shared/ticket-quantity-selector/index.ts`                    | 1   | 1   | Companion of above.                                       |

**Propagation strategy for this group**:

1. Skim each V-diverged diff (they're all in `reports/screening/deep/ui/…T-vs-V.diff`).
2. For each:
   - **If versace's version is a genuine improvement** → backport into T,
     which then propagates to L.
   - **If it's an experiment/regression** → revert V to T=L version.
3. Big fish: `swipeable-tabs/*` (four files) and `ticket-quantity-selector`
   (huge overhaul). Schedule dedicated review sessions.

### L-diverged (1 file) — Production's unique code

`ui/sonner/Sonner.vue` — 11 lines different in loyalty from T=V.

**Red flag**. Production shouldn't have unique component code that never
existed in dev projects. Possible causes:

- Hotfix applied directly to production and never merged back
- Legacy config tied to production toaster styling

**Action**: read the diff at
`reports/screening/deep/ui/sonner__Sonner.vue.T-vs-L.diff`, decide whether to
port the change into T or revert L to T's version.

### All-diverged (6 files) — 3-way merges

These need the most care because each project has evolved independently.

| File                                                            | T↔V | T↔L | V↔L | Notes                                                                                                          |
| --------------------------------------------------------------- | --- | --- | --- | -------------------------------------------------------------------------------------------------------------- |
| `ui/form/index.ts`                                              | 2   | 1   | 1   | Barrel drift — likely from adding new field exports.                                                           |
| `ui/input/InputGroup.vue`                                       | 12  | 10  | 2   | V and L are close (2 lines), T diverges more. Merge V+L, then diff with T.                                     |
| `ui/swipeable-tabs/SwipeableTabPanels.vue`                      | 31  | 15  | 46  | Three-way merge — hardest.                                                                                     |
| `shared/bottom-sheets/confirmation/ConfirmationBottomSheet.vue` | 5   | 3   | 8   | Small enough to reconcile manually in 15 min.                                                                  |
| `shared/search-input/SearchInput.vue`                           | 80  | 47  | 51  | Big three-way. Template's recent refactor introduced computed classes. Very high-value file (used everywhere). |
| `shared/_root/index.ts`                                         | 7   | 6   | 3   | Barrel drift.                                                                                                  |

**Propagation strategy for this group**: after V-diverged is resolved,
tackle these one at a time. `SearchInput.vue` is the highest priority because
every list page uses it.

---

## New Files Not Yet Propagated

### 118 files exist only in Template

Cluster analysis:

| Cluster                                           | File count | What it is                                                                                                                                                                       |
| ------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ui/dialog/**`                                    | 16         | Full Dialog primitive (Root, Content, Trigger, Overlay, Header, Footer, Title, Description, Close, Portal) + composites (DialogWrapper, ConfirmDialog, DetailDialog, FormDialog) |
| `ui/dropdown-menu/**`                             | 15         | Full Dropdown primitive                                                                                                                                                          |
| `ui/table/**`                                     | 13         | Table primitives + DataTable composite                                                                                                                                           |
| `ui/sheet/**`                                     | 10         | Sheet primitive                                                                                                                                                                  |
| `ui/command/**`                                   | 10         | Command palette                                                                                                                                                                  |
| `ui/right-sheet/**`                               | 9          | RightSheet + SheetHeader + composites (DetailSheet, CrudFormSheet, DetailSection, DetailField, FormSection)                                                                      |
| `ui/breadcrumb/**`                                | 8          | Breadcrumb primitive                                                                                                                                                             |
| `ui/native-select/**`                             | 7          | NativeSelect + SelectOption + SelectOptionField                                                                                                                                  |
| `ui/combobox/**`                                  | 7          | Combobox + SearchableSelect + MultiSelect                                                                                                                                        |
| `ui/popover/**`                                   | 5          | Popover primitive                                                                                                                                                                |
| `ui/image-uploader/**`                            | 4          | Image uploader                                                                                                                                                                   |
| `ui/time-picker/**`                               | 3          | Time picker                                                                                                                                                                      |
| `ui/rich-editor/**`                               | 3          | Quill wrapper                                                                                                                                                                    |
| `ui/date-picker/**`                               | 2          | Date picker                                                                                                                                                                      |
| `ui/tag-input/**`                                 | 3          | Tag input                                                                                                                                                                        |
| `ui/form/PasswordField.vue`                       | 1          | Password field composite (missing in V and L)                                                                                                                                    |
| `shared/PageHeader.vue`, `shared/CardSection.vue` | 2          | Shared root components                                                                                                                                                           |

**Propagation strategy**: **do not blanket-copy.** Instead:

- Wait until V or L actually needs a component in their roadmap.
- Copy per-need, in a controlled PR that includes a smoke test.
- Never copy to L (production) without a release window.

### 13 files exist only in Versace

| Group                       | Files                                                                                                                                                                                                |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ui/calendar/**` decomposed | `CalendarHeader.vue`, `CalendarHolidayLegend.vue`, `CalendarMonthGrid.vue`, `CalendarMonthPicker.vue`, `CalendarYearPicker.vue`, `composables/useCalendarClasses.ts`, `composables/useHolidayMap.ts` |
| Date picker for form        | `ui/form/DatePickerField.vue`                                                                                                                                                                        |
| Date picker bottom sheet    | `shared/date-picker-bottom-sheet/DatePickerBottomSheet.vue`, `index.ts`                                                                                                                              |
| Radio card variant          | `ui/radio-group/RadioOptionCard.vue`                                                                                                                                                                 |
| Skeleton                    | `shared/ticket-quantity-selector/TicketQuantitySelectorSkeleton.vue`                                                                                                                                 |
| Search variants             | `shared/search-input/variants.ts`                                                                                                                                                                    |

**Interesting**: versace has refactored `Calendar.vue` (monolithic in T)
into a proper decomposed component. This is likely a **real improvement**
worth backporting to T.

### 7 files exist in T and L but not V

All from `shared/location-picker/**`. Loyalty (production) uses it, template
has it, versace doesn't. Options:

- Versace doesn't need location picker → leave as-is.
- Versace needs one → copy from T.

### 2 files exist in T and V but not L

`ui/calendar/Calendar.vue` (208 lines T-vs-V diff — same file name but very
different content because versace decomposed it) and `ui/calendar/index.ts`.
Loyalty has no calendar UI at all.

---

## Recommended Reconciliation Waves

Priority ordered by risk and value.

### Wave A — Zero-effort verification (30 min)

Confirm the 103 IDENTICAL files really are identical (run `diff -q` on each).
No changes to any project.

### Wave B — T-diverged batch (2 hours)

Propagate the seven "T-diverged" files to V and L. Ship as one PR per
consumer:

- `ui/badge/Badge.vue`
- `ui/button/Button.vue` + `ui/button/index.ts`
- `ui/card/Card.vue` (after deciding canonical style)
- `ui/checkbox/Checkbox.vue`
- `ui/form/TextField.vue`
- `ui/input/Input.vue`

**Risk**: low. V=L are already aligned; T is a strict superset in most cases.

### Wave C — V-diverged review (half-day)

Review each V-diverged file. Classify each as:

- **Backport to T** — real improvement (candidates: SwipeableTabs family,
  TicketQuantitySelector, Calendar decomposition, DatePickerField)
- **Revert to T=L** — noise or QA experiment

Then apply the classification.

### Wave D — Production hotfix investigation (15 min)

Read `sonner/Sonner.vue` L-diff. Backport or revert.

### Wave E — 3-way merges (1 day)

Handle the six all-diverged files one at a time. `SearchInput.vue` first —
highest usage.

### Wave F — New component adoption (on demand, ongoing)

Adopt new template components (Dialog, Table, RightSheet, …) into V and L
when their roadmaps require them. Never blanket-copy.

---

## What Now?

You have three artefacts:

1. `reports/screening/detailed.tsv` — machine-readable manifest of every file
2. `reports/screening/deep/{ui,shared}/*.diff` — raw diffs to read
3. This document (`SCREENING_DEEP.md`) — reconciliation plan

Next natural step: **ship Wave B** (seven T-diverged files) as a proof of
concept for the propagation workflow. If Wave B feels sustainable, continue
with Wave C. If not, back off and rethink.

To review a specific diff, cat the file:

```bash
cat reports/screening/deep/ui/button__Button.vue.T-vs-V.diff
cat reports/screening/deep/shared/search-input__SearchInput.vue.T-vs-V.diff
```
