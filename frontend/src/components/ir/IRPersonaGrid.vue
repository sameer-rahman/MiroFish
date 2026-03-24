<template>
  <section class="persona-section">
    <div class="section-heading">
      <div>
        <p class="eyebrow">Persona Strip</p>
        <h2 class="title">Core market lenses</h2>
      </div>
      <p class="caption">Compact by design so the screen stays focused on outcomes, not profile cards.</p>
    </div>

    <div class="persona-strip">
      <article
        v-for="persona in personas"
        :key="persona.id"
        class="persona-chip"
        :style="{ '--accent': persona.accent }"
      >
        <div class="chip-top">
          <p class="persona-role">{{ persona.role }}</p>
          <span class="persona-bias">{{ persona.bias }}</span>
        </div>
        <h3 class="persona-name">{{ persona.name }}</h3>
        <p class="signal-line">{{ persona.watch }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
defineProps({
  personas: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.persona-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: flex-end;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #8a7768;
  font-weight: 700;
}

.title {
  margin: 0;
  font-size: clamp(1.35rem, 2vw, 1.8rem);
  line-height: 1.05;
  color: #201913;
}

.caption {
  margin: 0;
  max-width: 340px;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #6f655d;
}

.persona-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.persona-chip {
  border: 1px solid rgba(72, 53, 36, 0.1);
  background: rgba(255, 251, 247, 0.84);
  border-radius: 18px;
  padding: 14px 15px;
  box-shadow: 0 14px 30px rgba(83, 61, 39, 0.05);
  border-top: 3px solid var(--accent);
}

.chip-top {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: flex-start;
}

.persona-role {
  margin: 0;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #7f746b;
  font-weight: 700;
}

.persona-bias {
  padding: 5px 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--accent) 12%, white);
  color: #3c2d20;
  font-size: 0.68rem;
  font-weight: 700;
  white-space: nowrap;
}

.persona-name {
  margin: 10px 0 8px;
  font-size: 0.98rem;
  color: #241d16;
}

.signal-line {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.45;
  color: #5d5147;
}

@media (max-width: 1180px) {
  .persona-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .section-heading {
    flex-direction: column;
    align-items: flex-start;
  }

  .caption {
    max-width: none;
  }

  .persona-strip {
    grid-template-columns: 1fr;
  }
}
</style>
