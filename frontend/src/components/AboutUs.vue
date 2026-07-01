<template>
  <section class="about section section--accent">
    <SectionHeader :eyebrow="t.about.eyebrow" :title="t.about.title" />

    <div class="about__grid">
      <article class="about__card hanji-card about__card--groom">
        <div class="about__photo">
          <ImageWithPlaceholder
            :src="groomPhoto"
            :alt="couple.groom.fullName"
            :placeholder-label="t.about.groomPhotoHint"
          />
        </div>
        <p class="about__role">{{ t.about.groom }}</p>
        <h3 class="about__name">{{ couple.groom.fullName }}</h3>
        <p class="about__parents">
          {{ parentsLine.groom.father }} · {{ parentsLine.groom.mother }}{{ t.parentsLine.groomPrefix }}
          {{ t.parentsLine.son }}
        </p>
        <p class="about__meta">{{ couple.groom.birthDate }}</p>
        <p class="about__meta">{{ couple.groom.mbti }}</p>
        <p class="about__tags">
          <span v-for="tag in couple.groom.tags" :key="tag" class="about__tag">{{ tag }}</span>
        </p>
      </article>

      <article class="about__card hanji-card about__card--bride">
        <div class="about__photo">
          <ImageWithPlaceholder
            :src="bridePhoto"
            :alt="couple.bride.fullName"
            :placeholder-label="t.about.bridePhotoHint"
            :object-position="couple.bride.photoObjectPosition ?? 'center center'"
          />
        </div>
        <p class="about__role">{{ t.about.bride }}</p>
        <h3 class="about__name">{{ couple.bride.fullName }}</h3>
        <p class="about__parents">
          {{ parentsLine.bride.father }} · {{ parentsLine.bride.mother }}{{ t.parentsLine.bridePrefix }}
          {{ t.parentsLine.daughter }}
        </p>
        <p class="about__meta">{{ couple.bride.birthDate }}</p>
        <p class="about__meta">{{ couple.bride.mbti }}</p>
        <p class="about__tags">
          <span v-for="tag in couple.bride.tags" :key="tag" class="about__tag">{{ tag }}</span>
        </p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { resolveAssetImage } from '../composables/useAssetImage'
import { useInvitationContent } from '../composables/useInvitationContent'
import ImageWithPlaceholder from './ImageWithPlaceholder.vue'
import SectionHeader from './SectionHeader.vue'

const { couple, parentsLine, t } = useInvitationContent()

const groomPhoto = computed(() => resolveAssetImage(couple.groom.photoPath))
const bridePhoto = computed(() => resolveAssetImage(couple.bride.photoPath))
</script>

<style scoped>
.about__grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.about__card {
  width: 60%;
  padding: 0.625rem;
  background: #fff;
  box-shadow: 0 2px 12px rgba(var(--color-primary-rgb), 0.12);
}

.about__card--groom {
  align-self: flex-start;
  text-align: left;
}

.about__card--bride {
  align-self: flex-end;
  text-align: right;
}

.about__photo {
  width: 100%;
  aspect-ratio: 3 / 2;
  margin-bottom: 0.5rem;
  border-radius: 10px;
  overflow: hidden;
}

.about__photo :deep(.image-with-placeholder) {
  height: 100%;
}

.about__role {
  margin: 0 0 0.125rem;
  font-size: 0.6875rem;
  color: var(--color-primary);
}

.about__name {
  margin: 0 0 0.375rem;
  font-family: var(--font-serif);
  font-size: 0.9375rem;
  font-weight: 600;
  color: #333;
}

.about__parents {
  margin: 0 0 0.5rem;
  font-size: 0.6875rem;
  line-height: 1.45;
  color: var(--color-text-muted);
}

.about__meta {
  margin: 0;
  font-size: 0.6875rem;
  line-height: 1.45;
  color: var(--color-text);
}

.about__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin: 0.5rem 0 0;
}

.about__card--groom .about__tags {
  justify-content: flex-start;
}

.about__card--bride .about__tags {
  justify-content: flex-end;
}

.about__tag {
  font-size: 0.6875rem;
  color: var(--color-primary-dark);
}
</style>
