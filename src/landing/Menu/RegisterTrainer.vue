<script setup lang="ts">
import { reactive, ref, computed, watch, onMounted, onUnmounted } from 'vue';

// -------------------------------------------------------------------
// Mock de gimnasios afiliados, cada uno con sus sedes. En producción
// esto vendría de la API.
// -------------------------------------------------------------------
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
    sedes: [
      { id: 'sede_madero', nombre: 'PowerZone Ciudad Madero' }
    ]
  }
];

const fileInput = ref<HTMLInputElement | null>(null);
const avatarPreview = ref<string | null>(null);
const submitted = ref(false);
const errorMessage = ref<string | null>(null);

const gymSearch = ref('');
const isGymDropdownOpen = ref(false);
const selectedGymId = ref<string | null>(null);
const selectedGym = computed(() => gymsList.find(g => g.id === selectedGymId.value) || null);

const filteredGyms = computed(() => {
  const q = gymSearch.value.trim().toLowerCase();
  if (!q) return gymsList;
  return gymsList.filter(g =>
    g.nombre.toLowerCase().includes(q) ||
    g.ciudad.toLowerCase().includes(q) ||
    g.estado.toLowerCase().includes(q)
  );
});

const isSedeDropdownOpen = ref(false);
const sedeDropdownRef = ref<HTMLElement | null>(null);

const selectGym = (gym: Gimnasio) => {
  selectedGymId.value = gym.id;
  gymSearch.value = '';
  isGymDropdownOpen.value = false;
};

const clearGym = () => {
  selectedGymId.value = null;
};

// Si cambia el gimnasio seleccionado, las sedes marcadas ya no aplican
watch(selectedGymId, () => {
  form.sedes = [];
});

const toggleSede = (id: string) => {
  const index = form.sedes.indexOf(id);
  if (index > -1) {
    form.sedes.splice(index, 1);
  } else {
    form.sedes.push(id);
  }
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
  if (sedeDropdownRef.value && !sedeDropdownRef.value.contains(event.target as Node)) {
    isSedeDropdownOpen.value = false;
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));

const form = reactive({
  curp: '', nombres: '', apellidoP: '', apellidoM: '',
  fechaNacimiento: '', celular: '',
  email: '', password: '', confirmPassword: '',
  especialidad: '',
  facebook: '', instagram: '', tiktok: '', otrasApps: '',
  horaEntrada: '', horaSalida: '',
  sedes: [] as string[]
});

const triggerFileInput = () => fileInput.value?.click();
const handleFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) avatarPreview.value = URL.createObjectURL(file);
};

const handleRegisterClick = () => {
  errorMessage.value = null;

  // El gimnasio y la(s) sede(s) son opcionales: si se eligió un gimnasio,
  // pedimos al menos una sede; si no se eligió gimnasio, se puede continuar.
  if (selectedGymId.value && form.sedes.length === 0) {
    errorMessage.value = 'Selecciona al menos una sede donde vas a entrenar, o quita el gimnasio si aún no lo decides.';
    return;
  }

  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Las contraseñas no coinciden. Por favor, verifícalas.';
    return;
  }

  // Aquí iría la llamada real a la API, enviando form + selectedGymId
  console.log('Registro de entrenador:', { ...form, gimnasioId: selectedGymId.value });
  submitted.value = true;
};
</script>

<template>
  <div class="register-page">
    <main class="main-content">
      <div class="register-card">
        <div class="header-section">
          <h1 class="title">REGISTRO DE <span class="highlight-text">ENTRENADOR</span></h1>
          <p class="subtitle">Ofrece tus servicios en uno de nuestros gimnasios afiliados</p>
        </div>

        <div v-if="submitted" class="alert-success">
          ¡Solicitud enviada con éxito! El gimnasio revisará tu perfil y te contactará pronto.
        </div>

        <div v-if="errorMessage" class="alert-error">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleRegisterClick">
          <div class="rg-grid">

            <!-- Columna 1: Foto + gimnasio/sede -->
            <div class="form-column">
              <h3 class="section-divider first">Fotografía</h3>
              <div class="upload-container">
                <div class="image-preview" @click="triggerFileInput">
                  <img v-if="avatarPreview" :src="avatarPreview" class="profile-img" alt="Vista previa" />
                  <div v-else class="upload-placeholder">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                    <span>Subir</span>
                  </div>
                </div>
                <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" style="display: none" />
                <p class="upload-info">Sube una fotografía profesional para tu perfil</p>
              </div>

              <h3 class="section-divider">
                ¿En qué gimnasio quieres entrenar?
                <span class="optional-tag">Opcional</span>
              </h3>
              <p class="optional-hint">
                Puedes elegir el gimnasio ahora o hacerlo más tarde desde tu perfil.
              </p>

              <div class="gym-picker">
                <div v-if="!selectedGym" class="input-group">
                  <label for="gymSearch">Buscar gimnasio</label>
                  <input
                    id="gymSearch"
                    type="text"
                    v-model="gymSearch"
                    placeholder="Nombre o ciudad del gimnasio..."
                    @focus="isGymDropdownOpen = true"
                  />
                </div>

                <div v-if="!selectedGym && isGymDropdownOpen" class="gym-dropdown-list">
                  <div
                    v-for="gym in filteredGyms"
                    :key="gym.id"
                    class="gym-option"
                    @click="selectGym(gym)"
                  >
                    <div class="gym-option-main">
                      <strong>{{ gym.nombre }}</strong>
                      <span>{{ gym.ciudad }}, {{ gym.estado }} · {{ gym.sedes.length }} sede(s)</span>
                    </div>
                  </div>
                  <div v-if="filteredGyms.length === 0" class="gym-option-empty">
                    No se encontraron gimnasios con ese nombre.
                  </div>
                </div>

                <div v-if="!selectedGym" class="skip-gym-row">
                  <span>¿Aún no sabes en cuál?</span>
                  <button type="button" class="skip-gym-btn" @click="isGymDropdownOpen = false">
                    Continuar sin seleccionar gimnasio
                  </button>
                </div>

                <div v-if="selectedGym" class="selected-gym-card">
                  <div class="selected-gym-info">
                    <strong>{{ selectedGym.nombre }}</strong>
                    <span>{{ selectedGym.ciudad }}, {{ selectedGym.estado }}</span>
                  </div>
                  <button type="button" class="change-gym-btn" @click="clearGym">Cambiar</button>
                </div>
              </div>

              <div v-if="selectedGym" class="input-group" style="margin-top: 14px;">
                <label>Sede(s) donde vas a entrenar</label>
                <div class="custom-multiselect" ref="sedeDropdownRef">
                  <div
                    class="select-box-trigger"
                    @click="isSedeDropdownOpen = !isSedeDropdownOpen"
                  >
                    <span :class="{ 'placeholder-text': form.sedes.length === 0 }">
                      {{ getSedesDisplayText() }}
                    </span>
                    <svg class="dropdown-arrow" :class="{ rotate: isSedeDropdownOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>

                  <div class="dropdown-options-list" v-if="isSedeDropdownOpen && selectedGym">
                    <div
                      v-for="sede in selectedGym.sedes"
                      :key="sede.id"
                      class="dropdown-option-item"
                      :class="{ selected: form.sedes.includes(sede.id) }"
                      @click="toggleSede(sede.id)"
                    >
                      <div class="option-checkbox">
                        <svg v-if="form.sedes.includes(sede.id)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <span>{{ sede.nombre }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Columna 2: Cuenta + datos personales -->
            <div class="form-column">
              <h3 class="section-divider first">Cuenta de acceso</h3>
              <div class="stack-gap">
                <div class="input-group">
                  <label for="email">Correo electrónico</label>
                  <input id="email" type="email" v-model="form.email" placeholder="tu@correo.com" required />
                </div>
                <div class="rg-row">
                  <div class="input-group">
                    <label for="password">Contraseña</label>
                    <input id="password" type="password" v-model="form.password" placeholder="••••••••" required />
                  </div>
                  <div class="input-group">
                    <label for="confirmPassword">Confirmar contraseña</label>
                    <input id="confirmPassword" type="password" v-model="form.confirmPassword" placeholder="••••••••" required />
                  </div>
                </div>
              </div>

              <h3 class="section-divider">Datos personales</h3>
              <div class="stack-gap">
                <div class="input-group">
                  <label for="curp">CURP</label>
                  <input id="curp" type="text" v-model="form.curp" placeholder="ABCD010101HDF000" required />
                </div>
                <div class="rg-row">
                  <div class="input-group">
                    <label for="nombres">Nombre(s)</label>
                    <input id="nombres" type="text" v-model="form.nombres" placeholder="Tu(s) nombre(s)" required />
                  </div>
                  <div class="input-group">
                    <label for="fechaNacimiento">Fecha de nacimiento</label>
                    <input id="fechaNacimiento" type="date" v-model="form.fechaNacimiento" required />
                  </div>
                </div>
                <div class="rg-row">
                  <div class="input-group">
                    <label for="apellidoP">Apellido paterno</label>
                    <input id="apellidoP" type="text" v-model="form.apellidoP" placeholder="Paterno" required />
                  </div>
                  <div class="input-group">
                    <label for="apellidoM">Apellido materno</label>
                    <input id="apellidoM" type="text" v-model="form.apellidoM" placeholder="Materno" required />
                  </div>
                </div>
                <div class="input-group">
                  <label for="celular">Teléfono celular</label>
                  <input id="celular" type="tel" v-model="form.celular" placeholder="+52 000 000 0000" required />
                </div>
              </div>
            </div>

            <!-- Columna 3: Especialidad, redes, horario -->
            <div class="form-column rg-col3">
              <h3 class="section-divider first">Perfil profesional</h3>
              <div class="stack-gap">
                <div class="input-group">
                  <label for="especialidad">Especialidad</label>
                  <input id="especialidad" type="text" v-model="form.especialidad" placeholder="Ej. Fuerza, CrossFit, Yoga..." required />
                </div>
                <div class="rg-row">
                  <div class="input-group">
                    <label for="facebook">Facebook</label>
                    <input id="facebook" type="text" v-model="form.facebook" placeholder="usuario_fb" />
                  </div>
                  <div class="input-group">
                    <label for="instagram">Instagram</label>
                    <input id="instagram" type="text" v-model="form.instagram" placeholder="@usuario_ig" />
                  </div>
                </div>
                <div class="rg-row">
                  <div class="input-group">
                    <label for="tiktok">TikTok</label>
                    <input id="tiktok" type="text" v-model="form.tiktok" placeholder="@usuario_tt" />
                  </div>
                  <div class="input-group">
                    <label for="otrasApps">Otras redes</label>
                    <input id="otrasApps" type="text" v-model="form.otrasApps" placeholder="Opcional" />
                  </div>
                </div>
              </div>

              <h3 class="section-divider">Horario disponible</h3>
              <div class="rg-row">
                <div class="input-group">
                  <label for="horaEntrada">Hora de entrada</label>
                  <input id="horaEntrada" type="time" v-model="form.horaEntrada" required />
                </div>
                <div class="input-group">
                  <label for="horaSalida">Hora de salida</label>
                  <input id="horaSalida" type="time" v-model="form.horaSalida" required />
                </div>
              </div>

              <div class="actions-section" style="margin-top: 28px;">
                <button type="submit" class="btn-primary">
                  Registrarme como entrenador
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
                <div class="footer-link">
                  ¿Ya tienes cuenta? <router-link :to="{ name: 'login' }">Inicia sesión</router-link>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
.register-page {
  color: #f5f5f4;
  font-family: 'Inter', sans-serif;
  position: relative;
}

.main-content {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 24px clamp(16px, 3vw, 40px) 40px;
  box-sizing: border-box;
}

.register-card {
  width: 100%;
  max-width: 1400px;
  background: rgba(18, 18, 18, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 24px;
  padding: clamp(28px, 3vw, 48px);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.55);
  box-sizing: border-box;
}

.header-section { text-align: center; margin-bottom: 32px; }

.title {
  font-family: 'Anton', sans-serif;
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  letter-spacing: -1px;
  text-transform: uppercase;
  margin: 0 0 8px;
  color: #f5f5f4;
}
.highlight-text { color: #3a6bd6; }
.subtitle { font-size: 14px; color: rgba(245, 245, 244, 0.55); margin: 0; }

.alert-success {
  font-size: 13px; font-weight: 600; padding: 14px 16px; border-radius: 10px;
  background: rgba(28, 79, 214, 0.15); border: 1px solid rgba(28, 79, 214, 0.4);
  color: #8fb4f8; margin-bottom: 24px;
}
.alert-error {
  font-size: 13px; font-weight: 600; padding: 14px 16px; border-radius: 10px;
  background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4);
  color: #fca5a5; margin-bottom: 24px;
}

.rg-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(24px, 2.5vw, 36px);
  align-items: start;
}
.form-column { display: flex; flex-direction: column; gap: 8px; min-width: 0; }

@media (min-width: 1200px) {
  .rg-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (min-width: 1024px) and (max-width: 1199px) {
  .rg-grid { grid-template-columns: repeat(2, 1fr); }
  .rg-col3 { grid-column: 1 / -1; max-width: 700px; margin: 0 auto; width: 100%; }
}

.section-divider {
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 12.5px;
  letter-spacing: 0.6px;
  color: #5b8bf0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 8px;
  margin: 22px 0 6px;
  text-transform: uppercase;
}
.section-divider.first { margin: 6px 0 6px; }

.upload-container {
  display: flex; flex-direction: row; align-items: center; gap: 18px;
  background: rgba(255, 255, 255, 0.03); padding: 16px 18px; border-radius: 14px;
  border: 1.5px dashed rgba(255, 255, 255, 0.16);
}
.image-preview {
  width: 76px; height: 76px; background: #141414; border-radius: 12px; overflow: hidden;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.12); flex-shrink: 0;
}
.profile-img { width: 100%; height: 100%; object-fit: cover; }
.upload-placeholder { display: flex; flex-direction: column; align-items: center; color: rgba(245, 245, 244, 0.45); gap: 4px; text-align: center; }
.upload-placeholder span { font-size: 9px; font-weight: 700; text-transform: uppercase; }
.upload-info { font-size: 13px; color: rgba(245, 245, 244, 0.55); margin: 0; line-height: 1.4; }

.stack-gap { display: flex; flex-direction: column; gap: 14px; }
.rg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.input-group { display: flex; flex-direction: column; gap: 8px; }

label {
  font-family: 'Oswald', sans-serif; font-size: 12.5px; font-weight: 700;
  letter-spacing: 0.4px; color: #f5f5f4;
}
input {
  width: 100%; padding: 14px 16px; background: #141414;
  border: 1.5px solid rgba(255, 255, 255, 0.12); border-radius: 12px;
  color: #f5f5f4; font-weight: 600; font-size: 14.5px; min-height: 48px; box-sizing: border-box;
}
input::placeholder { color: rgba(245, 245, 244, 0.4); }
input[type="date"]::-webkit-calendar-picker-indicator,
input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.6; cursor: pointer; }
input:focus { outline: none; border-color: #1c4fd6; box-shadow: 0 0 0 4px rgba(28, 79, 214, 0.25); background: #161616; }

.optional-tag {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(245, 245, 244, 0.6);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  vertical-align: middle;
}

.optional-hint {
  font-size: 12.5px;
  color: rgba(245, 245, 244, 0.5);
  margin: -2px 0 12px;
  line-height: 1.4;
}

/* Buscador de gimnasio */
.gym-picker { position: relative; }
.gym-dropdown-list {
  margin-top: 8px; background: #141414; border: 1.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px; max-height: 260px; overflow-y: auto; box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
}

.skip-gym-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
  padding: 10px 2px 0;
}
.skip-gym-row span {
  font-size: 12px;
  color: rgba(245, 245, 244, 0.45);
}
.skip-gym-btn {
  background: transparent;
  border: none;
  color: #5b8bf0;
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.3px;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
}
.skip-gym-btn:hover { color: #7ba3f5; }
.gym-option {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  padding: 12px 16px; cursor: pointer; border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  transition: background 0.15s ease;
}
.gym-option:last-child { border-bottom: none; }
.gym-option:hover { background: rgba(28, 79, 214, 0.14); }
.gym-option-main { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.gym-option-main strong { font-size: 13.5px; color: #f5f5f4; }
.gym-option-main span { font-size: 12px; color: rgba(245, 245, 244, 0.5); }
.gym-option-empty { padding: 14px 16px; font-size: 13px; color: rgba(245, 245, 244, 0.5); }

.selected-gym-card {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 14px 16px; background: rgba(28, 79, 214, 0.12);
  border: 1.5px solid rgba(28, 79, 214, 0.4); border-radius: 12px;
}
.selected-gym-info { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.selected-gym-info strong { font-size: 14px; color: #f5f5f4; }
.selected-gym-info span { font-size: 12px; color: rgba(245, 245, 244, 0.55); }
.change-gym-btn {
  background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15);
  color: #f5f5f4; font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 11.5px;
  text-transform: uppercase; padding: 8px 14px; border-radius: 9px; cursor: pointer;
  flex-shrink: 0; transition: background 0.2s ease;
}
.change-gym-btn:hover { background: rgba(255, 255, 255, 0.15); }

/* Multiselect de sedes */
.custom-multiselect { position: relative; width: 100%; }
.select-box-trigger {
  background: #141414; border: 1.5px solid rgba(255, 255, 255, 0.12); border-radius: 12px;
  color: #f5f5f4; padding: 12px 14px; width: 100%; box-sizing: border-box;
  font-family: 'Inter', sans-serif; font-size: 0.95rem; outline: none; cursor: pointer;
  display: flex; align-items: center; justify-content: space-between;
  transition: border-color 0.2s, box-shadow 0.2s; user-select: none; min-height: 48px;
}
.select-box-trigger.disabled { cursor: not-allowed; opacity: 0.55; }
.select-box-trigger:hover:not(.disabled) { border-color: rgba(255, 255, 255, 0.25); }
.placeholder-text { color: #71717a; }
.dropdown-arrow { width: 16px; height: 16px; stroke: #a1a1aa; transition: transform 0.2s ease; flex-shrink: 0; margin-left: 10px; }
.dropdown-arrow.rotate { transform: rotate(180deg); }

.dropdown-options-list {
  position: absolute; top: calc(100% + 6px); left: 0; width: 100%;
  background: #18181b; border: 1.5px solid rgba(255, 255, 255, 0.15); border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6); z-index: 100; max-height: 220px;
  overflow-y: auto; padding: 6px; box-sizing: border-box;
}
.dropdown-option-item {
  display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px;
  cursor: pointer; font-family: 'Inter', sans-serif; font-size: 0.9rem; color: #e4e4e7;
  transition: background 0.15s, color 0.15s;
}
.dropdown-option-item:hover { background: rgba(59, 130, 246, 0.12); color: #fff; }
.dropdown-option-item.selected { background: rgba(59, 130, 246, 0.2); color: #fff; font-weight: 500; }
.option-checkbox {
  width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid rgba(255, 255, 255, 0.3);
  display: flex; align-items: center; justify-content: center; transition: all 0.15s; flex-shrink: 0;
}
.dropdown-option-item.selected .option-checkbox { background: #3b82f6; border-color: #3b82f6; color: white; }
.option-checkbox svg { width: 10px; height: 10px; }

.actions-section { margin-top: 30px; display: flex; flex-direction: column; gap: 14px; }
.btn-primary {
  width: 100%; padding: 16px; background: #1c4fd6; color: #ffffff;
  border: none; border-radius: 12px; font-family: 'Oswald', sans-serif;
  font-weight: 700; font-size: 14.5px; text-transform: uppercase; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 9px;
  min-height: 52px; box-shadow: 0 10px 24px rgba(28, 79, 214, 0.3);
}
.footer-link {
  text-align: center; font-family: 'Inter', sans-serif;
  font-weight: 600; font-size: 13.5px; color: rgba(245, 245, 244, 0.55);
}
.footer-link a { color: #5b8bf0; text-decoration: none; font-weight: 700; }

@media (max-width: 768px) {
  .rg-row { grid-template-columns: 1fr; }
}
</style>