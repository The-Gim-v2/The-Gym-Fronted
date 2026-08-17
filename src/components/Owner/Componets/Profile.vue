<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import HeadingOwner from '../HeadingOwner.vue';
import RegisterGymModal from '../../Record/Record-Gym.vue';
import AIChatModal from '../../Record/Record-Staff.vue';
import MembershipModal from '../../Modals/MembershipModal.vue';
import { traducciones } from '../i18n.js';

// --- MAPA REAL (Leaflet + OpenStreetMap) ---
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Arregla el problema conocido de Leaflet con bundlers (Vite/Webpack) donde
// no encuentra los íconos por defecto del marcador.
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const currentLang = ref(localStorage.getItem('owner-idioma') || 'es');
const router = useRouter();
const originalEmail = ref('contacto@ironfitness.com');

const t = (key: string) => {
  const dict = traducciones as Record<string, Record<string, string>>;
  const langTable = dict[currentLang.value] || dict['es'] || {};
  const fallbackTable = dict['es'] || {};
  return langTable[key] || fallbackTable[key] || key;
};

const handleLangChange = (e: Event) => {
  const customEvent = e as CustomEvent<{ idioma?: string }>;
  if (customEvent.detail && customEvent.detail.idioma) {
    currentLang.value = customEvent.detail.idioma;
  }
};

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

const allDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const fileInput = ref<HTMLInputElement | null>(null);
const previewImage = ref<string | null>(null);

const coverFileInput = ref<HTMLInputElement | null>(null);
const previewCoverImage = ref<string | null>(null);

const showPassword = ref(false);

const showAddSedeModal = ref(false);
const showAIModal = ref(false);
const showPaymentModal = ref(false);
const showCancelModal = ref(false);
const showEmailModal = ref(false);

const emailChangePassword = ref('');
const emailChangeConfirmPassword = ref('');
const initialEmail = ref('contacto@ironfitness.com');

const notification = reactive({
  show: false,
  message: '',
  type: 'success' as 'success' | 'warning' | 'info'
});

const handleSaveChanges = () => {
  if (form.email !== originalEmail.value) {
    showEmailModal.value = true;
  } else {
    showNotification(t('Guardado Correctamente'), 'success');
  }
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
  nombreGimnasio: 'Iron Fitness Center',
  curp: 'IFC220101HSLPR01',
  nombres: 'Juan Carlos',
  apellidoP: 'Pérez',
  apellidoM: 'Gómez',
  fechaNac: '1985-06-15',
  celular: '4811234567',
  entidad: 'San Luis Potosí',
  municipio: 'Ciudad Valles',
  cp: '79000',
  status: 'activo',

  colonia: 'Zona Centro',
  calle: 'Av. Universitaria',
  otrasCalles: '',
  numExt: '420',
  numInt: '',
  selectedDays: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  precioMes: '450',
  precioSem: '150',
  email: 'contacto@ironfitness.com',
  password: '',
  confirmPassword: '',
  membresiaActual: 'Plan Pro - Sede Principal (Activa)',
  tipoMembresia: 'pro',
  descripcionGimnasio: 'Instalaciones de clase mundial con tecnología de seguimiento biomecánico y áreas especializadas para entrenamiento de alto rendimiento.',
  nuevaAmenidadTexto: '',
  amenidades: [
    { id: 1, nombre: 'Estacionamiento Gratuito' },
    { id: 2, nombre: 'Regaderas y Lockers' },
    { id: 3, nombre: 'Wi-Fi de Alta Velocidad' },
    { id: 4, nombre: 'Zona de Sauna' },
    { id: 5, nombre: 'Bebidas Energéticas' }
  ],
  horariosCompletos: {
    'Lun': { abierto: '06:00', cerrado: '23:00', activo: true },
    'Mar': { abierto: '06:00', cerrado: '23:00', activo: true },
    'Mié': { abierto: '06:00', cerrado: '23:00', activo: true },
    'Jue': { abierto: '06:00', cerrado: '23:00', activo: true },
    'Vie': { abierto: '06:00', cerrado: '23:00', activo: true },
    'Sáb': { abierto: '07:00', cerrado: '20:00', activo: true },
    'Dom': { abierto: '08:00', cerrado: '16:00', activo: true }
  },
  latitud: '21.9903',
  longitud: '-99.0152',
  mapZoomLevel: 15
});

const isProMember = computed(() => {
  return form.tipoMembresia.toLowerCase() === 'pro';
});

const toggleDay = (day: string) => {
  const index = form.selectedDays.indexOf(day);
  if (index > -1) form.selectedDays.splice(index, 1);
  else form.selectedDays.push(day);
};

const agregarAmenidad = () => {
  if (!form.nuevaAmenidadTexto.trim()) return;
  form.amenidades.push({
    id: Date.now(),
    nombre: form.nuevaAmenidadTexto.trim()
  });
  form.nuevaAmenidadTexto = '';
  showNotification('Amenidad agregada correctamente', 'success');
};

const eliminarAmenidad = (id: number) => {
  form.amenidades = form.amenidades.filter(a => a.id !== id);
  showNotification('Amenidad eliminada', 'info');
};

const triggerFileInput = () => fileInput.value?.click();
const onFileSelected = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    previewImage.value = URL.createObjectURL(file);
    showNotification(t('toastLogoUpdated') || 'Logo actualizado correctamente', 'info');
  }
};


const showNotification = (msg: string, type: 'success' | 'warning' | 'info' = 'success', duration = 4000) => {
  notification.message = msg;
  notification.type = type;
  notification.show = true;
  setTimeout(() => {
    notification.show = false;
  }, duration);
};


const triggerCoverFileInput = () => coverFileInput.value?.click();
const onCoverFileSelected = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    previewCoverImage.value = URL.createObjectURL(file);
    showNotification('Foto de portada actualizada correctamente', 'info');
  }
};



const confirmEmailAndPasswordChange = () => {
  if (!form.password || form.password !== form.confirmPassword) {
    showNotification(t('passwordWarningMsg'), 'warning');
    return;
  }
  // Lógica de guardado...
  showEmailModal.value = false;
  showNotification(t('emailChangedMsg'), 'info', 5000);

  setTimeout(() => {
  localStorage.removeItem('user_role');
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  router.replace({ name: 'login' });
  }, 2000);
};

const handleUpdateMembership = () => {
  showPaymentModal.value = true;
};

const handlePaymentSuccess = (msg: string) => {
  showPaymentModal.value = false;
  showNotification(msg, 'success');
};

const handleCancelSubscription = () => {
  showCancelModal.value = true;
};

const confirmCancelSubscription = () => {
  showCancelModal.value = false;
  showNotification(t('toastCancelRequested') || 'Solicitud de cancelación procesada', 'warning');
};

const handleAddSede = () => {
  if (!isProMember.value) {
    showNotification(t('toastProOnlySede') || 'Función exclusiva para miembros Pro', 'warning');
    return;
  }
  showAddSedeModal.value = true;
};

const handleInteractAI = () => {
  if (!isProMember.value) {
    showNotification(t('toastProOnlyAI') || 'Función exclusiva para miembros Pro', 'warning');
    return;
  }
  showAIModal.value = true;
};

/* =========================================================
   MAPA REAL: Leaflet + OpenStreetMap
   - Clic en el mapa o arrastrar el marcador = fija la ubicación del local
   - Las coordenadas quedan guardadas en form.latitud / form.longitud
     (viajan con el resto del formulario cuando se guarda el registro)
   ========================================================= */
const mapContainer = ref<HTMLElement | null>(null);
let mapInstance: L.Map | null = null;
let marker: L.Marker | null = null;
let resizeObserver: ResizeObserver | null = null;

const mapCargando = ref(true);
const direccionBusqueda = ref('');
const buscandoDireccion = ref(false);

function handleWindowResizeMap() {
  mapInstance?.invalidateSize();
}

function initMap() {
  if (!mapContainer.value) return;

  const lat = parseFloat(form.latitud) || 21.9903;
  const lng = parseFloat(form.longitud) || -99.0152;

  mapInstance = L.map(mapContainer.value, {
    center: [lat, lng],
    zoom: form.mapZoomLevel,
    zoomControl: false,
    attributionControl: true,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(mapInstance);

  marker = L.marker([lat, lng], { draggable: true }).addTo(mapInstance);
  actualizarPopupMarcador();

  marker.on('dragend', () => {
    const pos = marker!.getLatLng();
    guardarCoordenadas(pos.lat, pos.lng);
  });

  mapInstance.on('click', (e: L.LeafletMouseEvent) => {
    marker!.setLatLng(e.latlng);
    guardarCoordenadas(e.latlng.lat, e.latlng.lng);
  });

  mapInstance.on('zoomend', () => {
    form.mapZoomLevel = mapInstance!.getZoom();
  });

  // Leaflet necesita recalcular su tamaño una vez que el contenedor ya
  // tiene sus dimensiones finales (grid sticky, transiciones, fuentes, etc.).
  // Un solo setTimeout corto (como antes) a veces disparaba con el layout
  // todavía sin asentar y el mapa quedaba "encogido" en una esquina.
  // Esperamos dos frames + un timeout, y además observamos el contenedor
  // por si su tamaño cambia después (breakpoints, sidebar, etc.).
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

function guardarCoordenadas(lat: number, lng: number) {
  form.latitud = lat.toFixed(6);
  form.longitud = lng.toFixed(6);
  actualizarPopupMarcador();
  showNotification(t('toastLocationUpdated') || 'Ubicación del local actualizada', 'success');
}

function actualizarPopupMarcador() {
  if (!marker) return;
  marker
    .bindPopup(`<strong>${form.nombreGimnasio}</strong><br>${form.calle} #${form.numExt}, ${form.colonia}`)
    .openPopup();
}

// Si cambian estos campos, el texto del pin del mapa se mantiene al día
watch(
  () => [form.nombreGimnasio, form.calle, form.numExt, form.colonia],
  () => actualizarPopupMarcador()
);

function centrarSedeMapa() {
  if (!mapInstance || !marker) return;
  mapInstance.setView(marker.getLatLng(), Math.max(form.mapZoomLevel, 16));
  marker.openPopup();
}

function zoomInMap() {
  mapInstance?.zoomIn();
}

function zoomOutMap() {
  mapInstance?.zoomOut();
}

// Aplica coordenadas escritas a mano en los campos de Latitud/Longitud
function aplicarCoordenadasManuales() {
  const lat = parseFloat(form.latitud);
  const lng = parseFloat(form.longitud);
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    showNotification(t('toastInvalidCoords') || 'Coordenadas inválidas', 'warning');
    return;
  }
  mapInstance?.setView([lat, lng], form.mapZoomLevel);
  marker?.setLatLng([lat, lng]);
  actualizarPopupMarcador();
}

// Centra el mapa en la ubicación actual del dispositivo (con permiso del usuario)
function usarMiUbicacion() {
  if (!navigator.geolocation) {
    showNotification(t('toastGeoNotSupported') || 'Tu navegador no soporta geolocalización', 'warning');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      mapInstance?.setView([latitude, longitude], 17);
      marker?.setLatLng([latitude, longitude]);
      guardarCoordenadas(latitude, longitude);
    },
    () => {
      showNotification(t('toastGeoDenied') || 'No se pudo obtener tu ubicación', 'warning');
    }
  );
}

// Busca una dirección con el geocodificador gratuito de OpenStreetMap (Nominatim)
async function buscarDireccion() {
  const consulta = direccionBusqueda.value.trim();
  if (!consulta) return;
  buscandoDireccion.value = true;
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(consulta)}`;
    const resp = await fetch(url);
    const resultados = await resp.json();
    if (resultados && resultados.length > 0) {
      const lat = parseFloat(resultados[0].lat);
      const lng = parseFloat(resultados[0].lon);
      mapInstance?.setView([lat, lng], 17);
      marker?.setLatLng([lat, lng]);
      guardarCoordenadas(lat, lng);
    } else {
      showNotification(t('toastAddressNotFound') || 'No se encontró esa dirección', 'warning');
    }
  } catch {
    showNotification(t('toastAddressSearchError') || 'No se pudo buscar la dirección', 'warning');
  } finally {
    buscandoDireccion.value = false;
  }
}
</script>

<template>
  <HeadingOwner>
    <main class="main-content" id="tutor-0">

      <transition name="toast">
        <div v-if="notification.show" class="floating-toast" :class="notification.type" id="tutor-1">
          <svg v-if="notification.type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <svg v-else-if="notification.type === 'warning'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <span>{{ notification.message }}</span>
        </div>
      </transition>

      <div class="profile-card" id="tutor-2">

        <div class="profile-section" :style="{ transform: `translateY(${profileTranslateY}px)` }" id="tutor-3">
          <h1 class="main-title" id="tutor-4" v-html="t('profileMainTitle')"></h1>

          <div class="avatar-wrapper" @click="triggerFileInput" :title="t('avatarUploadTitle')" id="tutor-5">
            <div class="avatar-circle" id="tutor-6">
              <img v-if="previewImage" :src="previewImage" :alt="t('avatarPreviewAlt')" class="avatar-img" />
              <svg v-else viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <button type="button" class="avatar-action btn-camera" :title="t('avatarChangeTitle')" id="tutor-7">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </button>
            <input type="file" ref="fileInput" @change="onFileSelected" accept="image/*" style="display: none" id="tutor-8" />
          </div>

          <h2 class="gym-name-display" id="tutor-9">{{ form.nombreGimnasio }}</h2>

          <div class="status-badge-container" id="tutorial-status-badge">
            <span class="status-pill" :class="form.status">
              <span class="status-dot"></span>
              {{ form.status === 'activo' ? t('statusActive') : form.status === 'pendiente' ? t('statusPending') : t('statusSuspended') }}
            </span>
          </div>
          <p class="profile-hint" id="tutor-10">{{ t('profileHintText') }}</p>
        </div>

        <div class="forms-wrapper" id="tutor-11">
          <form @submit.prevent="handleSaveChanges" id="tutor-12">

            <!-- Datos del Gimnasio y Membresía -->
            <div class="login-card" id="tutor-13">
              <h3 class="section-title" id="tutor-14">{{ t('sectionGymInfo') }}</h3>

              <!-- Subida de Foto de Portada / Banner -->
              <div class="input-group mb-4">
                <label>{{ t('labelCoverPhoto') }}</label>
                <div class="cover-upload-container" @click="triggerCoverFileInput">
                  <img v-if="previewCoverImage" :src="previewCoverImage" :alt="t('coverPreviewAlt')" class="cover-preview-img" />
                  <div v-else class="cover-placeholder-content">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    <span>{{ t('coverPlaceholderText') }}</span>
                  </div>
                  <input type="file" ref="coverFileInput" @change="onCoverFileSelected" accept="image/*" style="display: none" />
                </div>
              </div>

              <div class="form-grid" id="tutor-15">
                <div class="input-group" id="tutor-16">
                  <label for="nombreGimnasio">{{ t('labelGymName') }}</label>
                  <input id="nombreGimnasio" type="text" v-model="form.nombreGimnasio" required />
                </div>
                <div class="input-group" id="tutor-17">
                  <label for="curp">{{ t('labelCurp') }}</label>
                  <input id="curp" type="text" v-model="form.curp" disabled class="input-disabled" :title="t('curpDisabledTitle')" />
                </div>
              </div>

              <div class="form-grid mt-3" id="tutor-18">
                <div class="input-group" id="tutor-19">
                  <label for="membresiaActual">{{ t('labelCurrentMembership') }}</label>
                  <div class="membership-inline-row" id="tutor-20">
                    <input id="membresiaActual" type="text" v-model="form.membresiaActual" disabled class="input-disabled" />
                    <button type="button" class="action-btn" @click="handleUpdateMembership" :title="t('updateMembershipTitle')" id="tutor-21">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
                    </button>
                  </div>
                  <button type="button" class="btn-cancel-subscription" @click="handleCancelSubscription" id="tutor-22">
                    {{ t('btnCancelSubscription') }}
                  </button>
                </div>

                <div class="input-group special-buttons-group" id="tutor-23">
                  <label>&nbsp;</label>
                  <div class="dual-action-buttons" id="tutor-24">
                    <button type="button" class="btn-custom-action btn-sede" :class="{ 'btn-disabled': !isProMember }" @click="handleAddSede" id="tutor-25">
                      {{ t('btnAddBranch') }}
                    </button>
                    <button type="button" class="btn-custom-action btn-ai" :class="{ 'btn-disabled': !isProMember }" @click="handleInteractAI" id="tutor-26">
                      {{ t('btnInteractAI') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- ACERCA DEL GIMNASIO Y AMENIDADES -->
            <div class="login-card" id="tutor-gym-details">
              <h3 class="section-title">{{ t('sectionGymDetailsTitle') }}</h3>
              <div class="form-grid vertical-stack gap-4">
                <div class="input-group">
                  <label for="descripcionGimnasio">{{ t('labelGymDescription') }}</label>
                  <textarea id="descripcionGimnasio" v-model="form.descripcionGimnasio" rows="3" class="textarea-custom" :placeholder="t('placeholderGymDescription')"></textarea>
                </div>

                <div class="input-group mt-2">
                  <label>{{ t('labelAmenitiesServices') }}</label>
                  <div class="add-amenity-row">
                    <input type="text" v-model="form.nuevaAmenidadTexto" :placeholder="t('placeholderNewAmenity')" @keyup.enter="agregarAmenidad" />
                    <button type="button" class="btn-add-amenity" @click="agregarAmenidad">{{ t('btnAddAmenity') }}</button>
                  </div>

                  <div class="amenities-tags-container mt-3">
                    <div v-for="amenidad in form.amenidades" :key="amenidad.id" class="amenity-tag-pill">
                      <input type="text" v-model="amenidad.nombre" class="amenity-tag-input" />
                      <button type="button" class="btn-remove-amenity-tag" @click="eliminarAmenidad(amenidad.id)" :title="t('titleRemoveAmenity')">&times;</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- DATOS DEL ADMINISTRADOR -->
            <div class="login-card" id="tutor-27">
              <h3 class="section-title" id="tutor-28">{{ t('sectionAdminData') }}</h3>
              <div class="form-grid" id="tutor-29">
                <div class="input-group" id="tutor-30">
                  <label for="nombres">{{ t('labelNames') }}</label>
                  <input id="nombres" type="text" v-model="form.nombres" required />
                </div>
                <div class="input-group" id="tutor-31">
                  <label for="apellidoP">{{ t('labelLastNameP') }}</label>
                  <input id="apellidoP" type="text" v-model="form.apellidoP" required />
                </div>
                <div class="input-group" id="tutor-32">
                  <label for="apellidoM">{{ t('labelLastNameM') }}</label>
                  <input id="apellidoM" type="text" v-model="form.apellidoM" required />
                </div>
                <div class="input-group" id="tutor-33">
                  <label for="fechaNac">{{ t('labelBirthDate') }}</label>
                  <input id="fechaNac" type="date" v-model="form.fechaNac" required />
                </div>
                <div class="input-group" id="tutor-34">
                  <label for="celular">{{ t('labelPhone') }}</label>
                  <input id="celular" type="tel" v-model="form.celular" required />
                </div>
                <div class="input-group" id="tutor-35">
                  <label for="email">{{ t('labelEmailModifiable') }}</label>
                  <input id="email" type="email" v-model="form.email" required placeholder="correo@ejemplo.com" />
                </div>
                <div class="input-group" id="tutor-36">
                  <label for="password">{{ t('labelNewPassword') }}</label>
                  <div class="input-wrapper" id="tutor-37">
                    <input id="password" :type="showPassword ? 'text' : 'password'" v-model="form.password" :placeholder="t('passwordPlaceholder')" />
                    <button type="button" class="toggle-password-btn" @click="showPassword = !showPassword" id="tutor-38">
                      <svg v-if="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </button>
                  </div>
                </div>
                <div class="input-group" id="tutor-39">
                  <label for="confirmPassword">{{ t('labelConfirmPassword') }}</label>
                  <input id="confirmPassword" type="password" v-model="form.confirmPassword" :placeholder="t('confirmPasswordPlaceholder')" />
                </div>
              </div>
            </div>

            <!-- UBICACIÓN DEL ESTABLECIMIENTO -->
            <div class="login-card" id="tutor-40">
              <div class="map-card-header-bar">
                <h3 class="section-title mb-0" id="tutor-41">{{ t('sectionGeographicLocation') }}</h3>
              </div>
              <p class="map-instructions">
                {{ t('mapInstructions') || 'Haz clic en el mapa o arrastra el marcador para fijar la ubicación exacta de tu local.' }}
              </p>

              <div class="form-grid mt-3" id="tutor-42">
                <div class="input-group" id="tutor-43">
                  <label for="entidad">{{ t('labelState') }}</label>
                  <input id="entidad" type="text" v-model="form.entidad" required />
                </div>
                <div class="input-group" id="tutor-44">
                  <label for="municipio">{{ t('labelMunicipality') }}</label>
                  <input id="municipio" type="text" v-model="form.municipio" required />
                </div>
                <div class="input-group" id="tutor-45">
                  <label for="colonia">{{ t('labelNeighborhood') }}</label>
                  <input id="colonia" type="text" v-model="form.colonia" required />
                </div>
                <div class="input-group" id="tutor-46">
                  <label for="cp">{{ t('labelZipCode') }}</label>
                  <input id="cp" type="text" v-model="form.cp" required />
                </div>
                <div class="input-group" id="tutor-47">
                  <label for="calle">{{ t('labelStreet') }}</label>
                  <input id="calle" type="text" v-model="form.calle" required />
                </div>
                <div class="input-group">
                  <label for="otrasCalles">Otras Calles</label>
                  <input id="otrasCalles" type="text" v-model="form.otrasCalles" placeholder="Entre qué calles se encuentra" />
                </div>
                <div class="input-group" id="tutor-48">
                  <label for="numExt">{{ t('labelExtNumber') }}</label>
                  <input id="numExt" type="text" v-model="form.numExt" required />
                </div>
                <div class="input-group" id="tutor-49">
                  <label for="numInt">{{ t('labelIntNumber') }}</label>
                  <input id="numInt" type="text" v-model="form.numInt" />
                </div>
              </div>

              <!-- Mapa interactivo real (Leaflet / OpenStreetMap) -->
              <div class="map-container-box mt-4">

                <div class="map-search-bar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  <input
                    type="text"
                    v-model="direccionBusqueda"
                    :placeholder="t('mapSearchPlaceholder') || 'Buscar dirección o lugar...'"
                    @keyup.enter="buscarDireccion"
                  />
                  <button type="button" class="btn-search-map" @click="buscarDireccion" :disabled="buscandoDireccion">
                    <span v-if="buscandoDireccion" class="map-spinner"></span>
                    <span v-else>{{ t('btnSearch') || 'Buscar' }}</span>
                  </button>
                </div>

                <div class="map-controls-top-right">
                  <button type="button" class="btn-map-tool" @click="usarMiUbicacion" :title="t('btnUseMyLocation') || 'Usar mi ubicación'">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"></circle><path d="M12 2v3M12 19v3M2 12h3M19 12h3"></path></svg>
                  </button>
                  <button type="button" class="btn-center-sede" @click="centrarSedeMapa">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"></circle><circle cx="12" cy="12" r="9"></circle></svg>
                    {{ t('btnCenterBranch') }}
                  </button>
                </div>

                <div ref="mapContainer" class="real-map-canvas"></div>

                <div v-if="mapCargando" class="map-loading-overlay">
                  <span class="map-spinner big"></span>
                </div>

                <div class="map-zoom-controls-v3">
                  <button type="button" class="zoom-btn-v3" @click="zoomInMap">+</button>
                  <div class="zoom-divider"></div>
                  <button type="button" class="zoom-btn-v3" @click="zoomOutMap">-</button>
                </div>

                <div class="map-coords-bar">
                  <div class="coord-field">
                    <label>{{ t('labelLat') || 'Latitud' }}</label>
                    <input type="text" v-model="form.latitud" @change="aplicarCoordenadasManuales" />
                  </div>
                  <div class="coord-field">
                    <label>{{ t('labelLng') || 'Longitud' }}</label>
                    <input type="text" v-model="form.longitud" @change="aplicarCoordenadasManuales" />
                  </div>
                </div>
              </div>
            </div>

            <!-- CONFIGURACIÓN DE OPERACIÓN -->
            <div class="login-card" id="tutor-50">
              <h3 class="section-title" id="tutor-51">{{ t('sectionOperationConfig') }}</h3>

              <div class="input-group mb-4" id="tutor-52">
                <label>{{ t('labelOpeningDays') }}</label>
                <div class="days-container" id="tutor-53">
                  <button
                    type="button"
                    v-for="(day, index) in allDays"
                    :key="day"
                    class="day-chip"
                    :class="{ active: form.selectedDays.includes(day) }"
                    @click="toggleDay(day)"
                    :id="`tutor-${54 + index}`"
                  >
                    {{ day }}
                  </button>
                </div>
              </div>

              <!-- Horarios distribuidos exactamente en 3 columnas -->
              <div class="operational-schedules-wrapper mb-4" v-if="form.selectedDays.length > 0">
                <label class="mb-2 block-label">{{ t('labelSchedulesPerDay') }}</label>
                <div class="schedules-grid-multi-column">
                  <div v-for="dia in form.selectedDays" :key="dia" class="schedule-card-box-item" :class="{ inactive: !form.horariosCompletos[dia as keyof typeof form.horariosCompletos]?.activo }">
                    <div class="schedule-card-header-row">
                      <span class="schedule-day-pill">{{ dia }}</span>
                      <label class="switch-toggle">
                        <input type="checkbox" v-model="form.horariosCompletos[dia as keyof typeof form.horariosCompletos].activo" />
                        <span class="slider-round"></span>
                      </label>
                    </div>

                    <div class="schedule-times-stack" v-if="form.horariosCompletos[dia as keyof typeof form.horariosCompletos]?.activo">
                      <div class="time-block-compact">
                        <span class="lbl-small">{{ t('labelOpens') }}</span>
                        <div class="time-input-pill">
                          <input type="time" v-model="form.horariosCompletos[dia as keyof typeof form.horariosCompletos].abierto" />
                        </div>
                      </div>
                      <div class="time-block-compact">
                        <span class="lbl-small">{{ t('labelCloses') }}</span>
                        <div class="time-input-pill">
                          <input type="time" v-model="form.horariosCompletos[dia as keyof typeof form.horariosCompletos].cerrado" />
                        </div>
                      </div>
                    </div>

                    <div class="schedule-closed-label" v-else>
                      <span>{{ t('labelClosed') }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-grid mt-3" id="tutor-61">
                <div class="input-group" id="tutor-62">
                  <label for="precioMes">{{ t('labelMonthlyPrice') }}</label>
                  <input id="precioMes" type="number" v-model="form.precioMes" required />
                </div>
                <div class="input-group" id="tutor-63">
                  <label for="precioSem">{{ t('labelWeeklyPrice') }}</label>
                  <input id="precioSem" type="number" v-model="form.precioSem" required />
                </div>
              </div>
            </div>

            <button type="submit" class="btn-primary" id="tutor-64">{{ t('btnSaveDataset') }}</button>
          </form>
        </div>
      </div>

      <!-- Modales -->
      <div v-if="showCancelModal" class="modal-overlay" @click.self="showCancelModal = false" id="tutor-65">
        <div class="modal-container modal-small animate-modal" id="tutor-66">
          <div class="modal-header" id="tutor-67">
            <h3 id="tutor-68">{{ t('modalCancelTitle') }}</h3>
            <button class="close-btn" @click="showCancelModal = false" id="tutor-69">&times;</button>
          </div>
          <div class="modal-body text-center" id="tutor-70">
            <div class="warning-icon-wrapper" id="tutor-71">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <p class="modal-text" id="tutor-72">{{ t('modalCancelText') }}</p>
            <div class="modal-actions" id="tutor-73">
              <button type="button" class="btn-secondary-modal" @click="showCancelModal = false" id="tutor-74">{{ t('btnKeepPlan') }}</button>
              <button type="button" class="btn-danger-modal" @click="confirmCancelSubscription" id="tutor-75">{{ t('btnConfirmCancel') }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para Cambio Obligatorio de Contraseña -->
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

            <!-- Campos de contraseña dentro del modal -->
            <div class="input-group mb-3 text-left">
              <label>{{ t('newAccessPasswordLabel') }}</label>
              <input type="password" v-model="form.password" :placeholder="t('enterNewPasswordPlaceholder')" required />
            </div>
            <div class="input-group mb-4 text-left">
              <label>{{ t('confirmPasswordLabel') }}</label>
              <input type="password" v-model="form.confirmPassword" :placeholder="t('confirmNewPasswordPlaceholder')" required />
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-secondary-modal" @click="showEmailModal = false">{{ t('cancelBtn') }}</button>
              <button type="button" class="btn-primary-modal" @click="confirmEmailAndPasswordChange">{{ t('confirmChangeBtn') }}</button>
            </div>
          </div>
        </div>
      </div>

      <MembershipModal v-if="showPaymentModal" @close="showPaymentModal = false" @success="handlePaymentSuccess" id="tutor-76" />

      <div v-if="showAddSedeModal" class="modal-overlay" @click.self="showAddSedeModal = false" id="tutor-77">
        <div class="modal-container animate-modal" id="tutor-78">
          <div class="modal-header" id="tutor-79">
            <h3 id="tutor-80">{{ t('modalAddSedeTitle') }}</h3>
            <button class="close-btn" @click="showAddSedeModal = false" id="tutor-81">&times;</button>
          </div>
          <div class="modal-body" id="tutor-82">
            <RegisterGymModal @close="showAddSedeModal = false" id="tutor-83" />
          </div>
        </div>
      </div>

      <div v-if="showAIModal" class="modal-overlay" @click.self="showAIModal = false" id="tutor-84">
        <div class="modal-container animate-modal" id="tutor-85">
          <div class="modal-header" id="tutor-86">
            <h3 id="tutor-87">{{ t('modalAITitle') }}</h3>
            <button class="close-btn" @click="showAIModal = false" id="tutor-88">&times;</button>
          </div>
          <div class="modal-body" id="tutor-89">
            <AIChatModal @click="showAIModal = false" id="tutor-90" />
          </div>
        </div>
      </div>

    </main>
  </HeadingOwner>
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
  overflow: hidden;
}

/* Franja de acento en la parte superior de la tarjeta de perfil, para
   darle una identidad visual clara desde el primer vistazo. */
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
  position: absolute; bottom: 0; right: 0; background: #3b82f6; border: 2px solid var(--bg-cards, #121212);
  width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff;
  transition: transform 0.15s ease, background 0.2s ease;
}
.avatar-wrapper:hover .avatar-action { transform: scale(1.08); background: #2563eb; }
.avatar-action svg { width: 16px; height: 16px; }

.gym-name-display {
  font-family: 'Anton', sans-serif;
  font-size: 1.3rem;
  color: #fff;
  margin: 4px 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.profile-hint { font-family: 'Inter', sans-serif; color: #94a3b8; font-size: 0.85rem; margin-top: 6px; }

.forms-wrapper { display: flex; flex-direction: column; gap: 28px; width: 100%; min-width: 0; }
.login-card {
  background: var(--bg-cards, rgba(18, 18, 18, 0.75));
  backdrop-filter: blur(12px);
  padding: 36px;
  border-radius: var(--app-border-radius, 24px);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.12));
  box-sizing: border-box;
  width: 100%;
  margin-top: 2%;
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
  font-size: 1.6rem;
  color: #fff;
  margin-bottom: 24px;
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
.section-title.mb-0 { margin-bottom: 0; }

.map-instructions {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #94a3b8;
  margin: 6px 0 0;
}

.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
.vertical-stack { grid-template-columns: 1fr; }
.span-2 { grid-column: span 2; }
.mt-2 { margin-top: 12px; }
.mt-3 { margin-top: 24px; }
.mt-4 { margin-top: 24px; }
.mb-2 { margin-bottom: 8px; }
.mb-4 { margin-bottom: 24px; }
.block-label { display: block; }

.input-group { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
label { font-family: 'Oswald', sans-serif; color: #f5f5f4; font-size: 0.85rem; font-weight: 600; letter-spacing: 0.5px; }

input, textarea {
  background: var(--bg-cards, rgba(18, 18, 18, 0.75));  border: 1.5px solid rgba(255, 255, 255, 0.12); border-radius: 12px;
  color: #fff; padding: 12px 14px; width: 100%; box-sizing: border-box; font-family: 'Inter', sans-serif; font-size: 0.95rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  min-width: 0;
}
input:focus, textarea:focus { border-color: #3b82f6; outline: none; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); }
.input-disabled { background: rgba(255, 255, 255, 0.03); color: #94a3b8; cursor: not-allowed; border-color: rgba(255, 255, 255, 0.06); }

/* Estilos para el campo de Foto de Portada / Banner */
.cover-upload-container {
  width: 100%;
  height: 160px;
  border: 1.5px dashed rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: border-color 0.2s, background 0.2s;
}
.cover-upload-container:hover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.03);
}
.cover-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cover-placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  text-align: center;
  padding: 0 16px;
}
.cover-placeholder-content svg {
  color: #60a5fa;
}

.membership-inline-row { display: flex; gap: 10px; align-items: center; min-width: 0; }
.membership-inline-row input { flex: 1; min-width: 0; }
.action-btn {
  background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 12px;
  color: #fff; width: 46px; height: 46px; display: flex; align-items: center; justify-content: center; cursor: pointer;
  transition: background 0.2s, transform 0.15s ease, box-shadow 0.15s ease; flex-shrink: 0;
}
.action-btn:hover { background: rgba(255, 255, 255, 0.15); transform: translateY(-2px); box-shadow: 0 8px 18px rgba(0,0,0,0.35); }
.action-btn svg { width: 20px; height: 20px; }

.btn-cancel-subscription {
  background: transparent; border: none; color: #ef4444; font-family: 'Inter', sans-serif;
  font-size: 0.82rem; font-weight: 600; cursor: pointer; text-align: left; padding: 4px 0; width: fit-content;
}
.btn-cancel-subscription:hover { text-decoration: underline; }

.dual-action-buttons { display: flex; gap: 12px; }
.btn-custom-action {
  flex: 1; padding: 12px 16px; border-radius: 12px; font-family: 'Oswald', sans-serif; font-weight: 600;
  font-size: 0.9rem; text-transform: uppercase; cursor: pointer; border: none;
  transition: filter 0.2s, transform 0.15s ease, box-shadow 0.15s ease;
}
.btn-sede {   background: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, #ffffff); }
.btn-ai {   background: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, #ffffff);  }
.btn-custom-action:hover:not(.btn-disabled) { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 8px 18px rgba(0,0,0,0.35); }
.btn-disabled { opacity: 0.5; filter: grayscale(0.5); cursor: not-allowed; pointer-events: none; }

.textarea-custom { resize: vertical; min-height: 80px; }

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
  max-width:1020px;
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
  font-family: 'Anton', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
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

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.modal-body {
  padding: 24px;
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


/* AMENIDADES */
.add-amenity-row { display: flex; gap: 10px; min-width: 0; }
.add-amenity-row input { flex: 1; min-width: 0; }
.btn-add-amenity {
  background: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, #ffffff);  border: none; border-radius: 12px; padding: 0 18px;
  font-family: 'Oswald', sans-serif; font-weight: 600; cursor: pointer; white-space: nowrap;
  transition: background 0.2s, transform 0.15s ease, box-shadow 0.15s ease;
}
.btn-add-amenity:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 8px 18px rgba(0,0,0,0.35); }

.amenities-tags-container { display: flex; flex-wrap: wrap; gap: 12px; }
.amenity-tag-pill {
  display: inline-flex; align-items: center; background: var(--bg-cards, rgba(18, 18, 18, 0.75));
  border: 1.5px solid rgba(255, 255, 255, 0.12); border-radius: 14px; padding: 6px 12px; gap: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3); transition: border-color 0.2s, transform 0.15s ease;
}
.amenity-tag-pill:hover { transform: translateY(-1px); }
.amenity-tag-pill:focus-within { border-color: #3b82f6; }
.amenity-tag-input {
  background: transparent; border: none; color: #fff; font-family: 'Inter', sans-serif; font-size: 0.9rem; padding: 2px; width: 170px;
}
.amenity-tag-input:focus { box-shadow: none; border-color: transparent; outline: none; }
.btn-remove-amenity-tag {
  background: transparent; border: none; color: #ef4444; font-size: 1.25rem; font-weight: 700; cursor: pointer; padding: 0; line-height: 1; transition: opacity 0.2s;
}
.btn-remove-amenity-tag:hover { opacity: 0.75; }

.input-wrapper { position: relative; width: 100%; min-width: 0; }
.toggle-password-btn {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: transparent; border: none; color: #94a3b8; cursor: pointer; display: flex; align-items: center;
}

.map-card-header-bar { display: flex; justify-content: space-between; align-items: center; }

/* ==========================================
   MAPA REAL (Leaflet + OpenStreetMap)
   ========================================== */
/* ==========================================
   MAPA REAL (Leaflet + OpenStreetMap)
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
  height: 420px;
  background: #0a0d14;
}

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

.map-search-bar {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 210px; /* Margen derecho en escritorio para no chocar con los botones */
  z-index: 1500;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(18, 18, 18, 0.92);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 6px 8px 6px 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
}
.map-search-bar svg { color: #94a3b8; flex-shrink: 0; }
.map-search-bar input {
  border: none;
  background: transparent;
  padding: 6px 0;
  font-size: 0.85rem;
  min-width: 0;
  width: 100%;
}
.map-search-bar input:focus { box-shadow: none; outline: none; }

.btn-search-map {
  background: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, #ffffff);
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: 'Oswald', sans-serif;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  transition: filter 0.2s ease, transform 0.15s ease;
}
.btn-search-map:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
.btn-search-map:disabled { opacity: 0.65; cursor: wait; }

.map-controls-top-right {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1500;
  display: flex;
  gap: 8px;
}

.btn-map-tool {
  background: rgba(18, 18, 18, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
  transition: background 0.2s ease, transform 0.15s ease;
}
.btn-map-tool:hover { background: rgba(30, 30, 30, 0.95); transform: translateY(-1px); }

.btn-center-sede {
  background: rgba(18, 18, 18, 0.9); 
  backdrop-filter: blur(8px); 
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff; 
  padding: 8px 14px; 
  border-radius: 10px; 
  font-size: 0.82rem; 
  font-weight: 600;
  display: flex; 
  align-items: center; 
  gap: 8px; 
  cursor: pointer; 
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  white-space: nowrap; 
  transition: background 0.2s ease, transform 0.15s ease;
}
.btn-center-sede:hover { background: rgba(30, 30, 30, 0.95); transform: translateY(-1px); }

.map-zoom-controls-v3 {
  position: absolute; 
  bottom: 95px; /* Subido para evitar que choque con la barra de coordenadas */
  right: 16px; 
  background: #181b22;
  border: 1px solid rgba(255, 255, 255, 0.15); 
  border-radius: 10px; 
  display: flex; 
  flex-direction: column; 
  overflow: hidden; 
  z-index: 1500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}
.zoom-btn-v3 {  background: transparent; border: none; color: #fff; width: 32px; height: 32px; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.zoom-btn-v3:hover { background: rgba(255, 255, 255, 0.1); }
.zoom-divider { height: 1px; background: rgba(255, 255, 255, 0.1); }

.map-coords-bar {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  background: var(--bg-cards, rgba(18, 18, 18, 0.75));
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  z-index: 5;
}
.coord-field { flex: 1; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.coord-field label { font-size: 0.7rem; text-transform: uppercase; }
.coord-field input { padding: 8px 10px; font-size: 0.82rem; }

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
/* Tema oscuro para los elementos propios de Leaflet, para que combinen con la app */
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

.days-container { display: flex; gap: 8px; flex-wrap: wrap; }
.day-chip {
  background: #141414; border: 1.5px solid rgba(255, 255, 255, 0.12); color: #94a3b8;
  padding: 8px 14px; border-radius: 10px; font-family: 'Oswald', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.day-chip:hover { border-color: var(--color-botones, #1c4fd6); color: #fff; transform: translateY(-1px); }
.day-chip.active { background: var(--color-botones, #1c4fd6);  border-color: var(--color-botones, #1c4fd6);  color: #fff; }

/* Horarios */
.schedules-grid-multi-column {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.schedule-card-box-item {
  background: var(--bg-cards, rgba(18, 18, 18, 0.75));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: border-color 0.2s, opacity 0.2s, background 0.2s;
  min-width: 0;
}
.schedule-card-box-item.inactive {
  opacity: 0.5;
  background: rgba(20, 20, 20, 0.4);
}

.schedule-card-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.schedule-day-pill {
  font-family: 'Oswald', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.5px;
}

.switch-toggle {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  cursor: pointer;
  flex-shrink: 0;
}
.switch-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider-round {
  position: absolute;
  inset: 0;
  background-color: #2a2e39;
  transition: 0.3s;
  border-radius: 20px;
}
.slider-round:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}
.switch-toggle input:checked + .slider-round {
  background-color: #3b82f6;
}
.switch-toggle input:checked + .slider-round:before {
  transform: translateX(16px);
}

.schedule-times-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.time-block-compact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.02);
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  gap: 6px;
  min-width: 0;
}

.lbl-small {
  font-size: 0.72rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  font-family: 'Oswald', sans-serif;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.time-input-pill {
  min-width: 0;
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.time-input-pill input {
  background: var(--bg-cards, rgba(18, 18, 18, 0.75));
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 6px 8px;
  border-radius: 6px;
  color: #fff;
  font-size: 0.82rem;
  width: 100%;
  max-width: 110px;
}

.schedule-closed-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #ef4444;
  font-weight: 600;
  text-align: center;
  padding: 10px 0;
}

.btn-primary {
  margin-top: 32px;
  width: 100%;   background: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, #ffffff); border: none; border-radius: 14px; padding: 16px;
  font-family: 'Oswald', sans-serif; font-size: 1.1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease;
}
.btn-primary:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 10px 24px rgba(37, 99, 235, 0.35); }

/* RESPONSIVE DESIGN */
@media (max-width: 1200px) and (min-width: 1025px) {
  .schedules-grid-multi-column {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .profile-card {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .profile-section {
    position: relative;
    top: 0;
    transform: none !important;
    width: 100%;
    padding: 24px 16px;
  }
  .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .span-2 {
    grid-column: span 1;
  }
  .schedules-grid-multi-column {
    grid-template-columns: 1fr;
  }
  .dual-action-buttons {
    flex-direction: column;
  }
  .membership-inline-row {
    flex-direction: column;
    align-items: stretch;
  }
  .action-btn {
    width: 100%;
    height: 42px;
  }
  .login-card {
    padding: 20px 16px;
  }
  .main-content {
    padding: 16px 10px;
  }

  .add-amenity-row {
    flex-direction: column;
  }
  .btn-add-amenity {
    width: 100%;
    padding: 12px;
  }
  .amenities-tags-container {
    flex-direction: column;
  }
  .amenity-tag-pill {
    width: 100%;
    justify-content: space-between;
  }
  .amenity-tag-input {
    width: 100%;
  }

  .map-search-bar {
    top: 12px;
    left: 12px;
    right: 12px; /* Ocupa todo el ancho en móviles */
    height: auto;
  }
  .map-controls-top-right {
    top: 72px; /* Se coloca debajo de la barra de búsqueda en móviles */
    right: 12px;
    left: 12px;
    justify-content: flex-end; /* Alineados a la derecha de forma limpia */
    flex-wrap: wrap;
  }

  .map-coords-bar {
    flex-direction: column;
  }
  .map-zoom-controls-v3 {
    bottom: 160px; 
  }
}
</style>