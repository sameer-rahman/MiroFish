<template>
  <section class="trigger-layout">
    <article class="panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Draft Trigger Map</p>
          <h3>Language likely to shape reaction</h3>
        </div>
        <p class="caption">These excerpts are where the simulation says interpretation risk is concentrated.</p>
      </div>

      <div class="trigger-list">
        <div v-for="trigger in triggers" :key="trigger.id" class="trigger-card">
          <div class="trigger-top">
            <span class="trigger-tag" :class="trigger.tone.toLowerCase()">{{ trigger.tone }}</span>
            <span class="trigger-impact">{{ trigger.impact }}</span>
          </div>
          <p class="trigger-quote">"{{ trigger.quote }}"</p>
          <p class="trigger-reason">{{ trigger.reason }}</p>
        </div>
      </div>
    </article>

    <article class="panel side-panel">
      <div class="panel-header compact">
        <div>
          <p class="eyebrow">Risk Stack</p>
          <h3>IR pressure points</h3>
        </div>
      </div>

      <div class="risk-list">
        <div v-for="risk in risks" :key="risk.title" class="risk-item">
          <div>
            <p class="risk-title">{{ risk.title }}</p>
            <p class="risk-note">{{ risk.note }}</p>
          </div>
          <span class="risk-score">{{ risk.score }}</span>
        </div>
      </div>

      <div class="qa-block">
        <p class="qa-label">Likely first call questions</p>
        <div class="qa-list">
          <div v-for="question in questions" :key="question" class="qa-item">{{ question }}</div>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup>
defineProps({
  triggers: {
    type: Array,
    default: () => []
  },
  risks: {
    type: Array,
    default: () => []
  },
  questions: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.trigger-layout {
  display: grid;
  grid-template-columns: 1.2fr 0.9fr;
  gap: 12px;
}

.panel {
  border-radius: 24px;
  border: 1px solid rgba(77, 56, 39, 0.1);
  background: rgba(255, 251, 247, 0.9);
  box-shadow: 0 20px 44px rgba(95, 72, 44, 0.08);
  padding: 18px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
}

.panel-header h3 {
  margin: 6px 0 0;
  font-size: 1.2rem;
  color: #241d16;
}

.eyebrow {
  margin: 0;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #8d7d71;
  font-weight: 700;
}

.caption,
.risk-note,
.trigger-reason,
.trigger-personas,
.qa-item {
  margin: 0;
  color: #665950;
  line-height: 1.5;
  font-size: 0.9rem;
}

.trigger-list,
.risk-list,
.qa-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trigger-card,
.risk-item,
.qa-item {
  border-radius: 18px;
  background: #f7efe8;
}

.trigger-card {
  padding: 14px;
}

.trigger-top,
.risk-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.trigger-tag,
.risk-score {
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 0.74rem;
  font-weight: 700;
  white-space: nowrap;
}

.trigger-tag.positive {
  background: rgba(127, 180, 109, 0.2);
  color: #315125;
}

.trigger-tag.mixed {
  background: rgba(231, 188, 107, 0.28);
  color: #6d4f14;
}

.trigger-tag.negative {
  background: rgba(211, 112, 88, 0.22);
  color: #7a2d1e;
}

.trigger-impact {
  font-size: 0.8rem;
  font-weight: 700;
  color: #8d7d71;
}

.trigger-quote {
  margin: 10px 0 8px;
  font-size: 0.96rem;
  line-height: 1.45;
  color: #231c15;
  font-weight: 700;
}

.risk-item {
  padding: 12px 14px;
}

.risk-title,
.qa-label {
  margin: 0 0 4px;
  color: #241d16;
  font-weight: 700;
}

.risk-score {
  background: #efe0d1;
  color: #4d3726;
}

.qa-block {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid rgba(77, 56, 39, 0.1);
}

.qa-item {
  padding: 11px 13px;
}

@media (max-width: 1100px) {
  .trigger-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .panel-header {
    flex-direction: column;
  }
}
</style>
