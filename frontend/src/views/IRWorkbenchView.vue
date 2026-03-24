<template>
  <div class="ir-page">
    <header class="hero">
      <nav class="topbar">
        <div class="brand-lockup">
          <span class="brand">SomeIdea AI</span>
          <span class="brand-chip">Powered by MiroFish</span>
        </div>
        <div class="topbar-actions">
          <button class="ghost-btn" type="button" @click="editDraft">Edit Draft</button>
          <button class="solid-btn" type="button" @click="rerunSimulation">Re-run Simulation</button>
        </div>
      </nav>

      <div class="hero-grid">
        <div class="hero-copy">
          <p class="hero-eyebrow">Investor Relations Reaction Lab</p>
          <h1 class="hero-title">Preview how the market reads your earnings language before the call.</h1>
          <p class="hero-body">
            A calmer prototype for IR teams stress-testing earnings drafts, guidance framing, and likely follow-up pressure.
          </p>

          <div class="hero-tags">
            <span>8 market personas</span>
            <span>scenario spread</span>
            <span>language triggers</span>
          </div>
        </div>

        <aside class="hero-card">
          <p class="hero-card-label">Current test scenario</p>
          <h2>{{ scenarioTitle }}</h2>
          <p>Simulation goal: {{ scenarioGoal }}</p>
          <div class="hero-card-grid">
            <div>
              <span class="mini-label">Primary risk</span>
              <strong>Credibility gap on forward demand</strong>
            </div>
            <div>
              <span class="mini-label">Main upside</span>
              <strong>Margin discipline lands well</strong>
            </div>
          </div>
        </aside>
      </div>
    </header>

    <main class="workbench">
      <IRReactionDashboard
        :summary-metrics="summaryMetrics"
        :themes="themes"
        :personas="personas"
        :matrix="reactionMatrix"
        :scenario-bands="scenarioBands"
        :consensus="consensus"
      />

      <IRPersonaGrid :personas="personas" />

      <IRTriggerBoard
        :triggers="triggers"
        :risks="risks"
        :questions="questions"
      />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import IRPersonaGrid from '../components/ir/IRPersonaGrid.vue'
import IRReactionDashboard from '../components/ir/IRReactionDashboard.vue'
import IRTriggerBoard from '../components/ir/IRTriggerBoard.vue'
import {
  ensureIRPreviewSession,
  irPreviewState,
  restartIRPreviewSession
} from '../store/irPreviewSession'

const router = useRouter()
ensureIRPreviewSession()

const scenarioTitle = computed(() => {
  const context = (irPreviewState.context || '').trim()
  if (context) return context

  return 'Q2 draft with strong margin expansion but softer revenue guide'
})

const scenarioGoal = computed(() => {
  const goal = (irPreviewState.simulationGoal || '').trim()
  if (goal) return goal

  return 'Estimate how wording changes affect analyst confidence, financial media framing, and retail sentiment in the first 24 hours.'
})

const editDraft = () => {
  router.push({ name: 'Home' })
}

const rerunSimulation = () => {
  restartIRPreviewSession()
  router.push({ name: 'IRLoading' })
}

const personas = [
  {
    id: 'sell-side',
    role: 'Sell-side analyst',
    name: 'Model Keeper',
    bias: 'Precision first',
    accent: '#b8613c',
    summary: 'Interrogates bridge items, segment assumptions, and wording changes that could alter estimate confidence.',
    watch: 'Guide clarity, comparability vs prior quarter, KPI consistency',
    question: 'What specifically changed in the demand outlook relative to last quarter?'
  },
  {
    id: 'buy-side',
    role: 'Long-only PM',
    name: 'Durability Hunter',
    bias: 'Quality compounder',
    accent: '#3f7f74',
    summary: 'Looks for repeatable quality of revenue and whether the narrative supports multiple expansion or compression.',
    watch: 'Cash generation, durable margins, management credibility',
    question: 'Is the margin beat structural, or did it come from items that will reverse?'
  },
  {
    id: 'retail',
    role: 'Retail investor',
    name: 'Momentum Thread',
    bias: 'Headline sensitive',
    accent: '#d69f38',
    summary: 'Responds quickly to plain-English takeaways, tone, and any line that sounds like acceleration or slowdown.',
    watch: 'Simple headline read, confidence language, big picture story',
    question: 'Is this actually a beat, or are they hiding weaker growth with better margins?'
  },
  {
    id: 'short-seller',
    role: 'Short seller',
    name: 'Fracture Probe',
    bias: 'Looks for gaps',
    accent: '#ab4f4d',
    summary: 'Searches for soft spots, omitted detail, and language that suggests the company is smoothing over pressure points.',
    watch: 'Guide resets, inventory risk, selective disclosure',
    question: 'What is management not saying directly about demand softness?'
  },
  {
    id: 'media',
    role: 'Financial media',
    name: 'Headline Desk',
    bias: 'Angle and contrast',
    accent: '#5d6ed8',
    summary: 'Reduces the release to a narrative hook that can travel fast across the market and public channels.',
    watch: 'Contradictions, surprise factor, easy framing devices',
    question: 'What is the cleanest headline tension in this release?'
  },
  {
    id: 'credit',
    role: 'Credit lens',
    name: 'Balance Sheet Watch',
    bias: 'Downside protection',
    accent: '#6e63a8',
    summary: 'Weights solvency, cash discipline, and downside resilience over growth excitement.',
    watch: 'Free cash flow, leverage language, covenant comfort',
    question: 'Does the release improve confidence in liquidity under a slower top-line scenario?'
  },
  {
    id: 'sector',
    role: 'Sector specialist',
    name: 'Relative Value Lens',
    bias: 'Compares across peers',
    accent: '#4f8e58',
    summary: 'Benchmarks every claim against peer disclosures and knows when wording suggests underperformance.',
    watch: 'Relative guide positioning, pricing power, share gains',
    question: 'How would this language read next to the closest peer print this quarter?'
  },
  {
    id: 'macro',
    role: 'Macro generalist',
    name: 'Tape Reader',
    bias: 'Context over detail',
    accent: '#8c6b4a',
    summary: 'Maps the release into the broader market tape, asking whether it confirms or breaks prevailing macro narratives.',
    watch: 'Demand sensitivity, macro exposure, cyclicality cues',
    question: 'Does this release reinforce or challenge the current sector macro narrative?'
  }
]

const themes = ['Guidance', 'Margins', 'Credibility', 'Narrative', 'Disclosure']

const reactionMatrix = {
  'sell-side': {
    Guidance: 'Negative',
    Margins: 'Positive',
    Credibility: 'Mixed',
    Narrative: 'Mixed',
    Disclosure: 'Negative'
  },
  'buy-side': {
    Guidance: 'Mixed',
    Margins: 'Positive',
    Credibility: 'Mixed',
    Narrative: 'Positive',
    Disclosure: 'Mixed'
  },
  retail: {
    Guidance: 'Negative',
    Margins: 'Positive',
    Credibility: 'Mixed',
    Narrative: 'Positive',
    Disclosure: 'Mixed'
  },
  'short-seller': {
    Guidance: 'Negative',
    Margins: 'Mixed',
    Credibility: 'Negative',
    Narrative: 'Negative',
    Disclosure: 'Negative'
  },
  media: {
    Guidance: 'Negative',
    Margins: 'Positive',
    Credibility: 'Mixed',
    Narrative: 'Positive',
    Disclosure: 'Mixed'
  },
  credit: {
    Guidance: 'Mixed',
    Margins: 'Positive',
    Credibility: 'Positive',
    Narrative: 'Mixed',
    Disclosure: 'Mixed'
  },
  sector: {
    Guidance: 'Negative',
    Margins: 'Positive',
    Credibility: 'Mixed',
    Narrative: 'Mixed',
    Disclosure: 'Negative'
  },
  macro: {
    Guidance: 'Negative',
    Margins: 'Mixed',
    Credibility: 'Mixed',
    Narrative: 'Mixed',
    Disclosure: 'Mixed'
  }
}

const summaryMetrics = [
  {
    label: 'Net reaction score',
    value: '-8',
    note: 'Draft still screens slightly defensive despite the margin beat.'
  },
  {
    label: 'Consensus issue',
    value: 'Guidance',
    note: 'Six of eight personas flagged framing risk around the forward view.'
  },
  {
    label: 'Likely headline',
    value: 'Beat, but cautious',
    note: 'Media and retail personas converge on a split-signal framing.'
  }
]

const scenarioBands = [
  {
    label: 'Constructive read',
    note: 'Margin strength outweighs softer guide language.',
    value: 29,
    color: '#7fb46d'
  },
  {
    label: 'Split reaction',
    note: 'Good print, but messaging still leaves unanswered questions.',
    value: 49,
    color: '#d9a34d'
  },
  {
    label: 'Defensive read',
    note: 'Investors focus on deceleration and credibility risk.',
    value: 22,
    color: '#cb6d58'
  }
]

const consensus = [
  {
    title: 'Margins land well, but guidance still dominates the read.',
    note: 'The draft gets credit for discipline but not enough to neutralize caution.'
  },
  {
    title: 'Tighter demand framing would likely improve analyst confidence.',
    note: 'Most skepticism traces back to wording around visibility, not the quarter itself.'
  }
]

const triggers = [
  {
    id: 't1',
    tone: 'Negative',
    impact: 'High impact',
    quote: 'We are maintaining a prudent outlook given the current demand environment.',
    reason: 'This reads like management has less conviction than headline results suggest and invites reset speculation.',
    personas: ['Sell-side analyst', 'Short seller', 'Financial media']
  },
  {
    id: 't2',
    tone: 'Mixed',
    impact: 'Medium impact',
    quote: 'Operating margin expanded 260 basis points year over year.',
    reason: 'Supports discipline and execution, especially when paired with a cleaner bridge on cost actions.',
    personas: ['Buy-side PM', 'Credit lens', 'Retail investor']
  }
]

const risks = [
  {
    title: 'Forward demand language sounds overly hedged',
    note: 'Could shift the narrative from disciplined conservatism to softening visibility.',
    score: '9/10'
  },
  {
    title: 'Insufficient bridge between revenue softness and margin strength',
    note: 'Makes the quality of earnings easier to challenge on the call.',
    score: '8/10'
  },
  {
    title: 'Media headline risk around "beat with caveat"',
    note: 'Likely if cautionary wording remains more vivid than operating wins.',
    score: '7/10'
  }
]

const questions = [
  'What changed in your outlook assumptions versus last quarter?',
  'How much of the margin beat is structural versus temporary cost action?',
  'What evidence supports the confidence embedded in the second-half demand narrative?',
  'Should investors read the current wording as a reset to expectations?'
]
</script>

<style scoped>
.ir-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(212, 159, 88, 0.18), transparent 30%),
    radial-gradient(circle at top right, rgba(95, 126, 213, 0.12), transparent 26%),
    linear-gradient(180deg, #fbf7f1 0%, #f4ede5 100%);
  color: #211912;
}

.hero {
  padding: 32px 40px 24px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 34px;
}

.brand-lockup,
.topbar-actions,
.hero-tags,
.hero-card-grid {
  display: flex;
  align-items: center;
}

.brand-lockup,
.hero-tags {
  gap: 12px;
}

.topbar-actions {
  gap: 10px;
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
.hero-tags span,
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

.hero-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.9fr;
  gap: 18px;
  align-items: stretch;
}

.hero-copy,
.hero-card {
  border-radius: 28px;
  border: 1px solid rgba(77, 56, 39, 0.1);
  box-shadow: 0 24px 52px rgba(86, 62, 35, 0.08);
}

.hero-copy {
  padding: 26px;
  background: rgba(255, 252, 248, 0.86);
}

.hero-eyebrow,
.hero-card-label,
.mini-label {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.72rem;
  color: #8c7b6d;
  font-weight: 700;
}

.hero-title {
  margin: 12px 0 14px;
  max-width: 11ch;
  font-size: clamp(2.5rem, 5vw, 4.6rem);
  line-height: 0.94;
  letter-spacing: -0.05em;
}

.hero-body,
.hero-card p {
  margin: 0;
  max-width: 720px;
  line-height: 1.7;
  font-size: 1rem;
  color: #5e5349;
}

.hero-tags {
  flex-wrap: wrap;
  margin-top: 16px;
}

.hero-tags span {
  padding: 8px 12px;
  background: rgba(118, 92, 58, 0.09);
  color: #6a5642;
}

.hero-card {
  padding: 24px;
  background: linear-gradient(180deg, rgba(41, 29, 19, 0.95), rgba(74, 49, 31, 0.9));
  color: #f9f1e7;
}

.hero-card h2 {
  margin: 10px 0 12px;
  font-size: 1.42rem;
  line-height: 1.1;
}

.hero-card p,
.hero-card .mini-label,
.hero-card-label {
  color: rgba(249, 241, 231, 0.78);
}

.hero-card-grid {
  gap: 12px;
  margin-top: 18px;
  align-items: stretch;
}

.hero-card-grid > div {
  flex: 1;
  border-radius: 18px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.06);
}

.hero-card-grid strong {
  display: block;
  margin-top: 8px;
  font-size: 0.95rem;
  line-height: 1.4;
}

.workbench {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 0 40px 40px;
}

@media (max-width: 1100px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .hero,
  .workbench {
    padding-left: 18px;
    padding-right: 18px;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .topbar-actions,
  .hero-card-grid {
    width: 100%;
    flex-direction: column;
  }

  .ghost-btn,
  .solid-btn {
    width: 100%;
  }

  .hero-copy,
  .hero-card {
    padding: 22px;
  }
}
</style>
