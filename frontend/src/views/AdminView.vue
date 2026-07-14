<template>
  <div class="admin" :class="{ 'admin--delete-mode': deleteMode }">
    <header class="admin__header">
      <h1 class="admin__title">관리자 대시보드</h1>
      <div v-if="authenticated && data" class="admin__header-actions">
        <button
          v-if="!deleteMode"
          type="button"
          class="admin__mode-btn"
          @click="enterDeleteMode"
        >
          데이터 삭제
        </button>
        <button
          v-else
          type="button"
          class="admin__mode-btn admin__mode-btn--cancel"
          @click="exitDeleteMode"
        >
          삭제 취소
        </button>
        <button type="button" class="admin__logout" @click="logout">
          로그아웃
        </button>
      </div>
      <button v-else-if="authenticated" type="button" class="admin__logout" @click="logout">
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
      <p v-if="deleteMode" class="admin__delete-hint">
        삭제할 항목을 선택한 뒤, 하단에서 삭제 비밀번호를 입력하세요.
      </p>

      <section class="admin__filters">
        <p class="admin__filters-label">측 필터</p>
        <div class="admin__filter-tabs" role="group" aria-label="신랑측 / 신부측 필터">
          <button
            type="button"
            class="admin__filter-tab"
            :class="{ 'admin__filter-tab--active': sideFilter === 'all' }"
            @click="sideFilter = 'all'"
          >
            전체
          </button>
          <button
            type="button"
            class="admin__filter-tab"
            :class="{ 'admin__filter-tab--active': sideFilter === 'groom' }"
            @click="setSideFilter('groom')"
          >
            신랑측
          </button>
          <button
            type="button"
            class="admin__filter-tab"
            :class="{ 'admin__filter-tab--active': sideFilter === 'bride' }"
            @click="setSideFilter('bride')"
          >
            신부측
          </button>
        </div>
      </section>

      <section class="admin__summary">
        <div class="admin__card">
          <h2 class="admin__card-title">RSVP</h2>
          <p class="admin__stat">전체 <strong>{{ filteredRsvpSummary.total }}</strong></p>
          <p class="admin__stat admin__stat--yes">
            참석 <strong>{{ filteredRsvpSummary.attending }}</strong>
          </p>
          <p class="admin__stat admin__stat--no">
            불참 <strong>{{ filteredRsvpSummary.notAttending }}</strong>
          </p>
        </div>
        <div class="admin__card">
          <h2 class="admin__card-title">방명록</h2>
          <p class="admin__stat">전체 <strong>{{ filteredGuestbookBySide.length }}</strong></p>
        </div>
        <div class="admin__card">
          <h2 class="admin__card-title">사진</h2>
          <p v-if="sideFilter === 'all' || sideFilter === 'groom'" class="admin__stat">
            신랑 <strong>{{ data.summary.photos.groom }}</strong>
          </p>
          <p v-if="sideFilter === 'all' || sideFilter === 'bride'" class="admin__stat">
            신부 <strong>{{ data.summary.photos.bride }}</strong>
          </p>
        </div>
      </section>

      <section class="admin__section admin__settings">
        <h2 class="admin__section-title">설정</h2>
        <div class="admin__settings-card">
          <div class="admin__settings-row">
            <div>
              <p class="admin__settings-label">게스트 사진 업로드</p>
              <p class="admin__settings-desc">
                {{ data.settings.photoUploadOpen ? '하객이 사진을 업로드할 수 있습니다.' : '업로드가 차단되어 있습니다.' }}
              </p>
            </div>
            <button
              type="button"
              class="admin__toggle"
              :class="{ 'admin__toggle--on': data.settings.photoUploadOpen }"
              :disabled="settingsUpdating"
              @click="toggleSetting('photoUploadOpen')"
            >
              {{ settingsUpdating ? '…' : data.settings.photoUploadOpen ? '허용 중' : '차단 중' }}
            </button>
          </div>
          <div class="admin__settings-row">
            <div>
              <p class="admin__settings-label">방명록 작성</p>
              <p class="admin__settings-desc">
                {{ data.settings.guestbookOpen ? '하객이 방명록을 작성할 수 있습니다.' : '작성이 차단되어 있습니다.' }}
              </p>
            </div>
            <button
              type="button"
              class="admin__toggle"
              :class="{ 'admin__toggle--on': data.settings.guestbookOpen }"
              :disabled="settingsUpdating"
              @click="toggleSetting('guestbookOpen')"
            >
              {{ settingsUpdating ? '…' : data.settings.guestbookOpen ? '허용 중' : '차단 중' }}
            </button>
          </div>
          <div class="admin__settings-row">
            <div>
              <p class="admin__settings-label">RSVP 참석 의사</p>
              <p class="admin__settings-desc">
                {{ data.settings.rsvpOpen ? '하객이 참석 의사를 전달할 수 있습니다.' : '전달이 차단되어 있습니다.' }}
              </p>
            </div>
            <button
              type="button"
              class="admin__toggle"
              :class="{ 'admin__toggle--on': data.settings.rsvpOpen }"
              :disabled="settingsUpdating"
              @click="toggleSetting('rsvpOpen')"
            >
              {{ settingsUpdating ? '…' : data.settings.rsvpOpen ? '허용 중' : '차단 중' }}
            </button>
          </div>
          <p v-if="settingsError" class="admin__error">{{ settingsError }}</p>
        </div>
      </section>

      <section class="admin__section">
        <div class="admin__section-head">
          <h2 class="admin__section-title">
            RSVP 목록
            <span class="admin__count">({{ filteredRsvps.length }})</span>
          </h2>
          <div class="admin__section-actions">
            <button
              v-if="!deleteMode"
              type="button"
              class="admin__bulk-btn admin__bulk-btn--primary"
              :disabled="filteredRsvps.length === 0"
              @click="downloadRsvpExcel"
            >
              엑셀 다운로드
            </button>
            <template v-if="deleteMode && filteredRsvps.length > 0">
              <button type="button" class="admin__bulk-btn" @click="selectAllRsvps">
                전체 선택
              </button>
              <button type="button" class="admin__bulk-btn" @click="deselectAllRsvps">
                선택 해제
              </button>
            </template>
          </div>
        </div>
        <div class="admin__toolbar">
          <input
            v-model="rsvpSearch"
            type="search"
            class="admin__search"
            placeholder="참석자 이름 검색"
            aria-label="참석자 이름 검색"
          />
          <label class="admin__dup-toggle">
            <input v-model="rsvpDuplicatesOnly" type="checkbox" />
            중복 이름만 보기
            <span v-if="duplicateRsvpCount > 0" class="admin__dup-count">
              ({{ duplicateRsvpCount }})
            </span>
          </label>
        </div>
        <div v-if="data.rsvps.length === 0" class="admin__empty">등록된 RSVP가 없습니다</div>
        <div v-else-if="filteredRsvps.length === 0" class="admin__empty">
          조건에 맞는 RSVP가 없습니다
        </div>
        <div v-else class="admin__table-wrap">
          <table class="admin__table">
            <thead>
              <tr>
                <th v-if="deleteMode" class="admin__check-col">
                  <input
                    type="checkbox"
                    :checked="allRsvpsSelected"
                    aria-label="RSVP 전체 선택"
                    @change="toggleAllRsvps"
                  />
                </th>
                <th>이름</th>
                <th>측</th>
                <th>참석</th>
                <th>제출 시각</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="rsvp in filteredRsvps"
                :key="rsvp.rsvpId"
                :class="{
                  'admin__row--selected': isSelected('rsvp', rsvp.rsvpId, rsvp.side),
                  'admin__row--duplicate': duplicateRsvpIds.has(rsvp.rsvpId),
                }"
                @click="deleteMode && toggleSelect({ resource: 'rsvp', id: rsvp.rsvpId, side: rsvp.side })"
              >
                <td v-if="deleteMode" class="admin__check-col" @click.stop>
                  <input
                    type="checkbox"
                    :checked="isSelected('rsvp', rsvp.rsvpId, rsvp.side)"
                    @change="toggleSelect({ resource: 'rsvp', id: rsvp.rsvpId, side: rsvp.side })"
                  />
                </td>
                <td>
                  {{ rsvp.guestName }}
                  <span
                    v-if="duplicateRsvpIds.has(rsvp.rsvpId)"
                    class="admin__dup-badge"
                    title="동일 측에서 중복된 이름이 포함된 항목"
                  >
                    중복
                  </span>
                </td>
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
        <div class="admin__section-head">
          <h2 class="admin__section-title">
            방명록
            <span class="admin__count">({{ filteredGuestbook.length }})</span>
          </h2>
          <div v-if="deleteMode && filteredGuestbook.length > 0" class="admin__section-actions">
            <button type="button" class="admin__bulk-btn" @click="selectAllGuestbook">
              전체 선택
            </button>
            <button type="button" class="admin__bulk-btn" @click="deselectAllGuestbook">
              선택 해제
            </button>
          </div>
        </div>
        <div class="admin__toolbar">
          <input
            v-model="guestbookSearch"
            type="search"
            class="admin__search"
            placeholder="작성자 이름 검색"
            aria-label="작성자 이름 검색"
          />
        </div>
        <div v-if="data.guestbook.length === 0" class="admin__empty">등록된 방명록이 없습니다</div>
        <div v-else-if="filteredGuestbook.length === 0" class="admin__empty">
          조건에 맞는 방명록이 없습니다
        </div>
        <div v-else class="admin__table-wrap">
          <table class="admin__table">
            <thead>
              <tr>
                <th v-if="deleteMode" class="admin__check-col">
                  <input
                    type="checkbox"
                    :checked="allGuestbookSelected"
                    aria-label="방명록 전체 선택"
                    @change="toggleAllGuestbook"
                  />
                </th>
                <th>작성자</th>
                <th>메시지</th>
                <th>측</th>
                <th>작성 시각</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="msg in filteredGuestbook"
                :key="msg.messageId"
                :class="{ 'admin__row--selected': isSelected('guestbook', msg.messageId) }"
                @click="deleteMode && toggleSelect({ resource: 'guestbook', id: msg.messageId })"
              >
                <td v-if="deleteMode" class="admin__check-col" @click.stop>
                  <input
                    type="checkbox"
                    :checked="isSelected('guestbook', msg.messageId)"
                    @change="toggleSelect({ resource: 'guestbook', id: msg.messageId })"
                  />
                </td>
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
        <div class="admin__section-head">
          <h2 class="admin__section-title">사진</h2>
          <div v-if="!deleteMode && currentPhotos.length > 0" class="admin__section-actions">
            <button type="button" class="admin__bulk-btn" @click="selectAllCurrentTabPhotosForDownload">
              탭 전체 선택
            </button>
            <button type="button" class="admin__bulk-btn" @click="selectAllPhotosForDownload">
              전체 선택
            </button>
            <button
              type="button"
              class="admin__bulk-btn"
              :disabled="photoDownloadCount === 0"
              @click="clearPhotoDownloadSelection"
            >
              선택 해제
            </button>
            <button
              type="button"
              class="admin__bulk-btn admin__bulk-btn--primary"
              :disabled="photoDownloadCount === 0 || photoDownloading"
              @click="downloadSelectedPhotos"
            >
              {{ photoDownloading ? '다운로드 중…' : `선택 다운로드 (${photoDownloadCount})` }}
            </button>
          </div>
          <div v-else-if="deleteMode && currentPhotos.length > 0" class="admin__section-actions">
            <button type="button" class="admin__bulk-btn" @click="selectAllCurrentTabPhotosForDelete">
              탭 전체 선택
            </button>
            <button type="button" class="admin__bulk-btn" @click="selectAllPhotosForDelete">
              전체 선택
            </button>
            <button type="button" class="admin__bulk-btn" @click="deselectAllCurrentTabPhotosForDelete">
              선택 해제
            </button>
          </div>
        </div>
        <div class="admin__photo-tabs">
          <button
            v-if="sideFilter === 'all' || sideFilter === 'groom'"
            type="button"
            class="admin__tab"
            :class="{ 'admin__tab--active': photoTab === 'groom' }"
            @click="photoTab = 'groom'"
          >
            신랑 ({{ data.photos.groom.length }})
          </button>
          <button
            v-if="sideFilter === 'all' || sideFilter === 'bride'"
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
          <li
            v-for="photo in currentPhotos"
            :key="photo.photoId"
            class="admin__photo-item"
            :class="{
              'admin__photo-item--selected': deleteMode
                ? isSelected('photo', photo.photoId, photoTab)
                : isPhotoDownloadSelected(photo.photoId, photoTab),
            }"
            @click="onPhotoItemClick(photo)"
          >
            <label v-if="deleteMode" class="admin__photo-check" @click.stop>
              <input
                type="checkbox"
                :checked="isSelected('photo', photo.photoId, photoTab)"
                @change="toggleSelect({ resource: 'photo', id: photo.photoId, side: photoTab })"
              />
            </label>
            <label v-else class="admin__photo-check" @click.stop>
              <input
                type="checkbox"
                :checked="isPhotoDownloadSelected(photo.photoId, photoTab)"
                @change="togglePhotoDownload(photo.photoId, photoTab)"
              />
            </label>
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
                v-if="!deleteMode && isPhotoDownloadSelected(photo.photoId, photoTab)"
                :href="photo.downloadUrl"
                :download="photo.fileName"
                target="_blank"
                rel="noopener"
                class="admin__download"
                @click.stop
              >
                개별 다운로드
              </a>
            </div>
          </li>
        </ul>
      </section>
    </template>

    <div v-if="deleteMode && data" class="admin__delete-bar">
      <span class="admin__delete-count">{{ selectedCount }}개 선택됨</span>
      <button type="button" class="admin__bulk-btn" @click="selectAllDeletableItems">
        모두 선택
      </button>
      <button type="button" class="admin__bulk-btn" @click="clearDeleteSelection">
        모두 해제
      </button>
      <button
        type="button"
        class="admin__delete-submit"
        :disabled="selectedCount === 0 || deleting"
        @click="openDeleteModal"
      >
        선택 삭제
      </button>
    </div>

    <div v-if="showDeleteModal" class="admin__modal-backdrop" @click.self="closeDeleteModal">
      <form class="admin__modal" @submit.prevent="submitDelete">
        <h3 class="admin__modal-title">삭제 확인</h3>
        <p class="admin__modal-desc">
          선택한 <strong>{{ selectedCount }}개</strong> 항목을 삭제합니다.<br />
          되돌릴 수 없습니다. 삭제 비밀번호를 입력하세요.
        </p>
        <input
          v-model="deletePasswordInput"
          type="password"
          class="admin__input"
          placeholder="삭제 비밀번호"
          autocomplete="off"
          autofocus
        />
        <p v-if="deleteModalError" class="admin__error">{{ deleteModalError }}</p>
        <div class="admin__modal-actions">
          <button type="button" class="admin__modal-cancel" @click="closeDeleteModal">
            취소
          </button>
          <button type="submit" class="admin__modal-confirm" :disabled="deleting || !deletePasswordInput">
            {{ deleting ? '삭제 중…' : '삭제' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { deleteAdminItems, fetchAdminData, updateAppSettings } from '../api/admin'
import { isApiConfigured } from '../api/client'
import { downloadExcel } from '../utils/excelDownload'
import { findDuplicateRsvpIds } from '../utils/rsvpNames'

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

const sideFilter = ref('all')
const rsvpSearch = ref('')
const guestbookSearch = ref('')
const rsvpDuplicatesOnly = ref(false)

const deleteMode = ref(false)
const selectedKeys = ref(new Set())
const photoDownloadKeys = ref(new Set())
const photoDownloading = ref(false)
const showDeleteModal = ref(false)
const deletePasswordInput = ref('')
const deleteModalError = ref('')
const deleting = ref(false)
const settingsUpdating = ref(false)
const settingsError = ref('')

const rsvpsBySide = computed(() => {
  if (!data.value) return []
  if (sideFilter.value === 'all') return data.value.rsvps
  return data.value.rsvps.filter((rsvp) => rsvp.side === sideFilter.value)
})

const duplicateRsvpIds = computed(() => findDuplicateRsvpIds(rsvpsBySide.value))

const duplicateRsvpCount = computed(() => duplicateRsvpIds.value.size)

const filteredRsvps = computed(() => {
  const query = rsvpSearch.value.trim().toLowerCase()
  return rsvpsBySide.value.filter((rsvp) => {
    if (rsvpDuplicatesOnly.value && !duplicateRsvpIds.value.has(rsvp.rsvpId)) {
      return false
    }
    if (query && !rsvp.guestName?.toLowerCase().includes(query)) {
      return false
    }
    return true
  })
})

const filteredRsvpSummary = computed(() => {
  const list = rsvpsBySide.value
  return {
    total: list.length,
    attending: list.filter((r) => r.attending).length,
    notAttending: list.filter((r) => !r.attending).length,
  }
})

const filteredGuestbookBySide = computed(() => {
  if (!data.value) return []
  if (sideFilter.value === 'all') return data.value.guestbook
  return data.value.guestbook.filter((msg) => msg.side === sideFilter.value)
})

const filteredGuestbook = computed(() => {
  const query = guestbookSearch.value.trim().toLowerCase()
  if (!query) return filteredGuestbookBySide.value
  return filteredGuestbookBySide.value.filter((msg) =>
    msg.authorName?.toLowerCase().includes(query),
  )
})

const currentPhotos = computed(() => {
  if (!data.value) return []
  return data.value.photos[photoTab.value] ?? []
})

const selectedCount = computed(() => selectedKeys.value.size)

const photoDownloadCount = computed(() => photoDownloadKeys.value.size)

const allRsvpsSelected = computed(() => {
  if (!filteredRsvps.value.length) return false
  return filteredRsvps.value.every((rsvp) => isSelected('rsvp', rsvp.rsvpId, rsvp.side))
})

const allGuestbookSelected = computed(() => {
  if (!filteredGuestbook.value.length) return false
  return filteredGuestbook.value.every((msg) => isSelected('guestbook', msg.messageId))
})

watch(sideFilter, (side) => {
  if (side === 'groom' || side === 'bride') {
    photoTab.value = side
  }
})

function setSideFilter(side) {
  sideFilter.value = side
}

function selectionKey({ resource, id, side }) {
  return `${resource}:${id}:${side ?? ''}`
}

function isSelected(resource, id, side) {
  return selectedKeys.value.has(selectionKey({ resource, id, side }))
}

function toggleSelect(item) {
  const key = selectionKey(item)
  const next = new Set(selectedKeys.value)
  if (next.has(key)) {
    next.delete(key)
  } else {
    next.add(key)
  }
  selectedKeys.value = next
}

function addToSelection(items) {
  const next = new Set(selectedKeys.value)
  items.forEach((item) => next.add(selectionKey(item)))
  selectedKeys.value = next
}

function removeFromSelection(items) {
  const next = new Set(selectedKeys.value)
  items.forEach((item) => next.delete(selectionKey(item)))
  selectedKeys.value = next
}

function rsvpSelectionItems() {
  return filteredRsvps.value.map((rsvp) => ({
    resource: 'rsvp',
    id: rsvp.rsvpId,
    side: rsvp.side,
  }))
}

function guestbookSelectionItems() {
  return filteredGuestbook.value.map((msg) => ({
    resource: 'guestbook',
    id: msg.messageId,
  }))
}

function photoSelectionItems(side = null) {
  if (!data.value) return []
  const sides = side
    ? [side]
    : sideFilter.value === 'all'
      ? ['groom', 'bride']
      : [sideFilter.value]
  return sides.flatMap((tab) =>
    (data.value.photos[tab] ?? []).map((photo) => ({
      resource: 'photo',
      id: photo.photoId,
      side: tab,
    })),
  )
}

function photoDownloadKey(photoId, side) {
  return selectionKey({ resource: 'photo', id: photoId, side })
}

function isPhotoDownloadSelected(photoId, side) {
  return photoDownloadKeys.value.has(photoDownloadKey(photoId, side))
}

function togglePhotoDownload(photoId, side) {
  const key = photoDownloadKey(photoId, side)
  const next = new Set(photoDownloadKeys.value)
  if (next.has(key)) {
    next.delete(key)
  } else {
    next.add(key)
  }
  photoDownloadKeys.value = next
}

function addToPhotoDownload(items) {
  const next = new Set(photoDownloadKeys.value)
  items.forEach((item) => next.add(photoDownloadKey(item.id, item.side)))
  photoDownloadKeys.value = next
}

function clearPhotoDownloadSelection() {
  photoDownloadKeys.value = new Set()
}

function selectAllCurrentTabPhotosForDownload() {
  addToPhotoDownload(photoSelectionItems(photoTab.value))
}

function selectAllPhotosForDownload() {
  addToPhotoDownload(photoSelectionItems())
}

function onPhotoItemClick(photo) {
  if (deleteMode.value) {
    toggleSelect({ resource: 'photo', id: photo.photoId, side: photoTab.value })
    return
  }
  togglePhotoDownload(photo.photoId, photoTab.value)
}

function selectAllRsvps() {
  addToSelection(rsvpSelectionItems())
}

function deselectAllRsvps() {
  removeFromSelection(rsvpSelectionItems())
}

function toggleAllRsvps(event) {
  if (event.target.checked) {
    selectAllRsvps()
  } else {
    deselectAllRsvps()
  }
}

function selectAllGuestbook() {
  addToSelection(guestbookSelectionItems())
}

function deselectAllGuestbook() {
  removeFromSelection(guestbookSelectionItems())
}

function toggleAllGuestbook(event) {
  if (event.target.checked) {
    selectAllGuestbook()
  } else {
    deselectAllGuestbook()
  }
}

function selectAllCurrentTabPhotosForDelete() {
  addToSelection(photoSelectionItems(photoTab.value))
}

function selectAllPhotosForDelete() {
  addToSelection(photoSelectionItems())
}

function deselectAllCurrentTabPhotosForDelete() {
  removeFromSelection(photoSelectionItems(photoTab.value))
}

function selectAllDeletableItems() {
  addToSelection([
    ...rsvpSelectionItems(),
    ...guestbookSelectionItems(),
    ...photoSelectionItems(),
  ])
}

function clearDeleteSelection() {
  selectedKeys.value = new Set()
}

function getSelectedPhotosForDownload() {
  if (!data.value) return []
  const sides =
    sideFilter.value === 'all' ? ['groom', 'bride'] : [sideFilter.value]
  return sides.flatMap((side) =>
    (data.value.photos[side] ?? [])
      .filter((photo) => isPhotoDownloadSelected(photo.photoId, side))
      .map((photo) => ({ ...photo, side })),
  )
}

function triggerFileDownload(url, fileName) {
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.target = '_blank'
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}

async function downloadSelectedPhotos() {
  const photos = getSelectedPhotosForDownload()
  if (photos.length === 0) return

  photoDownloading.value = true
  try {
    for (const [index, photo] of photos.entries()) {
      triggerFileDownload(photo.downloadUrl, photo.fileName)
      if (index < photos.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 350))
      }
    }
  } finally {
    photoDownloading.value = false
  }
}

function downloadRsvpExcel() {
  const headers = ['이름', '측', '참석', '제출 시각']
  const rows = filteredRsvps.value.map((rsvp) => [
    rsvp.guestName,
    sideLabel(rsvp.side),
    rsvp.attending ? '참석' : '불참',
    formatDate(rsvp.createdAt),
  ])
  const stamp = new Date().toISOString().slice(0, 10)
  const sideSuffix =
    sideFilter.value === 'all' ? '전체' : sideFilter.value === 'groom' ? '신랑측' : '신부측'
  const dupSuffix = rsvpDuplicatesOnly.value ? '_중복' : ''
  downloadExcel(headers, rows, `참석자명단_${sideSuffix}${dupSuffix}_${stamp}`, '참석자')
}

function parseSelectedItems() {
  return [...selectedKeys.value].map((key) => {
    const [resource, id, side] = key.split(':')
    const item = { resource, id }
    if (side) item.side = side
    return item
  })
}

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

async function toggleSetting(key) {
  if (!data.value?.settings) return
  settingsUpdating.value = true
  settingsError.value = ''
  const next = !data.value.settings[key]
  try {
    const result = await updateAppSettings(storedPassword.value, { [key]: next })
    data.value.settings = { ...data.value.settings, ...result.settings }
  } catch (err) {
    settingsError.value = err.message || '설정 변경에 실패했습니다'
  } finally {
    settingsUpdating.value = false
  }
}

function enterDeleteMode() {
  deleteMode.value = true
  selectedKeys.value = new Set()
  photoDownloadKeys.value = new Set()
}

function exitDeleteMode() {
  deleteMode.value = false
  selectedKeys.value = new Set()
  closeDeleteModal()
}

function openDeleteModal() {
  deleteModalError.value = ''
  deletePasswordInput.value = ''
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  deletePasswordInput.value = ''
  deleteModalError.value = ''
}

async function submitDelete() {
  if (!deletePasswordInput.value) {
    deleteModalError.value = '삭제 비밀번호를 입력하세요'
    return
  }

  deleting.value = true
  deleteModalError.value = ''
  try {
    const items = parseSelectedItems()
    const result = await deleteAdminItems(storedPassword.value, deletePasswordInput.value, items)
    closeDeleteModal()
    exitDeleteMode()
    await loadData(storedPassword.value, { silent: true })
    if (result.failedCount > 0) {
      window.alert(`${result.deletedCount}개 삭제, ${result.failedCount}개 실패했습니다`)
    }
  } catch (err) {
    deleteModalError.value = err.message || '삭제에 실패했습니다'
  } finally {
    deleting.value = false
  }
}

async function loadData(password, { silent = false } = {}) {
  if (!silent) loading.value = true
  loadError.value = ''
  try {
    data.value = await fetchAdminData(password)
    data.value.settings = {
      photoUploadOpen: false,
      guestbookOpen: true,
      rsvpOpen: true,
      ...data.value.settings,
    }
    authenticated.value = true
    sessionStorage.setItem(STORAGE_KEY, password)
    storedPassword.value = password
  } catch (err) {
    loadError.value = err.message
    if (!authenticated.value) {
      loginError.value = err.message
    }
  } finally {
    if (!silent) loading.value = false
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
  exitDeleteMode()
  sessionStorage.removeItem(STORAGE_KEY)
  authenticated.value = false
  storedPassword.value = ''
  data.value = null
  passwordInput.value = ''
  loginError.value = ''
  loadError.value = ''
  sideFilter.value = 'all'
  rsvpSearch.value = ''
  guestbookSearch.value = ''
  rsvpDuplicatesOnly.value = false
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
  font-family: var(--font-serif, 'MaruBuri', Georgia, serif);
  color: var(--color-text, #4a4a4a);
  background: var(--color-bg, #fffbfc);
  min-height: 100vh;
}

.admin--delete-mode {
  padding-bottom: 6rem;
}

.admin__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
}

.admin__header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.admin__title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.admin__mode-btn {
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
  color: #c0392b;
  background: #fff;
  border: 1px solid #e8b4b0;
  border-radius: 4px;
  cursor: pointer;
}

.admin__mode-btn--cancel {
  color: var(--color-text-muted, #888);
  border-color: #ddd;
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

.admin__delete-hint {
  margin: -1rem 0 1.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.8125rem;
  color: #8a5a00;
  background: #fff8e6;
  border: 1px solid #f0d78c;
  border-radius: 6px;
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

.admin__filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  padding: 0.85rem 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgb(0 0 0 / 6%);
}

.admin__filters-label {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-muted, #888);
}

.admin__filter-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.admin__filter-tab {
  padding: 0.4rem 0.85rem;
  font-size: 0.85rem;
  color: var(--color-text-muted, #888);
  background: #fafafa;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.admin__filter-tab--active {
  color: #fff;
  background: var(--color-primary-dark, #e8899e);
  border-color: var(--color-primary-dark, #e8899e);
}

.admin__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1rem;
  margin-bottom: 0.85rem;
}

.admin__search {
  flex: 1 1 180px;
  max-width: 280px;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
}

.admin__dup-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--color-text-muted, #888);
  cursor: pointer;
  user-select: none;
}

.admin__dup-count {
  color: #c0392b;
  font-weight: 600;
}

.admin__count {
  margin-left: 0.35rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-muted, #888);
}

.admin__dup-badge {
  display: inline-block;
  margin-left: 0.35rem;
  padding: 0.1rem 0.4rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: #8a5a00;
  background: #fff8e6;
  border: 1px solid #f0d78c;
  border-radius: 3px;
  vertical-align: middle;
}

.admin__row--duplicate {
  background: #fffdf5;
}

.admin__row--duplicate.admin__row--selected {
  background: #fff5f7;
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

.admin__section-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.admin__section-head .admin__section-title {
  margin: 0;
}

.admin__section-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.admin__bulk-btn {
  padding: 0.35rem 0.7rem;
  font-size: 0.78rem;
  color: var(--color-text-muted, #888);
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.admin__bulk-btn:hover:not(:disabled) {
  border-color: var(--color-primary-dark, #e8899e);
  color: var(--color-primary-dark, #e8899e);
}

.admin__bulk-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.admin__bulk-btn--primary {
  color: #fff;
  background: var(--color-primary-dark, #e8899e);
  border-color: var(--color-primary-dark, #e8899e);
}

.admin__bulk-btn--primary:hover:not(:disabled) {
  color: #fff;
  background: var(--color-primary, #f4a7b9);
  border-color: var(--color-primary, #f4a7b9);
}

.admin__section-title {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.admin__settings-card {
  padding: 1.25rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgb(0 0 0 / 6%);
}

.admin__settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.admin__settings-row + .admin__settings-row {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.admin__settings-label {
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
}

.admin__settings-desc {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-text-muted, #888);
}

.admin__toggle {
  flex-shrink: 0;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  color: #c0392b;
  background: #fdecea;
  border: 1px solid #e8b4b0;
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
}

.admin__toggle--on {
  color: #27ae60;
  background: #eafaf1;
  border-color: #a8dfc0;
}

.admin__toggle:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.admin__check-col {
  width: 2.5rem;
  text-align: center;
}

.admin__row--selected {
  background: #fff5f7;
}

.admin--delete-mode .admin__table tbody tr {
  cursor: pointer;
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
  position: relative;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgb(0 0 0 / 6%);
}

.admin__photo-grid .admin__photo-item {
  cursor: pointer;
}

.admin__photo-item--selected {
  outline: 2px solid var(--color-primary-dark, #e8899e);
  outline-offset: 2px;
}

.admin--delete-mode .admin__photo-item--selected {
  outline-color: #c0392b;
}

.admin__photo-check {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
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

.admin__delete-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem 1rem;
  padding: 1rem 1.5rem;
  background: #fff;
  border-top: 1px solid #f0d0d0;
  box-shadow: 0 -4px 16px rgb(0 0 0 / 8%);
}

.admin__delete-count {
  font-size: 0.9rem;
  color: #333;
}

.admin__delete-submit {
  padding: 0.55rem 1.25rem;
  font-size: 0.9rem;
  color: #fff;
  background: #c0392b;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.admin__delete-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.admin__modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.45);
}

.admin__modal {
  width: 100%;
  max-width: 360px;
  padding: 1.5rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgb(0 0 0 / 15%);
}

.admin__modal-title {
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
  color: #333;
}

.admin__modal-desc {
  margin: 0 0 1rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-text-muted, #888);
}

.admin__modal-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.admin__modal-cancel,
.admin__modal-confirm {
  flex: 1;
  padding: 0.6rem;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
}

.admin__modal-cancel {
  color: var(--color-text-muted, #888);
  background: #fff;
  border: 1px solid #ddd;
}

.admin__modal-confirm {
  color: #fff;
  background: #c0392b;
  border: none;
}

.admin__modal-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
