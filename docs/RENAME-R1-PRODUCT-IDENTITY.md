# Assembly Lab Rename — R1 Product Identity

Date: 2026-11-17

Status: complete

R1 activates **Assembly Lab** as the product name while intentionally retaining the `Kit-of-Parts` repository and GitHub Pages path until R2.

## Changed

- Browser, Open Graph, Twitter, README, handoff, and contributor-facing product identity
- In-app sidebar brand and screenshot/share captions
- Package identity: `assembly-lab`
- IFC and PDF authorship plus Assembly Lab export filenames
- Product System provenance (`authoredIn: Assembly Lab`)
- Shared contract wording in both Assembly Lab and Genba Lab
- New Assembly Lab system favicon
- Browser persistence keys with non-destructive migration from legacy `ic-*` keys

## Compatibility

- Existing saved systems, theme preference, and guided-discovery completion are copied to the new keys on first read.
- Legacy keys remain in place during the migration window; resetting a system clears both current and legacy system-save keys.
- Product System v1 structure is unchanged and the two contract copies remain byte-for-byte identical.
- The current live URL remains `https://onuresen.github.io/Kit-of-Parts/` until R2.

## Deferred to R2/R3

- GitHub repository rename and local checkout move
- Vite base path and live Pages URL
- Public portfolio and vault references
- Final branded social preview captured from the renamed deployment
