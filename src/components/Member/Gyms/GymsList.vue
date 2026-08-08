<template>
  <HeadingAdmin :isGymOpen="isGymOpen" :billingStatus="billingStatus">
    <div class="saas-dashboard-wrapper">
      
      <main class="dashboard-main-container">
        
        <!-- HEADER DE LA SECCIÓN -->
        <div class="section-header-box">
          <div>
            <h1 class="main-heading">{{ t.gymsListTitle || 'Gestión de Sedes 3D' }}</h1>
            <p class="hero-desc">{{ t.gymsListDesc || 'Explora las sucursales con vista interactiva, radar y mapas en perspectiva.' }}</p>
          </div>
          <button class="btn-primary-action" @click="activeModal = 'add-gym'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            {{ t.addGym || 'Nueva Sede' }}
          </button>
        </div>

        <!-- GRID DE SEDES CON ESTILO ULTRAMODERNO -->
        <div class="gyms-grid-container">
          <div 
            v-for="gym in gymsList" 
            :key="gym.id" 
            class="glass-card gym-item-card" 
            @click="openGymDetail(gym)"
          >
            <!-- Contenedor con efecto 3D al hacer hover -->
            <div class="card-3d-perspective">
              <div class="gym-item-image">
                <img :src="gym.image" :alt="gym.name" />
                <div class="image-gradient-overlay"></div>
                <span class="drawer-tag" :class="{ open: gym.isOpen }">
                  <span class="pulse-dot"></span>
                  {{ gym.isOpen ? t.statusOpen || 'Abierto' : t.statusClosed || 'Cerrado' }}
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
                {{ gym.address }}
              </p>
              <p class="drawer-text-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                {{ gym.schedule }}
              </p>
              
              <!-- Mini barra de ocupación en la tarjeta -->
              <div class="card-mini-capacity">
                <div class="mini-cap-info">
                  <span>Aforo</span>
                  <span :style="{ color: gym.occupancy > 75 ? '#ef4444' : '#10b981' }">{{ gym.occupancy }}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: gym.occupancy + '%', background: gym.occupancy > 75 ? '#ef4444' : '#3b82f6' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      <!-- DRAWER / DETALLE DE SEDE CON MAPA 3D SIMULADO -->
      <transition name="fade">
        <div v-if="selectedGym" class="drawer-overlay" @click="closeGymDetail"></div>
      </transition>

      <transition name="slide">
        <div v-if="selectedGym" class="gym-drawer glass-card">
          <div class="drawer-header">
            <div class="drawer-title-wrapper">
              <span class="drawer-tag" :class="{ open: selectedGym.isOpen }">
                <span class="pulse-dot"></span>
                {{ selectedGym.isOpen ? t.statusOpen || 'Abierto' : t.statusClosed || 'Cerrado' }}
              </span>
              <h2>{{ selectedGym.name }}</h2>
            </div>
            <button class="close-btn" @click="closeGymDetail">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div class="drawer-body custom-scroll">
            
            <!-- CONTENEDOR DE MAPA 3D / PERSPECTIVA ESTILO CYBERPUNK -->
            <div class="map-3d-container">
              <div class="map-3d-viewport">
                <!-- Capas simulando edificios y relieve 3D isométrica -->
                <div class="isometric-grid-bg"></div>
                <div class="map-marker-pin animate-bounce">
                  <div class="pin-pulse"></div>
                  <div class="pin-core">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                </div>
                <div class="map-hud-overlay">
                  <span class="hud-coords">LAT: 19.4326° N / LON: 99.1332° W</span>
                  <span class="hud-status">MODO MAPA 3D ACTIVO</span>
                </div>
              </div>
            </div>

            <!-- FOTO REAL DE LA SEDE -->
            <div class="drawer-image-section">
              <h4>Fotografía de la Sede</h4>
              <div class="drawer-image">
                <img :src="selectedGym.image" :alt="selectedGym.name" />
              </div>
            </div>

            <div class="info-block">
              <h4>{{ t.locationInfo || 'Información de Ubicación' }}</h4>
              <p class="drawer-text-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                {{ selectedGym.address }}
              </p>
              <p class="drawer-text-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                {{ selectedGym.schedule }}
              </p>
              <p class="drawer-text-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                {{ selectedGym.phone }}
              </p>
            </div>

            <div class="info-block">
              <h4>{{ t.amenities || 'Amenidades' }}</h4>
              <div class="amenities-grid">
                <span class="amenity-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Zona de Pesas</span>
                <span class="amenity-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Área de Cardio</span>
                <span class="amenity-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Lockers</span>
                <span class="amenity-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Estacionamiento</span>
              </div>
            </div>

            <div class="info-block">
              <h4>{{ t.currentCapacity || 'Aforo Actual' }}</h4>
              <div class="capacity-bar-container">
                <div class="capacity-info">
                  <span>{{ t.occupancyLevel || 'Nivel de Ocupación' }}</span>
                  <span class="capacity-percentage">{{ selectedGym.occupancy }}% ({{ selectedGym.occupancy > 75 ? 'Alto' : 'Moderado' }})</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: selectedGym.occupancy + '%', background: selectedGym.occupancy > 75 ? '#ef4444' : '#10b981' }"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="drawer-footer">
            <button class="btn-primary" @click="handleSelectGym">
              {{ t.selectAsMainGym || 'Establecer como Sede Principal' }}
            </button>
          </div>
        </div>
      </transition>

    </div>
  </HeadingAdmin>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useLang } from '../useLang.js'; 
import { traducciones } from '../i18n.js'; 
import HeadingAdmin from '../HeadingMember.vue';

const { lang } = useLang();
const t = computed(() => traducciones[lang.value] || traducciones.es);

const activeModal = ref(null);
const isGymOpen = ref(true);
const billingStatus = ref('active'); 

const selectedGym = ref(null);

const gymsList = ref([
  { id: 1, name: 'Sede Central - Reforma', address: 'Av. Paseo de la Reforma #222', schedule: 'Lun - Sáb: 6:00 - 23:00', phone: '+52 55 1234 5678', isOpen: true, occupancy: 45, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop' },
  { id: 2, name: 'Sede Norte - Polanco', address: 'Homero #1405, Polanco', schedule: 'Lun - Dom: 5:00 - 00:00', phone: '+52 55 8765 4321', isOpen: true, occupancy: 82, image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop' },
  { id: 3, name: 'Sede Sur - Insurgentes', address: 'Insurgentes Sur #1602', schedule: 'Lun - Sáb: 6:00 - 22:00', phone: '+52 55 1122 3344', isOpen: false, occupancy: 12, image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=600&auto=format&fit=crop' }
]);

const openGymDetail = (gym) => {
  selectedGym.value = gym;
};

const closeGymDetail = () => {
  selectedGym.value = null;
};

const handleSelectGym = () => {
  alert(`¡Sede principal actualizada a: ${selectedGym.value.name}!`);
  closeGymDetail();
};

onMounted(() => {
  const savedGymStatus = localStorage.getItem('isGymOpen');
  if (savedGymStatus !== null) {
    isGymOpen.value = JSON.parse(savedGymStatus);
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;700&display=swap');

.saas-dashboard-wrapper {
  background: var(--bg-custom, var(--color-interfaz, #0a0a0a));
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
  padding: 36px 32px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.section-header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.btn-primary-action {
  background: var(--color-highlight, #3b82f6);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.2s, transform 0.1s;
}

.btn-primary-action:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.gyms-grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

.glass-card {
  background: var(--bg-cards, #121212);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: var(--app-border-radius, 20px);
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.gym-item-card {
  cursor: pointer;
  padding: 18px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.gym-item-card:hover {
  transform: translateY(-6px);
  border-color: var(--color-highlight, #3b82f6);
  box-shadow: 0 25px 50px rgba(59, 130, 246, 0.15);
}

.card-3d-perspective {
  perspective: 1000px;
}

.gym-item-image {
  width: 100%;
  height: 190px;
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  margin-bottom: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: transform 0.5s ease;
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
  background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%);
}

.drawer-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(239, 68, 68, 0.9);
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
  background: rgba(16, 185, 129, 0.9);
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
  margin: 0 0 10px 0;
  font-family: 'Oswald', sans-serif;
  font-size: 1.25rem;
  color: var(--color-titulos, #fff);
}

.card-mini-capacity {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.mini-cap-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: rgba(245, 245, 244, 0.6);
  margin-bottom: 6px;
  font-weight: 600;
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
  color: var(--color-texto-general, rgba(245, 245, 244, 0.55));
  opacity: 0.8;
  margin: 8px 0 0 0;
  font-weight: 500;
}

/* --- ESTILOS DEL MAPA 3D INTERACTIVO EN EL DRAWER --- */
.map-3d-container {
  width: 100%;
  height: 200px;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 20px;
  position: relative;
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: inset 0 0 20px rgba(59, 130, 246, 0.15);
}

.map-3d-viewport {
  width: 100%;
  height: 100%;
  background: #0d1117;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Simulación de perspectiva 3D isométrica */
  transform: perspective(600px) rotateX(15deg);
}

.isometric-grid-bg {
  position: absolute;
  inset: -50%;
  background-image: 
    linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
  background-size: 24px 24px;
  transform: rotate(45deg);
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  0% { background-position: 0 0; }
  100% { background-position: 48px 48px; }
}

.map-marker-pin {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pin-core {
  width: 36px;
  height: 36px;
  background: var(--color-highlight, #3b82f6);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px #3b82f6;
  border: 2px solid #fff;
}

.pin-pulse {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 2px solid #3b82f6;
  border-radius: 50%;
  animation: radarPulse 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
}

@keyframes radarPulse {
  0% { transform: scale(0.5); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
}

.map-hud-overlay {
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  justify-content: space-between;
  font-size: 0.65rem;
  color: #93c5fd;
  background: rgba(10, 15, 30, 0.85);
  padding: 4px 8px;
  border-radius: 6px;
  z-index: 4;
  border: 1px solid rgba(59, 130, 246, 0.2);
  font-family: monospace;
}

/* --- ESTILOS DEL DRAWER --- */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 4000;
}

.gym-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 480px;
  max-width: 90vw;
  height: 100vh;
  background: var(--bg-cards, #121212);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: -15px 0 40px rgba(0, 0, 0, 0.8);
  z-index: 4001;
  display: flex;
  flex-direction: column;
  border-radius: 0;
}

.drawer-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.drawer-title-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.drawer-title-wrapper h2 {
  margin: 0;
  font-size: 1.3rem;
  color: var(--color-titulos, #fff);
  font-family: 'Oswald', sans-serif;
}

.close-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-texto-general, #fff);
  cursor: pointer;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.drawer-body {
  padding: 24px;
  flex: 1;
  overflow-y: auto;
}

.drawer-image-section h4 {
  margin: 0 0 10px 0;
  font-size: 0.9rem;
  color: var(--color-titulos, #fff);
}

.drawer-image {
  width: 100%;
  height: 160px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.drawer-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-block {
  margin-bottom: 24px;
}

.info-block h4 {
  margin: 0 0 12px 0;
  font-size: 0.95rem;
  color: var(--color-titulos, #fff);
  font-weight: 600;
}

.drawer-text-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: var(--color-texto-general, rgba(245, 245, 244, 0.6));
  margin: 8px 0;
}

.amenities-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.amenity-chip {
  background: var(--bg-custom, #0a0a0a);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 0.8rem;
  color: var(--color-texto-general, #fff);
  display: flex;
  align-items: center;
  gap: 8px;
}

.amenity-chip svg {
  color: var(--color-highlight, #3b82f6);
}

.capacity-bar-container {
  background: var(--bg-custom, #0a0a0a);
  padding: 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.capacity-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--color-texto-general, rgba(245, 245, 244, 0.6));
  margin-bottom: 8px;
}

.capacity-percentage {
  font-weight: 600;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
}

.drawer-footer {
  padding: 20px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: var(--bg-cards, #121212);
}

.btn-primary {
  width: 100%;
  background: var(--color-highlight, #3b82f6);
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-primary:active {
  transform: scale(0.98);
}

/* Transiciones */
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 680px) {
  .dashboard-main-container { padding: 14px; }
  .gym-drawer { width: 100vw; }
}
</style>