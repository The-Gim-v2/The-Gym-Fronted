<script setup lang="ts">
import { shallowRef, computed } from 'vue';
import RegisterGym from './RegisterGym.vue';
import RegisterAthlete from './RegisterAthlete.vue';
import RegisterTrainer from './RegisterTrainer.vue';

type TipoRegistro = 'gimnasio' | 'atleta' | 'entrenador';

// El registro de gimnasio es el que se muestra por defecto al entrar a la vista
const tipoRegistro = shallowRef<TipoRegistro>('gimnasio');

const opciones: { value: TipoRegistro; label: string; desc: string }[] = [
  { value: 'gimnasio', label: 'Gimnasio', desc: 'Registra tu negocio y gestiónalo' },
  { value: 'atleta', label: 'Atleta', desc: 'Únete a un gimnasio ya existente' },
  { value: 'entrenador', label: 'Entrenador', desc: 'Ofrece tus servicios en un gimnasio' }
];

const componenteActual = computed(() => {
  if (tipoRegistro.value === 'atleta') return RegisterAthlete;
  if (tipoRegistro.value === 'entrenador') return RegisterTrainer;
  return RegisterGym;
});
</script>

<template>
  <div class="register-shell">
    <div class="glow"></div>

    <div class="switcher-wrapper">

      <!-- Escritorio / tablet: chips -->
      <div class="type-switcher" role="tablist" aria-label="Tipo de registro">
        <button
          v-for="opt in opciones"
          :key="opt.value"
          type="button"
          class="type-chip"
          role="tab"
          :aria-selected="tipoRegistro === opt.value"
          :class="{ active: tipoRegistro === opt.value }"
          @click="tipoRegistro = opt.value"
        >
          <span class="chip-label">{{ opt.label }}</span>
          <span class="chip-desc">{{ opt.desc }}</span>
        </button>
      </div>

      <!-- Móvil: select nativo, mucho más cómodo que chips en pantallas chicas -->
      <div class="type-select-wrapper">
        <label for="tipoRegistroMobile" class="type-select-label">Quiero registrarme como</label>
        <div class="type-select-box">
          <select id="tipoRegistroMobile" v-model="tipoRegistro" class="type-select">
            <option v-for="opt in opciones" :key="opt.value" :value="opt.value">
              {{ opt.label }} — {{ opt.desc }}
            </option>
          </select>
          <svg class="type-select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

    </div>

    <!-- Se renderiza siempre uno solo de los 3 componentes de registro -->
    <component :is="componenteActual" />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;600;700&display=swap');

.register-shell {
  min-height: 100vh;
  background: #0a0a0a;
  position: relative;
  overflow-x: hidden;
  padding-bottom: 40px;
}

.glow {
  position: absolute;
  top: -160px;
  left: 50%;
  transform: translateX(-50%);
  width: 720px;
  height: 720px;
  max-width: 160vw;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(28,79,214,0.32) 0%, rgba(28,79,214,0) 70%);
  filter: blur(10px);
  pointer-events: none;
}

.switcher-wrapper {
  display: flex;
  justify-content: center;
  padding: 28px clamp(16px, 3vw, 40px) 4px;
  position: relative;
  z-index: 1;
}

.type-switcher {
  display: flex;
  gap: 8px;
  background: rgba(18, 18, 18, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 18px;
  padding: 8px;
  max-width: 100%;
  overflow-x: auto;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.4);
}

.type-chip {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 12px 20px;
  border-radius: 12px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  min-width: 155px;
  text-align: left;
  transition: all 0.25s ease;
  flex-shrink: 0;
}

.type-chip:hover:not(.active) {
  background: rgba(255, 255, 255, 0.05);
}

.chip-label {
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: #f5f5f4;
}

.chip-desc {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: rgba(245, 245, 244, 0.5);
}

.type-chip.active {
  background: #1c4fd6;
  border-color: #1c4fd6;
  box-shadow: 0 4px 12px rgba(28, 79, 214, 0.35);
}
.type-chip.active .chip-label,
.type-chip.active .chip-desc { color: #ffffff; }

/* Select nativo — oculto por defecto, solo se muestra en móvil */
.type-select-wrapper {
  display: none;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.type-select-label {
  font-family: 'Oswald', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: rgba(245, 245, 244, 0.6);
  padding-left: 2px;
}

.type-select-box {
  position: relative;
  width: 100%;
}

.type-select {
  width: 100%;
  appearance: none;
  -webkit-appearance: none;
  background: rgba(18, 18, 18, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1.5px solid rgba(255, 255, 255, 0.14);
  border-radius: 14px;
  padding: 14px 42px 14px 16px;
  color: #f5f5f4;
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 14px;
  min-height: 52px;
  box-sizing: border-box;
  cursor: pointer;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.4);
}

.type-select:focus {
  outline: none;
  border-color: #1c4fd6;
  box-shadow: 0 0 0 4px rgba(28, 79, 214, 0.25);
}

.type-select option {
  background: #161616;
  color: #f5f5f4;
  font-weight: 500;
}

.type-select-arrow {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(245, 245, 244, 0.55);
  pointer-events: none;
}

@media (max-width: 640px) {
  .type-switcher { display: none; }
  .type-select-wrapper { display: flex; }
}
</style>