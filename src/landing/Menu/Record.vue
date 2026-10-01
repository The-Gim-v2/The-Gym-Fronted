
<script setup lang="ts">
import {
  shallowRef,
  computed,
  ref,
  onMounted,
  onBeforeUnmount,
  nextTick
} from 'vue';

import RegisterGym from './RegisterGym.vue';
import RegisterAthlete from './RegisterAthlete.vue';
import RegisterTrainer from './RegisterTrainer.vue';

type TipoRegistro = 'gimnasio' | 'atleta' | 'entrenador';

// Registro por defecto
const tipoRegistro = shallowRef<TipoRegistro>('gimnasio');

// Opciones disponibles
const opciones: {
  value: TipoRegistro;
  label: string;
  desc: string;
}[] = [
  {
    value: 'gimnasio',
    label: 'Gimnasio',
    desc: 'Registra tu negocio y gestiónalo'
  },
  {
    value: 'atleta',
    label: 'Atleta',
    desc: 'Únete a un gimnasio ya existente'
  },
  {
    value: 'entrenador',
    label: 'Entrenador',
    desc: 'Ofrece tus servicios en un gimnasio'
  }
];

// Componente correspondiente
const componenteActual = computed(() => {
  if (tipoRegistro.value === 'atleta') {
    return RegisterAthlete;
  }

  if (tipoRegistro.value === 'entrenador') {
    return RegisterTrainer;
  }

  return RegisterGym;
});

// =====================================
// SELECT MÓVIL PERSONALIZADO
// =====================================

const selectAbierto = ref(false);

const selectContainer = ref<HTMLElement | null>(null);
const selectTrigger = ref<HTMLButtonElement | null>(null);

const opcionSeleccionada = computed(() => {
  return opciones.find(
    opt => opt.value === tipoRegistro.value
  );
});

// Abrir o cerrar el desplegable
const toggleSelect = () => {
  selectAbierto.value = !selectAbierto.value;
};

// Seleccionar tipo de registro
const seleccionarTipo = (value: TipoRegistro) => {
  tipoRegistro.value = value;
  selectAbierto.value = false;

  nextTick(() => {
    selectTrigger.value?.focus();
  });
};

// Cerrar al hacer clic fuera
const handleClickOutside = (event: PointerEvent) => {
  if (
    selectContainer.value &&
    !selectContainer.value.contains(event.target as Node)
  ) {
    selectAbierto.value = false;
  }
};

// Cerrar con Escape
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && selectAbierto.value) {
    selectAbierto.value = false;
    selectTrigger.value?.focus();
  }
};

onMounted(() => {
  document.addEventListener(
    'pointerdown',
    handleClickOutside
  );

  document.addEventListener(
    'keydown',
    handleKeydown
  );
});

onBeforeUnmount(() => {
  document.removeEventListener(
    'pointerdown',
    handleClickOutside
  );

  document.removeEventListener(
    'keydown',
    handleKeydown
  );
});
</script>

<template>
  <div class="register-shell">

    <!-- Decoración de fondo -->
    <div class="glow"></div>

    <div class="switcher-wrapper">

      <!-- =================================
           ESCRITORIO / TABLET
      ================================== -->

      <div
        class="type-switcher"
        role="tablist"
        aria-label="Tipo de registro"
      >
        <button
          v-for="opt in opciones"
          :key="opt.value"
          type="button"
          class="type-chip"
          role="tab"
          :aria-selected="tipoRegistro === opt.value"
          :class="{
            active: tipoRegistro === opt.value
          }"
          @click="tipoRegistro = opt.value"
        >
          <span class="chip-label">
            {{ opt.label }}
          </span>

          <span class="chip-desc">
            {{ opt.desc }}
          </span>
        </button>
      </div>


      <!-- =================================
           SELECT PERSONALIZADO MÓVIL
      ================================== -->

      <div class="type-select-wrapper">

        <span
          id="tipoRegistroLabel"
          class="type-select-label"
        >
          Quiero registrarme como
        </span>

        <div
          ref="selectContainer"
          class="custom-select"
        >

          <!-- Campo principal -->
          <button
            ref="selectTrigger"
            type="button"
            class="custom-select-trigger"
            :class="{ open: selectAbierto }"
            aria-haspopup="true"
            :aria-expanded="selectAbierto"
            aria-controls="tipoRegistroOptions"
            aria-labelledby="tipoRegistroLabel tipoRegistroActual"
            @click="toggleSelect"
          >

            <div class="selected-content">

              <span
                id="tipoRegistroActual"
                class="selected-label"
              >
                {{ opcionSeleccionada?.label }}
              </span>

              <span class="selected-desc">
                {{ opcionSeleccionada?.desc }}
              </span>

            </div>

            <!-- Flecha SVG -->
            <svg
              class="select-chevron"
              :class="{ rotate: selectAbierto }"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>

          </button>


          <!-- Menú desplegable -->
          <Transition name="dropdown">

            <div
              v-if="selectAbierto"
              id="tipoRegistroOptions"
              class="custom-select-menu"
              aria-label="Opciones de registro"
            >

              <button
                v-for="opt in opciones"
                :key="opt.value"
                type="button"
                class="custom-select-option"
                :class="{
                  active: tipoRegistro === opt.value
                }"
                :aria-pressed="tipoRegistro === opt.value"
                @click="seleccionarTipo(opt.value)"
              >

                <div class="option-content">

                  <span class="option-label">
                    {{ opt.label }}
                  </span>

                  <span class="option-desc">
                    {{ opt.desc }}
                  </span>

                </div>


                <!-- Check seleccionado -->
                <svg
                  v-if="tipoRegistro === opt.value"
                  class="option-check"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="m5 12 4 4L19 6" />
                </svg>

              </button>

            </div>

          </Transition>

        </div>
      </div>

    </div>


    <!-- =================================
         FORMULARIO DE REGISTRO
    ================================== -->

    <component :is="componenteActual" />

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;600;700&display=swap');


/* ========================================
   CONTENEDOR PRINCIPAL
======================================== */

.register-shell {
  min-height: 100vh;

  background: #0a0a0a;

  position: relative;

  overflow-x: hidden;

  padding-bottom: 40px;
}


/* ========================================
   GLOW DE FONDO
======================================== */

.glow {
  position: absolute;

  top: -160px;
  left: 50%;

  transform: translateX(-50%);

  width: 720px;
  height: 720px;

  max-width: 160vw;

  border-radius: 50%;

  background: radial-gradient(
    circle,
    rgba(28, 79, 214, 0.32) 0%,
    rgba(28, 79, 214, 0) 70%
  );

  filter: blur(10px);

  pointer-events: none;
}


/* ========================================
   CONTENEDOR DEL SELECTOR
======================================== */

.switcher-wrapper {
  display: flex;
  justify-content: center;

  padding: 28px clamp(16px, 3vw, 40px) 4px;

  position: relative;

  z-index: 10;
}


/* ========================================
   SELECTOR DE ESCRITORIO
======================================== */

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

  box-shadow:
    0 20px 45px rgba(0, 0, 0, 0.4);
}


/* Botones de escritorio */

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

  box-shadow:
    0 4px 12px rgba(28, 79, 214, 0.35);
}

.type-chip.active .chip-label,
.type-chip.active .chip-desc {
  color: #ffffff;
}


/* ========================================
   SELECT MÓVIL
======================================== */

.type-select-wrapper {
  display: none;

  flex-direction: column;

  gap: 8px;

  width: 100%;

  min-width: 0;
}

.type-select-label {
  padding-left: 3px;

  font-family: 'Oswald', sans-serif;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.8px;

  text-transform: uppercase;

  color: rgba(245, 245, 244, 0.5);
}


/* ========================================
   CONTENEDOR CUSTOM SELECT
======================================== */

.custom-select {
  position: relative;

  width: 100%;

  min-width: 0;
}


/* ========================================
   SELECT CERRADO
======================================== */

.custom-select-trigger {
  width: 100%;

  min-height: 62px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 12px;

  padding: 11px 16px;

  box-sizing: border-box;

  text-align: left;

  background: linear-gradient(
    145deg,
    rgba(21, 25, 34, 0.98),
    rgba(13, 16, 23, 0.98)
  );

  border: 1px solid rgba(255, 255, 255, 0.13);

  border-radius: 14px;

  color: #f5f5f4;

  cursor: pointer;

  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.035);

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.custom-select-trigger:hover {
  border-color: rgba(255, 255, 255, 0.22);
}

.custom-select-trigger:focus-visible {
  outline: 2px solid #6596ff;
  outline-offset: 3px;
}


/* Abierto */

.custom-select-trigger.open {
  border-color: #3168e8;

  background: linear-gradient(
    145deg,
    rgba(24, 31, 47, 0.98),
    rgba(14, 19, 30, 0.98)
  );

  box-shadow:
    0 0 0 3px rgba(28, 79, 214, 0.13),
    0 12px 30px rgba(0, 0, 0, 0.32);
}


/* ========================================
   TEXTO SELECCIONADO
======================================== */

.selected-content {
  display: flex;

  flex-direction: column;

  gap: 3px;

  min-width: 0;
}

.selected-label {
  font-family: 'Oswald', sans-serif;

  font-size: 15px;

  font-weight: 700;

  color: #f5f5f4;

  line-height: 1.3;
}

.selected-desc {
  font-family: 'Inter', sans-serif;

  font-size: 11px;

  font-weight: 500;

  color: rgba(245, 245, 244, 0.48);

  line-height: 1.4;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}


/* ========================================
   FLECHA SVG
======================================== */

.select-chevron {
  width: 18px;

  height: 18px;

  flex-shrink: 0;

  color: rgba(245, 245, 244, 0.5);

  transition:
    transform 0.22s ease,
    color 0.22s ease;
}

.select-chevron.rotate {
  transform: rotate(180deg);

  color: #78a3ff;
}


/* ========================================
   MENÚ DESPLEGABLE
======================================== */

.custom-select-menu {
  position: absolute;

  top: calc(100% + 8px);

  left: 0;

  z-index: 100;

  width: 100%;

  box-sizing: border-box;

  padding: 6px;

  background: #12151d;

  border: 1px solid rgba(110, 140, 210, 0.22);

  border-radius: 14px;

  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.65),
    0 0 0 1px rgba(255, 255, 255, 0.015) inset;

  backdrop-filter: blur(20px);

  -webkit-backdrop-filter: blur(20px);
}


/* ========================================
   OPCIONES
======================================== */

.custom-select-option {
  width: 100%;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 12px;

  padding: 12px;

  border: 1px solid transparent;

  border-radius: 10px;

  background: transparent;

  color: #f5f5f4;

  text-align: left;

  cursor: pointer;

  transition:
    background 0.18s ease,
    border-color 0.18s ease;
}

.custom-select-option +
.custom-select-option {
  margin-top: 3px;
}

.custom-select-option:hover {
  background: rgba(255, 255, 255, 0.055);
}


/* Opción activa */

.custom-select-option.active {
  background: rgba(28, 79, 214, 0.15);

  border-color: rgba(80, 128, 255, 0.12);
}


/* ========================================
   TEXTO DE OPCIONES
======================================== */

.option-content {
  min-width: 0;

  display: flex;

  flex-direction: column;

  gap: 4px;
}

.option-label {
  font-family: 'Oswald', sans-serif;

  font-size: 14px;

  font-weight: 700;

  color: #f5f5f4;
}

.option-desc {
  font-family: 'Inter', sans-serif;

  font-size: 11px;

  font-weight: 500;

  line-height: 1.4;

  color: rgba(245, 245, 244, 0.48);
}

.custom-select-option.active
.option-label {
  color: #80aaff;
}

.custom-select-option.active
.option-desc {
  color: rgba(160, 188, 255, 0.7);
}


/* ========================================
   CHECK SVG
======================================== */

.option-check {
  width: 18px;

  height: 18px;

  flex-shrink: 0;

  color: #78a3ff;
}


/* ========================================
   ANIMACIÓN
======================================== */

.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;

  transform:
    translateY(-6px) scale(0.985);
}


/* ========================================
   RESPONSIVE
======================================== */

@media (max-width: 640px) {

  .type-switcher {
    display: none;
  }

  .type-select-wrapper {
    display: flex;
  }

  .switcher-wrapper {
    padding:
      22px 16px 4px;
  }

  .custom-select-trigger {
    min-height: 60px;
  }

  .selected-label {
    font-size: 14px;
  }

  .selected-desc {
    font-size: 10.5px;
  }

  .custom-select-option {
    padding: 12px 11px;
  }

}


/* ========================================
   REDUCIR ANIMACIONES
======================================== */

@media (prefers-reduced-motion: reduce) {

  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: none;
  }

  .type-chip,
  .custom-select-trigger,
  .custom-select-option,
  .select-chevron {
    transition: none;
  }

}
</style>
