# Backend (AWS SAM)

## Admin dashboard

Admin API: `GET /admin/data` (header: `X-Admin-Password`)

Frontend admin page: `/admin`

### Deployment

Set GitHub Secret `ADMIN_PASSWORD` (e.g. `100498`) before deploying. The deploy workflow passes it as `AdminPassword` to SAM.

### Local development

```bash
sam build
sam local start-api --parameter-overrides AdminPassword=100498
```

Then open `http://localhost:5173/admin` with the frontend dev server running.


# How to Setup Serveless Backend Architecture with AWS ?
Part 1. 백엔드 설정 (AWS + GitHub)
1단계: AWS 계정 준비
https://aws.amazon.com → Sign In to the Console
우측 상단 리전을 Asia Pacific (Seoul) ap-northeast-2 로 선택
(프로젝트 samconfig.toml.example도 이 리전 기준)
2단계: IAM 사용자 생성 (GitHub Actions용)
GitHub Actions가 AWS에 배포하려면 Access Key가 필요합니다.

콘솔 경로
AWS Console 검색창 → IAM 입력 → IAM 클릭
왼쪽 Users → Create user
User name: github-wedding-deploy (아무 이름 가능)
Next
Attach policies directly 선택
정책 선택 (초기엔 아래 중 하나):
간단(개발용): AdministratorAccess
→ 첫 배포·디버깅에 편함. 나중에 권한 축소 권장
최소 권한(권장): CloudFormation, S3, Lambda, DynamoDB, IAM, API Gateway, Logs 관련 정책을 묶은 커스텀 정책
Next → Create user
생성된 사용자 클릭 → Security credentials 탭
Access keys → Create access key
Use case: Application running outside AWS (또는 Third-party service)
Create access key
Access key ID, Secret access key 복사 후 안전한 곳에 저장
(Secret은 이 화면을 닫으면 다시 볼 수 없음)
3단계: GitHub Secrets 등록
저장소: EllieChoi1998/mobile-wedding-invitation (plan 기준)

경로
GitHub 저장소 → Settings
왼쪽 Secrets and variables → Actions
New repository secret 클릭 후 아래 4개 등록
Secret 이름	값	용도
AWS_ACCESS_KEY_ID
IAM Access Key ID
배포 인증
AWS_SECRET_ACCESS_KEY
IAM Secret Key
배포 인증
AWS_REGION
ap-northeast-2
리전
ADMIN_PASSWORD
예: 100498
FRONTEND_ORIGIN = https://mobile-wedding-invitation.vercel.app
관리자 페이지 비밀번호
ADMIN_PASSWORD는 백엔드 AdminPassword 파라미터로 들어가며, 관리자 API X-Admin-Password 헤더와 일치해야 합니다.Part 1. 백엔드 설정 (AWS + GitHub)
1단계: AWS 계정 준비
https://aws.amazon.com → Sign In to the Console
우측 상단 리전을 Asia Pacific (Seoul) ap-northeast-2 로 선택
(프로젝트 samconfig.toml.example도 이 리전 기준)
2단계: IAM 사용자 생성 (GitHub Actions용)
GitHub Actions가 AWS에 배포하려면 Access Key가 필요합니다.

콘솔 경로
AWS Console 검색창 → IAM 입력 → IAM 클릭
왼쪽 Users → Create user
User name: github-wedding-deploy (아무 이름 가능)
Next
Attach policies directly 선택
정책 선택 (초기엔 아래 중 하나):
간단(개발용): AdministratorAccess
→ 첫 배포·디버깅에 편함. 나중에 권한 축소 권장
최소 권한(권장): CloudFormation, S3, Lambda, DynamoDB, IAM, API Gateway, Logs 관련 정책을 묶은 커스텀 정책
Next → Create user
생성된 사용자 클릭 → Security credentials 탭
Access keys → Create access key
Use case: Application running outside AWS (또는 Third-party service)
Create access key
Access key ID, Secret access key 복사 후 안전한 곳에 저장
(Secret은 이 화면을 닫으면 다시 볼 수 없음)
3단계: GitHub Secrets 등록
저장소: EllieChoi1998/mobile-wedding-invitation (plan 기준)

경로
GitHub 저장소 → Settings
왼쪽 Secrets and variables → Actions
New repository secret 클릭 후 아래 4개 등록
Secret 이름	값	용도
AWS_ACCESS_KEY_ID
IAM Access Key ID
배포 인증
AWS_SECRET_ACCESS_KEY
IAM Secret Key
배포 인증
AWS_REGION
ap-northeast-2
리전
ADMIN_PASSWORD
예: 1234
관리자 페이지 비밀번호
ADMIN_PASSWORD는 백엔드 AdminPassword 파라미터로 들어가며, 관리자 API X-Admin-Password 헤더와 일치해야 합니다.