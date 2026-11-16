# Assembly Lab Rename — R0 Audit

Date: 2026-11-16

Status: complete, evidence only

Current product/repository: `Kit-of-Parts`

Selected product name: **Assembly Lab**

Proposed repository/Pages slug: `Assembly-Lab`

## Purpose and boundary

R0 inventories the active identity, URLs, generated artifacts, and cross-repository references before any rename. It intentionally changes no product label, repository name, deployment path, URL, local storage key, export identity, or external repository.

The later migration must distinguish references to this software product from the generic construction term *kit of parts*. Research notes, event summaries, quotations, and historical release records keep the old wording when it describes the industry concept or a past state.

## Repository state inspected

All four in-scope checkouts were clean and aligned with `origin/main` at the start of R0.

| Checkout | Current remote | R0 role |
| --- | --- | --- |
| `E:\GitHub\Kit-of-Parts` | `onuresen/Kit-of-Parts` | Rename source and audit owner |
| `E:\GitHub\Genba-Lab` | `onuresen/Genba-Lab` | Sibling product and shared contract references |
| `E:\GitHub\esen-vault` | `onuresen/esen-vault` | Canonical project note, navigation, history, generated indexes |
| `E:\GitHub\onuresen.github.io` | `onuresen/onuresen.github.io` | Public portfolio card, metadata, icon, live/repository links |

The public GitHub repository was also confirmed at `https://github.com/onuresen/Kit-of-Parts`. The Pages URLs could not be independently fetched by the audit browser, so their availability remains a cutover verification item rather than an R0 claim.

## Active identity inventory

### 1. Kit-of-Parts repository

Fourteen tracked source/document files contain active product identity or deployment references:

- Product and contributor documentation: `README.md`, `AGENTS.md`, `CLAUDE.md`
- Deployment and metadata: `vite.config.js`, `index.html`, `.github/workflows/deploy.yml`
- UI and sharing: `src/App.jsx`, `src/components/Sidebar.jsx`
- Product provenance and interchange: `src/components/KitContext.jsx`, `src/contracts/productSystem.js`
- Export authorship: `src/utils/ifcExporter.js`, `src/utils/pdfGenerator.js`
- Group/performance documentation: `docs/GROUP-0-FOUNDATION.md`, `docs/GROUP-5-VISUAL-INTERACTION-LANGUAGE.md`, `docs/performance/GENERAL_VIEW_GATE.md`

Identity-bearing assets and technical names also include:

- `public/favicon.png`, `public/favicon.svg`, and `public/og-preview.png`
- Package name `ic-configurator`
- Vite base path `/Kit-of-Parts/`
- Local storage keys beginning `ic-`, including `ic-kit-save`, `ic-dark`, and `ic-guided-discovery-seen`
- Sample filenames `default-kit.json`, `advanced-kit.json`, `eco-kit.json`, and `premium-kit.json`
- Screenshot filename `kit-of-parts.png`
- IFC organization/application strings `IC Configurator` / `IC-CONF`

One active sharing path is already stale: `src/App.jsx` writes `onuresen47.github.io/Kit-of-Parts` into screenshots and captions while the repository documentation uses `onuresen.github.io/Kit-of-Parts/`. R1 should correct this as part of identity work, not preserve it as a compatibility alias.

### 2. Genba Lab

Eight files reference the product by its current name:

- `README.md` and `CLAUDE.md` describe the repository lineage and product boundary.
- `docs/GROUP-0-FOUNDATION.md` and `src/contracts/productSystem.js` describe the shared interchange contract.
- `src/components/CinematicMode.jsx`, `src/utils/craneLayout.js`, `src/utils/modelMetrics.js`, and `tests/ifcTestHelpers.mjs` use the old name as historical or scale context.

The lineage statement must remain historically true. Later groups should use language such as “grew out of the project formerly named Kit-of-Parts, now Assembly Lab” rather than rewriting history.

The two copies of `src/contracts/productSystem.js` must remain byte-for-byte compatible after any coordinated wording change.

### 3. esen-vault

The vault has a 24-file product folder at `projects/Kit-of-Parts/`, including the canonical `Kit-of-Parts.md` note and 23 feature notes. A focused active-reference scan found 48 Markdown/JSON/HTML files containing direct project paths, product URLs, slugs, or product-name records.

Active migration surfaces include:

- Canonical project note and folder/wiki-link paths
- `nav/010-Projects.md`, `planning/Shipped.md`, `planning/System-Map.md`, `planning/Publishing.md`, `Roadmap.md`, and archived roadmap references
- LinkedIn drafts explicitly promoting the software product
- `demos/concept-project-matrix.html`, `demos/machi-vault-v2.json`, and `demos/vault-status.json`
- Generated/indexed `vault-graph.json`

Do not bulk-replace generic occurrences in event and research notes. Many references describe the construction concept, third-party terminology, session titles, or historical releases. Generated vault artifacts should be regenerated from renamed source notes where tooling permits rather than manually treated as canonical content.

The vault’s canonical project note is stale relative to the application: it still describes Groups C–F as open even though later work has shipped. The rename group should refresh current-facing status without rewriting dated update sections.

### 4. onuresen.github.io

Three files contain direct product identity:

- `index.html`: portfolio card, title, icon, analytics labels, live URL, repository URL, and site-wide OG/Twitter image dependency
- `README.md`: project table and both links
- `notes/post.html`: OG image dependency

The current icon is `icons/kit-of-parts.png` (55,009 bytes). It should not simply be renamed if Assembly Lab receives a new visual identity; R3 should either deliberately retain it during transition or replace it with an Assembly Lab asset.

The portfolio homepage and notes page currently depend on the product’s OG image URL. Therefore a Pages cutover can affect more than the project card itself.

## Migration classifications

| Classification | Treatment |
| --- | --- |
| Current product identity | Rename to **Assembly Lab** |
| Repository, remote, and Pages slug | Cut over to `Assembly-Lab` in R2 |
| Package/export/provenance identity | Rename deliberately in R1; document compatibility |
| Local storage | Read old keys and migrate before writing new keys; never strand saved kits/preferences |
| Shared Product System contract | Coordinate both repositories and preserve schema compatibility |
| Historical release or repository lineage | Preserve old name with a “formerly” clarification where useful |
| Generic industry term “kit of parts” | Preserve |
| Generated vault indexes | Regenerate after canonical source paths change |
| Public links and analytics identifiers | Update in R3 after the new deployment is verified |

## Cutover risks and required safeguards

1. **Pages base-path breakage.** `vite.config.js` hard-codes `/Kit-of-Parts/`; changing the repository without changing and rebuilding this path will break assets.
2. **Old inbound links.** README, portfolio, vault, social previews, screenshots, and external posts may continue pointing to the old Pages route. R2 must verify current GitHub repository/Page redirect behavior immediately before cutover and provide an explicit fallback if Pages does not preserve the old route.
3. **Saved browser data.** Existing kits and preferences use `ic-*` local storage keys. R1 must migrate rather than reset user data.
4. **Interchange drift.** Product provenance strings can change, but the Product System v1 envelope and both contract copies must stay compatible.
5. **Historical distortion.** A global replacement in esen-vault would incorrectly rename industry concepts, quoted sources, event titles, and past release records.
6. **Stale generated artifacts.** Renaming source notes without rebuilding vault JSON/graph outputs would leave duplicate or broken project nodes.
7. **Public metadata dependency.** The portfolio uses the current project OG image as site-level social imagery; the new asset and URL must exist before those references switch.
8. **Local checkout and automation references.** Repository rename may affect local paths, saved commands, worktrees, Git remotes, and external tooling not visible in the four repositories. R2 needs a final filesystem/configuration search before moving the checkout.

## Approved migration sequence

### R1 — Product identity

Rename the visible application, metadata, exports, provenance, package identity, documentation, and assets while the repository and Pages path remain `Kit-of-Parts`. Add backward-compatible local-storage migration and keep the shared contract synchronized with Genba Lab if its wording changes.

### R2 — Repository and deployment

Verify current GitHub behavior, rename the GitHub repository and local checkout to `Assembly-Lab`, update the remote and Vite base path, deploy, test direct asset routes, and implement the chosen old-link transition.

### R3 — Ecosystem references

Update Genba Lab, current-facing esen-vault project paths/navigation, and onuresen.github.io links/metadata/assets. Preserve historical and generic terminology. Regenerate vault indexes.

### R4 — Verification and cleanup

Search all scoped repositories and relevant local configuration for stale active references, test builds and deployed URLs, validate cross-repository contracts and links, and record the completed rename in handoffs.

## R0 completion criteria

- [x] Four live checkouts and remotes identified
- [x] Working trees confirmed clean before audit documentation
- [x] Active application/deployment/export references inventoried
- [x] Genba Lab lineage and shared-contract references inventoried
- [x] Vault canonical, current-facing, historical, and generated references separated
- [x] Portfolio links, metadata, analytics labels, and icon dependency inventoried
- [x] Risks and staged migration sequence recorded
- [x] No product, URL, repository, deployment, or external repository renamed in R0
