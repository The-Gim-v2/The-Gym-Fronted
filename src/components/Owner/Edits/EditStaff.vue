<template>
  <HeadingOwner>
    <main class="main-content">
      <!-- Barra de búsqueda superior alineada -->
      <div  class="search-bar-container-top">
        <div id="tutor-0" class="input-group search-small">
          <label>{{ t('searchStaffLabel') }}</label>
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" :placeholder="t('searchPlaceholder')" v-model="searchQuery" @keyup.enter="handleSearch">
          </div>
        </div>
      </div>

      <!-- Layout principal optimizado para escritorio -->
      <div class="profile-card">
        <!-- Sección Perfil Izquierda -->
        <div id="tutor-1" class="profile-section">
          <h1 class="main-title">Carlos Luis <br> <span class="highlight">Ramírez</span></h1>
          
          <div class="avatar-wrapper">
            <div id="tutor-2" class="avatar-circle">
              <img :src="avatarSrc" :alt="t('avatarAlt')" class="user-avatar-img" />
            </div>
            
            <button id="tutor-3" class="avatar-action btn-camera" @click="triggerFileUpload" :title="t('changePhotoTitle')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </button>
            <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" style="display: none" />
          </div>
          
          <p id="tutor-4" class="user-id">ID: GymPer001</p>
          <div id="tutor-5" class="status-badge">{{ t('statusActive') }}</div>
        </div>

        <!-- Panel Derecho: Formulario en Grid de Escritorio Avanzado -->
        <div class="forms-wrapper">
          <div class="desktop-dashboard-grid">
            
            <!-- Tarjeta 1: Datos Personales (Ocupa más espacio) -->
            <div id="tutor-6" class="login-card span-two">
              <div class="card-header-flex">
                <h3 class="section-title">{{ t('personalDataTitle') }}</h3>
                <span class="card-subtitle">{{ t('personalDataSubtitle') }}</span>
              </div>
              <div class="form-grid-3">
                <div  class="input-group"><label>CURP</label><input type="text" v-model="form.curp"></div>
                <div  class="input-group"><label>{{ t('namesLabel') }}</label><input type="text" v-model="form.nombres"></div>
                <div  class="input-group"><label>{{ t('lastNamePaternalLabel') }}</label><input type="text" v-model="form.apellidoPaterno"></div>
                <div  class="input-group"><label>{{ t('lastNameMaternalLabel') }}</label><input type="text" v-model="form.apellidoMaterno"></div>
                <div  class="input-group"><label>{{ t('birthDateLabel') }}</label><input type="date" v-model="form.fechaNacimiento"></div>
                <div  class="input-group"><label>{{ t('phoneLabel') }}</label><input type="text" placeholder="+52" v-model="form.celular"></div>
                <div  class="input-group"><label>Facebook</label><input type="text" v-model="form.facebook"></div>
                <div  class="input-group"><label>Instagram</label><input type="text" v-model="form.instagram"></div>
                <div  class="input-group"><label>Tiktok</label><input type="text" v-model="form.tiktok"></div>
                <div  class="input-group span-full"><label>{{ t('otherAppsLabel') }}</label><input type="text" v-model="form.otrasApp"></div>
              </div>
            </div>

            <!-- Tarjeta 2: Credenciales -->
            <div id="tutor-7" class="login-card">
              <div class="card-header-flex">
                <h3 class="section-title">{{ t('credentialsTitle') }}</h3>
              </div>
              <div class="form-grid-1">
                <div  class="input-group"><label>{{ t('emailLabel') }}</label><input type="email" v-model="form.correo"></div>
                
                <!-- SEDES / UBICACIONES PERMITIDAS (Multiselect hacia arriba) -->
                <div class="input-group">
                  <label>{{ t('locationLabel') }}</label>
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

                <div  class="input-group"><label>{{ t('systemRoleLabel') }}</label><input type="text" v-model="form.rol"></div>
                <div  class="input-group"><label>{{ t('specialtyLabel') }}</label><input type="text" v-model="form.especialidad"></div>
              </div>
            </div>

            <!-- Tarjeta 3: Horario de trabajo -->
            <div id="tutor-8" class="login-card">
              <div class="card-header-flex">
                <h3 class="section-title">{{ t('workScheduleTitle') }}</h3>
              </div>
              <div class="form-grid-1">
                <div  class="input-group"><label>{{ t('entryTimeLabel') }}</label><input type="time" v-model="form.entrada"></div>
                <div  class="input-group"><label>{{ t('exitTimeLabel') }}</label><input type="time" v-model="form.salida"></div>
              </div>
            </div>

          </div>

          <!-- Botón de acción principal inferior alineado -->
          <div class="action-footer">
            <button id="tutor-9" class="btn-primary" @click="saveChanges">{{ t('saveChangesBtn') }}</button>
          </div>
        </div>
      </div>
    </main>
  </HeadingOwner>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router'; 
import HeadingOwner from '../HeadingOwner.vue';
import { traducciones } from '../i18n.js';

const router = useRouter(); 
const fileInput = ref(null); 
const searchQuery = ref('');
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);
const avatarSrc = ref('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3');

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
  nombres: 'Carlos Luis',
  apellidoPaterno: 'Ramírez',
  apellidoMaterno: '',
  fechaNacimiento: '',
  celular: '',
  facebook: '',
  instagram: '',
  tiktok: '',
  otrasApp: '',
  correo: '',
  sedes: ['sede_norte'], 
  rol: '',
  especialidad: '',
  entrada: '',
  salida: ''
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

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log("Buscando usuario:", searchQuery.value);
  }
};

const triggerFileUpload = () => {
  fileInput.value.click(); 
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    avatarSrc.value = URL.createObjectURL(file);
    console.log("Archivo seleccionado:", file.name);
  }
};

const saveChanges = () => {
  console.log("Guardando cambios...", form);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;600;700&display=swap');

.main-content { 
  display: flex; 
  flex-direction: column; 
  align-items: center;
  width: 100%; 
  max-width: 1550px;
  margin: 0 auto;
  padding: 30px 40px; 
  box-sizing: border-box; 
  color: var(--color-texto-general, #e5e5e5);
}

.search-bar-container-top {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 24px; 
}

.search-small { 
  width: 100%; 
  max-width: 340px; 
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  color: var(--color-highlight, #3b82f6);
  pointer-events: none;
}

.search-input-wrapper input {
  padding-left: 40px !important;
}

/* Layout Principal Grid Escritorio */
.profile-card { 
  display: grid; 
  grid-template-columns: 340px 1fr; 
  gap: 32px; 
  width: 100%; 
  align-items: start; 
}

/* Perfil Estilo Tarjeta Premium */
.profile-section { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  text-align: center; 
  background: var(--bg-cards, rgba(18, 18, 18, 0.75)); 
  backdrop-filter: blur(20px);
  padding: 40px 24px; 
  border-radius: var(--app-border-radius, 24px); 
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.12)); 
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  position: sticky;
  top: 30px;
}

.main-title { 
  font-family: 'Anton', sans-serif; 
  font-size: 2.6rem; 
  color: var(--color-titulos, #fff); 
  margin: 0 0 20px 0; 
  line-height: 1.1; 
  text-transform: uppercase; 
  letter-spacing: 1px;
}

.highlight { 
  color: var(--color-highlight, #3b82f6); 
}

.avatar-wrapper { 
  position: relative; 
  margin-bottom: 20px; 
}

.avatar-circle { 
  width: 190px; 
  height: 190px; 
  background: var(--bg-cards, #09090b); 
  border-radius: 50%; 
  border: 4px solid var(--color-highlight, #3b82f6); 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  box-shadow: 0 0 35px rgba(59, 130, 246, 0.25);
  overflow: hidden;
}

.user-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-action {
  position: absolute;
  width: 46px;  
  height: 46px; 
  border-radius: 50%;
  background: var(--color-botones, #3b82f6);
  border: 2px solid var(--bg-cards, #000);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-texto-botones, #fff);
  bottom: 0;
  right: 0;
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.2s;
}

.avatar-action svg {
  width: 20px;  
  height: 20px;
}

.user-id { 
  margin-top: 12px; 
  color: var(--color-highlight, #94a3b8); 
  font-weight: 600; 
  font-family: 'Inter', sans-serif; 
  font-size: 1.15rem;
}

.status-badge { 
  margin-top: 14px;
  background: #22c55e; 
  padding: 6px 22px; 
  border-radius: 20px; 
  font-weight: 700; 
  font-family: 'Oswald', sans-serif; 
  font-size: 0.95rem; 
  color: #fff; 
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Dashboard Grid para Escritorio */
.forms-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.desktop-dashboard-grid { 
  display: grid; 
  grid-template-columns: repeat(2, 1fr); 
  gap: 24px; 
}

.login-card { 
  background: var(--bg-cards, rgba(18, 18, 18, 0.75)); 
  backdrop-filter: blur(20px);
  padding: 28px; 
  border-radius: var(--app-border-radius, 24px); 
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.12)); 
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  height: 100%;
  box-sizing: border-box;
  position: relative;
}

.login-card.span-two {
  grid-column: span 2;
}

.card-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border-line, rgba(255, 255, 255, 0.08)); 
  padding-bottom: 12px; 
}

.section-title { 
  font-family: 'Oswald', sans-serif; 
  color: var(--color-highlight, #3b82f6); 
  font-size: 1.1rem; 
  margin: 0; 
  text-transform: uppercase; 
  letter-spacing: 0.5px;
}

.card-subtitle {
  font-size: 0.85rem;
  color: var(--color-highlight, #71717a);
  font-family: 'Inter', sans-serif;
}

/* Form Grids */
.form-grid-3 { 
  display: grid; 
  grid-template-columns: repeat(3, 1fr); 
  gap: 18px; 
}

.form-grid-3 .span-full {
  grid-column: span 3;
}

.form-grid-1 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.input-group { 
  display: flex; 
  flex-direction: column; 
  gap: 8px; 
}

label { 
  font-family: 'Oswald', sans-serif; 
  color: var(--color-etiquetas, var(--color-texto-general, #f5f5f4)); 
  font-size: 0.85rem; 
  font-weight: 600; 
  letter-spacing: 0.5px;
}

input, .custom-select { 
  background: var(--bg-input, var(--bg-cards, #141414)); 
  border: 1.5px solid var(--border-input, rgba(255, 255, 255, 0.12)); 
  border-radius: var(--app-border-radius, 12px); 
  color: var(--color-texto-input, var(--color-texto-general, #fff)); 
  padding: 12px 14px; 
  width: 100%; 
  box-sizing: border-box; 
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s, color 0.2s;
}

input:focus, .custom-select:focus {
  border-color: var(--color-highlight, #3b82f6);
  background: var(--bg-input-focus, var(--bg-cards, #141414));
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

/* Estilos personalizados del Multiselect Hacia Arriba */
.custom-multiselect {
  position: relative;
  width: 100%;
}

.select-box-trigger {
  background: var(--bg-input, var(--bg-cards, #141414)); 
  border: 1.5px solid var(--border-input, rgba(255, 255, 255, 0.12)); 
  border-radius: var(--app-border-radius, 12px); 
  color: var(--color-texto-input, var(--color-texto-general, #fff)); 
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

.dropdown-options-list {
  position: absolute;
  bottom: calc(100% + 6px);
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

.action-footer {
  display: flex;
  justify-content: flex-end;
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
    filter: brightness(0.95);
    box-shadow: 0 6px 20px rgba(28, 79, 214, 0.6);
  }
  .avatar-action:hover {
    transform: scale(1.1);
  }
}

.btn-primary:active, .avatar-action:active {
  transform: scale(0.97);
}

/* Adaptabilidad Responsiva */
@media (max-width: 1100px) {
  .form-grid-3 {
    grid-template-columns: repeat(2, 1fr);
  }
  .form-grid-3 .span-full {
    grid-column: span 2;
  }
}

@media (max-width: 900px) { 
  .profile-card { 
    grid-template-columns: 1fr; 
  } 
  .profile-section {
    position: static;
  }
  .desktop-dashboard-grid {
    grid-template-columns: 1fr;
  }
  .login-card.span-two {
    grid-column: span 1;
  }
  .form-grid-3, .form-grid-1 {
    grid-template-columns: 1fr;
  }
  .form-grid-3 .span-full {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }
  .search-bar-container-top {
    justify-content: stretch;
    margin-bottom: 16px;
  }
  .search-small {
    max-width: 100%;
  }
  .login-card {
    padding: 18px;
  }
  .avatar-circle {
    width: 140px;
    height: 140px;
  }
  .avatar-action {
    width: 38px;
    height: 38px;
  }
  .avatar-action svg {
    width: 18px;
    height: 18px;
  }
  .btn-primary {
    width: 100%;
  }
}
</style>