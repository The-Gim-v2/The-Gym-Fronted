<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useReveal } from '../useReveal';

// --- IMPORTACIÓN DE IMÁGENES LOCALES ---
import img1 from '../../assets/Propietario/menu.png';
import img2 from '../../assets/Propietario/regiter.png';
import img3 from '../../assets/Propietario/usuarios.png';

import img4 from '../../assets/Recepcionista/menu.png';
import img5 from '../../assets/Recepcionista/regiter.png';
import img6 from '../../assets/Recepcionista/pagos.png';

const { el, revealed } = useReveal();

interface Slide {
  type: 'image' | 'upcoming';
  title: string;
  desc: string;
  src?: string;
  icon?: string;
}

interface PhoneItem {
  role: string;
  badgeClass: string;
  phoneFrame: string;
  slides: Slide[];
}

// --- DATOS ESTÁTICOS (Soluciona pantallas en blanco por fallos de computed con assets) ---
const screenshots: PhoneItem[] = [
  {
    role: 'Propietario',
    badgeClass: 'owner-tag',
    phoneFrame: 'iphone-frame',
    slides: [
      {
        type: 'image',
        src: img1,
        title: 'Menú Único',
        desc: 'Un menú centralizado y exclusivo para el control total del propietario.'
      },
      {
        type: 'image',
        src: img2,
        title: 'Registro de Clientes',
        desc: 'Registra y administra a tus clientes para un seguimiento más eficiente.'
      },
      {
        type: 'image',
        src: img3,
        title: 'Gestión de Usuarios',
        desc: 'Visualiza a todos tus usuarios y comunícate con ellos fácilmente.'
      },
    ],
  },
  {
    role: 'Recepcionista',
    badgeClass: 'reception-tag',
    phoneFrame: 'samsung-frame',
    slides: [
      {
        type: 'image',
        src: img4,
        title: 'Menú Específico',
        desc: 'Interfaz diseñada para la recepción, restringiendo el acceso a información sensible.'
      },
      {
        type: 'image',
        src: img5,
        title: 'Registro de Clientes',
        desc: 'Permite al personal de recepción dar de alta a nuevos clientes rápidamente.'
      },
      {
        type: 'image',
        src: img6,
        title: 'Control de Pagos',
        desc: 'Gestiona y recibe los pagos de manera ágil y segura.'
      },
    ],
  },
  {
    role: 'Entrenador',
    badgeClass: 'trainer-tag',
    phoneFrame: 'xiaomi-frame',
    slides: [
      {
        type: 'upcoming',
        title: 'PRÓXIMAMENTE',
        desc: 'Nueva actualización con herramientas avanzadas para entrenadores.',
        icon: '🚀'
      }
    ],
  },
  {
    role: 'Miembro / Atleta',
    badgeClass: 'athlete-tag',
    phoneFrame: 'huawei-frame',
    slides: [
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop',
        title: 'Mi Progreso',
        desc: 'Visualiza tus estadísticas, marcas personales y asistencia.'
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1594882622568-16120ed5ee84?q=80&w=600&auto=format&fit=crop',
        title: 'Reservar Clases',
        desc: 'Reserva tu lugar en tus clases favoritas en segundos.'
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1584735935682-2f2ea69dffc7?q=80&w=600&auto=format&fit=crop',
        title: 'Nutrición',
        desc: 'Accede a tu plan nutricional y recomendaciones diarias.'
      },
    ],
  },
];

const currentSlides = ref([0, 0, 0, 0]);
let slideInterval: any = null;

onMounted(() => {
  slideInterval = setInterval(() => {
    currentSlides.value = currentSlides.value.map((current, index) => {
      const targetPhone = screenshots[index];
      if (!targetPhone || targetPhone.slides.length <= 1) return 0; 
      
      return (current + 1) % targetPhone.slides.length;
    });
  }, 4500);
});

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval);
});
</script>

<template>
  <section id="experiencia-app" ref="el" class="devices-section" :class="{ revealed }">
    <div class="professional-bg">
      <div class="bg-animation-circle circle-1"></div>
      <div class="bg-animation-circle circle-2"></div>
      <div class="bg-animation-circle circle-3"></div>
      <div class="bg-animation-circle circle-4"></div>
      <div class="bg-grid-overlay"></div>
    </div>

    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Experiencia <span class="text-accent">multidispositivo</span> total</h2>
        <p class="section-subtitle">Una plataforma sincronizada en tiempo real diseñada a la medida para cada rol dentro de tu ecosistema fitness.</p>
      </div>

      <div class="devices-display">
        <div 
          v-for="(phone, index) in screenshots" 
          :key="phone.role"
          class="phone-column-wrapper"
          :style="{ animationDelay: `${0.2 + index * 0.15}s` }"
        >
          <div :class="['device-tag', phone.badgeClass]">{{ phone.role }}</div>
          
          <div :class="['mockup-phone-v2', phone.phoneFrame, `float-delay-${index + 1}`]">
            <div class="hw-notch" v-if="phone.phoneFrame === 'iphone-frame'"></div>
            <div class="hw-punch" v-else></div>

            <div class="screen-container">
                <div class="carousel-viewport">
            <div 
                class="carousel-track" 
                :style="{ 
                width: `${phone.slides.length * 100}%`, 
                transform: `translateX(-${(currentSlides[index] ?? 0) * (100 / phone.slides.length)}%)` 
                }"
            >
                <div 
                v-for="(slide, sIdx) in phone.slides" 
                :key="sIdx" 
                class="carousel-slide-content"
                :style="{ width: `${100 / phone.slides.length}%` }"
                >
                <!-- Contenido del slide (image o upcoming) igual que antes -->
                <div v-if="slide.type === 'image'" class="slide-inner-wrapper">
                    <img :src="slide.src" :alt="slide.title" class="app-screenshot-img" />
                    <div class="image-gradient-overlay"></div>
                    <div class="screenshot-data-overlay">
                    <div class="mock-app-title">{{ slide.title }}</div>
                    <div class="mock-app-desc">{{ slide.desc }}</div>
                    </div>
                </div>

                <div v-else-if="slide.type === 'upcoming'" class="slide-coming-soon">
                    <div class="soon-content-box">
                    <div class="soon-icon-lg animate-pulse">{{ slide.icon }}</div>
                    <div class="mock-app-title highlight-text">{{ slide.title }}</div>
                    <div class="mock-app-desc">{{ slide.desc }}</div>
                    <div class="loading-bar-line"><span></span></div>
                    </div>
                </div>
                </div>
            </div>
            </div>

              <div class="carousel-pips-controller">
                <template v-if="index !== 2">
                  <span 
                    v-for="(_, dotIdx) in phone.slides" 
                    :key="dotIdx"
                    :class="['pip-dot', { active: currentSlides[index] === dotIdx }]"
                  ></span>
                </template>
              </div>

              <div class="home-gesture-bar"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* (Mismos estilos CSS que ya tenías) */
.devices-section {
  position: relative;
  padding: clamp(60px, 8vw, 140px) clamp(16px, 4vw, 60px);
  color: #f5f5f4;
  font-family: 'Inter', sans-serif;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  overflow: hidden;
}

.devices-section.revealed {
  opacity: 1;
  transform: translateY(0);
}

.professional-bg {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: #050508;
  z-index: 0;
  overflow: hidden;
}

.bg-animation-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.35;
  animation: floatBackgroundCircles 18s ease-in-out infinite alternate;
}

.circle-1 { width: 400px; height: 400px; background: #2563eb; top: -10%; left: -10%; }
.circle-2 { width: 350px; height: 350px; background: #9333ea; bottom: -15%; right: -10%; animation-delay: -4s; }
.circle-3 { width: 300px; height: 300px; background: #06b6d4; top: 40%; left: 30%; animation-delay: -8s; }
.circle-4 { width: 450px; height: 450px; background: #7c3aed; top: 10%; right: 5%; animation-delay: -12s; }

@keyframes floatBackgroundCircles {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(50px, 40px) scale(1.1); }
  100% { transform: translate(-40px, 50px) scale(0.95); }
}

.bg-grid-overlay {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.section-header {
  text-align: center;
  max-width: 750px;
  margin: 0 auto 50px auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-family: 'Anton', sans-serif;
  font-size: clamp(2.2rem, 5vw, 4rem);
  line-height: 1.1;
  color: #ffffff;
  text-transform: uppercase;
  margin: 0;
}

.text-accent { color: #06b6d4; }
.section-subtitle { font-size: clamp(14px, 2vw, 15.5px); color: rgba(245, 245, 244, 0.65); line-height: 1.6; margin: 0; }

.devices-display {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 28px;
  justify-items: center;
}

@media (max-width: 1250px) {
  .devices-display { 
    grid-template-columns: repeat(2, minmax(0, 1fr)); 
    gap: 35px; 
  }
}

@media (max-width: 650px) {
  .devices-display { 
    grid-template-columns: 1fr; 
    gap: 40px; 
    width: 100%;
  }
}

.phone-column-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  animation: fadeUpItem 0.8s ease forwards;
  width: 100%;
}

@keyframes fadeUpItem {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.device-tag {
  font-family: 'Oswald', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.3px;
  padding: 6px 16px;
  border-radius: 20px;
  margin-bottom: 16px;
  text-transform: uppercase;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  text-align: center;
}

.owner-tag { background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.4); color: #60a5fa; }
.reception-tag { background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); color: #fbbf24; }
.trainer-tag { background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.4); color: #c084fc; }
.athlete-tag { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #34d399; }

.mockup-phone-v2 {
  width: 270px;
  height: 540px;
  background: #111115;
  border-radius: 38px;
  padding: 8px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;
  animation: floatingPhoneAdvanced 6s ease-in-out infinite;
}

@media (max-width: 360px) {
  .mockup-phone-v2 {
    width: 245px;
    height: 490px;
  }
}

.float-delay-1 { animation-delay: 0s; }
.float-delay-2 { animation-delay: 1.5s; }
.float-delay-3 { animation-delay: 3s; }
.float-delay-4 { animation-delay: 4.5s; }

@keyframes floatingPhoneAdvanced {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(0.4deg); }
}

.iphone-frame { border: 3px solid #27272a; border-radius: 42px; }
.samsung-frame { border: 3px solid #1e293b; border-radius: 24px; }
.xiaomi-frame { border: 3px solid #334155; border-radius: 34px; }
.huawei-frame { border: 3px solid #1f2937; border-radius: 36px; }

.hw-notch {
  width: 90px; height: 18px; background: #000; border-radius: 12px;
  position: absolute; top: 10px; left: 50%; transform: translateX(-50%); z-index: 20;
}
.hw-punch {
  width: 12px; height: 12px; background: #000; border-radius: 50%;
  position: absolute; top: 14px; left: 50%; transform: translateX(-50%); z-index: 20;
}

.screen-container {
  width: 100%;
  height: 100%;
  background: #09090b;
  border-radius: 30px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.carousel-viewport {
  width: 100%;
  flex: 1;
  overflow: hidden;
  position: relative;
  background: #000;
}

.carousel-track {
  display: flex;
  width: 300%;
  height: 100%;
  transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
}

.carousel-slide-content {
  width: 33.333%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: relative;
}

.slide-inner-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
}

.app-screenshot-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  display: block;
}

.image-gradient-overlay {
  position: absolute;
  bottom: 0; left: 0; width: 100%; height: 50%;
  background: linear-gradient(to top, rgba(5,5,8,0.95) 10%, transparent 100%);
  pointer-events: none;
}

.screenshot-data-overlay {
  position: absolute;
  bottom: 25px; left: 0; width: 100%;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 5;
}

.mock-app-title {
  font-family: 'Anton', sans-serif;
  font-size: 18px;
  color: #ffffff;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.6);
}

.mock-app-desc {
  font-size: 11px;
  color: rgba(245, 245, 244, 0.8);
  line-height: 1.35;
  text-shadow: 0 1px 3px rgba(0,0,0,0.6);
}

.slide-coming-soon {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #18122b 0%, #09090b 100%);
}

.soon-content-box {
  display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px;
}
.soon-icon-lg { font-size: 36px; margin-bottom: 4px; }
.highlight-text { color: #c084fc !important; font-size: 18px; }

.loading-bar-line {
  width: 80px; height: 4px; background: rgba(168, 85, 247, 0.2);
  border-radius: 4px; overflow: hidden; margin-top: 8px; position: relative;
}
.loading-bar-line span {
  position: absolute; top: 0; left: 0; height: 100%; width: 40%;
  background: #c084fc; border-radius: 4px; animation: loadingSlide 1.5s infinite ease-in-out;
}

@keyframes loadingSlide {
  0% { left: -40%; }
  100% { left: 100%; }
}

.carousel-pips-controller {
  position: absolute;
  bottom: 12px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  z-index: 10;
}

.pip-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: rgba(255, 255, 255, 0.4); transition: all 0.3s ease;
}
.pip-dot.active { background: #3b82f6; width: 16px; border-radius: 4px; }

.home-gesture-bar {
  position: absolute;
  bottom: 4px; left: 50%; transform: translateX(-50%);
  width: 90px; height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  z-index: 10;
}
</style>