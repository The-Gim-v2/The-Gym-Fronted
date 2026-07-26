<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useReveal } from '../useReveal';
import { ClipboardList, MessageSquareText, BarChart3, CalendarDays, Rocket } from 'lucide-vue-next';

// --- IMPORTACIÓN DE IMÁGENES LOCALES ---
import imgScreen1 from '../../assets/Operation/organiza.png';
import imgScreen2 from '../../assets/Operation/acompaña.png';
import imgScreen3 from '../../assets/Operation/analiza.png';

// --- CONFIGURACIÓN DE PANTALLAS (Sincronizadas con las 4 tarjetas) ---
const screenshots = computed(() => [
  { 
    type: 'image',
    img: imgScreen1, 
    title: "Gestión Total", 
    desc: "Controla clientes, pagos y operación" 
  },
  { 
    type: 'image',
    img: imgScreen2, 
    title: "Experiencia Móvil", 
    desc: "App dedicada y mensajería en tiempo real" 
  },
  { 
    type: 'image',
    img: imgScreen3, 
    title: "Métricas de Impacto", 
    desc: "Visualiza el progreso físico de tus usuarios" 
  },
  { 
    type: 'upcoming',
    title: 'PRÓXIMAMENTE',
    desc: 'Asistencia de IA integrada para rutinas y comunicación avanzada.',
    icon: Rocket
  }
]);

// --- LÓGICA DE CONTROL ---
const { el, revealed } = useReveal();
const activeFeatureIndex = ref<number>(0);
const currentSlideIndex = ref<number>(0);
let slideInterval: any = null;

const features = [
  { 
    title: "ORGANIZA", 
    subtitle: "Gestión Total", 
    desc: "Controla clientes, pagos, registro de calendarios, registro de personal, bitácora y mantén todo bajo control operativo.", 
    tags: ["✓ Clientes", "✓ Pagos", "✓ Calendarios", "✓ Personal", "✓ Bitácora"], 
    icon: ClipboardList 
  },
  { 
    title: "ACOMPAÑA", 
    subtitle: "Experiencia Móvil", 
    desc: "Ofrece a tus entrenadores y deportistas una app dedicada con mensajería y alertas en tiempo real.", 
    tags: ["✓ App cliente", "✓ Mensajería", "✓ Videollamadas", "✓ Alertas"], 
    icon: MessageSquareText 
  },
  { 
    title: "ANALIZA", 
    subtitle: "Métricas de Impacto", 
    desc: "Visualiza el progreso físico de tus usuarios con gráficas de rendimiento, comparativa fotográfica y control de racha para miembros.", 
    tags: ["✓ Progreso", "✓ Métricas", "✓ Fotos", "✓ Racha miembros"], 
    icon: BarChart3 
  },
  { 
    title: "PLANIFICA", 
    subtitle: "Inteligencia Deportiva", 
    desc: "Permite a los entrenadores diseñar rutinas personalizadas para los clientes, potenciando la comunicación directa. Con asistencia de IA integrada para dueños, entrenadores y clientes.", 
    tags: ["✓ Rutinas", "✓ Comunicación", "✓ Asistencia IA"], 
    icon: CalendarDays 
  }
];

const selectFeature = (index: number) => {
  activeFeatureIndex.value = index;
  currentSlideIndex.value = index;
  resetInterval();
};

const startInterval = () => {
  slideInterval = setInterval(() => {
    currentSlideIndex.value = (currentSlideIndex.value + 1) % screenshots.value.length;
    activeFeatureIndex.value = currentSlideIndex.value;
  }, 4500);
};

const resetInterval = () => {
  if (slideInterval) clearInterval(slideInterval);
  startInterval();
};

onMounted(() => {
  startInterval();
});

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval);
});
</script>

<template>
  <section id="como-funciona" ref="el" class="ecosystem-section" :class="{ revealed }">
    <div class="ambient-glow-deep"></div>
    <div class="container">
      
      <div class="section-header">
        <span class="badge">Ecosistema Conectado</span>
        <h2 class="section-title">
          TODO <span class="text-accent">EN CONJUNTO</span>
        </h2>
        <p class="section-subtitle">Una plataforma integral diseñada para dominar la operación de tu centro fitness.</p>
      </div>

      <div class="dashboard-ecosystem-grid">
        
        <div class="features-column">
          <div 
            v-for="(item, index) in features" 
            :key="index"
            class="feature-card"
            :class="{ active: activeFeatureIndex === index }"
            @mouseenter="selectFeature(index)"
            @click="selectFeature(index)"
          >
            <div class="card-content-wrapper">
              <div class="card-icon-box">
                <component :is="item.icon" :size="24" />
              </div>
              <div class="card-text-data">
                <span class="card-tag-mini">{{ item.subtitle }}</span>
                <h3>{{ item.title }}</h3>
                <p>{{ item.desc }}</p>
                <div class="tags-row">
                  <span v-for="(tag, tIdx) in item.tags" :key="tIdx" class="mini-pill">{{ tag }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="phone-showcase-column">
          <div class="phone-showcase-container">
            
            <div class="orbital-lights-container">
              <div class="light-orbit orbit-green"></div>
              <div class="light-orbit orbit-blue"></div>
              <div class="light-orbit orbit-purple"></div>
              <div class="light-particle particle-1"></div>
              <div class="light-particle particle-2"></div>
              <div class="light-particle particle-3"></div>
            </div>
            
            <div class="iphone-titanium-frame-pro">
              <div class="phone-antenna top"></div>
              <div class="phone-antenna bottom"></div>
              <div class="side-button power"></div>
              <div class="side-button volume-up"></div>
              <div class="side-button volume-down"></div>
              <div class="side-button action-btn"></div>
              
              <div class="iphone-screen-container-pro">
                <div class="dynamic-island">
                  <div class="camera-lens"></div>
                  <div class="sensor-dot"></div>
                </div>

                <div class="carousel-track-pro" :style="{ transform: `translateX(-${currentSlideIndex * (100 / screenshots.length)}%)`, width: `${screenshots.length * 100}%` }">
                  <div v-for="(slide, sIdx) in screenshots" :key="sIdx" class="carousel-slide-pro" :style="{ width: `${100 / screenshots.length}%` }">
                    
                    <!-- Renderizado condicional para Imagen o Próximamente -->
                    <template v-if="slide.type === 'image'">
                      <img :src="slide.img" :alt="slide.title" class="preview-active-img-pro" loading="lazy" />
                      <div class="screen-overlay-gradient-pro"></div>
                      <div class="screen-caption-tag-pro">
                        <span class="live-dot-pro"></span>
                        <span>{{ slide.title }}</span>
                      </div>
                    </template>

                    <template v-else-if="slide.type === 'upcoming'">
                      <div class="upcoming-slide-content">
                        <div class="upcoming-icon-wrapper">
                          <component :is="slide.icon" :size="36" />
                        </div>
                        <span class="upcoming-badge">{{ slide.title }}</span>
                        <h4 class="upcoming-title">Inteligencia Deportiva</h4>
                        <p class="upcoming-desc">{{ slide.desc }}</p>
                      </div>
                    </template>

                  </div>
                </div>

                <div class="screen-indicators-pro">
                  <span 
                    v-for="(_, dotIdx) in screenshots" 
                    :key="dotIdx" 
                    class="indicator-dot-pro"
                    :class="{ active: currentSlideIndex === dotIdx }"
                    @click="selectFeature(dotIdx)"
                  ></span>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  </section>
</template>

<style scoped>
.ecosystem-section {
  padding: clamp(60px, 8vw, 140px) 16px;
  background: #020204;
  color: #f5f5f4;
  font-family: 'Inter', sans-serif;
  opacity: 0;
  transform: translateY(25px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  position: relative;
}

.ecosystem-section.revealed { 
  opacity: 1; 
  transform: translateY(0); 
}

.ambient-glow-deep {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(900px, 90vw);
  height: min(900px, 90vw);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(28,79,214,0.26) 0%, rgba(2,2,4,0) 70%);
  filter: blur(90px);
  pointer-events: none;
}

.container { 
  max-width: 1300px; 
  margin: 0 auto; 
  position: relative;
  z-index: 2;
  width: 100%;
}

.section-header {
  text-align: center;
  margin-bottom: clamp(30px, 5vw, 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.badge {
  display: inline-block;
  padding: 6px 16px;
  background: #121216;
  border: 1px solid rgba(28,79,214,0.45);
  border-radius: 6px;
  font-family: 'Oswald', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #4a7cf0;
  text-transform: uppercase;
}

.section-title {
  font-family: 'Anton', sans-serif;
  font-size: clamp(2.2rem, 6vw, 5rem);
  line-height: 0.95;
  text-transform: uppercase;
  letter-spacing: -1px;
  margin: 0;
  text-align: center;
}

.text-accent { 
  color: #3a6bd6; 
  text-shadow: 0 0 38px rgba(28,79,214,0.5);
}

.section-subtitle {
  color: rgba(245, 245, 244, 0.6);
  font-size: clamp(0.95rem, 2vw, 1.05rem);
  max-width: 550px;
  margin: 0;
  text-align: center;
  padding: 0 10px;
}

.dashboard-ecosystem-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: clamp(30px, 4vw, 50px);
  align-items: center;
  margin-top: 30px;
}

.features-column {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.feature-card {
  position: relative;
  background: rgba(16, 16, 20, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: clamp(16px, 2.5vw, 24px);
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(14px);
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(28,79,214,0.12), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card:hover, .feature-card.active {
  border-color: rgba(28, 79, 214, 0.6);
  background: rgba(20, 20, 26, 0.95);
  transform: translateX(4px);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(28, 79, 214, 0.2);
}

.feature-card.active::before {
  opacity: 1;
}

.card-content-wrapper {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  position: relative;
  z-index: 2;
}

.card-icon-box {
  width: 44px;
  height: 44px;
  background: #14141a;
  border: 1px solid rgba(28, 79, 214, 0.3);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a7cf0;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.feature-card.active .card-icon-box {
  background: #1c4fd6;
  color: #ffffff;
  border-color: #3a6bd6;
  box-shadow: 0 0 20px rgba(28, 79, 214, 0.7);
}

.card-text-data {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-tag-mini {
  font-family: 'Oswald', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #4a7cf0;
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.card-text-data h3 {
  font-family: 'Anton', sans-serif;
  font-size: 1.25rem;
  letter-spacing: 0.5px;
  margin: 0;
  color: #ffffff;
}

.card-text-data p {
  font-size: 0.88rem;
  color: rgba(245, 245, 244, 0.7);
  line-height: 1.45;
  margin: 0 0 10px 0;
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.mini-pill {
  font-size: 10.5px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 3px 9px;
  border-radius: 20px;
  color: rgba(245, 245, 244, 0.8);
}

.feature-card.active .mini-pill {
  background: rgba(28, 79, 214, 0.12);
  border-color: rgba(28, 79, 214, 0.3);
  color: #93b4fd;
}

.phone-showcase-column {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  min-height: 640px;
  width: 100%;
}

.phone-showcase-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: floatPhone 6s ease-in-out infinite;
  width: 100%;
}

@keyframes floatPhone {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(0.5deg); }
}

.orbital-lights-container {
  position: absolute;
  width: 480px;
  height: 480px;
  pointer-events: none;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.light-orbit {
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;
}

.orbit-green {
  width: 380px;
  height: 380px;
  border-top-color: rgba(16, 185, 129, 0.6);
  border-right-color: rgba(16, 185, 129, 0.1);
  animation: spinSlow 12s linear infinite;
  filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.4));
}

.orbit-blue {
  width: 430px;
  height: 430px;
  border-bottom-color: rgba(59, 130, 246, 0.6);
  border-left-color: rgba(59, 130, 246, 0.1);
  animation: spinReverse 16s linear infinite;
  filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.4));
}

.orbit-purple {
  width: 480px;
  height: 480px;
  border-right-color: rgba(168, 85, 247, 0.5);
  border-top-color: rgba(168, 85, 247, 0.05);
  animation: spinSlow 20s linear infinite;
  filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.3));
}

.light-particle {
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  box-shadow: 0 0 10px currentColor;
}

.particle-1 { background: #10b981; color: #10b981; top: 15px; animation: orbitParticle1 8s linear infinite; }
.particle-2 { background: #3b82f6; color: #3b82f6; bottom: 20px; animation: orbitParticle2 10s linear infinite; }
.particle-3 { background: #a855f7; color: #a855f7; right: 15px; animation: orbitParticle3 12s linear infinite; }

@keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes spinReverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }

@keyframes orbitParticle1 {
  0% { transform: rotate(0deg) translateX(190px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(190px) rotate(-360deg); }
}
@keyframes orbitParticle2 {
  0% { transform: rotate(0deg) translateX(215px) rotate(0deg); }
  100% { transform: rotate(-360deg) translateX(215px) rotate(360deg); }
}
@keyframes orbitParticle3 {
  0% { transform: rotate(0deg) translateX(240px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(240px) rotate(-360deg); }
}

.iphone-titanium-frame-pro {
  width: clamp(260px, 25vw, 340px);
  height: clamp(520px, 51vw, 680px);
  background: #18181c;
  border-radius: 48px;
  padding: 12px;
  position: relative;
  box-shadow: 
    0 40px 80px rgba(0, 0, 0, 0.85),
    0 0 0 2px #3a3a44,
    0 0 0 6px #121216,
    inset 0 0 18px rgba(255, 255, 255, 0.12);
  z-index: 5;
}

.side-button { position: absolute; background: #2c2c34; border-radius: 2px; }
.power { right: -7px; top: 160px; width: 4px; height: 55px; }
.volume-up { left: -7px; top: 130px; width: 4px; height: 35px; }
.volume-down { left: -7px; top: 180px; width: 4px; height: 35px; }
.action-btn { left: -7px; top: 80px; width: 4px; height: 26px; }

.phone-antenna { position: absolute; background: #2e2e38; width: 12px; height: 2px; }
.phone-antenna.top { top: 6px; left: 60px; }
.phone-antenna.bottom { bottom: 6px; right: 60px; }

.iphone-screen-container-pro {
  width: 100%;
  height: 100%;
  border-radius: 38px;
  overflow: hidden;
  background: #000;
  position: relative;
}

.dynamic-island {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 110px;
  height: 26px;
  background: #050507;
  border-radius: 16px;
  z-index: 25;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 9px;
}

.camera-lens { width: 10px; height: 10px; background: #101014; border-radius: 50%; border: 1px solid rgba(255,255,255,0.08); }
.sensor-dot { width: 4px; height: 4px; background: #0a0a12; border-radius: 50%; }

.carousel-track-pro {
  display: flex;
  height: 100%;
  transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: transform;
}

.carousel-slide-pro {
  height: 100%;
  position: relative;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000000;
}

.preview-active-img-pro {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

.screen-overlay-gradient-pro {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 40%);
  pointer-events: none;
}

.screen-caption-tag-pro {
  position: absolute;
  bottom: 35px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(14, 14, 18, 0.88);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(28, 79, 214, 0.45);
  padding: 6px 14px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  font-weight: 600;
  color: #ffffff;
  box-shadow: 0 10px 25px rgba(0,0,0,0.6);
  white-space: nowrap;
  z-index: 10;
}

.live-dot-pro {
  width: 7px;
  height: 7px;
  background: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 8px #10b981;
  animation: pulseDot 2s infinite;
}

@keyframes pulseDot {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

/* Estilos para el estado Próximamente (Planifica / IA) */
.upcoming-slide-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 30px 24px;
  height: 100%;
  background: radial-gradient(circle at center, rgba(28,79,214,0.18) 0%, #08080c 70%);
}

.upcoming-icon-wrapper {
  width: 70px;
  height: 70px;
  background: rgba(28, 79, 214, 0.15);
  border: 1px solid rgba(58, 107, 214, 0.4);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #60a5fa;
  margin-bottom: 20px;
  box-shadow: 0 0 30px rgba(28, 79, 214, 0.25);
}

.upcoming-badge {
  font-family: 'Oswald', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #3b82f6;
  text-transform: uppercase;
  margin-bottom: 8px;
  background: rgba(59, 130, 246, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid rgba(59, 130, 246, 0.25);
}

.upcoming-title {
  font-family: 'Anton', sans-serif;
  font-size: 1.5rem;
  color: #ffffff;
  letter-spacing: 0.5px;
  margin: 0 0 10px 0;
  text-transform: uppercase;
}

.upcoming-desc {
  font-size: 0.85rem;
  color: rgba(245, 245, 244, 0.65);
  line-height: 1.5;
  margin: 0;
  max-width: 240px;
}

.screen-indicators-pro {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 5px;
  z-index: 15;
}

.indicator-dot-pro {
  width: 5px;
  height: 5px;
  background: rgba(255,255,255,0.3);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator-dot-pro.active {
  width: 16px;
  border-radius: 4px;
  background: #3a6bd6;
  box-shadow: 0 0 8px rgba(28,79,214,0.8);
}
/* Efecto de pulso épico para el fondo */
@keyframes epicGlow {
  0% {
    background: radial-gradient(circle at center, rgba(28,79,214,0.15) 0%, #08080c 70%);
    box-shadow: inset 0 0 15px rgba(28,79,214,0.1);
  }
  50% {
    background: radial-gradient(circle at center, rgba(58,130,246,0.3) 0%, #08080c 70%);
    box-shadow: inset 0 0 35px rgba(58,130,246,0.4);
  }
  100% {
    background: radial-gradient(circle at center, rgba(28,79,214,0.15) 0%, #08080c 70%);
    box-shadow: inset 0 0 15px rgba(28,79,214,0.1);
  }
}

.upcoming-slide-content {
  animation: epicGlow 4s ease-in-out infinite;
}

/* Icono con flotación magnética intensa */
@keyframes floatIcon {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(3deg); }
}

.upcoming-icon-wrapper {
  animation: floatIcon 3s ease-in-out infinite;
}
@keyframes hologramReveal {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
    filter: blur(8px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0);
  }
}

.upcoming-slide-content {
  animation: hologramReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards, epicGlow 4s ease-in-out infinite;
}

@media (max-width: 968px) {
  .dashboard-ecosystem-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .phone-showcase-container {
    animation: none;
  }
  .orbital-lights-container {
    display: none;
  }
  .phone-showcase-column {
    min-height: 480px;
  }
  .iphone-titanium-frame-pro {
    width: 250px;
    height: 510px;
  }
}
</style>