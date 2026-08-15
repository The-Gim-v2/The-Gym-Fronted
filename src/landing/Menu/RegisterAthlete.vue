<script setup lang="ts">
import { reactive, ref, computed } from 'vue';

// -------------------------------------------------------------------
// En producción esta lista vendría de tu API (gimnasios dados de alta
// en la plataforma). Se deja como mock para poder probar el buscador.
// -------------------------------------------------------------------
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

const selectGym = (gym: Gimnasio) => {
  selectedGymId.value = gym.id;
  gymSearch.value = '';
  isGymDropdownOpen.value = false;
};

const clearGym = () => {
  selectedGymId.value = null;
};

const form = reactive({
  nombres: '', apellidoP: '', apellidoM: '',
  fechaNac: '', celular: '',
  email: '', password: '', confirmPassword: '',
  entidad: '', municipio: '', cp: '', colonia: '', calle: '', numExt: '', numInt: '',
  peso: '', altura: '',
  tipoMembresia: 'mes' as 'mes' | 'sem'
});

const triggerFileInput = () => fileInput.value?.click();
const onFileSelected = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) previewImage.value = URL.createObjectURL(file);
};

const handleRegisterClick = () => {
  errorMessage.value = null;

  // La selección de gimnasio es opcional: el atleta puede registrarse
  // y elegir/solicitar su gimnasio más adelante desde su perfil.
  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Las contraseñas no coinciden. Por favor, verifícalas.';
    return;
  }

  // Aquí iría la llamada real a la API, enviando form + selectedGymId (puede ir null)
  console.log('Registro de atleta:', { ...form, gimnasioId: selectedGymId.value });
  submitted.value = true;
};
</script>

<template>
  <div class="register-page">
    <main class="main-content">
      <div class="register-card">
        <div class="header-section">
          <h1 class="title">REGISTRO DE <span class="highlight-text">ATLETA</span></h1>
          <p class="subtitle">Únete como miembro a uno de nuestros gimnasios afiliados</p>
        </div>

        <div v-if="submitted" class="alert-success">
          ¡Solicitud enviada con éxito! El gimnasio revisará tu registro y te contactará pronto.
        </div>

        <div v-if="errorMessage" class="alert-error">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleRegisterClick">
          <div class="rg-grid">

            <!-- Columna 1: Foto + datos personales -->
            <div class="form-column">
              <h3 class="section-divider first">Fotografía</h3>
              <div class="upload-container">
                <div class="image-preview" @click="triggerFileInput">
                  <img v-if="previewImage" :src="previewImage" class="profile-img" alt="Vista previa" />
                  <div v-else class="upload-placeholder">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                    <span>Subir</span>
                  </div>
                </div>
                <input type="file" ref="fileInput" @change="onFileSelected" accept="image/*" style="display: none" />
                <p class="upload-info">Sube una fotografía reciente para tu expediente de atleta</p>
              </div>

              <h3 class="section-divider">Datos personales</h3>
              <div class="stack-gap">
                <div class="input-group">
                  <label for="nombres">Nombre(s)</label>
                  <input id="nombres" type="text" v-model="form.nombres" placeholder="Ingresa tus nombres" required />
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
                <div class="rg-row">
                  <div class="input-group">
                    <label for="fechaNac">Fecha de nacimiento</label>
                    <input id="fechaNac" type="date" v-model="form.fechaNac" required />
                  </div>
                  <div class="input-group">
                    <label for="celular">Teléfono celular</label>
                    <input id="celular" type="tel" v-model="form.celular" placeholder="Ej. 4811234567" required />
                  </div>
                </div>
                <div class="rg-row">
                  <div class="input-group">
                    <label for="peso">Peso (kg)</label>
                    <input id="peso" type="text" v-model="form.peso" placeholder="Ej. 70" />
                  </div>
                  <div class="input-group">
                    <label for="altura">Altura (m)</label>
                    <input id="altura" type="text" v-model="form.altura" placeholder="Ej. 1.75" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Columna 2: Cuenta + dirección -->
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
                    <div class="input-wrapper">
                      <input id="password" :type="showPassword ? 'text' : 'password'" v-model="form.password" placeholder="••••••••" required />
                      <button type="button" class="toggle-password-btn" @click="showPassword = !showPassword" aria-label="Mostrar contraseña">
                        <svg v-if="showPassword" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      </button>
                    </div>
                  </div>
                  <div class="input-group">
                    <label for="confirmPassword">Confirmar contraseña</label>
                    <div class="input-wrapper">
                      <input id="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" v-model="form.confirmPassword" placeholder="••••••••" required />
                      <button type="button" class="toggle-password-btn" @click="showConfirmPassword = !showConfirmPassword" aria-label="Mostrar contraseña de confirmación">
                        <svg v-if="showConfirmPassword" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <h3 class="section-divider">Tu dirección</h3>
              <div class="stack-gap">
                <div class="rg-row">
                  <div class="input-group">
                    <label for="estado">Estado</label>
                    <input id="estado" type="text" v-model="form.entidad" placeholder="Ej. San Luis Potosí" required />
                  </div>
                  <div class="input-group">
                    <label for="municipio">Municipio</label>
                    <input id="municipio" type="text" v-model="form.municipio" placeholder="Municipio" required />
                  </div>
                </div>
                <div class="rg-row">
                  <div class="input-group">
                    <label for="colonia">Colonia</label>
                    <input id="colonia" type="text" v-model="form.colonia" placeholder="Colonia" required />
                  </div>
                  <div class="input-group">
                    <label for="cp">Código postal</label>
                    <input id="cp" type="text" v-model="form.cp" placeholder="C.P." required />
                  </div>
                </div>
                <div class="input-group">
                  <label for="calle">Calle</label>
                  <input id="calle" type="text" v-model="form.calle" placeholder="Nombre de la calle" required />
                </div>
              </div>
            </div>

            <!-- Columna 3: Selección de gimnasio + membresía -->
            <div class="form-column rg-col3">
              <h3 class="section-divider first">
                ¿En qué gimnasio quieres registrarte?
                <span class="optional-tag">Opcional</span>
              </h3>
              <p class="optional-hint">
                Puedes elegir tu gimnasio ahora o hacerlo más tarde desde tu perfil.
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
                      <span>{{ gym.ciudad }}, {{ gym.estado }}</span>
                    </div>
                    <span class="gym-option-price">${{ gym.precioMes }}/mes</span>
                  </div>
                  <div v-if="filteredGyms.length === 0" class="gym-option-empty">
                    No se encontraron gimnasios con ese nombre.
                  </div>
                </div>

                <div v-if="!selectedGym" class="skip-gym-row">
                  <span>¿Aún no sabes cuál elegir?</span>
                  <button type="button" class="skip-gym-btn" @click="isGymDropdownOpen = false">
                    Continuar sin seleccionar gimnasio
                  </button>
                </div>

                <div v-if="selectedGym" class="selected-gym-card">
                  <div class="selected-gym-info">
                    <strong>{{ selectedGym.nombre }}</strong>
                    <span>{{ selectedGym.direccion }} · {{ selectedGym.ciudad }}, {{ selectedGym.estado }}</span>
                  </div>
                  <button type="button" class="change-gym-btn" @click="clearGym">Cambiar</button>
                </div>
              </div>

              <div v-if="selectedGym" class="input-group" style="margin-top: 18px;">
                <label>Tipo de membresía</label>
                <div class="days-container">
                  <button
                    type="button"
                    class="day-chip"
                    :class="{ active: form.tipoMembresia === 'mes' }"
                    @click="form.tipoMembresia = 'mes'"
                  >
                    Mensual — ${{ selectedGym.precioMes }}
                  </button>
                  <button
                    type="button"
                    class="day-chip"
                    :class="{ active: form.tipoMembresia === 'sem' }"
                    @click="form.tipoMembresia = 'sem'"
                  >
                    Semanal — ${{ selectedGym.precioSem }}
                  </button>
                </div>
              </div>

              <div class="actions-section" style="margin-top: 28px;">
                <button type="submit" class="btn-primary">
                  Registrarme como atleta
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

input, select {
  width: 100%; padding: 14px 16px; background: #141414;
  border: 1.5px solid rgba(255, 255, 255, 0.12); border-radius: 12px;
  color: #f5f5f4; font-weight: 600; font-size: 14.5px; min-height: 48px; box-sizing: border-box;
}
input::placeholder { color: rgba(245, 245, 244, 0.4); }
input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.6; cursor: pointer; }
input:focus, select:focus {
  outline: none; border-color: #1c4fd6; box-shadow: 0 0 0 4px rgba(28, 79, 214, 0.25); background: #161616;
}

.input-wrapper { position: relative; }
.input-wrapper input { padding-right: 46px; }
.toggle-password-btn {
  position: absolute; right: 0; top: 0; height: 100%; width: 44px;
  background: transparent; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; color: rgba(245, 245, 244, 0.4);
}

.days-container { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px; }
.day-chip {
  padding: 9px 14px; border-radius: 9px; font-family: 'Oswald', sans-serif;
  font-weight: 700; font-size: 12.5px; cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.14); background: rgba(255, 255, 255, 0.04);
  color: #f5f5f4; transition: all 0.25s ease;
}
.day-chip.active {
  border-color: #1c4fd6; background: #1c4fd6; color: #ffffff;
  box-shadow: 0 4px 12px rgba(28, 79, 214, 0.3);
}

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
  margin-top: 8px;
  background: #141414;
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  max-height: 260px;
  overflow-y: auto;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
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
.gym-option-price {
  font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 12.5px;
  color: #5b8bf0; flex-shrink: 0; white-space: nowrap;
}
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