<script setup lang="ts">
import { reactive, ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import NoGymModal from './NoGymModal.vue';
import WeeklySchedule from './WeeklySchedule.vue';

interface Sede { id: string; nombre: string; }
interface Gimnasio {
  id: string;
  nombre: string;
  ciudad: string;
  estado: string;
  sedes: Sede[];
}

const gymsList: Gimnasio[] = [
  {
    id: 'g1', nombre: 'IronFit', ciudad: 'Ciudad Valles', estado: 'San Luis Potosí',
    sedes: [
      { id: 'sede_centro', nombre: 'IronFit Valles Centro' },
      { id: 'sede_norte', nombre: 'IronFit Norte - Plaza San José' }
    ]
  },
  {
    id: 'g2', nombre: 'Gold Gym', ciudad: 'Tampico', estado: 'Tamaulipas',
    sedes: [
      { id: 'sede_tampico_centro', nombre: 'Gold Gym Tampico Centro' },
      { id: 'sede_tampico_sur', nombre: 'Gold Gym Tampico Sur' }
    ]
  },
  {
    id: 'g3', nombre: 'PowerZone', ciudad: 'Ciudad Madero', estado: 'Tamaulipas',
    sedes: [{ id: 'sede_madero', nombre: 'PowerZone Ciudad Madero' }]
  }
];

const fileInput = ref<HTMLInputElement | null>(null);
const avatarPreview = ref<string | null>(null);
const submitted = ref(false);
const errorMessage = ref<string | null>(null);
const showNoGymModal = ref(false);

const gymSearch = ref('');
const gymSearchInput = ref<HTMLInputElement | null>(null);
const gymPickerRef = ref<HTMLElement | null>(null);
const isGymDropdownOpen = ref(false);
const selectedGymId = ref<string | null>(null);

const isSedeDropdownOpen = ref(false);
const sedeDropdownRef = ref<HTMLElement | null>(null);

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const selectedGym = computed(() =>
  gymsList.find(g => g.id === selectedGymId.value) || null
);

const filteredGyms = computed(() => {
  const q = gymSearch.value.trim().toLowerCase();
  if (!q) return gymsList;

  return gymsList.filter(g =>
    g.nombre.toLowerCase().includes(q) ||
    g.ciudad.toLowerCase().includes(q) ||
    g.estado.toLowerCase().includes(q)
  );
});

const form = reactive({
  curp: '',
  nombres: '',
  apellidoP: '',
  apellidoM: '',
  fechaNacimiento: '',
  celular: '',
  email: '',
  password: '',
  confirmPassword: '',
  especialidad: '',
  facebook: '',
  instagram: '',
  tiktok: '',
  otrasApps: '',
  horarios: {} as Record<string, { open: string; close: string }>,
  sedes: [] as string[]
});

const selectGym = (gym: Gimnasio) => {
  selectedGymId.value = gym.id;
  gymSearch.value = '';
  isGymDropdownOpen.value = false;
};

const clearGym = () => {
  selectedGymId.value = null;
  isSedeDropdownOpen.value = false;
};

watch(selectedGymId, () => {
  form.sedes = [];
});

const toggleSede = (id: string) => {
  const i = form.sedes.indexOf(id);
  if (i > -1) form.sedes.splice(i, 1);
  else form.sedes.push(id);
};

const getSedesDisplayText = () => {
  if (!selectedGym.value) return 'Primero selecciona un gimnasio';
  if (form.sedes.length === 0) return 'Seleccionar sedes...';

  return selectedGym.value.sedes
    .filter(s => form.sedes.includes(s.id))
    .map(s => s.nombre)
    .join(', ');
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    sedeDropdownRef.value &&
    !sedeDropdownRef.value.contains(event.target as Node)
  ) {
    isSedeDropdownOpen.value = false;
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));

const triggerFileInput = () => fileInput.value?.click();

const handleFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) avatarPreview.value = URL.createObjectURL(file);
};

const finishRegister = () => {
  console.log('Registro de entrenador:', {
    ...form,
    gimnasioId: selectedGymId.value
  });

  submitted.value = true;
};

const handleRegisterClick = () => {
  errorMessage.value = null;

  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Las contraseñas no coinciden. Por favor, verifícalas.';
    return;
  }

  if (Object.keys(form.horarios).length === 0) {
    errorMessage.value = 'Selecciona al menos un día de trabajo con su horario.';
    return;
  }

  if (!selectedGymId.value) {
    showNoGymModal.value = true;
    return;
  }

  if (form.sedes.length === 0) {
    errorMessage.value = 'Selecciona al menos una sede donde vas a trabajar.';
    isSedeDropdownOpen.value = true;
    return;
  }

  finishRegister();
};

const onAddGym = async () => {
  showNoGymModal.value = false;
  await nextTick();

  gymPickerRef.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });

  isGymDropdownOpen.value = true;
  gymSearchInput.value?.focus({ preventScroll: true });
};

const onSkipGym = () => {
  showNoGymModal.value = false;
  finishRegister();
};
</script>

<template>
  <div class="register-page">

    <NoGymModal
      v-if="showNoGymModal"
      rol="entrenador"
      @add="onAddGym"
      @skip="onSkipGym"
      @close="showNoGymModal = false"
    />

    <main class="main-content">
      <div class="register-card">

        <!-- HEADER -->
        <div class="header-section">
          <h1>REGISTRO DE <span>ENTRENADOR</span></h1>
          <p>Completa tu perfil profesional y ofrece tus servicios en nuestros gimnasios afiliados.</p>
        </div>

        <div v-if="submitted" class="alert success">
          ¡Solicitud enviada con éxito! El gimnasio revisará tu perfil y te contactará pronto.
        </div>

        <div v-if="errorMessage" class="alert error">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleRegisterClick">
          <div class="rg-grid">

            <!-- =========================
                 COLUMNA 1
            ========================== -->
            <div class="form-column">

              <h3 class="section-title first">Fotografía</h3>

              <div class="upload-container">
                <div class="image-preview" @click="triggerFileInput">
                  <img
                    v-if="avatarPreview"
                    :src="avatarPreview"
                    class="profile-img"
                    alt="Vista previa"
                  />

                  <div v-else class="upload-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                    <span>Subir</span>
                  </div>
                </div>

                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  hidden
                  @change="handleFileChange"
                />

                <div class="upload-text">
                  <strong>Fotografía de perfil</strong>
                  <span>Sube una fotografía profesional para tu perfil</span>
                </div>
              </div>

              <!-- GIMNASIO -->
              <h3 class="section-title">
                Tu gimnasio
                <small>Opcional</small>
              </h3>

              <div ref="gymPickerRef" class="gym-picker">

                <div v-if="!selectedGym" class="field">
                  <label for="gymSearch">Buscar gimnasio</label>

                  <div class="search-input">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <circle cx="11" cy="11" r="7"/>
                      <path d="m20 20-3.5-3.5"/>
                    </svg>

                    <input
                      id="gymSearch"
                      ref="gymSearchInput"
                      v-model="gymSearch"
                      type="text"
                      placeholder="Nombre o ciudad del gimnasio..."
                      autocomplete="off"
                      @focus="isGymDropdownOpen = true"
                    />
                  </div>
                </div>

                <!-- RESULTADOS -->
                <div
                  v-if="!selectedGym && isGymDropdownOpen"
                  class="gym-dropdown"
                >
                  <button
                    v-for="gym in filteredGyms"
                    :key="gym.id"
                    type="button"
                    class="gym-option"
                    @click="selectGym(gym)"
                  >
                    <span>
                      <strong>{{ gym.nombre }}</strong>
                      <small>{{ gym.ciudad }}, {{ gym.estado }}</small>
                    </span>

                    <span class="gym-sedes">
                      {{ gym.sedes.length }}
                      {{ gym.sedes.length === 1 ? 'sede' : 'sedes' }}
                    </span>
                  </button>

                  <div v-if="filteredGyms.length === 0" class="empty-state">
                    No se encontraron gimnasios con ese nombre.
                  </div>
                </div>

                <!-- GIMNASIO SELECCIONADO -->
                <div v-if="selectedGym" class="selected-gym">
                  <div class="selected-gym-content">
                    <div class="selected-indicator">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>

                    <div>
                      <strong>{{ selectedGym.nombre }}</strong>
                      <span>{{ selectedGym.ciudad }}, {{ selectedGym.estado }}</span>
                    </div>
                  </div>

                  <button type="button" @click="clearGym">
                    Cambiar
                  </button>
                </div>
              </div>

              <!-- SEDES -->
              <div v-if="selectedGym" class="field">
                <label>Sede(s) donde vas a trabajar</label>

                <div ref="sedeDropdownRef" class="custom-select">

                  <button
                    type="button"
                    class="select-trigger"
                    :class="{ open: isSedeDropdownOpen }"
                    @click="isSedeDropdownOpen = !isSedeDropdownOpen"
                  >
                    <span :class="{ placeholder: form.sedes.length === 0 }">
                      {{ getSedesDisplayText() }}
                    </span>

                    <svg
                      :class="{ rotate: isSedeDropdownOpen }"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>

                  <div
                    v-if="isSedeDropdownOpen"
                    class="select-options"
                  >
                    <button
                      v-for="sede in selectedGym.sedes"
                      :key="sede.id"
                      type="button"
                      class="select-option"
                      :class="{ selected: form.sedes.includes(sede.id) }"
                      @click="toggleSede(sede.id)"
                    >
                      <span class="checkbox">
                        <svg
                          v-if="form.sedes.includes(sede.id)"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="3"
                        >
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </span>

                      <span>{{ sede.nombre }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- =========================
                 COLUMNA 2
            ========================== -->
            <div class="form-column">

              <h3 class="section-title first">Cuenta de acceso</h3>

              <div class="fields">

                <div class="field">
                  <label for="email">Correo electrónico</label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    placeholder="tu@correo.com"
                    required
                  />
                </div>

                <div class="field-row">

                  <div class="field">
                    <label for="password">Contraseña</label>

                    <div class="password-field">
                      <input
                        id="password"
                        v-model="form.password"
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="••••••••"
                        required
                      />

                      <button
                        type="button"
                        aria-label="Mostrar contraseña"
                        @click="showPassword = !showPassword"
                      >
                        <svg
                          v-if="showPassword"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.8"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>

                        <svg
                          v-else
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.8"
                        >
                          <rect x="3" y="11" width="18" height="10" rx="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div class="field">
                    <label for="confirmPassword">Confirmar contraseña</label>

                    <div class="password-field">
                      <input
                        id="confirmPassword"
                        v-model="form.confirmPassword"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        placeholder="••••••••"
                        required
                      />

                      <button
                        type="button"
                        aria-label="Mostrar contraseña"
                        @click="showConfirmPassword = !showConfirmPassword"
                      >
                        <svg
                          v-if="showConfirmPassword"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.8"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>

                        <svg
                          v-else
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.8"
                        >
                          <rect x="3" y="11" width="18" height="10" rx="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              <h3 class="section-title">Datos personales</h3>

              <div class="fields">

                <div class="field">
                  <label for="curp">CURP</label>
                  <input
                    id="curp"
                    v-model="form.curp"
                    type="text"
                    placeholder="ABCD010101HDF000"
                    maxlength="18"
                    required
                  />
                </div>

                <div class="field-row">
                  <div class="field">
                    <label for="nombres">Nombre(s)</label>
                    <input
                      id="nombres"
                      v-model="form.nombres"
                      type="text"
                      placeholder="Tu(s) nombre(s)"
                      required
                    />
                  </div>

                  <div class="field">
                    <label for="fechaNacimiento">Fecha de nacimiento</label>
                    <input
                      id="fechaNacimiento"
                      v-model="form.fechaNacimiento"
                      type="date"
                      required
                    />
                  </div>
                </div>

                <div class="field-row">
                  <div class="field">
                    <label for="apellidoP">Apellido paterno</label>
                    <input
                      id="apellidoP"
                      v-model="form.apellidoP"
                      type="text"
                      placeholder="Paterno"
                      required
                    />
                  </div>

                  <div class="field">
                    <label for="apellidoM">Apellido materno</label>
                    <input
                      id="apellidoM"
                      v-model="form.apellidoM"
                      type="text"
                      placeholder="Materno"
                      required
                    />
                  </div>
                </div>

                <div class="field">
                  <label for="celular">Teléfono celular</label>
                  <input
                    id="celular"
                    v-model="form.celular"
                    type="tel"
                    placeholder="+52 000 000 0000"
                    required
                  />
                </div>
              </div>
            </div>

            <!-- =========================
                 COLUMNA 3
            ========================== -->
            <div class="form-column rg-col3">

              <h3 class="section-title first">Perfil profesional</h3>

              <div class="fields">

                <div class="field">
                  <label for="especialidad">Especialidad</label>
                  <input
                    id="especialidad"
                    v-model="form.especialidad"
                    type="text"
                    placeholder="Ej. Fuerza, CrossFit, Yoga..."
                    required
                  />
                </div>

                <div class="field-row">
                  <div class="field">
                    <label for="facebook">Facebook</label>
                    <input
                      id="facebook"
                      v-model="form.facebook"
                      type="text"
                      placeholder="usuario_fb"
                    />
                  </div>

                  <div class="field">
                    <label for="instagram">Instagram</label>
                    <input
                      id="instagram"
                      v-model="form.instagram"
                      type="text"
                      placeholder="@usuario_ig"
                    />
                  </div>
                </div>

                <div class="field-row">
                  <div class="field">
                    <label for="tiktok">TikTok</label>
                    <input
                      id="tiktok"
                      v-model="form.tiktok"
                      type="text"
                      placeholder="@usuario_tt"
                    />
                  </div>

                  <div class="field">
                    <label for="otrasApps">Otras redes</label>
                    <input
                      id="otrasApps"
                      v-model="form.otrasApps"
                      type="text"
                      placeholder="Opcional"
                    />
                  </div>
                </div>
              </div>

              <h3 class="section-title">Horario disponible</h3>

              <div class="schedule-wrapper">
                <WeeklySchedule
                  v-model="form.horarios"
                  open-label="Entrada"
                  close-label="Salida"
                  days-label="Días que trabajas"
                  default-open="07:00"
                  default-close="15:00"
                />
              </div>

              <div class="actions">
                <button type="submit" class="submit-btn">
                  <span>Registrarme como entrenador</span>

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                  </svg>
                </button>

                <p class="login-link">
                  ¿Ya tienes cuenta?
                  <router-link :to="{ name: 'login' }">
                    Inicia sesión
                  </router-link>
                </p>
              </div>

            </div>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
.register-page{position:relative;color:#f5f5f4;font-family:'Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.main-content{display:flex;justify-content:center;width:100%;padding:24px clamp(16px,3vw,40px) 40px;box-sizing:border-box}.register-card{width:100%;max-width:1400px;padding:clamp(26px,3vw,40px);box-sizing:border-box;background:linear-gradient(145deg,rgba(19,19,20,.94),rgba(12,12,13,.96));border:1px solid rgba(255,255,255,.08);border-radius:22px;box-shadow:0 28px 65px rgba(0,0,0,.45),inset 0 1px rgba(255,255,255,.025)}

.header-section{text-align:center;margin-bottom:32px}.header-section h1{margin:0 0 8px;font-family:'Anton',sans-serif;font-size:clamp(1.8rem,4vw,2.35rem);font-weight:400;line-height:1.1;letter-spacing:-.4px}.header-section h1 span{color:#4e7fe8}.header-section p{max-width:580px;margin:0 auto;color:rgba(245,245,244,.46);font-size:13px;line-height:1.5}

.alert{margin-bottom:22px;padding:13px 15px;border-radius:10px;font-size:13px;font-weight:500;line-height:1.45}.alert.success{color:#a9c0f5;background:rgba(28,79,214,.1);border:1px solid rgba(78,119,218,.3)}.alert.error{color:#fca5a5;background:rgba(239,68,68,.09);border:1px solid rgba(239,68,68,.28)}

.rg-grid{display:grid;grid-template-columns:1fr;gap:clamp(28px,3vw,42px);align-items:start}.form-column,.fields,.field{display:flex;flex-direction:column}.form-column{gap:14px;min-width:0}.fields{gap:14px}.field{gap:7px;min-width:0}.field-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}

.section-title{display:flex;align-items:center;gap:7px;margin:16px 0 1px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,.07);color:#6e94e9;font-family:inherit;font-size:11px;font-weight:700;letter-spacing:.7px;text-transform:uppercase}.section-title.first{margin-top:0}.section-title small{padding:2px 6px;border-radius:5px;background:rgba(255,255,255,.05);color:rgba(245,245,244,.35);font-size:8px;font-weight:600;letter-spacing:.3px}

label{color:rgba(245,245,244,.72);font-size:11px;font-weight:600;line-height:1.4}input{width:100%;min-width:0;min-height:46px;padding:11px 13px;box-sizing:border-box;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.105);border-radius:10px;outline:none;color:#f5f5f4;font-family:inherit;font-size:13px;font-weight:500;transition:border-color .2s ease,background .2s ease,box-shadow .2s ease}input::placeholder{color:rgba(245,245,244,.27);font-weight:400}input:hover{border-color:rgba(255,255,255,.17)}input:focus{border-color:#3c69d5;background:rgba(255,255,255,.035);box-shadow:0 0 0 3px rgba(28,79,214,.11)}input[type=date]{color-scheme:dark}

.upload-container{display:flex;align-items:center;gap:14px;padding:13px;background:rgba(255,255,255,.018);border:1px dashed rgba(255,255,255,.13);border-radius:12px;transition:.2s ease}.upload-container:hover{border-color:rgba(91,139,240,.36);background:rgba(91,139,240,.02)}.image-preview{width:68px;height:68px;flex-shrink:0;display:grid;place-items:center;overflow:hidden;background:#111214;border:1px solid rgba(255,255,255,.1);border-radius:10px;cursor:pointer}.profile-img{width:100%;height:100%;object-fit:cover}.upload-placeholder{display:flex;flex-direction:column;align-items:center;gap:5px;color:rgba(245,245,244,.38)}.upload-placeholder svg{width:20px;height:20px}.upload-placeholder span{font-size:8px;font-weight:700;letter-spacing:.5px;text-transform:uppercase}.upload-text{display:flex;flex-direction:column;gap:4px}.upload-text strong{color:rgba(245,245,244,.78);font-size:11.5px;font-weight:600}.upload-text span{color:rgba(245,245,244,.36);font-size:10.5px;line-height:1.4}

.search-input{position:relative}.search-input svg{position:absolute;z-index:1;left:13px;top:50%;width:16px;height:16px;transform:translateY(-50%);color:rgba(245,245,244,.34);pointer-events:none}.search-input input{padding-left:38px}

.gym-picker{position:relative}.gym-dropdown{max-height:250px;margin-top:7px;overflow-y:auto;background:#111214;border:1px solid rgba(255,255,255,.1);border-radius:11px;box-shadow:0 18px 38px rgba(0,0,0,.45)}.gym-option{width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 13px;background:transparent;border:0;border-bottom:1px solid rgba(255,255,255,.05);color:inherit;text-align:left;cursor:pointer;transition:background .15s ease}.gym-option:last-child{border-bottom:0}.gym-option:hover{background:rgba(49,94,200,.1)}.gym-option>span:first-child{min-width:0;display:flex;flex-direction:column;gap:3px}.gym-option strong{overflow:hidden;color:rgba(245,245,244,.88);font-size:12px;font-weight:600;white-space:nowrap;text-overflow:ellipsis}.gym-option small{overflow:hidden;color:rgba(245,245,244,.38);font-size:10px;white-space:nowrap;text-overflow:ellipsis}.gym-sedes{flex-shrink:0;padding:4px 7px;border-radius:6px;background:rgba(255,255,255,.045);color:rgba(245,245,244,.43);font-size:9px;font-weight:600}.empty-state{padding:15px;color:rgba(245,245,244,.4);font-size:11px;text-align:center}

.selected-gym{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px 13px;background:rgba(28,79,214,.065);border:1px solid rgba(65,108,210,.25);border-radius:11px}.selected-gym-content{min-width:0;display:flex;align-items:center;gap:10px}.selected-indicator{width:27px;height:27px;flex-shrink:0;display:grid;place-items:center;border-radius:7px;background:rgba(28,79,214,.17);color:#7199f0}.selected-indicator svg{width:13px;height:13px}.selected-gym-content>div:last-child{min-width:0;display:flex;flex-direction:column;gap:3px}.selected-gym strong{overflow:hidden;font-size:12px;font-weight:600;white-space:nowrap;text-overflow:ellipsis}.selected-gym span{color:rgba(245,245,244,.4);font-size:10px}.selected-gym>button{padding:7px 10px;border:1px solid rgba(255,255,255,.1);border-radius:7px;background:rgba(255,255,255,.04);color:rgba(245,245,244,.68);font-family:inherit;font-size:10px;font-weight:600;cursor:pointer;transition:.2s ease}.selected-gym>button:hover{background:rgba(255,255,255,.08);color:#fff}

.custom-select{position:relative}.select-trigger{width:100%;min-height:46px;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border:1px solid rgba(255,255,255,.105);border-radius:10px;background:rgba(255,255,255,.025);color:#f5f5f4;font-family:inherit;font-size:12px;font-weight:500;text-align:left;cursor:pointer;transition:.2s ease}.select-trigger:hover{border-color:rgba(255,255,255,.18)}.select-trigger.open{border-color:#3c69d5;box-shadow:0 0 0 3px rgba(28,79,214,.1)}.select-trigger>span{min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.select-trigger .placeholder{color:rgba(245,245,244,.28)}.select-trigger>svg{width:15px;height:15px;flex-shrink:0;color:rgba(245,245,244,.4);transition:transform .2s ease}.select-trigger>svg.rotate{transform:rotate(180deg)}

.select-options{position:absolute;z-index:100;top:calc(100% + 6px);left:0;width:100%;padding:5px;box-sizing:border-box;background:#121315;border:1px solid rgba(255,255,255,.11);border-radius:10px;box-shadow:0 16px 35px rgba(0,0,0,.55)}.select-option{width:100%;display:flex;align-items:center;gap:9px;padding:9px 10px;border:0;border-radius:7px;background:transparent;color:rgba(245,245,244,.68);font-family:inherit;font-size:11px;text-align:left;cursor:pointer;transition:.15s ease}.select-option:hover{background:rgba(255,255,255,.045);color:#fff}.select-option.selected{background:rgba(28,79,214,.09);color:#dce7ff}.checkbox{width:15px;height:15px;flex-shrink:0;display:grid;place-items:center;border:1px solid rgba(255,255,255,.2);border-radius:4px}.select-option.selected .checkbox{background:#285bd4;border-color:#285bd4;color:#fff}.checkbox svg{width:9px;height:9px}

.password-field{position:relative}.password-field input{padding-right:42px}.password-field button{position:absolute;top:0;right:0;width:42px;height:100%;display:grid;place-items:center;padding:0;border:0;background:transparent;color:rgba(245,245,244,.36);cursor:pointer}.password-field button:hover{color:rgba(245,245,244,.75)}.password-field svg{width:17px;height:17px}

.schedule-wrapper{min-width:0;padding:3px 0}.actions{display:flex;flex-direction:column;gap:12px;margin-top:18px}.submit-btn{width:100%;min-height:49px;display:flex;align-items:center;justify-content:center;gap:9px;padding:12px 16px;border:0;border-radius:10px;background:#1c4fd6;color:#fff;font-family:inherit;font-size:12px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;cursor:pointer;box-shadow:0 8px 22px rgba(28,79,214,.22);transition:background .2s ease,transform .2s ease,box-shadow .2s ease}.submit-btn:hover{background:#2459df;transform:translateY(-1px);box-shadow:0 11px 26px rgba(28,79,214,.28)}.submit-btn svg{width:17px;height:17px;transition:transform .2s ease}.submit-btn:hover svg{transform:translateX(3px)}.login-link{margin:0;color:rgba(245,245,244,.4);font-size:11.5px;text-align:center}.login-link a{color:#7197eb;font-weight:600;text-decoration:none}.login-link a:hover{text-decoration:underline}

@media(min-width:1200px){.rg-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(min-width:900px) and (max-width:1199px){.rg-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.rg-col3{grid-column:1/-1;width:100%;max-width:700px;margin:0 auto}}
@media(max-width:768px){.main-content{padding:18px 14px 30px}.register-card{padding:22px 18px;border-radius:18px}.field-row{grid-template-columns:1fr}}
@media(max-width:420px){.register-card{padding:20px 15px}.header-section h1{font-size:1.7rem}.header-section p{font-size:12px}.upload-container{align-items:flex-start}.selected-gym{align-items:flex-start}}
</style>