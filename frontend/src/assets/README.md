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

## Adding photos (deploy workflow)

**로컬에서 npm 명령을 실행할 필요 없습니다.** Vercel 배포 시 자동으로 최적화됩니다.

1. 원본 사진을 위 폴더에 추가 (고화질 원본 그대로 OK)
2. Git에 커밋 후 push
3. Vercel이 빌드할 때 자동으로 WebP로 변환 후 배포

변환 결과물(`wedding-photos/optimized/`, `.optimized/`)은 빌드 시 생성되며 Git에 올리지 않아도 됩니다.

로컬에서 미리 확인하려면: `npm run dev` 전에 `npm run optimize-images` (선택 사항)
