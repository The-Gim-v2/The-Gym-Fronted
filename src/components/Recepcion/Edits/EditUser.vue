<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router'; 
import HeadingRecepcion from '../HeadingRecepcion.vue';
import { traducciones } from '../i18n.js';
import NotificationSystem from '../../Modals/NotificationSystem.vue'; 

const router = useRouter(); 
const fileInput = ref(null); 
const toastRef = ref(null); // Referencia para el componente de notificaciones
const searchQuery = ref('');
const avatarSrc = ref('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3');

const currentLang = ref(localStorage.getItem('Recepcion-idioma') || 'es');

const t = (key) => {
  const langTable = traducciones[currentLang.value] || traducciones.es;
  return langTable[key] || traducciones.es[key] || key;
};

const handleLangChange = (e) => {
  if (e.detail && e.detail.idioma) {
    currentLang.value = e.detail.idioma;
  }
};

onMounted(() => {
  window.addEventListener('idioma-changed', handleLangChange);
});

onUnmounted(() => {
  window.removeEventListener('idioma-changed', handleLangChange);
});

const form = reactive({
  nombres: 'José Luis',
  apellidoPaterno: 'Ramírez',
  apellidoMaterno: '',
  fechaNacimiento: '',
  celular: '',
  correo: '',
  peso: '',
  altura: '',
  sede: 'Matriz',
  status: 'Activo'
});

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log("Buscando cliente:", searchQuery.value);
  }
};

const goToStatistics = () => router.push({ name: 'statistics', params: { id: 'GymPer001' } });
const triggerFileUpload = () => fileInput.value.click(); 

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    avatarSrc.value = URL.createObjectURL(file);
    console.log("Archivo seleccionado:", file.name);
  }
};

const saveChanges = () => {
  console.log("Guardando cambios...", form);
  
  // Dispara la notificación de éxito (puedes ajustar el texto usando t('tuClave') o directo)
  if (toastRef.value) {
    toastRef.value.notify('Guardado correctamente', 'success');
  }
};
</script>

<template>
  <HeadingRecepcion>
    <NotificationSystem ref="toastRef" />
    <main class="main-content">
      <!-- Barra de búsqueda superior alineada -->
      <div class="search-bar-container-top">
        <div id="tutor-0" class="input-group search-small">
          <label>{{ t('searchClientLabel') }}</label>
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
          <h1 class="main-title">José Luis <br> <span class="highlight">Ramírez</span></h1>
          
          <div class="avatar-wrapper">
            <div id="tutor-2" class="avatar-circle">
              <img :src="avatarSrc" :alt="t('avatarAlt')" class="user-avatar-img" />
            </div>
            
            <button id="tutor-3" class="avatar-action btn-stats" @click="goToStatistics" :title="t('viewStatsTitle')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </button>
            
            <button id="tutor-4" class="avatar-action btn-camera" @click="triggerFileUpload" :title="t('changePhotoTitle')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </button>
            <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" style="display: none" />
          </div>
          
          <p id="tutor-5" class="user-id">ID: GymPer001</p>
          <div id="tutor-6" class="status-badge">{{ t('statusActive') }}</div>
        </div>

        <!-- Panel Derecho: Formulario en Grid de Escritorio Avanzado -->
        <div class="forms-wrapper">
          <div class="desktop-dashboard-grid">
            
            <!-- Tarjeta 1: Datos Personales (Ocupa más espacio) -->
            <div id="tutor-7" class="login-card span-two">
              <div class="card-header-flex">
                <h3 class="section-title">{{ t('personalDataTitle') }}</h3>
                <span class="card-subtitle">{{ t('clientDataSubtitle') }}</span>
              </div>
              <div class="form-grid-3">
                <div id="tutor-8" class="input-group"><label>{{ t('namesLabel') }}</label><input type="text" v-model="form.nombres"></div>
                <div id="tutor-9" class="input-group"><label>{{ t('lastNamePaternalLabel') }}</label><input type="text" v-model="form.apellidoPaterno"></div>
                <div id="tutor-10" class="input-group"><label>{{ t('lastNameMaternalLabel') }}</label><input type="text" v-model="form.apellidoMaterno"></div>
                <div id="tutor-11" class="input-group"><label>{{ t('birthDateLabel') }}</label><input type="date" v-model="form.fechaNacimiento"></div>
                <div id="tutor-12" class="input-group"><label>{{ t('phoneLabel') }}</label><input type="text" placeholder="+52" v-model="form.celular"></div>
                <div id="tutor-13" class="input-group"><label>{{ t('emailLabel') }}</label><input type="email" v-model="form.correo"></div>
              </div>
            </div>

            <!-- Tarjeta 2: Seguimiento Físico -->
            <div id="tutor-14" class="login-card">
              <div class="card-header-flex">
                <h3 class="section-title">{{ t('physicalTrackingTitle') }}</h3>
              </div>
              <div class="form-grid-1">
                <div id="tutor-15" class="input-group"><label>{{ t('initialWeightLabel') }}</label><input type="number" v-model="form.peso"></div>
                <div id="tutor-16" class="input-group"><label>{{ t('initialHeightLabel') }}</label><input type="number" v-model="form.altura"></div>
              </div>
            </div>

            <!-- Tarjeta 3: Membresía -->
            <div id="tutor-17" class="login-card">
              <div class="card-header-flex">
                <h3 class="section-title">{{ t('membershipTitle') }}</h3>
              </div>
              <div class="form-grid-1">
                <div id="tutor-18" class="input-group"><label>{{ t('locationLabel') }}</label><input type="text" v-model="form.sede"></div>
                <div id="tutor-19" class="input-group"><label>{{ t('statusLabel') }}</label><input type="text" v-model="form.status"></div>
              </div>
            </div>

          </div>

          <!-- Botón de acción principal inferior alineado -->
          <div class="action-footer">
            <button id="tutor-20" class="btn-primary" @click="saveChanges">{{ t('saveChangesBtn') }}</button>
          </div>
        </div>
      </div>
    </main>
  </HeadingRecepcion>
</template>

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
  overflow: hidden;
}

.profile-section::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-botones, #1c4fd6), var(--color-highlight, #60a5fa), var(--color-botones, #1c4fd6));
}

.main-title { 
  font-family: 'Anton', sans-serif; 
  font-size: 2.4rem; 
  color: var(--color-titulos, #fff); 
  margin: 0 0 20px 0; 
  line-height: 1.15; 
  text-transform: uppercase; 
  letter-spacing: 1px;
}

.highlight { 
  color: var(--color-highlight, #3b82f6); 
}

.avatar-wrapper { 
  position: relative; 
  margin-bottom: 20px; 
  cursor: pointer;
}

.avatar-circle { 
  width: 180px; 
  height: 180px; 
  background: var(--bg-cards, #09090b); 
  border-radius: 50%; 
  border: 4px solid var(--color-highlight, #3b82f6); 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.08), 0 0 35px rgba(59, 130, 246, 0.25);
  overflow: hidden;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}

.avatar-wrapper:hover .avatar-circle {
  box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.14), 0 0 45px rgba(59, 130, 246, 0.4);
  transform: scale(1.015);
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
  box-shadow: 0 4px 12px rgba(0,0,0,0.35);
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.2s;
}

.avatar-action svg {
  width: 20px;  
  height: 20px;
}

.btn-stats { top: 0; left: 0; }
.btn-camera { bottom: 0; right: 0; }

.user-id { 
  margin-top: 12px; 
  color: var(--color-highlight, #94a3b8); 
  font-weight: 600; 
  font-family: 'Inter', sans-serif; 
  font-size: 1.1rem;
  letter-spacing: 0.3px;
}

.status-badge { 
  margin-top: 14px;
  background: rgba(34, 197, 94, 0.12); 
  border: 1px solid rgba(34, 197, 94, 0.35);
  padding: 7px 22px; 
  border-radius: 20px; 
  font-weight: 700; 
  font-family: 'Oswald', sans-serif; 
  font-size: 0.9rem; 
  color: #4ade80; 
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.status-badge::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
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
  padding: 30px; 
  border-radius: var(--app-border-radius, 24px); 
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.12)); 
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  height: 100%;
  box-sizing: border-box;
  position: relative;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.login-card:hover {
  border-color: rgba(255, 255, 255, 0.22);
  transform: translateY(-2px);
}

.login-card.span-two {
  grid-column: span 2;
}

.card-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 22px;
  border-bottom: 1px solid var(--border-line, rgba(255, 255, 255, 0.08)); 
  padding-bottom: 14px; 
}

.section-title { 
  font-family: 'Anton', sans-serif; 
  color: var(--color-titulos, #fff); 
  font-size: 1.25rem; 
  margin: 0; 
  text-transform: uppercase; 
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 18px;
  border-radius: 4px;
  flex-shrink: 0;
  background: linear-gradient(180deg, var(--color-botones, #1c4fd6), rgba(37, 99, 235, 0.25));
}

.card-subtitle {
  font-size: 0.82rem;
  color: var(--color-highlight, #71717a);
  font-family: 'Inter', sans-serif;
}

/* Form Grids */
.form-grid-3 { 
  display: grid; 
  grid-template-columns: repeat(3, 1fr); 
  gap: 18px; 
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
  min-width: 0;
}
:deep(.notification-container),
:deep(.toast-container) {
  width: calc(100% - 32px) !important;
  max-width: 480px !important;
  box-sizing: border-box !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  right: auto !important;
  margin: 0 auto !important;
}
label { 
  font-family: 'Oswald', sans-serif; 
  color: var(--color-etiquetas, var(--color-texto-general, #f5f5f4)); 
  font-size: 0.85rem; 
  font-weight: 600; 
  letter-spacing: 0.5px;
}

input { 
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

input:hover {
  border-color: rgba(255, 255, 255, 0.22);
}

input:focus {
  border-color: var(--color-highlight, #3b82f6);
  background: var(--bg-input-focus, var(--bg-cards, #141414));
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
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
}

@media (max-width: 900px) { 
  .profile-card { 
    grid-template-columns: 1fr; 
    gap: 20px;
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
  .profile-section {
    padding: 30px 18px;
  }
  .main-title {
    font-size: 1.8rem;
  }
  .login-card {
    padding: 20px;
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

@media (max-width: 420px) {
  .main-content {
    padding: 12px;
  }
  .login-card {
    padding: 16px;
    border-radius: var(--app-border-radius, 18px);
  }
  .main-title {
    font-size: 1.5rem;
  }
}
</style>