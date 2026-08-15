<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import HeadingAdmin from '../HeadingMember.vue';
import UpgradeMembershipModal from '../Modals/UpgradeMembershipModal.vue';

const router = useRouter();
const currentLang = ref(localStorage.getItem('member-idioma') || 'es');

const registeredGym = ref({
  id: 1,
  name: 'IronFit Valles Centro',
  address: 'Blvd. Carlos Lasso #120, Centro',
  schedule: 'Lun - Sáb: 6:00 AM - 10:00 PM',
  phone: '+52 481 382 0011',
  isOpen: true,
  occupancy: 45,
  image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
  ciudad: 'Ciudad Valles',
  estado: 'San Luis Potosí',
  coords: 'LAT: 21.9902° N / LON: 99.0301° W'
});

const localGyms = ref([
  {
    id: 2,
    name: 'IronFit Norte - Plaza San José',
    address: 'Carretera Mante #450, Local 4',
    schedule: 'Lun - Dom: 5:00 AM - 11:00 PM',
    phone: '+52 481 382 9922',
    isOpen: true,
    occupancy: 82,
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
    ciudad: 'Ciudad Valles',
    estado: 'San Luis Potosí',
    coords: 'LAT: 22.0050° N / LON: 99.0210° W'
  },
  {
    id: 3,
    name: 'IronFit Poniente',
    address: 'Av. Pedro Antonio Santos #800',
    schedule: 'Lun - Sáb: 6:00 AM - 10:00 PM',
    phone: '+52 481 383 4455',
    isOpen: false,
    occupancy: 15,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    ciudad: 'Ciudad Valles',
    estado: 'San Luis Potosí',
    coords: 'LAT: 21.9850° N / LON: 99.0450° W'
  },
  {
    id: 6,
    name: 'IronFit Sur - Plaza Tangamanga',
    address: 'Blvd. México-Laredo #2200',
    schedule: 'Lun - Dom: 6:00 AM - 11:00 PM',
    phone: '+52 481 384 1234',
    isOpen: true,
    occupancy: 60,
    image: 'https://images.unsplash.com/photo-1571902943202-507f2718ea0d?auto=format&fit=crop&w=800&q=80',
    ciudad: 'Ciudad Valles',
    estado: 'San Luis Potosí',
    coords: 'LAT: 21.9700° N / LON: 99.0150° W'
  },
  {
    id: 7,
    name: 'IronFit Ébano Express',
    address: 'Av. Juárez #115, Col. Obrera',
    schedule: 'Lun - Sáb: 7:00 AM - 9:00 PM',
    phone: '+52 481 385 6789',
    isOpen: true,
    occupancy: 30,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    ciudad: 'Ciudad Valles',
    estado: 'San Luis Potosí',
    coords: 'LAT: 21.9500° N / LON: 99.0000° W'
  }
]);

const nationalGyms = ref([
  {
    id: 4,
    name: 'IronFit CDMX Polanco (Plus)',
    address: 'Campos Elíseos #204, Polanco',
    schedule: '24 Horas',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
    ciudad: 'Polanco',
    estado: 'Ciudad de México'
  },
  {
    id: 5,
    name: 'IronFit Monterrey San Pedro (Plus)',
    address: 'Av. Vasconcelos #400, Del Valle',
    schedule: '24 Horas',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
    ciudad: 'San Pedro Garza García',
    estado: 'Nuevo León'
  },
  {
    id: 8,
    name: 'IronFit Guadalajara Andares (Plus)',
    address: 'Boulevard Puerta de Hierro #4965',
    schedule: '24 Horas',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
    ciudad: 'Zapopan',
    estado: 'Jalisco'
  },
  {
    id: 9,
    name: 'IronFit Querétaro Antea (Plus)',
    address: 'Carretera Pista Panamericana #10200',
    schedule: '24 Horas',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    ciudad: 'Querétaro',
    estado: 'Querétaro'
  }
]);

// Abreviaciones cortas para las insignias de ubicación sobre las fotos,
// donde el espacio es reducido (sobre todo en móvil).
const estadoAbrevMap = {
  'San Luis Potosí': 'SLP',
  'Ciudad de México': 'CDMX',
  'Nuevo León': 'NL',
  'Jalisco': 'JAL',
  'Querétaro': 'QRO'
};
const abreviarEstado = (estado) => estadoAbrevMap[estado] || estado;

// Agrupa la red nacional por estado, para que la sección "fuera de Ciudad
// Valles" se sienta como un verdadero directorio nacional en vez de una
// sola cuadrícula plana.
const nationalGymsByState = computed(() => {
  const groups = {};
  for (const gym of nationalGyms.value) {
    if (!groups[gym.estado]) groups[gym.estado] = [];
    groups[gym.estado].push(gym);
  }
  return groups;
});

const statesCount = computed(() => Object.keys(nationalGymsByState.value).length);

// Buscador simple por nombre, ciudad, estado o dirección.
const searchQuery = ref('');
const normalize = (str) => (str || '').toString().toLowerCase();

const matchesQuery = (gym, q) =>
  normalize(gym.name).includes(q) ||
  normalize(gym.ciudad).includes(q) ||
  normalize(gym.estado).includes(q) ||
  normalize(gym.address).includes(q);

const filteredLocalGyms = computed(() => {
  const q = normalize(searchQuery.value);
  if (!q) return localGyms.value;
  return localGyms.value.filter((gym) => matchesQuery(gym, q));
});

const filteredNationalByState = computed(() => {
  const q = normalize(searchQuery.value);
  if (!q) return nationalGymsByState.value;
  const result = {};
  for (const [estado, gyms] of Object.entries(nationalGymsByState.value)) {
    const matches = gyms.filter((gym) => matchesQuery(gym, q));
    if (matches.length) result[estado] = matches;
  }
  return result;
});

const hasNoResults = computed(() => {
  if (!searchQuery.value.trim()) return false;
  return filteredLocalGyms.value.length === 0 && Object.keys(filteredNationalByState.value).length === 0;
});

const isGymOpen = ref(true);
const billingStatus = ref('active');
const showMembershipModal = ref(false);

const openMembershipModal = () => {
  showMembershipModal.value = true;
};

const closeMembershipModal = () => {
  showMembershipModal.value = false;
};

const traducciones = {
  es: {
    gymsListTitle: 'Red de Sucursales',
    gymsListDesc: 'Gestiona tu base principal, descubre puntos cercanos para entrenar o expande tu acceso a nivel nacional.',
    statusOpen: 'Abierto',
    statusClosed: 'Cerrado',
    registeredGymTitle: 'Tu Base de Entrenamiento Actual',
    localGymsTitle: 'Sucursales Disponibles en Ciudad Valles',
    nationalGymsTitle: 'Red Nacional (Acceso Plus Requerido)',
    locationInfo: 'Ubicación y Contacto',
    amenities: 'Equipamiento y Servicios',
    currentCapacity: 'Estado del Aforo',
    occupancyLevel: 'Ocupación Actual',
    gymPhotoLabel: 'Fotografía de la Instalación',
    mainBaseBadge: 'Base Principal',
    liveOccupancyLabel: 'Afluencia en vivo',
    lockTitle: 'Exclusivo Membresía Plus',
    lockDesc: 'Entrena en cualquier ciudad del país y desbloquea esta sede actualizando tu plan.',
    lockBtn: 'Ver Planes y Actualizar',
    statsLocalLabel: 'sedes en Ciudad Valles',
    statsStatesLabel: 'estados con cobertura Plus',
    searchPlaceholder: 'Busca por gimnasio, ciudad o estado...',
    noResultsTitle: 'No encontramos sedes con ese criterio',
    noResultsDesc: 'Intenta buscar por otra ciudad, estado o el nombre del gimnasio.',
    tutorialIds: {
      title: 'gestion-sedes-title',
      registeredGymSection: 'sec-sede-registrada',
      registeredGymCard: 'card-sede-principal',
      localGymsSection: 'sec-ciudad-valles',
      nationalGymsSection: 'sec-nacionales',
      gymDrawer: 'drawer-detalle-sede',
      btnSelectMain: 'btn-establecer-sede'
    }
  },
  en: {
    gymsListTitle: 'Branch Network',
    gymsListDesc: 'Manage your home gym, discover nearby training spots, or expand your access nationwide.',
    statusOpen: 'Open',
    statusClosed: 'Closed',
    registeredGymTitle: 'Your Current Home Gym',
    localGymsTitle: 'Available Branches in Ciudad Valles',
    nationalGymsTitle: 'National Network (Plus Access Required)',
    locationInfo: 'Location & Contact',
    amenities: 'Equipment & Amenities',
    currentCapacity: 'Capacity Status',
    occupancyLevel: 'Current Occupancy',
    gymPhotoLabel: 'Facility Photograph',
    mainBaseBadge: 'Home Base',
    liveOccupancyLabel: 'Live occupancy',
    lockTitle: 'Plus Membership Exclusive',
    lockDesc: 'Train in any city nationwide and unlock this branch by upgrading your plan.',
    lockBtn: 'View Plans & Upgrade',
    statsLocalLabel: 'branches in Ciudad Valles',
    statsStatesLabel: 'states with Plus coverage',
    searchPlaceholder: 'Search by gym, city or state...',
    noResultsTitle: "We couldn't find any branches matching that",
    noResultsDesc: 'Try searching a different city, state, or gym name.',
    tutorialIds: {
      title: 'gestion-sedes-title',
      registeredGymSection: 'sec-sede-registrada',
      registeredGymCard: 'card-sede-principal',
      localGymsSection: 'sec-ciudad-valles',
      nationalGymsSection: 'sec-nacionales',
      gymDrawer: 'drawer-detalle-sede',
      btnSelectMain: 'btn-establecer-sede'
    }
  }
};

const t = (key) => {
  const langTable = traducciones[currentLang.value] || traducciones.es;
  const fallbackTable = traducciones.es;

  if (key.includes('.')) {
    const parts = key.split('.');
    let val = langTable;
    let fallbackVal = fallbackTable;
    for (const p of parts) {
      val = val?.[p];
      fallbackVal = fallbackVal?.[p];
    }
    return val !== undefined ? val : (fallbackVal !== undefined ? fallbackVal : key);
  }

  return langTable[key] || fallbackTable[key] || key;
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
</script>


<template>
  <HeadingAdmin :isGymOpen="isGymOpen" :billingStatus="billingStatus">
    <div class="saas-dashboard-wrapper">
      
      <main class="dashboard-main-container">
        
        <!-- HEADER DE LA SECCIÓN CON BUSCADOR INTEGRADO -->
        <div class="section-header-box">
          <div class="header-text-content">
            <h1 class="main-heading" id="turtor1">{{ t('gymsListTitle') }}</h1>
            <p class="hero-desc">{{ t('gymsListDesc') }}</p>

            <div class="stats-strip">
              <div class="stat-chip">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span><strong>{{ localGyms.length + 1 }}</strong> {{ t('statsLocalLabel') }}</span>
              </div>
              <div class="stat-chip">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                <span><strong>{{ statesCount }}</strong> {{ t('statsStatesLabel') }}</span>
              </div>
            </div>
          </div>

          <!-- BUSCADOR -->
          <div class="gym-search-bar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
              type="text"
              v-model="searchQuery"
              :placeholder="t('searchPlaceholder')"
            />
            <button v-if="searchQuery" type="button" class="btn-clear-search" @click="searchQuery = ''" aria-label="Limpiar búsqueda">
              &times;
            </button>
          </div>
        </div>

        <!-- SECCIÓN 1: SEDE PRINCIPAL / REGISTRADA -->
        <div class="category-section" id="turtor2">
          <div class="category-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <h2>{{ t('registeredGymTitle') }}</h2>
          </div>
          
          <div class="gyms-grid-container">
            <router-link 
              v-if="registeredGym" 
              :to="{ name: 'member-gym-detail', params: { id: registeredGym.id } }"
              class="glass-card gym-item-card primary-registered-card" 
              id="turtor3"
              style="text-decoration: none;"
            >
              <div class="card-3d-perspective">
                <div class="gym-item-image">
                  <img :src="registeredGym.image" :alt="registeredGym.name" />
                  <div class="image-gradient-overlay"></div>
                  <span class="drawer-tag" :class="{ open: registeredGym.isOpen }">
                    <span class="pulse-dot"></span>
                    {{ registeredGym.isOpen ? t('statusOpen') : t('statusClosed') }}
                  </span>
                  <div class="map-preview-badge">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    {{ registeredGym.ciudad }}, {{ abreviarEstado(registeredGym.estado) }}
                  </div>
                </div>
              </div>

              <div class="gym-item-content">
                <div class="card-title-row">
                  <h3>{{ registeredGym.name }}</h3>
                  <span class="badge-pill main-badge">{{ t('mainBaseBadge') }}</span>
                </div>
                <p class="drawer-text-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <span>{{ registeredGym.address }}</span>
                </p>
                <p class="drawer-text-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span>{{ registeredGym.schedule }}</span>
                </p>
                
                <div class="card-mini-capacity">
                  <div class="mini-cap-info">
                    <span>{{ t('liveOccupancyLabel') }}</span>
                    <span :style="{ color: registeredGym.occupancy > 75 ? '#ef4444' : '#10b981' }">{{ registeredGym.occupancy }}%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: registeredGym.occupancy + '%', background: registeredGym.occupancy > 75 ? '#ef4444' : '#3b82f6' }"></div>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- SECCIÓN 2: GIMNASIOS LOCALES -->
        <div class="category-section" id="turtor4">
          <div class="category-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <h2>{{ t('localGymsTitle') }}</h2>
          </div>

          <div v-if="filteredLocalGyms.length" class="gyms-grid-container">
            <router-link 
              v-for="gym in filteredLocalGyms" 
              :key="gym.id" 
              :to="{ name: 'member-gym-detail', params: { id: gym.id } }"
              class="glass-card gym-item-card"
              style="text-decoration: none;"
            >
              <div class="card-3d-perspective">
                <div class="gym-item-image">
                  <img :src="gym.image" :alt="gym.name" />
                  <div class="image-gradient-overlay"></div>
                  <span class="drawer-tag" :class="{ open: gym.isOpen }">
                    <span class="pulse-dot"></span>
                    {{ gym.isOpen ? t('statusOpen') : t('statusClosed') }}
                  </span>
                  <div class="map-preview-badge">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    {{ gym.ciudad }}, {{ abreviarEstado(gym.estado) }}
                  </div>
                </div>
              </div>

              <div class="gym-item-content">
                <h3>{{ gym.name }}</h3>
                <p class="drawer-text-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <span>{{ gym.address }}</span>
                </p>
                <p class="drawer-text-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span>{{ gym.schedule }}</span>
                </p>
                
                <div class="card-mini-capacity">
                  <div class="mini-cap-info">
                    <span>{{ t('liveOccupancyLabel') }}</span>
                    <span :style="{ color: gym.occupancy > 75 ? '#ef4444' : '#10b981' }">{{ gym.occupancy }}%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: gym.occupancy + '%', background: gym.occupancy > 75 ? '#ef4444' : '#3b82f6' }"></div>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- SECCIÓN 3: GIMNASIOS NACIONALES -->
        <div class="category-section" id="turtor5">
          <div class="category-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            <h2>{{ t('nationalGymsTitle') }}</h2>
          </div>

          <div
            v-for="(gyms, estado) in filteredNationalByState"
            :key="estado"
            class="state-subsection"
          >
            <h3 class="state-subheading">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              {{ estado }}
              <span class="state-count-pill">{{ gyms.length }}</span>
            </h3>

            <div class="gyms-grid-container">
              <div 
                v-for="gym in gyms" 
                :key="gym.id" 
                class="glass-card gym-item-card locked-gym-card"
              >
                <div class="membership-lock-overlay">
                  <div class="lock-icon-badge">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                  <span class="lock-title">{{ t('lockTitle') }}</span>
                  <p class="lock-desc">{{ t('lockDesc') }}</p>
                  <button class="btn-unlock-action" @click="openMembershipModal">
                    {{ t('lockBtn') }}
                  </button>
                </div>

                <div class="card-3d-perspective blurred-content">
                  <div class="gym-item-image">
                    <img :src="gym.image" :alt="gym.name" />
                    <div class="image-gradient-overlay"></div>
                  </div>
                </div>

                <div class="gym-item-content blurred-content">
                  <h3>{{ gym.name }}</h3>
                  <p class="drawer-text-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span>{{ gym.address }}</span>
                  </p>
                  <p class="drawer-text-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <span>{{ gym.schedule }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ESTADO VACÍO DE BÚSQUEDA -->
        <div v-if="hasNoResults" class="no-results-box">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <h3>{{ t('noResultsTitle') }}</h3>
          <p>{{ t('noResultsDesc') }}</p>
        </div>

      </main>

      <!-- MODAL DE MEMBRESÍAS -->
      <transition name="pop">
        <div v-if="showMembershipModal" class="modal-wrapper" @click.self="closeMembershipModal">
          <UpgradeMembershipModal @close="closeMembershipModal" />
        </div>
      </transition>

    </div>
  </HeadingAdmin>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;700&display=swap');

.saas-dashboard-wrapper {
  background: var(--bg-custom, var(--color-interfaz, #0a0a0c));
  min-height: calc(100vh - 65px);
  color: var(--color-texto-general, #f5f5f4);
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  position: relative;
}

.dashboard-main-container {
  flex: 1;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.section-header-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 24px;
}

.header-text-content {
  flex: 1;
  min-width: 280px;
}

/* Franja de estadísticas rápidas */
.stats-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.stat-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  padding: 7px 14px;
  font-size: 0.8rem;
  color: rgba(245, 245, 244, 0.75);
}
.stat-chip svg { color: var(--color-highlight, #3b82f6); flex-shrink: 0; }
.stat-chip strong { color: #fff; font-weight: 700; }

/* Buscador principal integrado en el header */
.gym-search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-cards, #121212);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--app-border-radius, 14px);
  padding: 10px 16px;
  width: 340px;
  max-width: 100%;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.gym-search-bar:focus-within {
  border-color: rgba(59, 130, 246, 0.6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
.gym-search-bar svg { color: #94a3b8; flex-shrink: 0; }
.gym-search-bar input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  padding: 4px 0;
}
.gym-search-bar input:focus { outline: none; }
.gym-search-bar input::placeholder { color: rgba(245, 245, 244, 0.4); }
.btn-clear-search {
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #fff;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s;
}
.btn-clear-search:hover { background: rgba(255, 255, 255, 0.16); }

.category-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-titulos, #fff);
}

.category-header h2 {
  font-family: 'Oswald', sans-serif;
  font-size: 1.4rem;
  margin: 0;
  letter-spacing: 0.5px;
  font-weight: 700;
}

.category-header svg {
  color: var(--color-highlight, #3b82f6);
}

/* Subsecciones por estado dentro de la red nacional */
.state-subsection {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.state-subsection + .state-subsection {
  margin-top: 8px;
  padding-top: 24px;
  border-top: 1px dashed rgba(255, 255, 255, 0.08);
}

.state-subheading {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-family: 'Oswald', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: rgba(245, 245, 244, 0.85);
  text-transform: uppercase;
}
.state-subheading svg { color: var(--color-highlight, #3b82f6); flex-shrink: 0; }
.state-count-pill {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(245, 245, 244, 0.7);
  border-radius: 50px;
  padding: 1px 9px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: none;
  letter-spacing: 0;
}

.gyms-grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 28px;
}

.glass-card {
  background: var(--bg-cards, #121212);
  border-radius: var(--app-border-radius, 20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 22px;
  box-shadow: 0 16px 32px rgba(0,0,0,0.4);
  display: flex;
  flex-direction: column;
}

.gym-item-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.gym-item-card:hover {
  transform: translateY(-6px);
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 24px 48px rgba(59, 130, 246, 0.12), 0 12px 24px rgba(0, 0, 0, 0.6);
}

.primary-registered-card {
  background: var(--bg-cards, #121212);
  border-radius: var(--app-border-radius, 20px);
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15);
}

.card-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}

.card-title-row h3 {
  margin: 0;
  font-family: 'Oswald', sans-serif;
  font-size: 1.3rem;
  color: var(--color-titulos, #fff);
}

.badge-pill {
  background: var(--color-botones, #1c4fd6); 
  color: var(--color-texto-botones, #ffffff); 
  border: 1px solid rgba(59, 130, 246, 0.4);
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  flex-shrink: 0;
}

.locked-gym-card {
  position: relative;
}

.blurred-content {
  filter: blur(6px);
  user-select: none;
  pointer-events: none;
  opacity: 0.35;
}

.membership-lock-overlay {
  position: absolute;
  inset: 0;
  background: var(--bg-cards, #121212);
  border-radius: var(--app-border-radius, 20px);
  backdrop-filter: blur(6px);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  gap: 12px;
}

.lock-icon-badge {
  width: 52px;
  height: 52px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #ef4444;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 24px rgba(239, 68, 68, 0.2);
}

.lock-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  font-family: 'Oswald', sans-serif;
  letter-spacing: 0.5px;
}

.lock-desc {
  font-size: 0.8rem;
  color: rgba(245, 245, 244, 0.65);
  margin: 0;
  line-height: 1.5;
  max-width: 280px;
}

.btn-unlock-action {
  margin-top: 8px;
  background: var(--color-botones, #1c4fd6); 
  color: var(--color-texto-botones, #ffffff); 
  border: none;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
}

.btn-unlock-action:hover {
  opacity: 0.95;
  transform: scale(1.04);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
}

.card-3d-perspective {
  perspective: 1000px;
}

.gym-item-image {
  width: 100%;
  height: 200px;
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  margin-bottom: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: transform 0.4s ease;
}

.gym-item-card:hover .gym-item-image {
  transform: scale(1.02);
}

.gym-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%);
}

.drawer-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(239, 68, 68, 0.92);
  color: #fff;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.drawer-tag.open {
  background: rgba(16, 185, 129, 0.92);
}

.pulse-dot {
  width: 6px;
  height: 6px;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 0 8px #fff;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
}

.map-preview-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.75);
  border: 1px solid rgba(59, 130, 246, 0.4);
  color: #60a5fa;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 2;
  max-width: calc(100% - 24px);
}
.map-preview-badge svg { flex-shrink: 0; }

.gym-item-content h3 {
  margin: 0 0 12px 0;
  font-family: 'Oswald', sans-serif;
  font-size: 1.25rem;
  color: var(--color-titulos, #fff);
}

.drawer-text-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: rgba(245, 245, 244, 0.7);
  margin: 8px 0;
  line-height: 1.4;
  word-break: break-word;
}

.drawer-text-item svg {
  flex-shrink: 0;
  color: var(--color-highlight, #3b82f6);
}

.card-mini-capacity {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.mini-cap-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: rgba(245, 245, 244, 0.65);
  margin-bottom: 8px;
  font-weight: 600;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}

.main-heading {
  font-family: 'Archivo Black', sans-serif;
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0;
  color: var(--color-titulos, #ffffff);
  letter-spacing: -1px;
}

.hero-desc {
  font-size: 0.95rem;
  color: var(--color-texto-general, rgba(245, 245, 244, 0.6));
  margin: 8px 0 0 0;
  font-weight: 500;
  max-width: 600px;
}

.no-results-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  padding: 48px 24px;
  color: rgba(245, 245, 244, 0.5);
  border: 1.5px dashed rgba(255, 255, 255, 0.1);
  border-radius: var(--app-border-radius, 20px);
}
.no-results-box svg { opacity: 0.5; }
.no-results-box h3 {
  margin: 4px 0 0;
  font-family: 'Oswald', sans-serif;
  font-size: 1.1rem;
  color: rgba(245, 245, 244, 0.8);
}
.no-results-box p {
  margin: 0;
  font-size: 0.85rem;
  max-width: 320px;
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

.pop-enter-active, .pop-leave-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(0.95); }

@media (max-width: 768px) {
  .dashboard-main-container {
    padding: 20px 16px;
    gap: 28px;
  }
  .main-heading {
    font-size: 1.6rem;
    letter-spacing: -0.5px;
  }
  .hero-desc {
    font-size: 0.85rem;
  }
  .stats-strip {
    gap: 8px;
  }
  .stat-chip {
    font-size: 0.75rem;
    padding: 6px 12px;
  }
  .gym-search-bar {
    width: 100%;
    padding: 10px 14px;
  }
  .gyms-grid-container {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .gym-item-image {
    height: 170px;
    margin-bottom: 14px;
  }
  .glass-card {
    padding: 16px;
  }
  .card-title-row h3,
  .gym-item-content h3 {
    font-size: 1.1rem;
  }
  .category-header h2 {
    font-size: 1.2rem;
  }
  .state-subheading {
    font-size: 0.9rem;
  }
  .lock-desc {
    max-width: 100%;
  }
  .map-preview-badge {
    font-size: 0.65rem;
    padding: 4px 8px;
  }
}
</style>