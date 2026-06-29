# Wedding invitation assets

Place your images in the folders below. Paths are configured in `src/data/invitation.js`.

| Folder / file | Purpose | Recommended photo |
|---|---|---|
| `splash/cover.jpg` | Intro splash screen | Couple cover photo, portrait 3:4–9:16 |
| `cover/hero.jpg` | Scroll hero at top | Same as splash or main wedding photo |
| `about/groom.jpg` | About Us groom card | Groom profile / half-body |
| `about/bride.jpg` | About Us bride card | Bride profile / half-body |
| `wedding-photos/*.jpg` | Gallery section | 6–20 wedding or couple photos |
| `sections/middle.jpg` | Divider between Location and D+Day | Full-body or mood shot |
| `sections/ending.jpg` | Closing section | Holding hands, back view, etc. |
| `location/map-placeholder.jpg` | (Optional) Map area | Naver/Kakao map screenshot |

Supported formats: jpg, jpeg, png, webp

After adding files, no code changes needed unless you use different filenames — then update `photoPath` / `imagePath` in `invitation.js`.
