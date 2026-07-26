<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useReveal } from '../useReveal';

const { el, revealed } = useReveal();

const countersAnimated = ref(false);

const animateValue = (element: HTMLElement, start: number, end: number, duration: number) => {
  let startTimestamp: number | null = null;
  const isPercentage = element.innerText.includes('%');
  const isPlus = element.innerText.includes('+');
  const isSlash = element.innerText.includes('/');
  
  const step = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const current = progress * (end - start) + start;
    
    let displayValue = Math.round(current).toString();
    if (isPlus) displayValue = '+' + displayValue;
    if (isPercentage) displayValue = displayValue + '%';
    if (isSlash) displayValue = displayValue + '/7';
    
    element.innerText = displayValue;
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
};

const onMetricsVisible = (entries: IntersectionObserverEntry[]) => {
  if (entries[0]?.isIntersecting && !countersAnimated.value) {
    countersAnimated.value = true;
    nextTick(() => {
      const valueElements = document.querySelectorAll('.metric-value.animate-number');
      valueElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const valueStr = htmlEl.innerText.replace('+', '').replace('%', '').replace('/7', '');
        const endValue = parseInt(valueStr, 10);
        if (!isNaN(endValue)) {
          animateValue(htmlEl, 0, endValue, 2000);
        }
      });
    });
  }
};

const vIntersect = {
  mounted(el: HTMLElement, binding: { value: IntersectionObserverCallback }) {
    const observer = new IntersectionObserver(binding.value, {
      threshold: 0.1,
    });
    observer.observe(el);
    (el as any)._vIntersectObserver = observer;
  },
  unmounted(el: HTMLElement) {
    const observer = (el as any)._vIntersectObserver;
    if (observer) observer.disconnect();
  },
};
</script>

<template>
  <section id="resultados" ref="el" class="stats-section" :class="{ revealed }">
    <!-- FONDO CON LÍNEAS LÁSER Y PARTÍCULAS DE LUZ EN MOVIMIENTO -->
    <div class="dynamic-lines-bg">
      <div class="laser-line line-h-1"></div>
      <div class="laser-line line-h-2"></div>
      <div class="laser-line line-v-1"></div>
      <div class="laser-line line-v-2"></div>
      <div class="floating-particle particle-1"></div>
      <div class="floating-particle particle-2"></div>
      <div class="floating-particle particle-3"></div>
      <div class="floating-particle particle-4"></div>
      <div class="bg-center-glow"></div>
    </div>

    <div class="container">
      <!-- Encabezado de Sección -->
      <div class="section-header">
        <span class="badge-pill">Resultados comprobados</span>
        <h2 class="section-title">Haz crecer tu negocio <span class="text-accent">sin límites</span></h2>
        <p class="section-subtitle">No somos solo una app; somos tu socio estratégico para llevar la gestión deportiva al siguiente nivel.</p>
      </div>

      <!-- Tarjeta Principal de Estadísticas -->
      <div v-intersect="onMetricsVisible" class="metrics-glass-card">
        <div class="metric-item">
          <span class="metric-value green-glow animate-number">+340%</span>
          <span class="metric-label">Crecimiento medio de ingresos</span>
        </div>
        <div class="metric-divider"></div>
        <div class="metric-item">
          <span class="metric-value green-glow animate-number">98%</span>
          <span class="metric-label">Retención de clientes activos</span>
        </div>
        <div class="metric-divider"></div>
        <div class="metric-item">
          <span class="metric-value purple-glow animate-number">24/7</span>
          <span class="metric-label">Soporte técnico disponible</span>
        </div>
      </div>

      <!-- Grid de Beneficios -->
      <div class="benefits-grid-title">Por qué elegir FitManage Pro</div>
      <div class="benefits-grid">
        <div class="benefit-card">
          <div class="benefit-icon green-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div class="benefit-text">Tus datos y los de tus socios están seguros con respaldos automáticos diarios.</div>
        </div>

        <div class="benefit-card">
          <div class="benefit-icon purple-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div class="benefit-text">Controla todas tus sucursales y empleados desde un mismo lugar y en tiempo real.</div>
        </div>

        <div class="benefit-card">
          <div class="benefit-icon yellow-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
          <div class="benefit-text">Cobra membresías automáticamente con tarjeta y evita las filas en la recepción.</div>
        </div>

        <div class="benefit-card">
          <div class="benefit-icon green-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
          </div>
          <div class="benefit-text">Tus clientes usan una aplicación con el nombre de tu gimnasio y tus entrenadores administran sus rutinas fácilmente.</div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.stats-section {
  position: relative;
  padding: clamp(70px, 9vw, 110px) clamp(20px, 4vw, 60px);
  background: #080808;
  color: #f5f5f4;
  font-family: 'Inter', sans-serif;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.7s ease, transform 0.7s ease;
  overflow: hidden;
}

.stats-section.revealed { opacity: 1; transform: translateY(0); }

.container { max-width: 1350px; margin: 0 auto; position: relative; z-index: 2; }

/* --- FONDO DINÁMICO CON LÍNEAS LÁSER Y PARTÍCULAS --- */
.dynamic-lines-bg {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: #050508;
  z-index: 0;
  overflow: hidden;
}

/* Líneas láser deslizándose */
.laser-line {
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent);
  pointer-events: none;
}

.line-h-1 {
  width: 100%; height: 1px;
  top: 25%; left: 0;
  animation: slideHorizontal 7s linear infinite;
}

.line-h-2 {
  width: 100%; height: 1px;
  top: 75%; left: 0;
  animation: slideHorizontal 10s linear infinite reverse;
}

.line-v-1 {
  width: 1px; height: 100%;
  left: 20%; top: 0;
  background: linear-gradient(180deg, transparent, rgba(168, 85, 247, 0.3), transparent);
  animation: slideVertical 8s linear infinite;
}

.line-v-2 {
  width: 1px; height: 100%;
  right: 20%; top: 0;
  background: linear-gradient(180deg, transparent, rgba(16, 185, 129, 0.3), transparent);
  animation: slideVertical 9s linear infinite reverse;
}

@keyframes slideHorizontal {
  0% { transform: translateX(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
}

@keyframes slideVertical {
  0% { transform: translateY(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(100%); opacity: 0; }
}

/* Partículas brillantes flotantes */
.floating-particle {
  position: absolute;
  border-radius: 50%;
  filter: blur(2px);
  pointer-events: none;
  animation: moveParticles 12s ease-in-out infinite alternate;
}

.particle-1 {
  width: 8px; height: 8px;
  background: #3b82f6;
  box-shadow: 0 0 12px #3b82f6;
  top: 15%; left: 10%;
  animation-delay: 0s;
}

.particle-2 {
  width: 6px; height: 6px;
  background: #10b981;
  box-shadow: 0 0 10px #10b981;
  top: 70%; left: 85%;
  animation-delay: -3s;
  animation-duration: 15s;
}

.particle-3 {
  width: 10px; height: 10px;
  background: #a855f7;
  box-shadow: 0 0 15px #a855f7;
  top: 80%; left: 15%;
  animation-delay: -5s;
  animation-duration: 10s;
}

.particle-4 {
  width: 7px; height: 7px;
  background: #f59e0b;
  box-shadow: 0 0 10px #f59e0b;
  top: 20%; right: 15%;
  animation-delay: -2s;
  animation-duration: 14s;
}

@keyframes moveParticles {
  0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
  50% { transform: translate(40px, -60px) scale(1.4); opacity: 1; }
  100% { transform: translate(-30px, 50px) scale(0.8); opacity: 0.4; }
}

.bg-center-glow {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 700px; height: 350px;
  background: radial-gradient(ellipse at center, rgba(37, 99, 235, 0.1) 0%, transparent 70%);
  filter: blur(50px);
  pointer-events: none;
}

/* ENCABEZADO */
.section-header {
  text-align: center;
  max-width: 750px;
  margin: 0 auto 50px auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.badge-pill {
  font-family: 'Oswald', sans-serif;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  padding: 7px 16px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #60a5fa;
  border-radius: 30px;
}

.section-title {
  font-family: 'Anton', sans-serif;
  font-size: clamp(2.2rem, 5vw, 4.2rem);
  line-height: 1.1;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
}

.text-accent { color: #06b6d4; }

.section-subtitle {
  font-size: clamp(14px, 2vw, 16px);
  color: rgba(245, 245, 244, 0.7);
  line-height: 1.6;
  margin: 0;
  max-width: 650px;
}

/* MÉTRICAS GLASSMORPHISM */
.metrics-glass-card {
  background: linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(5, 5, 5, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: clamp(30px, 5vw, 50px) clamp(20px, 4vw, 40px);
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
  margin-bottom: 70px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  position: relative;
  z-index: 1;
}

.metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  flex: 1;
}

.metric-value {
  font-family: 'Anton', sans-serif;
  font-size: clamp(2.5rem, 6vw, 5rem);
  line-height: 1;
  letter-spacing: 2px;
}

.green-glow {
  color: #10b981;
  text-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
}

.purple-glow {
  color: #a855f7;
  text-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
}

.metric-label {
  font-size: clamp(12px, 1.5vw, 15px);
  color: rgba(245, 245, 244, 0.7);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-divider {
  width: 1px;
  height: 70px;
  background: rgba(255, 255, 255, 0.08);
}

/* GRID DE BENEFICIOS */
.benefits-grid-title {
  text-align: center;
  font-family: 'Oswald', sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(245, 245, 244, 0.5);
  margin-bottom: 30px;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.benefit-card {
  background: rgba(20, 20, 20, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 18px;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, border-color 0.3s ease, background 0.3s ease;
}

.benefit-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.15);
  background: rgba(30, 30, 30, 0.85);
}

.benefit-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.benefit-icon svg { width: 24px; height: 24px; }

.green-icon { background: rgba(16, 185, 129, 0.12); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.25); }
.purple-icon { background: rgba(168, 85, 247, 0.12); color: #a855f7; border: 1px solid rgba(168, 85, 247, 0.25); }
.yellow-icon { background: rgba(245, 158, 11, 0.12); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.25); }

.benefit-text {
  font-size: 14.5px;
  color: rgba(245, 245, 244, 0.85);
  line-height: 1.5;
}

/* RESPONSIVO MÓVIL OPTIMIZADO */
@media (max-width: 900px) {
  .metrics-glass-card {
    flex-direction: column;
    gap: 30px;
    padding: 35px 20px;
  }
  
  .metric-divider {
    width: 80%;
    height: 1px;
  }

  .benefits-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .stats-section {
    padding: 50px 16px;
  }

  .benefit-card {
    padding: 18px;
    gap: 14px;
  }

  .benefit-icon {
    width: 40px;
    height: 40px;
  }
  
  .benefit-icon svg {
    width: 20px;
    height: 20px;
  }

  .benefit-text {
    font-size: 13.5px;
  }
}
</style>