#!/usr/bin/env bash
# Deep screening: for every component folder, compare ALL files
# (*.vue, index.ts, types.ts) across the 3 projects.
#
# For each file found in any project, emit:
#   layer   component   file   presence(T,V,L)   diffs(TV,TL,VL)   status
#
# This surfaces divergences that the entry-file pass misses:
#   - New files added in one project (like DatePickerField in versace)
#   - Composite subfolder differences (ui/*/composite/*)
#   - Barrel index.ts drift
#   - types.ts / cva variant config drift

set -euo pipefail

TEMPLATE="/Users/yogapermana/Desktop/vite-vue-template"
VERSACE="/Users/yogapermana/Desktop/versace"
LOYALTY="/Users/yogapermana/Desktop/reward-loyalty-microapps-v2"

OUT_DIR="$TEMPLATE/reports/screening"
mkdir -p "$OUT_DIR/deep/ui" "$OUT_DIR/deep/shared"

DETAILED="$OUT_DIR/detailed.tsv"
echo -e "layer\tcomponent\tfile\ttemplate\tversace\tloyalty\ttv_diff\ttl_diff\tvl_diff\tstatus" > "$DETAILED"

# --- diff line count between two files ---
diff_lines() {
  local a="$1"
  local b="$2"
  if [ ! -f "$a" ] || [ ! -f "$b" ]; then
    echo "-"
    return
  fi
  local n
  n=$(diff -u "$a" "$b" 2>/dev/null | tail -n +3 | grep -cE '^[+-]' 2>/dev/null || true)
  echo "${n:-0}" | head -1
}

# --- for each component, find union of relative file paths (relative to component folder) ---
relative_files() {
  local component_dir="$1"
  # Find all .vue and .ts files (max 3 levels deep), print relative paths
  if [ -d "$component_dir" ]; then
    (cd "$component_dir" && find . -maxdepth 3 \( -name '*.vue' -o -name '*.ts' \) -type f 2>/dev/null | sed 's|^\./||')
  fi
}

# --- Categorize file's status ---
categorize() {
  local pt="$1" pv="$2" pl="$3"
  local tv="$4" tl="$5" vl="$6"

  # Missing in some project
  if [ "$pt" = "✗" ] || [ "$pv" = "✗" ] || [ "$pl" = "✗" ]; then
    # Which projects have it?
    local present=""
    [ "$pt" = "✓" ] && present="${present}T"
    [ "$pv" = "✓" ] && present="${present}V"
    [ "$pl" = "✓" ] && present="${present}L"
    echo "ONLY_IN_${present}"
    return
  fi

  # All 3 present
  if [ "$tv" = "0" ] && [ "$tl" = "0" ] && [ "$vl" = "0" ]; then
    echo "IDENTICAL"
    return
  fi

  local total=$((tv + tl + vl))
  if [ "$total" -le 5 ]; then
    echo "MINOR"
  elif [ "$total" -le 30 ]; then
    echo "MEDIUM"
  else
    echo "MAJOR"
  fi
}

process_component() {
  local layer="$1"
  local comp="$2"

  local dt="$TEMPLATE/src/components/$layer/$comp"
  local dv="$VERSACE/src/components/$layer/$comp"
  local dl="$LOYALTY/src/components/$layer/$comp"

  # Union of file paths across the three folders (relative to component root)
  local all_files
  all_files=$(
    {
      relative_files "$dt"
      relative_files "$dv"
      relative_files "$dl"
    } | sort -u
  )

  for f in $all_files; do
    local ft="$dt/$f" fv="$dv/$f" fl="$dl/$f"

    local pt="✓" pv="✓" pl="✓"
    [ ! -f "$ft" ] && pt="✗"
    [ ! -f "$fv" ] && pv="✗"
    [ ! -f "$fl" ] && pl="✗"

    local tv="-" tl="-" vl="-"
    [ "$pt" = "✓" ] && [ "$pv" = "✓" ] && tv=$(diff_lines "$ft" "$fv")
    [ "$pt" = "✓" ] && [ "$pl" = "✓" ] && tl=$(diff_lines "$ft" "$fl")
    [ "$pv" = "✓" ] && [ "$pl" = "✓" ] && vl=$(diff_lines "$fv" "$fl")

    # For categorize we need numeric — dashes count as 0
    local ntv=${tv/-/0} ntl=${tl/-/0} nvl=${vl/-/0}
    local status
    status=$(categorize "$pt" "$pv" "$pl" "$ntv" "$ntl" "$nvl")

    printf "%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n" \
      "$layer" "$comp" "$f" "$pt" "$pv" "$pl" "$tv" "$tl" "$vl" "$status" >> "$DETAILED"

    # Save raw diffs (only where files exist)
    local safe_name=$(echo "${comp}__${f}" | tr '/' '_')
    if [ "$pt" = "✓" ] && [ "$pv" = "✓" ] && [ "$ntv" != "0" ]; then
      diff -u "$ft" "$fv" > "$OUT_DIR/deep/$layer/${safe_name}.T-vs-V.diff" 2>/dev/null || true
    fi
    if [ "$pt" = "✓" ] && [ "$pl" = "✓" ] && [ "$ntl" != "0" ]; then
      diff -u "$ft" "$fl" > "$OUT_DIR/deep/$layer/${safe_name}.T-vs-L.diff" 2>/dev/null || true
    fi
  done
}

process_layer() {
  local layer="$1"
  echo "  Scanning $layer/..."

  local all_components
  all_components=$(
    {
      ls -d "$TEMPLATE/src/components/$layer"/*/ 2>/dev/null | xargs -n1 basename 2>/dev/null || true
      ls -d "$VERSACE/src/components/$layer"/*/ 2>/dev/null  | xargs -n1 basename 2>/dev/null || true
      ls -d "$LOYALTY/src/components/$layer"/*/ 2>/dev/null  | xargs -n1 basename 2>/dev/null || true
    } | sort -u
  )

  for comp in $all_components; do
    process_component "$layer" "$comp"
  done
}

echo "Deep screening…"
process_layer "ui"
process_layer "shared"

# Also add root-level shared files (PageHeader.vue, CardSection.vue, TransitionedRouterView.vue)
echo "  Scanning root shared files…"
for f in PageHeader.vue CardSection.vue TransitionedRouterView.vue index.ts; do
  ft="$TEMPLATE/src/components/shared/$f"
  fv="$VERSACE/src/components/shared/$f"
  fl="$LOYALTY/src/components/shared/$f"

  pt="✓" pv="✓" pl="✓"
  [ ! -f "$ft" ] && pt="✗"
  [ ! -f "$fv" ] && pv="✗"
  [ ! -f "$fl" ] && pl="✗"

  tv="-" tl="-" vl="-"
  [ "$pt" = "✓" ] && [ "$pv" = "✓" ] && tv=$(diff_lines "$ft" "$fv")
  [ "$pt" = "✓" ] && [ "$pl" = "✓" ] && tl=$(diff_lines "$ft" "$fl")
  [ "$pv" = "✓" ] && [ "$pl" = "✓" ] && vl=$(diff_lines "$fv" "$fl")

  ntv=${tv/-/0} ntl=${tl/-/0} nvl=${vl/-/0}
  status=$(categorize "$pt" "$pv" "$pl" "$ntv" "$ntl" "$nvl")

  printf "%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n" \
    "shared" "_root" "$f" "$pt" "$pv" "$pl" "$tv" "$tl" "$vl" "$status" >> "$DETAILED"

  safe_name=$(echo "_root__${f}" | tr '/' '_')
  if [ "$pt" = "✓" ] && [ "$pv" = "✓" ] && [ "$ntv" != "0" ]; then
    diff -u "$ft" "$fv" > "$OUT_DIR/deep/shared/${safe_name}.T-vs-V.diff" 2>/dev/null || true
  fi
  if [ "$pt" = "✓" ] && [ "$pl" = "✓" ] && [ "$ntl" != "0" ]; then
    diff -u "$ft" "$fl" > "$OUT_DIR/deep/shared/${safe_name}.T-vs-L.diff" 2>/dev/null || true
  fi
done

echo ""
echo "Done. Detailed report: $DETAILED"
echo "Raw diffs: $OUT_DIR/deep/{ui,shared}/*.diff"
echo ""
echo "Total rows scanned:"
tail -n +2 "$DETAILED" | wc -l
