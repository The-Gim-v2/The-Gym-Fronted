<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import HeadingOwner from '../HeadingOwner.vue';
import RegisterGymModal from '../../Record/Record-Gym.vue';
import AIChatModal from '../../Record/Record-Staff.vue';
import MembershipModal from '../../Modals/MembershipModal.vue';
import { traducciones } from '../i18n.js';
import NotificationSystem from '../../Modals/NotificationSystem.vue';

// --- MAPA REAL (Leaflet + OpenStreetMap) ---
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const currentLang = ref(localStorage.getItem('owner-idioma') || 'es');
const router = useRouter();
const originalEmail = ref('contacto@ironfitness.com');

const t = (key: string) => {
  const dict = traducciones as Record<string, Record<string, string>>;
  const langTable = dict[currentLang.value] || dict['es'] || {};
  const fallbackTable = dict['es'] || {};
  return langTable[key] || fallbackTable[key] || key;
};

// Traducción con texto de respaldo: si la clave no existe en i18n,
// t() devuelve la propia clave, así que aquí detectamos eso y usamos el respaldo.
const tr = (key: string, fallback: string) => {
  const v = t(key);
  return v && v !== key ? v : fallback;
};

const handleLangChange = (e: Event) => {
  const customEvent = e as CustomEvent<{ idioma?: string }>;
  if (customEvent.detail && customEvent.detail.idioma) {
    currentLang.value = customEvent.detail.idioma;
  }
};

onMounted(() => {
  window.addEventListener('idioma-changed', handleLangChange as EventListener);
  initMap();
});

onUnmounted(() => {
  window.removeEventListener('idioma-changed', handleLangChange as EventListener);
  window.removeEventListener('resize', handleWindowResizeMap);

  if (geocodeTimer) clearTimeout(geocodeTimer);

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

const toastRef = ref<InstanceType<typeof NotificationSystem> | null>(null);

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
    showNotification(tr('toastLogoUpdated', 'Logo actualizado correctamente'), 'info');
  }
};

const showNotification = (
  msg: string,
  type: 'success' | 'warning' | 'info' | 'error' = 'success',
  duration = 4000
) => {
  toastRef.value?.notify(msg, type, duration);
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
  showNotification(tr('toastCancelRequested', 'Solicitud de cancelación procesada'), 'warning');
};

const handleAddSede = () => {
  if (!isProMember.value) {
    showNotification(tr('toastProOnlySede', 'Función exclusiva para miembros Pro'), 'warning');
    return;
  }
  showAddSedeModal.value = true;
};

const handleInteractAI = () => {
  if (!isProMember.value) {
    showNotification(tr('toastProOnlyAI', 'Función exclusiva para miembros Pro'), 'warning');
    return;
  }
  showAIModal.value = true;
};

/* =========================================================
   MAPA REAL: Leaflet + OpenStreetMap
   - Clic en el mapa, arrastrar el pin o "Mi ubicación" fijan el punto
   - Con cada cambio se consulta Nominatim (geocodificación inversa)
     y se rellenan los campos de dirección
   - Las coordenadas quedan en form.latitud / form.longitud
   ========================================================= */
const mapContainer = ref<HTMLElement | null>(null);
let mapInstance: L.Map | null = null;
let marker: L.Marker | null = null;
let accuracyCircle: L.Circle | null = null;
let baseLayer: L.TileLayer | null = null;
let resizeObserver: ResizeObserver | null = null;
let geocodeTimer: ReturnType<typeof setTimeout> | null = null;
let geocodeToken = 0;

const mapCargando = ref(true);
const direccionBusqueda = ref('');
const buscandoDireccion = ref(false);
const obteniendoUbicacion = ref(false);
const resolviendoDireccion = ref(false);
const locationStatus = ref<'idle' | 'ok' | 'partial' | 'error'>('idle');
const locationMessage = ref('');

type MapStyle = 'calles' | 'satelite';
const mapStyle = ref<MapStyle>('calles');

const TILE_LAYERS: Record<MapStyle, { url: string; attribution: string; maxZoom: number; subdomains?: string }> = {
  calles: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    subdomains: 'abc',
    maxZoom: 19,
  },
  satelite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    maxZoom: 19,
  },
};

function handleWindowResizeMap() {
  mapInstance?.invalidateSize();
}

function aplicarCapaBase() {
  if (!mapInstance) return;
  if (baseLayer) mapInstance.removeLayer(baseLayer);
  const cfg = TILE_LAYERS[mapStyle.value];
  baseLayer = L.tileLayer(cfg.url, {
    attribution: cfg.attribution,
    maxZoom: cfg.maxZoom,
    ...(cfg.subdomains ? { subdomains: cfg.subdomains } : {}),
  }).addTo(mapInstance);
  baseLayer.bringToBack();
}

function cambiarEstiloMapa(id: MapStyle) {
  if (mapStyle.value === id) return;
  mapStyle.value = id;
  aplicarCapaBase();
}

function initMap() {
  if (!mapContainer.value) return;

  const lat = parseFloat(form.latitud) || 21.9903;
  const lng = parseFloat(form.longitud) || -99.0152;

  mapInstance = L.map(mapContainer.value, {
    center: [lat, lng],
    zoom: form.mapZoomLevel,
    zoomControl: false,
    attributionControl: false,
  });
  // Atribución abajo-izquierda para que no choque con los botones de zoom
  L.control.attribution({ position: 'bottomleft', prefix: false }).addTo(mapInstance);
  aplicarCapaBase();

  // Pin propio (no depende de las imágenes por defecto de Leaflet)
  const pinIcon = L.divIcon({
    className: 'gym-pin',
    html: '<span class="gym-pin-body"><span class="gym-pin-dot"></span></span>',
    iconSize: [36, 42],
    iconAnchor: [18, 40],
    popupAnchor: [0, -38],
  });

  marker = L.marker([lat, lng], { draggable: true, icon: pinIcon }).addTo(mapInstance);
  actualizarPopupMarcador(true);

  marker.on('dragend', () => {
    const pos = marker!.getLatLng();
    guardarCoordenadas(pos.lat, pos.lng);
  });

  mapInstance.on('click', (e: L.LeafletMouseEvent) => {
    guardarCoordenadas(e.latlng.lat, e.latlng.lng);
  });

  mapInstance.on('zoomend', () => {
    form.mapZoomLevel = mapInstance!.getZoom();
  });

  // Leaflet necesita recalcular su tamaño cuando el contenedor ya tiene
  // sus dimensiones finales: esperamos dos frames + un timeout corto y
  // además observamos el contenedor por si cambia después.
  const finalizarCarga = () => {
    mapInstance?.invalidateSize();
    mapCargando.value = false;
  };
  requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(finalizarCarga, 250)));

  if ('ResizeObserver' in window && mapContainer.value) {
    resizeObserver = new ResizeObserver(() => mapInstance?.invalidateSize());
    resizeObserver.observe(mapContainer.value);
  }
  window.addEventListener('resize', handleWindowResizeMap);
}

/* ---------- Círculo de precisión ---------- */
function limpiarCirculoPrecision() {
  if (accuracyCircle) {
    accuracyCircle.remove();
    accuracyCircle = null;
  }
}

function dibujarCirculoPrecision(lat: number, lng: number, radio: number) {
  limpiarCirculoPrecision();
  if (!mapInstance || !radio) return;
  accuracyCircle = L.circle([lat, lng], {
    radius: radio,
    color: '#60a5fa',
    weight: 1,
    fillColor: '#3b82f6',
    fillOpacity: 0.12,
  }).addTo(mapInstance);
}

/* ---------- Popup del pin ---------- */
const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

function actualizarPopupMarcador(abrir = false) {
  if (!marker) return;
  const linea = [
    form.calle && `${form.calle}${form.numExt ? ' #' + form.numExt : ''}`,
    form.colonia,
  ].filter(Boolean).join(', ');
  const html = `<strong>${escapeHtml(form.nombreGimnasio)}</strong>${linea ? '<br>' + escapeHtml(linea) : ''}`;
  if (marker.getPopup()) marker.setPopupContent(html);
  else marker.bindPopup(html);
  if (abrir) marker.openPopup();
}

// Mantiene al día el texto del pin cuando cambian estos campos
watch(
  () => [form.nombreGimnasio, form.calle, form.numExt, form.colonia],
  () => actualizarPopupMarcador()
);

/* ---------- Coordenadas ---------- */
// Clic en el mapa o arrastrar el pin: guarda coordenadas y autocompleta la dirección
function guardarCoordenadas(lat: number, lng: number) {
  form.latitud = lat.toFixed(6);
  form.longitud = lng.toFixed(6);
  marker?.setLatLng([lat, lng]);
  limpiarCirculoPrecision();
  if (geocodeTimer) clearTimeout(geocodeTimer);
  geocodeTimer = setTimeout(() => resolverDireccion(lat, lng), 500); // evita saturar Nominatim
}

// Aplica coordenadas escritas a mano en los campos de Latitud/Longitud
function aplicarCoordenadasManuales() {
  const lat = parseFloat(form.latitud);
  const lng = parseFloat(form.longitud);
  if (Number.isNaN(lat) || Number.isNaN(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    showNotification(tr('toastInvalidCoords', 'Coordenadas inválidas'), 'warning');
    return;
  }
  mapInstance?.setView([lat, lng], Math.max(form.mapZoomLevel, 16));
  guardarCoordenadas(lat, lng);
}

function centrarSedeMapa() {
  if (!mapInstance || !marker) return;
  mapInstance.setView(marker.getLatLng(), Math.max(form.mapZoomLevel, 16));
  marker.openPopup();
}
const zoomInMap = () => mapInstance?.zoomIn();
const zoomOutMap = () => mapInstance?.zoomOut();

/* ---------- Geocodificación inversa (coordenadas -> campos) ---------- */
type AddressResult = 'ok' | 'partial' | 'error';

async function obtenerDireccionDesdeCoordenadas(lat: number, lng: number): Promise<AddressResult | null> {
  const token = ++geocodeToken;
  resolviendoDireccion.value = true;
  try {
    const lang = currentLang.value === 'en' ? 'en' : 'es';
    const url =
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=18` +
      `&accept-language=${lang}&lat=${lat}&lon=${lng}`;
    const resp = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!resp.ok) throw new Error('Reverse geocoding error');
    const data = await resp.json();
    if (token !== geocodeToken) return null; // llegó una consulta más reciente, ignorar esta

    const a: Record<string, string> = data.address || {};

    form.entidad = a.state || a.region || a.state_district || form.entidad;
    // En México "municipality" es lo más fiable; en CDMX la alcaldía viene en city_district
    form.municipio =
      a.municipality || a.city_district || a.city || a.town || a.village || a.county || form.municipio;
    // Estos se limpian si no vienen, para no mezclar datos de otro lugar
    form.colonia = a.neighbourhood || a.suburb || a.quarter || a.hamlet || '';
    form.calle = a.road || a.pedestrian || a.footway || a.path || '';
    form.cp = a.postcode || '';
    form.numExt = a.house_number || '';

    const completo = Boolean(form.entidad && form.municipio && form.colonia && form.calle && form.cp);
    return completo ? 'ok' : 'partial';
  } catch {
    return token === geocodeToken ? 'error' : null;
  } finally {
    if (token === geocodeToken) resolviendoDireccion.value = false;
  }
}

async function resolverDireccion(lat: number, lng: number, accuracy = 0) {
  const r = await obtenerDireccionDesdeCoordenadas(lat, lng);
  if (r === null) return;
  locationStatus.value = r;
  let msg =
    r === 'ok' ? 'Dirección completada. Verifica los datos.'
    : r === 'partial' ? 'Dirección incompleta: revisa los campos vacíos.'
    : 'No se pudo obtener la dirección. Captúrala manualmente.';
  if (accuracy > 100) msg += ` Precisión ±${Math.round(accuracy)} m: ajusta el pin si es necesario.`;
  locationMessage.value = msg;
  actualizarPopupMarcador(true);
}

/* ---------- Mi ubicación ---------- */
function usarMiUbicacion() {
  if (!navigator.geolocation) {
    locationStatus.value = 'error';
    locationMessage.value = 'Tu navegador no soporta geolocalización.';
    showNotification(tr('toastGeoNotSupported', 'Tu navegador no soporta geolocalización'), 'warning');
    return;
  }

  obteniendoUbicacion.value = true;
  locationStatus.value = 'idle';
  locationMessage.value = '';

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      const zoom = accuracy > 500 ? 15 : 17;
      mapInstance?.setView([latitude, longitude], zoom);
      marker?.setLatLng([latitude, longitude]);
      form.latitud = latitude.toFixed(6);
      form.longitud = longitude.toFixed(6);
      dibujarCirculoPrecision(latitude, longitude, accuracy);
      obteniendoUbicacion.value = false;

      await resolverDireccion(latitude, longitude, accuracy);
      showNotification(tr('toastLocationUpdated', 'Ubicación detectada'), 'success');
    },
    (err) => {
      obteniendoUbicacion.value = false;
      locationStatus.value = 'error';
      locationMessage.value =
        err.code === err.PERMISSION_DENIED
          ? 'Permiso de ubicación denegado. Actívalo en el navegador o marca el punto en el mapa.'
          : 'No se pudo obtener tu ubicación. Búscala o márcala en el mapa.';
      showNotification(tr('toastGeoDenied', 'No se pudo obtener tu ubicación'), 'warning');
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
  );
}

/* ---------- Buscar dirección ---------- */
async function buscarDireccion() {
  const consulta = direccionBusqueda.value.trim();
  if (!consulta) return;
  buscandoDireccion.value = true;
  try {
    // countrycodes=mx sesga los resultados a México; quítalo si operas en otros países
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=mx&q=${encodeURIComponent(consulta)}`;
    const resp = await fetch(url, { headers: { Accept: 'application/json' } });
    const resultados = await resp.json();
    if (resultados?.length) {
      const lat = parseFloat(resultados[0].lat);
      const lng = parseFloat(resultados[0].lon);
      mapInstance?.setView([lat, lng], 17);
      guardarCoordenadas(lat, lng);
    } else {
      showNotification(tr('toastAddressNotFound', 'No se encontró esa dirección'), 'warning');
    }
  } catch {
    showNotification(tr('toastAddressSearchError', 'No se pudo buscar la dirección'), 'warning');
  } finally {
    buscandoDireccion.value = false;
  }
}
</script>

<template>
  <HeadingOwner>
    <NotificationSystem ref="toastRef" />
    <main class="main-content" id="tutor-0">

      <NotificationSystem ref="toastRef" />

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
                <button type="button" class="location-chip" :class="locationStatus" :disabled="obteniendoUbicacion" @click="usarMiUbicacion">
                  <span v-if="obteniendoUbicacion" class="map-spinner"></span>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="8"/></svg>
                  <span>{{ obteniendoUbicacion ? tr('btnLocating', 'Ubicando…') : tr('btnUseMyLocationShort', 'Mi ubicación') }}</span>
                </button>
              </div>
              <p class="map-instructions">
                {{ tr('mapInstructions', 'Usa tu ubicación, busca una dirección o mueve el pin para fijar el punto exacto del gimnasio.') }}
              </p>
              <p v-if="locationMessage" class="location-status-line" :class="locationStatus">
                <span class="dot"></span>{{ locationMessage }}
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
              <div class="map-shell mt-4">
                <div class="map-toolbar">
                  <div class="map-search">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" v-model="direccionBusqueda" :placeholder="tr('mapSearchPlaceholder', 'Buscar dirección o lugar...')" @keyup.enter.prevent="buscarDireccion" />
                    <button type="button" class="btn-search-map" @click="buscarDireccion" :disabled="buscandoDireccion">
                      <span v-if="buscandoDireccion" class="map-spinner"></span>
                      <span v-else>{{ tr('btnSearch', 'Buscar') }}</span>
                    </button>
                  </div>
                  <div class="map-style-switch" role="group" aria-label="Tipo de mapa">
                    <button type="button" :class="{ active: mapStyle === 'calles' }" @click="cambiarEstiloMapa('calles')" :aria-pressed="mapStyle === 'calles'">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z"></path><path d="M9 3v15"></path><path d="M15 6v15"></path>
                      </svg>
                      <span>{{ tr('mapStreetView', 'Calles') }}</span>
                    </button>
                    <button type="button" :class="{ active: mapStyle === 'satelite' }" @click="cambiarEstiloMapa('satelite')" :aria-pressed="mapStyle === 'satelite'">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="3"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="M21 15l-5-5L5 21"></path>
                      </svg>
                      <span>{{ tr('mapSatelliteView', 'Satélite') }}</span>
                    </button>
                  </div>
                </div>

                <div class="map-stage">
                  <div ref="mapContainer" class="real-map-canvas"></div>

                  <div v-if="mapCargando" class="map-loading-overlay"><span class="map-spinner big"></span></div>

                  <div v-if="resolviendoDireccion" class="map-resolving">
                    <span class="map-spinner"></span> Obteniendo dirección…
                  </div>

                  <div class="map-fab-column">
                    <button type="button" class="fab" @click="zoomInMap" title="Acercar">+</button>
                    <button type="button" class="fab" @click="zoomOutMap" title="Alejar">−</button>
                    <button type="button" class="fab" @click="centrarSedeMapa" :title="tr('btnCenterBranch', 'Centrar sede')">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="3"></circle><circle cx="12" cy="12" r="9"></circle></svg>
                    </button>
                  </div>
                </div>

                <div class="map-footer">
                  <div class="coord-field">
                    <label>{{ tr('labelLat', 'Latitud') }}</label>
                    <input type="text" v-model="form.latitud" @change="aplicarCoordenadasManuales" />
                  </div>
                  <div class="coord-field">
                    <label>{{ tr('labelLng', 'Longitud') }}</label>
                    <input type="text" v-model="form.longitud" @change="aplicarCoordenadasManuales" />
                  </div>
                  <p class="map-hint">Arrastra el pin o haz clic en el mapa: la dirección se completa sola.</p>
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

              <!-- Horarios específicos por día -->
              <div class="operational-schedules-wrapper mb-4" v-if="form.selectedDays.length > 0">
                <div class="schedule-section-heading">
                  <div>
                    <label class="block-label">{{ t('labelSchedulesPerDay') }}</label>
                    <p>Configura la hora de apertura y cierre para cada día seleccionado.</p>
                  </div>
                </div>

                <div class="weekly-schedule-list">
                  <div v-for="dia in allDays" :key="dia" v-show="form.selectedDays.includes(dia)" class="weekly-schedule-row" :class="{ closed: !form.horariosCompletos[dia as keyof typeof form.horariosCompletos].activo }">
                    <div class="weekly-day-state">
                      <label class="switch-toggle compact-switch">
                        <input type="checkbox" v-model="form.horariosCompletos[dia as keyof typeof form.horariosCompletos].activo" />
                        <span class="slider-round"></span>
                      </label>
                      <div class="weekly-day-copy">
                        <strong>{{ dia }}</strong>
                        <span>{{ form.horariosCompletos[dia as keyof typeof form.horariosCompletos].activo ? tr('labelOpen', 'Abierto') : tr('labelClosed', 'Cerrado') }}</span>
                      </div>
                    </div>

                    <div v-if="form.horariosCompletos[dia as keyof typeof form.horariosCompletos].activo" class="weekly-times">
                      <div class="weekly-time-field">
                        <label>{{ t('labelOpens') }}</label>
                        <input type="time" v-model="form.horariosCompletos[dia as keyof typeof form.horariosCompletos].abierto" />
                      </div>
                      <span class="weekly-time-separator">—</span>
                      <div class="weekly-time-field">
                        <label>{{ t('labelCloses') }}</label>
                        <input type="time" v-model="form.horariosCompletos[dia as keyof typeof form.horariosCompletos].cerrado" />
                      </div>
                    </div>
                    <div v-else class="weekly-closed-text">{{ tr('labelClosed', 'Cerrado') }}</div>
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
  margin: 8px 0 0;
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

/* Foto de Portada / Banner */
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
.btn-sede { background: var(--color-botones, #1c4fd6); color: var(--color-texto-botones, #ffffff); }
.btn-ai { background: var(--color-botones, #1c4fd6); color: var(--color-texto-botones, #ffffff); }
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
  z-index: 99999;
  padding: 16px;
  box-sizing: border-box;
  overflow-y: auto;
}

.modal-container {
  background: var(--bg-cards, #161616);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.12));
  border-radius: 20px;
  width: 100%;
  max-width: 1020px;
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
  color: var(--color-texto-botones, #ffffff); border: none; border-radius: 12px; padding: 0 18px;
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

/* ==========================================
   UBICACIÓN: encabezado + botón compacto
   ========================================== */
.map-card-header-bar { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.map-card-header-bar .section-title { margin-bottom: 0; }

.location-chip {
  display: inline-flex; align-items: center; gap: 7px; height: 34px; padding: 0 14px;
  border-radius: 999px; border: 1px solid rgba(96,165,250,.35); background: rgba(37,99,235,.12);
  color: #93b4f5; font: 600 12px 'Inter', sans-serif; cursor: pointer; white-space: nowrap;
  transition: background .2s, transform .15s, border-color .2s;
}
.location-chip svg { width: 15px; height: 15px; flex-shrink: 0; }
.location-chip:hover:not(:disabled) { background: rgba(37,99,235,.22); transform: translateY(-1px); }
.location-chip:disabled { opacity: .65; cursor: progress; }
.location-chip.ok { color: #86dba6; border-color: rgba(74,222,128,.35); background: rgba(74,222,128,.08); }
.location-chip.partial { color: #e8c976; border-color: rgba(232,201,118,.35); background: rgba(232,201,118,.08); }
.location-chip.error { color: #f6a4a4; border-color: rgba(239,68,68,.35); background: rgba(239,68,68,.08); }

.location-status-line { display: flex; align-items: flex-start; gap: 8px; margin: 10px 0 0; font: 500 11.5px/1.4 'Inter', sans-serif; color: #94a3b8; }
.location-status-line .dot { width: 7px; height: 7px; margin-top: 4px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
.location-status-line.ok { color: #83d8a2; }
.location-status-line.partial { color: #e8c976; }
.location-status-line.error { color: #f6a4a4; }

/* ==========================================
   MAPA REAL (Leaflet + OpenStreetMap)
   ========================================== */
.map-shell {
  border: 1px solid rgba(255,255,255,.1); border-radius: 16px; overflow: hidden;
  background: var(--bg-cards, #121212); box-shadow: 0 10px 30px rgba(0,0,0,.3);
}
.map-toolbar { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; padding: 10px; border-bottom: 1px solid rgba(255,255,255,.08); }

.map-search {
  flex: 1 1 260px; min-width: 0; display: flex; align-items: center; gap: 8px;
  padding: 4px 4px 4px 12px; border-radius: 10px;
  background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1);
  transition: border-color .2s, box-shadow .2s;
}
.map-search:focus-within { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.15); }
.map-search svg { color: #94a3b8; flex-shrink: 0; }
.map-search input { border: none; background: transparent; padding: 7px 0; font-size: .85rem; }
.map-search input:focus { box-shadow: none; outline: none; }

.btn-search-map {
  background: var(--color-botones, #1c4fd6); color: var(--color-texto-botones, #fff);
  border: none; border-radius: 8px; padding: 8px 14px; min-width: 64px; flex-shrink: 0;
  font: 600 .8rem 'Oswald', sans-serif; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: filter .2s, transform .15s;
}
.btn-search-map:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
.btn-search-map:disabled { opacity: .65; cursor: wait; }

.map-style-switch { display: inline-flex; gap: 2px; padding: 3px; border-radius: 10px; background: rgba(255,255,255,.05); }
.map-style-switch button {
  border: 0; background: transparent; color: #94a3b8; padding: 7px 12px; border-radius: 8px;
  font: 600 12px 'Inter', sans-serif; cursor: pointer; transition: background .2s, color .2s;
}
.map-style-switch button:hover { color: #fff; }
.map-style-switch button.active { background: var(--color-botones, #1c4fd6); color: var(--color-texto-botones, #fff); }

.map-stage { position: relative; }
.real-map-canvas { width: 100%; height: 400px; background: #0a0d14; }

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

.map-resolving {
  position: absolute; top: 12px; left: 12px; z-index: 1000;
  display: flex; align-items: center; gap: 8px; padding: 7px 12px; border-radius: 999px;
  background: rgba(18,18,18,.92); border: 1px solid rgba(255,255,255,.15);
  color: #e5e5e5; font: 600 11.5px 'Inter', sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,.4);
}

.map-fab-column {
  position: absolute; right: 12px; bottom: 12px; z-index: 1000;
  display: flex; flex-direction: column; overflow: hidden; border-radius: 12px;
  background: rgba(18,18,18,.92); backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,.15); box-shadow: 0 4px 12px rgba(0,0,0,.4);
}
.fab {
  width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
  background: transparent; border: 0; color: #fff; font-size: 1.15rem; cursor: pointer; transition: background .2s;
}
.fab + .fab { border-top: 1px solid rgba(255,255,255,.1); }
.fab:hover { background: rgba(255,255,255,.1); }

.map-footer {
  display: grid; grid-template-columns: 1fr 1fr 2fr; gap: 12px; align-items: end;
  padding: 12px 14px; border-top: 1px solid rgba(255,255,255,.08);
}
.coord-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.coord-field label { font-size: .7rem; text-transform: uppercase; }
.coord-field input { padding: 8px 10px; font-size: .82rem; }
.map-hint { margin: 0; padding-bottom: 8px; font: 500 11px/1.4 'Inter', sans-serif; color: rgba(245,245,244,.4); }

/* Pin personalizado */
:deep(.gym-pin) { background: transparent; border: 0; }
:deep(.gym-pin-body) {
  display: block; position: relative; box-sizing: border-box; width: 32px; height: 32px; margin: 2px;
  border-radius: 50% 50% 50% 0; transform: rotate(-45deg);
  background: var(--color-botones, #1c4fd6); border: 3px solid #fff; box-shadow: 0 6px 14px rgba(0,0,0,.5);
}
:deep(.gym-pin-dot) { position: absolute; inset: 0; margin: auto; width: 8px; height: 8px; border-radius: 50%; background: #fff; }

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

/* Tema oscuro para los elementos propios de Leaflet */
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
.day-chip.active { background: var(--color-botones, #1c4fd6); border-color: var(--color-botones, #1c4fd6); color: #fff; }

/* Interruptor (usado por el horario semanal) */
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

.btn-primary {
  margin-top: 32px;
  width: 100%; background: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, #ffffff); border: none; border-radius: 14px; padding: 16px;
  font-family: 'Oswald', sans-serif; font-size: 1.1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease;
}
.btn-primary:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 10px 24px rgba(37, 99, 235, 0.35); }

/* ===== Horario semanal compacto ===== */
.schedule-section-heading { display:flex; justify-content:space-between; align-items:flex-end; margin:2px 0 10px; }
.schedule-section-heading p { margin:4px 0 0; color:rgba(245,245,244,.38); font-family:'Inter',sans-serif; font-size:10.5px; line-height:1.45; }
.weekly-schedule-list { overflow:hidden; border:1px solid rgba(255,255,255,.08); border-radius:12px; background:rgba(255,255,255,.012); }
.weekly-schedule-row { min-height:70px; display:grid; grid-template-columns:minmax(150px,.8fr) minmax(330px,1.4fr); align-items:center; gap:22px; padding:11px 14px; border-bottom:1px solid rgba(255,255,255,.065); transition:background .2s ease,opacity .2s ease; }
.weekly-schedule-row:last-child { border-bottom:0; } .weekly-schedule-row:hover { background:rgba(255,255,255,.018); } .weekly-schedule-row.closed { opacity:.58; }
.weekly-day-state { display:flex; align-items:center; gap:11px; min-width:0; }
.weekly-day-copy { display:flex; flex-direction:column; gap:2px; min-width:0; } .weekly-day-copy strong { color:#f5f5f4; font:600 12px/1.3 'Inter',sans-serif; } .weekly-day-copy span { color:rgba(245,245,244,.36); font:500 9.5px/1.3 'Inter',sans-serif; }
.compact-switch { width:34px; height:19px; } .compact-switch .slider-round:before { width:13px; height:13px; } .compact-switch input:checked + .slider-round:before { transform:translateX(15px); }
.weekly-times { display:grid; grid-template-columns:1fr 18px 1fr; align-items:end; gap:8px; }
.weekly-time-field { display:flex; flex-direction:column; gap:5px; min-width:0; } .weekly-time-field label { color:rgba(245,245,244,.48); font:600 9.5px/1.2 'Inter',sans-serif; letter-spacing:.2px; text-transform:none; }
.weekly-time-field input { min-height:40px; padding:8px 10px; border-radius:9px; background:rgba(255,255,255,.025); border:1px solid rgba(255,255,255,.105); font-size:12px; color:#f5f5f4; color-scheme:dark; }
.weekly-time-separator { align-self:center; margin-top:15px; color:rgba(245,245,244,.22); text-align:center; } .weekly-closed-text { color:rgba(245,245,244,.32); font:600 11px/1.4 'Inter',sans-serif; }

/* RESPONSIVE DESIGN */
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
}

@media (max-width: 700px) {
  .weekly-schedule-row { grid-template-columns:1fr; gap:10px; padding:13px; }
  .weekly-times { grid-template-columns:1fr 12px 1fr; }
  .real-map-canvas { height: 320px; }
  .map-footer { grid-template-columns: 1fr 1fr; }
  .map-hint { grid-column: 1 / -1; padding-bottom: 0; }
  .map-style-switch { width: 100%; }
  .map-style-switch button { flex: 1; }
}


/* ===== MAPA ACTUALIZADO: SOLO CALLES / SATÉLITE ===== */
.map-shell { position:relative; overflow:hidden; border:1px solid rgba(255,255,255,.1); border-radius:18px; background:var(--bg-cards,#121212); box-shadow:0 12px 35px rgba(0,0,0,.28); }
.map-toolbar { display:flex; align-items:center; gap:10px; flex-wrap:nowrap; padding:11px; border-bottom:1px solid rgba(255,255,255,.08); background:var(--bg-cards,#121212); }
.map-search { flex:1; min-width:0; display:flex; align-items:center; gap:9px; height:43px; padding:0 5px 0 13px; border:1px solid rgba(255,255,255,.1); border-radius:11px; background:rgba(255,255,255,.035); transition:border-color .2s ease,box-shadow .2s ease,background .2s ease; }
.map-search:focus-within { border-color:var(--color-highlight,#3b82f6); background:rgba(255,255,255,.05); box-shadow:0 0 0 3px rgba(59,130,246,.12); }
.map-search svg { width:17px; height:17px; flex-shrink:0; color:#94a3b8; }
.map-search input { flex:1; min-width:0; height:100%; padding:0; border:0; outline:none; background:transparent; box-shadow:none; font-size:.82rem; }
.map-search input:focus { border:0; outline:none; box-shadow:none; }
.btn-search-map { height:34px; min-width:72px; display:flex; align-items:center; justify-content:center; padding:0 15px; border:0; border-radius:8px; background:var(--color-botones,#1c4fd6); color:var(--color-texto-botones,#fff); font:600 .76rem 'Inter',sans-serif; cursor:pointer; transition:filter .2s ease,transform .2s ease; }
.btn-search-map:hover:not(:disabled) { filter:brightness(1.08); transform:none; }
.btn-search-map:active:not(:disabled) { transform:scale(.97); }
.map-style-switch { flex-shrink:0; display:inline-flex; align-items:center; gap:3px; height:43px; padding:4px; border:1px solid rgba(255,255,255,.08); border-radius:11px; background:rgba(255,255,255,.04); }
.map-style-switch button { height:33px; display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:0 12px; border:0; border-radius:8px; background:transparent; color:#94a3b8; font:600 .72rem 'Inter',sans-serif; cursor:pointer; white-space:nowrap; transition:background .2s ease,color .2s ease,box-shadow .2s ease; }
.map-style-switch button svg { width:14px; height:14px; flex-shrink:0; }
.map-style-switch button:hover:not(.active) { color:#fff; background:rgba(255,255,255,.05); }
.map-style-switch button.active { background:var(--color-botones,#1c4fd6); color:var(--color-texto-botones,#fff); box-shadow:0 2px 8px rgba(28,79,214,.25); }
.map-stage { position:relative; overflow:hidden; background:#e5e7eb; }
.real-map-canvas { width:100%; height:430px; background:#e5e7eb; }
.map-fab-column { right:14px; bottom:14px; border-radius:11px; backdrop-filter:blur(10px); box-shadow:0 6px 20px rgba(0,0,0,.28); }
.fab { width:38px; height:38px; font-size:1.1rem; }
.map-footer { display:grid; grid-template-columns:180px 180px 1fr; gap:12px; align-items:end; padding:12px 14px; border-top:1px solid rgba(255,255,255,.08); background:var(--bg-cards,#121212); }
.coord-field { display:flex; flex-direction:column; gap:5px; min-width:0; }
.coord-field label { font-size:.65rem; text-transform:uppercase; }
.coord-field input { height:36px; padding:0 10px; font-size:.77rem; }
.map-hint { margin:0; padding-bottom:7px; color:rgba(245,245,244,.42); font:500 .68rem/1.45 'Inter',sans-serif; }
@media (max-width:800px) { .map-toolbar{align-items:stretch;flex-direction:column}.map-search{flex:none;width:100%}.map-style-switch{width:100%}.map-style-switch button{flex:1}.real-map-canvas{height:380px}.map-footer{grid-template-columns:1fr 1fr}.map-hint{grid-column:1/-1} }
@media (max-width:520px) { .real-map-canvas{height:340px}.map-footer{grid-template-columns:1fr}.map-hint{grid-column:auto} }

</style>