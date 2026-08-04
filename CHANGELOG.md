# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

### Added
- Real before/after reveal hero replacing the parallax stock photo.
- `RecentWork` section on the home page, replacing the "Fleet — Coming Soon" placeholder.
- Keyboard control (arrow keys) and visible focus ring on the before/after slider.

### Changed
- Full color palette: `slipway`/`bilge`/`chalk`/`gelcoat`/`teak`/`teak-deep` replace `navy`/`gold`.
- Typography: Archivo (variable) + Source Serif 4 replace Playfair Display + Inter.
- Services, About, and Contact pages no longer open with the repeated `hero.png` banner; sections alternate full-bleed dark/light instead.
- Home and About copy rewritten to name actual materials/processes instead of generic luxury language.
- Contact page headings and slider alt text fully localized (en/es).

### Fixed
- `FeaturedServices` "Excellence" eyebrow was hardcoded in English on the Spanish site; now localized.

### Removed
- Unused `Stats.tsx` component (numbers were unverifiable placeholders).
- `.text-gradient-gold` utility (gold accent retired from the palette).
- `PageHeader.tsx` (superseded by full-bleed section headers).
- Orphaned assets: `yateClear.png`, `yateError.png`, and the `create-next-app` boilerplate SVGs.

### Performance
- Service before/after images compressed from up to 11.4MB to under ~400KB each.
