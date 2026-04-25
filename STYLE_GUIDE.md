# Interstellar Romance UI Style Guide

This guide is the source of truth for the current UI direction. The app should continue to use Tailwind CSS for layout, spacing, typography, states, and responsive behavior. The Stellaris-inspired theme should be expressed with Tailwind utilities plus the CSS custom properties defined in `frontend/src/styles/globals.css` and Tailwind theme tokens in `frontend/tailwind.config.js`.

## Design Direction

Interstellar Romance uses a dense sci-fi command interface adapted for a dating sim. The UI should feel like a galactic personnel console rather than a marketing site or a casual mobile dating app.

Use:

- Dark space backgrounds with teal/cyan panel accents.
- Compact, information-rich panels.
- Character portraits as primary visual anchors.
- Resource-style stats for affection, compatibility, player attributes, milestones, photos, and memories.
- Clear rectangular panels with modest radii, usually `rounded-lg`.
- Tailwind responsive grids for dense screens.
- CSS variables for core theme colors.

Avoid:

- Detached decorative gradients or floating blobs.
- Large landing-page hero layouts inside the game flow.
- One-off color palettes that drift away from the teal/cyan command UI.
- Deeply nested cards inside cards.
- Big rounded pill controls unless the control is a badge, chip, or status indicator.
- Using old `.card`, `.btn`, or deleted `style.css` patterns.

## Technical Styling Rules

### Primary Styling Approach

Use Tailwind classes directly in components.

Preferred:

```tsx
<div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6">
  <h2 className="text-2xl font-bold text-[var(--text-primary)] uppercase tracking-wide">
    Galactic Dating Hub
  </h2>
</div>
```

Also acceptable when the token exists in `tailwind.config.js`:

```tsx
<div className="bg-stellaris-panel border border-stellaris-cyan/20 text-stellaris-text">
  ...
</div>
```

Avoid adding broad custom component classes unless a reusable component truly needs them. `globals.css` should stay small and should hold only app-wide primitives such as the theme wrapper, starfield, and shared animations.

### Current Global Styles

`frontend/src/styles/globals.css` currently defines:

- Tailwind import.
- `.stellaris-theme` base font, text color, and page background.
- `.starfield` fixed animated background.
- `blink` animation and `.cursor`.

`GamePage` already wraps the app in `.stellaris-theme` and renders the starfield. Keep this structure.

## Theme Tokens

The active theme uses these conceptual tokens.

### Backgrounds

```css
--bg-space: #0a0e13;
--bg-panel: #1a2330;
--bg-section: #152028;
--bg-item: #1e2d3a;
```

Use `--bg-panel` for major screen sections, `--bg-section` for grouped content, and `--bg-item` for repeated rows/cards/items.

### Text

```css
--text-primary: #e8f4fa;
--text-secondary: #b8d4e3;
--text-muted: #6b8395;
```

Use `--text-primary` for headings and important values, `--text-secondary` for body copy, and `--text-muted` for labels, helper text, and locked content.

### Accents and Borders

```css
--accent-cyan: #00d4ff;
--accent-teal: #4ae6c8;
--border-frame: rgba(0, 212, 255, 0.2);
--border-inner: rgba(74, 230, 200, 0.15);
```

Use `--border-frame` on large panels and `--border-inner` on nested panels and repeated items. Use cyan/teal for active, primary, and focus states.

### Resource and State Colors

```css
--resource-energy: #f1c40f;
--resource-minerals: #e74c3c;
--resource-food: #27ae60;
--resource-alloys: #9b59b6;
--resource-research: #3498db;
--resource-influence: #f39c12;

--state-available: #2ed573;
--state-building: #f39c12;
--state-locked: #7f8c8d;
--state-deficit: #e74c3c;
```

Use resource colors consistently:

- Affection and romance: pink/red gradients are acceptable, but should be balanced against the command UI.
- Compatibility and research/analysis: blue/purple or research blue.
- Available actions: green.
- Locked or unavailable states: muted gray.
- Warnings and reset timers: yellow/orange.
- Negative states: red.

## Layout Patterns

### App Shell

All game screens sit inside:

```tsx
<div className="stellaris-theme min-h-screen relative">
  <div className="starfield" />
  <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
    {renderScreen()}
  </div>
</div>
```

Screens should usually use an inner max-width container:

```tsx
<div className="min-h-screen">
  <div className="max-w-7xl mx-auto px-4 py-8">...</div>
</div>
```

### Panel Hierarchy

Use this hierarchy:

```tsx
<section className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6">
  <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-4">
    <div className="bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-lg p-4">
      ...
    </div>
  </div>
</section>
```

Do not wrap every section in multiple decorative cards. Use one major panel, then simple sub-panels only where the grouping helps scanning.

### Grids

Use responsive Tailwind grids:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">...</div>
```

Use stable dimensions for repeated visual units:

- Character portraits: `aspect-video` or fixed square frames.
- Profile portraits: `w-32 h-32`.
- Icons/status dots: fixed `w-* h-*`.
- Progress bars: fixed height.

## Typography

The active base font stack is defined by `.stellaris-theme`:

```css
Inter, SF Pro Text, -apple-system, system-ui, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif
```

Guidelines:

- Screen titles: `text-2xl` to `text-4xl`, `font-bold`, often `uppercase tracking-wide`.
- Panel headings: `text-lg` to `text-xl`, `font-bold`, cyan accent.
- Body copy: `text-sm` or `text-base`, `text-[var(--text-secondary)]`.
- Metadata and labels: `text-xs`, uppercase where useful, `text-[var(--text-muted)]`.
- Do not scale font sizes with viewport width.
- Keep letter spacing at default except for command-style uppercase labels where `tracking-wide` is already used.

## Components

### Buttons

Preferred new buttons should use Tailwind and theme tokens, or the shared `Button` component after it is migrated to the theme tokens.

Primary command:

```tsx
<button className="px-6 py-3 text-[var(--bg-space)] bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-teal)] hover:from-[var(--accent-teal)] hover:to-[var(--accent-cyan)] rounded-lg font-semibold transition-all duration-300">
  Confirm
</button>
```

Secondary command:

```tsx
<button className="px-4 py-2 text-[var(--text-primary)] bg-[var(--bg-section)] hover:bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-lg transition-colors">
  Back
</button>
```

Disabled:

```tsx
<button className="px-4 py-2 text-[var(--text-muted)] bg-[var(--state-locked)] rounded-lg opacity-50 cursor-not-allowed">
  Locked
</button>
```

Current debt: `src/components/ui/Button.tsx` still uses purple/gray direct utilities. Future work should migrate it to the same cyan/teal token system so shared and one-off buttons match.

### Panels and Cards

Use panels for screen structure and item cards only for repeated entities such as characters, achievements, memories, activities, photos, and date plans.

Character/item cards should have:

- `bg-[var(--bg-section)]`
- `border-2 border-[var(--border-inner)]`
- hover border cyan when clickable
- `rounded-lg`
- restrained hover scale, usually `hover:scale-105` only on selection cards

### Progress Bars

Use progress bars for affection, compatibility, achievement progress, daily interactions, and unlock progress.

Current shared component:

- `src/components/ui/ProgressBar.tsx`
- Variants: `affection`, `compatibility`, `progress`, `health`

Current debt: the shared component still uses direct gray/purple/blue utilities. It should be migrated to theme tokens, but ad hoc bars should not proliferate further.

### Badges and Status

Use small badge/chip elements for:

- relationship state
- compatibility percentage
- activity preference
- achievement category
- locked/unlocked state
- memory type

Badge pattern:

```tsx
<span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--bg-item)] border border-[var(--border-inner)] text-[var(--accent-cyan)]">
  75%
</span>
```

### Modals

The existing `Modal` component handles focus return, escape close, and body scroll lock. Keep those behaviors.

Current debt: modal surfaces still use direct `bg-gray-800`, `border-gray-700`, and gray text utilities. Migrate them to theme tokens when touching modal UI.

### Icons

The current app mostly uses emoji icons. That is acceptable for the present UI, but keep usage consistent:

- Use icons as compact labels, not decorative filler.
- Pair unfamiliar icons with text.
- Keep action icons stable across screens.
- Do not add custom SVG icon systems unless there is a clear need.

## Screen Patterns

### Main Menu

Current style:

- Centered title panel.
- Cyan/teal primary call to action.
- Settings and reset controls in a panel.

Needed polish:

- Settings toggles are visual placeholders and should become functional or be removed.
- Reset confirmation should be converted to the shared modal style.

### Character Creation

Current style:

- Dense form sections.
- Selection grids for species, gender, traits, preference, and backstory.
- Uses some legacy direct `slate` and `purple` utilities.

Needed polish:

- Migrate colors to theme tokens.
- Review mobile spacing and long labels.
- Replace broad emoji reliance with consistent icon/text controls if a formal icon library is introduced.

### Main Hub

Current style:

- Best match for the current style direction.
- Uses tokenized panels, stats grid, character card grid, compatibility badges, and bottom action panel.

Keep this as the reference screen for future UI work.

### Character Profile

Current style:

- Tokenized panel structure.
- Tabbed profile sections.
- Actions for chat, date planning, photos, and timeline.
- Recent memories now appear in overview.

Needed polish:

- Improve tab behavior on narrow mobile widths. Current tab row may crowd.
- Consider a denser relationship status summary above milestones.

### Date Planning

Current style:

- Three-step flow plus date outcome state.
- Activity grid, date plan cards, expected outcome panel, and memory confirmation.

Needed polish:

- Migrate remaining direct `slate`/`blue`/`purple` utilities to theme tokens.
- Replace alert-style thinking completely with in-flow panels or shared modals. The date flow now does this.
- Add clearer locked-date previews instead of hiding unavailable plans completely.

### Relationship Timeline

Current style:

- Vertical timeline with event dots.
- Includes milestones, dates, photo unlocks, first meeting, and relationship memories.

Needed polish:

- Migrate direct gradient/slate utilities to theme tokens.
- Improve event filtering or grouping once more event types are added.
- Ensure old persisted dates and new memory dates render consistently.

### Achievements

Current style:

- Functional but still mostly legacy `slate`/`purple` styling.
- Category chips and achievement cards work well structurally.

Needed polish:

- Migrate to tokenized panel hierarchy.
- Use the shared `ProgressBar` once that component is theme-aligned.
- Improve category controls for mobile wrapping and focus states.

### Photo Gallery

Needed polish:

- Keep portrait/image presentation inspection-friendly.
- Use tokenized empty, locked, and unlocked states.
- Add stronger visual distinction for rarity without overwhelming the main palette.

## Accessibility

Minimum requirements:

- Every interactive element must be keyboard reachable.
- Focus states must be visible against dark backgrounds.
- Buttons must have text or accessible labels.
- Progress bars need `role="progressbar"` plus value attributes.
- Modal focus should return to the triggering element.
- Do not rely on color alone for locked, success, or danger states.
- Respect `prefers-reduced-motion` for starfield and animated UI in a future pass.

Current debt:

- Many hand-written buttons need focus ring review.
- Some icon/emoji-only affordances need accessible labels.
- Starfield animation does not yet respect reduced motion.

## Responsive Design

Use Tailwind responsive prefixes:

- `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- `flex-col md:flex-row`
- `text-center md:text-left`
- `px-4 py-6` on mobile, larger spacing only where needed

Mobile priorities:

- No horizontal overflow in tab bars, timelines, and stat grids.
- Buttons should wrap cleanly and remain at least touch-friendly height.
- Character cards should preserve image aspect ratio.
- Dense profile/timeline data should stack before it shrinks unreadably.

## Animation and Motion

Current global motion:

- Starfield drift.
- Blinking cursor.
- Tailwind hover transitions.
- Occasional scale on selection cards.

Guidelines:

- Use `transition-colors` for simple button states.
- Use `transition-all duration-300` for selection cards and panel state changes.
- Keep scale effects subtle and limited to clickable cards/buttons.
- Avoid decorative animation loops except starfield/cursor.

Future improvement:

```css
@media (prefers-reduced-motion: reduce) {
  .starfield,
  .cursor {
    animation: none;
  }
}
```

## Migration Checklist

This checklist replaces the old pre-redesign migration list.

Done:

- [x] Import Tailwind from `frontend/src/styles/globals.css`.
- [x] Wrap the app in `.stellaris-theme`.
- [x] Add global starfield background.
- [x] Define Stellaris theme tokens in Tailwind config.
- [x] Define active CSS custom properties in `globals.css`.
- [x] Move the main hub and character profile toward tokenized panel patterns.
- [x] Surface relationship memories in profile, timeline, and date outcome flow.
- [x] Remove dependency on deleted root `style.css`.

Still needed:

- [ ] Migrate `Button`, `ProgressBar`, `Modal`, `DailyInteractionStatus`, `Achievements`, `DatePlanning`, `RelationshipTimeline`, `PhotoGallery`, and older interaction screens from direct `slate`/`purple` utilities to the tokenized Stellaris palette.
- [ ] Standardize all empty, loading, error, locked, and unavailable states.
- [ ] Review mobile layouts for tab navigation, timeline entries, achievements, date planning, and profile sections.
- [ ] Add visible focus states to hand-written buttons and clickable cards.
- [ ] Add reduced-motion handling for starfield, cursor, hover scaling, and pulsing states.
- [ ] Replace or formalize placeholder settings controls.
- [ ] Audit icon/emoji-only controls for accessible labels.
- [ ] Add UI screenshots or visual regression tests for main menu, creation, hub, profile, date flow, timeline, achievements, and gallery.
- [ ] Review color contrast after token migration, especially muted text on nested panels.

## UI/UX Improvement Backlog

High priority:

- Make shared UI components theme-compliant so new screens do not need one-off button and progress styles.
- Make settings real, especially audio/animation toggles, or remove them until implemented.
- Improve mobile behavior on dense screens.
- Add explicit reduced-motion support.
- Replace remaining alert/modal inconsistencies with in-flow panels or the shared modal.

Medium priority:

- Add clearer date plan locked previews and requirements.
- Add timeline filtering by memories, dates, photos, and milestones.
- Add profile summary cards for trust, intimacy, commitment, and shared experiences.
- Improve achievement category controls and progress presentation.
- Improve empty states for new players and filtered companion lists.

Lower priority:

- Add screenshots or short gameplay capture to README.
- Consider a formal icon library if emoji icons start to feel inconsistent.
- Consider character/species accent variants only after the core theme is consistent.

## Review Rule

When making UI changes, update this guide if the change introduces a new reusable pattern, changes the color/token approach, modifies shared components, or completes one of the migration checklist items.
