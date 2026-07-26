<script setup lang="ts">
import { useReveal } from '../useReveal';

const { el, revealed } = useReveal();

const BENEFITS = [
  {
    title: 'Gestión Financiera e Ingresos',
    text: 'Control total de ingresos, saldos pendientes y deudores de forma automatizada, optimizando tu flujo de caja con alertas inteligentes.',
    tag: 'Control Financiero',
    highlighted: false,
    colSpan: 'col-span-1',
  },
  {
    title: 'Acceso Biomédico y QR',
    text: 'Tecnología de reconocimiento facial y códigos QR en tiempo real para garantizar un flujo de entrada rápido, seguro y libre de suplantaciones.',
    tag: 'Seguridad Avanzada',
    highlighted: true,
    colSpan: 'col-span-2',
  },
  {
    title: 'Asistente IA Integrado',
    text: 'Consulta métricas clave, reportes de asistencia y proyecciones de negocio conversando de manera natural, sin complejos paneles de control.',
    tag: 'Inteligencia Artificial',
    highlighted: false,
    colSpan: 'col-span-1',
  },
  {
    title: 'Experiencia y Fidelización',
    text: 'Herramientas diseñadas para elevar la retención de tus clientes mediante notificaciones personalizadas, rutinas y un seguimiento impecable.',
    tag: 'Retención Activa',
    highlighted: false,
    colSpan: 'col-span-2',
  },
];
</script>

<template>
  <section id="beneficios" ref="el" class="benefits-wrapper">
    <!-- Fondo animado con formas geométricas (cuadros) flotantes y blobs de luz -->
    <div class="background-animation">
      <div class="mesh-blob blob-1"></div>
      <div class="mesh-blob blob-2"></div>
      <!-- Cuadros / Elementos geométricos flotantes en el fondo fondo -->
      <div class="floating-box box-1"></div>
      <div class="floating-box box-2"></div>
      <div class="floating-box box-3"></div>
      <div class="floating-box box-4"></div>
    </div>

    <div class="container">
      <div class="header" :class="{ revealed }">
        <span class="section-badge">Ventajas Competitivas</span>
        <h2 class="main-title">
          DISEÑADO PARA LLEVAR TU GYM<br />
          <span class="text-accent">AL SIGUIENTE NIVEL</span>
        </h2>
        <p class="subtitle">
          Una arquitectura tecnológica robusta pensada para automatizar operaciones y maximizar la rentabilidad de tu negocio fitness.
        </p>
      </div>

      <div class="benefits-grid">
        <div
          v-for="(item, i) in BENEFITS"
          :key="item.title"
          :class="['benefit-card', item.colSpan, { highlighted: item.highlighted, revealed }]"
          :style="{ transitionDelay: `${i * 0.12}s` }"
        >
          <!-- Efecto de brillo interior -->
          <div class="card-glow-effect"></div>

          <div class="card-content">
            <span class="card-tag">{{ item.tag }}</span>
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-text">{{ item.text }}</p>
          </div>

          <div class="card-footer-icon" v-if="item.highlighted">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14m-7-7 7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.benefits-wrapper {
  position: relative;
  scroll-margin-top: 84px;
  padding: clamp(80px, 10vw, 140px) clamp(20px, 5vw, 60px);
  background: #09090b;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
  color: #f5f5f4;
}

/* Fondo animado profundo con cuadros y blobs */
.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

/* Efectos de luz difusa (blobs) */
.mesh-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.35;
  will-change: transform;
}

.blob-1 {
  width: 550px;
  height: 550px;
  background: rgba(28, 79, 214, 0.45);
  top: -10%;
  left: 5%;
  animation: moveBlob1 16s ease-in-out infinite alternate;
}

.blob-2 {
  width: 650px;
  height: 650px;
  background: rgba(14, 116, 144, 0.3);
  bottom: -20%;
  right: 5%;
  animation: moveBlob2 20s ease-in-out infinite alternate;
}

@keyframes moveBlob1 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(80px, 100px) scale(1.15); }
}

@keyframes moveBlob2 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-90px, -70px) scale(1.2); }
}

/* Cuadros flotantes animados en el fondo fondo */
.floating-box {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.04);
  background: rgba(255, 255, 255, 0.01);
  border-radius: 16px;
  backdrop-filter: blur(2px);
  will-change: transform;
}

.box-1 {
  width: 140px;
  height: 140px;
  top: 15%;
  left: 8%;
  animation: floatBox1 12s ease-in-out infinite;
}

.box-2 {
  width: 200px;
  height: 200px;
  top: 60%;
  left: 3%;
  animation: floatBox2 16s ease-in-out infinite;
}

.box-3 {
  width: 160px;
  height: 160px;
  top: 10%;
  right: 10%;
  animation: floatBox3 14s ease-in-out infinite;
}

.box-4 {
  width: 110px;
  height: 110px;
  bottom: 12%;
  right: 15%;
  animation: floatBox1 10s ease-in-out infinite reverse;
}

@keyframes floatBox1 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(8deg); }
}

@keyframes floatBox2 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-45px) rotate(-10deg); }
}

@keyframes floatBox3 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(35px) rotate(12deg); }
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* Cabecera */
.header {
  text-align: center;
  margin-bottom: 60px;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.header.revealed { opacity: 1; transform: translateY(0); }

.section-badge {
  display: inline-block;
  padding: 6px 14px;
  background: rgba(28, 79, 214, 0.12);
  border: 1px solid rgba(28, 79, 214, 0.3);
  border-radius: 20px;
  font-family: 'Oswald', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1.2px;
  color: #4a7cf0;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.main-title {
  font-family: 'Anton', sans-serif;
  font-size: clamp(2.2rem, 5vw, 4rem);
  line-height: 1.05;
  text-transform: uppercase;
  margin: 0 0 18px;
  letter-spacing: -0.5px;
}

.text-accent {
  background: linear-gradient(135deg, #3a6bd6 0%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 16px;
  line-height: 1.6;
  color: rgba(245, 245, 244, 0.65);
  max-width: 600px;
  margin: 0 auto;
}

/* Grid Bento */
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.col-span-1 { grid-column: span 1; }
.col-span-2 { grid-column: span 2; }

@media (max-width: 1024px) {
  .benefits-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .col-span-1, .col-span-2 { grid-column: span 1; }
}

@media (max-width: 640px) {
  .benefits-grid { grid-template-columns: 1fr; }
}

/* Tarjetas */
.benefit-card {
  position: relative;
  background: rgba(18, 18, 22, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 24px;
  padding: clamp(32px, 3.5vw, 44px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.7s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.benefit-card.revealed { opacity: 1; transform: translateY(0); }

.benefit-card:hover {
  transform: translateY(-8px);
  border-color: rgba(58, 107, 214, 0.45);
  box-shadow: 0 22px 45px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(28, 79, 214, 0.18);
}

.card-glow-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(700px circle at 50% 0%, rgba(58, 107, 214, 0.1), transparent 60%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}
.benefit-card:hover .card-glow-effect { opacity: 1; }

/* Tarjeta Destacada principal */
.benefit-card.highlighted {
  background: linear-gradient(135deg, #1c4fd6 0%, #11369c 100%);
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: 0 15px 35px rgba(28, 79, 214, 0.35);
}

.benefit-card.highlighted:hover {
  border-color: rgba(255, 255, 255, 0.35);
  box-shadow: 0 25px 50px rgba(28, 79, 214, 0.55);
}

.card-content {
  position: relative;
  z-index: 2;
}

.card-tag {
  display: inline-block;
  font-family: 'Oswald', sans-serif;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #60a5fa;
  margin-bottom: 16px;
  background: rgba(96, 165, 250, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
}

.benefit-card.highlighted .card-tag {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.2);
}

.card-title {
  font-family: 'Oswald', sans-serif;
  font-size: clamp(1.35rem, 1.8vw, 1.6rem);
  font-weight: 700;
  margin: 0 0 14px;
  letter-spacing: 0.2px;
  color: #f5f5f4;
}

.benefit-card.highlighted .card-title { color: #ffffff; }

.card-text {
  font-size: 15px;
  line-height: 1.65;
  color: rgba(245, 245, 244, 0.65);
  margin: 0;
}

.benefit-card.highlighted .card-text { color: rgba(255, 255, 255, 0.88); }

.card-footer-icon {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  color: rgba(255, 255, 255, 0.9);
  transition: transform 0.3s ease;
  position: relative;
  z-index: 2;
}

.benefit-card.highlighted:hover .card-footer-icon {
  transform: translateX(6px);
}
</style>