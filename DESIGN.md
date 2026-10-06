---
name: 캠짐 (camjim)
description: Camping-packing deck read like campground wayfinding; navy signage band, five zone colours, one post marker.
colors:
  band: "#0E3B43"
  on-band: "#FFFFFF"
  band-soft: "#B9D3D6"
  ground: "#F3F5F4"
  card: "#FFFFFF"
  ink: "#152221"
  ink-soft: "#3E4D4B"
  muted: "#5C6A68"
  control: "#7C8A87"
  track: "#E3E8E6"
  primary: "#0E3B43"
  on-primary: "#FFFFFF"
  tonal: "#DCE9EA"
  on-tonal: "#0E3B43"
  later-ink: "#0E3B43"
  no-ink: "#5C6A68"
  trunk-in: "#1E2B2C"
  car-body: "#FFFFFF"
  car-stroke: "#152221"
  taillight: "#D7263D"
  shadow: "#0E1F20"
  zone-home-fill: "#C2410C"
  zone-home-on-fill: "#FFFFFF"
  zone-home-ink: "#B23A0A"
  zone-kitchen-fill: "#F2B705"
  zone-kitchen-on-fill: "#152221"
  zone-kitchen-ink: "#8A5F00"
  zone-kitchen-edge: "#8A5F00"
  zone-fire-fill: "#C8102E"
  zone-fire-on-fill: "#FFFFFF"
  zone-fire-ink: "#B30E29"
  zone-power-fill: "#1F5FD1"
  zone-power-on-fill: "#FFFFFF"
  zone-power-ink: "#1A54BC"
  zone-living-fill: "#0F7B5F"
  zone-living-on-fill: "#FFFFFF"
  zone-living-ink: "#0D6E55"
  band-dark: "#15444D"
  on-band-dark: "#FFFFFF"
  band-soft-dark: "#CFE5E7"
  ground-dark: "#0E1514"
  card-dark: "#18211F"
  ink-dark: "#E7EEEC"
  ink-soft-dark: "#B8C4C1"
  muted-dark: "#93A19E"
  control-dark: "#73827F"
  track-dark: "#222D2B"
  primary-dark: "#A9CED2"
  on-primary-dark: "#0B1F22"
  tonal-dark: "#21393C"
  on-tonal-dark: "#CFE5E7"
  later-ink-dark: "#A9CED2"
  no-ink-dark: "#93A19E"
  trunk-in-dark: "#0A1010"
  car-body-dark: "#2A3533"
  car-stroke-dark: "#93A19E"
  taillight-dark: "#FF5A6A"
  shadow-dark: "#000000"
  zone-home-fill-dark: "#E05A1F"
  zone-home-on-fill-dark: "#0E1514"
  zone-home-ink-dark: "#FF9461"
  zone-kitchen-fill-dark: "#F2B705"
  zone-kitchen-on-fill-dark: "#152221"
  zone-kitchen-ink-dark: "#F5C842"
  zone-fire-fill-dark: "#E0283F"
  zone-fire-on-fill-dark: "#FFFFFF"
  zone-fire-ink-dark: "#FF7A85"
  zone-power-fill-dark: "#2F6BD8"
  zone-power-on-fill-dark: "#FFFFFF"
  zone-power-ink-dark: "#8DB4FF"
  zone-living-fill-dark: "#14A07A"
  zone-living-on-fill-dark: "#0E1514"
  zone-living-ink-dark: "#4FD6AE"
typography:
  display:
    fontFamily: "Pretendard"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: "38px"
    letterSpacing: "-0.6px"
  title:
    fontFamily: "Pretendard"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: "28px"
    letterSpacing: "-0.44px"
  headline:
    fontFamily: "Pretendard"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: "21px"
    letterSpacing: "-0.34px"
  body:
    fontFamily: "Pretendard"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: "23px"
    letterSpacing: "-0.15px"
  label:
    fontFamily: "Pretendard"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: "18px"
    letterSpacing: "0.2px"
  caption:
    fontFamily: "Pretendard"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "18px"
    letterSpacing: "-0.12px"
  stamp:
    fontFamily: "Pretendard"
    fontSize: "26px"
    fontWeight: 800
    lineHeight: "34px"
    letterSpacing: "-0.52px"
  post-plaque:
    fontFamily: "Pretendard"
    fontSize: "22px"
    fontWeight: 800
    lineHeight: "26px"
    letterSpacing: "0.2px"
    fontFeature: "\"tnum\""
  post-code:
    fontFamily: "Pretendard"
    fontSize: "13px"
    fontWeight: 800
    lineHeight: "16px"
    fontFeature: "\"tnum\""
rounded:
  swatch: "3px"
  marker: "6px"
  plaque: "8px"
  control: "12px"
  card: "20px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  xxl: "28px"
components:
  band:
    backgroundColor: "{colors.band}"
    textColor: "{colors.on-band}"
    typography: "{typography.title}"
    padding: "12px 20px 16px"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.headline}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "56px"
  button-tonal:
    backgroundColor: "{colors.tonal}"
    textColor: "{colors.on-tonal}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "48px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "48px"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "44px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    typography: "{typography.display}"
    rounded: "{rounded.card}"
    padding: "16px 20px"
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
    height: "52px"
  segmented-ios-track:
    backgroundColor: "{colors.track}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.control}"
    padding: "3px"
    height: "44px"
  segmented-ios-thumb:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "9px"
  segmented-android-selected:
    backgroundColor: "{colors.tonal}"
    textColor: "{colors.on-tonal}"
    rounded: "{rounded.pill}"
    height: "48px"
  post-marker-plaque:
    backgroundColor: "{colors.card}"
    textColor: "{colors.zone-kitchen-ink}"
    typography: "{typography.post-plaque}"
    rounded: "{rounded.plaque}"
    padding: "0 12px"
    height: "46px"
  post-marker-plaque-must:
    backgroundColor: "{colors.zone-kitchen-fill}"
    textColor: "{colors.zone-kitchen-on-fill}"
    typography: "{typography.post-plaque}"
    rounded: "{rounded.plaque}"
    height: "46px"
  post-marker:
    backgroundColor: "{colors.card}"
    textColor: "{colors.zone-home-ink}"
    typography: "{typography.post-code}"
    rounded: "{rounded.marker}"
    padding: "0 8px"
    height: "28px"
  post-marker-sm:
    backgroundColor: "{colors.card}"
    textColor: "{colors.zone-home-ink}"
    rounded: "{rounded.marker}"
    padding: "0 6px"
    height: "24px"
  stamp:
    backgroundColor: "transparent"
    textColor: "{colors.zone-kitchen-ink}"
    typography: "{typography.stamp}"
    rounded: "{rounded.plaque}"
    padding: "2px 12px"
  poster-cell-packed:
    backgroundColor: "{colors.zone-home-fill}"
    textColor: "{colors.zone-home-on-fill}"
    typography: "{typography.caption}"
    rounded: "{rounded.marker}"
    padding: "0 6px"
  poster-cell-pending:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.marker}"
    padding: "0 6px"
  poster-cell-left-out:
    backgroundColor: "{colors.card}"
    textColor: "{colors.muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.marker}"
    padding: "0 6px"
  poster-sheet:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "16px"
---

# Design System: 캠짐 (camjim)

## Overview

**Creative North Star: "The Campground Signboard" (캠핑장 안내판)**

Packing reads like walking a campground with its site map. Every item lives in one of five zones, each with a letter and a colour, and every item carries a post number ("B-3") the way a campsite carries a pitch plate. A deep petrol-navy signage band is the shell at the top of every screen and is painted under the status bar; beneath it a cool neutral ground holds white panels. Colour is not decoration here: it is the wayfinding. The same zone colour marks the post, tints the item pictogram, inks the stamp, fills the box that drops into the trunk, and fills the poster cell.

The surface is calm and dense in the way a park sign is dense: one big question per card, plain Pretendard set in weight and size contrast, one licensed pictogram set, generous thumb-zone controls. Personality comes from motion and reply copy (the stamp landing, the card dropping into the trunk, the car driving off), not from ornament. The post marker is the only ornament in the system.

Light and dark are both first-class (packing the night before; re-checking at the trunk in daylight). Every token has a dark counterpart, and every text pair holds 4.5:1 and every UI boundary 3:1 in both themes. Controls follow each OS natively rather than a shared custom skin.

**Key Characteristics:**
- Navy signage band on every screen, under the status bar, carrying the screen title and the current zone guide.
- Five zone colours, each with fill / on-fill / ink (and an edge where the fill is too weak against white).
- One post marker per item; its fill states importance.
- Pretendard only; hierarchy by weight and size.
- One shared 7:3 cell module for trunk boxes and poster cells.
- Native controls per OS; 44pt iOS / 48dp Android minimum targets.

## Colors

A cool, near-neutral ground under a petrol-navy shell, with five saturated signage colours reserved for zone meaning.

### Primary
- **Signboard Petrol Navy** (`band`, `primary`): the shell band behind titles and the zone guide, the single filled action per screen (챙겼다!, 짐 싸기 시작, 기록하고 마치기), text-button labels, and the 나중에 stamp ink. In dark mode the band lifts to a lighter petrol (`band-dark`) and the primary action inverts to **Pale Sign Teal** (`primary-dark`) with dark text so the button stays the brightest object on a dark ground.
- **Band Mist** (`band-soft`): secondary text on the band only (zone span "아이스박스 … 커피", trip meta).

### Secondary
- **Tonal Teal Wash** (`tonal` / `on-tonal`): secondary filled surfaces: the tonal save button and the selected Android segment.

### Tertiary: the five zones
Each zone has four roles. **fill** paints posts that are season-required, trunk boxes, packed poster cells, and zone swatches. **on-fill** is text and icon on fill. **ink** is the zone colour on white/dark card: question pictogram, post outline and code, stamp ink. **edge** outlines a fill on a light surface; it equals fill everywhere except light-mode kitchen yellow, whose edge is the darker ochre ink.
- **A 주거 Site Orange** (`zone-home-*`)
- **B 주방 Camp Kitchen Yellow** (`zone-kitchen-*`): the one dark-on-fill zone in light mode; always outlined with its ochre edge on white.
- **C 불·난방 Fire Red** (`zone-fire-*`)
- **D 전기·조명 Power Blue** (`zone-power-*`)
- **E 생활 Living Green** (`zone-living-*`): also the "빠뜨린 짐 없어요" all-clear check.

### Neutral
- **Cool Ground** (`ground`): screen background under everything.
- **Panel White / Panel Charcoal** (`card`): cards, inputs, poster sheet, outlined post markers, iOS segment thumb.
- **Trail Ink** (`ink`), **Soft Ink** (`ink-soft`), **Muted Slate** (`muted`): body, secondary, and caption text. Muted is used at 12pt and up only.
- **Control Slate** (`control`): every UI boundary: outline buttons, input border, segmented outline, hairline row dividers, skipped-post dashed outline, left-out poster cell border, trunk ground line.
- **Track Grey** (`track`): iOS segmented track; also the car's rear window.
- **No Ink** (`no-ink`), **Later Ink** (`later-ink`): stamp colours for 필요 없어 and 나중에; they stay neutral so only 챙김 carries zone colour.
- **Illustration set** (`trunk-in`, `car-body`, `car-stroke`, `taillight`): the trunk SVG only. Taillight red is deliberately distinct from Fire Red so the car never reads as a zone.
- **Shadow** (`shadow`): shadow colour for card, poster sheet, and iOS thumb.

### Named Rules
**The Zone Is the Colour Rule.** Zone colour appears only where it means "this item's zone": post marker, card pictogram, 챙김 stamp, trunk box, poster cell, zone swatch. Never use a zone colour for a generic accent, button, or status.

**The Four Roles Rule.** On a fill use on-fill; on card use ink; a fill sitting on a light surface gets the edge. Never put zone fill text on white.

**The Navy Holds the Frame Rule.** The band is navy on every screen, painted under the status bar, in both themes; it is the only full-bleed colour surface.

## Typography

**Display Font:** Pretendard (five static files: Regular 400, Medium 500, SemiBold 600, Bold 700, ExtraBold 800)
**Body Font:** Pretendard
**Label/Mono Font:** Pretendard with tabular numerals for counts, post codes, and dates

**Character:** One Korean grotesque doing every job, like a signboard that uses one typeface at several weights. Display sizes tighten tracking (-2% of size); text sizes tighten slightly (-1%); labels open up (+0.2px).

### Hierarchy
- **Display** (700, 30px, 38px): the card question ("가스버너는?") and the ending headline. A second question line sits beneath at 600 in soft ink.
- **Title** (700, 22px, 28px): band titles (trip name, 캠짐, poster sign-off) and the poster sheet's trip name.
- **Headline** (700, 17px): section headings on Setup and Poster, the band progress count, and large-button labels.
- **Body** (400, 15px, 23px): explanations and band secondary lines; 600 for list item names, 700 for zone names.
- **Label** (700, 13px, +0.2px): input labels and list section labels, always followed by the content they name, in soft ink. Not uppercase.
- **Caption** (500, 12px, 18px): row notes, trunk caption, poster footer, poster cell names.
- **Stamp** (800, 26px): stamp words 챙김! / 나중에 / 필요 없어 only.
- **Post code** (800; 22px plaque, 13px row, 12px small; tabular): post numbers only.

### Named Rules
**The Weight-and-Size Rule.** Hierarchy comes from Pretendard weight and size alone. No second family, no uppercase, no colour-only hierarchy.

**The familyFor Rule.** Never pass a bare fontWeight to a custom face; resolve every weight through `familyFor()` to its static Pretendard file so iOS does not fake bold and Android does not drop it.

## Layout

Single-column, phone-first. Content (band interior and body) is centred at a maximum width of 420 with 20px side padding, so tablets show a centred column under a full-width band. The band pads top by the safe-area inset plus 12, and 16 below. Body sections stack with 20px gaps; fields and sections use 8px internal gaps; list rows are at least the touch minimum plus 8 tall, separated by hairline control dividers.

The Deck is a fixed vertical stack: band, card stage (flex, minimum 230), secondary row of two outline buttons, full-width 56px primary in the thumb zone, text 이전으로, trunk. Upcoming cards peek behind the current card (16px down at 95%/75% opacity; 30px down at 90%/40%).

Spacing scale: 4 / 8 / 12 / 16 / 20 / 28. Bottom padding always adds the safe-area inset.

**The Shared Cell Rule.** Trunk boxes and poster cells are the same 7:3 module (`CELL_RATIO`). The poster grid is three columns with 6px gaps; the trunk is a 6 by 5 grid filled bottom-up. A packed item is literally the same shape in both places.

## Elevation & Depth

A mostly flat signage system with ambient lift for physical objects only. The deck card and the poster sheet float on soft, low-opacity shadows in the shadow colour; the iOS segmented thumb lifts slightly off its track. Bands, buttons, markers, cells, and rows are flat. Peeking cards behind the deck drop their shadow and rely on scale and opacity for depth.

### Shadow Vocabulary
- **Card lift** (offset 0 8, radius 18, opacity 0.10; Android elevation 5): the current deck card.
- **Sheet lift** (offset 0 6, radius 16, opacity 0.08; elevation 3): the shareable poster sheet.
- **Thumb lift** (offset 0 2, radius 4, opacity 0.12; elevation 2): iOS segmented selected thumb.

### Named Rules
**The Objects Float, Signs Don't Rule.** Only things you could hold (the card, the poster) cast shadows. Signage (band, markers, buttons) stays flat.

## Shapes

Rounded-rectangle signage. Large panels use generous 20px corners; controls 12px; post markers and cells 6px; the card plaque and stamp 8px; swatches 3px. Android segmented buttons use a full pill per Material 3. Borders carry meaning: 1.5px control outline on outline/tonal buttons, inputs, and cells; 2px on posts (1.5 small, 3 plaque); 3px on the stamp. A dashed border means "not settled": a post the user skipped last trip (dashed control) or a poster cell still pending (dashed zone ink). The stamp is the only rotated shape (-10deg). The trunk and car are a flat SVG drawing in the same rounded vocabulary.

## Components

### Buttons
Calm, solid, thumb-sized.
- **Shape:** gently rounded (12px), 16px side padding, icon and label 8px apart.
- **Primary:** petrol navy fill, white label at 700; large size is 56px tall with a 17px label and 22px icon. One per screen.
- **Tonal:** tonal wash fill with 1.5px control outline, on-tonal label (image save).
- **Outline:** transparent with 1.5px control outline, ink label at 700, 20px icon (나중에, 필요 없어).
- **Text:** primary-coloured 600 label, minimum touch height (이전으로, row actions like 챙겼다 / 넣기).
- **Press:** iOS dims to 70%; Android uses a bounded ripple (white 20% on primary, black 8% elsewhere). Pressables are keyed by theme so a runtime light/dark switch rebuilds the ripple.
- **Disabled:** 40% opacity.
- **Sizes:** never below 48 tall for filled/outlined buttons; text buttons never below 44 iOS / 48 Android.

### Segmented control (native per OS)
- **iOS:** track-grey track with hairline control border, 3px inset, white thumb with thumb lift; selected label 700 ink, others 500 soft ink at 15px.
- **Android:** Material 3 segmented buttons: pill outline in control, 1px dividers, selected segment tonal with an 18px check and on-tonal label.

### Inputs / Fields
- **Style:** card background, 1.5px control border, 12px radius, 52px minimum height, trip name set at 20px SemiBold.
- **Label:** a 13px Label above in soft ink, linked for screen readers.

### Cards / Containers
- **Deck card:** card colour, 20px radius, 16/20 padding, card lift. Plaque post marker top-left with the season note beside it; display question; centred 120px zone-ink pictogram; reply line (16px, soft ink) under it; stamp top-right.
- **Poster sheet:** card colour, 20px radius, 16px padding, sheet lift; trip title, tabular meta line, zone groups with swatch, name, and "packed / total", cell grid, centred car-back sign-off and date footer. This view is the saved image.

### Signature: Post Marker
The only ornament. Text is the post code ("B-3") at 800 with tabular numerals. Importance is told only by fill:
- **Season-required:** solid zone fill, on-fill code, edge border.
- **Normal:** card background, zone-ink border and code.
- **Skipped last trip:** card background, dashed control border, muted code.
Sizes: plaque (on the card, 46 tall, 3px border, 8px radius), md (28 tall), sm (in list rows, 24 tall).

### Signature: Stamp
Outlined word stamp rotated -10deg. 챙김! uses the item's zone ink; 나중에 later-ink; 필요 없어 no-ink. It lands at scale 2 to 0.92 to 1 with a small card shake and a haptic (medium for 챙김, light otherwise), and the card's reply line fades in. Both stay visible for 700ms before the card leaves.

### Signature: Trunk and Ending
A flat SVG hatchback seen from behind, open hatch on gas struts, zone-filled boxes in the 7:3 module stacking bottom-up. Card exits: 챙김 drops down and shrinks toward the trunk while the newest box falls in with a slight overshoot; 나중에 lifts up and away; 필요 없어 slides left and tilts; 이전으로 brings the previous card back in from the left. Ending: action buttons fade, the trunk returns as a large hero, the hatch closes (heavy haptic), the car drives off right, and the poster enters from the left.

### Signature: Poster Cell
The trunk box module at poster scale with a 16px pictogram and 12px name. Packed: zone fill, on-fill, 700. Pending (나중에): card with dashed zone-ink border. Left out: card with control border, muted, struck through.

### Item pictograms
MaterialCommunityIcons, one licensed set, at exactly three item-mark sizes: card 120, row 20, cell 16, coloured in the zone ink (or on-fill inside a packed cell, muted when left out).

## Do's and Don'ts

### Do:
- **Do** paint the navy band under the status bar at the top of every screen, with title and one secondary line (zone guide or meta).
- **Do** route every zone use through the four roles: fill, on-fill, ink, edge.
- **Do** reuse the 7:3 cell module for anything that represents a packed item.
- **Do** keep one primary (filled navy) button per screen, in the thumb zone.
- **Do** keep stamp and reply line visible about 700ms even with reduce motion on; remove movement, not feedback.
- **Do** use tabular numerals for counts, post codes, and dates.
- **Do** verify text at 4.5:1 and boundaries at 3:1 in both light and dark before adding a colour pair.
- **Do** use the platform's own control shape (iOS segmented, Material segmented buttons) and touch minimums (44 / 48).

### Don't:
- **Don't** add chips, badges, or tags for importance; the post marker's fill already says it.
- **Don't** add a second ornament beside the post marker, or eyebrow/kicker labels above headings.
- **Don't** use zone colours for anything that is not that zone.
- **Don't** set zone fill colours as text on white; use the zone ink.
- **Don't** introduce a second typeface or let fontWeight reach a custom face without `familyFor()`.
- **Don't** use item pictograms at sizes other than 120 / 20 / 16, or mix in another icon set.
- **Don't** drift toward a grey single-tint checklist or an outdoor-brand olive/khaki/kraft palette.
