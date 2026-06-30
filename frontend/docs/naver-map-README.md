# 오시는 길 — 네이버 지도 미리보기 설정 가이드

청첩장 **오시는 길** 섹션에 네이버 지도 화면을 넣는 방법을 정리한 문서입니다.

> **네이버지도 · 티맵 · 카카오맵** 버튼(길찾기)은 API 키 없이 동작합니다.  
> 이 문서는 **페이지 안에 보이는 지도 미리보기** 설정 방법입니다.

---

## 지도가 표시되는 우선순위

| 순위 | 조건 | 화면 |
|------|------|------|
| 1 | `src/assets/location/map-placeholder.jpg` 파일이 있음 | 업로드한 지도 **스크린샷** |
| 2 | `VITE_NAVER_MAP_CLIENT_ID` 환경 변수 설정 | **네이버 지도** (줌·드래그·마커) |
| 3 | 위 둘 다 없음 | 임시 정적 지도 + «네이버지도에서 보기» 링크 |

스크린샷이 있으면 항상 스크린샷이 먼저 표시됩니다. 인터랙티브 네이버 지도를 쓰려면 스크린샷 파일을 두지 않거나, 파일을 제거하세요.

---

## 왜 iframe embed는 쓰지 않나요?

네이버 지도의 `embed/search` URL은 **지도 타일**이 아니라 **검색 화면**(검색창·사이드 패널)을 iframe으로 띄웁니다.  
모바일 청첩장 미리보기에는 적합하지 않아, **네이버 지도 JavaScript API** 방식을 사용합니다.

---

## 방법 A — 네이버 지도 JS API (권장)

실제 네이버 지도 타일과 마커가 페이지에 표시됩니다.

### 1. NAVER Cloud에서 Application 등록

1. [NAVER Cloud Platform 콘솔](https://console.ncloud.com) 로그인
2. **Services** → **Application Services** → **Maps** 이동
3. **Application** 메뉴에서 **+ Application 등록**
4. Application 이름 입력 후 등록

### 2. Web 서비스 URL 등록

Application **인증 정보**에서 **Web 서비스 URL**을 등록합니다.

| 환경 | 등록 예시 | 주의 |
|------|-----------|------|
| 로컬 개발 | `http://localhost` | 포트 번호 **넣지 않음** (`:5173` X) |
| 로컬 (127.0.0.1 사용 시) | `http://127.0.0.1` | 위와 별도로 등록 |
| Vercel 배포 | `https://your-site.vercel.app` | `https://` 포함, 경로 없이 도메인만 |
| 커스텀 도메인 | `https://wedding.example.com` | 실제 접속 도메인과 동일하게 |

**잘못된 예**

- `http://localhost:5173` ← 포트 포함 시 인증 실패
- `https://your-site.vercel.app/` ← 끝 슬래시·경로 포함 지양

### 3. Client ID 복사

인증 정보 화면에서 **Client ID** (또는 **Client ID / ncpKeyId**) 값을 복사합니다.

### 4. 로컬 환경 변수 설정

`frontend` 폴더에 `.env.local` 파일을 만들고 아래를 추가합니다.

```bash
VITE_NAVER_MAP_CLIENT_ID=여기에_발급받은_Client_ID
```

`.env.example`을 복사해 시작해도 됩니다.

```bash
cd frontend
cp .env.example .env.local
# .env.local 에서 VITE_NAVER_MAP_CLIENT_ID 만 채우기
```

### 5. 개발 서버 재시작

환경 변수는 Vite 시작 시 읽히므로 **반드시 재시작**합니다.

```bash
cd frontend
npm run dev
```

브라우저에서 **오시는 길** 섹션까지 스크롤해 네이버 지도가 보이는지 확인합니다.

### 6. Vercel 배포

1. Vercel 프로젝트 → **Settings** → **Environment Variables**
2. 이름: `VITE_NAVER_MAP_CLIENT_ID`  
   값: 발급받은 Client ID
3. **Production** (Preview도 쓰면 같이 체크)
4. **Redeploy** (환경 변수는 빌드 시점에 박힘)

Web 서비스 URL에 **배포 도메인**이 등록되어 있어야 합니다.

---

## 방법 B — 지도 스크린샷 (API 키 없이)

API 발급 없이 네이버 지도 **모양 그대로** 보여주고 싶을 때 사용합니다.

1. [네이버 지도](https://map.naver.com)에서 예식장 검색
2. 원하는 줌·위치로 맞춘 뒤 **화면 캡처**
3. 이미지를 아래 경로에 저장

```
frontend/src/assets/location/map-placeholder.jpg
```

4. `src/data/invitation.js`의 `mapImagePath`가 아래와 같은지 확인 (기본값)

```js
mapImagePath: 'location/map-placeholder.jpg',
```

5. (선택) WebP 최적화

```bash
cd frontend
npm run optimize-images
```

스크린샷이 있으면 **방법 A보다 우선** 표시됩니다.

---

## 예식장 위치·좌표 설정

지도 중심과 마커, 길찾기 버튼 URL은 `src/data/invitation.js`의 `wedding` 객체를 사용합니다.

```js
export const wedding = {
  venue: '노블발렌티 삼성점',
  address: '서울특별시 강남구 영동대로 506',
  lat: 37.5088,   // 위도
  lng: 127.0632,  // 경도
  mapImagePath: 'location/map-placeholder.jpg',
  // ...
}
```

네이버 지도에서 장소를 우클릭하거나 상세 정보에서 **위도·경도**를 확인해 `lat` / `lng`를 수정하세요.

---

## 문제 해결

### 지도 영역이 회색이거나 «인증 실패»

| 원인 | 해결 |
|------|------|
| `VITE_NAVER_MAP_CLIENT_ID` 미설정 | `.env.local` 또는 Vercel Env에 추가 후 재시작·Redeploy |
| Web 서비스 URL 미등록 | NAVER Cloud에 현재 접속 URL의 **호스트만** 등록 |
| URL에 포트 포함 | `http://localhost:5173` 대신 `http://localhost` 등록 |
| `127.0.0.1`로 접속 | `http://127.0.0.1`도 별도 등록, 또는 `http://localhost:5173`으로 접속 |
| Vercel만 실패 | 배포 도메인이 Web 서비스 URL에 있는지, Redeploy 했는지 확인 |

브라우저 개발자 도구(F12) → **Console**에 `Naver Map authentication failed`가 보이면 대부분 URL 등록 문제입니다.

### 스크린샷 대신 네이버 지도 API를 쓰고 싶은데 스크린샷만 보임

`frontend/src/assets/location/map-placeholder.jpg`가 있으면 스크린샷이 우선입니다. 파일을 삭제하거나 `mapImagePath`를 비우면 API 지도로 전환됩니다.

### 로컬에서는 되는데 배포 후 안 됨

- Vercel에 `VITE_NAVER_MAP_CLIENT_ID` 설정 여부
- Redeploy 여부
- NAVER Cloud Web 서비스 URL에 **배포 URL** 등록 여부

### 임시 정적 지도 + «네이버지도에서 보기»만 보임

Client ID가 없거나 인증에 실패한 **폴백 화면**입니다. 방법 A를 따라 Client ID를 설정하세요.

---

## 관련 파일

| 파일 | 역할 |
|------|------|
| `src/components/LocationSection.vue` | 오시는 길 섹션 |
| `src/components/VenueMap.vue` | 지도 표시 우선순위 분기 |
| `src/components/NaverMapView.vue` | 네이버 지도 렌더링 |
| `src/composables/useNaverMapSdk.js` | 네이버 Maps SDK 로드 |
| `src/utils/mapLinks.js` | 길찾기 링크·폴백 정적 지도 URL |
| `src/data/invitation.js` | 예식장명·주소·좌표 |
| `.env.example` | 환경 변수 예시 |

---

## 요약 체크리스트

**네이버 지도 API (인터랙티브)**

- [ ] NAVER Cloud Maps Application 등록
- [ ] Web 서비스 URL: `http://localhost` + 배포 도메인
- [ ] `VITE_NAVER_MAP_CLIENT_ID` 로컬·Vercel 설정
- [ ] `map-placeholder.jpg` 없음 (API 우선 시)
- [ ] `invitation.js`의 `lat` / `lng` 확인
- [ ] dev 서버 재시작 / Vercel Redeploy

**스크린샷만 사용**

- [ ] `frontend/src/assets/location/map-placeholder.jpg` 추가
- [ ] `npm run optimize-images` (선택)
