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

### 4. Vercel 환경 변수 (백엔드 배포 후 **필수**)

> GitHub Actions로 백엔드만 배포했다고 청첩장·`/admin`이 동작하지 **않습니다.**  
> 프론트(Vercel)에 **API 주소**를 따로 넣고 **Redeploy**해야 RSVP·방명록·사진·관리자 페이지가 AWS와 연결됩니다.

#### `VITE_API_BASE_URL`에 넣을 값

**AWS CloudFormation Output의 `ApiEndpoint` 값을 그대로** 넣습니다.

형식 예시 (본인 값은 콘솔에 표시된 그대로 사용):

```
https://abc123xyz.execute-api.ap-northeast-2.amazonaws.com/prod
```

| 규칙 | 설명 |
|------|------|
| ✅ 넣을 것 | `https://`로 시작하는 **AWS API Gateway URL** |
| ✅ 끝 경로 | 반드시 **`/prod`** 포함 (SAM `StageName: prod`) |
| ❌ 넣으면 안 됨 | Vercel 청첩장 URL (`https://xxx.vercel.app`) |
| ❌ 넣으면 안 됨 | 끝에 `/` (`.../prod/`) |
| ❌ 넣으면 안 됨 | `/admin`, `/rsvp` 등 경로 추가 |

#### `ApiEndpoint` 값 찾는 방법

##### 방법 A — CloudFormation (가장 쉬움, 권장)

1. [AWS Console](https://console.aws.amazon.com) 로그인
2. 우측 상단 리전이 **`ap-northeast-2`(서울)** 인지 확인 (다른 리전이면 스택이 안 보일 수 있음)
3. 상단 검색창에 **`CloudFormation`** 입력 → **CloudFormation** 클릭
4. 스택 목록에서 **`mobile-wedding-invitation`** 클릭  
   - 없으면 GitHub **Deploy Backend** Actions가 성공했는지 확인
5. 상단 탭 **Outputs** 클릭
6. **ApiEndpoint** 행의 **Value** 열 URL 전체를 복사  
   - 예: `https://1a2b3c4d5e.execute-api.ap-northeast-2.amazonaws.com/prod`
7. 복사한 문자열을 Vercel `VITE_API_BASE_URL`에 붙여넣기

##### 방법 B — API Gateway 콘솔

1. AWS Console → 리전 **`ap-northeast-2`**
2. 검색창 **`API Gateway`** → **API Gateway** 클릭
3. 왼쪽 **API** 목록에서 HTTP API 선택 (이름에 `mobile-wedding-invitation` 또는 `HttpApi` 포함)
4. **Stages** → **`prod`** 스택 선택
5. **Invoke URL** 표시값 + 스테이지 경로 → 보통 `https://{api-id}.execute-api.ap-northeast-2.amazonaws.com/prod` 형태  
   → 이 **Invoke URL 전체**가 `ApiEndpoint`와 동일

##### 방법 C — AWS CLI

로컬 또는 [CloudShell](https://console.aws.amazon.com/cloudshell)에서:

```bash
aws cloudformation describe-stacks \
  --stack-name mobile-wedding-invitation \
  --region ap-northeast-2 \
  --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" \
  --output text
```

출력된 한 줄 URL을 그대로 `VITE_API_BASE_URL`에 사용합니다.

##### 복사한 값이 맞는지 확인

터미널에서 (URL을 본인 값으로 바꿔 실행):

```bash
curl -s "https://YOUR_API_ID.execute-api.ap-northeast-2.amazonaws.com/prod/guestbook"
```

`[]` 또는 JSON 배열/객체가 보이면 API 주소가 맞습니다.  
`<!doctype html>` 이 나오면 URL이 잘못되었거나 Vercel 주소를 넣은 경우입니다.

##### `FRONTEND_ORIGIN`(GitHub Secret) 값 찾는 방법

`VITE_API_BASE_URL`과는 **다른 값**입니다. Vercel **청첩장 사이트 주소**를 넣습니다.

1. [Vercel](https://vercel.com) → 해당 프로젝트
2. **Deployments** → **Production** 배포 클릭
3. **Domains**에 표시된 URL 복사 (예: `https://mobile-wedding-invitation.vercel.app`)
4. GitHub → 저장소 **Settings** → **Secrets and variables** → **Actions** → `FRONTEND_ORIGIN`에 붙여넣기
5. 끝에 `/` 없이, `https://` 포함한 **origin만** (경로 `/admin` 등 붙이지 않음)
6. Secret 저장 후 `backend/` 변경을 push해 백엔드를 한 번 재배포 (CORS 반영)

#### Vercel에 등록하는 방법

1. [Vercel](https://vercel.com) → 해당 프로젝트 → **Settings** → **Environment Variables**
2. 추가:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_API_BASE_URL` | 위에서 복사한 `ApiEndpoint` 전체 | **Production** (Preview도 쓰면 같이 체크) |

3. **Deployments** → 최신 배포 → **⋯** → **Redeploy**  
   (Vite는 **빌드할 때** 이 값을 코드에 박아 넣으므로, 변수만 추가하고 Redeploy 안 하면 반영되지 않음)

#### 로컬 개발용 (Vercel이 아닌 내 PC)

`frontend/.env.local` 파일:

```
VITE_API_BASE_URL=http://127.0.0.1:3000
```

(`sam local start-api` 실행 중일 때. Vite dev 서버의 `/api` 프록시를 쓰려면 `http://localhost:5173`에서 `/api`로도 가능)

#### GitHub Secret vs Vercel 변수 (헷갈리기 쉬움)

| 이름 | 설정 위치 | 역할 |
|------|-----------|------|
| `FRONTEND_ORIGIN` | **GitHub** Secrets | AWS API가 **어느 웹사이트 origin을 CORS로 허용할지** |
| `VITE_API_BASE_URL` | **Vercel** Environment Variables | 브라우저가 **어느 AWS API URL로 요청을 보낼지** |

둘 다 필요합니다. 하나만 설정하면 `/admin`에서 `Unexpected token '<'` 또는 CORS 오류가 날 수 있습니다.

### 5. 배포 트리거

`main` 브랜치에 `backend/` 또는 `.github/workflows/deploy-backend.yml` 변경을 push하면 **Deploy Backend** 워크플로가 실행됩니다.

### 6. 로컬 개발

```bash
cd backend
npm ci
sam build
sam local start-api --parameter-overrides AdminPassword=YOUR_PASSWORD
```

프론트는 `frontend/.env.local`에 `VITE_API_BASE_URL=http://127.0.0.1:3000` 설정 후 `npm run dev`. (자세한 값은 위 **§4 Vercel 환경 변수** 참고)

### 배포 체크리스트 (순서)

1. GitHub Secrets 5개 설정 (`AWS_*`, `ADMIN_PASSWORD`, `FRONTEND_ORIGIN`)
2. `main` push → **Deploy Backend** 성공
3. §4 **`ApiEndpoint` 값 찾는 방법** → CloudFormation Outputs에서 URL 복사
4. Vercel **`VITE_API_BASE_URL`** = 복사한 `ApiEndpoint` → **Redeploy**
5. 청첩장·`/admin` 동작 확인

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

### 4) 프론트 연동 (Vercel)

**반드시** §4 **Vercel 환경 변수**대로 설정합니다.

```
VITE_API_BASE_URL=https://xxxxxxxx.execute-api.ap-northeast-2.amazonaws.com/prod
```

↑ `xxxxxxxx` 부분은 본인 스택의 `ApiEndpoint`에서 확인. **Redeploy 필수.**

설정 후 청첩장에서 RSVP·방명록·사진 업로드·`/admin` 접속을 각각 한 번씩 테스트합니다.

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
| `/admin`에서 `Unexpected token '<'` / `<!doctype` JSON 오류 | **Vercel에 `VITE_API_BASE_URL` 미설정** 또는 Redeploy 안 함 → §4 참고 |
| Actions `esbuild` 오류 | `package.json`에 `esbuild`가 `dependencies`에 있는지 |
| `Duplicated values in allow-origins` | CORS origin 중복 제거 (`FrontendOrigin` 하나만) |
| `wildcards` CORS 오류 | `FRONTEND_ORIGIN`에 정확한 Vercel URL 사용 (와일드카드 불가) |
| `ROLLBACK_COMPLETE` | CloudFormation에서 스택 삭제 후 재배포 (워크플로 자동 처리 포함) |
| 프론트에서 API 실패 (CORS) | `VITE_API_BASE_URL`(Vercel) + `FRONTEND_ORIGIN`(GitHub) 둘 다 확인 |
