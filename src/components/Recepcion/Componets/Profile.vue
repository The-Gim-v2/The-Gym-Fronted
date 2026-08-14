<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import HeadingRecepcion from '../HeadingRecepcion.vue';

// --- MAPA DE SOLO LECTURA (Leaflet + OpenStreetMap) ---
// La recepción puede VER dónde está el gimnasio, pero no moverlo ni
// editarlo: solo el propietario tiene esa función (ver Profile-Owner.vue).
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

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
    locationTitle: "Ubicación del Gimnasio",
    locationHintText: "Esta es la ubicación registrada del gimnasio. Solo el propietario puede modificarla.",
    labelState: "Estado",
    labelMunicipality: "Municipio",
    labelNeighborhood: "Colonia",
    labelStreetAddress: "Calle y Número",
    readOnlyBadge: "Solo lectura",
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
    locationTitle: "Gym Location",
    locationHintText: "This is the gym's registered location. Only the owner can change it.",
    labelState: "State",
    labelMunicipality: "Municipality",
    labelNeighborhood: "Neighborhood",
    labelStreetAddress: "Street & Number",
    readOnlyBadge: "Read only",
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

// Ubicación del gimnasio: llega de solo lectura, la administra el propietario.
const ubicacion = reactive({
  nombreGimnasio: 'Iron Fitness Center',
  entidad: 'San Luis Potosí',
  municipio: 'Ciudad Valles',
  colonia: 'Zona Centro',
  calle: 'Av. Universitaria',
  numExt: '420',
  latitud: '21.9903',
  longitud: '-99.0152'
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

/* =========================================================
   MAPA DE SOLO LECTURA
   Muestra la ubicación del gimnasio sin permitir arrastrar el
   marcador, hacer zoom con la rueda ni desplazar el mapa: es
   informativo, no un editor.
   ========================================================= */
const mapContainer = ref<HTMLElement | null>(null);
let mapInstance: L.Map | null = null;
let marker: L.Marker | null = null;
let resizeObserver: ResizeObserver | null = null;
const mapCargando = ref(true);

function handleWindowResizeMap() {
  mapInstance?.invalidateSize();
}

function initMap() {
  if (!mapContainer.value) return;

  const lat = parseFloat(ubicacion.latitud) || 21.9903;
  const lng = parseFloat(ubicacion.longitud) || -99.0152;

  mapInstance = L.map(mapContainer.value, {
    center: [lat, lng],
    zoom: 16,
    zoomControl: false,
    attributionControl: true,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    touchZoom: false,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(mapInstance);

  marker = L.marker([lat, lng]).addTo(mapInstance);
  marker
    .bindPopup(`<strong>${ubicacion.nombreGimnasio}</strong><br>${ubicacion.calle} #${ubicacion.numExt}, ${ubicacion.colonia}`)
    .openPopup();

  // Igual que en el mapa editable del propietario: esperamos a que el
  // layout esté asentado antes de medir el contenedor, y observamos su
  // tamaño por si el layout cambia después (breakpoints, sidebar, etc.).
  const finalizarCarga = () => {
    mapInstance?.invalidateSize();
    mapCargando.value = false;
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setTimeout(finalizarCarga, 250);
    });
  });

  if ('ResizeObserver' in window && mapContainer.value) {
    resizeObserver = new ResizeObserver(() => {
      mapInstance?.invalidateSize();
    });
    resizeObserver.observe(mapContainer.value);
  }

  window.addEventListener('resize', handleWindowResizeMap);
}

onMounted(() => {
  window.addEventListener('idioma-changed', handleLangChange as EventListener);
  window.addEventListener('scroll', handleScroll, { passive: true });
  initMap();
});

onUnmounted(() => {
  window.removeEventListener('idioma-changed', handleLangChange as EventListener);
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleWindowResizeMap);
  resizeObserver?.disconnect();
  resizeObserver = null;
  mapInstance?.remove();
  mapInstance = null;
});
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

          <h2 class="gym-name-display">{{ form.nombres }} {{ form.apellidoP }}</h2>
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

            <!-- UBICACIÓN DEL GIMNASIO (solo lectura) -->
            <div class="login-card">
              <h3 class="section-title">{{ t('locationTitle') }}</h3>
              <p class="map-instructions">{{ t('locationHintText') }}</p>

              <div class="form-grid mt-3">
                <div class="input-group">
                  <label>{{ t('labelState') }}</label>
                  <input type="text" :value="ubicacion.entidad" disabled class="input-disabled" />
                </div>
                <div class="input-group">
                  <label>{{ t('labelMunicipality') }}</label>
                  <input type="text" :value="ubicacion.municipio" disabled class="input-disabled" />
                </div>
                <div class="input-group">
                  <label>{{ t('labelNeighborhood') }}</label>
                  <input type="text" :value="ubicacion.colonia" disabled class="input-disabled" />
                </div>
                <div class="input-group">
                  <label>{{ t('labelStreetAddress') }}</label>
                  <input type="text" :value="`${ubicacion.calle} #${ubicacion.numExt}`" disabled class="input-disabled" />
                </div>
              </div>

              <div class="map-container-box mt-4 map-readonly">
                <div class="map-readonly-badge">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  {{ t('readOnlyBadge') }}
                </div>

                <div ref="mapContainer" class="real-map-canvas"></div>

                <div v-if="mapCargando" class="map-loading-overlay">
                  <span class="map-spinner big"></span>
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
            <div class="input-group mb-3 text-left">
              <label>{{ t('newAccessPasswordLabel') }}</label>
              <input type="password" v-model="form.password" :placeholder="t('enterNewPasswordPlaceholder')" required />
            </div>
            <div class="input-group mb-4 text-left">
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
.floating-toast.success { background: rgba(16, 185, 129, 0.9); color: #fff; border: 1px solid rgba(52, 211, 153, 0.4); }
.floating-toast.warning { background: rgba(245, 158, 11, 0.9); color: #fff; border: 1px solid rgba(251, 191, 36, 0.4); }
.floating-toast.info { background: rgba(59, 130, 246, 0.9); color: #fff; border: 1px solid rgba(96, 165, 250, 0.4); }

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
  overflow: hidden;
}

/* Misma franja de acento que en el perfil del propietario, para que
   ambos paneles compartan identidad visual. */
.profile-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-botones, #1c4fd6), #60a5fa, var(--color-botones, #1c4fd6));
}

.main-title {
  font-family: 'Anton', sans-serif;
  font-size: 2.2rem;
  color: var(--color-titulos, #fff);
  margin: 0 0 24px 0;
  line-height: 1.1;
  text-transform: uppercase;
}

.avatar-wrapper { position: relative; cursor: pointer; margin-bottom: 16px; }
.avatar-circle {
  width: 110px; height: 110px; border-radius: 50%;
  background: rgba(255, 255, 255, 0.06); border: 2px dashed rgba(255, 255, 255, 0.15);
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1), 0 8px 24px rgba(0, 0, 0, 0.35);
}
.avatar-wrapper:hover .avatar-circle {
  border-color: #2563eb;
  background: rgba(37, 99, 235, 0.05);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.22), 0 8px 24px rgba(0, 0, 0, 0.4);
}
.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.avatar-circle svg { width: 50px; height: 50px; opacity: 0.6; }
.avatar-action {
  position: absolute; bottom: 0; right: 0; background: var(--color-botones, #3b82f6);
  border: 2px solid var(--bg-cards, #121212);
  width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff;
  transition: transform 0.15s ease, background 0.2s ease;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}
.avatar-wrapper:hover .avatar-action { transform: scale(1.08); }
.avatar-action svg { width: 16px; height: 16px; }

.gym-name-display {
  font-family: 'Anton', sans-serif;
  font-size: 1.3rem;
  color: var(--color-titulos, #fff);
  margin: 4px 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.profile-hint {
  font-family: 'Inter', sans-serif;
  color: var(--color-highlight, #94a3b8);
  font-size: 0.85rem;
  line-height: 1.4;
  margin-top: 6px;
}

.forms-wrapper { display: flex; flex-direction: column; gap: 28px; width: 100%; min-width: 0; }

.login-card {
  background: var(--bg-cards, rgba(18, 18, 18, 0.75));
  backdrop-filter: blur(12px);
  padding: 36px;
  border-radius: var(--app-border-radius, 24px);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.12));
  box-sizing: border-box;
  width: 100%;
  margin-top: 1.5%;
  min-width: 0;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.login-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
}

.section-title {
  font-family: 'Anton', sans-serif;
  color: var(--color-titulos, #fff);
  font-size: 1.6rem;
  margin: 0 0 24px 0;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 12px;
}
.section-title::before {
  content: '';
  width: 4px;
  height: 22px;
  border-radius: 4px;
  flex-shrink: 0;
  background: linear-gradient(180deg, var(--color-botones, #1c4fd6), rgba(37, 99, 235, 0.25));
}

.map-instructions {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #94a3b8;
  margin: 6px 0 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.span-2 { grid-column: span 2; }
.mt-3 { margin-top: 24px; }
.mt-4 { margin-top: 24px; }
.mb-3 { margin-bottom: 16px; }
.mb-4 { margin-bottom: 24px; }
.text-left { text-align: left; }

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
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
  border-radius: 12px;
  color: var(--color-texto-input, var(--color-texto-general, #fff));
  padding: 12px 14px;
  width: 100%;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s, color 0.2s;
  min-width: 0;
}

input:focus {
  border-color: var(--color-highlight, #3b82f6);
  outline: none;
  background: var(--bg-input-focus, var(--bg-cards, #141414));
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.input-disabled {
  background: rgba(255, 255, 255, 0.03) !important;
  color: #94a3b8 !important;
  border-color: rgba(255, 255, 255, 0.06) !important;
  cursor: not-allowed !important;
}

.input-wrapper { position: relative; width: 100%; min-width: 0; }
.toggle-password-btn {
  position: absolute; right: 0; top: 0; height: 100%; width: 44px;
  background: transparent; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: rgba(245, 245, 244, 0.4);
}

/* ==========================================
   MAPA DE SOLO LECTURA (Ubicación del gimnasio)
   ========================================== */
.map-container-box {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  background: #0a0d14;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}

.real-map-canvas {
  width: 100%;
  height: 320px;
  background: #0a0d14;
}

.map-readonly .real-map-canvas {
  /* El mapa no responde a arrastre/zoom (ver initMap): el cursor por
     defecto evita sugerir que se puede interactuar con él. */
  cursor: default;
}

.map-readonly-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1500;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(18, 18, 18, 0.92);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 6px 12px;
  font-family: 'Oswald', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: #94a3b8;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
}
.map-readonly-badge svg { flex-shrink: 0; color: #60a5fa; }

.map-loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(10, 13, 20, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.map-spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-top-color: #fff;
  border-radius: 50%;
  display: inline-block;
  animation: girarSpinner 0.7s linear infinite;
}
.map-spinner.big { width: 38px; height: 38px; border-width: 3px; }

@keyframes girarSpinner {
  to { transform: rotate(360deg); }
}

/* Tema oscuro para los elementos propios de Leaflet, igual que en el
   mapa editable del propietario. */
:deep(.leaflet-popup-content-wrapper) {
  background: #181b22;
  color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}
:deep(.leaflet-popup-content) { font-family: 'Inter', sans-serif; font-size: 0.82rem; margin: 10px 12px; }
:deep(.leaflet-popup-tip) { background: #181b22; }
:deep(.leaflet-control-attribution) {
  background: rgba(10, 13, 20, 0.75) !important;
  color: #94a3b8 !important;
  font-size: 0.62rem !important;
}
:deep(.leaflet-control-attribution a) { color: #60a5fa !important; }

.btn-primary {
  width: 100%;
  padding: 16px;
  background: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, #ffffff);
  border: none;
  border-radius: 14px;
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 1px;
  cursor: pointer;
  text-transform: uppercase;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 4px 14px rgba(28, 79, 214, 0.35);
  margin-top: 15px;
}
.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.35);
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
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
  animation: modalAppear 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-small { max-width: 420px !important; }

@keyframes modalAppear {
  from { opacity: 0; transform: translateY(15px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-line, rgba(255, 255, 255, 0.08));
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.modal-header h3 {
  font-family: 'Anton', sans-serif;
  color: var(--color-titulos, #fff);
  font-size: 1.1rem;
  margin: 0;
  letter-spacing: 0.5px;
  text-transform: uppercase;
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
.close-btn:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }

.modal-body {
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
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
  margin: 0 auto 2px auto;
  border: 1px solid rgba(59, 130, 246, 0.3);
  flex-shrink: 0;
}

.modal-text {
  font-family: 'Inter', sans-serif;
  color: #cbd5e1;
  font-size: 0.9rem;
  line-height: 1.5;
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
  font-family: 'Oswald', sans-serif;
  text-transform: uppercase;
}

.btn-secondary-modal {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.btn-secondary-modal:hover { background: rgba(255, 255, 255, 0.15); }

.btn-primary-modal {
  background: #2563eb;
  color: #fff;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}
.btn-primary-modal:hover {
  background: #1d4ed8;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

/* RESPONSIVE DESIGN */
@media (max-width: 1024px) {
  .profile-card { grid-template-columns: 1fr; gap: 20px; }
  .profile-section { position: relative; top: 0; transform: none !important; width: 100%; padding: 24px 16px; }
  .login-card { padding: 20px 16px; }
  .main-content { padding: 16px 10px; }
}

@media (max-width: 768px) {
  .form-grid { grid-template-columns: 1fr; gap: 16px; }
  .span-2 { grid-column: span 1; }
  .real-map-canvas { height: 240px; }
  .map-readonly-badge { font-size: 0.68rem; padding: 5px 10px; }
  .modal-actions { flex-direction: column; }
}
</style>