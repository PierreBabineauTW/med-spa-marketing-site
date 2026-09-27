# Output Plan — upkeepmedspa.com

Prepared per `clone-website` Pre-Flight step 5.

## App root

`<app-root>` = `C:\Users\pierr\work\upkeepmedspa-clone`

Fresh clone of https://github.com/JCodesMore/ai-website-cloner-template
(`ai-website-clone-template` v0.5.1, Next.js 16.3.5, React 19.2.4, Tailwind v4,
shadcn/ui, `cn()` in `src/lib/utils.ts`).

`npm run build` verified green on this root (Node v22.23.3; template requests >=24,
builds fine). Single-site app, so shared foundation files may be edited globally.

## Targets

| Field | Value |
| --- | --- |
| Target URL | `https://upkeepmedspa.com/` |
| Normalized origin | `https://upkeepmedspa.com` |
| Normalized pathname | `/` (no query, no fragment) |
| Title (verified live) | `UPKEEP Med Spa — Not Your Mother's Med Spa \| NYC & Dallas` |
| `<site-key>` | `upkeepmedspa-com-9d00bd1f` |
| `<page-key>` | `root-8a5edab2` |
| Destination route | `/` → `src/app/page.tsx` |

Hashes are the first 8 lowercase hex chars of SHA-256 over the normalized
origin / pathname respectively.

## Output directories

| Purpose | Path |
| --- | --- |
| Artifact root | `docs/research/upkeepmedspa-com-9d00bd1f/root-8a5edab2/` |
| Component specs | `docs/research/upkeepmedspa-com-9d00bd1f/root-8a5edab2/components/` |
| Screenshot root | `docs/design-references/upkeepmedspa-com-9d00bd1f/root-8a5edab2/` |
| Component root | `src/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/` |
| Same-site shared components | `src/components/sites/upkeepmedspa-com-9d00bd1f/shared/` |
| Asset root | `public/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/` |
| Same-site shared assets | `public/sites/upkeepmedspa-com-9d00bd1f/shared/` |
| Asset downloader | `scripts/download-assets-upkeepmedspa-com-9d00bd1f-root-8a5edab2.mjs` |

## Existing routes inventory (pre-clone)

Only two routes exist, both template scaffold:

- `src/app/page.tsx` — untouched template home
- `src/app/_not-found` (implicit)

Existing scaffold files: `src/app/{layout.tsx,globals.css,favicon.ico}`,
`src/components/ui/button.tsx`, `src/lib/utils.ts`, `src/hooks/.gitkeep`,
`src/types/.gitkeep`, `public/{images,videos,seo}/.gitkeep`.

No `docs/research/`, no `docs/design-references/`, no `src/components/sites/`,
no `public/sites/` — all namespace roots are free. `docs/research/<site>/…`
does not collide with the template's `docs/` tree.

## Route decision

`<app-root>/src/app/page.tsx` **may be replaced**: this is the first single-URL
clone in an untouched template, so the clone lives at `/` per the skill's routing
defaults. No non-scaffold route, component tree, research folder, screenshot or
asset namespace is touched.

## Shared foundation files that will change

Single-site app, so these are edited globally (safe — no other origins):

- `src/app/globals.css` — merge target design tokens, fonts, keyframes
- `src/app/layout.tsx` — target fonts via `next/font`, metadata
- `src/types/` — namespaced content interfaces
- `src/components/sites/upkeepmedspa-com-9d00bd1f/shared/icons.tsx` — extracted SVGs

`src/lib/utils.ts` (`cn()`) and `src/components/ui/button.tsx` are preserved as-is.

## Confirmed non-issues

- No same-path query/fragment behavior (single URL, no query).
- Single origin, so no multi-origin layout decision needed.
- Skill copy loaded from `~/.config/opencode/skills` is byte-identical to the
  template's canonical `.agents/skills/clone-website/SKILL.md` (SHA-256 equal).
