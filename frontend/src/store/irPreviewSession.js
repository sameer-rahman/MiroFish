import { reactive } from 'vue'

const createDefaultState = () => ({
  announcementText: '',
  context: '',
  simulationGoal: '',
  currentStep: 0,
  submittedAt: '',
  mode: 'mock'
})

export const irPreviewState = reactive(createDefaultState())

export const IR_PREVIEW_STEPS = [
  'Parsing draft and context',
  'Initializing 8 market personas',
  'Running first-pass reactions',
  'Comparing divergence across scenarios',
  'Preparing IR risk summary'
]

const applyState = (nextState) => {
  Object.assign(irPreviewState, createDefaultState(), nextState)
}

export const setIRPreviewSession = ({
  announcementText = '',
  context = '',
  simulationGoal = '',
  currentStep = 0,
  submittedAt = new Date().toISOString(),
  mode = 'mock'
} = {}) => {
  applyState({
    announcementText,
    context,
    simulationGoal,
    currentStep,
    submittedAt,
    mode
  })
}

export const ensureIRPreviewSession = () => {
  if (irPreviewState.submittedAt) return

  setIRPreviewSession({
    announcementText: 'We delivered solid second-quarter results with operating margin expansion of 260 basis points year over year. We remain prudent in our outlook given the current demand environment and continue to prioritize disciplined execution.',
    context: 'Q2 earnings draft, revenue guide modestly softer than buy-side expectations',
    simulationGoal: 'Estimate how analysts, media, and investors interpret the quarter in the first 24 hours after release.'
  })
}

export const advanceIRPreviewStep = () => {
  if (irPreviewState.currentStep < IR_PREVIEW_STEPS.length - 1) {
    irPreviewState.currentStep += 1
  }
}

export const resetIRPreviewSession = () => {
  applyState({})
}

export const restartIRPreviewSession = () => {
  irPreviewState.currentStep = 0
  if (!irPreviewState.submittedAt) {
    irPreviewState.submittedAt = new Date().toISOString()
  }
}
