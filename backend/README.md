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
