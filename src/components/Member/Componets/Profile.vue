<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router'; 
import HeadingAtleta from '../HeadingMember.vue';
import MembershipModal from '../Modals/UpgradeMembershipModal.vue';

const router = useRouter();

// Sistema de idioma reactivo unificado basado en computada por objeto
const currentLang = ref(localStorage.getItem('member-idioma') || 'es');

const translations = {
  es: {
    profileTitle: "MI PERFIL DE ATLETA",
    uploadPhotoTooltip: "Subir fotografía oficial",
    profileHintText: "Sube una fotografía oficial o reciente para tu expediente de atleta.",
    statusActive: "Activo",
    statusPending: "Pendiente",
    statusSuspended: "Suspendido",
    athleteStatusLabel: "Estado de la Cuenta",
    credentialsAndRoleTitle: "Credenciales y Rol",
    systemRoleLabel: "Rol en el sistema",
    emailLabel: "Correo electrónico",
    personalDataTitle: "Datos Personales, Físicos y Antropométricos",
    namesLabel: "Nombres",
    paternalLastNameLabel: "Apellido Paterno",
    maternalLastNameLabel: "Apellido Materno",
    birthDateLabel: "Fecha de Nacimiento",
    cellphoneEditableLabel: "Celular (Editable)",
    addressLabel: "Dirección (Calle y Número)",
    cityLabel: "Ciudad",
    stateLabel: "Estado / Provincia",
    postalCodeLabel: "Código Postal",
    weightLabel: "Peso (kg)",
    alturaLabel: "Altura (m)",
    bodyFatLabel: "% Grasa Corporal",
    muscleMassLabel: "Masa Muscular (kg)",
    chestLabel: "Pecho / Tórax (cm)",
    waistLabel: "Cintura (cm)",
    armsLabel: "Brazos (cm)",
    legsLabel: "Piernas (cm)",
    gymMembershipTitle: "Membresía del Gimnasio (Físico - Sede)",
    gymMembershipTypeLabel: "Tipo de Membresía",
    enrollmentDateLabel: "Fecha de Inscripción",
    cutoffDateLabel: "Fecha de Corte",
    amountPaidLabel: "Cantidad Pagada ($)",
    webSubscriptionTitle: "Suscripción al Sistema (Web)",
    currentWebPlanLabel: "Membresía Actual (Sistema)",
    cancelSubscriptionBtn: "Cancelar suscripción web",
    securityAndPasswordTitle: "Seguridad y Contraseña",
    newPasswordLabel: "Nueva Contraseña",
    optionalPlaceholder: "Opcional / Dejar en blanco",
    confirmPasswordLabel: "Confirmar Contraseña",
    confirmPasswordPlaceholder: "Confirmar contraseña",
    saveChangesBtn: "Guardar Cambios",
    credentialsUpdateModalTitle: "Actualización de Credenciales",
    emailChangeWarningText: "Has cambiado tu correo electrónico. Por motivos de seguridad y control de acceso, es obligatorio ingresar y confirmar una nueva contraseña en este momento.",
    newAccessPasswordLabel: "Nueva Contraseña de Acceso",
    enterNewPasswordPlaceholder: "Ingresa contraseña nueva",
    confirmNewPasswordPlaceholder: "Confirma contraseña nueva",
    cancelBtn: "Cancelar",
    confirmChangeBtn: "Confirmar Cambio",
    photoUpdatedMsg: "Fotografía actualizada correctamente",
    savedSuccessMsg: "Cambios guardados con éxito",
    passwordWarningMsg: "Debes ingresar y confirmar una nueva contraseña por seguridad al cambiar el correo.",
    emailChangedMsg: "Correo anterior actualizado. Se han guardado tus datos personales y corporales correctamente.",
    modalCancelTitle: "Cancelar Suscripción",
    modalCancelText: "¿Estás seguro de que deseas cancelar tu suscripción?\nPerderás acceso a los beneficios Pro al finalizar el periodo actual.",
    btnKeepPlan: "CONSERVAR PLAN",
    btnConfirmCancel: "SÍ, CANCELAR",
    subscriptionCancelledMsg: "Suscripción cancelada correctamente"
  },
  en: {
    profileTitle: "ATHLETE PROFILE",
    uploadPhotoTooltip: "Upload official photograph",
    profileHintText: "Upload an official or recent photograph for your athlete record.",
    statusActive: "Active",
    statusPending: "Pending",
    statusSuspended: "Suspended",
    athleteStatusLabel: "Account Status",
    credentialsAndRoleTitle: "Credentials and Role",
    systemRoleLabel: "System Role",
    emailLabel: "Email Address",
    personalDataTitle: "Personal, Body & Anthropometric Data",
    namesLabel: "First Names",
    paternalLastNameLabel: "Last Name",
    maternalLastNameLabel: "Mother's Last Name",
    birthDateLabel: "Birth Date",
    cellphoneEditableLabel: "Mobile (Editable)",
    addressLabel: "Address (Street & Number)",
    cityLabel: "City",
    stateLabel: "State / Province",
    postalCodeLabel: "Postal Code",
    weightLabel: "Weight (kg)",
    alturaLabel: "Height (m)",
    bodyFatLabel: "Body Fat (%)",
    muscleMassLabel: "Muscle Mass (kg)",
    chestLabel: "Chest (cm)",
    waistLabel: "Waist (cm)",
    armsLabel: "Arms (cm)",
    legsLabel: "Legs (cm)",
    gymMembershipTitle: "Gym Membership (Physical - Venue)",
    gymMembershipTypeLabel: "Membership Type",
    enrollmentDateLabel: "Enrollment Date",
    cutoffDateLabel: "Cutoff Date",
    amountPaidLabel: "Amount Paid ($)",
    webSubscriptionTitle: "System Subscription (Web)",
    currentWebPlanLabel: "Current Plan (System)",
    cancelSubscriptionBtn: "Cancel web subscription",
    securityAndPasswordTitle: "Security & Password",
    newPasswordLabel: "New Password",
    optionalPlaceholder: "Optional / Leave blank",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "Confirm password",
    saveChangesBtn: "Save Changes",
    credentialsUpdateModalTitle: "Credentials Update",
    emailChangeWarningText: "You have changed your email address. For security and access control reasons, you must enter and confirm a new password at this time.",
    newAccessPasswordLabel: "New Access Password",
    enterNewPasswordPlaceholder: "Enter new password",
    confirmNewPasswordPlaceholder: "Confirm new password",
    cancelBtn: "Cancel",
    confirmChangeBtn: "Confirm Change",
    photoUpdatedMsg: "Photograph updated successfully",
    savedSuccessMsg: "Changes saved successfully",
    passwordWarningMsg: "You must enter and confirm a new password for security when changing your email.",
    emailChangedMsg: "Previous email updated. Your personal and body data have been saved successfully.",
    modalCancelTitle: "Cancel Subscription",
    modalCancelText: "Are you sure you want to cancel your subscription?\nYou will lose access to Pro benefits at the end of the current period.",
    btnKeepPlan: "KEEP PLAN",
    btnConfirmCancel: "YES, CANCEL",
    subscriptionCancelledMsg: "Subscription cancelled successfully"
  }
};

const t = computed(() => translations[currentLang.value as keyof typeof translations] || translations.es);

const handleLangChange = (e: Event) => {
  const customEvent = e as CustomEvent<{ idioma?: string }>;
  if (customEvent.detail && customEvent.detail.idioma) {
    currentLang.value = customEvent.detail.idioma;
  }
};


const showMembershipModal = ref(false);

const openMembershipModal = () => {
  showMembershipModal.value = true;
};

const closeMembershipModal = () => {
  showMembershipModal.value = false;
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
  nombres: 'Carlos Alberto',
  apellidoP: 'Martínez',
  apellidoM: 'Sánchez',
  fechaNacimiento: '1998-07-22',
  celular: '4811234567',
  email: 'atleta@ironfitness.com',
  direccion: 'Av. Las Palmas #420',
  ciudad: 'Ciudad Valles',
  estado: 'San Luis Potosí',
  codigoPostal: '79000',
  status: 'activo',
  peso: '75.5',
  altura: '1.78',
  grasaCorporal: '14.5',
  masaMuscular: '38.2',
  pecho: '102',
  cintura: '81',
  brazos: '37',
  legs: '58',
  tipoMembresia: 'mes', 
  fechaInscripcion: '2026-01-15', 
  fechaCorte: '2026-09-15',
  montoPagado: '650.00', 
  rol: 'Atleta',
  webPlan: 'Plan Pro - Sede Principal (Activa)',
  password: '',
  confirmPassword: ''
});

const originalEmail = ref(form.email);

const triggerFileInput = () => fileInput.value?.click();
const onFileSelected = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    previewImage.value = URL.createObjectURL(file);
    showNotification(t.value.photoUpdatedMsg, 'info');
  }
};

const handleSaveChanges = () => {
  if (form.email !== originalEmail.value) {
    showEmailModal.value = true;
    return;
  }
  showNotification(t.value.savedSuccessMsg, 'success');
};

const showPaymentModal = ref(false); 
const handleUpdateMembership = () => {
  showPaymentModal.value = true;
};
const handlePaymentSuccess = (msg: string) => {
  showPaymentModal.value = false;
  showNotification(msg, 'success');
};

const showCancelModal = ref(false);

const handleCancelSubscription = () => {
  showCancelModal.value = true;
};

const confirmCancelSubscription = () => {
  showCancelModal.value = false;
  showNotification(t.value.subscriptionCancelledMsg, 'warning');
};

const confirmEmailAndPasswordChange = () => {
  if (!form.password || form.password !== form.confirmPassword) {
    showNotification(t.value.passwordWarningMsg, 'warning');
    return;
  }

  showEmailModal.value = false;
  showNotification(t.value.emailChangedMsg, 'info', 5000);

  setTimeout(() => {
  localStorage.removeItem('user_role');
  localStorage.removeItem('token'); 
  localStorage.removeItem('user');
  
  router.replace({ name: 'login' }); 
  }, 2000);
};

</script>

<template>
  <HeadingAtleta>
    <main class="main-content" id="tutorial-profile-main">
      
      <!-- Notificación flotante tipo Toast -->
      <transition name="toast">
        <div v-if="notification.show" class="floating-toast" :class="notification.type">
          <svg v-if="notification.type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <svg v-else-if="notification.type === 'warning'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <span>{{ notification.message }}</span>
        </div>
      </transition>

      <div class="profile-card">
        
        <!-- Tarjeta Lateral / Avatar y Estado -->
        <div 
          class="profile-section" 
          :style="{ transform: `translateY(${profileTranslateY}px)` }"
          id="tutorial-profile-sidebar"
        >
          <h1 class="main-title" id="tutorial-profile-title">{{ t.profileTitle }}</h1>
          
          <div class="avatar-wrapper" @click="triggerFileInput" :title="t.uploadPhotoTooltip" id="tutorial-avatar-box">
            <div class="avatar-circle">
              <img v-if="previewImage" :src="previewImage" alt="Vista previa" class="avatar-img" />
              <svg v-else viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <button type="button" class="avatar-action btn-camera" :title="t.uploadPhotoTooltip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </button>
            <input type="file" ref="fileInput" @change="onFileSelected" accept="image/*" style="display: none" />
          </div>

          <h3 class="gym-name-display" id="tutorial-athlete-name">{{ form.nombres }} {{ form.apellidoP }}</h3>
          
          <div class="status-badge-container" id="tutorial-status-badge">
            <span class="status-pill" :class="form.status">
              <span class="status-dot"></span>
              {{ form.status === 'activo' ? t.statusActive : form.status === 'pendiente' ? t.statusPending : t.statusSuspended }}
            </span>
          </div>

          <p class="profile-hint">{{ t.profileHintText }}</p>
        </div>

        <!-- Formularios de Edición -->
        <div class="forms-wrapper">
          <form @submit.prevent="handleSaveChanges">
            
            <!-- Credenciales y Rol -->
            <div class="login-card" id="tutorial-credentials-card">
              <h3 class="section-title">{{ t.credentialsAndRoleTitle }}</h3>
              <div class="form-grid">
                <div class="input-group">
                  <label for="rol">{{ t.systemRoleLabel }}</label>
                  <input id="rol" type="text" v-model="form.rol" disabled class="input-disabled" />
                </div>
                <div class="input-group">
                  <label for="email">{{ t.emailLabel }}</label>
                  <input id="email" type="email" v-model="form.email" required />
                </div>
              </div>
            </div>

            <!-- Datos Personales y Antropometría -->
            <div class="login-card" id="tutorial-personal-data-card">
              <h3 class="section-title">{{ t.personalDataTitle }}</h3>
              <div class="form-grid">
                <div class="input-group">
                  <label for="nombres">{{ t.namesLabel }}</label>
                  <input id="nombres" type="text" v-model="form.nombres" disabled class="input-disabled" />
                </div>
                <div class="input-group">
                  <label for="apellidoP">{{ t.paternalLastNameLabel }}</label>
                  <input id="apellidoP" type="text" v-model="form.apellidoP" disabled class="input-disabled" />
                </div>
                <div class="input-group">
                  <label for="apellidoM">{{ t.maternalLastNameLabel }}</label>
                  <input id="apellidoM" type="text" v-model="form.apellidoM" disabled class="input-disabled" />
                </div>
                <div class="input-group">
                  <label for="fechaNacimiento">{{ t.birthDateLabel }}</label>
                  <input id="fechaNacimiento" type="date" v-model="form.fechaNacimiento" disabled class="input-disabled" />
                </div>
                <div class="input-group">
                  <label for="celular">{{ t.cellphoneEditableLabel }}</label>
                  <input id="celular" type="tel" v-model="form.celular" required />
                </div>
                <div class="input-group">
                  <label for="direccion">{{ t.addressLabel }}</label>
                  <input id="direccion" type="text" v-model="form.direccion" placeholder="Ej. Av. Las Palmas #420" />
                </div>
                <div class="input-group">
                  <label for="ciudad">{{ t.cityLabel }}</label>
                  <input id="ciudad" type="text" v-model="form.ciudad" placeholder="Ej. Ciudad Valles" />
                </div>
                <div class="input-group">
                  <label for="estado">{{ t.stateLabel }}</label>
                  <input id="estado" type="text" v-model="form.estado" placeholder="Ej. San Luis Potosí" />
                </div>
                <div class="input-group">
                  <label for="codigoPostal">{{ t.postalCodeLabel }}</label>
                  <input id="codigoPostal" type="text" v-model="form.codigoPostal" placeholder="Ej. 79000" />
                </div>
                <div class="input-group">
                  <label for="peso">{{ t.weightLabel }}</label>
                  <input id="peso" type="text" v-model="form.peso" placeholder="Ej. 75.5" />
                </div>
                <div class="input-group">
                  <label for="altura">{{ t.alturaLabel }}</label>
                  <input id="altura" type="text" v-model="form.altura" placeholder="Ej. 1.78" />
                </div>
                <div class="input-group">
                  <label for="grasaCorporal">{{ t.bodyFatLabel }}</label>
                  <input id="grasaCorporal" type="text" v-model="form.grasaCorporal" placeholder="Ej. 14.5" />
                </div>
                <div class="input-group">
                  <label for="masaMuscular">{{ t.muscleMassLabel }}</label>
                  <input id="masaMuscular" type="text" v-model="form.masaMuscular" placeholder="Ej. 38.2" />
                </div>
                <div class="input-group">
                  <label for="pecho">{{ t.chestLabel }}</label>
                  <input id="pecho" type="text" v-model="form.pecho" placeholder="Ej. 102" />
                </div>
                <div class="input-group">
                  <label for="cintura">{{ t.waistLabel }}</label>
                  <input id="cintura" type="text" v-model="form.cintura" placeholder="Ej. 81" />
                </div>
                <div class="input-group">
                  <label for="brazos">{{ t.armsLabel }}</label>
                  <input id="brazos" type="text" v-model="form.brazos" placeholder="Ej. 37" />
                </div>
              </div>
            </div>

            <!-- Membresía del Gimnasio -->
            <div class="login-card" id="tutorial-gym-membership-card">
              <h3 class="section-title">{{ t.gymMembershipTitle }}</h3>
              <div class="form-grid">
                <div class="input-group">
                  <label for="tipoMembresia">{{ t.gymMembershipTypeLabel }}</label>
                  <input id="tipoMembresia" type="text" v-model="form.tipoMembresia" disabled class="input-disabled" />
                </div>
                <div class="input-group">
                  <label for="fechaInscripcion">{{ t.enrollmentDateLabel }}</label>
                  <input id="fechaInscripcion" type="date" v-model="form.fechaInscripcion" disabled class="input-disabled" />
                </div>
                <div class="input-group">
                  <label for="fechaCorte">{{ t.cutoffDateLabel }}</label>
                  <input id="fechaCorte" type="date" v-model="form.fechaCorte" disabled class="input-disabled" />
                </div>
                <div class="input-group">
                  <label for="montoPagado">{{ t.amountPaidLabel }}</label>
                  <input id="montoPagado" type="text" v-model="form.montoPagado" disabled class="input-disabled" />
                </div>
              </div>
            </div>

            <!-- Suscripción Web y Plan -->
            <div class="login-card" id="tutorial-web-subscription-card">
              <h3 class="section-title">{{ t.webSubscriptionTitle }}</h3>
              <div class="web-plan-container">
                <div class="input-group flex-grow">
                  <label>{{ t.currentWebPlanLabel }}</label>
                  <div class="plan-display-row">
                    <input id="membresiaActual" type="text" v-model="form.webPlan" disabled class="input-disabled" />
                    <button type="button" class="btn-icon-action" @click="handleUpdateMembership" title="Actualizar / Sincronizar Plan Web" id="tutorial-sync-plan-btn">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
              <div class="mt-3" id="tutorial-cancel-sub-wrapper">
                <button type="button" class="btn-text-danger" @click="handleCancelSubscription">
                  {{ t.cancelSubscriptionBtn }}
                </button>
              </div>
            </div>

            <!-- Seguridad y Contraseña -->
            <div class="login-card" id="tutorial-security-card">
              <h3 class="section-title">{{ t.securityAndPasswordTitle }}</h3>
              <div class="form-grid">
                <div class="input-group">
                  <label for="password">{{ t.newPasswordLabel }}</label>
                  <div class="input-wrapper">
                    <input id="password" :type="showPassword ? 'text' : 'password'" v-model="form.password" :placeholder="t.optionalPlaceholder" />
                    <button type="button" class="toggle-password-btn" @click="showPassword = !showPassword">
                      <svg v-if="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </button>
                  </div>
                </div>
                <div class="input-group">
                  <label for="confirmPassword">{{ t.confirmPasswordLabel }}</label>
                  <input id="confirmPassword" type="password" v-model="form.confirmPassword" :placeholder="t.confirmPasswordPlaceholder" />
                </div>
              </div>
            </div>

            <button type="submit" class="btn-primary" id="tutorial-save-btn">{{ t.saveChangesBtn }}</button>
          </form>
        </div>
      </div>
      
      <!-- Modal Personalizado de Confirmación de Baja -->
      <div v-if="showCancelModal" class="modal-overlay" @click.self="showCancelModal = false" id="tutorial-cancel-modal">
        <div class="modal-container modal-small animate-modal">
          <div class="modal-header">
            <h3>{{ t.modalCancelTitle }}</h3>
            <button class="close-btn" @click="showCancelModal = false">&times;</button>
          </div>
          <div class="modal-body text-center">
            <div class="warning-icon-wrapper">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <p class="modal-text" style="white-space: pre-line;">{{ t.modalCancelText }}</p>
            <div class="modal-actions">
              <button type="button" class="btn-secondary-modal" @click="showCancelModal = false">{{ t.btnKeepPlan }}</button>
              <button type="button" class="btn-danger-modal" @click="confirmCancelSubscription">{{ t.btnConfirmCancel }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para Cambio Obligatorio de Contraseña al Modificar Correo -->
      <div v-if="showEmailModal" class="modal-overlay" @click.self="showEmailModal = false" id="tutorial-email-modal">
        <div class="modal-container modal-small animate-modal">
          <div class="modal-header">
            <h3>{{ t.credentialsUpdateModalTitle }}</h3>
            <button class="close-btn" @click="showEmailModal = false">&times;</button>
          </div>
          <div class="modal-body text-center">
            <div class="warning-icon-wrapper">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <p class="modal-text">
              {{ t.emailChangeWarningText }}
            </p>
            <div class="input-group mb-3 text-left" style="text-align: left;">
              <label>{{ t.newAccessPasswordLabel }}</label>
              <input type="password" v-model="form.password" :placeholder="t.enterNewPasswordPlaceholder" required />
            </div>
            <div class="input-group mb-4 text-left" style="text-align: left;">
              <label>{{ t.confirmPasswordLabel }}</label>
              <input type="password" v-model="form.confirmPassword" :placeholder="t.confirmNewPasswordPlaceholder" required />
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-secondary-modal" @click="showEmailModal = false">{{ t.cancelBtn }}</button>
              <button type="button" class="btn-primary-modal" @click="confirmEmailAndPasswordChange">{{ t.confirmChangeBtn }}</button>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <transition name="pop">
        <div v-if="showPaymentModal" class="modal-wrapper" @click.self="showPaymentModal = false">
          <MembershipModal @close="showPaymentModal = false" @success="handlePaymentSuccess" />
        </div>
      </transition>
  </HeadingAtleta>
</template>

<style scoped>
/* ==========================================
   ESTILOS GENERALES Y DEL PERFIL DE ATLETA
   ========================================== */
.main-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 24px;
  box-sizing: border-box;
}

.profile-card {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 32px;
  align-items: start;
}

@media (max-width: 1024px) {
  .profile-card {
    grid-template-columns: 1fr;
  }
}

.modal-wrapper {
  position: fixed;
  inset: 0;
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
}

.pop-enter-active, 
.pop-leave-active { 
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); 
}

.pop-enter-from, 
.pop-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.profile-section {
  background: var(--bg-cards, #161616);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.08));
  border-radius: 20px;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: sticky;
  top: 24px;
  transition: transform 0.1s ease-out;
}

.main-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.5px;
  margin-bottom: 24px;
}

.avatar-wrapper {
  position: relative;
  width: 110px;
  height: 110px;
  cursor: pointer;
  margin-bottom: 16px;
}

.avatar-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.3s ease;
}

.avatar-wrapper:hover .avatar-circle {
  border-color: #2563eb;
  background: rgba(37, 99, 235, 0.05);
}

.avatar-circle svg {
  width: 48px;
  height: 48px;
  fill: rgba(255, 255, 255, 0.4);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-action.btn-camera {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #2563eb;
  border: 2px solid var(--bg-cards, #161616);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.avatar-action.btn-camera:hover {
  transform: scale(1.1);
}

.avatar-action.btn-camera svg {
  width: 14px;
  height: 14px;
}

.gym-name-display {
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
}

.status-badge-container {
  margin-bottom: 16px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-pill.activo {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.status-pill.pendiente {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.status-pill.suspendido {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.profile-hint {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.4;
  margin: 0;
}

.forms-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.login-card {
  background: var(--bg-cards, #161616);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.08));
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
}

.input-group input,
.input-group select {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 16px;
  color: #ffffff;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}

.input-group input:focus,
.input-group select:focus {
  outline: none;
  border-color: #2563eb;
  background: rgba(37, 99, 235, 0.04);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.input-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: rgba(255, 255, 255, 0.02) !important;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  padding-right: 48px;
}

.toggle-password-btn {
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.toggle-password-btn:hover {
  color: #ffffff;
}

.web-plan-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.flex-grow {
  flex-grow: 1;
}

.plan-display-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn-icon-action {
  background: rgba(37, 99, 235, 0.1);
  border: 1px solid rgba(37, 99, 235, 0.2);
  color: #3b82f6;
  border-radius: 12px;
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.btn-icon-action:hover {
  background: #2563eb;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-text-danger {
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease;
}

.btn-text-danger:hover {
  color: #dc2626;
  text-decoration: underline;
}

.btn-primary {
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 14px 28px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
}

.btn-primary:hover {
  background: #1d4ed8;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
  transform: translateY(-1px);
}

/* ==========================================
   ESTILOS DE MODALES (CORREGIDOS PARA MÓVILES)
   ========================================== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999; /* Súper alto para evitar interferencia del profile-section sticky */
  padding: 16px;
  box-sizing: border-box;
  overflow-y: auto;
}

.modal-container {
  background: var(--bg-cards, #161616);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.12));
  border-radius: 20px;
  width: 100%;
  max-width: 520px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
  animation: modalAppear 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-small {
  max-width: 420px !important;
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: translateY(15px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: var(--bg-cards, #161616);
  flex-shrink: 0;
  z-index: 2;
}

.modal-header h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.4rem;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
}

.warning-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2px auto;
  flex-shrink: 0;
}

.modal-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0 auto;
  text-align: center;
  max-width: 340px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 4px;
  justify-content: center;
  width: 100%;
}

.btn-secondary-modal,
.btn-danger-modal,
.btn-primary-modal {
  flex: 1;
  padding: 12px 16px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  text-align: center;
}

.btn-secondary-modal {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.btn-secondary-modal:hover {
  background: rgba(255, 255, 255, 0.15);
}

.btn-danger-modal {
  background: #ef4444;
  color: #ffffff;
}

.btn-danger-modal:hover {
  background: #dc2626;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.btn-primary-modal {
  background: #2563eb;
  color: #ffffff;
}

.btn-primary-modal:hover {
  background: #1d4ed8;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

/* ==========================================
   ESTILOS TOAST DE NOTIFICACIÓN
   ========================================== */
.floating-toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 3000;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 14px;
  color: #ffffff;
  font-weight: 500;
  font-size: 0.95rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

.floating-toast.success {
  background: rgba(16, 185, 129, 0.9);
  border: 1px solid rgba(16, 185, 129, 0.4);
}

.floating-toast.warning {
  background: rgba(245, 158, 11, 0.9);
  border: 1px solid rgba(245, 158, 11, 0.4);
}

.floating-toast.info {
  background: rgba(37, 99, 235, 0.9);
  border: 1px solid rgba(37, 99, 235, 0.4);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* ==========================================
   AJUSTES PARA MÓVILES Y RESPONSIVE
   ========================================== */
@media (max-width: 768px) {
  .main-content {
    padding: 12px;
  }

  .profile-section {
    position: static;
    padding: 20px 14px;
  }

  .login-card {
    padding: 20px 16px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  /* Modales impecables en dispositivos móviles */
  .modal-overlay {
    padding: 10px;
    align-items: center;
  }

  .modal-container {
    max-height: 90vh;
    border-radius: 16px;
    margin: auto;
  }

  .modal-body {
    padding: 16px;
  }

  .modal-actions {
    flex-direction: column-reverse;
    gap: 10px;
  }

  .btn-secondary-modal,
  .btn-danger-modal,
  .btn-primary-modal {
    width: 100%;
    flex: none;
    padding: 13px;
  }
}
</style>