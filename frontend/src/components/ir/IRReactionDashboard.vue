<template>
  <section class="dashboard-shell">
    <div class="summary-grid">
      <article v-for="metric in summaryMetrics" :key="metric.label" class="metric-card">
        <p class="metric-label">{{ metric.label }}</p>
        <p class="metric-value">{{ metric.value }}</p>
        <p class="metric-note">{{ metric.note }}</p>
      </article>
    </div>

    <div class="analytics-grid">
      <article class="panel panel-wide">
        <div class="panel-header">
          <div>
            <p class="panel-kicker">Reaction Dashboard</p>
            <h3>Persona-theme reaction matrix</h3>
          </div>
          <p class="panel-copy">A single view of where the wording is helping or hurting.</p>
        </div>

        <div class="matrix">
          <div class="matrix-corner">Persona</div>
          <div v-for="theme in themes" :key="theme" class="matrix-head">{{ theme }}</div>

          <template v-for="persona in personas" :key="persona.id">
            <div class="matrix-persona">{{ persona.name }}</div>
            <div
              v-for="theme in themes"
              :key="`${persona.id}-${theme}`"
              class="matrix-cell"
              :class="toneClass(matrix[persona.id][theme])"
            >
              {{ matrix[persona.id][theme] }}
            </div>
          </template>
        </div>
      </article>

      <article class="panel">
        <div class="panel-header tight">
          <div>
            <p class="panel-kicker">Scenario Spread</p>
            <h3>Outcome bands</h3>
          </div>
        </div>

        <div class="bands">
          <div v-for="band in scenarioBands" :key="band.label" class="band-row">
            <div class="band-copy">
              <p class="band-label">{{ band.label }}</p>
              <p class="band-note">{{ band.note }}</p>
            </div>
            <div class="band-bar">
              <div class="band-fill" :style="{ width: `${band.value}%`, background: band.color }"></div>
            </div>
            <span class="band-value">{{ band.value }}%</span>
          </div>
        </div>
      </article>

      <article class="panel">
        <div class="panel-header tight">
          <div>
            <p class="panel-kicker">Consensus</p>
            <h3>Shared takeaways</h3>
          </div>
        </div>
        <div class="consensus-list">
          <div v-for="item in consensus" :key="item.title" class="consensus-item">
            <p class="consensus-title">{{ item.title }}</p>
            <p class="consensus-note">{{ item.note }}</p>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
defineProps({
  summaryMetrics: {
    type: Array,
    default: () => []
  },
  themes: {
    type: Array,
    default: () => []
  },
  personas: {
    type: Array,
    default: () => []
  },
  matrix: {
    type: Object,
    default: () => ({})
  },
  scenarioBands: {
    type: Array,
    default: () => []
  },
  consensus: {
    type: Array,
    default: () => []
  }
})

const toneClass = (value) => {
  if (value === 'Positive') return 'positive'
  if (value === 'Mixed') return 'mixed'
  return 'negative'
}
</script>

<style scoped>
.dashboard-shell {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.metric-card,
.panel {
  border-radius: 24px;
  border: 1px solid rgba(77, 56, 39, 0.1);
  background: rgba(255, 251, 247, 0.88);
  box-shadow: 0 20px 44px rgba(95, 72, 44, 0.08);
}

.metric-card {
  padding: 16px;
}

.metric-label,
.panel-kicker,
.band-label,
.consensus-title {
  margin: 0;
}

.metric-label,
.panel-kicker {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #8d7d71;
  font-weight: 700;
}

.metric-value {
  margin: 8px 0 4px;
  font-size: 1.7rem;
  line-height: 1;
  color: #201913;
  font-weight: 700;
}

.metric-note,
.panel-copy,
.band-note,
.consensus-note {
  margin: 0;
  color: #675b51;
  line-height: 1.5;
  font-size: 0.9rem;
}

.analytics-grid {
  display: grid;
  grid-template-columns: 1.5fr 0.92fr;
  gap: 12px;
}

.panel {
  padding: 18px;
}

.panel-wide {
  grid-row: span 2;
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

.panel-header.tight {
  margin-bottom: 16px;
}

.panel-copy {
  max-width: 240px;
}

.matrix {
  display: grid;
  grid-template-columns: 150px repeat(5, minmax(0, 1fr));
  gap: 6px;
}

.matrix-corner,
.matrix-head,
.matrix-persona,
.matrix-cell {
  border-radius: 12px;
  padding: 10px 8px;
  font-size: 0.78rem;
  text-align: center;
}

.matrix-corner,
.matrix-head {
  background: #f1e9e1;
  color: #55483e;
  font-weight: 700;
}

.matrix-persona {
  background: #faf3ed;
  color: #3a2f26;
  font-weight: 700;
  text-align: left;
}

.matrix-cell {
  color: #2f241d;
  font-weight: 700;
}

.matrix-cell.positive {
  background: rgba(127, 180, 109, 0.2);
}

.matrix-cell.mixed {
  background: rgba(231, 188, 107, 0.28);
}

.matrix-cell.negative {
  background: rgba(211, 112, 88, 0.22);
}

.bands,
.consensus-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.band-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr auto;
  gap: 12px;
  align-items: center;
}

.band-label {
  font-size: 0.92rem;
  font-weight: 700;
  color: #2b221b;
}

.band-bar {
  height: 10px;
  border-radius: 999px;
  background: #efe4d9;
  overflow: hidden;
}

.band-fill {
  height: 100%;
  border-radius: inherit;
}

.band-value {
  color: #3f3228;
  font-weight: 700;
  font-size: 0.85rem;
}

.consensus-item {
  padding: 12px 13px 14px;
  border-radius: 16px;
  background: #f7efe8;
}

.consensus-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #271f18;
}

@media (max-width: 1180px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .analytics-grid {
    grid-template-columns: 1fr;
  }

  .panel-wide {
    grid-row: auto;
  }
}

@media (max-width: 760px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .panel-header {
    flex-direction: column;
  }

  .panel-copy {
    max-width: none;
  }

  .matrix {
    grid-template-columns: 140px repeat(5, minmax(88px, 1fr));
    overflow-x: auto;
  }

  .band-row {
    grid-template-columns: 1fr;
  }
}
</style>
