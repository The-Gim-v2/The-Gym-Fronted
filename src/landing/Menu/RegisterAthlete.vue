<script setup lang="ts">
import { reactive, ref, computed, nextTick } from 'vue';
import NoGymModal from './NoGymModal.vue';

interface Gimnasio {
  id: string;
  nombre: string;
  ciudad: string;
  estado: string;
  direccion: string;
  precioMes: number;
  precioSem: number;
}

const gymsList: Gimnasio[] = [
  { id: 'g1', nombre: 'IronFit Valles Centro', ciudad: 'Ciudad Valles', estado: 'San Luis Potosí', direccion: 'Blvd. Carlos Lasso #120, Centro', precioMes: 650, precioSem: 180 },
  { id: 'g2', nombre: 'IronFit Norte - Plaza San José', ciudad: 'Ciudad Valles', estado: 'San Luis Potosí', direccion: 'Carretera Mante #450, Local 4', precioMes: 600, precioSem: 170 },
  { id: 'g3', nombre: 'Gold Gym Tampico', ciudad: 'Tampico', estado: 'Tamaulipas', direccion: 'Av. Hidalgo #250', precioMes: 700, precioSem: 200 },
  { id: 'g4', nombre: 'PowerZone Ciudad Madero', ciudad: 'Ciudad Madero', estado: 'Tamaulipas', direccion: 'Av. Universidad #88', precioMes: 550, precioSem: 150 }
];

const fileInput = ref<HTMLInputElement | null>(null);
const previewImage = ref<string | null>(null);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const submitted = ref(false);
const errorMessage = ref<string | null>(null);
const showNoGymModal = ref(false);
const gymSearch = ref('');
const gymSearchInput = ref<HTMLInputElement | null>(null);
const gymPickerRef = ref<HTMLElement | null>(null);
const isGymDropdownOpen = ref(false);
const selectedGymId = ref<string | null>(null);

const selectedGym = computed(() => gymsList.find(g => g.id === selectedGymId.value) || null);

const filteredGyms = computed(() => {
  const q = gymSearch.value.trim().toLowerCase();
  if (!q) return gymsList;
  return gymsList.filter(g => g.nombre.toLowerCase().includes(q) || g.ciudad.toLowerCase().includes(q) || g.estado.toLowerCase().includes(q));
});

const form = reactive({
  nombres: '',
  apellidoP: '',
  apellidoM: '',
  fechaNac: '',
  celular: '',
  email: '',
  password: '',
  confirmPassword: '',
  peso: '',
  altura: '',
  tipoMembresia: 'mes' as 'mes' | 'sem'
});

const selectGym = (gym: Gimnasio) => {
  selectedGymId.value = gym.id;
  gymSearch.value = '';
  isGymDropdownOpen.value = false;
};

const clearGym = () => {
  selectedGymId.value = null;
};

const triggerFileInput = () => fileInput.value?.click();

const onFileSelected = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) previewImage.value = URL.createObjectURL(file);
};

const finishRegister = () => {
  console.log('Registro de atleta:', { ...form, gimnasioId: selectedGymId.value });
  submitted.value = true;
};

const handleRegisterClick = () => {
  errorMessage.value = null;
  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Las contraseñas no coinciden. Por favor, verifícalas.';
    return;
  }
  if (!selectedGymId.value) {
    showNoGymModal.value = true;
    return;
  }
  finishRegister();
};

const onAddGym = async () => {
  showNoGymModal.value = false;
  await nextTick();
  gymPickerRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    <NoGymModal v-if="showNoGymModal" rol="atleta" @add="onAddGym" @skip="onSkipGym" @close="showNoGymModal = false" />

    <main class="main-content">
      <div class="register-card">
        <div class="header-section">
          <h1 class="title">REGISTRO DE <span>ATLETA</span></h1>
          <p>Únete como miembro a uno de nuestros gimnasios afiliados</p>
        </div>

        <div v-if="submitted" class="alert success">¡Solicitud enviada con éxito! El gimnasio revisará tu registro y te contactará pronto.</div>
        <div v-if="errorMessage" class="alert error">{{ errorMessage }}</div>

        <form @submit.prevent="handleRegisterClick">
          <div class="rg-grid">

            <!-- COLUMNA IZQUIERDA -->
            <div class="form-column">
              <h3 class="section-title first">Fotografía</h3>

              <div class="upload-container">
                <div class="image-preview" @click="triggerFileInput">
                  <img v-if="previewImage" :src="previewImage" class="profile-img" alt="Vista previa" />
                  <div v-else class="upload-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                    <span>Subir foto</span>
                  </div>
                </div>
                <input ref="fileInput" type="file" accept="image/*" hidden @change="onFileSelected" />
                <p>Sube una fotografía reciente para tu expediente de atleta</p>
              </div>

              <h3 class="section-title">Datos personales</h3>

              <div class="fields">
                <div class="field">
                  <label for="nombres">Nombre(s)</label>
                  <input id="nombres" v-model="form.nombres" type="text" placeholder="Ingresa tus nombres" required />
                </div>

                <div class="field-row">
                  <div class="field">
                    <label for="apellidoP">Apellido paterno</label>
                    <input id="apellidoP" v-model="form.apellidoP" type="text" placeholder="Paterno" required />
                  </div>
                  <div class="field">
                    <label for="apellidoM">Apellido materno</label>
                    <input id="apellidoM" v-model="form.apellidoM" type="text" placeholder="Materno" required />
                  </div>
                </div>

                <div class="field-row">
                  <div class="field">
                    <label for="fechaNac">Fecha de nacimiento</label>
                    <input id="fechaNac" v-model="form.fechaNac" type="date" required />
                  </div>
                  <div class="field">
                    <label for="celular">Teléfono celular</label>
                    <input id="celular" v-model="form.celular" type="tel" placeholder="Ej. 4811234567" required />
                  </div>
                </div>

                <div class="field-row">
                  <div class="field">
                    <label for="peso">Peso (kg) <small>Opcional</small></label>
                    <input id="peso" v-model="form.peso" type="text" inputmode="decimal" placeholder="Ej. 70" />
                  </div>
                  <div class="field">
                    <label for="altura">Altura (m) <small>Opcional</small></label>
                    <input id="altura" v-model="form.altura" type="text" inputmode="decimal" placeholder="Ej. 1.75" />
                  </div>
                </div>
              </div>
            </div>

            <!-- COLUMNA DERECHA -->
            <div class="form-column">
              <h3 class="section-title first">Cuenta de acceso</h3>

              <div class="fields">
                <div class="field">
                  <label for="email">Correo electrónico</label>
                  <input id="email" v-model="form.email" type="email" placeholder="tu@correo.com" required />
                </div>

                <div class="field-row">
                  <div class="field">
                    <label for="password">Contraseña</label>
                    <div class="password-field">
                      <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" required />
                      <button type="button" @click="showPassword = !showPassword" aria-label="Mostrar contraseña">
                        <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                          <rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div class="field">
                    <label for="confirmPassword">Confirmar contraseña</label>
                    <div class="password-field">
                      <input id="confirmPassword" v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" placeholder="••••••••" required />
                      <button type="button" @click="showConfirmPassword = !showConfirmPassword" aria-label="Mostrar contraseña">
                        <svg v-if="showConfirmPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                          <rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <h3 class="section-title">Tu gimnasio <small>Opcional</small></h3>

              <div ref="gymPickerRef" class="gym-picker">
                <div v-if="!selectedGym" class="field">
                  <label for="gymSearch">Buscar gimnasio</label>
                  <input id="gymSearch" ref="gymSearchInput" v-model="gymSearch" type="text" placeholder="Nombre o ciudad del gimnasio..." autocomplete="off" @focus="isGymDropdownOpen = true" />
                </div>

                <div v-if="!selectedGym && isGymDropdownOpen" class="gym-dropdown">
                  <button v-for="gym in filteredGyms" :key="gym.id" type="button" class="gym-option" @click="selectGym(gym)">
                    <span><strong>{{ gym.nombre }}</strong><small>{{ gym.ciudad }}, {{ gym.estado }}</small></span>
                    <b>${{ gym.precioMes }}/mes</b>
                  </button>
                  <div v-if="filteredGyms.length === 0" class="gym-empty">No se encontraron gimnasios.</div>
                </div>

                <div v-if="selectedGym" class="selected-gym">
                  <div>
                    <strong>{{ selectedGym.nombre }}</strong>
                    <span>{{ selectedGym.direccion }} · {{ selectedGym.ciudad }}, {{ selectedGym.estado }}</span>
                  </div>
                  <button type="button" @click="clearGym">Cambiar</button>
                </div>
              </div>

              <!-- MEMBRESÍA -->
              <div v-if="selectedGym" class="membership">
                <label>Tipo de membresía</label>

                <div class="membership-options">
                  <button type="button" class="membership-option" :class="{ active: form.tipoMembresia === 'mes' }" @click="form.tipoMembresia = 'mes'">
                    <span>
                      <strong>Mensual</strong>
                      <small>Pago cada mes</small>
                    </span>
                    <b>${{ selectedGym.precioMes }}</b>
                  </button>

                  <button type="button" class="membership-option" :class="{ active: form.tipoMembresia === 'sem' }" @click="form.tipoMembresia = 'sem'">
                    <span>
                      <strong>Semanal</strong>
                      <small>Pago cada semana</small>
                    </span>
                    <b>${{ selectedGym.precioSem }}</b>
                  </button>
                </div>
              </div>

              <div class="actions">
                <button type="submit" class="submit-btn">
                  Registrarme como atleta
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                  </svg>
                </button>

                <p class="login-link">
                  ¿Ya tienes cuenta?
                  <router-link :to="{ name: 'login' }">Inicia sesión</router-link>
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
.register-page { position: relative; color: #f5f5f4; font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
.main-content { display: flex; justify-content: center; width: 100%; padding: 24px clamp(16px, 3vw, 40px) 40px; box-sizing: border-box; }

.register-card { width: 100%; max-width: 1020px; padding: clamp(26px, 3vw, 40px); box-sizing: border-box; background: linear-gradient(145deg, rgba(19,19,20,.94), rgba(12,12,13,.96)); border: 1px solid rgba(255,255,255,.08); border-radius: 22px; box-shadow: 0 28px 65px rgba(0,0,0,.45), inset 0 1px rgba(255,255,255,.025); }

.header-section { margin-bottom: 32px; text-align: center; }
.header-section .title { margin: 0 0 8px; font-family: 'Anton', sans-serif; font-size: clamp(1.8rem,4vw,2.35rem); font-weight: 400; line-height: 1.1; letter-spacing: -.4px; }
.header-section .title span { color: #4e7fe8; }
.header-section p { margin: 0; color: rgba(245,245,244,.48); font-size: 13px; line-height: 1.5; }

.alert { margin-bottom: 22px; padding: 13px 15px; border-radius: 10px; font-size: 13px; font-weight: 500; }
.alert.success { color: #a9c0f5; background: rgba(28,79,214,.1); border: 1px solid rgba(78,119,218,.3); }
.alert.error { color: #fca5a5; background: rgba(239,68,68,.09); border: 1px solid rgba(239,68,68,.28); }

.rg-grid { display: grid; grid-template-columns: 1fr; gap: clamp(30px,4vw,48px); align-items: start; }
.form-column, .fields, .field { display: flex; flex-direction: column; }
.form-column { gap: 15px; min-width: 0; }
.fields { gap: 14px; }
.field { gap: 7px; min-width: 0; }
.field-row { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }

.section-title { display: flex; align-items: center; gap: 7px; margin: 16px 0 1px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,.07); color: #6e94e9; font-family: inherit; font-size: 11px; font-weight: 700; letter-spacing: .7px; text-transform: uppercase; }
.section-title.first { margin-top: 0; }
.section-title small, label small { padding: 2px 6px; border-radius: 5px; background: rgba(255,255,255,.05); color: rgba(245,245,244,.35); font-size: 8px; font-weight: 600; letter-spacing: .3px; text-transform: uppercase; }

label { color: rgba(245,245,244,.72); font-family: inherit; font-size: 11px; font-weight: 600; line-height: 1.4; }
input { width: 100%; min-width: 0; min-height: 46px; padding: 11px 13px; box-sizing: border-box; background: rgba(255,255,255,.025); border: 1px solid rgba(255,255,255,.105); border-radius: 10px; outline: none; color: #f5f5f4; font-family: inherit; font-size: 13px; font-weight: 500; transition: .2s ease; }
input::placeholder { color: rgba(245,245,244,.27); font-weight: 400; }
input:hover { border-color: rgba(255,255,255,.17); }
input:focus { border-color: #3c69d5; background: rgba(255,255,255,.035); box-shadow: 0 0 0 3px rgba(28,79,214,.11); }
input[type="date"] { color-scheme: dark; }

.upload-container { display: flex; align-items: center; gap: 15px; padding: 13px; background: rgba(255,255,255,.018); border: 1px dashed rgba(255,255,255,.13); border-radius: 12px; }
.upload-container p { margin: 0; color: rgba(245,245,244,.43); font-size: 11.5px; line-height: 1.5; }
.image-preview { width: 68px; height: 68px; flex-shrink: 0; display: grid; place-items: center; overflow: hidden; background: #111214; border: 1px solid rgba(255,255,255,.1); border-radius: 10px; cursor: pointer; }
.profile-img { width: 100%; height: 100%; object-fit: cover; }
.upload-placeholder { display: flex; flex-direction: column; align-items: center; gap: 5px; color: rgba(245,245,244,.38); }
.upload-placeholder svg { width: 20px; height: 20px; }
.upload-placeholder span { font-size: 8px; font-weight: 600; text-transform: uppercase; }

.password-field { position: relative; }
.password-field input { padding-right: 42px; }
.password-field button { position: absolute; top: 0; right: 0; width: 42px; height: 100%; display: grid; place-items: center; padding: 0; border: 0; background: transparent; color: rgba(245,245,244,.36); cursor: pointer; }
.password-field button:hover { color: rgba(245,245,244,.75); }
.password-field svg { width: 17px; height: 17px; }

.gym-picker { position: relative; min-width: 0; }
.gym-dropdown { max-height: 240px; margin-top: 7px; overflow-y: auto; background: #111214; border: 1px solid rgba(255,255,255,.1); border-radius: 11px; box-shadow: 0 18px 38px rgba(0,0,0,.45); }
.gym-option { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 13px; background: transparent; border: 0; border-bottom: 1px solid rgba(255,255,255,.05); color: inherit; text-align: left; cursor: pointer; }
.gym-option:last-child { border-bottom: 0; }
.gym-option:hover { background: rgba(49,94,200,.1); }
.gym-option > span { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.gym-option strong { overflow: hidden; font-size: 12px; font-weight: 600; white-space: nowrap; text-overflow: ellipsis; }
.gym-option small { overflow: hidden; color: rgba(245,245,244,.4); font-size: 10px; white-space: nowrap; text-overflow: ellipsis; }
.gym-option b { flex-shrink: 0; color: #7599e9; font-size: 11px; font-weight: 600; }
.gym-empty { padding: 15px; color: rgba(245,245,244,.4); font-size: 11px; text-align: center; }

.selected-gym { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 13px 14px; background: rgba(28,79,214,.065); border: 1px solid rgba(65,108,210,.25); border-radius: 11px; }
.selected-gym > div { min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.selected-gym strong { font-size: 12.5px; font-weight: 600; }
.selected-gym span { color: rgba(245,245,244,.42); font-size: 10.5px; line-height: 1.4; }
.selected-gym button { padding: 7px 10px; border: 1px solid rgba(255,255,255,.1); border-radius: 7px; background: rgba(255,255,255,.04); color: rgba(245,245,244,.7); font-family: inherit; font-size: 10px; font-weight: 600; cursor: pointer; }

/* MEMBRESÍA */
.membership { display: flex; flex-direction: column; gap: 8px; margin-top: 2px; }
.membership-options { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 9px; }
.membership-option { min-width: 0; min-height: 62px; display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 12px; background: rgba(255,255,255,.018); border: 1px solid rgba(255,255,255,.1); border-radius: 10px; color: rgba(245,245,244,.72); text-align: left; cursor: pointer; transition: border-color .2s ease, background .2s ease, color .2s ease; }
.membership-option > span { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.membership-option strong { font-family: inherit; font-size: 11.5px; font-weight: 650; }
.membership-option small { color: rgba(245,245,244,.32); font-family: inherit; font-size: 9px; font-weight: 400; }
.membership-option b { flex-shrink: 0; color: rgba(245,245,244,.55); font-family: inherit; font-size: 12px; font-weight: 650; }
.membership-option:hover:not(.active) { background: rgba(255,255,255,.035); border-color: rgba(255,255,255,.17); }
.membership-option.active { background: rgba(28,79,214,.11); border-color: rgba(74,119,224,.65); color: #f5f7ff; box-shadow: inset 0 0 0 1px rgba(76,124,236,.06); }
.membership-option.active small { color: rgba(154,184,249,.55); }
.membership-option.active b { color: #8eb0fa; }

.actions { display: flex; flex-direction: column; gap: 12px; margin-top: 18px; }
.submit-btn { width: 100%; min-height: 49px; display: flex; align-items: center; justify-content: center; gap: 9px; padding: 12px 16px; border: 0; border-radius: 10px; background: #1c4fd6; color: #fff; font-family: inherit; font-size: 12px; font-weight: 700; letter-spacing: .35px; text-transform: uppercase; cursor: pointer; box-shadow: 0 8px 22px rgba(28,79,214,.22); transition: .2s ease; }
.submit-btn:hover { background: #2459df; transform: translateY(-1px); box-shadow: 0 11px 26px rgba(28,79,214,.28); }
.submit-btn svg { width: 17px; height: 17px; }
.login-link { margin: 0; color: rgba(245,245,244,.4); font-size: 11.5px; text-align: center; }
.login-link a { color: #7197eb; font-weight: 600; text-decoration: none; }
.login-link a:hover { text-decoration: underline; }

@media (min-width: 900px) {
  .rg-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
}

@media (max-width: 768px) {
  .main-content { padding: 18px 14px 30px; }
  .register-card { padding: 22px 18px; border-radius: 18px; }
  .field-row { grid-template-columns: 1fr; }
  .membership-options { grid-template-columns: 1fr; }
}

@media (max-width: 420px) {
  .register-card { padding: 20px 15px; }
  .header-section .title { font-size: 1.7rem; }
  .selected-gym { flex-direction: column; align-items: stretch; }
}
</style>