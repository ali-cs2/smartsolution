# Smart Solution V2 — source review and validation

## Review scope and evidence limit

The repository was read at commit 4fea99c0d113d601535bc93f7518998c1b55e112. A live browser and execution environment were unavailable during this revision. This document records source findings and repairs; it is not a screenshot-based visual audit, an accessibility certification, or a claim of universal device compatibility. New screenshots from automated browser runs must be inspected before visual sign-off.

## Findings and changes

| Step | Source finding | Repair / remaining verification |
| --- | --- | --- |
| 1. Branding | The header cropped a JPEG and used multiply blending to disguise white pixels. | Replaced with a transparent, path-based SVG web adaptation. Original artwork is retained. Verify fidelity against original brand artwork. |
| 2. Hero | The sculpture was abstract. Its fallback differed from the GPU version. | Physical robot, gate, and greenhouse share one geometry model between SVG and Three.js. Touch/keyboard rotation and action controls work through one controller. |
| 3. Rendering | A permanent animation loop continued scheduling frames when offscreen, and a failed context had only a decorative fallback. | Stop scheduling while hidden/offscreen/paused; cap pixel density; load Three.js lazily; recover to an interactive SVG after GPU loss. |
| 4. Services | All seven service illustrations reused floating slabs. Phone tabs retained vertical ARIA orientation and lacked left/right keyboard navigation. | Replaced slabs with physical capability illustrations. Added responsive orientation and RTL-aware left/right keys. |
| 5. Phone layout | Grid children had no explicit zero minimum, risking overflow from long horizontal tab lists. | Added minmax(0,1fr), minimum-size resets, clipped decorative overflow, and 44px primary touch targets. Browser tests cover 320/390/768/1440 and landscape widths. |
| 6. Project brief | The service selection could lag behind the active service tab. The dialog lacked an explicit accessible heading. | Sync selection on open and label the native dialog. The form still creates a local file; no fake submission. |
| 7. Concepts | No physical concept gallery existed. | Added three exploratory examples, explicitly identified as capability concepts rather than delivered client work. |
| 8. Resilience | Reveal content depended on IntersectionObserver without a visibility fallback. | Content is visible by default; reveals become progressive enhancement. Reduced motion disables automatic movement. |

## Validation included

- Pure Node geometry tests: positive dimensions, finite SVG coordinates, mounted group hierarchy, meaningful action poses, all seven service illustrations.
- Production build in GitHub Actions.
- Browser suite: Chromium at multiple widths, Firefox desktop, WebKit phone; both language directions, overflow, menu, dialogs, file download, service navigation, fallback scenes, and concept selection.
- GPU smoke test reports an explicit skip if the CI runner has no WebGL2 context.
- Stable screenshots are collected in the workflow artifact for subsequent human visual review.

Automated suite definitions are not evidence of a successful run. Check the actual GitHub Actions result for the tested commit. Physical hardware testing, 4× visual inspection, GPU memory profiling, and a full assistive-technology audit remain outside the checks performed here.
