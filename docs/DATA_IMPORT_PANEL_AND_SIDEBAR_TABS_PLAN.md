# Data Import Panel + Sidebar Context Tabs (WellDataEditor → fd-client) — Implementation Plan

This document is a focused UI/UX + implementation plan for:

- The **data import panel** that accepts files (CSV/XLS/XLSX/TXT/LAS in the original app) and prepares a normalized dataset.
- The UI element you called “filters”: the **top tabs above the file tree** in WinForms that change the active module and (as a result) the sidebar content/controls.

Decompiled sources root:

- `/Users/vitalii/Desktop/Diplomna_docs/WellDataEditor.exe_Decompiler.com`

Target frontend:

- `/Users/vitalii/Desktop/Fracture-detection-app/fd-client`

## 0) Clarifying the terminology: these are not “filters”

In the WinForms app, the UI you highlighted (tabs at the top, e.g. `Main Data`, `Input data`, `Phases`, `Vols`, `Breakdowns`, `Propant`, etc.) is a **primary navigation / module switcher**.

- It changes the **active module (screen)**.
- It often changes **what controls are shown** (parameter forms, plots, actions) while the left `TreeView` stays the dataset/stage selector.

Correct name for the feature:

- **Module Tabs / Workspace Tabs / Context Switcher**

In React we should treat it as:

- A **context switcher** that changes the active module **within a single route** (`/dashboard`).
- A **context-aware sidebar** that shows the right panel for the currently active module.

## 1) WinForms authoritative sources (where behavior comes from)

### 1.1 Main form + tabs + tree

- `../WellDataEditor.exe_Decompiler.com/WellDataEditor.BreakdownDetector/BreakDownDetector.cs`
  - Contains:
    - `tabControl_Manu` (main module tabs)
    - `treeView1 : TreeViewDataSource` (left dataset/stage tree)

### 1.2 File import + parsing pipeline

- `../WellDataEditor.exe_Decompiler.com/WellDataEditor.BreakdownDetector.SourceTreeView.SourceTreeNodes/TreeNodeDataSource.cs`
  - `LoadData()` supports:
    - `.txt` (space/tab split)
    - `.csv` (`CsvHelper` → then inserts header row into `DataTable`)
    - `.xls` (`Utils.GetDataTableFromXLS`)
    - `.xlsx` (`Utils.GetDataTableFromXLSX(..., hasHeader: false)`)
    - `.las` (LAS sections + curves/units parsing)

- `../WellDataEditor.exe_Decompiler.com/WellDataEditor/Utils.cs`
  - `ConvertToSingleTable(...)` — key normalization step:
    - trims empty columns
    - trims non-data rows
    - sets column names from a specific row
    - ensures a **units row** is inserted as row `0`

### 1.3 Stage-specific normalization (the most important dataset type)

- `../WellDataEditor.exe_Decompiler.com/.../TreeNodeStageDataSource.cs`
  - Finds columns via regex (pressure/rate/time, optional propant/BH/net pressures)
  - Detects `unitsRowIndex` heuristically
  - Calls `ConvertToSingleTable(...)`
  - Normalizes time to a common format

## 2) React UI proposal: how to redesign красиво і зручно (Shadcn-friendly)

### 2.1 Replace WinForms tabs with a modern app layout

**Recommended layout** (desktop-first, scalable):

- **Top header**: Project/Dataset selector + key actions (Import, Export, Save, etc.)
- **Left sidebar**: context-aware (tree + settings panels)
- **Main content**: the active module screen (plots, editors, tables)

### 2.2 Module switcher UI: two-level navigation

Because WinForms has many tabs, a literal “one row of tabs” becomes cramped.

**Proposed approach**:

- **Primary module switcher** as:
  - Shadcn `Tabs` **or** a `NavigationMenu`/`Toolbar` with grouped items
  - Optionally collapsible into a dropdown on smaller widths

- **Secondary grouping** (to make it “beautiful”):
  - Group tabs into categories (example):
    - `Data`: Main Data, Input Data
    - `Processing`: Phases, Vols
    - `Events`: Breakdowns, Filter BDs, Separate BDs
    - `Domain`: Perfs, Permeability, Propant
    - `Visualization`: Curves, Axes, Stable Intervals

Implementation detail:

- Keep everything inside a **single route** (`/dashboard`).
- Implement the module switcher as a controlled UI state (e.g. `activeModuleId`).
- The sidebar and the main content area render based on `activeModuleId`.

Frontend placement constraint (confirmed):

- The import panel and context switching UI must be implemented inside:
  - `src/features/dashboard-sidebar/components/DashboardSidebar.tsx`

### 2.3 Sidebar behavior: tree is “always there”, but panels change by module

From your screenshots:

- The left tree (`wells → stages`) is essentially a **selector**.
- The module tab changes the **controls in the right area** and sometimes what you want to see in sidebar.

React proposal:

- Sidebar has **sections**:
  - `Data Sources` (tree)
  - `Selection` (selected stage(s) summary)
  - `Module Controls` (context panel for the active module)

UI patterns:

- Use Shadcn `Tabs` or a segmented control inside the sidebar header:
  - `Tree`
  - `Controls`
  - `Info`

This gives the “content changes in sidebar” effect, but in a controlled, modern UX.

## 3) Data Import Panel plan (feature-based architecture)

### 3.1 New feature: `src/features/data-import/`

Proposed structure:

- `src/features/data-import/components/`
  - `DataImportPanel.tsx` (dropzone + file picker)
  - `ImportedFilesList.tsx`
  - `PreviewTable.tsx` (header + units row + first N rows)
  - `ImportValidationErrors.tsx`
- `src/features/data-import/types/`
  - `dataset.ts` (normalized table model)
  - `import.ts` (file meta, statuses)
  - `index.ts`
- `src/features/data-import/hooks/`
  - `useImportDatasetMutation.ts`
  - `useDatasetPreviewQuery.ts`

### 3.2 File formats support (parity targets)

Minimum parity (recommended first increment):

- `.txt`
- `.csv`
- `.xlsx`

Optional parity (if реально потрібно):

- `.xls`
- `.las`

### 3.3 Import pipeline (recommended: backend-driven)

Because datasets can be large and we need consistent parsing logic:

- Frontend uploads files to backend
- Backend returns:
  - normalized preview
  - detected dataset type (stage/stagesMD/drilling/etc.)
  - validation errors/warnings

Frontend responsibilities:

- show per-file status
- show preview and mapping suggestions
- let user confirm “Use this dataset”

Confirmed constraints:

- Parsing happens **on the backend**.
- The frontend only:
  - uploads files
  - displays preview / validation
  - controls “apply/import” actions

## 4) Module-specific settings panels (example: `Input data`, `Propant`)

Your second screenshot shows a typical pattern:

- a small form with numeric inputs and parameters

React parity plan:

- Each module screen owns a colocated form:
  - RHF + Zod schema
  - Shadcn `Form`, `Input`, `Select`, `Slider`

Suggested UX improvements:

- Show units inline (suffix)
- Add validation constraints (min/max)
- Show “Reset to defaults”
- Persist settings per dataset

## 5) Sidebar tree behavior (stages selection)

The first screenshot shows a `TreeView` with checkboxes.

React parity plan:

- Use a tree component (or build a simple hierarchical list):
  - `Well` nodes
  - `Stage` nodes with checkboxes

UX improvements:

- Add search (`well name`, `stage number`)
- Add bulk actions:
  - Select all
  - Select range (e.g. 1..10)
  - Invert selection
- Display selection summary:
  - “Selected 2 stages”

## 6) Milestones (implementation sequence)

### Milestone A — Module switcher + routing skeleton

- Keep a single `/dashboard` route
- Implement module switcher state + sidebar sections shell
- Implement `DashboardSidebar.tsx` composition for:
  - Tree
  - Controls
  - Info

### Milestone B — Sidebar tree (wells/stages) + selection state

- Implement hierarchical list
- Implement selection store (Zustand or TanStack Query cache derived state)

### Milestone C — Data Import Panel (upload + preview)

- Add import UI
- Integrate with backend endpoint(s)
- Show preview table with units row support

### Milestone D — Module controls panels

- Implement 1-2 priority modules first (`Input data`, `Propant`)
- RHF + Zod + Shadcn forms

### Milestone E — Polish & consistency

- Keyboard navigation
- Empty states
- Error states
- Responsive behavior

## 7) Decisions (confirmed)

1. File formats in v1: `.txt`, `.csv`, `.xlsx`
2. Parsing: backend
3. Navigation: single route `/dashboard` (no per-tab routes)
4. Placement: UI lives in `src/features/dashboard-sidebar/components/DashboardSidebar.tsx`
