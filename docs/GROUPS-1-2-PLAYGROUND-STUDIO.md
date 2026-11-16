# Groups 1 and 2: System Playground and Product System Studio

## Group 1 interaction loop

1. Choose Timber Frame, Precast Platform, Volumetric Pods, or Hybrid Chassis.
2. Enter Design and select Edit parts.
3. Select a module, snap it to the 100 mm grid, rotate it in 90 degree steps, duplicate it, or replace its product family.
4. Review connection/interface feedback before trying assembly, factory, or scenario workspaces.

The starter systems use simple semantic geometry so they stay fast and remain compatible with the existing analyses.

## Group 2 authoring loop

Product System Studio records:

- system identity, kind, families and permitted interfaces;
- requirements such as minimum seismic grade, transport width and lift weight;
- reusable configuration recipes;
- explainable per-part rule issues;
- a portable Product System v1 JSON export.

Product System v1 files can also be loaded through the existing **Load Kit JSON** control. Import restores parts, interfaces, rules, requirements and provenance-backed identity without pretending exported scenario inputs are verified analysis results.

Requirements are never written into product variant values. Evaluation compares the two and reports the reason for every failure. Export includes active variant selections and provenance, but no cached analysis result.
