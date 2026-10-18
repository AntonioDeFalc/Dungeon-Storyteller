---
name: Fable & Shadow
colors:
  surface: '#10131e'
  surface-dim: '#10131e'
  surface-bright: '#363945'
  surface-container-lowest: '#0b0e18'
  surface-container-low: '#181b26'
  surface-container: '#1c1f2a'
  surface-container-high: '#272935'
  surface-container-highest: '#313440'
  on-surface: '#e0e1f1'
  on-surface-variant: '#d3c5ac'
  inverse-surface: '#e0e1f1'
  inverse-on-surface: '#2d303c'
  outline: '#9c8f79'
  outline-variant: '#4f4633'
  surface-tint: '#f9bd22'
  primary: '#ffe1a7'
  on-primary: '#402d00'
  primary-container: '#fbbf24'
  on-primary-container: '#6c4f00'
  inverse-primary: '#795900'
  secondary: '#bdc2ff'
  on-secondary: '#131e8c'
  secondary-container: '#2f3aa3'
  on-secondary-container: '#a8afff'
  tertiary: '#ffdec8'
  on-tertiary: '#4d2600'
  tertiary-container: '#ffba83'
  on-tertiary-container: '#814400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdf9f'
  primary-fixed-dim: '#f9bd22'
  on-primary-fixed: '#261a00'
  on-primary-fixed-variant: '#5c4300'
  secondary-fixed: '#e0e0ff'
  secondary-fixed-dim: '#bdc2ff'
  on-secondary-fixed: '#000767'
  on-secondary-fixed-variant: '#2f3aa3'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#10131e'
  on-background: '#e0e1f1'
  surface-variant: '#313440'
typography:
  headline-xl:
    fontFamily: Comfortaa
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Comfortaa
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Comfortaa
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Comfortaa
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: 0em
  headline-md:
    fontFamily: Comfortaa
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Comfortaa
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Comfortaa
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Comfortaa
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Comfortaa
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Comfortaa
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Comfortaa
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.03em
  label-sm:
    fontFamily: Comfortaa
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.25rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system crafts an immersive dark fantasy mobile RPG interface infused with the wonder, innocence, and mystery of a nocturnal fairytale. It marries the depth and menace of an ancient shadowed realm with the enchanting, approachable warmth of a storybook. 

The aesthetic is built upon:
- **Atmospheric Layering:** Soft, glowing magical energies radiating from beneath deep starlit surfaces.
- **Fairytale Playfulness:** Gentle, rounded silhouettes and organic, hand-crafted proportions that balance grim dark-fantasy tropes with whimsical charm.
- **Luminescent Tactility:** Delicate rim lighting, mystical amber auras, and ethereal arcane blooms evoking enchanted artifacts, ancient grimoires, and glowing runic relics.
- **Intended Audience:** Mobile RPG players who cherish narrative adventure, cozy yet dangerous world-building, and expressive character progression.

## Colors

The palette simulates the visual dynamics of an enchanted lantern illuminating midnight catacombs.

- **Primary (`#fbbf24`):** Mystic Gold. Applied to high-priority calls to action, radiant status highlights, legendary equipment indicators, and magical warmth.
- **Secondary (`#818cf8`):** Arcane Violet. Represents mana reserves, ethereal runes, celestial cooldowns, and enigmatic interface accents.
- **Tertiary (`#d97706`):** Deep Amber. Serves as the grounded shadow-counterpart to Mystic Gold, utilized for active pressed states, warning glows, and physical stamina meters.
- **Neutral Canvas (`#0c0e14`, `#141722`, `#1c2130`):** Shadow Tiers. Forms the deep subterranean foundation. Surfaces stack upwards in brightness to establish natural ambient hierarchy.
- **Text & Foreground (`#f3f4f6`, `#cbd5e1`, `#94a3b8`):** Bone & Parchment. Warm, muted white and parchment hues that ensure long-session readability without harsh pure-white glare against midnight surfaces.

## Typography

The typography leverages **Comfortaa** across all touchpoints to infuse the interface with an organic, rounded, storybook warmth while preserving geometric clarity on compact mobile screens.

- **Headlines:** Use weights `600` and `700` with subtle negative tracking on large displays to emulate handwritten fairytale chapter titles.
- **Body:** Use weight `400` with generous line-height ratios (`1.5` to `1.57`) to offset Comfortaa’s wide glyph proportions and provide comfortable story reading.
- **Labels & Micro-copy:** Use weight `600` with expanded letter-spacing to maintain tap-target readability for inventory counts, cooldown timers, and spell names.

## Layout & Spacing

The layout employs a mobile-first fluid grid optimized for one-handed thumb reach and dense inventory management.

- **Mobile Canvas:** 4-column fluid layout with `1rem` outer margins and `0.75rem` gutters. Crucial tactical actions rest within the lower bottom-third zone.
- **Tablet / Expanded Canvas:** 8-column layout with `1.25rem` outer margins, accommodating split-screen quest logs, character paper-doll inspection, and bag matrices.
- **Vertical Rhythm:** Rooted in dynamic `0.25rem` (4px) multiples, grouping interactive spell sockets and inventory items tightly while offering breathing room between narrative lore sections.

## Elevation & Depth

Visual hierarchy does not use cold drop shadows; instead, it relies on **ambient luminescence**, **ethereal glows**, and **surface tonal stacking**.

- **Level 0 (Abyss / Deep Void):** `#0c0e14` background for root canvases, parchment scroll recesses, and inactive spell slots.
- **Level 1 (Relic Surface):** `#141722` with a subtle top rim border (`rgba(243, 244, 246, 0.08)`) and an ultra-diffused floor shadow (`0 8px 24px rgba(0, 0, 0, 0.6)`).
- **Level 2 (Active Artifact / Card):** `#1c2130` framed by delicate borders (`1px solid rgba(251, 191, 36, 0.2)`), casting a soft amber ambient aura (`0 0 20px rgba(217, 119, 6, 0.15)`).
- **Level 3 (Modal / Enchantment Overlay):** Elevated canvas with a dual-stage glow: an inner highlight of `inset 0 1px 1px rgba(255, 255, 255, 0.15)` combined with an arcane outer dispersion (`0 12px 36px rgba(99, 102, 241, 0.25)`).

## Shapes

The interface embraces organic curvature without feeling juvenile, aligning with rounded fairytale geometry (`ROUND_TWELVE` to `ROUND_SIXTEEN` baseline).

- Standard interactive components (buttons, chips, input fields) utilize `0.75rem` (12px) to `1rem` (16px) corner radii.
- Floating dialogue boxes, grimoire cards, and sheet drawers incorporate `1rem` to `1.5rem` soft radii.
- Icons, sockets, and avatar frames preserve squircle profiles, echoing polished runes and carved runestones.

## Components

### Buttons
- **Primary (Enchanted Amber):** Filled with a rich gradient from `#fbbf24` to `#d97706`, dark bone text (`#0c0e14`), rounded corners (`16px`), and an ambient gold perimeter glow (`box-shadow: 0 0 16px rgba(251, 191, 36, 0.4)`).
- **Secondary (Arcane Rune):** Dark surface `#1c2130` with an ethereal border (`1px solid #818cf8`) and violet glow on focus/hover.
- **Ghost / Narrative:** Transparent background with warm bone text (`#f3f4f6`) and an amber underline indicator on active press.

### Cards & Grimoire Panes
- Layered `#141722` to `#1c2130` background gradients.
- Fine 1px perimeter stroke using translucent bone (`rgba(243, 244, 246, 0.07)`).
- Golden rim illumination applied to header dividers and rarity badges.

### Chips & Badges
- Compact pill-like containers with `12px` roundedness.
- Rarity tiers coded via atmospheric background tints (`rgba(129, 140, 248, 0.12)` for Arcane/Rare, `rgba(251, 191, 36, 0.12)` for Legendary).

### Checkboxes, Toggles & Radios
- Checkboxes: Carved squircle boxes with an inset shadow simulating stamped leather, blooming with a golden runic checkmark upon selection.
- Radios: Concentric circular amulets with an inner glowing orb.

### Input Fields & Dialogue Choices
- Deep shadow fill (`#0c0e14`) framed with soft border lines.
- Active typing state triggers a radiant amber border glow (`rgba(251, 191, 36, 0.5)`) and comfortable, storybook-proportioned placeholder text.

### RPG-Specific Components
- **Item Sockets:** Recessed rounded boxes (`#0c0e14`) with inset rim lighting, displaying item cooldown sweeps with translucent violet overlays.
- **Health / Mana / XP Orbs & Bars:** Fluid gauges enclosed within rounded glass containers, layered with soft internal blooms and sparkling highlights.
- **Story Dialogue Bubbles:** Rounded parchment-black cards featuring subtle whimsical flourishes and character portrait cutouts.