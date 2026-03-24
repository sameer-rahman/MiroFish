<template>
  <div class="loading-page">
    <header class="loading-shell">
      <nav class="topbar">
        <div class="brand-lockup">
          <span class="brand">SomeIdea AI</span>
          <span class="brand-chip">Powered by MiroFish</span>
        </div>
        <div class="topbar-actions">
          <button class="ghost-btn" type="button" @click="goHome">Edit Draft</button>
          <button class="solid-btn" type="button" @click="skipToResults">Skip to Results</button>
        </div>
      </nav>

      <section class="loading-hero">
        <div class="hero-copy">
          <p class="eyebrow">Simulation Running</p>
          <h1>Preparing the IR reaction workbench.</h1>
          <p class="hero-text">
            No results are visible yet. The prototype is stepping through the same stages that the live backend can later drive with real status updates.
          </p>

          <div class="progress-block">
            <div class="progress-meta">
              <span>{{ progressLabel }}</span>
              <span>{{ progressPercent }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${progressPercent}%` }"></div>
            </div>
          </div>
        </div>

        <aside class="summary-card">
          <p class="summary-label">Submitted scenario</p>
          <div class="summary-item">
            <span class="summary-key">Draft</span>
            <p>{{ draftPreview }}</p>
          </div>
          <div class="summary-item">
            <span class="summary-key">Context</span>
            <p>{{ contextPreview }}</p>
          </div>
          <div class="summary-item">
            <span class="summary-key">Goal</span>
            <p>{{ goalPreview }}</p>
          </div>
        </aside>
      </section>

      <section class="status-grid">
        <article class="status-panel">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Pipeline</p>
              <h2>Current loading state</h2>
            </div>
            <p class="panel-copy">This is the state between submission and visible results.</p>
          </div>

          <div class="step-list">
            <div
              v-for="(step, index) in steps"
              :key="step"
              class="step-item"
              :class="stepClass(index)"
            >
              <span class="step-index">{{ String(index + 1).padStart(2, '0') }}</span>
              <div class="step-copy">
                <p class="step-title">{{ step }}</p>
                <p class="step-note">{{ stepNote(index) }}</p>
              </div>
              <span class="step-state">{{ stepState(index) }}</span>
            </div>
          </div>
        </article>

        <article class="status-panel side-panel">
          <div class="panel-header compact">
            <div>
              <p class="eyebrow">Next Screen</p>
              <h2>What appears after loading</h2>
            </div>
          </div>

          <div class="preview-list">
            <div class="preview-item">Persona-theme reaction matrix</div>
            <div class="preview-item">Scenario spread and consensus</div>
            <div class="preview-item">Draft trigger phrases</div>
            <div class="preview-item">IR risks and likely questions</div>
          </div>
        </article>
      </section>
    </header>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  irPreviewState,
  IR_PREVIEW_STEPS,
  ensureIRPreviewSession,
  advanceIRPreviewStep
} from '../store/irPreviewSession'

const router = useRouter()
const steps = IR_PREVIEW_STEPS

let progressTimer = null
let finishTimer = null

const currentStep = computed(() => irPreviewState.currentStep)
const progressPercent = computed(() => Math.round(((currentStep.value + 1) / steps.length) * 100))
const progressLabel = computed(() => steps[currentStep.value] || steps[0])

const clampText = (value, fallback) => {
  const text = (value || '').trim()
  return text || fallback
}

const draftPreview = computed(() =>
  clampText(irPreviewState.announcementText, 'Using sample announcement draft for the prototype.')
)

const contextPreview = computed(() =>
  clampText(irPreviewState.context, 'No extra context provided.')
)

const goalPreview = computed(() =>
  clampText(irPreviewState.simulationGoal, 'No simulation goal provided yet.')
)

const stepClass = (index) => {
  if (index < currentStep.value) return 'done'
  if (index === currentStep.value) return 'active'
  return 'pending'
}

const stepState = (index) => {
  if (index < currentStep.value) return 'Done'
  if (index === currentStep.value) return 'Running'
  return 'Queued'
}

const stepNote = (index) => {
  if (index < currentStep.value) return 'Completed in mock mode.'
  if (index === currentStep.value) return 'Visible now so this can later map to backend progress.'
  return 'Will unlock after the current stage finishes.'
}

const clearTimers = () => {
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
  if (finishTimer) {
    clearTimeout(finishTimer)
    finishTimer = null
  }
}

const skipToResults = () => {
  clearTimers()
  router.replace({ name: 'IRWorkbench' })
}

const goHome = () => {
  clearTimers()
  router.push({ name: 'Home' })
}

onMounted(() => {
  ensureIRPreviewSession()

  progressTimer = setInterval(() => {
    if (irPreviewState.currentStep >= steps.length - 1) {
      clearInterval(progressTimer)
      progressTimer = null
      finishTimer = setTimeout(() => {
        router.replace({ name: 'IRWorkbench' })
      }, 900)
      return
    }

    advanceIRPreviewStep()
  }, 1000)
})

onBeforeUnmount(() => {
  clearTimers()
})
</script>

<style scoped>
.loading-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(212, 159, 88, 0.16), transparent 28%),
    linear-gradient(180deg, #fbf7f1 0%, #f1e9df 100%);
  color: #221a13;
}

.loading-shell {
  padding: 32px 40px 40px;
}

.topbar,
.brand-lockup,
.topbar-actions,
.progress-meta {
  display: flex;
  align-items: center;
}

.topbar {
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
}

.brand-lockup,
.topbar-actions {
  gap: 12px;
}

.brand {
  font-size: 1rem;
  letter-spacing: 0.18em;
  font-weight: 800;
  background: linear-gradient(90deg, #2f66ad 0%, #59b59a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-chip,
.ghost-btn,
.solid-btn {
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
}

.brand-chip {
  padding: 8px 12px;
  background: rgba(47, 102, 173, 0.08);
  color: #50725e;
}

.ghost-btn,
.solid-btn {
  border: 1px solid rgba(56, 42, 29, 0.14);
  padding: 11px 14px;
  cursor: pointer;
}

.ghost-btn {
  background: rgba(255, 255, 255, 0.65);
  color: #33261b;
}

.solid-btn {
  background: #241a12;
  color: #fff8f0;
}

.loading-hero,
.status-grid {
  display: grid;
  gap: 16px;
}

.loading-hero {
  grid-template-columns: 1.2fr 0.9fr;
  margin-bottom: 18px;
}

.hero-copy,
.summary-card,
.status-panel {
  border-radius: 24px;
  border: 1px solid rgba(77, 56, 39, 0.1);
  background: rgba(255, 251, 247, 0.88);
  box-shadow: 0 20px 44px rgba(95, 72, 44, 0.08);
}

.hero-copy {
  padding: 26px;
}

.eyebrow,
.summary-label,
.summary-key,
.step-index {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.72rem;
  color: #8c7b6d;
  font-weight: 700;
}

.hero-copy h1,
.panel-header h2 {
  margin: 10px 0 12px;
  color: #201913;
}

.hero-copy h1 {
  font-size: clamp(2.2rem, 5vw, 4rem);
  line-height: 0.96;
  max-width: 12ch;
}

.hero-text,
.summary-item p,
.panel-copy,
.step-note,
.preview-item {
  margin: 0;
  line-height: 1.6;
  color: #64584e;
}

.progress-block {
  margin-top: 22px;
}

.progress-meta {
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #473a2e;
}

.progress-bar {
  height: 12px;
  border-radius: 999px;
  background: #eadfd2;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #d07f53 0%, #2f746e 100%);
  transition: width 0.45s ease;
}

.summary-card,
.status-panel {
  padding: 20px;
}

.summary-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.summary-item {
  padding: 14px;
  border-radius: 18px;
  background: #f7efe8;
}

.summary-key {
  display: block;
  margin-bottom: 6px;
}

.status-grid {
  grid-template-columns: 1.2fr 0.8fr;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
}

.panel-header h2 {
  font-size: 1.2rem;
}

.panel-copy {
  max-width: 240px;
}

.step-list,
.preview-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.step-item,
.preview-item {
  border-radius: 18px;
  background: #f7efe8;
}

.step-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 14px;
  align-items: flex-start;
  padding: 14px;
}

.step-title {
  margin: 0 0 4px;
  font-weight: 700;
  color: #241d16;
}

.step-state {
  font-size: 0.78rem;
  font-weight: 700;
  color: #6c5b4c;
}

.step-item.active {
  background: #efe4d9;
  border: 1px solid rgba(208, 127, 83, 0.24);
}

.step-item.done {
  background: #f4eee8;
}

.preview-item {
  padding: 13px 14px;
  font-weight: 700;
  color: #34281f;
}

@media (max-width: 1100px) {
  .loading-hero,
  .status-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .loading-shell {
    padding-left: 18px;
    padding-right: 18px;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .topbar-actions {
    width: 100%;
    flex-direction: column;
  }

  .ghost-btn,
  .solid-btn {
    width: 100%;
  }

  .panel-header {
    flex-direction: column;
  }

  .step-item {
    grid-template-columns: 1fr;
  }
}
</style>
