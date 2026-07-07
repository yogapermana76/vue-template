# Monorepo Migration Roadmap

Roadmap for extracting `src/components/ui/` into a shared package consumed by
this repo and two sibling apps:

- `~/Desktop/vite-vue-template` (this repo — will become the reference app)
- `~/Desktop/versace`
- `~/Desktop/reward-loyalty-microapps-v2`

Read the sibling docs first:

- `src/components/COMPONENT_STRUCTURE.md` — how components are organised today
- `src/components/UI_KIT_API.md` — what the kit's public API and dependencies
  look like today

The migration happens in **phases**. Each phase can be executed and merged
independently. Phase 0 has already been done in this repo (audit + docs). The
rest below is planning — nothing is executed automatically.

---

## Phase 0 — Preparation (DONE)

Already completed:

- ✅ `src/components/COMPONENT_STRUCTURE.md` — layer model + composite/ convention
- ✅ `src/components/UI_KIT_API.md` — peer deps, internal deps, public API surface
- ✅ Consistent `composite/` subfolder pattern applied across `ui/*`
- ✅ Every `composite/` subfolder has an `index.ts` barrel
- ✅ Parent barrels use `export * from './composite'` (no direct file paths)

Remaining preparation items (do in this repo before Phase 1):

- [ ] Fix the QrScanner layer violation (`ui/qr-scanner/QrScanner.vue`
      imports `@/components/layout`). Refactor to accept a title/back handler
      via props instead.
- [ ] Move `@/utils/cn.ts` into `ui/lib/cn.ts` (or keep at `@/utils/` for now
      but note the eventual move).
- [ ] Move `@/composables/ui/*` (useDataTable, useStickyColumns, useTableColumns,
      useImage) into `ui/composables/` — they only exist to serve ui components.
- [ ] Move `@/config/input-formats.ts` into `ui/form/input-formats.ts`.
- [ ] Move the illustration PNGs used by `ConfirmDialog` into
      `ui/dialog/assets/` (or a shared `ui/assets/`).

Together those moves keep everything green in this repo and leave `ui/` with
zero `@/` imports — which is the definition of "ready to extract".

---

## Phase 1 — Workspace scaffolding

Create the monorepo layout without moving anything yet.

```
~/Desktop/workspace/                         ← new git repo
├── .gitignore
├── package.json                             ← private root workspace
├── pnpm-workspace.yaml                      ← packages: ['packages/*', 'apps/*']
├── tsconfig.base.json                       ← shared strict TS config
├── packages/
│   └── ui/                                  ← empty for now
│       ├── package.json                     ← name: @your-org/ui, private true
│       ├── tsconfig.json                    ← extends ../../tsconfig.base.json
│       └── src/
└── apps/                                    ← empty for now
```

Root `package.json`:

```json
{
  "name": "workspace-root",
  "private": true,
  "scripts": {
    "dev": "pnpm -r --parallel run dev",
    "build": "pnpm -r run build",
    "typecheck": "pnpm -r run typecheck",
    "lint": "pnpm -r run lint"
  },
  "devDependencies": {
    "typescript": "^5.5.0"
  }
}
```

`pnpm-workspace.yaml`:

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

`packages/ui/package.json` (initial skeleton):

```json
{
  "name": "@your-org/ui",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./src/index.ts"
    },
    "./tokens.css": "./src/styles/tokens.css",
    "./*": "./src/*"
  },
  "peerDependencies": {
    "vue": "^3.5.0",
    "reka-ui": "*",
    "@vueuse/core": "*",
    "lucide-vue-next": "*",
    "vaul-vue": "*",
    "class-variance-authority": "*"
  },
  "peerDependenciesMeta": {
    "vue-sonner": { "optional": true },
    "quill": { "optional": true },
    "@internationalized/date": { "optional": true },
    "vue-qrcode-reader": { "optional": true },
    "@vueuse/gesture": { "optional": true }
  }
}
```

No build step yet. We ship raw TS/SFCs via `exports` and let each app's Vite
compile them — simplest possible setup, keeps DX fast during migration. A
proper `tsup`/`vite-plugin-dts` build can be added in Phase 4.

---

## Phase 2 — Move source files

1. `git mv apps/vite-vue-template/src/components/ui packages/ui/src`
2. Also move the internal utilities that Phase 0 relocated:
   `packages/ui/src/lib/cn.ts`, `packages/ui/src/composables/*`,
   `packages/ui/src/assets/illustrations/*`.
3. Inside `packages/ui/`, replace all `@/…` imports with relative paths
   (they're all local now).
4. Extract `main.css` into two files inside `packages/ui/src/styles/`:
   - `tokens.css` — everything in the `@theme` block
   - `base.css` — resets and typography classes
5. Move the current `src/assets/css/main.css` to the reference app and change
   its top to:
   ```css
   @import '@your-org/ui/tokens.css';
   @import '@your-org/ui/base.css';
   /* app-specific overrides below */
   ```

---

## Phase 3 — Wire the reference app

1. Move `apps/vite-vue-template/` into the workspace (rename to `apps/admin`
   or keep the current name).
2. In its `package.json`, add:
   ```json
   "dependencies": {
     "@your-org/ui": "workspace:*"
   }
   ```
3. Batch-replace imports across the app:
   ```bash
   # From vite-vue-template's src/
   grep -rl "@/components/ui" src | xargs sed -i '' \
     "s|@/components/ui|@your-org/ui|g"
   ```
4. `pnpm install` at the workspace root — pnpm will symlink `@your-org/ui`
   into `apps/admin/node_modules/`.
5. `pnpm --filter admin run dev` — verify everything still loads.
6. `pnpm --filter admin run typecheck` — must be green.

---

## Phase 4 — Wire the sibling apps

Repeat Phase 3 for `versace` and `reward-loyalty-microapps-v2`:

1. `git mv ~/Desktop/versace ~/Desktop/workspace/apps/versace`
2. Same for `reward-loyalty-microapps-v2`
3. **Delete their local `src/components/ui/`** (they were forks of the same
   files — the source of truth now lives in `packages/ui`).
4. Batch-replace imports the same way.
5. Verify typecheck + dev server.

Expected outcome: three apps that share one UI kit. A tweak to
`packages/ui/src/dialog/composite/ConfirmDialog.vue` shows up in all three
next reload — no publish step, no manual sync.

---

## Phase 5 — Release process (optional, later)

If you eventually want to publish `@your-org/ui` (private registry, GitHub
Packages, or public npm):

1. Add `changesets`:
   ```bash
   pnpm add -D @changesets/cli -w
   pnpm changeset init
   ```
2. Add a build step in `packages/ui/`:
   ```bash
   pnpm add -D vite vite-plugin-dts -F @your-org/ui
   ```
   Add `packages/ui/vite.config.ts` that builds `src/index.ts` as ESM + types.
3. Update `packages/ui/package.json` exports to point at `dist/` in production
   and `src/` in development (via `conditional exports`).
4. GitHub Actions workflow: on push to `main` with a pending changeset, open
   a PR that bumps versions and publishes.

Skip this phase until you actually need external consumers.

---

## Rollout order & risk

| Step                      | Risk                                         | Rollback                                              |
| ------------------------- | -------------------------------------------- | ----------------------------------------------------- |
| Phase 0 (this repo)       | Low                                          | git revert                                            |
| Phase 1 (scaffold)        | Low                                          | delete `workspace/`                                   |
| Phase 2 (move files)      | Medium — many imports to rewrite             | git reset                                             |
| Phase 3 (reference app)   | Medium — verify no runtime import path issue | keep old `src/components/ui/` in a branch until green |
| Phase 4 (sibling apps)    | Medium — deleting their local `ui/` is scary | tag a "pre-monorepo" release in each app first        |
| Phase 5 (release process) | Optional                                     | —                                                     |

Do not skip Phase 3 before Phase 4. Get one app working end-to-end first;
that's your smoke test.

## Timeline estimate

- Phase 0 preparation cleanup (fix layer violation, move internal utils): **2–4 hours**
- Phase 1 scaffolding: **1 hour**
- Phase 2 file move + CSS split: **3–4 hours**
- Phase 3 reference app wiring: **2 hours**
- Phase 4 per sibling app: **1–2 hours each**

Total ~1.5 to 2 working days if uninterrupted.

## What you gain

- **One source of truth** — component changes propagate to all three apps.
- **Version tracking** — `changesets` gives you a machine-readable changelog.
- **Enforced boundaries** — `packages/ui` cannot import from `apps/*`;
  TypeScript will refuse.
- **Contributor onboarding** — new devs know where to add UI: `packages/ui`.
- **Publish-readiness** — Phase 5 is a small extra step, not a rewrite.

## What you give up

- **Two directories per change** — a change now touches both
  `packages/ui/src/*` and app-specific code that consumes it.
- **Longer install** — pnpm installs 3 apps' deps at once (mitigated by pnpm's
  strict content-addressable store).
- **Onboarding friction** for pure "just want to run one app" scenarios —
  they must `pnpm install` at the workspace root, not inside the app.
