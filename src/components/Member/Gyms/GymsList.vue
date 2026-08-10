<template>
  <HeadingAdmin :isGymOpen="isGymOpen" :billingStatus="billingStatus">
    <div class="saas-dashboard-wrapper">
      
      <main class="dashboard-main-container">
        
        <!-- HEADER DE LA SECCIÓN -->
        <div class="section-header-box">
          <div>
            <h1 class="main-heading" id="turtor1">{{ t('gymsListTitle') }}</h1>
            <p class="hero-desc">{{ t('gymsListDesc') }}</p>
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
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2"></polygon><line x1="8" y1="18" x2="8" y2="2"></line><line x1="16" y1="22" x2="16" y2="6"></line></svg>
                    Radar 3D Activo
                  </div>
                </div>
              </div>

              <div class="gym-item-content">
                <div class="card-title-row">
                  <h3>{{ registeredGym.name }}</h3>
                  <span class="badge-pill main-badge">Base Principal</span>
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
                    <span>Afluencia en vivo</span>
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

        <!-- SECCIÓN 2: GIMNASIOS EN CIUDAD VALLES -->
        <div class="category-section" id="turtor4">
          <div class="category-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <h2>{{ t('localGymsTitle') }}</h2>
          </div>

          <div class="gyms-grid-container">
            <router-link 
              v-for="gym in localGyms" 
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
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2"></polygon><line x1="8" y1="18" x2="8" y2="2"></line><line x1="16" y1="22" x2="16" y2="6"></line></svg>
                    Vista 3D Interactiva
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
                    <span>Afluencia en vivo</span>
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

        <!-- SECCIÓN 3: GIMNASIOS FUERA DE CIUDAD VALLES (BLOQUEADOS / REQUIEREN MENSUALIDAD PLUS) -->
        <div class="category-section" id="turtor5">
          <div class="category-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            <h2>{{ t('nationalGymsTitle') }}</h2>
          </div>

          <div class="gyms-grid-container">
            <div 
              v-for="gym in nationalGyms" 
              :key="gym.id" 
              class="glass-card gym-item-card locked-gym-card"
            >
              <!-- Overlay de Bloqueo por Membresía Plus -->
              <div class="membership-lock-overlay">
                <div class="lock-icon-badge">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <span class="lock-title">Exclusivo Membresía Plus</span>
                <p class="lock-desc">Entrena en cualquier ciudad del país y desbloquea mapas 3D avanzados actualizando tu plan.</p>
                <button class="btn-unlock-action" @click="openMembershipModal">
                  Ver Planes y Actualizar
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

      </main>

      <!-- MODAL DE MEMBRESÍAS / PAGOS EXTERNO -->
      <transition name="pop">
        <div v-if="showMembershipModal" class="modal-wrapper" @click.self="closeMembershipModal">
          <UpgradeMembershipModal @close="closeMembershipModal" />
        </div>
      </transition>

    </div>
  </HeadingAdmin>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
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
    coords: 'LAT: 21.9500° N / LON: 99.0000° W'
  }
]);

const nationalGyms = ref([
  {
    id: 4,
    name: 'IronFit CDMX Polanco (Plus)',
    address: 'Campos Elíseos #204, Polanco',
    schedule: '24 Horas',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    name: 'IronFit Monterrey San Pedro (Plus)',
    address: 'Av. Vasconcelos #400, Del Valle',
    schedule: '24 Horas',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 8,
    name: 'IronFit Guadalajara Andares (Plus)',
    address: 'Boulevard Puerta de Hierro #4965',
    schedule: '24 Horas',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 9,
    name: 'IronFit Querétaro Antea (Plus)',
    address: 'Carretera Pista Panamericana #10200',
    schedule: '24 Horas',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
  }
]);

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
  gap: 44px;
}

.section-header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 24px;
}

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
  gap: 12px;
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
}

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

/* Modales y Drawer */
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

/* --- MAPA 3D HOLOGRÁFICO --- */
.map-3d-container {
  width: 100%;
  height: 220px;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 20px;
  position: relative;
  border: 1px solid rgba(59, 130, 246, 0.4);
  box-shadow: inset 0 0 25px rgba(59, 130, 246, 0.25), 0 10px 30px rgba(0,0,0,0.5);
}

.map-3d-viewport {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, #111827 0%, #06090f 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: perspective(700px) rotateX(20deg);
}

.isometric-grid-bg {
  position: absolute;
  inset: -50%;
  background-image: 
    linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px);
  background-size: 28px 28px;
  transform: rotate(45deg);
  animation: gridMove 15s linear infinite;
}

@keyframes gridMove {
  0% { background-position: 0 0; }
  100% { background-position: 56px 56px; }
}

.iso-building {
  position: absolute;
  background: rgba(30, 58, 138, 0.4);
  border: 1px solid rgba(59, 130, 246, 0.5);
  border-radius: 4px;
}

.building-1 { width: 45px; height: 70px; top: 25px; left: 35px; transform: skewX(-15deg); }
.building-2 { width: 60px; height: 50px; bottom: 20px; right: 40px; transform: skewX(15deg); }
.building-3 { width: 35px; height: 80px; top: 15px; right: 70px; transform: skewY(-10deg); opacity: 0.7; }

.map-marker-pin {
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pin-core {
  width: 40px;
  height: 40px;
  background: var(--color-highlight, #3b82f6);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 25px #3b82f6;
  border: 2px solid #fff;
}

.pin-pulse {
  position: absolute;
  width: 70px;
  height: 70px;
  border: 2px solid #3b82f6;
  border-radius: 50%;
  animation: radarPulse 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
}

@keyframes radarPulse {
  0% { transform: scale(0.4); opacity: 1; }
  100% { transform: scale(2.2); opacity: 0; }
}

.map-hud-overlay {
  position: absolute;
  bottom: 8px; left: 8px; right: 8px;
  display: flex; justify-content: space-between;
  font-size: 0.65rem; color: #93c5fd;
  background: rgba(10, 15, 30, 0.9);
  padding: 6px 10px; border-radius: 6px; z-index: 6;
  border: 1px solid rgba(59, 130, 246, 0.3); font-family: monospace;
}

/* Drawer styles */
.drawer-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(4px); z-index: 4000;
}

.gym-drawer {
  position: fixed; top: 0; right: 0; width: 480px; max-width: 100vw; height: 100vh;
  background: var(--bg-cards, #121216); border-left: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: -15px 0 40px rgba(0, 0, 0, 0.8); z-index: 4001; display: flex; flex-direction: column; border-radius: 0;
}

.drawer-header {
  padding: 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex; justify-content: space-between; align-items: flex-start;
}

.drawer-title-wrapper { display: flex; flex-direction: column; gap: 8px; }
.drawer-title-wrapper h2 { margin: 0; font-size: 1.4rem; color: var(--color-titulos, #fff); font-family: 'Oswald', sans-serif; }

.close-btn {
  background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center;
  justify-content: center; color: var(--color-texto-general, #fff); cursor: pointer; transition: background 0.2s;
}
.close-btn:hover { background: rgba(255, 255, 255, 0.15); }

.drawer-body {
  padding: 24px; flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 24px;
}

.drawer-image-section { display: flex; flex-direction: column; gap: 10px; }
.drawer-image-section h4, .info-block h4 { margin: 0 0 10px 0; font-family: 'Oswald', sans-serif; font-size: 1.1rem; color: var(--color-titulos, #fff); }
.drawer-image { width: 100%; height: 180px; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); }
.drawer-image img { width: 100%; height: 100%; object-fit: cover; }

.info-block { display: flex; flex-direction: column; gap: 8px; }
.amenities-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.amenity-chip { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; color: rgba(245,245,244,0.8); display: flex; align-items: center; gap: 6px; }
.amenity-chip svg { color: var(--color-highlight, #3b82f6); }

.capacity-bar-container { background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 8px; }
.capacity-info { display: flex; justify-content: space-between; font-size: 0.8rem; color: rgba(245,245,244,0.7); }
.capacity-percentage { font-weight: 600; color: #fff; }

.drawer-footer { padding: 20px 24px; border-top: 1px solid rgba(255,255,255,0.08); background: rgba(0,0,0,0.2); }
.btn-primary { width: 100%; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #fff; border: none; padding: 14px; border-radius: 12px; font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 16px rgba(59,130,246,0.4); }
.btn-primary:hover { opacity: 0.95; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(59,130,246,0.6); }

/* RESPONSIVE MEDIA QUERIES PARA MÓVILES */
@media (max-width: 768px) {
  .dashboard-main-container {
    padding: 20px 16px;
    gap: 32px;
  }
  .main-heading {
    font-size: 1.6rem;
    letter-spacing: -0.5px;
  }
  .hero-desc {
    font-size: 0.85rem;
  }
  .gyms-grid-container {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .gym-drawer {
    width: 100vw;
    height: 100vh;
  }
  .drawer-header {
    padding: 16px 20px;
  }
  .drawer-body {
    padding: 16px 20px;
  }
  .drawer-footer {
    padding: 16px 20px;
  }
  .category-header h2 {
    font-size: 1.2rem;
  }
}
</style>