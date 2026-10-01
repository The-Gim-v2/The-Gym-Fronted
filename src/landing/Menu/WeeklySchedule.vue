<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue';

type Horario = { open: string; close: string };
type Modo = 'semana' | 'lv' | 'lv_sab' | 'custom';

const props = withDefaults(defineProps<{
  modelValue?: Record<string, Horario>;
  openLabel?: string;
  closeLabel?: string;
  daysLabel?: string;
  defaultOpen?: string;
  defaultClose?: string;
}>(), {
  modelValue: () => ({}),
  openLabel: 'Apertura',
  closeLabel: 'Cierre',
  daysLabel: 'Días de apertura',
  defaultOpen: '06:00',
  defaultClose: '22:00'
});

const emit = defineEmits<{
  (e: 'update:modelValue', v: Record<string, Horario>): void
}>();

const copy = (h: Horario): Horario => ({ open: h.open, close: h.close });

const allDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const weekdays = allDays.slice(0, 5);

const modos: { value: Modo; label: string; desc: string }[] = [
  { value: 'semana', label: 'Toda la semana', desc: 'Lunes a domingo' },
  { value: 'lv', label: 'Lunes a viernes', desc: 'Fin de semana cerrado' },
  { value: 'lv_sab', label: 'Lun–Vie + sábado', desc: 'Horario adicional el sábado' },
  { value: 'custom', label: 'Por día', desc: 'Configura cada día' }
];

const modo = ref<Modo>('semana');

const semana = reactive<Horario>({
  open: props.defaultOpen,
  close: props.defaultClose
});

const lv = reactive<Horario>({
  open: props.defaultOpen,
  close: props.defaultClose
});

const sab = reactive<Horario>({
  open: '08:00',
  close: '14:00'
});

const customDays = ref<string[]>([]);
const customHorarios = reactive<Record<string, Horario>>({});

const horarios = computed<Record<string, Horario>>(() => {
  const out: Record<string, Horario> = {};

  if (modo.value === 'semana') {
    allDays.forEach(d => out[d] = copy(semana));
  } else if (modo.value === 'lv') {
    weekdays.forEach(d => out[d] = copy(lv));
  } else if (modo.value === 'lv_sab') {
    weekdays.forEach(d => out[d] = copy(lv));
    out['Sáb'] = copy(sab);
  } else {
    allDays.forEach(d => {
      const h = customHorarios[d];
      if (customDays.value.includes(d) && h) out[d] = copy(h);
    });
  }

  return out;
});

watch(
  horarios,
  v => emit('update:modelValue', v),
  { immediate: true, deep: true }
);

const blocks = computed(() => {
  if (modo.value === 'semana') {
    return [{ key: 'semana', label: 'Lunes a domingo', h: semana }];
  }

  if (modo.value === 'lv') {
    return [{ key: 'lv', label: 'Lunes a viernes', h: lv }];
  }

  if (modo.value === 'lv_sab') {
    return [
      { key: 'lv', label: 'Lunes a viernes', h: lv },
      { key: 'sab', label: 'Sábado', h: sab }
    ];
  }

  return [];
});

const closedNote = computed(() => {
  if (modo.value === 'lv') return 'Sábado y domingo quedan cerrados.';
  if (modo.value === 'lv_sab') return 'Domingo queda cerrado.';
  return '';
});

const setModo = (m: Modo) => {
  if (m === 'custom' && customDays.value.length === 0) {
    Object.entries(horarios.value).forEach(([d, h]) => {
      customDays.value.push(d);
      customHorarios[d] = copy(h);
    });
  }

  modo.value = m;
};

const toggleDay = (day: string) => {
  const i = customDays.value.indexOf(day);

  if (i > -1) {
    customDays.value.splice(i, 1);
    delete customHorarios[day];
  } else {
    customDays.value.push(day);
    customHorarios[day] = {
      open: props.defaultOpen,
      close: props.defaultClose
    };
  }
};

const setCustom = (
  day: string,
  field: 'open' | 'close',
  e: Event
) => {
  const h = customHorarios[day];

  if (h) {
    h[field] = (e.target as HTMLInputElement).value;
  }
};
</script>

<template>
  <div class="ws">

    <!-- MODOS -->
    <div
      class="ws-modes"
      role="radiogroup"
      aria-label="Tipo de horario"
    >
      <button
        v-for="m in modos"
        :key="m.value"
        type="button"
        class="ws-mode"
        role="radio"
        :aria-checked="modo === m.value"
        :class="{ active: modo === m.value }"
        @click="setModo(m.value)"
      >
        <span class="ws-radio">
          <span></span>
        </span>

        <span class="ws-mode-content">
          <strong>{{ m.label }}</strong>
          <small>{{ m.desc }}</small>
        </span>
      </button>
    </div>

    <!-- HORARIOS FIJOS -->
    <template v-if="modo !== 'custom'">

      <div
        v-for="b in blocks"
        :key="b.key"
        class="ws-row"
      >
        <div class="ws-row-header">
          <span class="ws-day">{{ b.label }}</span>
          <span class="ws-status">Abierto</span>
        </div>

        <div class="ws-times">

          <div class="ws-time">
            <label :for="`ws-${b.key}-open`">
              {{ openLabel }}
            </label>

            <div class="ws-time-input">
              <input
                :id="`ws-${b.key}-open`"
                v-model="b.h.open"
                type="time"
                required
              />
            </div>
          </div>

          <div class="ws-time">
            <label :for="`ws-${b.key}-close`">
              {{ closeLabel }}
            </label>

            <div class="ws-time-input">
              <input
                :id="`ws-${b.key}-close`"
                v-model="b.h.close"
                type="time"
                required
              />
            </div>
          </div>

        </div>
      </div>

      <p v-if="closedNote" class="ws-note">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
        >
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 8v4l2.5 2.5"/>
        </svg>

        {{ closedNote }}
      </p>

    </template>

    <!-- POR DÍA -->
    <template v-else>

      <div class="ws-custom-header">
        <span>{{ daysLabel }}</span>
        <small>Selecciona los días disponibles</small>
      </div>

      <div class="ws-chips">
        <button
          v-for="day in allDays"
          :key="day"
          type="button"
          class="ws-chip"
          :class="{ active: customDays.includes(day) }"
          @click="toggleDay(day)"
        >
          {{ day }}
        </button>
      </div>

      <p
        v-if="customDays.length === 0"
        class="ws-empty"
      >
        Selecciona al menos un día para configurar el horario.
      </p>

      <div
        v-if="customDays.length > 0"
        class="ws-custom-list"
      >
        <template
          v-for="day in allDays"
          :key="day"
        >
          <div
            v-if="customHorarios[day]"
            class="ws-row custom"
          >
            <div class="ws-row-header">
              <span class="ws-day">{{ day }}</span>
              <span class="ws-status">Abierto</span>
            </div>

            <div class="ws-times">

              <div class="ws-time">
                <label :for="`ws-open-${day}`">
                  {{ openLabel }}
                </label>

                <div class="ws-time-input">
                  <input
                    :id="`ws-open-${day}`"
                    type="time"
                    :value="customHorarios[day]?.open"
                    required
                    @input="setCustom(day, 'open', $event)"
                  />
                </div>
              </div>

              <div class="ws-time">
                <label :for="`ws-close-${day}`">
                  {{ closeLabel }}
                </label>

                <div class="ws-time-input">
                  <input
                    :id="`ws-close-${day}`"
                    type="time"
                    :value="customHorarios[day]?.close"
                    required
                    @input="setCustom(day, 'close', $event)"
                  />
                </div>
              </div>

            </div>
          </div>
        </template>
      </div>

    </template>

  </div>
</template>

<style scoped>
.ws{
  width:100%;
  display:flex;
  flex-direction:column;
  gap:12px;
  color:#f5f5f4;
  font-family:'Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  box-sizing:border-box;
}

/* =========================
   MODOS
========================= */

.ws-modes{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:7px;
}

.ws-mode{
  position:relative;
  min-width:0;
  min-height:58px;
  display:flex;
  align-items:center;
  gap:10px;
  padding:10px 11px;
  border:1px solid rgba(255,255,255,.085);
  border-radius:10px;
  background:rgba(255,255,255,.018);
  color:#f5f5f4;
  font-family:inherit;
  text-align:left;
  cursor:pointer;
  transition:
    border-color .2s ease,
    background .2s ease,
    box-shadow .2s ease;
}

.ws-mode:hover:not(.active){
  background:rgba(255,255,255,.035);
  border-color:rgba(255,255,255,.14);
}

.ws-mode.active{
  background:rgba(28,79,214,.075);
  border-color:rgba(69,112,214,.4);
  box-shadow:inset 0 0 0 1px rgba(61,105,211,.05);
}

/* RADIO */

.ws-radio{
  width:16px;
  height:16px;
  flex:0 0 16px;
  display:grid;
  place-items:center;
  border:1.5px solid rgba(255,255,255,.22);
  border-radius:50%;
  transition:.2s ease;
}

.ws-radio span{
  width:7px;
  height:7px;
  border-radius:50%;
  background:#5f89e8;
  opacity:0;
  transform:scale(.4);
  transition:.2s ease;
}

.ws-mode.active .ws-radio{
  border-color:#5f89e8;
}

.ws-mode.active .ws-radio span{
  opacity:1;
  transform:scale(1);
}

.ws-mode-content{
  min-width:0;
  display:flex;
  flex-direction:column;
  gap:3px;
}

.ws-mode-content strong{
  overflow:hidden;
  color:rgba(245,245,244,.82);
  font-size:11.5px;
  font-weight:600;
  line-height:1.2;
  white-space:nowrap;
  text-overflow:ellipsis;
}

.ws-mode-content small{
  overflow:hidden;
  color:rgba(245,245,244,.34);
  font-size:9px;
  font-weight:400;
  line-height:1.25;
  white-space:nowrap;
  text-overflow:ellipsis;
}

.ws-mode.active .ws-mode-content strong{
  color:#dce7ff;
}

.ws-mode.active .ws-mode-content small{
  color:rgba(190,208,250,.55);
}

/* =========================
   TARJETA HORARIO
========================= */

.ws-row{
  width:100%;
  min-width:0;
  display:flex;
  flex-direction:column;
  gap:10px;
  padding:11px;
  box-sizing:border-box;
  background:rgba(255,255,255,.014);
  border:1px solid rgba(255,255,255,.07);
  border-radius:11px;
}

.ws-row-header{
  width:100%;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  padding-bottom:8px;
  border-bottom:1px solid rgba(255,255,255,.055);
}

.ws-day{
  min-width:0;
  color:rgba(245,245,244,.82);
  font-size:11.5px;
  font-weight:600;
}

.ws-status{
  flex-shrink:0;
  padding:3px 7px;
  border-radius:5px;
  background:rgba(55,163,103,.08);
  color:rgba(113,210,154,.72);
  font-size:8px;
  font-weight:600;
  letter-spacing:.25px;
  text-transform:uppercase;
}

/* =========================
   HORAS
========================= */

.ws-times{
  width:100%;
  min-width:0;
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:8px;
}

.ws-time{
  min-width:0;
  display:flex;
  flex-direction:column;
  gap:5px;
}

.ws-time label{
  color:rgba(245,245,244,.43);
  font-family:inherit;
  font-size:9px;
  font-weight:600;
  letter-spacing:.25px;
  text-transform:uppercase;
}

.ws-time-input{
  width:100%;
  min-width:0;
}

.ws-time input{
  display:block;
  width:100%;
  min-width:0;
  height:39px;
  padding:0 9px;
  box-sizing:border-box;

  background:rgba(255,255,255,.02);
  border:1px solid rgba(255,255,255,.095);
  border-radius:8px;

  outline:none;
  color:rgba(245,245,244,.84);

  font-family:inherit;
  font-size:11.5px;
  font-weight:500;

  color-scheme:dark;

  transition:
    border-color .2s ease,
    background .2s ease,
    box-shadow .2s ease;
}

.ws-time input:hover{
  border-color:rgba(255,255,255,.15);
}

.ws-time input:focus{
  border-color:#3c69d5;
  background:rgba(255,255,255,.03);
  box-shadow:0 0 0 3px rgba(28,79,214,.1);
}

.ws-time input::-webkit-calendar-picker-indicator{
  width:13px;
  height:13px;
  margin:0;
  padding:0;
  opacity:.4;
  cursor:pointer;
}

/* =========================
   NOTA
========================= */

.ws-note{
  display:flex;
  align-items:center;
  gap:6px;
  margin:0;
  padding:0 2px;
  color:rgba(245,245,244,.36);
  font-size:9.5px;
  line-height:1.4;
}

.ws-note svg{
  width:13px;
  height:13px;
  flex-shrink:0;
  color:rgba(245,245,244,.3);
}

/* =========================
   PERSONALIZADO
========================= */

.ws-custom-header{
  display:flex;
  flex-direction:column;
  gap:2px;
}

.ws-custom-header > span{
  color:rgba(245,245,244,.72);
  font-size:11px;
  font-weight:600;
}

.ws-custom-header small{
  color:rgba(245,245,244,.32);
  font-size:9.5px;
}

.ws-chips{
  width:100%;
  display:grid;
  grid-template-columns:repeat(7,minmax(0,1fr));
  gap:5px;
}

.ws-chip{
  min-width:0;
  min-height:35px;
  padding:6px 3px;

  border:1px solid rgba(255,255,255,.085);
  border-radius:8px;

  background:rgba(255,255,255,.018);
  color:rgba(245,245,244,.48);

  font-family:inherit;
  font-size:9.5px;
  font-weight:600;

  cursor:pointer;

  transition:
    border-color .2s ease,
    background .2s ease,
    color .2s ease,
    box-shadow .2s ease;
}

.ws-chip:hover:not(.active){
  border-color:rgba(255,255,255,.15);
  color:rgba(245,245,244,.72);
}

.ws-chip.active{
  border-color:rgba(69,112,214,.42);
  background:rgba(28,79,214,.1);
  color:#9ab7f5;
  box-shadow:inset 0 0 0 1px rgba(28,79,214,.03);
}

.ws-custom-list{
  display:flex;
  flex-direction:column;
  gap:8px;
}

.ws-empty{
  margin:0;
  padding:12px;
  border:1px dashed rgba(255,255,255,.08);
  border-radius:9px;
  color:rgba(245,245,244,.33);
  font-size:10px;
  text-align:center;
}

/* =========================
   RESPONSIVE
========================= */

@media(max-width:768px){
  .ws-modes{
    grid-template-columns:1fr;
  }

  .ws-mode{
    min-height:54px;
  }

  .ws-chips{
    grid-template-columns:repeat(4,minmax(0,1fr));
  }
}

@media(max-width:420px){
  .ws-row{
    padding:10px;
  }

  .ws-times{
    gap:6px;
  }

  .ws-time input{
    height:38px;
    padding:0 7px;
    font-size:11px;
  }

  .ws-chips{
    grid-template-columns:repeat(4,minmax(0,1fr));
  }
}
</style>