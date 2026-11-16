# Group 7: Cinematic Factory-to-Site

The existing delivery plan now drives the model rather than remaining only a board. The active component moves through four relative spatial states—factory, transport, site buffer, and installed—while the camera reframes the journey. A scrubber lets the user inspect any step without waiting for playback.

This is an explanatory visualization, not a logistics physics simulation. Authored part positions remain the source of truth, bottleneck calculations remain unchanged, and closing the journey returns the active component to its authored position. Motion uses the existing GSAP demand-render bridge and respects reduced-motion settings.
