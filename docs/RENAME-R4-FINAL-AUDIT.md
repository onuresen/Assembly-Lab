# Assembly Lab Rename — R4 Final Audit

Date: 2026-11-17

Status: complete

## Identity and routes

- GitHub repository: `https://github.com/onuresen/Assembly-Lab`
- Git remote: `https://github.com/onuresen/Assembly-Lab.git`
- Local checkout: `E:\GitHub\Assembly-Lab`
- Live app: `https://onuresen.github.io/Assembly-Lab/`
- Former repository URL redirects to the renamed repository.
- Former Pages route loads its compatibility page and redirects in the browser to Assembly Lab while preserving query strings and hashes.

## Verification

- Assembly Lab: 17/17 tests pass.
- Assembly Lab: production build passes.
- Genba Lab: production build passes.
- Genba Lab: 62/63 tests pass. The only failure is the existing generated-IFC equality check comparing LF generator output with the CRLF committed file; the contents match after newline normalization.
- Shared `productSystem.js` SHA-256 matches in both applications: `D92459311D68F12461B962D14DF683D38B05E0AAA05D71C854C30DEA78682BF5`.
- Vault graph and cockpit index regenerated successfully.
- Vault audit reports only the two pre-existing `Example Topic` links.
- New repository, app HTML, representative JavaScript asset, and favicon all return HTTP 200.

## Reference policy

- Current-facing product paths, URLs, labels, and assets use Assembly Lab.
- The former name remains only where it records lineage, dated history, compatibility behavior, or the generic industrialized-construction term.
- The old GitHub repository name must not be reused because it owns the repository redirect.
