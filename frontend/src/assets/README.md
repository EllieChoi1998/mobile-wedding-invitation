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
| `location/map-placeholder.jpg` | (Optional) Map area | Venue map screenshot (지도 버튼은 API 키 없이 연동됨) |

Supported formats: jpg, jpeg, png, webp

## 오시는 길 지도

**지도 미리보기**는 아래 우선순위로 표시됩니다.

| 우선순위 | 조건 | 표시 |
|----------|------|------|
| 1 | `location/map-placeholder.jpg` 있음 | 업로드한 지도 스크린샷 |
| 2 | `VITE_NAVER_MAP_CLIENT_ID` 설정 | **네이버 지도** (줌·드래그 가능) |
| 3 | 위 없음 | 정적 지도 이미지 + «네이버지도에서 보기» 링크 |

`frontend/.env.example` 참고 — NAVER Cloud Maps Application에서 Client ID 발급 후  
Web 서비스 URL에 `http://localhost` 와 배포 도메인을 등록하세요 (포트·경로 제외).

**네이버지도 · 티맵 · 카카오맵** 버튼은 길찾기 딥링크(API 키 불필요).

## Adding photos (deploy workflow)

**로컬에서 npm 명령을 실행할 필요 없습니다.** Vercel 배포 시 자동으로 최적화됩니다.

1. 원본 사진을 위 폴더에 추가 (고화질 원본 그대로 OK)
2. Git에 커밋 후 push
3. Vercel이 빌드할 때 자동으로 WebP로 변환 후 배포

변환 결과물(`wedding-photos/optimized/`, `.optimized/`)은 빌드 시 생성되며 Git에 올리지 않아도 됩니다.

로컬에서 미리 확인하려면: `npm run dev` 전에 `npm run optimize-images` (선택 사항)
