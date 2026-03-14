# Figma Design Spec — Anton Putintsev CV Profile
> Snapshot: About tab active, desktop (≥ 900 px wide)

---

## 1. Design Tokens (quick reference)

### Colors
| Token | Hex / Value | Usage |
|---|---|---|
| `bg` | `#f5f5f7` | Page background |
| `surface` | `#ffffff` | Cards, nav buttons, social icons |
| `text-primary` | `#1d1d1f` | Headings, body emphasis |
| `text-secondary` | `#6e6e73` | Body text, subtitles |
| `text-tertiary` | `#86868b` | Captions, metadata, placeholders |
| `accent` | `#0071e3` | Links, active states, explainer border |
| `border` | `rgba(0, 0, 0, 0.08)` | Dividers, card borders |

### Shadows
| Token | Value |
|---|---|
| `shadow-sm` | `0 1px 4px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)` |
| `shadow-md` | `0 6px 24px rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.08)` |

### Border Radii
| Token | Value | Usage |
|---|---|---|
| `radius-card` | `14 px` | Cards, avatar, modal panels |
| `radius-button` | `8 px` | Tab buttons, social icon containers |
| `radius-input` | `10 px` | Form inputs |
| `radius-pill` | `980 px` | Badges, submit button, skill tags |

### Typography
| Token | Size (px) | Weight | Case / Tracking |
|---|---|---|---|
| `header-name` | 30 | 700 | −0.03 em |
| `section-title` | 22 | 700 | −0.03 em |
| `body` | 14 | 400 | — |
| `body-sm` | 13 | 400 | — |
| `caption` | 12 | 400 | — |
| `label` | 11 | 600 | UPPERCASE · +0.09 em |
| `micro` | 10 | 600 | UPPERCASE · +0.09 em |

Font stack: **SF Pro Display / SF Pro Text** → Helvetica Neue → Arial
Use **Inter** as the Figma substitute (closest match).

### Spacing scale (used values)
`2 · 4 · 8 · 12 · 16 · 20 · 24 · 28 · 32 · 40 · 48 · 80` px
Sidebar gap: `clamp(2rem, 4vw, 4rem)` → target **48 px** at typical desktop width.

---

## 2. Page Layout

```
┌──────────────────────────── viewport ────────────────────────────┐
│                                                                   │
│  ┌─────────────────────── Header (sticky) ─────────────────────┐ │
│  │  [Avatar]  Name · Title · Meta · [Social Icons]             │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌── Sidebar ──┐  ┌──────────── Main content (max 660 px) ─────┐ │
│  │  About      │  │  Section Title                             │ │
│  │  Experience │  │  About paragraph                           │ │
│  │  …          │  │  Education cards                           │ │
│  └─────────────┘  │  Recognition card                          │ │
│                   └────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
```

| Region | Width | Notes |
|---|---|---|
| Outer max-width | 900 px | Centred with `auto` side margins |
| Sidebar | clamp(120, 14 vw, 160) px → **140 px** | Sticky top 40 px |
| Main content | flex: 1, max-width 660 px | Fluid |
| Column gap | ~48 px | `clamp(2rem, 4vw, 4rem)` |
| Outer padding | top 40 px · sides ~32 px · bottom 80 px | |

---

## 3. Component Breakdown

### 3.1 Header
- **Container:** full-width, `background: rgba(255,255,255,0.88)`, `backdrop-filter: blur(20px)`, bottom border `1px solid border-token`
- **Inner row:** max-width 900 px, flex, `align-items: stretch`, gap 24 px, padding 40 px 24 px

#### Avatar
| Property | Value |
|---|---|
| Width | 96 px |
| Height | Stretches to match sibling column height (~116 px with 4 social links) |
| Border radius | 14 px |
| Object fit | Cover |
| Shadow | shadow-sm |
| Interaction | Cursor zoom-in; click → full-screen lightbox |

#### Name block (right column)
| Element | Style |
|---|---|
| Name "Anton Putintsev, PhD" | 30 px · 700 · −0.03 em · `text-primary` |
| Title line | 14 px · 400 · `text-secondary` · margin-top 4 px |
| Meta line (location · languages) | 14 px · 400 · `text-tertiary` · margin-top 2 px |
| Social icons row | flex · gap 12 px · margin-top 12 px |

#### Social icon button (×4)
| Property | Value |
|---|---|
| Size | 32 × 32 px |
| Border radius | 8 px |
| Background | `surface` (#fff) |
| Shadow | shadow-sm |
| Icon image | 20 × 20 px, object-fit contain |
| Hover | scale(1.12) · shadow-md · transition 150 ms ease |
| Order | LinkedIn → Facebook → Telegram → Email |

---

### 3.2 Sidebar Navigation
- **Container:** flex column · gap 2.4 px · sticky top 40 px
- **Width:** 140 px (clamped)

#### Tab button
| State | Background | Text colour | Weight |
|---|---|---|---|
| Default | transparent | `text-secondary` | 400 |
| Hover | `rgba(0,0,0,0.05)` | `text-primary` | 400 |
| Active | `rgba(0,0,0,0.07)` | `text-primary` | 600 |

- Padding: 7 px 12 px · font-size 14 px · border-radius 8 px · full width · left-aligned text
- Tab labels: About · Experience · Publications · Timeline · Skills · Projects · In the Media · Contact

---

### 3.3 About Section (main content)

#### Section title "About"
- 22 px · 700 · −0.03 em · `text-primary` · margin-bottom 20 px

#### About paragraph
- 14 px · 400 · `text-secondary` · line-height 1.625 · max-width 60 ch (~480 px)

---

#### Subsection label (reusable)
Used for "EDUCATION" and "FUNDING & RECOGNITION":
- 11 px · 600 · UPPERCASE · letter-spacing +0.09 em · `text-tertiary`
- margin-top 32 px · margin-bottom 12 px

---

#### Education card (×3)
- **Container:** surface bg · 14 px radius · shadow-sm · padding 17 px 22 px
- **Layout:** flex row · space-between · align-items flex-start · gap 16 px · flex-wrap

| Column | Element | Style |
|---|---|---|
| Left | Degree | 14 px · 600 · `text-primary` |
| Left | Institution · Note | 13 px · 400 · `text-secondary` · margin-top 2 px |
| Right | Period | 13 px · 400 · `text-tertiary` · text-align right |
| Right | Location | 12 px · 400 · `text-tertiary` |

Content:
1. PhD, Physics · Skoltech · Nov 2022 · Moscow, Russia · 2018–2022
2. MS, Physics / Astrophysics · Lomonosov MSU · Grad. June 2018 · Moscow, Russia
3. Research Internship · Tohoku University · Jul–Aug 2016 · Sendai, Japan

---

#### Recognition card
- **Container:** surface bg · 14 px radius · shadow-sm · padding 20 px 24 px

#### Recognition row (×4, inside card)
- flex · space-between · align-items baseline · gap 16 px · padding 11 px 0
- border-bottom `1px solid border-token` (last row: no border)

| Column | Style |
|---|---|
| Title (left) | 14 px · 400 · `text-primary` |
| Year (right) | 13 px · 400 · `text-tertiary` · white-space nowrap |

Content:
1. Principal Investigator, Russian Science Foundation Grant ($40K) · 2025
2. Co-Investigator, Russian Science Foundation Grant ($300K) · 2023–2026
3. "Young Scientist" Award, Sintez · 2021
4. Invited Speaker, Global Young Scientists Summit, Singapore · 2020

---

## 4. Responsive breakpoints

| Breakpoint | Behaviour |
|---|---|
| ≥ 601 px | Two-column layout (sidebar + main). Sidebar sticky. |
| ≤ 600 px | Sidebar becomes horizontal scrollable tab bar at top. Full-width main. |
| Header | Stays single-row at all sizes; social icons wrap if needed. |

---

## 5. Figma Build Order (recommended)

1. **Styles / Variables** — load `figma-tokens.json` via Token Studio plugin
2. **Icons** — import `assets/{linkedin,facebook,telegram,mail}.png` as image fills
3. **Base components:** Tag/Badge · Subsection Label · Social Icon Button · Tab Button
4. **Cards:** Education Card · Recognition Row → Recognition Card
5. **Sidebar** (composed of Tab Buttons)
6. **Header** (Avatar + Name Block + Social Icons)
7. **About Section** (Section Title + Paragraph + Subsection Labels + Card stack)
8. **Page Frame** (Header / Sidebar / About Section / Footer)
