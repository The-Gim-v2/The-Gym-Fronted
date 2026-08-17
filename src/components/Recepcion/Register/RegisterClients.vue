<template>
  <HeadingRecepcion>
    <NotificationSystem ref="toastRef" />
    <main class="main-content">
      <div class="profile-card">
        <!-- Sección Perfil / Avatar (Fija o sticky en desktop) -->
        <div class="profile-section" id="tutorial-step-0">
          <h1 class="main-title">{{ t('title1') }}<br> <span class="highlight">{{ t('title2') }}</span></h1>
          <div class="avatar-wrapper">
            <div class="avatar-circle">
              <img v-if="avatarPreview" :src="avatarPreview" :alt="t('altPreview')" class="avatar-img" />
              <svg v-else viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <button type="button" class="avatar-action btn-camera" @click="$refs.fileInput.click()" :title="t('titleAvatar')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </button>
            <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" style="display: none" />
          </div>
          <p class="profile-hint">{{ t('hintAvatar') }}</p>
        </div>

        <!-- Columna Derecha: Formularios -->
        <div class="forms-wrapper">
          
          <!-- Datos Personales -->
          <div class="login-card" id="tutorial-step-1">
            <h3 class="section-title">{{ t('personalData') }}</h3>
            <div class="form-grid">
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
              <div class="input-group">
                <label>{{ t('email') }}</label>
                <input type="email" v-model="form.email" placeholder="ejemplo@correo.com">
              </div>
            </div>
          </div>

          <!-- Registro Físico -->
          <div class="login-card" id="tutorial-step-2">
            <h3 class="section-title">{{ t('physicalRecord') }}</h3>
            <div class="form-grid">
              <div class="input-group">
                <label>{{ t('weight') }}</label>
                <input type="number" step="0.1" v-model="form.peso" placeholder="Ej. 70">
              </div>
              <div class="input-group">
                <label>{{ t('height') }}</label>
                <input type="number" v-model="form.altura" placeholder="Ej. 175">
              </div>
            </div>
          </div>
          
          <!-- Datos de Membresía -->
          <div class="login-card" id="tutorial-step-3">
            <div class="membership-header">
              <h3 class="section-title mb-0">{{ t('membershipData') }}</h3>
              <div class="membership-actions-row">
                <div class="toggle-group-small">
                  <button type="button" class="btn-toggle-small" :class="{ active: form.tipoMembresia === 'mes' }" @click="form.tipoMembresia = 'mes'">{{ t('month') }}</button>
                  <button type="button" class="btn-toggle-small" :class="{ active: form.tipoMembresia === 'semana' }" @click="form.tipoMembresia = 'semana'">{{ t('week') }}</button>
                </div>
                <div class="actions-group">
                  <button type="button" class="action-btn" :title="t('titleCut')" @click="activeModal = 'corte'">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                  </button>
                  <button type="button" class="action-btn" :title="t('titleHelp')" @click="activeModal = 'help'">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="form-grid mt-3">
              <div class="input-group">
                <label>{{ t('enrollmentDate') }}</label>
                <input type="date" v-model="form.fechaInscripcion">
              </div>
              <div class="input-group">
                <label>{{ t('dueDate') }}</label>
                <input type="date" v-model="form.fechaCorte">
              </div>
            </div>
          </div>
          
          <button type="button" class="btn-primary" @click="saveRegistration">{{ t('finishButton') }}</button>
        </div>
      </div>
    </main>

    <transition name="pop">
      <div v-if="activeModal === 'corte'" class="modal-wrapper" @click.self="activeModal = null">
        <AddCorteComponent @close="activeModal = null" />
      </div>
    </transition> 
    
    <transition name="pop">
      <div v-if="activeModal === 'help'" class="modal-wrapper" @click.self="activeModal = null">
        <Help @close="activeModal = null" />
      </div>
    </transition> 
  </HeadingRecepcion>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import HeadingRecepcion from '../HeadingRecepcion.vue';
import AddCorteComponent from '../Componets/Cut.vue';
import Help from '../Componets/Help.vue';
import NotificationSystem from '../../Modals/NotificationSystem.vue'; 
import { traducciones } from '../i18n.js';

const router = useRouter();
const activeModal = ref(null);
const toastRef = ref(null);
const fileInput = ref(null);
const avatarPreview = ref(null);

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
  nombres: '',
  apellidoP: '',
  apellidoM: '',
  fechaNacimiento: '',
  celular: '',
  email: '',
  peso: '',
  altura: '',
  tipoMembresia: 'mes',
  fechaInscripcion: '',
  fechaCorte: ''
});

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    avatarPreview.value = URL.createObjectURL(file);
  }
};

const saveRegistration = () => {
  if (!form.nombres || !form.apellidoP || !form.apellidoM || !form.fechaNacimiento) {
    toastRef.value?.notify(t('msgWarning'), 'warning');
    return;
  }
  
  try {
    console.log("Datos a guardar:", form);
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

.highlight { color: var(--color-highlight, #3b82f6); }

.profile-card { 
  display: grid; 
  grid-template-columns: 340px minmax(0, 1fr); 
  gap: 30px; 
  width: 100%; 
  max-width: 1200px;
  margin: 0 auto;   
  align-items: start; 
}

.profile-section { 
  background: var(--bg-cards, rgba(18, 18, 18, 0.75)); 
  backdrop-filter: blur(12px);
  padding: 40px 24px; 
  border-radius: var(--app-border-radius, 24px); 
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.09));
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  text-align: center;
  position: sticky;
  top: 30px;
  overflow: hidden;
}

/* Franja de acento superior */
.profile-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-botones, #1c4fd6), var(--color-highlight, #60a5fa), var(--color-botones, #1c4fd6));
}

.main-title { 
  font-family: 'Anton', sans-serif; 
  font-size: 2.1rem; 
  color: var(--color-titulos, #fff); 
  margin: 0 0 24px 0; 
  line-height: 1.15; 
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

.forms-wrapper { 
  display: flex; 
  flex-direction: column; 
  gap: 22px; 
  width: 100%; 
}

.login-card { 
  background: var(--bg-cards, rgba(18, 18, 18, 0.75)); 
  backdrop-filter: blur(12px);
  padding: 32px; 
  border-radius: var(--app-border-radius, 24px); 
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.12)); 
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.login-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
}

.form-grid { 
  display: grid; 
  grid-template-columns: repeat(2, 1fr); 
  gap: 20px; 
}

.form-grid.mt-3 { margin-top: 4px; }

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
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s, color 0.2s;
  outline: none;
}

input:focus {
  border-color: var(--color-highlight, #3b82f6);
  background: var(--bg-input-focus, var(--bg-cards, #141414));
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.section-title { 
  font-family: 'Anton', sans-serif; 
  color: var(--color-titulos, #fff); 
  font-size: 1.3rem; 
  margin: 0 0 22px 0; 
  text-transform: uppercase; 
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 20px;
  border-radius: 4px;
  flex-shrink: 0;
  background: linear-gradient(180deg, var(--color-botones, #1c4fd6), rgba(37, 99, 235, 0.25));
}

.section-title.mb-0 {
  margin-bottom: 0;
}

/* Avatar Components */
.avatar-wrapper { 
  position: relative; 
  margin-bottom: 10px; 
  cursor: pointer;
}

.avatar-circle { 
  width: 150px; 
  height: 150px; 
  background: rgba(255, 255, 255, 0.06); 
  border-radius: 50%; 
  border: 2px dashed rgba(255, 255, 255, 0.2); 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  overflow: hidden;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1), 0 8px 24px rgba(0, 0, 0, 0.3);
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.avatar-wrapper:hover .avatar-circle {
  border-color: var(--color-highlight, #3b82f6);
  background: rgba(37, 99, 235, 0.06);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.22), 0 8px 24px rgba(0, 0, 0, 0.4);
}

.avatar-circle svg { opacity: 0.65; }

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
}

.avatar-action svg {
  width: 20px;  
  height: 20px;
}

/* Membresía header */
.membership-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 20px; 
  border-bottom: 1px solid rgba(255, 255, 255, 0.08); 
  padding-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.membership-actions-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toggle-group-small { 
  display: flex; 
  gap: 4px; 
  background: rgba(255,255,255,0.06); 
  padding: 4px; 
  border-radius: var(--app-border-radius, 10px); 
  border: 1px solid rgba(255,255,255,0.04);
}

.btn-toggle-small { 
  padding: 7px 16px; 
  border: none; 
  color: #a1a1aa; 
  border-radius: var(--app-border-radius, 8px); 
  cursor: pointer; 
  font-size: 0.8rem; 
  font-family: 'Oswald', sans-serif;
  letter-spacing: 0.5px;
  background: transparent; 
  transition: all 0.2s ease;
}

.btn-toggle-small.active { 
  background: var(--color-highlight, #3b82f6); 
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
}

.actions-group { 
  display: flex; 
  gap: 8px; 
}

.action-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #60a5fa;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--color-highlight, #3b82f6);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(59, 130, 246, 0.35);
}

.action-btn svg {
  width: 18px;
  height: 18px;
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
  align-self: flex-start;
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

/* Modal Wrapper */
.modal-wrapper {
  position: fixed;
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(6px);
  padding: 16px;
  box-sizing: border-box;
}

/* Transiciones de modales */
.pop-enter-active,
.pop-leave-active {
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Responsive Media Queries */
@media (max-width: 1024px) { 
  .profile-card { 
    grid-template-columns: 1fr; 
    gap: 20px;
  } 
  .profile-section {
    position: static;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 14px;
  }
  
  .form-grid { 
    grid-template-columns: 1fr; 
    gap: 14px;
  } 

  .login-card { 
    padding: 22px;
    border-radius: var(--app-border-radius, 20px);
  }

  .profile-section {
    padding: 28px 18px;
  }

  .main-title {
    font-size: 1.7rem;
  }

  .avatar-circle {
    width: 130px;
    height: 130px;
  }
  
  .membership-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .membership-actions-row {
    width: 100%;
    justify-content: space-between;
  }

  .btn-primary {
    width: 100%;
    align-self: stretch;
    text-align: center;
  }
}
</style>