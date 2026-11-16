# Assembly Lab Rename — R2 Repository and Deployment

Date: 2026-11-17

Status: complete

## Cutover

- Rename GitHub repository `onuresen/Kit-of-Parts` to `onuresen/Assembly-Lab`.
- Rename the local checkout to `E:\GitHub\Assembly-Lab` and update `origin` explicitly.
- Change the Vite/GitHub Pages base path from `/Kit-of-Parts/` to `/Assembly-Lab/`.
- Update application metadata, sharing captions, README links, and performance-gate URLs to the new Pages route.
- Publish a lightweight redirect at `https://onuresen.github.io/Kit-of-Parts/` from the root portfolio repository.

## Redirect decision

GitHub redirects repository traffic and Git operations after a rename, but its documentation explicitly excludes project-site URLs. The old repository name must not be reused because doing so would remove repository redirects. The user-site repository therefore owns the old Pages-path redirect without recreating `onuresen/Kit-of-Parts`.

## Verification

- Production build emits `/Assembly-Lab/` asset URLs.
- GitHub repository is `onuresen/Assembly-Lab`.
- `origin` uses `https://github.com/onuresen/Assembly-Lab.git`.
- The renamed repository, new Pages URL, representative assets, and former Pages redirect were checked after deployment.
