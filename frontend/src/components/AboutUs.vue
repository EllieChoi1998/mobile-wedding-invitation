<template>
  <section class="about section section--accent">
    <SectionHeader :eyebrow="t.about.eyebrow" :title="t.about.title" />

    <div class="about__grid">
      <article class="about__card">
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

      <article class="about__card">
        <div class="about__photo">
          <ImageWithPlaceholder
            :src="bridePhoto"
            :alt="couple.bride.fullName"
            :placeholder-label="t.about.bridePhotoHint"
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
  gap: 1.5rem;
}

.about__card {
  padding: 1.25rem;
  border-radius: 16px;
  background: #fff;
  text-align: center;
  box-shadow: 0 2px 12px rgba(244, 167, 185, 0.12);
}

.about__photo {
  width: 100%;
  aspect-ratio: 3 / 4;
  margin-bottom: 1rem;
  border-radius: 12px;
  overflow: hidden;
}

.about__role {
  margin: 0 0 0.25rem;
  font-size: 0.75rem;
  color: var(--color-primary);
}

.about__name {
  margin: 0 0 0.5rem;
  font-family: var(--font-serif);
  font-size: 1.0625rem;
  font-weight: 600;
  color: #333;
}

.about__parents {
  margin: 0 0 0.75rem;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.about__meta {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--color-text);
}

.about__tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.375rem;
  margin: 0.75rem 0 0;
}

.about__tag {
  font-size: 0.75rem;
  color: var(--color-primary-dark);
}
</style>
