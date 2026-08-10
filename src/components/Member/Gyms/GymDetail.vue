<template>
<HeadingMember>
  <div class="gym-detail-wrapper animate-fade">
    
    <!-- Botón de Retorno -->
    <button id="tutor-back-btn" class="back-btn" @click="$router.push({ name: 'member-gyms-list' })">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
      {{ t('back') }}
    </button>

    <!-- BANNER SUPERIOR CON LOGO E INFORMACIÓN GENERAL -->
    <div id="tutor-hero-card" class="gym-hero-card">
      <div class="hero-bg" :style="{ backgroundImage: `url(${gymData.image})` }"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content-flex">
        <!-- Logo de la marca -->
        <div id="tutor-logo-box" class="gym-logo-box">
          <img :src="gymData.logo" alt="Logo" class="gym-logo-img" />
        </div>
        <div class="hero-texts">
          <div class="badge">{{ gymData.category }}</div>
          <h1>{{ gymData.name }}</h1>
          <p class="hero-address">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            {{ currentBranch.address }}
          </p>
        </div>
      </div>
    </div>

    <!-- DISTRIBUCIÓN PRINCIPAL DE 2 COLUMNAS (Dashboard) -->
    <div class="dashboard-grid">
      
      <!-- COLUMNA IZQUIERDA: Mapa con Ruta GPS y Control de Instrucciones -->
      <div class="left-column">
        
        <!-- Mapa Interactivo con Navegación de Ruta -->
        <div id="tutor-map-panel" class="panel-box map-panel">
          <div class="panel-header">
            <h3>{{ t('mapTitle') }}</h3>
            <div class="map-actions">
              <!-- Botón principal para calcular ruta -->
              <button id="tutor-route-btn" class="route-gps-btn" @click="calculateRouteFromCurrentLocation">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                {{ t('howToGetThere') }}
              </button>
              
              <!-- Botón para mostrar/ocultar el panel de instrucciones (solo aparece si hay ruta activa) -->
              <button id="tutor-toggle-steps-btn" v-if="hasActiveRoute" class="toggle-instructions-btn" @click="toggleInstructions">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path v-if="showInstructions" d="M18 6L6 18M6 6l12 12"></path>
                  <path v-else d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
                {{ showInstructions ? t('hideSteps') : t('showSteps') }}
              </button>
            </div>
          </div>
          
          <!-- Contenedor del mapa -->
        <div class="map-container-inner">
            <div ref="mapElement" class="map-canvas"></div>
            
            <!-- Botón para recentrar el mapa en la sucursal -->
            <button id="tutor-recenter-btn" class="recenter-map-btn" @click="recenterMap" :title="t('recenterMap')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span>{{ t('recenter') }}</span>
            </button>

            <div class="map-watermark-overlay">
                <span class="watermark-text">{{ currentBranch.name }}</span>
            </div>
            </div>
        </div>

        <!-- Fila de Información y Amenidades -->
        <div class="info-split-row">
          <div id="tutor-about-box" class="panel-box">
            <h3>{{ t('about') }}</h3>
            <p>{{ gymData.description }}</p>
          </div>
          <div id="tutor-amenities-box" class="panel-box">
            <h3>{{ t('amenities') }}</h3>
            <div class="amenities-grid">
              <span v-for="a in gymData.amenities" :key="a" class="amenity-item">✓ {{ a }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- COLUMNA DERECHA: Información de Contacto, Sucursales, Horarios y Acción -->
      <div class="right-column">
        
        <!-- Tarjeta de Contacto/Gym -->
        <div id="tutor-contact-card" class="panel-box headinadmin-card">
          <div class="headinadmin-header">
            <div class="admin-icon-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <div>
              <span class="admin-tag">Contacto Directo Sede</span>
              <h4>{{ currentBranch.name }}</h4>
            </div>
          </div>
          <div class="admin-details">
            <div class="admin-row">
              <span>Teléfono:</span>
              <strong>{{ currentBranch.phone }}</strong>
            </div>
            <div class="admin-row">
              <span>Correo:</span>
              <strong>{{ currentBranch.email }}</strong>
            </div>
            <div class="admin-row">
              <span>Encargado:</span>
              <strong>{{ currentBranch.manager }}</strong>
            </div>
            <!-- Botón de comunicación directa con el dueño / administrador vía WhatsApp -->
            <button class="whatsapp-contact-btn" @click="contactOwner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              {{ t('contactOwnerWhatsapp') }}
            </button>
          </div>
        </div>

        <!-- Selector de Sucursales -->
        <div id="tutor-branches-box" class="panel-box sidebar-box">
          <h3>{{ t('selectBranch') }}</h3>
          <p class="box-sub">{{ t('branchSub') }}</p>

          <div class="branches-list">
            <div 
              v-for="branch in gymData.branches" 
              :key="branch.id"
              :id="`tutor-branch-item-${branch.id}`"
              class="branch-card-item"
              :class="{ selected: selectedBranchId === branch.id }"
              @click="updateMapLocation(branch)"
            >
              <div class="radio-indicator">
                <div v-if="selectedBranchId === branch.id" class="radio-dot"></div>
              </div>
              <div class="branch-info">
                <strong>{{ branch.name }}</strong>
                <span>{{ branch.address }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Horarios Completos -->
        <div id="tutor-schedule-box" class="panel-box schedule-box">
          <h3>{{ t('scheduleTitle') }}</h3>
          <div class="schedule-list">
            <div class="schedule-item">
              <span class="day">{{ t('weekdays') }}</span>
              <span class="time">{{ gymData.schedule.weekdays }}</span>
            </div>
            <div class="schedule-item">
              <span class="day">{{ t('saturday') }}</span>
              <span class="time">{{ gymData.schedule.saturday }}</span>
            </div>
            <div class="schedule-item">
              <span class="day">{{ t('sunday') }}</span>
              <span class="time">{{ gymData.schedule.sunday }}</span>
            </div>
          </div>
        </div>

        <!-- Botón de Acción Principal -->
        <button id="tutor-join-btn" class="cta-main-btn" @click="handleJoin">
          {{ t('join') }}
        </button>

      </div>

    </div>

    <!-- NOTIFICACIÓN FLOTANTE (ESTILO TOAST) -->
    <transition name="toast-fade">
      <div v-if="toast.visible" class="custom-toast-notification">
        <div class="toast-icon-wrapper">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close-btn" @click="toast.visible = false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </transition>

  </div>
  </HeadingMember>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import L from 'leaflet';
import HeadingMember from '../HeadingMember.vue';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import Heading from '@/landing/components/Heading.vue';

const route = useRoute();
const router = useRouter();
const gymId = route.params.id;

const mapElement = ref(null);
const selectedBranchId = ref(1);
const currentLang = ref(localStorage.getItem('member-idioma') || 'es');
let map = null;
let routingControl = null;

const hasActiveRoute = ref(false);
const showInstructions = ref(true);

// Estado para la notificación flotante tipo toast
const toast = ref({
  visible: false,
  message: '',
  timer: null
});

const showToast = (message) => {
  if (toast.value.timer) clearTimeout(toast.value.timer);
  toast.value.message = message;
  toast.value.visible = true;
  toast.value.timer = setTimeout(() => {
    toast.value.visible = false;
  }, 4000);
};

const gymData = ref({
  id: gymId,
  name: 'Iron Fitness Center Pro',
  category: 'Musculación & Crossfit',
  logo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=200&auto=format&fit=crop',
  description: 'Instalaciones de clase mundial con tecnología de seguimiento biomecánico y áreas especializadas para entrenamiento de alto rendimiento.',
  image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
  amenities: ['Estacionamiento Gratuito', 'Regaderas y Lockers', 'Wi-Fi de Alta Velocidad', 'Zona de Sauna', 'Bebidas Energéticas'],
  schedule: {
    weekdays: '06:00 AM - 11:00 PM',
    saturday: '07:00 AM - 08:00 PM',
    sunday: '08:00 AM - 04:00 PM'
  },
  branches: [
    { 
      id: 1, 
      lat: 21.9902, 
      lng: -99.0301, 
      name: 'Sede Principal Centro', 
      address: 'Av. Universitaria #420, Zona Centro',
      phone: '+52 (481) 381-9021',
      email: 'centro@ironfitness.com',
      manager: 'Lic. Roberto Garza'
    },
    { 
      id: 2, 
      lat: 22.0050, 
      lng: -99.0210, 
      name: 'Sede Norte Galerías', 
      address: 'Blvd. Industrial #1200, Plaza Norte',
      phone: '+52 (481) 384-1192',
      email: 'norte@ironfitness.com',
      manager: 'Ing. Carlos Mendoza'
    }
  ]
});

const currentBranch = computed(() => {
  return gymData.value.branches.find(b => b.id === selectedBranchId.value) || gymData.value.branches[0];
});

const initMap = () => {
  if (!mapElement.value) return;

  map = L.map(mapElement.value, {
    zoomControl: false,
    attributionControl: false
  }).setView([currentBranch.value.lat, currentBranch.value.lng], 16);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd'
  }).addTo(map);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  updateBranchMarkerOnly();
};

const updateBranchMarkerOnly = () => {
  if (!map) return;
  
  if (routingControl) {
    map.removeControl(routingControl);
    routingControl = null;
    hasActiveRoute.value = false;
  }

  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  const customIcon = L.divIcon({
    className: 'custom-map-marker',
    html: `<div class="marker-pin"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  L.marker([currentBranch.value.lat, currentBranch.value.lng], { icon: customIcon })
    .addTo(map)
    .bindPopup(`<b>${currentBranch.value.name}</b><br>${currentBranch.value.address}`)
    .openPopup();
    
  map.setView([currentBranch.value.lat, currentBranch.value.lng], 16, { animate: true });
};

const updateMapLocation = (branch) => {
  selectedBranchId.value = branch.id;
  updateBranchMarkerOnly();
};

const calculateRouteFromCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert('Tu navegador no soporta geolocalización');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      if (!map) return;

      if (routingControl) {
        map.removeControl(routingControl);
      }

      routingControl = L.Routing.control({
        waypoints: [
          L.latLng(userLat, userLng),
          L.latLng(currentBranch.value.lat, currentBranch.value.lng)
        ],
        routeWhileDragging: false,
        language: 'es',
        createMarker: (i, waypoint, n) => {
          const iconHTML = i === 0 
            ? `<div class="marker-pin user-loc"></div>` 
            : `<div class="marker-pin"></div>`;
          const customIcon = L.divIcon({
            className: 'custom-map-marker',
            html: iconHTML,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          });
          return L.marker(waypoint.latLng, { icon: customIcon });
        },
        lineOptions: {
          styles: [{ color: '#3b82f6', opacity: 0.8, weight: 5 }]
        },
        show: true,
        fitSelectedRoutes: true
      }).addTo(map);

      hasActiveRoute.value = true;
      showInstructions.value = true;
    },
    (error) => {
      console.error(error);
      alert('No se pudo obtener tu ubicación actual. Revisa los permisos del navegador.');
    },
    { enableHighAccuracy: true }
  );
};

const toggleInstructions = () => {
  showInstructions.value = !showInstructions.value;
  if (routingControl) {
    const container = routingControl.getContainer();
    if (container) {
      container.style.display = showInstructions.value ? 'block' : 'none';
    }
  }
};

const handleJoin = () => {
  showToast(`¡Te has inscrito exitosamente en la sucursal: ${currentBranch.value.name}!`);
};
const recenterMap = () => {
  if (!map) return;
  map.setView([currentBranch.value.lat, currentBranch.value.lng], 16, { animate: true });
  showToast(`Mapa centrado en: ${currentBranch.value.name}`);
};

const contactOwner = () => {
  const cleanPhone = currentBranch.value.phone.replace(/[^0-9]/g, '');
  const message = encodeURIComponent(`Hola ${currentBranch.value.manager}, me comunico desde la plataforma para consultar información sobre la sucursal ${currentBranch.value.name}.`);
  window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
};

const translations = {
  es: {
    back: 'Regresar a sedes',
    mapTitle: 'Ubicación Geográfica',
    howToGetThere: '¿Cómo llegar?',
    showSteps: 'Ver indicaciones',
    hideSteps: 'Ocultar indicaciones',
    about: 'Acerca del gimnasio',
    amenities: 'Amenidades y servicios',
    selectBranch: 'Selecciona tu sucursal',
    branchSub: 'Elige la sede donde entrenaras',
    scheduleTitle: 'Horarios Completos',
    weekdays: 'Lunes a Viernes',
    saturday: 'Sábados',
    sunday: 'Domingos',
    join: 'Inscribirme en esta sede',
    contactOwnerWhatsapp: 'Contactar por WhatsApp',
    recenter: 'Centrar sede',
    recenterMap: 'Centrar vista en el gimnasio'
  },
  en: {
    back: 'Back to gyms',
    mapTitle: 'Geographic Location',
    howToGetThere: 'Get Directions',
    showSteps: 'Show steps',
    hideSteps: 'Hide steps',
    about: 'About the gym',
    amenities: 'Amenities & Services',
    selectBranch: 'Select your branch',
    branchSub: 'Choose your training location',
    scheduleTitle: 'Full Schedule',
    weekdays: 'Monday to Friday',
    saturday: 'Saturdays',
    sunday: 'Sundays',
    join: 'Join this location',
    contactOwnerWhatsapp: 'Contact via WhatsApp',
    recenter: 'Center gym',
    recenterMap: 'Center view on gym'
  }
};

const t = (key) => {
  const table = translations[currentLang.value] || translations.es;
  return table[key] || translations.es[key] || key;
};

onMounted(() => {
  nextTick(() => {
    initMap();
  });
});

onUnmounted(() => {
  if (map) map.remove();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;700&display=swap');

.gym-detail-wrapper {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 24px;
  font-family: 'Inter', sans-serif;
  color: #f5f5f4;
  box-sizing: border-box;
  background: var(--bg-custom, var(--color-interfaz, #0a0a0c));
  min-height: 100vh;
  position: relative;
}

.back-btn {
 background: var(--color-botones, #1c4fd6); 
  color: var(--color-texto-botones, #ffffff); 
  border: none; 
  padding: 8px 16px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
  transition: all 0.2s;
}
.back-btn:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }

.recenter-map-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 401;
  background: rgba(10, 10, 12, 0.85);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  transition: all 0.2s;
}

.recenter-map-btn:hover {
  background: rgba(59, 130, 246, 0.25);
  border-color: rgba(59, 130, 246, 0.5);
  color: #60a5fa;
}

.gym-hero-card {
  position: relative;
  width: 100%;
  min-height: 220px;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  padding: 24px;
  box-sizing: border-box;
  box-shadow: 0 15px 35px rgba(0,0,0,0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 24px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: brightness(0.6);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 20%, rgba(10, 10, 12, 0.95) 100%);
}

.hero-content-flex {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.gym-logo-box {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: #141418;
  flex-shrink: 0;
  box-shadow: 0 8px 20px rgba(0,0,0,0.6);
}

.gym-logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-texts {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.badge {
  background: #3b82f6;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  width: fit-content;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.hero-texts h1 {
  margin: 0;
  font-family: 'Oswald', sans-serif;
  font-size: 2rem;
  color: #fff;
  letter-spacing: 0.5px;
  line-height: 1.1;
  word-break: break-word;
}

.hero-address {
  margin: 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.75);
  display: flex;
  align-items: center;
  gap: 6px;
  word-break: break-word;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
}

.left-column, .right-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.panel-box {
  background: var(--bg-cards, #121212);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 20px;
  box-sizing: border-box;
}

.panel-box h3 {
  margin: 0 0 12px 0;
  font-family: 'Oswald', sans-serif;
  font-size: 1.1rem;
  color: #fff;
  letter-spacing: 0.5px;
}

.panel-box p {
  margin: 0;
  font-size: 0.86rem;
  color: rgba(245, 245, 244, 0.7);
  line-height: 1.6;
}

.map-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
.panel-header h3 { margin: 0; }

.map-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.route-gps-btn {
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.4);
  color: #60a5fa;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.route-gps-btn:hover {
  background: rgba(59, 130, 246, 0.25);
  color: #fff;
}

.toggle-instructions-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #f5f5f4;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.toggle-instructions-btn:hover {
  background: rgba(255, 255, 255, 0.12);
}

.map-container-inner {
  position: relative;
  width: 100%;
  height: 320px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.map-canvas {
  width: 100%;
  height: 100%;
  z-index: 1;
}

.map-watermark-overlay {
  position: absolute;
  bottom: 12px;
  left: 12px;
  z-index: 400;
  background: rgba(10, 10, 12, 0.85);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
  pointer-events: none;
}
.watermark-text {
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Oswald', sans-serif;
  letter-spacing: 0.5px;
}

:deep(.leaflet-routing-container) {
  background: #141418 !important;
  color: #f5f5f4 !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  border-radius: 12px !important;
  padding: 12px !important;
  font-family: 'Inter', sans-serif !important;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5) !important;
  max-height: 200px;
  overflow-y: auto;
}
:deep(.leaflet-routing-container h2), :deep(.leaflet-routing-container h3) {
  color: #fff !important;
  font-family: 'Oswald', sans-serif !important;
}
:deep(.leaflet-routing-alt) {
  background: transparent !important;
  color: rgba(245, 245, 244, 0.8) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
}
:deep(.leaflet-routing-alt table) {
  color: #fff !important;
}

:deep(.custom-map-marker) {
  background: transparent;
  border: none;
}
:deep(.marker-pin) {
  width: 24px;
  height: 24px;
  background: #3b82f6;
  border: 3px solid #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.8);
  animation: marker-pulse 2s infinite;
}
:deep(.marker-pin.user-loc) {
  background: #10b981;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.8);
}
@keyframes marker-pulse {
  0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
  100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}

.headinadmin-card {
  background: var(--bg-cards, #121212);
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
}

.headinadmin-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.admin-icon-wrapper {
  width: 36px;
  height: 36px;
  background: rgba(59, 130, 246, 0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  flex-shrink: 0;
}

.admin-tag {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #3b82f6;
  letter-spacing: 0.5px;
}

.headinadmin-header h4 {
  margin: 0;
  font-size: 0.92rem;
  font-family: 'Oswald', sans-serif;
  color: #fff;
  word-break: break-word;
}

.admin-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 10px;
}

.admin-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  gap: 10px;
}
.admin-row span { color: rgba(245, 245, 244, 0.55); flex-shrink: 0; }
.admin-row strong { color: #fff; font-weight: 600; text-align: right; word-break: break-all; }

.whatsapp-contact-btn {
  margin-top: 10px;
  width: 100%;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #34d399;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.whatsapp-contact-btn:hover {
  background: rgba(16, 185, 129, 0.25);
  color: #fff;
}

.info-split-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.amenities-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.amenity-item {
  font-size: 0.82rem;
  color: rgba(245, 245, 244, 0.85);
  background: rgba(255, 255, 255, 0.03);
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.box-sub {
  margin: -8px 0 12px 0 !important;
  font-size: 0.785rem;
  color: rgba(245, 245, 244, 0.5);
}

.branches-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.branch-card-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.branch-card-item:hover { background: rgba(255, 255, 255, 0.06); }
.branch-card-item.selected { background: rgba(59, 130, 246, 0.12); border-color: #3b82f6; }

.radio-indicator {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.branch-card-item.selected .radio-indicator { border-color: #3b82f6; }
.radio-dot { width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; }

.branch-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.branch-info strong { font-size: 0.85rem; font-weight: 700; color: #fff; font-family: 'Oswald', sans-serif; }
.branch-info span { font-size: 0.72rem; color: rgba(245, 245, 244, 0.55); word-break: break-word; }

.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.schedule-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  font-size: 0.82rem;
  border: 1px solid rgba(255, 255, 255, 0.04);
  gap: 10px;
}
.schedule-item .day { color: rgba(245, 245, 244, 0.6); flex-shrink: 0; }
.schedule-item .time { color: #fff; font-weight: 600; font-family: 'Oswald', sans-serif; text-align: right; }

.cta-main-btn {
  width: 100%;
   background: var(--color-botones, #1c4fd6); 
  color: var(--color-texto-botones, #ffffff); 
  border: none;
  padding: 14px;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
  letter-spacing: 0.5px;
}
.cta-main-btn:hover { opacity: 0.92; transform: translateY(-1px); }

/* ESTILOS DE LA NOTIFICACIÓN FLOTANTE (TOAST) */
.custom-toast-notification {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  background: #10b981;
  color: #fff;
  padding: 12px 18px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
  font-size: 0.88rem;
  font-weight: 600;
  max-width: 400px;
}

.toast-icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.toast-message {
  flex-grow: 1;
  line-height: 1.4;
  word-break: break-word;
}

.toast-close-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  transition: color 0.2s;
}
.toast-close-btn:hover {
  color: #fff;
}

.toast-fade-enter-active, .toast-fade-leave-active {
  transition: all 0.3s ease;
}
.toast-fade-enter-from, .toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media(max-width: 768px) {
  .gym-detail-wrapper {
    padding: 12px;
  }

  .gym-hero-card {
    padding: 16px;
    min-height: auto;
  }

  .hero-content-flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .gym-logo-box {
    width: 60px;
    height: 60px;
  }

  .hero-texts h1 {
    font-size: 1.5rem;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .info-split-row {
    grid-template-columns: 1fr;
  }

  .panel-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .map-actions {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .route-gps-btn, .toggle-instructions-btn {
    width: 100%;
    justify-content: center;
    padding: 10px 8px;
    font-size: 0.7rem;
  }

  .custom-toast-notification {
    top: 12px;
    right: 12px;
    left: 12px;
    max-width: none;
  }
}
</style>