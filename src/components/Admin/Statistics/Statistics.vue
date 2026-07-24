<script setup>
import { ref } from 'vue';
import HeadingAdmin from '../HeadingAdmin.vue';
import FitnessPet from '@/components/FitnessPet.vue'; // <-- Importación correcta del componente

// Estado para el buscador de usuarios
const searchQuery = ref('');

// Datos del usuario y métricas corporales
const user = ref({
  nombre: 'Jose Luis Ramirez Sanchez',
  id: 'Gym001',
  pesoInicial: '70 kg',
  pesoActual: '90 kg',
  estatura: '1.78 m',
  grasaCorporal: '18.5%',
  masaMuscular: '42.0 kg',
  caloriasPromedio: '2,450 kcal',
  inscripcion: '14/02/2026',
  celular: '+52 4811243421',
  correo: 'joseluis@gmail.com',
  asistenciaPorcentaje: 76,
  proximoCorte: '16/Abril/2026',
  saldoAPagar: '$650.00'
});

// Configuración de la racha y mascota del usuario
const rachaInfo = ref({
  dias: 5,
  nombreMascota: 'Foxy el zorro fitness',
  nivelMascota: 'Nivel 3'
});

// Configuración del calendario de Mayo 2026
const diasCalendario = ref([
  { dia: 1, estado: 'asistio' },
  { dia: 2, estado: 'asistio' },
  { dia: 3, estado: 'asistio' },
  { dia: 4, estado: 'asistio' },
  { dia: 5, estado: 'falto' },
  { dia: 6, estado: 'falto' },
  { dia: 7, estado: 'falto' },
  { dia: 8, estado: 'falto' },
  { dia: 9, estado: 'asistio' },
  { dia: 10, estado: 'hoy' },
  { dia: 11, estado: 'futuro' },
  { dia: 12, estado: 'futuro' },
  { dia: 13, estado: 'futuro' },
  { dia: 14, estado: 'futuro' },
  { dia: 15, estado: 'futuro' },
  { dia: 16, estado: 'futuro' },
  { dia: 17, estado: 'futuro' },
  { dia: 18, estado: 'futuro' },
  { dia: 19, estado: 'futuro' },
  { dia: 20, estado: 'futuro' },
  { dia: 21, estado: 'futuro' },
  { dia: 22, estado: 'futuro' },
  { dia: 23, estado: 'futuro' },
  { dia: 24, estado: 'futuro' },
  { dia: 25, estado: 'futuro' },
  { dia: 26, estado: 'futuro' },
  { dia: 27, estado: 'futuro' },
  { dia: 28, estado: 'futuro' },
  { dia: 29, estado: 'futuro' },
  { dia: 30, estado: 'futuro' },
  { dia: 31, estado: 'futuro' },
]);
</script>

<template>
  <HeadingAdmin>
    <main class="main-content">
      <div class="glow"></div>

      <div class="stats-container">
        
        <!-- ENCABEZADO Y BUSCADOR DE USUARIO -->
        <div class="view-header-flex">
          <div class="view-header">
            <h1 class="title">Estadísticas <span class="highlight-text">del Usuario</span></h1>
            <p class="subtitle">Monitoreo integral de composición corporal, rendimiento y asistencias</p>
          </div>

          <!-- BARRA DE BÚSQUEDA -->
          <div class="search-bar-wrapper">
            <div class="search-input-container">
              <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Buscar por nombre o ID..." 
                class="search-input"
              />
            </div>
          </div>
        </div>

        <div class="dashboard-grid">
          
          <!-- COLUMNA IZQUIERDA: Perfil, Datos Corporales y Finanzas -->
          <div class="column-left">
            <div class="user-profile-card">
              <div class="profile-header-tag">Usuario Activo</div>
              
              <div class="profile-main-info">
                <div class="avatar-wrapper">
                  <div class="avatar-circle">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <div class="attendance-badge">{{ user.asistenciaPorcentaje }}% asistencia</div>
                </div>
                
                <div class="user-names">
                  <h2>{{ user.nombre }}</h2>
                  <span class="user-id">ID: {{ user.id }}</span>
                </div>
              </div>

              <!-- MÉTRICAS CORPORALES -->
              <div class="section-subtitle-small">Composición Corporal</div>
              <div class="metrics-grid">
                <div class="metric-box">
                  <span class="metric-label">Peso Inicial</span>
                  <span class="metric-value">{{ user.pesoInicial }}</span>
                </div>
                <div class="metric-box">
                  <span class="metric-label">Peso Actual</span>
                  <span class="metric-value accent">{{ user.pesoActual }}</span>
                </div>
                <div class="metric-box">
                  <span class="metric-label">Estatura</span>
                  <span class="metric-value">{{ user.estatura }}</span>
                </div>
                <div class="metric-box">
                  <span class="metric-label">% Grasa</span>
                  <span class="metric-value warning">{{ user.grasaCorporal }}</span>
                </div>
                <div class="metric-box">
                  <span class="metric-label">Masa Muscular</span>
                  <span class="metric-value accent">{{ user.masaMuscular }}</span>
                </div>
                <div class="metric-box">
                  <span class="metric-label">Calorías Quema/d</span>
                  <span class="metric-value">{{ user.caloriasPromedio }}</span>
                </div>
              </div>

              <div class="contact-info-list">
                <div class="contact-item">
                  <span class="contact-label">Fecha de inscripción</span>
                  <span class="contact-val">{{ user.inscripcion }}</span>
                </div>
                <div class="contact-item">
                  <span class="contact-label">Celular</span>
                  <span class="contact-val">{{ user.celular }}</span>
                </div>
                <div class="contact-item">
                  <span class="contact-label">Correo electrónico</span>
                  <span class="contact-val email-text">{{ user.correo }}</span>
                </div>
              </div>
            </div>

            <!-- TARJETAS INFERIORES: Próximo Corte y Saldo -->
            <div class="bottom-financial-grid">
              <div class="info-card">
                <span class="card-mini-title">Próximo Corte</span>
                <span class="card-highlight-val red">{{ user.proximoCorte }}</span>
              </div>
              <div class="info-card">
                <span class="card-mini-title">Saldo a Pagar</span>
                <span class="card-highlight-val green">{{ user.saldoAPagar }}</span>
              </div>
            </div>
          </div>

          <!-- COLUMNA DERECHA: Calendario y Mascota con el Componente -->
          <div class="column-right">
            
            <!-- CALENDARIO DE ASISTENCIAS -->
            <div class="calendar-card">
              <div class="calendar-header">
                <h3>Asistencia de Mayo</h3>
                <span class="year-badge">2026</span>
              </div>

              <div class="weekdays-row">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              </div>

              <div class="days-grid">
                <div 
                  v-for="(item, index) in diasCalendario" 
                  :key="index"
                  class="day-cell"
                  :class="item.estado"
                >
                  {{ item.dia }}
                </div>
              </div>

              <div class="calendar-legend">
                <div class="legend-item"><span class="dot asistio"></span> Asistió</div>
                <div class="legend-item"><span class="dot falto"></span> Falto</div>
                <div class="legend-item"><span class="dot hoy"></span> Hoy</div>
              </div>
            </div>

            <!-- TARJETA DE RACHA LLAMANDO AL COMPONENTE FITNESS PET -->
            <div class="streak-card">
              <div class="streak-header-row">
                <div class="streak-title-group">
                  <span class="streak-label">Mascota & Racha del Usuario</span>
                  <span class="streak-sub">Personalizado por el usuario</span>
                </div>
                <span class="pet-level-badge">{{ rachaInfo.nivelMascota }}</span>
              </div>

              <div class="streak-content-layout">
                
                <!-- LLAMADA AL COMPONENTE SEPARADO -->
                <div class="pet-display-box">
                  <FitnessPet 
                    :nombre="rachaInfo.nombreMascota" 
                    :nivel="rachaInfo.nivelMascota" 
                    :racha="rachaInfo.dias" 
                  />
                </div>

                <!-- CONTADOR DE DÍAS DE RACHA -->
                <div class="streak-counter-box">
                  <div class="streak-number-wrapper">
                    <span class="streak-number animate-bounce">{{ rachaInfo.dias }}</span>
                    <span class="fire-icon animate-pulse">🔥</span>
                  </div>
                  <span class="streak-footer-text">Días Seguidos de Racha</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  </HeadingAdmin>
</template>

<style scoped>
.main-content {
  min-height: calc(100vh - 80px);
  background: #0a0a0a;
  color: #f5f5f4;
  font-family: 'Inter', sans-serif;
  padding: 24px clamp(12px, 3vw, 48px);
  position: relative;
  overflow-x: hidden;
  box-sizing: border-box;
}

.glow {
  position: absolute;
  top: -100px;
  right: 10%;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(28, 79, 214, 0.22) 0%, rgba(28, 79, 214, 0) 70%);
  filter: blur(40px);
  pointer-events: none;
}

.stats-container {
  max-width: 1300px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.view-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.view-header {
  flex: 1;
  min-width: 240px;
}

.title {
  font-family: 'Anton', sans-serif;
  font-size: clamp(1.8rem, 3.5vw, 2.6rem);
  letter-spacing: -0.5px;
  text-transform: uppercase;
  margin: 0 0 4px;
  color: #f5f5f4;
}

.highlight-text { color: #3a6bd6; }

.subtitle {
  font-size: 13.5px;
  color: rgba(245, 245, 244, 0.55);
  margin: 0;
  line-height: 1.4;
}

.search-bar-wrapper {
  width: 100%;
  max-width: 320px;
}

@media (max-width: 768px) {
  .search-bar-wrapper { max-width: 100%; }
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  color: rgba(245, 245, 244, 0.4);
  pointer-events: none;
}

.search-input {
  width: 100%;
  background: rgba(18, 18, 18, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 10px 14px 10px 42px;
  font-size: 13px;
  color: #f5f5f4;
  outline: none;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.search-input::placeholder { color: rgba(245, 245, 244, 0.35); }

.search-input:focus {
  border-color: #3a6bd6;
  box-shadow: 0 0 15px rgba(58, 107, 214, 0.25);
  background: rgba(18, 18, 18, 0.95);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 24px;
  align-items: start;
}

@media (max-width: 1024px) {
  .dashboard-grid { grid-template-columns: 1fr; gap: 20px; }
}

.column-left {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-profile-card {
  background: rgba(18, 18, 18, 0.75);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 20px clamp(16px, 4vw, 28px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  position: relative;
}

.profile-header-tag {
  position: absolute;
  top: 18px;
  right: 18px;
  font-family: 'Oswald', sans-serif;
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 3px 8px;
  background: rgba(28, 79, 214, 0.15);
  color: #8fb4f8;
  border: 1px solid rgba(28, 79, 214, 0.3);
  border-radius: 6px;
  letter-spacing: 0.5px;
}

.profile-main-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.avatar-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-circle {
  width: 68px;
  height: 68px;
  background: linear-gradient(135deg, #1c4fd6 0%, #102d7c 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 8px 20px rgba(28, 79, 214, 0.35);
  border: 2px solid rgba(255, 255, 255, 0.15);
}

.attendance-badge {
  margin-top: 6px;
  font-size: 10px;
  font-weight: 700;
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid rgba(34, 197, 94, 0.3);
  white-space: nowrap;
}

.user-names h2 {
  font-family: 'Anton', sans-serif;
  font-size: clamp(1.25rem, 4vw, 1.5rem);
  letter-spacing: 0.5px;
  margin: 0 0 2px;
  color: #f5f5f4;
  word-break: break-word;
}

.user-id {
  font-family: 'Oswald', sans-serif;
  font-size: 12px;
  color: #8fb4f8;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.section-subtitle-small {
  font-family: 'Oswald', sans-serif;
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  color: rgba(245, 245, 244, 0.5);
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 18px;
  background: rgba(0, 0, 0, 0.3);
  padding: 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

@media (max-width: 420px) {
  .metrics-grid { grid-template-columns: repeat(2, 1fr); }
}

.metric-box {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: center;
  background: rgba(255, 255, 255, 0.02);
  padding: 6px 4px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.metric-label {
  font-size: 9.5px;
  color: rgba(245, 245, 244, 0.45);
  text-transform: uppercase;
  font-weight: 600;
}

.metric-value {
  font-family: 'Oswald', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: #f5f5f4;
}

.metric-value.accent { color: #4ade80; }
.metric-value.warning { color: #facc15; }

.contact-info-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 14px;
}

.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12.5px;
  gap: 8px;
}

.contact-label { color: rgba(245, 245, 244, 0.5); font-weight: 500; }
.contact-val { color: #f5f5f4; font-weight: 600; text-align: right; }
.email-text { word-break: break-all; }

.bottom-financial-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.info-card {
  background: rgba(18, 18, 18, 0.75);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-mini-title {
  font-size: 11px;
  color: rgba(245, 245, 244, 0.5);
  font-weight: 600;
  text-transform: uppercase;
}

.card-highlight-val {
  font-family: 'Oswald', sans-serif;
  font-size: clamp(1rem, 3.5vw, 1.25rem);
  font-weight: 700;
}

.card-highlight-val.red { color: #f87171; }
.card-highlight-val.green { color: #4ade80; }

.column-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.calendar-card {
  background: rgba(18, 18, 18, 0.75);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.calendar-header h3 {
  font-family: 'Oswald', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.5px;
}

.year-badge {
  font-family: 'Anton', sans-serif;
  color: #8fb4f8;
  font-size: 1rem;
}

.weekdays-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-family: 'Oswald', sans-serif;
  font-size: 11px;
  color: rgba(245, 245, 244, 0.4);
  margin-bottom: 10px;
  font-weight: 600;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.day-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.03);
  color: rgba(245, 245, 244, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.day-cell.asistio { background: rgba(34, 197, 94, 0.2); color: #4ade80; border-color: rgba(34, 197, 94, 0.4); }
.day-cell.falto { background: rgba(239, 68, 68, 0.2); color: #f87171; border-color: rgba(239, 68, 68, 0.4); }
.day-cell.hoy { background: rgba(234, 179, 8, 0.25); color: #facc15; border-color: rgba(234, 179, 8, 0.5); box-shadow: 0 0 10px rgba(234, 179, 8, 0.25); }

.calendar-legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 14px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  color: rgba(245, 245, 244, 0.6);
  font-weight: 500;
}

.dot { width: 8px; height: 8px; border-radius: 50%; }
.dot.asistio { background: #4ade80; }
.dot.falto { background: #f87171; }
.dot.hoy { background: #facc15; }

/* TARJETA DE RACHA */
.streak-card {
  background: linear-gradient(135deg, rgba(234, 179, 8, 0.12) 0%, rgba(18, 18, 18, 0.85) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(234, 179, 8, 0.3);
  border-radius: 18px;
  padding: 20px;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.streak-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
  gap: 8px;
}

.streak-title-group { display: flex; flex-direction: column; }

.streak-label {
  font-family: 'Oswald', sans-serif;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #facc15;
  letter-spacing: 0.5px;
}

.streak-sub { font-size: 11px; color: rgba(245, 245, 244, 0.5); }

.pet-level-badge {
  font-family: 'Oswald', sans-serif;
  font-size: 10.5px;
  font-weight: 700;
  background: rgba(234, 179, 8, 0.2);
  color: #facc15;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid rgba(234, 179, 8, 0.4);
  text-transform: uppercase;
  white-space: nowrap;
}

.streak-content-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-items: center;
  background: rgba(0, 0, 0, 0.35);
  padding: 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

@media (max-width: 360px) {
  .streak-content-layout { grid-template-columns: 1fr; gap: 16px; }
}

.pet-display-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.03);
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  text-align: center;
}

.streak-counter-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.streak-number-wrapper { display: flex; align-items: center; gap: 6px; }

.streak-number {
  font-family: 'Anton', sans-serif;
  font-size: 2.6rem;
  color: #f5f5f4;
  line-height: 1;
  text-shadow: 0 4px 20px rgba(234, 179, 8, 0.3);
}

.fire-icon { font-size: 1.7rem; }

.streak-footer-text {
  font-family: 'Oswald', sans-serif;
  font-size: 10.5px;
  font-weight: 600;
  text-transform: uppercase;
  color: rgba(245, 245, 244, 0.6);
  letter-spacing: 0.5px;
  margin-top: 4px;
}

@keyframes bounceSlow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

@keyframes pulseFlame {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.85; }
}

.animate-bounce { animation: bounceSlow 2.5s ease-in-out infinite; }
.animate-pulse { animation: pulseFlame 1.8s ease-in-out infinite; display: inline-block; }
</style>