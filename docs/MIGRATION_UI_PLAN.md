# UI Analysis + React Migration Plan (WellDataEditor)

This document focuses on **UI / UX / user flows** of the decompiled WellDataEditor sources and provides a detailed plan to migrate the UI to **React**.

Repository root: `/Users/vitalii/Desktop/Diplomna_docs/WellDrillingSources`

Decompiled sources root:

- `/Users/vitalii/Desktop/Diplomna_docs/WellDataEditor.exe_Decompiler.com`

## 0) What “the app” is for this plan

This plan targets **WellDataEditor** (WinForms C# application) and its major workflows:

- Tabbed “Breakdown Detector / Well Data Editor” UI
- Dataset import (CSV/Excel)
- Stage curves visualization and derived metrics
- Breakdown / stable-interval tooling
- Propant-related corrections and interval boundaries (start/finish propant pumping)

This plan is intentionally separate from **DepthShifting**.

## 1) UI entrypoint(s)

### 1.1 Main entrypoint

- `../WellDataEditor.exe_Decompiler.com/WellDataEditor/Program.cs`
  - **Responsibility**: application start.
  - **Startup form**:
    - `WellDataEditor.BreakdownDetector.BreakDownDetector`
      - file: `../WellDataEditor.exe_Decompiler.com/WellDataEditor.BreakdownDetector/BreakDownDetector.cs`

React migration implication:

- Treat the WinForms app as a **single-page app** with a top-level navigation that mirrors the main tabs.

## 2) Primary screen inventory (WinForms → React screens)

The decompiled code places a large amount of orchestration inside the main form. For the React migration, the most important job is to:

- identify each “tab” as a screen/module
- extract reusable widgets (plots, stage selectors, parameter editors)
- move compute-heavy/IO-heavy work to Go backend endpoints

### 2.1 `BreakDownDetector` → React App: “WellDataEditor”

- File:
  - `../WellDataEditor.exe_Decompiler.com/WellDataEditor.BreakdownDetector/BreakDownDetector.cs`

#### What it shows (macro-layout)

- A top-level `TabControl`:
  - `tabControl_Manu`
- A “Main Data” tree:
  - `treeView1: TreeViewDataSource`
  - context menu (`contextMenuStrip1`)
- Many parameter panels (`GroupBox` + `TextBox`/custom numeric inputs)
- Plots:
  - `ZedGraphControl` is used across the UI
  - Some modules also use `System.Windows.Forms.DataVisualization`

#### Tabs (authoritative list from code)

All are `TabPage` fields in `BreakDownDetector.cs`:

- `tabPage_MainData`
- `tabPage_InputData`
- `tabPage_Phases`
- `tabPage_Volums`
- `tabPage_Breakdowns`
- `tabPage_FilterBreakdowns`
- `tabPage_SeparateBreakdowns`
- `tabPage_Perforations`
- `tabPage_Permeability`
- `tabPage_Curves`
- `tabPage_Axes`
- `tabPage_StableIntervals`
- `tabPage_PorePressure`
- `tabPage_BottomPress`
- `tabPage_Propant`

React migration implication:

- Convert these into:
  - routes (recommended): `/wde/main-data`, `/wde/axes`, `/wde/propant`, etc.
  - or nested tabs inside a single route (okay for parity)

### 2.2 Propant editing & anchors → React Screen: “Stage Anchors / Propant boundaries”

There is explicit UI around start/finish propant, ISIP, and other stage anchors.

- File:
  - `../WellDataEditor.exe_Decompiler.com/WellDataEditor/AnchorsEditor.cs`

Key UI signals in code:

- `numericUpDownStartPropant_ValueChanged`
- `numericUpDownFinishPropant_ValueChanged`
- usage of stage dictionary keys:
  - `"start prop. pumping"`
  - `"finish prop. pumping"`

React migration implication:

- Provide a dedicated “anchors editor” experience:
  - chart with vertical markers
  - numeric input + snapping
  - save anchors back to dataset/stage model

### 2.3 “Stable intervals” tooling → React Screen: “Stable Intervals”

Stable interval derivation (including wellbore propant mass slope intervals) is exposed via UI tools.

- Files:
  - `../WellDataEditor.exe_Decompiler.com/WellDataEditor.Controls/StageTimeIntervalsPlot.cs`
  - `../WellDataEditor.exe_Decompiler.com/WellDataEditor.BreakdownDetector.SourceTreeView.Options/CrossPlotTimeIntervals.cs`

React migration implication:

- “Select stages → compute intervals → visualize overlays” is an explicit workflow.
- Web UI should support:
  - selecting one or many stages
  - running interval detection
  - rendering interval overlays on plots

### 2.4 Curves catalog & plot configuration → React “Curves” module

- File:
  - `../WellDataEditor.exe_Decompiler.com/WellDataEditor.BreakdownDetector.SourceTreeView.DataModels/StageCurves.cs`

This defines curve ids, labels, units, and defaults (examples):

- `wellBorePropMass` (lbs)
- `wellBorePropMassDer` (derivative)
- `totalPropMass` (lbs)
- `BHpropCon` (ppg)

React migration implication:

- This should become a shared “curve registry”:
  - drives plot legend, toggle list, axis mapping, units

## 3) UI architecture proposal (React)

### 3.1 Navigation

Recommended:

- Left navigation with sections (or top nav mirroring WinForms tabs)
- Each WinForms tab becomes a route

### 3.2 State management

- Use local component state for small settings.
- Use a global store (Zustand/Redux) for:
  - selected dataset
  - selected stage(s)
  - global unit system
  - curve visibility settings

### 3.3 Plotting

- Replace ZedGraph with:
  - Plotly (best for scientific/engineering plots)
  - or ECharts (good performance)

## 4) File grouping for UI migration (authoritative)

### 4.1 Current UI files (WinForms)

- **Bootstrap**
  - `../WellDataEditor.exe_Decompiler.com/WellDataEditor/Program.cs`

- **Main app / mega-form**
  - `../WellDataEditor.exe_Decompiler.com/WellDataEditor.BreakdownDetector/BreakDownDetector.cs`

- **Secondary forms / dialogs**
  - `../WellDataEditor.exe_Decompiler.com/WellDataEditor/AnchorsEditor.cs`
  - `../WellDataEditor.exe_Decompiler.com/WellDataEditor/VolumeSavingAnalysis.cs`
  - `../WellDataEditor.exe_Decompiler.com/WellDataEditor/VolumeAnalysisCharts.cs`
  - `../WellDataEditor.exe_Decompiler.com/WellDataEditor/FaultDetector.cs`
  - `../WellDataEditor.exe_Decompiler.com/WellDataEditor/DrillingDataCleaner.cs`

- **Custom controls**
  - `../WellDataEditor.exe_Decompiler.com/WellDataEditor.Controls/`

- **Source tree & options (UI + domain glue)**
  - `../WellDataEditor.exe_Decompiler.com/WellDataEditor.BreakdownDetector.SourceTreeView.DataModels/`
  - `../WellDataEditor.exe_Decompiler.com/WellDataEditor.BreakdownDetector.SourceTreeView.SourceTreeNodes/`
  - `../WellDataEditor.exe_Decompiler.com/WellDataEditor.BreakdownDetector.SourceTreeView.Options/`
  - `../WellDataEditor.exe_Decompiler.com/WellDataEditor.BreakdownDetector.SourceTreeView.Viewers/`

### 4.2 React target file groups (proposal)

- `frontend/src/pages/wde/`
  - `MainDataPage.tsx`
  - `InputDataPage.tsx`
  - `PhasesPage.tsx`
  - `VolumesPage.tsx`
  - `BreakdownsPage.tsx`
  - `SeparateBreakdownsPage.tsx`
  - `PerforationsPage.tsx`
  - `PermeabilityPage.tsx`
  - `CurvesPage.tsx`
  - `AxesPage.tsx`
  - `StableIntervalsPage.tsx`
  - `PorePressurePage.tsx`
  - `BottomPressurePage.tsx`
  - `PropantPage.tsx`

- `frontend/src/components/wde/`
  - `StageSelector.tsx`
  - `CurveToggleList.tsx`
  - `CurvePlot.tsx`
  - `IntervalsOverlay.tsx`
  - `ParametersPanel.tsx`
  - `AnchorsEditor.tsx`

## 5) UI migration risks / gotchas

- A lot of business logic is currently inside the WinForms layer; you will want to extract it.
- Large time series arrays: you need downsampling and/or binary transport.
- Unit conversions: UI mixes units (ppg, psi, bbl, lbs). Make units explicit in domain model.

## 6) UI deliverables checklist

- Tabbed UI parity achieved via routes.
- Dataset import UI (CSV + Excel).
- Curves plot with:
  - multi-axis
  - toggles
  - overlays (breakdowns, stable intervals, anchors)
- Propant tab includes:
  - correction toggles
  - smoothing window/order
  - anchor editing for start/finish propant
