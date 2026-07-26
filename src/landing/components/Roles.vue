<script setup lang="ts">
import { useReveal } from '../useReveal';

const { el, revealed } = useReveal();

const ROLES = [
  {
    name: 'Dirección / Gerencia',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9h1"/><path d="M9 13h1"/><path d="M9 17h1"/></svg>`,
    accent: '#3b82f6', // Azul
    desc: 'Toma decisiones inteligentes y maximiza la rentabilidad.',
    items: ['Panel de control financiero en tiempo real', 'Automatización de cobros y gestión de membresías', 'Reportes de rendimiento con Inteligencia Artificial', 'Supervisión operativa de todo el staff'],
  },
  {
    name: 'Entrenador',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5h11M6.5 17.5h11M2 12h20M2 8h2v8H2zm20 0h-2v8h2z"/></svg>`,
    accent: '#10b981', // Verde
    desc: 'Potencia el rendimiento de tus alumnos y fidelízalos.',
    items: ['Diseño y asignación de rutinas personalizadas', 'Seguimiento detallado del progreso físico', 'Gestión de agenda de clases y entrenamientos', 'Comunicación directa para mayor retención'],
  },
  {
    name: 'Recepcionista',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    accent: '#f59e0b', // Amarillo/Naranja
    desc: 'Brinda una experiencia de bienvenida ágil y sin fricciones.',
    items: ['Check-in ultra rápido de clientes', 'Validación de accesos biométrica o QR', 'Venta y renovación de servicios en mostrador', 'Gestión eficiente de la base de datos'],
  },
  {
    name: 'Usuario / Miembro',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
    accent: '#8b5cf6', // Púrpura
    desc: 'Alcanza tus objetivos con tu gimnasio en la palma de tu mano.',
    items: ['Visualización de rutinas y registro de marcas', 'Reserva de clases y control de asistencia', 'Historial de pagos y autogestión de membresía', 'Gráficos de evolución y logros personales'],
  },
];
</script>

<template>
  <section id="roles" ref="el" class="roles-section">
    <!-- FONDO ANIMADO CON ROTACIÓN Y PULSO -->
    <div class="tech-network-bg">
      <div class="rotating-glow-shape"></div>
      <div class="network-lines"></div>
      <div class="network-dots"></div>
      <div class="vignette"></div>
    </div>

    <div class="container">
      <div class="section-header" :class="{ revealed }">
        <span class="badge-pill">Solución Integral</span>
        <h2 class="section-title">Una plataforma para <span class="text-accent">cada necesidad</span></h2>
        <p class="section-subtitle">Centralizamos la operación de tu centro deportivo. Cada perfil tiene las herramientas precisas para potenciar su rol y alcanzar sus objetivos.</p>
      </div>

      <!-- DISEÑO BENTO GRID RESPONSIVO -->
      <div class="bento-grid">
        <div
          v-for="(role, i) in ROLES"
          :key="role.name"
          class="bento-card"
          :class="[`card-${i+1}`, { revealed }]"
          :style="{ '--card-accent': role.accent, transitionDelay: `${i * 0.15}s` }"
        >
          <div class="card-content">
            <div class="icon-box" v-html="role.icon"></div>
            <h3 class="role-title">{{ role.name }}</h3>
            <p class="role-tagline">{{ role.desc }}</p>
            <ul class="feature-list">
              <li v-for="item in role.items" :key="item">
                <span class="check-icon">✓</span> {{ item }}
              </li>
            </ul>
          </div>
          <div class="card-shine"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.roles-section {
  position: relative;
  scroll-margin-top: 70px;
  padding: clamp(60px, 9vw, 120px) clamp(16px, 4vw, 40px);
  background: #050508;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
}

.container { max-width: 1200px; margin: 0 auto; position: relative; z-index: 2; }

/* --- FONDO ANIMADO AVANZADO --- */
.tech-network-bg {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 1;
  background: radial-gradient(circle at center, #0f101c 0%, #050508 100%);
  overflow: hidden;
}

/* Figura geométrica luminosa giratoria en el fondo */
.rotating-glow-shape {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: conic-gradient(from 0deg at 50% 50%, rgba(58, 107, 214, 0.08) 0deg, rgba(16, 185, 129, 0.05) 120deg, rgba(139, 92, 246, 0.08) 240deg, rgba(58, 107, 214, 0.08) 360deg);
  border-radius: 40%;
  filter: blur(80px);
  animation: rotateBgShape 20s linear infinite;
  pointer-events: none;
}

@keyframes rotateBgShape {
  from { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
  to { transform: translate(-50%, -50%) rotate(360deg) scale(1.1); }
}

.network-lines {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(circle at 50% 50%, black 10%, transparent 90%);
  animation: moveLines 50s linear infinite;
}

@keyframes moveLines {
  from { background-position: 0 0; }
  to { background-position: 40px 40px; }
}

.network-dots {
  position: absolute;
  inset: -50px;
  background-image: radial-gradient(rgba(58, 107, 214, 0.25) 1.5px, transparent 1.5px);
  background-size: 60px 60px;
  mask-image: radial-gradient(circle at 50% 50%, black 20%, transparent 85%);
  animation: pulseDots 5s ease-in-out infinite alternate;
}

@keyframes pulseDots {
  from { opacity: 0.3; transform: scale(1); }
  to { opacity: 0.8; transform: scale(1.03); }
}

.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, transparent 40%, rgba(5, 5, 8, 0.95) 100%);
}

/* --- ENCABEZADO --- */
.section-header {
  text-align: center;
  margin-bottom: 50px;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.section-header.revealed { opacity: 1; transform: translateY(0); }

.badge-pill {
  display: inline-block;
  font-family: 'Oswald', sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.8px;
  padding: 7px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #a3a3a3;
  border-radius: 30px;
  margin-bottom: 14px;
}

.section-title {
  font-family: 'Anton', sans-serif;
  font-size: clamp(2.2rem, 5.5vw, 4.2rem);
  line-height: 1.05;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 16px 0;
}

.text-accent { color: #3a6bd6; }

.section-subtitle {
  font-size: clamp(14px, 1.8vw, 17px);
  color: rgba(245, 245, 244, 0.7);
  line-height: 1.6;
  margin: 0 auto;
  max-width: 650px;
}

/* --- BENTO GRID LAYOUT --- */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

.bento-card {
  background: rgba(18, 18, 22, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: clamp(24px, 3vw, 36px);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: opacity 0.7s ease-out, transform 0.7s ease-out, border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
}

.bento-card.revealed { opacity: 1; transform: translateY(0); }

.bento-card:hover {
  border-color: var(--card-accent);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  background: rgba(25, 25, 32, 0.85);
  transform: translateY(-4px);
}

.card-shine {
  position: absolute;
  top: -50%; left: -50%;
  width: 200%; height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}
.bento-card:hover .card-shine { opacity: 1; }

/* Pos distribuciones del Bento Grid */
.card-1 { grid-column: span 3; }
.card-2 { grid-column: span 3; }
.card-3 { grid-column: span 4; }
.card-4 { grid-column: span 2; }

/* Responsive Grid para Tablets y Celulares */
@media (max-width: 1024px) {
  .card-1, .card-2 { grid-column: span 3; }
  .card-3, .card-4 { grid-column: span 3; }
}

@media (max-width: 768px) {
  .card-1, .card-2, .card-3, .card-4 { grid-column: span 6; }
}

/* Contenido de la tarjeta */
.card-content { position: relative; z-index: 2; }

.icon-box {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: var(--card-accent);
}

.icon-box :deep(svg) {
  width: 24px;
  height: 24px;
  stroke: var(--card-accent);
}

.role-title {
  font-family: 'Anton', sans-serif;
  font-size: clamp(1.4rem, 2.5vw, 1.8rem);
  color: #ffffff;
  text-transform: uppercase;
  margin: 0 0 6px 0;
  letter-spacing: 0.5px;
}

.role-tagline {
  font-size: 13px;
  color: var(--card-accent);
  font-weight: 600;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.4;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-list li {
  font-size: 14px;
  color: rgba(245, 245, 244, 0.8);
  display: flex;
  align-items: flex-start;
  gap: 10px;
  line-height: 1.4;
}

.check-icon {
  color: var(--card-accent);
  font-weight: 900;
  font-size: 13px;
  margin-top: 2px;
  flex: none;
}
</style>