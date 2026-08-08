<template>
  <HeadingOwner>
    <NotificationSystem ref="toastRef" />
    <main class="main-content">
      <div class="profile-card">
        <div class="profile-section" id="tutorial-step-0">
          <h1 class="main-title">
            <template v-if="currentLang === 'es'">Registra a tu <br> <span class="highlight">Personal</span></template>
            <template v-else-if="currentLang === 'en'">Register your <br> <span class="highlight">Staff</span></template>
            <template v-else-if="currentLang === 'fr'">Enregistrez votre <br> <span class="highlight">Personnel</span></template>
            <template v-else-if="currentLang === 'pt'">Registre sua <br> <span class="highlight">Equipe</span></template>
          </h1>
          
          <div class="avatar-wrapper">
            <div class="avatar-circle" @click="$refs.fileInput.click()" :title="t('titleAvatarClick')">
              <img v-if="avatarPreview" :src="avatarPreview" :alt="t('altEmployeePreview')" class="avatar-img" />
              <svg v-else viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <button type="button" class="avatar-action btn-camera" @click="$refs.fileInput.click()" :title="t('titleUploadPhoto')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </button>
            <input type="file" ref="fileInput" accept="image/*" style="display: none" @change="handleFileChange" />
          </div>
          <p class="profile-hint">{{ t('hintEmployeePhoto') }}</p>
        </div>

        <div class="forms-wrapper">
          
          <!-- CREDENCIALES Y ROL -->
          <div class="login-card" id="tutorial-step-1">
            <h3 class="section-title">{{ t('credentialsAndRole') }}</h3>
            <div class="form-grid">
              
              <!-- Rol -->
              <div class="input-group">
                <label>{{ t('systemRole') }}</label>
                <select v-model="form.rol" class="custom-select">
                  <option value="" disabled>{{ t('selectRole') }}</option>
                  <option value="gerente">Gerente</option>
                  <option value="entrenador">{{ t('roleTrainer') }}</option>
                  <option value="recepcion">{{ t('roleReception') }}</option>
                </select>
              </div>

              <!-- Correo -->
              <div class="input-group">
                <label>{{ t('email') }}</label>
                <input type="email" v-model="form.email" placeholder="correo@ejemplo.com">
              </div>

              <!-- Contraseñas (Gerente / Recepción) -->
              <template v-if="form.rol === 'gerente' || form.rol === 'recepcion'">
                <div class="input-group">
                  <label>{{ t('password') }}</label>
                  <input type="password" v-model="form.password" placeholder="••••••••">
                </div>
                <div class="input-group">
                  <label>{{ t('confirmPassword') }}</label>
                  <input type="password" v-model="form.confirmPassword" placeholder="••••••••">
                </div>
              </template>

              <!-- Especialidad (Solo Entrenador - Columna Izquierda) -->
              <div class="input-group" v-if="form.rol === 'entrenador'">
                <label>{{ t('specialty') }}</label>
                <input type="text" v-model="form.especialidad" :placeholder="t('placeholderSpecialty')">
              </div>

              <!-- SEDES / UBICACIONES (Select Múltiple en la parte derecha) -->
              <div class="input-group" :class="{ 'sedes-right-col': form.rol !== 'entrenador' }">
                <label>{{ t('allowedLocations') }}</label>
                <div class="custom-multiselect" ref="dropdownRef">
                  <div class="select-box-trigger" @click="isDropdownOpen = !isDropdownOpen">
                    <span :class="{ 'placeholder-text': form.sedes.length === 0 }">
                      {{ getSedesDisplayText() }}
                    </span>
                    <svg class="dropdown-arrow" :class="{ 'rotate': isDropdownOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>

                  <!-- Lista desplegable hacia arriba -->
                  <div class="dropdown-options-list" v-if="isDropdownOpen">
                    <div 
                      v-for="sede in listaSedes" 
                      :key="sede.id" 
                      class="dropdown-option-item"
                      :class="{ 'selected': form.sedes.includes(sede.id) }"
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
          </div>

          <!-- DATOS DEL EMPLEADO -->
          <div class="login-card" id="tutorial-step-2">
            <h3 class="section-title">{{ t('employeeData') }}</h3>
            <div class="form-grid">
              <div class="input-group span-full">
                <label>{{ t('curp') }}</label>
                <input type="text" v-model="form.curp" placeholder="Ej. ABCD010101HDF000">
              </div>
              <div class="input-group">
                <label>{{ t('names') }}</label>
                <input type="text" v-model="form.nombres" :placeholder="t('placeholderName')">
              </div>
              <div class="input-group">
                <label>{{ t('lastNameP') }}</label>
                <input type="text" v-model="form.apellidoP" :placeholder="t('placeholderLastNameP')">
              </div>
              <div class="input-group">
                <label>{{ t('lastNameM') }}</label>
                <input type="text" v-model="form.apellidoM" :placeholder="t('placeholderLastNameM')">
              </div>
              <div class="input-group">
                <label>{{ t('birthDate') }}</label>
                <input type="date" v-model="form.fechaNacimiento">
              </div>
              <div class="input-group">
                <label>{{ t('cellphone') }}</label>
                <input type="text" v-model="form.celular" placeholder="+52 000 000 0000">
              </div>

              <template v-if="form.rol !== 'recepcion' && form.rol !== 'gerente'">
                <div class="input-group">
                  <label>{{ t('facebook') }}</label>
                  <input type="text" v-model="form.facebook" placeholder="usuario_fb">
                </div>
                <div class="input-group">
                  <label>{{ t('instagram') }}</label>
                  <input type="text" v-model="form.instagram" placeholder="@usuario_ig">
                </div>
                <div class="input-group">
                  <label>{{ t('tiktok') }}</label>
                  <input type="text" v-model="form.tiktok" placeholder="@usuario_tt">
                </div>
                <div class="input-group">
                  <label>{{ t('otherApps') }}</label>
                  <input type="text" v-model="form.otrasApps" :placeholder="t('placeholderOtherApps')">
                </div>
              </template>
            </div>
          </div>

          <!-- HORARIO DE TRABAJO -->
          <div class="login-card" id="tutorial-step-3">
            <h3 class="section-title">{{ t('workSchedule') }}</h3>
            <div class="form-grid">
              <div class="input-group">
                <label>{{ t('entryTime') }}</label>
                <input type="time" v-model="form.horaEntrada">
              </div>
              <div class="input-group">
                <label>{{ t('exitTime') }}</label>
                <input type="time" v-model="form.horaSalida">
              </div>
            </div>
          </div>

          <button type="button" class="btn-primary" @click="saveRegistration">{{ t('finishButtonStaff') }}</button>
        </div>
      </div>
    </main>
  </HeadingOwner>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import HeadingOwner from '../HeadingOwner.vue';
import NotificationSystem from '../../Modals/NotificationSystem.vue'; 
import { traducciones } from '../i18n.js';

const router = useRouter();
const toastRef = ref(null);
const fileInput = ref(null);
const avatarPreview = ref(null);
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

const currentLang = ref(localStorage.getItem('owner-idioma') || 'es');

const listaSedes = ref([
  { id: 'sede_norte', nombre: 'Sucursal Norte (Centro)' },
  { id: 'sede_sur', nombre: 'Sucursal Sur (Plaza)' },
  { id: 'sede_oriente', nombre: 'Sucursal Oriente' },
  { id: 'sede_poniente', nombre: 'Sucursal Poniente' }
]);

const t = (key) => {
  const langTable = traducciones[currentLang.value] || traducciones.es;
  return langTable[key] || traducciones.es[key] || key;
};

const handleLangChange = (e) => {
  if (e.detail && e.detail.idioma) {
    currentLang.value = e.detail.idioma;
  }
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('idioma-changed', handleLangChange);
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('idioma-changed', handleLangChange);
  document.removeEventListener('click', handleClickOutside);
});

const form = reactive({
  curp: '',
  nombres: '',
  apellidoP: '',
  apellidoM: '',
  fechaNacimiento: '',
  celular: '',
  facebook: '',
  instagram: '',
  tiktok: '',
  otrasApps: '',
  rol: '',
  email: '',
  password: '',
  confirmPassword: '',
  especialidad: '',
  horaEntrada: '',
  horaSalida: '',
  sedes: [] 
});

const toggleSede = (id) => {
  const index = form.sedes.indexOf(id);
  if (index > -1) {
    form.sedes.splice(index, 1);
  } else {
    form.sedes.push(id);
  }
};

const getSedesDisplayText = () => {
  if (form.sedes.length === 0) {
    return 'Seleccionar sedes...';
  }
  const nombresSeleccionados = listaSedes.value
    .filter(s => form.sedes.includes(s.id))
    .map(s => s.nombre);
  return nombresSeleccionados.join(', ');
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    avatarPreview.value = URL.createObjectURL(file);
  }
};

const saveRegistration = () => {
  if (!form.nombres || !form.apellidoP) {
    toastRef.value?.notify(t('msgWarningStaff'), 'warning');
    return;
  }

  if ((form.rol === 'gerente' || form.rol === 'recepcion') && form.password) {
    if (form.password !== form.confirmPassword) {
      toastRef.value?.notify('Las contraseñas no coinciden', 'error');
      return;
    }
  }
  
  try {
    console.log("Datos del personal a guardar:", form);
    toastRef.value?.notify(t('msgSuccess'), 'success');
  } catch (error) {
    toastRef.value?.notify(t('msgError'), 'error');
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;600;700&display=swap');

.main-content { 
  display: flex; 
  justify-content: center; 
  width: 100%; 
  padding: 40px clamp(16px, 3vw, 40px); 
  box-sizing: border-box; 
  color: var(--color-texto-general, #e5e5e5);
}

.profile-card { 
  display: grid; 
  grid-template-columns: 340px minmax(0, 1fr); 
  gap: 30px; 
  width: 100%; 
  max-width: 1200px;
  margin: 0 auto;   
  align-items: start; 
}

.forms-wrapper { 
  display: flex; 
  flex-direction: column; 
  gap: 20px; 
  width: 100%; 
}

.login-card { 
  background: var(--bg-cards, rgba(18, 18, 18, 0.75)); 
  backdrop-filter: blur(12px);
  padding: 30px; 
  border-radius: var(--app-border-radius, 24px); 
  border: 1px solid rgba(255, 255, 255, 0.12); 
  box-sizing: border-box;
  position: relative;
}

.sedes-right-col {
  grid-column: 2;
}

/* Estilos personalizados del Multiselect */
.custom-multiselect {
  position: relative;
  width: 100%;
}

.select-box-trigger {
  background: var(--bg-cards, #141414); 
  border: 1.5px solid rgba(255, 255, 255, 0.12); 
  border-radius: var(--app-border-radius, 12px); 
  color: var(--color-texto-general, #fff); 
  padding: 12px 14px; 
  width: 100%; 
  box-sizing: border-box; 
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: border-color 0.2s, box-shadow 0.2s;
  user-select: none;
  min-height: 48px;
}

.select-box-trigger:hover {
  border-color: rgba(255, 255, 255, 0.25);
}

.select-box-trigger:focus-within, 
.custom-multiselect:focus-within .select-box-trigger {
  border-color: var(--color-highlight, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.placeholder-text {
  color: #71717a;
}

.dropdown-arrow {
  width: 16px;
  height: 16px;
  stroke: #a1a1aa;
  transition: transform 0.2s ease;
  flex-shrink: 0;
  margin-left: 10px;
}

.dropdown-arrow.rotate {
  transform: rotate(180deg);
}

/* Lista flotante posicionada HACIA ARRIBA para que nunca salga de la tarjeta ni se oculte */
.dropdown-options-list {
  position: absolute;
  bottom: calc(100% + 6px); /* Se despliega hacia arriba */
  top: auto;
  left: 0;
  width: 100%;
  background: #18181b;
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--app-border-radius, 12px);
  box-shadow: 0 -10px 25px rgba(0, 0, 0, 0.6);
  z-index: 100; 
  max-height: 240px;
  overflow-y: auto;
  padding: 6px;
  box-sizing: border-box;
}

.dropdown-option-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #e4e4e7;
  transition: background 0.15s, color 0.15s;
}

.dropdown-option-item:hover {
  background: rgba(59, 130, 246, 0.12);
  color: #fff;
}

.dropdown-option-item.selected {
  background: rgba(59, 130, 246, 0.2);
  color: #fff;
  font-weight: 500;
}

.option-checkbox {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  flex-shrink: 0;
}

.dropdown-option-item.selected .option-checkbox {
  background: var(--color-highlight, #3b82f6);
  border-color: var(--color-highlight, #3b82f6);
  color: white;
}

.option-checkbox svg {
  width: 10px;
  height: 10px;
}

.highlight { 
  color: var(--color-highlight, #3b82f6); 
}

.profile-section { 
  background: var(--bg-cards, rgba(18, 18, 18, 0.75)); 
  backdrop-filter: blur(12px);
  padding: 40px 24px; 
  border-radius: var(--app-border-radius, 24px); 
  border: 1px solid rgba(255, 255, 255, 0.09);
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  text-align: center;
  position: sticky;
  top: 30px;
}

.main-title { 
  font-family: 'Anton', sans-serif; 
  font-size: 2.2rem; 
  color: var(--color-titulos, #fff); 
  margin: 0 0 24px 0; 
  line-height: 1.1; 
  text-transform: uppercase; 
  letter-spacing: 0.5px;
}

.profile-hint {
  font-family: 'Inter', sans-serif;
  color: var(--color-texto-general, #94a3b8);
  font-size: 0.85rem;
  line-height: 1.4;
  margin-top: 10px;
  opacity: 0.8;
}

.form-grid { 
  display: grid; 
  grid-template-columns: repeat(2, 1fr); 
  gap: 20px; 
}

.form-grid .span-full {
  grid-column: span 2;
}

.input-group { 
  display: flex; 
  flex-direction: column; 
  gap: 8px; 
}

label { 
  font-family: 'Oswald', sans-serif; 
  color: var(--color-texto-general, #f5f5f4); 
  font-size: 0.85rem; 
  font-weight: 600; 
  letter-spacing: 0.5px;
}

input, .custom-select { 
  background: var(--bg-cards, #141414); 
  border: 1.5px solid rgba(255, 255, 255, 0.12); 
  border-radius: var(--app-border-radius, 12px); 
  color: var(--color-texto-general, #fff); 
  padding: 12px 14px; 
  width: 100%; 
  box-sizing: border-box; 
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus, .custom-select:focus {
  border-color: var(--color-highlight, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.custom-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 16px;
  padding-right: 40px;
  cursor: pointer;
}

.section-title { 
  font-family: 'Oswald', sans-serif; 
  color: var(--color-highlight, #5b8bf0); 
  font-size: 0.95rem; 
  margin: 0 0 20px 0; 
  text-transform: uppercase; 
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08); 
  padding-bottom: 10px; 
}

/* Avatar Components */
.avatar-circle { 
  width: 150px; 
  height: 150px; 
  background: var(--bg-cards, #141414); 
  border-radius: 50%; 
  border: 4px solid var(--color-highlight, #3b82f6); 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-wrapper { 
  position: relative; 
  margin-bottom: 10px; 
}

.avatar-action { 
  position: absolute; 
  width: 42px; 
  height: 42px; 
  border-radius: 50%; 
  background: var(--color-highlight, #3b82f6); 
  border: 2px solid var(--bg-cards, #121212); 
  cursor: pointer; 
  bottom: 0; 
  right: 0; 
  display: flex; 
  align-items: center; 
  justify-content: center;
  color: white;
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.2s;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  touch-action: manipulation;
}

.avatar-action svg {
  width: 20px;  
  height: 20px;
}

.btn-primary {
  padding: 16px 36px;
  background: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, white);
  border: none;
  border-radius: var(--app-border-radius, 12px);
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 16px rgba(28, 79, 214, 0.4);
}

@media (hover: hover) {
  .btn-primary:hover {
    transform: translateY(-2px); 
    background: #1742be;
    box-shadow: 0 6px 18px rgba(28, 79, 214, 0.5);
  }
  .avatar-action:hover {
    transform: scale(1.08);
  }
}

.btn-primary:active, .avatar-action:active {
  transform: scale(0.96);
}

/* Responsive Media Queries */
@media (max-width: 1024px) { 
  .profile-card { 
    grid-template-columns: 1fr; 
  } 
  .profile-section {
    position: static;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 12px;
  }
  
  .form-grid { 
    grid-template-columns: 1fr; 
    gap: 14px;
  } 

  .form-grid .span-full, .sedes-right-col {
    grid-column: span 1;
  }

  .login-card { 
    padding: 20px;
    border-radius: var(--app-border-radius, 20px);
  }

  .avatar-circle {
    width: 130px;
    height: 130px;
  }
}
</style>