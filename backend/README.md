# Backend (AWS SAM)

모바일 청첩장 API — Lambda + API Gateway + DynamoDB + S3

| 구성 | 리소스 |
|------|--------|
| API | HTTP API (`/rsvp`, `/guestbook`, `/photos`, `/admin/data` 등) |
| 데이터 | DynamoDB `mobile-wedding-invitation-photos` |
| 파일 | S3 버킷 `photos/{groom\|bride}/...` |
| 배포 | GitHub Actions → `sam deploy` (`main` 브랜치, `backend/**` 변경 시) |

리전 기본값: **ap-northeast-2 (서울)**

---

## 관리자 대시보드

| 항목 | 값 |
|------|-----|
| 프론트 페이지 | `/admin` |
| API | `GET /admin/data` |
| 인증 | 요청 헤더 `X-Admin-Password` (= GitHub Secret `ADMIN_PASSWORD`) |

RSVP · 방명록 · 게스트 사진 요약을 한 번에 볼 수 있습니다.

---

## 초기 설정 (AWS + GitHub)

### 1. AWS 계정

1. [AWS Console](https://aws.amazon.com) 로그인
2. 우측 상단 리전 → **Asia Pacific (Seoul) `ap-northeast-2`**

### 2. IAM 사용자 (GitHub Actions용)

1. **IAM** → **Users** → **Create user**
2. 정책 연결 (초기): `AdministratorAccess` (운영 전 권한 축소 권장)
3. **Security credentials** → **Create access key** → Access Key ID / Secret 저장

### 3. GitHub Secrets

저장소 → **Settings** → **Secrets and variables** → **Actions**

| Secret | 예시 | 용도 |
|--------|------|------|
| `AWS_ACCESS_KEY_ID` | — | 배포 인증 |
| `AWS_SECRET_ACCESS_KEY` | — | 배포 인증 |
| `AWS_REGION` | `ap-northeast-2` | 배포 리전 |
| `ADMIN_PASSWORD` | (본인 설정) | 관리자 API·`/admin` 비밀번호 |
| `FRONTEND_ORIGIN` | `https://mobile-wedding-invitation.vercel.app` | API CORS 허용 origin (**정확한 URL**, 와일드카드 불가) |

`FRONTEND_ORIGIN`은 Vercel에 실제로 열리는 주소와 **완전히 동일**해야 합니다. 끝에 `/` 없이 입력하세요.

### 4. 배포 트리거

`main` 브랜치에 `backend/` 또는 `.github/workflows/deploy-backend.yml` 변경을 push하면 **Deploy Backend** 워크플로가 실행됩니다.

### 5. 로컬 개발

```bash
cd backend
npm ci
sam build
sam local start-api --parameter-overrides AdminPassword=YOUR_PASSWORD
```

프론트는 `frontend/.env.local`에 `VITE_API_BASE_URL=http://127.0.0.1:3000` 설정 후 `npm run dev`.

---

## 배포가 잘 됐는지 확인하는 방법

### 1) GitHub Actions

1. 저장소 → **Actions** → **Deploy Backend**
2. 최근 실행이 **초록색(성공)** 인지 확인
3. 실패 시 `SAM build` / `SAM deploy` 단계 로그 확인

### 2) AWS CloudFormation

1. AWS Console → **CloudFormation**
2. 스택 **`mobile-wedding-invitation`** 선택
3. **상태**가 `CREATE_COMPLETE` 또는 `UPDATE_COMPLETE` 인지 확인  
   - `ROLLBACK_COMPLETE`면 배포 실패 → Actions 로그 원인 수정 후 재배포 (워크플로가 실패 스택을 자동 삭제할 수 있음)

**Outputs** 탭에서 아래 값을 복사합니다.

| Output | 용도 |
|--------|------|
| `ApiEndpoint` | 프론트 `VITE_API_BASE_URL` |
| `PhotosTableName` | DynamoDB 테이블 이름 |
| `PhotosBucketName` | S3 버킷 이름 |

### 3) API 동작 테스트

`ApiEndpoint`를 `API`라고 할 때:

```bash
# 방명록 목록 (공개)
curl -s "$API/guestbook" | head

# RSVP 제출 테스트
curl -s -X POST "$API/rsvp" \
  -H "Content-Type: application/json" \
  -d '{"guestName":"테스트","side":"groom","attending":true}'

# 관리자 데이터 (비밀번호 필요)
curl -s "$API/admin/data" -H "X-Admin-Password: YOUR_PASSWORD" | head
```

JSON이 정상 반환되면 API·Lambda·DynamoDB 연동은 동작 중입니다.

### 4) 프론트 연동

Vercel **Environment Variables**:

```
VITE_API_BASE_URL=<CloudFormation Output의 ApiEndpoint>
```

설정 후 **Redeploy** → 청첩장에서 RSVP·방명록·사진 업로드·`/admin` 접속을 각각 한 번씩 테스트합니다.

### 5) CORS 문제가 날 때

브라우저 콘솔에 CORS 오류가 보이면:

- GitHub Secret `FRONTEND_ORIGIN`이 Vercel URL과 **정확히 일치**하는지 확인
- API Gateway HTTP API는 `https://*.vercel.app` 같은 **와일드카드를 지원하지 않음**
- Secret 수정 후 `backend/` 아무 파일이나 살짝 수정해 push → 재배포

---

## AWS에서 데이터 확인하는 방법

### 방법 A — 프론트 관리자 페이지 (권장)

1. Vercel 청첩장 URL + `/admin` 접속
2. `ADMIN_PASSWORD` 입력
3. RSVP · 방명록 · 사진 목록·집계 확인

### 방법 B — DynamoDB 콘솔

1. **DynamoDB** → **Tables** → `mobile-wedding-invitation-photos`
2. **Explore table items**

| PK | 저장 내용 | SK 접두사 |
|----|-----------|-----------|
| `SIDE#groom` | 신랑 측 RSVP·사진 | `RSVP#`, `PHOTO#` |
| `SIDE#bride` | 신부 측 RSVP·사진 | `RSVP#`, `PHOTO#` |
| `GUESTBOOK` | 방명록 | `MSG#` |

### 방법 C — S3 콘솔

1. **S3** → CloudFormation Output의 버킷 이름 선택
2. **`photos/`** prefix 아래에 게스트 업로드 이미지 확인  
   - 경로 예: `photos/groom/{uuid}-filename.jpg`

### 방법 D — Lambda 로그

1. **CloudWatch** → **Log groups**
2. `/aws/lambda/mobile-wedding-invitation-*` 그룹에서 최근 로그 확인 (에러 디버깅용)

---

## 배포 후 데이터 초기화 (하객 전달 전 테스트 데이터 삭제)

DB를 두 개 두지 않고, **같은 DynamoDB·S3에서 테스트 데이터만 비우는** 방식입니다.  
친구·가족에게 테스트 → **청첩장 공유 직전** 한 번 초기화 → 실제 하객 데이터만 쌓입니다.

> **주의:** 삭제는 되돌릴 수 없습니다. 초기화 전 `/admin`에서 백업이 필요하면 스크린샷·CSV 등을 따로 저장하세요.

### 초기화 대상

| 저장소 | 삭제 범위 |
|--------|-----------|
| DynamoDB | `SIDE#groom`, `SIDE#bride`, `GUESTBOOK` 파티션의 모든 항목 |
| S3 | 버킷 내 `photos/` prefix 전체 |

### 방법 1 — AWS 콘솔 (소량·수동)

**DynamoDB**

1. 테이블 → **Explore table items**
2. PK가 `SIDE#groom`, `SIDE#bride`, `GUESTBOOK`인 항목을 선택 후 삭제  
   (항목이 많으면 방법 2 CLI 권장)

**S3**

1. 버킷 → `photos/` 폴더
2. 객체 전체 선택 → **Delete**

### 방법 2 — AWS CLI (권장, 일괄 삭제)

로컬 또는 CloudShell에서 AWS CLI 로그인 후:

```bash
# CloudFormation Output 값으로 설정
export AWS_REGION=ap-northeast-2
export TABLE_NAME=mobile-wedding-invitation-photos   # Output: PhotosTableName
export BUCKET_NAME=your-photos-bucket-name           # Output: PhotosBucketName
```

**S3 사진 삭제**

```bash
aws s3 rm "s3://${BUCKET_NAME}/photos/" --recursive --region "$AWS_REGION"
```

**DynamoDB 항목 삭제** (PK별 Query 후 BatchWriteItem)

아래 스크립트는 테이블의 RSVP·방명록·사진 메타데이터를 모두 삭제합니다.

```bash
for PK in "SIDE#groom" "SIDE#bride" "GUESTBOOK"; do
  echo "Deleting PK=${PK}..."
  aws dynamodb query \
    --table-name "$TABLE_NAME" \
    --key-condition-expression "PK = :pk" \
    --expression-attribute-values "{\":pk\":{\"S\":\"${PK}\"}}" \
    --projection-expression "PK, SK" \
    --region "$AWS_REGION" \
    --output json \
  | jq -c '.Items[]' \
  | while read -r item; do
      aws dynamodb delete-item \
        --table-name "$TABLE_NAME" \
        --key "$item" \
        --region "$AWS_REGION"
    done
done
echo "Done."
```

(`jq`가 없으면 DynamoDB 콘솔 **PartiQL** 또는 콘솔 수동 삭제 사용)

### 초기화 후 확인

1. `/admin` → RSVP·방명록·사진 **0건** 인지 확인
2. S3 `photos/` prefix가 비었는지 확인
3. 청첩장에서 RSVP·방명록·사진 업로드를 다시 한 번 테스트

### 운영 팁

- **테스트 기간:** 지인에게만 URL 공유
- **본 공유 직전:** 위 방법으로 초기화 1회
- **예식 이후:** 초기화하지 않음 (축하 메시지·RSVP·사진 보관)

향후 `POST /admin/reset` 같은 관리자 전용 API를 추가하면, 콘솔/CLI 없이 버튼 한 번으로 초기화할 수 있습니다.

---

## API 엔드포인트 요약

| Method | Path | 설명 |
|--------|------|------|
| `POST` | `/rsvp` | RSVP 제출 |
| `POST` | `/guestbook` | 방명록 작성 |
| `GET` | `/guestbook` | 방명록 목록 |
| `POST` | `/photos/presign` | 사진 업로드용 presigned URL |
| `GET` | `/photos?side=groom\|bride` | 사진 목록 |
| `GET` | `/admin/data` | 관리자 통합 조회 (비밀번호 필요) |

---

## 트러블슈팅

| 증상 | 확인 사항 |
|------|-----------|
| Actions `esbuild` 오류 | `package.json`에 `esbuild`가 `dependencies`에 있는지 |
| `Duplicated values in allow-origins` | CORS origin 중복 제거 (`FrontendOrigin` 하나만) |
| `wildcards` CORS 오류 | `FRONTEND_ORIGIN`에 정확한 Vercel URL 사용 (와일드카드 불가) |
| `ROLLBACK_COMPLETE` | CloudFormation에서 스택 삭제 후 재배포 (워크플로 자동 처리 포함) |
| 프론트에서 API 실패 | `VITE_API_BASE_URL`, `FRONTEND_ORIGIN` 일치 여부 |
