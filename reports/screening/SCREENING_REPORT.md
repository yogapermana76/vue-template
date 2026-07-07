# Screening Report — 3-Project Component Reconciliation

**Generated**: 2026-07-07
**Method**: Automated entry-file comparison + manual analysis of representative
sample.
**Scope**: `src/components/ui/*` and `src/components/shared/*` across:

- `~/Desktop/vite-vue-template` (T = template, source of improvements)
- `~/Desktop/versace` (V = QA phase)
- `~/Desktop/reward-loyalty-microapps-v2` (L = production)

Raw diffs are stored under `reports/screening/{ui,shared}/*.diff`.

## Summary

| Status              | Count | Meaning                                                                         |
| ------------------- | ----- | ------------------------------------------------------------------------------- |
| **IDENTICAL**       | 21    | Entry file bit-for-bit identical across all 3 projects. **No action.**          |
| **MINOR_DIFF**      | 2     | 1–10 line diff. Usually a new prop or small refactor. **Quick propagate.**      |
| **MEDIUM_DIFF**     | 6     | 11–50 line diff. Refactor or several new features. **Review before propagate.** |
| **MAJOR_DIFF**      | 5     | > 50 line diff. Deep divergence. **Case-by-case decision.**                     |
| **MISSING_IN_SOME** | 18    | Component exists only in a subset of projects. **New propagation.**             |
| **NO_ENTRY_FILE**   | 1     | Folder has no single "entry" — sub-only. Needs deeper scan.                     |

**Total components audited**: 53 (47 ui/ + 6 shared/)

## Priority Waves for Reconciliation

Reconciliation is proposed in waves, from lowest to highest risk. Each wave can
be shipped independently to consumer projects (versace, loyalty).

---

### 🟢 Wave 1 — IDENTICAL (no work, verify only)

These 21 components are bit-for-bit identical across all 3 projects. No
propagation needed. Verify with `diff -q` before touching to avoid regression.

```
accordion, alert, country-code-selector, divider, drawer, flag,
infinite-scroll-trigger, item, label, number-stepper, pill-tab, progress,
qr-scanner, radio-group, rounded-overlap, skeleton, swiper, switch, textarea,
tooltip, shared/pull-to-refresh
```

**Action**: none. Move on.

---

### 🟢 Wave 2 — MINOR_DIFF (2 components, quick wins)

Small, targeted improvements to propagate. Each is 4–5 lines of change.

#### `button` — Template adds `soft` prop

Template has a `soft: boolean` prop (muted variant tone) that versace and
loyalty lack. This was added for the redesign work.

- **Recommendation**: propagate T → V, T → L.
- **Risk**: low. Adding an optional prop with default `false` is backward compatible.
- **Consumer changes needed**: none. Existing usage still works.

#### `card` — Divergent styling convention

Template uses a custom `shadow-card` class. Versace/loyalty use standard
`shadow-sm border border-neutral-200`.

- **Recommendation**: **decide canonical style first** before propagating.
  - Option A: keep template's `shadow-card` (requires the class in main.css)
  - Option B: adopt versace/loyalty convention (portable, less styling coupling)
- **Risk**: medium. Visual change is user-visible.
- **Consumer changes needed**: styling review.

---

### 🟡 Wave 3 — MEDIUM_DIFF (6 components, review carefully)

Substantial diffs, but scoped enough to reconcile with a single review pass.

| Component      | T↔V | T↔L | V↔L | Likely cause                                                                                 |
| -------------- | --- | --- | --- | -------------------------------------------------------------------------------------------- |
| `badge`        | 26  | 26  | 0   | **T adds `dot` prop** (colored dot indicator for status pills). V/L identical to each other. |
| `bottom-sheet` | 17  | 0   | 17  | **T and L identical**, V has diverged. Likely V experimented and never merged back.          |
| `checkbox`     | 9   | 9   | 0   | **T adds indeterminate rendering** and hover-through-row logic (recent DataTable fix).       |
| `empty-state`  | 9   | 0   | 9   | **T and L identical**, V diverged. Same pattern as bottom-sheet.                             |
| `image`        | 6   | 0   | 6   | **T and L identical**, V diverged.                                                           |
| `input`        | 11  | 11  | 0   | Template added utility slots/props. V=L.                                                     |

**Pattern observed**: Many "T diverges from V=L". This means loyalty (production)
and versace (QA) share a common ancestor, and template has moved ahead. This is
actually the **easiest merge scenario** — the "canonical" past is clear (L),
and T is the future. Consumers just need to accept T's changes.

**Recommendation**: propagate T → V and T → L in tandem for these six. Each is
a 30-minute review + apply cycle.

---

### 🟠 Wave 4 — MAJOR_DIFF (5 components, case-by-case)

These need genuine architectural decision-making.

| Component                         | T↔V | T↔L | V↔L | Notes                                                                                                                                     |
| --------------------------------- | --- | --- | --- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `form`                            | 163 | 0   | 163 | **V adds `DatePickerField.vue`** (new component). T=L for existing files but T lacks V's new field. **Propagation direction: V → T → L.** |
| `swipeable-tabs`                  | 27  | 0   | 27  | Same V-divergence pattern as bottom-sheet.                                                                                                |
| `shared/search-input`             | 80  | 47  | 51  | **All three diverged.** Recent T refactor (extracted classes into computed props). Full 3-way merge needed.                               |
| `shared/ticket-quantity-selector` | 97  | 0   | 97  | V-diverged.                                                                                                                               |
| `sonner`                          | 0   | 11  | 11  | T=V, **L diverged**. Rare — production has customization not in dev projects. Investigate: is L's version an improvement or a hack?       |

**Recommendation**: schedule these individually. `form` and `search-input` are
the highest-value reconciliations. `sonner`'s L-divergence is a red flag —
production shouldn't have unique code that isn't in the template.

---

### 🔴 Wave 5 — MISSING_IN_SOME (18 components, new propagation)

These 15 components exist **only in template**, and would need to be added to
versace and loyalty as brand-new folders:

```
breadcrumb, combobox, command, date-picker, dialog, dropdown-menu,
image-uploader, native-select, popover, rich-editor, right-sheet, sheet,
table, tag-input, time-picker
```

These represent recent template work — new primitives (Dialog, Table, Sheet,
Popover) and composites (RightSheet, DataTable, etc.) that were added for the
redesign but haven't reached the two consumer projects.

**Recommendation**:

- Only propagate a component when a **consumer project actually needs it**.
  Adding 15 folders wholesale to production (loyalty) is risky — every folder
  is new dependency surface.
- Start with the primitives that consumers depend on for their planned features.
- **Do NOT propagate to loyalty without a release window** — this is
  production traffic.

Plus 3 more with mixed presence:

- `shared/date-picker-bottom-sheet` — only in V. Investigate: is this
  what V uses instead of `ui/date-picker/`? Consolidate.
- `shared/location-picker` — in T and L, not in V. V may need it.
- `ui/calendar` — in T and V, not in L. L may need it if it adds date UI.

---

## Method Limitations (what this pass didn't catch)

- **Only compared the "entry" `.vue` file** per component folder. For folders
  with many files (Dialog has 10, Table has 9), other files may also differ.
- **When folders have no shared entry file** (e.g. `form/` in T has `FormField`
  as its first file, in V it's `DatePickerField`), the diff compared
  unrelated files — treat those numbers as noise, not signal. The `form/`
  MAJOR_DIFF is such a false positive at the entry-file level; the real signal
  is "V has DatePickerField".
- **Type declaration files, index barrels, and CVA variant configs** were not
  audited separately.
- **Ignored `composables/`, `stores/`, `utils/`** — outside scope of this pass.

## Suggested Next Steps

Ranked by ROI:

1. **Ship Wave 2 (button `soft`)** — pure gain, 15 minutes across two projects.
2. **Decide canonical `card` style** — visual product decision, then ship.
3. **Ship Wave 3 in one batch** — six related fixes, 3 hours total.
4. **Do a deep-scan pass on the folders that need it**: `dialog`, `table`,
   `right-sheet`, `form`, `sheet`. Bulk of the divergence lives there and
   the entry-file method missed it.
5. **Wave 4 individually**, prioritising `form` (needed by V) and
   `search-input` (used by every list page).
6. **Wave 5 by demand** — only add a new component to a consumer when that
   consumer's roadmap actually requires it.

## How To Regenerate This Report

```bash
bash scripts/screen-ui.sh
column -t -s $'\t' reports/screening/summary.tsv
```

The raw per-component diffs are in `reports/screening/{ui,shared}/`.
