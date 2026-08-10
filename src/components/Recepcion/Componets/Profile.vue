<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router'; 
import HeadingRecepcion from '../HeadingRecepcion.vue';


const currentLang = ref(localStorage.getItem('recepcion-idioma') || 'es');
const router = useRouter();

const t = (key: string) => {
  const langTable = translations[currentLang.value as keyof typeof translations] || translations.es;
  return langTable[key as keyof typeof langTable] || translations.es[key as keyof typeof translations.es] || key;
};

const handleLangChange = (e: Event) => {
  const customEvent = e as CustomEvent<{ idioma?: string }>;
  if (customEvent.detail && customEvent.detail.idioma) {
    currentLang.value = customEvent.detail.idioma;
  }
};
// Diccionario integrado con las traducciones completas para evitar llaves sueltas
const translations = {
  es: {
    profileTitle: "MI PERFIL DE RECEPCIÓN",
    uploadPhotoTooltip: "Subir fotografía oficial",
    profileHintText: "Sube una fotografía oficial o reciente para el expediente del empleado.",
    credentialsAndRoleTitle: "Credenciales y Rol",
    systemRoleLabel: "Rol en el sistema",
    emailLabel: "Correo electrónico",
    employeeDataTitle: "Datos del Empleado",
    curpLabel: "CURP",
    namesLabel: "Nombres",
    paternalLastNameLabel: "Apellido Paterno",
    maternalLastNameLabel: "Apellido Materno",
    birthDateLabel: "Fecha de Nacimiento",
    cellphoneEditableLabel: "Celular (Editable)",
    workScheduleTitle: "Horario de Trabajo",
    entryTimeLabel: "Entrada",
    exitTimeLabel: "Salida",
    securityAndPasswordTitle: "Seguridad y Contraseña",
    newPasswordLabel: "Nueva Contraseña",
    optionalPlaceholder: "Opcional / Dejar en blanco",
    confirmPasswordLabel: "Confirmar Contraseña",
    confirmPasswordPlaceholder: "Confirmar contraseña",
    saveChangesBtn: "Guardar Cambios",
    credentialsUpdateModalTitle: "Actualización de Credenciales",
    emailChangeWarningText: "Has modificado tu correo electrónico. Por seguridad y control de acceso, es obligatorio ingresar y confirmar una nueva contraseña.",
    newAccessPasswordLabel: "Nueva Contraseña de Acceso",
    enterNewPasswordPlaceholder: "Ingresa la nueva contraseña",
    cancelBtn: "Cancelar",
    confirmChangeBtn: "Confirmar Cambio",
    photoUpdatedMsg: "Fotografía actualizada correctamente",
    savedSuccessMsg: "Cambios guardados con éxito",
    passwordWarningMsg: "Debes ingresar y confirmar una nueva contraseña por seguridad al cambiar el correo.",
    emailChangedMsg: "Correo actualizado correctamente. Redirigindo..."
  },
  en: {
    profileTitle: "RECEPTION PROFILE",
    uploadPhotoTooltip: "Upload official photograph",
    profileHintText: "Upload an official or recent photograph for the employee record.",
    credentialsAndRoleTitle: "Credentials and Role",
    systemRoleLabel: "System Role",
    emailLabel: "Email Address",
    employeeDataTitle: "Employee Data",
    curpLabel: "CURP",
    namesLabel: "First Names",
    paternalLastNameLabel: "Last Name",
    maternalLastNameLabel: "Mother's Last Name",
    birthDateLabel: "Birth Date",
    cellphoneEditableLabel: "Mobile (Editable)",
    workScheduleTitle: "Work Schedule",
    entryTimeLabel: "Check-in",
    exitTimeLabel: "Check-out",
    securityAndPasswordTitle: "Security & Password",
    newPasswordLabel: "New Password",
    optionalPlaceholder: "Optional / Leave blank",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "Confirm password",
    saveChangesBtn: "Save Changes",
    credentialsUpdateModalTitle: "Credentials Update",
    emailChangeWarningText: "You have changed your email address. For security and access control reasons, you must enter and confirm a new password.",
    newAccessPasswordLabel: "New Access Password",
    enterNewPasswordPlaceholder: "Enter new password",
    cancelBtn: "Cancel",
    confirmChangeBtn: "Confirm Change",
    photoUpdatedMsg: "Photograph updated successfully",
    savedSuccessMsg: "Changes saved successfully",
    passwordWarningMsg: "You must enter and confirm a new password for security when changing your email.",
    emailChangedMsg: "Email updated successfully. Redirecting..."
  }
};





onMounted(() => {
  window.addEventListener('idioma-changed', handleLangChange as EventListener);
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('idioma-changed', handleLangChange as EventListener);
  window.removeEventListener('scroll', handleScroll);
});

const fileInput = ref<HTMLInputElement | null>(null);
const previewImage = ref<string | null>(null);
const showPassword = ref(false);
const showEmailModal = ref(false);

const notification = reactive({
  show: false,
  message: '',
  type: 'success' as 'success' | 'warning' | 'info'
});

const showNotification = (msg: string, type: 'success' | 'warning' | 'info' = 'success', duration = 4000) => {
  notification.message = msg;
  notification.type = type;
  notification.show = true;
  setTimeout(() => {
    notification.show = false;
  }, duration);
};

const scrollY = ref(0);
const profileTranslateY = ref(0);

const handleScroll = () => {
  scrollY.value = window.scrollY;
  if (window.innerWidth > 1024) {
    const offset = scrollY.value * 0.18;
    profileTranslateY.value = Math.min(offset, 250);
  } else {
    profileTranslateY.value = 0;
  }
};

const form = reactive({
  rol: 'Recepción',
  email: 'recepcion@ironfitness.com',
  curp: 'IFCR010101HDF000',
  nombres: 'María Fernanda',
  apellidoP: 'López',
  apellidoM: 'Ramírez',
  fechaNac: '1995-04-12',
  celular: '4819876543',
  horaEntrada: '08:00',
  horaSalida: '16:00',
  password: '',
  confirmPassword: ''
});

const originalEmail = ref(form.email);

const triggerFileInput = () => fileInput.value?.click();
const onFileSelected = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    previewImage.value = URL.createObjectURL(file);
    showNotification(t('photoUpdatedMsg'), 'info');
  }
};

const handleSaveChanges = () => {
  if (form.email !== originalEmail.value) {
    showEmailModal.value = true;
    return;
  }
  showNotification(t('savedSuccessMsg'), 'success');
};

const confirmEmailAndPasswordChange = () => {
  if (!form.password || form.password !== form.confirmPassword) {
    showNotification(t('passwordWarningMsg'), 'warning');
    return;
  }

  showEmailModal.value = false;
  showNotification(t('emailChangedMsg'), 'info', 4000);

  setTimeout(() => {
  localStorage.removeItem('user_role');
  localStorage.removeItem('token'); 
  localStorage.removeItem('user');
  
  router.replace({ name: 'login' }); 
  }, 2000);
};
</script>

<template>
  <HeadingRecepcion>
    <main class="main-content">
      
      <transition name="toast">
        <div v-if="notification.show" class="floating-toast" :class="notification.type">
          <svg v-if="notification.type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <svg v-else-if="notification.type === 'warning'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <span>{{ notification.message }}</span>
        </div>
      </transition>

      <div class="profile-card">
        
        <div 
          class="profile-section" 
          :style="{ transform: `translateY(${profileTranslateY}px)` }"
        >
          <h1 class="main-title">{{ t('profileTitle') }}</h1>
          
          <div class="avatar-wrapper" @click="triggerFileInput" :title="t('uploadPhotoTooltip')">
            <div class="avatar-circle">
              <img v-if="previewImage" :src="previewImage" alt="Vista previa" class="avatar-img" />
              <svg v-else viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <button type="button" class="avatar-action btn-camera" :title="t('uploadPhotoTooltip')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </button>
            <input type="file" ref="fileInput" @change="onFileSelected" accept="image/*" style="display: none" />
          </div>

          <h3 class="gym-name-display">{{ form.nombres }} {{ form.apellidoP }}</h3>
          <p class="profile-hint">{{ t('profileHintText') }}</p>
        </div>

        <div class="forms-wrapper">
          <form @submit.prevent="handleSaveChanges">
            
            <div class="login-card">
              <h3 class="section-title">{{ t('credentialsAndRoleTitle') }}</h3>
              <div class="form-grid">
                <div class="input-group">
                  <label for="rol">{{ t('systemRoleLabel') }}</label>
                  <input id="rol" type="text" v-model="form.rol" disabled class="input-disabled" />
                </div>
                <div class="input-group">
                  <label for="email">{{ t('emailLabel') }}</label>
                  <input id="email" type="email" v-model="form.email" required />
                </div>
              </div>
            </div>

            <div class="login-card">
              <h3 class="section-title">{{ t('employeeDataTitle') }}</h3>
              <div class="form-grid">
                <div class="input-group span-2">
                  <label for="curp">{{ t('curpLabel') }}</label>
                  <input id="curp" type="text" v-model="form.curp" disabled class="input-disabled" />
                </div>
                <div class="input-group">
                  <label for="nombres">{{ t('namesLabel') }}</label>
                  <input id="nombres" type="text" v-model="form.nombres" disabled class="input-disabled" />
                </div>
                <div class="input-group">
                  <label for="apellidoP">{{ t('paternalLastNameLabel') }}</label>
                  <input id="apellidoP" type="text" v-model="form.apellidoP" disabled class="input-disabled" />
                </div>
                <div class="input-group">
                  <label for="apellidoM">{{ t('maternalLastNameLabel') }}</label>
                  <input id="apellidoM" type="text" v-model="form.apellidoM" disabled class="input-disabled" />
                </div>
                <div class="input-group">
                  <label for="fechaNac">{{ t('birthDateLabel') }}</label>
                  <input id="fechaNac" type="date" v-model="form.fechaNac" disabled class="input-disabled" />
                </div>
                <div class="input-group">
                  <label for="celular">{{ t('cellphoneEditableLabel') }}</label>
                  <input id="celular" type="tel" v-model="form.celular" required />
                </div>
              </div>
            </div>

            <div class="login-card">
              <h3 class="section-title">{{ t('workScheduleTitle') }}</h3>
              <div class="form-grid">
                <div class="input-group">
                  <label for="horaEntrada">{{ t('entryTimeLabel') }}</label>
                  <input id="horaEntrada" type="text" v-model="form.horaEntrada" disabled class="input-disabled" />
                </div>
                <div class="input-group">
                  <label for="horaSalida">{{ t('exitTimeLabel') }}</label>
                  <input id="horaSalida" type="text" v-model="form.horaSalida" disabled class="input-disabled" />
                </div>
              </div>
            </div>

            <div class="login-card">
              <h3 class="section-title">{{ t('securityAndPasswordTitle') }}</h3>
              <div class="form-grid">
                <div class="input-group">
                  <label for="password">{{ t('newPasswordLabel') }}</label>
                  <div class="input-wrapper">
                    <input id="password" :type="showPassword ? 'text' : 'password'" v-model="form.password" :placeholder="t('optionalPlaceholder')" />
                    <button type="button" class="toggle-password-btn" @click="showPassword = !showPassword">
                      <svg v-if="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </button>
                  </div>
                </div>
                <div class="input-group">
                  <label for="confirmPassword">{{ t('confirmPasswordLabel') }}</label>
                  <input id="confirmPassword" type="password" v-model="form.confirmPassword" :placeholder="t('confirmPasswordPlaceholder')" />
                </div>
              </div>
            </div>

            <button type="submit" class="btn-primary">{{ t('saveChangesBtn') }}</button>
          </form>
        </div>
      </div>

      <!-- Modal con textos traducidos correctamente -->
      <div v-if="showEmailModal" class="modal-overlay" @click.self="showEmailModal = false">
        <div class="modal-container modal-small animate-modal">
          <div class="modal-header">
            <h3>{{ t('credentialsUpdateModalTitle') }}</h3>
            <button class="close-btn" @click="showEmailModal = false">&times;</button>
          </div>
          <div class="modal-body text-center">
            <div class="warning-icon-wrapper">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <p class="modal-text">
              {{ t('emailChangeWarningText') }}
            </p>
            <div class="input-group mb-3 text-left" style="text-align: left;">
              <label>{{ t('newAccessPasswordLabel') }}</label>
              <input type="password" v-model="form.password" :placeholder="t('enterNewPasswordPlaceholder')" required />
            </div>
            <div class="input-group mb-4 text-left" style="text-align: left;">
              <label>{{ t('confirmPasswordLabel') }}</label>
              <input type="password" v-model="form.confirmPassword" :placeholder="t('confirmPasswordPlaceholder')" required />
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-secondary-modal" @click="showEmailModal = false">{{ t('cancelBtn') }}</button>
              <button type="button" class="btn-primary-modal" @click="confirmEmailAndPasswordChange">{{ t('confirmChangeBtn') }}</button>
            </div>
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
  justify-content: center; 
  width: 100%; 
  padding: 40px clamp(16px, 3vw, 40px); 
  box-sizing: border-box; 
  position: relative;
  color: var(--color-texto-general, #e5e5e5);
}

.animate-modal {
  animation: modalScale 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes modalScale {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.floating-toast {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 3000;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 22px;
  border-radius: var(--app-border-radius, 14px);
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  backdrop-filter: blur(10px);
}
.floating-toast.success {
  background: rgba(16, 185, 129, 0.9);
  color: #fff;
  border: 1px solid rgba(52, 211, 153, 0.4);
}
.floating-toast.warning {
  background: rgba(245, 158, 11, 0.9);
  color: #fff;
  border: 1px solid rgba(251, 191, 36, 0.4);
}
.floating-toast.info {
  background: rgba(59, 130, 246, 0.9);
  color: #fff;
  border: 1px solid rgba(96, 165, 250, 0.4);
}

.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-20px); }

.profile-card { 
  display: grid; 
  grid-template-columns: 340px minmax(0, 1fr); 
  gap: 30px; 
  width: 100%; 
  max-width: 1250px;
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
  transition: transform 0.1s cubic-bezier(0, 0, 0.2, 1);
  will-change: transform;
}

.main-title { 
  font-family: 'Anton', sans-serif; 
  font-size: 1.8rem; 
  color: var(--color-titulos, #fff); 
  margin: 0 0 24px 0; 
  line-height: 1.1; 
  text-transform: uppercase; 
  letter-spacing: 0.5px;
}

.gym-name-display {
  font-family: 'Anton', sans-serif;
  font-size: 1.3rem;
  color: var(--color-titulos, #fff);
  margin: 16px 0 6px;
  letter-spacing: 0.5px;
}

.profile-hint {
  font-family: 'Inter', sans-serif;
  color: var(--color-highlight, #94a3b8);
  font-size: 0.85rem;
  line-height: 1.4;
  margin-top: 6px;
}

.forms-wrapper { 
  display: flex; 
  flex-direction: column; 
  gap: 32px; 
  width: 100%; 
}

.login-card { 
  background: var(--bg-cards, rgba(18, 18, 18, 0.75)); 
  backdrop-filter: blur(12px);
  padding: 36px; 
  margin-top: 25px;
  border-radius: var(--app-border-radius, 24px); 
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.12)); 
  box-sizing: border-box;
}

.form-grid { 
  display: grid; 
  grid-template-columns: repeat(2, 1fr); 
  gap: 24px; 
}

.span-2 { grid-column: span 2; }
.mb-3 { margin-bottom: 16px; }
.mb-4 { margin-bottom: 24px; }

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
}

input:focus {
  border-color: var(--color-highlight, #3b82f6);
  outline: none;
  background: var(--bg-input-focus, var(--bg-cards, #141414));
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.input-disabled {
  background: #0d0d0d !important;
  color: #71717a !important;
  border-color: rgba(255, 255, 255, 0.06) !important;
  cursor: not-allowed !important;
}

.section-title { 
  font-family: 'Oswald', sans-serif; 
  color: var(--color-highlight, #5b8bf0); 
  font-size: 0.95rem; 
  margin: 0 0 24px 0; 
  text-transform: uppercase; 
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border-line, rgba(255, 255, 255, 0.08)); 
  padding-bottom: 12px; 
}

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
  cursor: pointer;
}

.avatar-action { 
  position: absolute; 
  width: 42px; 
  height: 42px; 
  border-radius: 50%; 
  background: var(--color-botones, #3b82f6); 
  border: 2px solid var(--bg-cards, #121212); 
  cursor: pointer; 
  bottom: 0; 
  right: 0; 
  display: flex; 
  align-items: center; 
  justify-content: center;
  color: white;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.avatar-action svg { width: 20px; height: 20px; }

.input-wrapper { position: relative; }
.toggle-password-btn {
  position: absolute; right: 0; top: 0; height: 100%; width: 44px;
  background: transparent; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: rgba(245, 245, 244, 0.4);
}

.btn-primary {
  width: 100%;
  padding: 16px;
  background: var(--color-botones, #1c4fd6);
  color: white;
  border: none;
  border-radius: var(--app-border-radius, 14px);
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.5px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(28, 79, 214, 0.35);
  margin-top: 25px;
}

.btn-primary:hover {
  background: var(--color-botones, #1742be);
  transform: translateY(-2px);
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-container {
  background: var(--bg-cards, #161616);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.15));
  border-radius: var(--app-border-radius, 20px);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.6);
}

.modal-small {
  max-width: 420px !important;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-line, rgba(255, 255, 255, 0.08));
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  font-family: 'Oswald', sans-serif;
  color: var(--color-titulos, #fff);
  font-size: 1.1rem;
  margin: 0;
  letter-spacing: 0.5px;
}

.close-btn {
  background: transparent;
  border: none;
  color: #aaa;
  font-size: 1.8rem;
  cursor: pointer;
  line-height: 1;
}

.close-btn:hover { color: #fff; }

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.text-center { text-align: center; }

.warning-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px auto;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.modal-text {
  font-family: 'Inter', sans-serif;
  color: #cbd5e1;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 20px;
}

.modal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 10px;
}

.btn-secondary-modal {
  padding: 12px;
  border-radius: var(--app-border-radius, 12px);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  text-transform: uppercase;
}

.btn-primary-modal {
  padding: 12px;
  border-radius: var(--app-border-radius, 12px);
  background: #3b82f6;
  border: none;
  color: #fff;
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  text-transform: uppercase;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary-modal:hover {
  background: #2563eb;
}

@media (max-width: 1024px) { 
  .profile-card { grid-template-columns: 1fr; } 
  .profile-section { position: static; transform: none !important; }
}

@media (max-width: 768px) {
  .form-grid { grid-template-columns: 1fr; gap: 14px; }
  .span-2 { grid-column: span 1; }
}
</style>