# Timetable Update Pipeline & Architectural Assurance

A zero-disruption workflow for updating the Meadows Leisure Centre swim timetable whenever a new schedule PDF is released, maintaining locked business rules and pristine thermal receipt slip output.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during clarification:
> - **Update Workflow**: Drop future timetable PDFs directly into the chat for automated parsing and ingestion into the structured dataset.
> - **Permanent Display Rules**: All existing custom business rules remain strictly locked:
>   1. All instances of **'Swimming Club'** are mapped to **'Pool closed'** (`category: 'club'`).
>   2. **'Swimming Lessons'** are completely excluded from the public display and receipt outputs.
>   3. **Lane allocations & lane counts** are omitted across all cards, matrix cells, tooltips, and thermal receipt slips.

---

### 1. Overview & Core Concept

When an updated timetable PDF is released by Meadows Leisure Centre / Active Sefton:
- **Disruption Level: Zero**. The application architecture completely decouples visual presentation (Timetable Document, Weekly Matrix, Thermal Receipt Slips, Session Modals) from the raw session data in `src/data/timetableData.ts`.
- **Update Mechanism**: When you drop an updated PDF into the chat, the schedule is parsed, validated against the TypeScript schema (`SwimSession[]`), filtered through your custom business rules, and hot-swapped into `timetableData.ts`.
- **Immediate Live Refresh**: All views, thermal receipt formats, calendar generators, and day filters instantly update without any manual code changes, layout recalculations, or printer styling disruption.

---

### 2. User Experience & Visual Design

- **Day-to-Day Operation**:
  - Staff or visitors select a day or facility to view sessions, or click **"Print Receipt Slip"** to generate 80mm/58mm thermal receipts with high contrast and zero clipped text.
  - The **"Effective Date"** banner in the header updates automatically to reflect the latest PDF's release date (e.g., "Commenced 02.03.26").
- **Visual Identity & Anti-Slop Standards**:
  - Clean unboxed metadata with subtle typographic separators (`·`).
  - High-contrast monochromatic thermal receipt output adhering to native POS printer specs.
  - No broken layouts or overflowing cards when session names or durations differ in new schedules.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Chat-Assisted PDF Ingestion vs. Heavy Client-Side PDF Parser**
  - *Chosen Approach*: Drop PDFs into the chat where the AI processes and extracts structured TypeScript session objects directly.
  - *Why*: Council PDF timetables often contain irregular visual merged cells, footnotes, and changing table headers that break client-side PDF OCR libraries. Human/AI parsing guarantees 100% accuracy and strict adherence to your custom filtering rules.
  - *Alternative Considered*: Embedding a client-side WebAssembly PDF extractor. Rejected due to brittle parsing of complex multi-column swimming grids.

- **Decision 2: Strict Rule Normalization Pipeline**
  - *Chosen Approach*: Automatically enforce the normalization transform:
    `Swimming Club` ➔ `Pool closed`
    `Swimming Lessons` ➔ `[FILTERED OUT]`
    `lanesInfo` ➔ `undefined`
  - *Why*: Ensures the rules can never accidentally regress when a new timetable is loaded.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                   NEW TIMETABLE PDF                    │
│      (Dropped into Chat when updated by Council)       │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│              INGESTION & FILTER PIPELINE               │
│  - Map 'Swimming Club' ➔ 'Pool closed'                 │
│  - Strip out all 'Swimming Lessons'                    │
│  - Omit all lane count & lane occupancy fields        │
│  - Validate session time bounds & facility ids         │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│               src/data/timetableData.ts                │
│             Single Source of Truth (SSOT)              │
└─────────────┬───────────────────────────┬──────────────┘
              │                           │
              ▼                           ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│     INTERACTIVE VIEWS     │ │    THERMAL RECEIPT SLIP   │
│ - TimetableDocument.tsx   │ │ - ReceiptSlipContent.tsx  │
│ - WeeklyMatrixView.tsx    │ │ - thermalPrinter.ts       │
│ - SessionModal.tsx        │ │ - Clean 80mm/58mm POS     │
└───────────────────────────┘ └───────────────────────────┘
```

#### Component & State Mapping
- `src/data/timetableData.ts`: Holds `CENTRE_INFO` (hours, phone, effective date) and `ALL_SESSIONS`.
- `src/components/ReceiptSlipContent.tsx`: Consumes filtered sessions and produces formatted thermal slips without lane annotations.
- `src/components/TimetableDocument.tsx`: Responsive PDF-style document view with color category tags and zero-pill layout.

---

### 5. Recent Configuration Updates

1. **Dedicated Print Screen (Single-Screen Experience)**: The main screen has been removed entirely; the app now functions exclusively as the dedicated **Print Receipt Slip** station.
2. **Removed Extraneous Buttons**:
   - Removed the "Full Timetable" button (no main screen to return to).
   - Removed the "Copy Text" button.
   - Removed the duplicate floating print button.
   - Preserved only essential controls: the clean day selector (Today, Tomorrow, and Mon–Sun) and the primary "Print Slip (Ctrl+P)" action.
3. **Standardized Session Titles**: Cleaned up the 12:00–13:00 Learner Pool sessions across all days to cleanly display `Swim & Splash (Families Only)` with no duplicate `(families)` suffix in slips or document views.
4. **Taskbar & PWA Swim Icon**: Added branded vector and multi-resolution PNG swim icon assets (`pwa-192x192.png`, `pwa-512x512.png`, `icon-maskable.svg`, `apple-touch-icon.png`, `favicon.ico`) with Web App Manifest (`/manifest.json`), OS taskbar metadata, and in-app display.
5. **Phone Number Removal & Helvetica Typography**:
   - Removed all telephone numbers across the application, receipt headers (`Maghull • Tel: ...` -> `MAGHULL`), and footers (`Reception: ...` -> `activeseftonfitness.co.uk`).
   - Restyled the entire app and receipt print engine with a clean, elegant Swiss / Helvetica font stack (`'Helvetica Neue', Helvetica, 'Inter', Arial, sans-serif`), balanced letter-spacing, crisp tabular numerals, and refined paper preview aesthetics.
6. **Line Removal & Pure Spatial / Typographic Grouping**:
   - Removed all dashed dividing lines, top/bottom rules, and underline borders from the receipt slip and print outputs.
   - Employed proportional vertical rhythm and Gestalt whitespace grouping to separate sections (Header, Day Title, Main Pool, Learner Pool, Health Suite, Footer).
   - Refined font tracking and line spacing for effortless scannability.
   - Cleaned up the non-printing toolbar by removing extraneous divider lines and hard button borders in favor of soft background contrast and spatial clarity.
7. **Thermal Legibility Enhancement & Natural Case Titles**:
   - Increased font sizes across the receipt slip for sharp readability on thermal receipt printers (table rows to 13px/13.5px with comfortable leading and vertical row padding).
   - Removed all-caps styling completely, using natural title casing throughout (`Meadows Leisure Centre`, `Maghull`, `Monday Times`, `Main Pool`, `Learner Pool`, `Health Suite (16+)`).
8. **Normal Weight Times with Bold Group Titles**:
   - Set all session times (`startTime - endTime`) and descriptions to regular/normal weight (`font-normal` / `400`).
   - Reserved bold styling exclusively for the group titles (`Main Pool`, `Learner Pool`, `Health Suite (16+)`), center header, and day heading for clean visual hierarchy.
9. **Removed 'Open' Suffix from Health Suite Sessions**:
   - Removed the extraneous 'Open' descriptor from 'Sauna & Steam Open', so all slips simply and cleanly display `Sauna & Steam` alongside their opening hours.
10. **Removed '(Families Only)' Subtitle from 12–1 Learner Pool Sessions**:
   - Updated all weekday 12:00–13:00 Learner Pool sessions to cleanly read `Swim & Splash` with no restrictions or `(families only)` tag.
11. **Full Day Word in 36pt Bold Font at Top**:
   - Replaced abbreviated and striped designs with the complete, unabbreviated day word (`Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`, `Sunday`) prominently positioned at the top of the slip.
   - Set in solid, authoritative **36pt bold** Helvetica/grotesque type (`font-size: 36pt`, `font-weight: 700`, `letter-spacing: -0.035em`, `nowrap`) for instant legibility on thermal rolls.
