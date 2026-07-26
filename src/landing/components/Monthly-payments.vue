<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useReveal } from '../useReveal';

const router = useRouter();
const { el, revealed } = useReveal();
const sliderRef = ref<HTMLElement | null>(null);

const PLANS = [
  {
    name: 'Prueba Gratuita',
    price: '0',
    badge: '7 días gratis',
    features: ['Acceso completo por 7 días', 'Sin tarjeta de crédito requerida', 'Pasa automáticamente a Básica', 'Soporte estándar'],
    btnText: 'Comenzar gratis',
    popular: false,
    isFree: true
  },
  {
    name: 'Básica',
    price: '650',
    badge: null,
    features: ['1 Sede incluida', 'Hasta 100 miembros (usuarios)', 'Control total de pagos', 'Sin edición de colores del sistema', 'Sin IA integrada', 'Soporte estándar'],
    btnText: 'Seleccionar',
    popular: false,
    isFree: false
  },
  {
    name: 'Intermedia',
    price: '850',
    badge: null,
    features: ['Hasta 2 Sedes', 'Hasta 200 miembros (usuarios)', 'Sin edición de colores del sistema', 'Sin IA integrada', 'Control de pagos y reportes', 'Soporte estándar'],
    btnText: 'Seleccionar',
    popular: false,
    isFree: false
  },
  {
    name: 'Avanzada',
    price: '1,200',
    badge: null,
    features: ['Hasta 2 Sedes', 'Hasta 300 miembros (usuarios)', 'IA integrada (3 tokens/día)', 'Con edición de colores del sistema', 'Gestión de roles y pagos', 'Soporte estándar'],
    btnText: 'Seleccionar',
    popular: false,
    isFree: false
  },
  {
    name: 'Pro',
    price: '2,100',
    badge: 'Más popular',
    features: ['De 3 a 5 Sedes (o más)', 'Sin límite de miembros', 'IA sin límite de tokens', 'Con edición de colores del sistema', 'Estadísticas avanzadas', 'Recordatorios automáticos'],
    btnText: 'Seleccionar Pro',
    popular: true,
    isFree: false
  },
  {
    name: 'Sistema Permanente',
    price: '11,000',
    badge: 'Pago único',
    features: ['Licencia permanente básica', 'Sin mensualidades', 'Sin Módulos avanzados y IA','Instalación incluida', 'Soporte estándar'],
    btnText: 'Adquirir sistema',
    popular: false,
    isFree: false
  },
  {
    name: 'Sistema Avanzado',
    price: '26,000',
    badge: 'Pago único',
    features: ['Licencia permanente completa', 'Sin mensualidades', 'Módulos avanzados y IA', 'Soporte prioritario'],
    btnText: 'Adquirir sistema',
    popular: false,
    isFree: false
  }
];

// Función optimizada para guardar la selección y redirigir al registro
const selectPlan = (plan: typeof PLANS[0]) => {
  // 1. Guardamos los datos clave en localStorage para que Record.vue y MembershipModal los lean
  localStorage.setItem('selectedPlan', plan.name);
  localStorage.setItem('isFreePlan', plan.isFree ? 'true' : 'false');

  // 2. Redirigimos a la vista de registro pasando el plan por query string
  router.push({
    path: '/record',
    query: { plan: plan.name }
  });
};
</script>

<template>
  <section id="mensualidades" ref="el" class="pricing-wrapper">
    <!-- NUEVO FONDO: RED NEURONAL Y DESTELLOS GEOMÉTRICOS -->
    <div class="neural-network-bg">
      <div class="geometric-beam beam-1"></div>
      <div class="geometric-beam beam-2"></div>
      <div class="neural-grid"></div>
      <div class="stars-field"></div>
      <div class="ambient-glow"></div>
    </div>

    <div class="container">
      <div class="header" :class="{ revealed }">
        <h2 class="main-title">MENSUALIDADES Y <span class="text-accent">SISTEMAS</span></h2>
        <p class="subtitle">Planes flexibles y opciones de pago único diseñados para adaptarse al crecimiento de tu centro deportivo.</p>
      </div>

      <!-- Carrusel / Contenedor de Planes -->
      <div class="pricing-container" :class="{ revealed }">
        <div class="pricing-slider" ref="sliderRef">
          <div
            v-for="(plan, i) in PLANS"
            :key="plan.name"
            class="pricing-card"
            :class="{ 
              'no-badge': !plan.badge && !plan.popular,
              'popular-card': plan.popular
            }"
            :style="{ 
              transitionDelay: `${i * 0.08}s`,
              animationDelay: `${i * 0.4}s` 
            }"
          >
            <div>
              <div v-if="plan.popular" class="badge-popular">Más popular</div>
              <div v-else-if="plan.badge" class="badge-standard">{{ plan.badge }}</div>
              
              <div class="plan-name">{{ plan.name }}</div>
              <div class="price">
                <span class="currency">$</span>
                <span class="amount">{{ plan.price }}</span>
                <span v-if="!plan.badge?.includes('Pago único')" class="month">/mes</span>
              </div>
              <div v-for="feature in plan.features" :key="feature" class="feature">
                {{ feature }}
              </div>
            </div>
            <!-- Se pasa el objeto plan completo a la función selectPlan -->
            <button class="plan-btn" @click="selectPlan(plan)">{{ plan.btnText }}</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pricing-wrapper {
  position: relative;
  scroll-margin-top: 84px;
  padding: clamp(80px, 10vw, 130px) clamp(20px, 5vw, 60px);
  background: #02040a;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
}

.container { max-width: 1450px; margin: 0 auto; position: relative; z-index: 2; }

.neural-network-bg {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 1;
  background: #02040a;
  overflow: hidden;
}

.geometric-beam {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.18;
  pointer-events: none;
}

.beam-1 {
  background: #06b6d4;
  top: -15%;
  left: 20%;
  animation: pulseBeam1 12s ease-in-out infinite alternate;
}

.beam-2 {
  background: #3b82f6;
  bottom: -15%;
  right: 15%;
  animation: pulseBeam2 15s ease-in-out infinite alternate;
}

@keyframes pulseBeam1 {
  0% { transform: scale(1) translate(0, 0); opacity: 0.15; }
  100% { transform: scale(1.3) translate(50px, 30px); opacity: 0.28; }
}

@keyframes pulseBeam2 {
  0% { transform: scale(1.1) translate(0, 0); opacity: 0.15; }
  100% { transform: scale(0.9) translate(-40px, -50px); opacity: 0.25; }
}

.neural-grid {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.08) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(circle at 50% 30%, black 10%, transparent 85%);
}

.stars-field {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(rgba(255, 255, 255, 0.3) 1.2px, transparent 1.2px),
    radial-gradient(rgba(6, 182, 212, 0.4) 1px, transparent 1px);
  background-size: 110px 110px, 70px 70px;
  background-position: 0 0, 35px 35px;
  opacity: 0.35;
  animation: twinkleStars 25s linear infinite;
}

@keyframes twinkleStars {
  from { transform: translateY(0); }
  to { transform: translateY(-110px); }
}

.ambient-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 30%, rgba(2, 4, 10, 0.94) 100%);
}

.header {
  text-align: center;
  margin-bottom: 70px;
  opacity: 0;
  transform: translateY(22px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.header.revealed { opacity: 1; transform: translateY(0); }

.main-title {
  font-family: 'Anton', sans-serif;
  font-size: clamp(2.4rem, 6vw, 4.2rem);
  text-transform: uppercase;
  margin: 0;
  color: #ffffff;
  letter-spacing: 1.5px;
}

.text-accent { color: #06b6d4; }

.subtitle {
  font-size: 17px;
  color: rgba(245, 245, 244, 0.7);
  max-width: 650px;
  margin: 16px auto 0;
  line-height: 1.6;
}

.pricing-container {
  position: relative;
  opacity: 0;
  transform: translateY(22px);
  transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
}

.pricing-container.revealed {
  opacity: 1;
  transform: translateY(0);
}

.pricing-slider {
  display: flex;
  gap: 30px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  padding: 30px 15px 50px 15px;
  width: 100%;
  scrollbar-width: none; 
  -ms-overflow-style: none;
}

.pricing-slider::-webkit-scrollbar {
  display: none;
}

@keyframes cardFloat {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
}

.pricing-card {
  flex: 0 0 370px;
  scroll-snap-align: start;
  background: rgba(10, 14, 26, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 26px;
  padding: 40px 32px;
  min-height: 540px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #a1a1a1;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  animation: cardFloat 6s ease-in-out infinite;
}

.pricing-card.popular-card {
  border-color: rgba(6, 182, 212, 0.45);
  background: rgba(13, 20, 36, 0.92);
  box-shadow: 0 20px 45px rgba(6, 182, 212, 0.2);
}

.pricing-card.no-badge .plan-name {
  margin-top: 3.2rem;
}

.pricing-card:hover {
  animation-play-state: paused;
  background: rgba(18, 26, 46, 0.95);
  border-color: #06b6d4;
  transform: translateY(-14px) scale(1.02);
  box-shadow: 0 35px 70px rgba(6, 182, 212, 0.3);
  color: #f5f5f4;
}

.pricing-card .amount {
  color: #ffffff;
  transition: color 0.4s ease;
}

.badge-popular, .badge-standard {
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  padding: 6px 14px;
  border-radius: 8px;
  margin-bottom: 20px;
  transition: background 0.4s ease;
}

.badge-popular { background: #06b6d4; color: #02040a; }
.badge-standard { background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1); color: #d4d4d4; }

.plan-name {
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 20px;
  color: #ffffff;
  letter-spacing: 0.5px;
}

.price {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  margin-bottom: 28px;
  color: #ffffff;
}

.currency { font-size: 24px; font-weight: 700; margin-top: 7px; color: #06b6d4; }
.amount { font-family: 'Anton', sans-serif; font-size: clamp(2.8rem, 5vw, 3.8rem); line-height: 1; letter-spacing: -1px; }
.month { font-size: 14px; color: #888888; margin-top: auto; padding-bottom: 5px; }

.feature {
  font-size: 14.5px;
  color: rgba(245, 245, 244, 0.75);
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.feature::before { content: "✓"; color: #06b6d4; font-weight: 700; font-size: 15px; }

.plan-btn {
  margin-top: auto;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #d4d4d4;
  text-align: center;
  padding: 16px;
  border-radius: 16px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 13.5px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  min-height: 52px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  width: 100%;
}

.pricing-card:hover .plan-btn {
  background: #06b6d4;
  border-color: #06b6d4;
  color: #02040a;
}

.plan-btn:hover {
  background: #0891b2 !important;
  border-color: #0891b2 !important;
  color: #ffffff !important;
}

@media (max-width: 768px) {
  .pricing-card {
    flex: 0 0 85vw;
    animation: none;
  }
}
</style>