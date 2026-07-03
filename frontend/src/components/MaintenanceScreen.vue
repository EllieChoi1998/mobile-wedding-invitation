<template>
  <div class="maintenance">
    <p class="maintenance__icon" aria-hidden="true">♥</p>
    <p class="maintenance__title">잠시 후 다시 만나요</p>
    <p class="maintenance__desc">청첩장을 준비하고 있습니다.</p>
  </div>
</template>

<style scoped>
.maintenance {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem 1.5rem;
  text-align: center;
  background: var(--color-bg);
}

.maintenance__icon {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  color: var(--color-primary);
}

.maintenance__title {
  margin: 0 0 0.5rem;
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.maintenance__desc {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 300;
  line-height: 1.6;
  color: var(--color-text-muted);
}
</style>
