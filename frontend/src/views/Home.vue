<template>
  <div class="home-container">
    <nav class="navbar">
      <div class="brand-lockup">
        <div class="nav-brand">SomeIdea AI</div>
        <span class="brand-chip">Powered by MiroFish</span>
      </div>
      <div class="nav-links">
        <a href="https://github.com/666ghj/MiroFish" target="_blank" class="github-link">
          View MiroFish OSS <span class="arrow">↗</span>
        </a>
      </div>
    </nav>

    <div class="main-content">
      <section class="hero-section">
        <div class="hero-left">
          <div class="tag-row">
            <span class="orange-tag">SomeIdea AI IR Copilot</span>
            <span class="version-text">/ intake screen</span>
          </div>
          
          <h1 class="main-title">
              Stress-test earnings language<br>
            <span class="gradient-text">before the market does</span>
          </h1>
          
          <div class="hero-desc">
            <p>
              <span class="highlight-bold">SomeIdea AI</span> uses the open-source <span class="highlight-orange">MiroFish</span> engine to help IR teams pressure-test earnings language before it reaches the market. Start with the draft, add context, and define the reaction or risk you want the simulation to surface.
            </p>
            <p class="slogan-text">
              Your intelligent research partner for earnings messaging and market reaction prep<span class="blinking-cursor">_</span>
            </p>
          </div>
           
          <div class="decoration-square"></div>
        </div>
        
        <div class="hero-right">
          <div class="hero-card">
            <p class="hero-card-label">Intake Checklist</p>
            <div class="hero-card-row">
              <span class="hero-card-key">Draft</span>
              <span class="hero-card-value">Paste the earnings announcement text.</span>
            </div>
            <div class="hero-card-row">
              <span class="hero-card-key">Context</span>
              <span class="hero-card-value">Add quarter, expectations, or narrative setup.</span>
            </div>
            <div class="hero-card-row">
              <span class="hero-card-key">Goal</span>
              <span class="hero-card-value">Define what reaction or risk you want simulated.</span>
            </div>
            <div class="hero-card-row brand-note-row">
              <span class="hero-card-key">Brand Layer</span>
              <span class="hero-card-value">SomeIdea AI experience, powered by the MiroFish open-source simulation engine.</span>
            </div>
            <div class="hero-logo-wrap">
              <img src="../assets/logo/MiroFish_logo_left.jpeg" alt="MiroFish Logo" class="hero-logo" />
            </div>
            <button class="scroll-down-btn" @click="scrollToBottom">
              Jump to Inputs
            </button>
          </div>
        </div>
      </section>

      <section class="dashboard-section">
        <div class="dashboard-intro">
          <div class="panel-header">
            <span class="status-dot">■</span> System Status
          </div>

          <h2 class="section-title">Ready</h2>
          <p class="section-desc">
            The forecasting engine is standing by. Upload unstructured inputs to initialize a new simulation sequence.
          </p>
          <p class="dashboard-note">Paste the announcement draft and simulation goal, then launch the run immediately.</p>
        </div>

        <div class="console-box">
          <div class="console-section">
            <div class="console-header">
              <span class="console-label">01 / Announcement Draft</span>
              <span class="console-meta">Paste text directly</span>
            </div>
            
            <div class="input-zone">
              <div class="input-group">
                <label class="input-label">Paste Earnings Announcement</label>
                <div class="input-wrapper">
                  <textarea
                    v-model="announcementText"
                    placeholder="Paste your earnings announcement here..."
                    rows="12"
                    class="code-input announcement-input"
                  ></textarea>
                </div>
              </div>

              <div class="input-group">
                <label class="input-label">Context (optional)</label>
                <div class="input-wrapper">
                  <input
                    v-model="context"
                    type="text"
                    placeholder="e.g. Q3 earnings, missed revenue but beat margins"
                    class="context-input"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="console-divider">
            <span>INPUTS</span>
          </div>

          <div class="console-section">
            <div class="console-header">
              <span class="console-label">02 / Simulation Goal</span>
            </div>
            <div class="input-wrapper">
              <textarea
                v-model="formData.simulationRequirement"
                class="code-input"
                placeholder="// Describe the simulation or forecast you want in natural language (e.g. If the company withdraws prior guidance, how would market sentiment evolve?)"
                rows="6"
                :disabled="loading"
              ></textarea>
              <div class="model-badge">Engine: SomeIdea AI on MiroFish</div>
            </div>
          </div>

          <div class="console-section btn-section">
            <button 
              class="start-engine-btn"
              @click="startSimulation"
              :disabled="!canSubmit || loading"
            >
              <span v-if="!loading">Start Engine</span>
              <span v-else>Initializing...</span>
              <span class="btn-arrow">→</span>
            </button>

            <button
              class="preview-ir-btn"
              type="button"
              @click="goToIRWorkbench"
            >
              Preview IR Workbench
            </button>
          </div>
        </div>
      </section>

      <!-- 历史项目数据库 -->
      <HistoryDatabase />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import HistoryDatabase from '../components/HistoryDatabase.vue'
import { setIRPreviewSession } from '../store/irPreviewSession'

const router = useRouter()

// 表单数据
const formData = ref({
  simulationRequirement: ''
})

// 状态
const loading = ref(false)
const error = ref('')


const announcementText = ref('')
const context = ref('')

// 计算属性:是否可以提交
const canSubmit = computed(() => {
  return announcementText.value.trim() !== '' && formData.value.simulationRequirement.trim() !== ''
})

// 滚动到底部
const scrollToBottom = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  })
}

// 开始模拟 - 立即跳转，API调用在Process页面进行
const startSimulation = () => {
  if (!canSubmit.value || loading.value) return
  
  // 存储待上传的数据
  import('../store/pendingUpload.js').then(({ setPendingUpload }) => {
    setPendingUpload({
      announcementText: announcementText.value,
      context: context.value,
      simulationRequirement: formData.value.simulationRequirement
    })
    
    // 立即跳转到Process页面（使用特殊标识表示新建项目）
    router.push({
      name: 'Process',
      params: { projectId: 'new' }
    })
  })
}

const goToIRWorkbench = () => {
  setIRPreviewSession({
    announcementText: announcementText.value,
    context: context.value,
    simulationGoal: formData.value.simulationRequirement
  })

  router.push({ name: 'IRLoading' })
}
</script>

<style scoped>
/* 全局变量与重置 */
:root {
  --black: #201913;
  --white: #fffdf9;
  --orange: #d07f53;
  --gray-light: #f7efe8;
  --gray-text: #64584e;
  --border: rgba(77, 56, 39, 0.1);
  --font-mono: 'JetBrains Mono', monospace;
  --font-sans: 'Space Grotesk', 'Noto Sans SC', system-ui, sans-serif;
  --font-cn: 'Noto Sans SC', system-ui, sans-serif;
}

.home-container {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(212, 159, 88, 0.16), transparent 28%),
    radial-gradient(circle at top right, rgba(88, 120, 186, 0.08), transparent 24%),
    linear-gradient(180deg, #fbf7f1 0%, #f1e9df 100%);
  font-family: var(--font-sans);
  color: var(--black);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 32px 40px 0;
}

.brand-lockup {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-brand {
  font-family: var(--font-mono);
  font-weight: 800;
  letter-spacing: 0.18em;
  font-size: 1rem;
  background: linear-gradient(90deg, #2f66ad 0%, #59b59a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-chip {
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(47, 102, 173, 0.08);
  color: #50725e;
  font-size: 0.78rem;
  font-weight: 700;
}

.nav-links {
  display: flex;
  align-items: center;
}

.github-link {
  color: #3b2d21;
  text-decoration: none;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 14px;
  border-radius: 999px;
  border: 1px solid rgba(56, 42, 29, 0.14);
  background: rgba(255, 255, 255, 0.65);
  transition: all 0.2s ease;
}

.github-link:hover {
  background: rgba(255, 255, 255, 0.85);
}

.arrow {
  font-family: sans-serif;
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 40px 60px;
}

.hero-section {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 18px;
  margin-bottom: 28px;
  align-items: stretch;
}

.hero-left {
  border-radius: 28px;
  border: 1px solid var(--border);
  background: rgba(255, 252, 248, 0.86);
  box-shadow: 0 24px 52px rgba(86, 62, 35, 0.08);
  padding: 30px;
}

.tag-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  flex-wrap: wrap;
}

.orange-tag {
  background: rgba(47, 102, 173, 0.1);
  color: #366ea9;
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 700;
  letter-spacing: 0.1em;
  font-size: 0.72rem;
  text-transform: uppercase;
}

.version-text {
  color: #8c7b6d;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 0.72rem;
}

.main-title {
  font-size: clamp(2.8rem, 6vw, 5.1rem);
  line-height: 0.95;
  font-weight: 600;
  margin: 0 0 18px;
  letter-spacing: -0.05em;
  color: var(--black);
  max-width: 11ch;
}

.gradient-text {
  background: linear-gradient(90deg, #201913 0%, #72573c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.hero-desc {
  font-size: 1rem;
  line-height: 1.75;
  color: var(--gray-text);
  max-width: 640px;
  margin-bottom: 18px;
  font-weight: 400;
}

.hero-desc p {
  margin-bottom: 1rem;
}

.highlight-bold {
  color: var(--black);
  font-weight: 700;
}

.highlight-orange {
  color: var(--orange);
  font-weight: 700;
  font-family: var(--font-mono);
}

.highlight-code {
  background: rgba(114, 87, 60, 0.08);
  padding: 2px 6px;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 0.9em;
  color: var(--black);
  font-weight: 600;
}

.slogan-text {
  font-size: 1.06rem;
  font-weight: 520;
  color: var(--black);
  letter-spacing: 0.01em;
  border-left: 3px solid var(--orange);
  padding-left: 14px;
  margin-top: 18px;
}

.blinking-cursor {
  color: var(--orange);
  animation: blink 1s step-end infinite;
  font-weight: 700;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.decoration-square {
  width: 16px;
  height: 16px;
  background: var(--orange);
  border-radius: 4px;
}

.hero-right {
  display: flex;
}

.hero-card {
  width: 100%;
  border-radius: 28px;
  border: 1px solid var(--border);
  background: linear-gradient(180deg, rgba(41, 29, 19, 0.95), rgba(74, 49, 31, 0.9));
  box-shadow: 0 24px 52px rgba(86, 62, 35, 0.08);
  padding: 28px;
  color: #f9f1e7;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.hero-card-label,
.hero-card-key {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.72rem;
  color: rgba(249, 241, 231, 0.72);
  font-weight: 700;
}

.brand-note-row {
  background: rgba(89, 181, 154, 0.08);
}

.hero-card-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.06);
}

.hero-card-value {
  color: #f9f1e7;
  font-size: 0.96rem;
  line-height: 1.5;
}

.hero-logo-wrap {
  padding-top: 8px;
}

.hero-logo {
  width: 100%;
  max-width: 320px;
  border-radius: 22px;
  display: block;
}

.scroll-down-btn {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  padding: 15px 16px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff6ed;
  font-size: 0.86rem;
  font-family: var(--font-mono);
  font-weight: 700;
  letter-spacing: 0.08em;
  transition: all 0.2s;
  margin-top: auto;
}

.scroll-down-btn:hover {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.08);
}

.dashboard-section {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-top: 8px;
  align-items: center;
}

.dashboard-intro {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 920px;
  padding: 0 8px;
}

.panel-header {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: #8d7d71;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.status-dot {
  color: var(--orange);
  font-size: 0.8rem;
}

.section-title {
  font-size: 1.85rem;
  font-weight: 600;
  margin: 0 0 10px;
}

.section-desc {
  color: var(--gray-text);
  margin: 0;
  line-height: 1.6;
  max-width: 680px;
}

.dashboard-note {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: #8d7d71;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin: 14px 0 0;
}

.console-box {
  width: 100%;
  max-width: 920px;
  border-radius: 24px;
  border: 1px solid var(--border);
  background: rgba(255, 251, 247, 0.88);
  box-shadow: 0 20px 44px rgba(95, 72, 44, 0.08);
  padding: 10px;
}

.console-section {
  padding: 20px;
}

.console-section.btn-section {
  padding-top: 0;
}

.btn-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.console-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: #6c5b4c;
}

.console-divider {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.console-divider::before,
.console-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(77, 56, 39, 0.1);
}

.console-divider span {
  padding: 0 15px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: #a38f7f;
  letter-spacing: 0.14em;
}

.input-wrapper {
  position: relative;
  border: 1px solid rgba(77, 56, 39, 0.1);
  background: #f7efe8;
  border-radius: 18px;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.input-wrapper:focus-within {
  border-color: rgba(208, 127, 83, 0.44);
  background: #f4ebe2;
}

.code-input {
  width: 100%;
  border: none;
  background: transparent;
  padding: 20px;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  line-height: 1.6;
  resize: vertical;
  outline: none;
  min-height: 150px;
  color: #332820;
}

.model-badge {
  position: absolute;
  bottom: 10px;
  right: 15px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: #9b8878;
}

.start-engine-btn {
  width: 100%;
  background: #241a12;
  color: #fff8f0;
  border: 1px solid #241a12;
  padding: 18px 20px;
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.08em;
  position: relative;
  overflow: hidden;
  border-radius: 18px;
}

.start-engine-btn:not(:disabled) {
  background: #241a12;
  border: 1px solid #241a12;
  animation: pulse-border 2s infinite;
}

.start-engine-btn:hover:not(:disabled) {
  background: var(--orange);
  border-color: var(--orange);
  transform: translateY(-2px);
}

.start-engine-btn:active:not(:disabled) {
  transform: translateY(0);
}

.start-engine-btn:disabled {
  background: #E5E5E5;
  color: #999;
  cursor: not-allowed;
  transform: none;
  border: 1px solid #E5E5E5;
}

.preview-ir-btn {
  width: 100%;
  border: 1px solid rgba(56, 42, 29, 0.14);
  background: rgba(255, 255, 255, 0.65);
  color: #2c2219;
  padding: 16px 20px;
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.84rem;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 18px;
}

.preview-ir-btn:hover {
  border-color: #241a12;
  background: rgba(255, 255, 255, 0.85);
}

@keyframes pulse-border {
  0% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2); }
  70% { box-shadow: 0 0 0 6px rgba(0, 0, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
}

@media (max-width: 1024px) {
  .navbar {
    padding: 24px 18px 0;
  }

  .main-content {
    padding: 20px 18px 40px;
  }

  .hero-section {
    grid-template-columns: 1fr;
  }
  
  .hero-left {
    padding: 24px;
  }
  
  .hero-logo {
    max-width: 240px;
  }

  .dashboard-section {
    padding-top: 4px;
  }

  .dashboard-intro,
  .console-box {
    max-width: 100%;
  }
}

@media (max-width: 760px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .brand-lockup {
    flex-wrap: wrap;
  }

  .nav-links {
    width: 100%;
  }

  .github-link {
    width: 100%;
    justify-content: space-between;
  }
}

.input-zone {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: #6c5b4c;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.context-input {
  width: 100%;
  border: none;
  background: transparent;
  padding: 20px;
  color: #332820;
  font-size: 0.9rem;
  line-height: 1.6;
  font-family: var(--font-mono);
  outline: none;
  box-sizing: border-box;
}

.context-input::placeholder {
  color: #999;
}

.announcement-input {
  min-height: 260px;
}

</style>
