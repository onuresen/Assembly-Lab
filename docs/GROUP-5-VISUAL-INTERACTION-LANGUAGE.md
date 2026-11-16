# Group 5: Visual and Interaction Language

Group 5 makes Kit of Parts feel responsive and inviting without turning it into a literal game.

## Principles

- Keep the building model visually dominant.
- Use animation to acknowledge input and explain state changes.
- Reveal technical detail progressively through selection and workspaces.
- Keep the same visual language across Design, Factory to Site, Test, and Review.
- Preserve a quiet idle scene and explicit accessibility/performance controls.

## Interaction behavior

Selecting a part adds a restrained cyan aura. Its directly connected neighbors remain legible while unrelated geometry fades into context. Hover and selection use short scale responses; reduced motion removes them. The inspector and labels enter with short spatial transitions rather than abrupt appearance.

## Experience controls

- **Beautiful:** DPR up to 1.5, environment lighting, 512 px cached contact shadow.
- **Performance:** DPR 1, no environment map, 256 px cached contact shadow, clouds and stars disabled when selected.
- **Full motion:** tactile hover and selection feedback.
- **Reduced:** removes tactile scale animation and collapses non-essential CSS motion. The operating-system reduced-motion preference also applies automatically.

These settings affect presentation only. Product data, rules, scenario results, and provenance remain unchanged.
