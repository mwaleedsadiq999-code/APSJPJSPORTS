# APS JPJ Cricket Club

Official website for APS JPJ Cricket Club (Jalal Pur Jattan Campus) —
squad roster, team leaders and season numbers.

Built with React 18 + Vite and plain CSS. No CSS framework.

## Getting started

```bash
npm install
npm run dev      # dev server
npm run build    # production build → dist/
npm run preview  # serve the production build
```

## Editing the club

**All content is in one file: `src/data/team.js`.**

Change any name, role, discipline or photo there and the whole site updates.

```js
export const squad = [
  { number: '01', name: 'Umer Shabir', role: 'Captain', discipline: 'Batsman', style: 'Right hand · Off spin' },
  // ...
]
```

| Field | What it controls |
|---|---|
| `number` | The big index shown top-left of the card |
| `name` | Player's display name |
| `role` | `Player`, `Captain` or `Vice Captain` — drives the badge |
| `discipline` | `Batsman`, `Bowler`, `All-rounder` or `Wicketkeeper` — must match a filter in `Squad.jsx` |
| `style` | Small line under the name, e.g. "Right arm fast" |

### Adding or removing a player

Add or delete a line in the `squad` array. The grid, the filters and the
"Squad members" stat all follow it — the stat is derived from `squad.length`,
so it can never drift out of sync with the roster.

The match and win counts live in `seasonStats` and are the only numbers you
update by hand.

### Swapping a photo

Drop the new image into `public/assets/`, then point the field at it:

```js
photo: '/assets/my-photo.jpg'
```

## Project structure

```
public/assets/
  aps-logo.jpg    Club crest — navbar, footer, favicon
  captains.jpg    Captain & vice captain portrait (split across the two leader cards)
  team.png        Full squad group photo
raw/
  captains.png    Full-size original (not deployed — keeps the build small)
src/
  components/
    Navbar.jsx      Sticky header + mobile menu
    Hero.jsx        "Meet the Squad" intro + captain photo
    Squad.jsx       Roster grid with role filters
    ClubPhoto.jsx   Full squad photo, below the roster
    Leaders.jsx     "Two Leaders. One Vision." + the shared-responsibility quote
    Stats.jsx       Season numbers band
    Support.jsx     Claret call-to-action
    Footer.jsx      Campus details
  data/team.js      ← ALL content lives here
  lib/assets.js     Resolves /public files against the Vite base
  styles/global.css Design tokens + all component styles
```

## Design tokens

Colours and radii live as CSS custom properties at the top of
`src/styles/global.css`:

```css
--paper:  #f7f4ed;   /* bone paper — page ground */
--card:   #fffdf9;   /* squad card surface */
--ink:    #1a1813;   /* primary text — 16.1:1 on paper */
--muted:  #5c594d;   /* secondary text — 6.4:1 on paper */
--muted-2:#6e6a5c;   /* small labels — 4.9:1 on paper */
--claret: #9c2c25;   /* the single accent colour */
--cream-2:#a9a594;   /* muted text on the dark footer — 7.4:1 */
--r-ui:   2px;       /* buttons, badges, pills */
--r-media:14px;      /* photo frames, leader cards */
```

Radii follow two rules: **2px for anything you can click**, **14px for
photo frames**. Squad cards are deliberately square because they read as
cells in one continuous panel.

All text/background pairs meet WCAG AA (lowest is `--muted-2` at 4.9:1).
Headings and numerals use Instrument Serif; everything else is Inter.
Both are loaded from Google Fonts in `index.html`.

## Editor support

`jsconfig.json` enables VS Code's built-in JavaScript checking — undefined
variables and bad imports show as red squiggles with no extension required.
