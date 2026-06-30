<template>
  <div class="admin">
    <header class="admin__header">
      <h1 class="admin__title">관리자 대시보드</h1>
      <button v-if="authenticated" type="button" class="admin__logout" @click="logout">
        로그아웃
      </button>
    </header>

    <div v-if="!authenticated" class="admin__login">
      <p v-if="!apiConfigured" class="admin__config-warn">
        Vercel에 <code>VITE_API_BASE_URL</code>이 설정되지 않았습니다.
        AWS CloudFormation Output의 <code>ApiEndpoint</code> 값을 넣고 Redeploy한 뒤 다시 시도하세요.
      </p>
      <p class="admin__login-desc">비밀번호를 입력하세요</p>
      <form class="admin__login-form" @submit.prevent="login">
        <input
          v-model="passwordInput"
          type="password"
          class="admin__input"
          placeholder="비밀번호"
          autocomplete="current-password"
        />
        <button type="submit" class="admin__btn" :disabled="loading">
          {{ loading ? '확인 중…' : '확인' }}
        </button>
      </form>
      <p v-if="loginError" class="admin__error">{{ loginError }}</p>
    </div>

    <div v-else-if="loading" class="admin__status">데이터 불러오는 중…</div>
    <p v-else-if="loadError" class="admin__error">{{ loadError }}</p>

    <template v-else-if="data">
      <section class="admin__summary">
        <div class="admin__card">
          <h2 class="admin__card-title">RSVP</h2>
          <p class="admin__stat">전체 <strong>{{ data.summary.rsvp.total }}</strong></p>
          <p class="admin__stat admin__stat--yes">
            참석 <strong>{{ data.summary.rsvp.attending }}</strong>
          </p>
          <p class="admin__stat admin__stat--no">
            불참 <strong>{{ data.summary.rsvp.notAttending }}</strong>
          </p>
        </div>
        <div class="admin__card">
          <h2 class="admin__card-title">방명록</h2>
          <p class="admin__stat">전체 <strong>{{ data.summary.guestbook.total }}</strong></p>
        </div>
        <div class="admin__card">
          <h2 class="admin__card-title">사진</h2>
          <p class="admin__stat">신랑 <strong>{{ data.summary.photos.groom }}</strong></p>
          <p class="admin__stat">신부 <strong>{{ data.summary.photos.bride }}</strong></p>
        </div>
      </section>

      <section class="admin__section">
        <h2 class="admin__section-title">RSVP 목록</h2>
        <div v-if="data.rsvps.length === 0" class="admin__empty">등록된 RSVP가 없습니다</div>
        <div v-else class="admin__table-wrap">
          <table class="admin__table">
            <thead>
              <tr>
                <th>이름</th>
                <th>측</th>
                <th>참석</th>
                <th>제출 시각</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rsvp in data.rsvps" :key="rsvp.rsvpId">
                <td>{{ rsvp.guestName }}</td>
                <td>{{ sideLabel(rsvp.side) }}</td>
                <td>
                  <span
                    class="admin__badge"
                    :class="rsvp.attending ? 'admin__badge--yes' : 'admin__badge--no'"
                  >
                    {{ rsvp.attending ? '참석' : '불참' }}
                  </span>
                </td>
                <td>{{ formatDate(rsvp.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="admin__section">
        <h2 class="admin__section-title">방명록</h2>
        <div v-if="data.guestbook.length === 0" class="admin__empty">등록된 방명록이 없습니다</div>
        <div v-else class="admin__table-wrap">
          <table class="admin__table">
            <thead>
              <tr>
                <th>작성자</th>
                <th>메시지</th>
                <th>측</th>
                <th>작성 시각</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="msg in data.guestbook" :key="msg.messageId">
                <td>{{ msg.authorName }}</td>
                <td class="admin__message">{{ msg.message }}</td>
                <td>{{ msg.side ? sideLabel(msg.side) : '-' }}</td>
                <td>{{ formatDate(msg.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="admin__section">
        <h2 class="admin__section-title">사진</h2>
        <div class="admin__photo-tabs">
          <button
            type="button"
            class="admin__tab"
            :class="{ 'admin__tab--active': photoTab === 'groom' }"
            @click="photoTab = 'groom'"
          >
            신랑 ({{ data.photos.groom.length }})
          </button>
          <button
            type="button"
            class="admin__tab"
            :class="{ 'admin__tab--active': photoTab === 'bride' }"
            @click="photoTab = 'bride'"
          >
            신부 ({{ data.photos.bride.length }})
          </button>
        </div>
        <div v-if="currentPhotos.length === 0" class="admin__empty">업로드된 사진이 없습니다</div>
        <ul v-else class="admin__photo-grid">
          <li v-for="photo in currentPhotos" :key="photo.photoId" class="admin__photo-item">
            <img
              :src="photo.viewUrl"
              :alt="photo.fileName"
              class="admin__photo-thumb"
              loading="lazy"
            />
            <div class="admin__photo-meta">
              <p class="admin__photo-name">{{ photo.fileName }}</p>
              <p class="admin__photo-date">{{ formatDate(photo.uploadedAt) }}</p>
              <a
                :href="photo.downloadUrl"
                :download="photo.fileName"
                target="_blank"
                rel="noopener"
                class="admin__download"
              >
                원본 다운로드
              </a>
            </div>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { fetchAdminData } from '../api/admin'
import { isApiConfigured } from '../api/client'

const apiConfigured = isApiConfigured()
const STORAGE_KEY = 'adminPassword'

const authenticated = ref(false)
const passwordInput = ref('')
const storedPassword = ref('')
const loading = ref(false)
const loginError = ref('')
const loadError = ref('')
const data = ref(null)
const photoTab = ref('groom')

const currentPhotos = computed(() => {
  if (!data.value) return []
  return data.value.photos[photoTab.value] ?? []
})

function sideLabel(side) {
  return side === 'groom' ? '신랑' : '신부'
}

function formatDate(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function loadData(password) {
  loading.value = true
  loadError.value = ''
  try {
    data.value = await fetchAdminData(password)
    authenticated.value = true
    sessionStorage.setItem(STORAGE_KEY, password)
    storedPassword.value = password
  } catch (err) {
    loadError.value = err.message
    if (!authenticated.value) {
      loginError.value = err.message
    }
  } finally {
    loading.value = false
  }
}

async function login() {
  loginError.value = ''
  if (!passwordInput.value.trim()) {
    loginError.value = '비밀번호를 입력하세요'
    return
  }
  await loadData(passwordInput.value)
  if (authenticated.value) {
    passwordInput.value = ''
  }
}

function logout() {
  sessionStorage.removeItem(STORAGE_KEY)
  authenticated.value = false
  storedPassword.value = ''
  data.value = null
  passwordInput.value = ''
  loginError.value = ''
  loadError.value = ''
}

onMounted(async () => {
  const saved = sessionStorage.getItem(STORAGE_KEY)
  if (saved) {
    storedPassword.value = saved
    await loadData(saved)
    if (!data.value) {
      sessionStorage.removeItem(STORAGE_KEY)
      authenticated.value = false
    }
  }
})
</script>

<style scoped>
.admin {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  font-family: var(--font-serif, 'Noto Serif KR', Georgia, serif);
  color: var(--color-text, #4a4a4a);
  background: var(--color-bg, #fffbfc);
  min-height: 100vh;
}

.admin__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.admin__title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.admin__logout {
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
  color: var(--color-text-muted, #888);
  background: transparent;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.admin__logout:hover {
  border-color: var(--color-primary-dark, #e8899e);
  color: var(--color-primary-dark, #e8899e);
}

.admin__login {
  max-width: 320px;
  margin: 4rem auto;
  text-align: center;
}

.admin__login-desc {
  margin: 0 0 1rem;
  color: var(--color-text-muted, #888);
}

.admin__login-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.admin__input {
  padding: 0.65rem 0.85rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.admin__btn {
  padding: 0.65rem;
  font-size: 1rem;
  color: #fff;
  background: var(--color-primary-dark, #e8899e);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.admin__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.admin__error {
  margin-top: 0.75rem;
  color: #c0392b;
  font-size: 0.9rem;
}

.admin__config-warn {
  margin: 0 0 1rem;
  padding: 0.75rem 1rem;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: #8a5a00;
  background: #fff8e6;
  border: 1px solid #f0d78c;
  border-radius: 6px;
}

.admin__config-warn code {
  font-size: 0.75rem;
  background: rgba(0, 0, 0, 0.06);
  padding: 0.1em 0.35em;
  border-radius: 3px;
}

.admin__status,
.admin__empty {
  text-align: center;
  color: var(--color-text-muted, #888);
  padding: 2rem 0;
}

.admin__summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.admin__card {
  padding: 1.25rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgb(0 0 0 / 6%);
}

.admin__card-title {
  margin: 0 0 0.75rem;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--color-primary-dark, #e8899e);
}

.admin__stat {
  margin: 0.25rem 0;
  font-size: 0.95rem;
}

.admin__stat--yes strong {
  color: #27ae60;
}

.admin__stat--no strong {
  color: #c0392b;
}

.admin__section {
  margin-bottom: 2.5rem;
}

.admin__section-title {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.admin__table-wrap {
  overflow-x: auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgb(0 0 0 / 6%);
}

.admin__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.admin__table th,
.admin__table td {
  padding: 0.65rem 0.85rem;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.admin__table th {
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--color-text-muted, #888);
  background: #fafafa;
}

.admin__message {
  max-width: 280px;
  word-break: break-word;
}

.admin__badge {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  font-size: 0.8rem;
  border-radius: 4px;
}

.admin__badge--yes {
  color: #27ae60;
  background: #eafaf1;
}

.admin__badge--no {
  color: #c0392b;
  background: #fdecea;
}

.admin__photo-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.admin__tab {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  color: var(--color-text-muted, #888);
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.admin__tab--active {
  color: #fff;
  background: var(--color-primary-dark, #e8899e);
  border-color: var(--color-primary-dark, #e8899e);
}

.admin__photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.admin__photo-item {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgb(0 0 0 / 6%);
}

.admin__photo-thumb {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.admin__photo-meta {
  padding: 0.75rem;
}

.admin__photo-name {
  margin: 0 0 0.25rem;
  font-size: 0.8rem;
  word-break: break-all;
}

.admin__photo-date {
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  color: var(--color-text-muted, #888);
}

.admin__download {
  display: inline-block;
  padding: 0.35rem 0.65rem;
  font-size: 0.8rem;
  color: var(--color-primary-dark, #e8899e);
  text-decoration: none;
  border: 1px solid var(--color-primary, #f4a7b9);
  border-radius: 4px;
}

.admin__download:hover {
  background: var(--color-accent, #fff0f3);
}
</style>
