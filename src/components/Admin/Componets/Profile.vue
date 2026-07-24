<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted, computed } from 'vue';
import HeadingAdmin from '../HeadingAdmin.vue';
import RegisterGymModal from '../../Record/Record-Gym.vue'; 
import AIChatModal from '../../Record/Record-Staff.vue'; 
import MembershipModal from '../../Modals/MembershipModal.vue'; // Ajusta según la ubicación de tu componente de pagos

const allDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const fileInput = ref<HTMLInputElement | null>(null);
const previewImage = ref<string | null>(null);
const showPassword = ref(false);

// Control de modales
const showAddSedeModal = ref(false);
const showAIModal = ref(false);
const showPaymentModal = ref(false); 

// Sistema de notificaciones (tipo toast flotante)
const notification = reactive({
  show: false,
  message: '',
  type: 'success' as 'success' | 'warning' | 'info'
});

const showNotification = (msg: string, type: 'success' | 'warning' | 'info' = 'success') => {
  notification.message = msg;
  notification.type = type;
  notification.show = true;
  setTimeout(() => {
    notification.show = false;
  }, 4000);
};

// Control para el desplazamiento fluido
const scrollY = ref(0);
const profileTranslateY = ref(0);

const handleScroll = () => {
  scrollY.value = window.scrollY;
  if (window.innerWidth > 1024) {
    const offset = scrollY.value * 0.18;
    profileTranslateY.value = Math.min(offset, 250);
  } else {
    profileTranslateY.value = 0;
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const form = reactive({
  nombreGimnasio: 'Iron Fitness Center',
  curp: 'IFC220101HSLPR01',
  nombres: 'Juan Carlos',
  apellidoP: 'Pérez',
  apellidoM: 'Gómez',
  fechaNac: '1985-06-15',
  celular: '4811234567',
  entidad: 'San Luis Potosí',
  municipio: 'Ciudad Valles',
  cp: '79000',
  colonia: 'Centro',
  calle: 'Blvd. Hidalgo',
  numExt: '120',
  numInt: 'B',
  selectedDays: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  precioMes: '450',
  precioSem: '150',
  email: 'contacto@ironfitness.com',
  password: '',
  confirmPassword: '',
  membresiaActual: 'Plan Pro - Sede Principal (Activa)',
  tipoMembresia: 'pro'
});

const isProMember = computed(() => {
  return form.tipoMembresia.toLowerCase() === 'pro';
});

const toggleDay = (day: string) => {
  const index = form.selectedDays.indexOf(day);
  if (index > -1) form.selectedDays.splice(index, 1);
  else form.selectedDays.push(day);
};

const triggerFileInput = () => fileInput.value?.click();
const onFileSelected = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    previewImage.value = URL.createObjectURL(file);
    showNotification('Logotipo actualizado temporalmente', 'info');
  }
};

const handleSaveChanges = () => {
  console.log('Guardar cambios:', form);
  showNotification('¡Cambios guardados correctamente!', 'success');
};

const handleUpdateMembership = () => {
  showPaymentModal.value = true;
};

const handlePaymentSuccess = (msg: string) => {
  showPaymentModal.value = false;
  showNotification(msg, 'success');
};

const handleAddSede = () => {
  if (!isProMember.value) {
    showNotification('Esta función solo está disponible para cuentas con Membresía Pro.', 'warning');
    return;
  }
  showAddSedeModal.value = true;
};

const handleInteractAI = () => {
  if (!isProMember.value) {
    showNotification('Interactuar con la IA requiere una Membresía Pro activa.', 'warning');
    return;
  }
  showAIModal.value = true;
};
</script>

<template>
  <HeadingAdmin>
    <main class="main-content">
      
      <!-- Notificación flotante tipo Toast -->
      <transition name="toast">
        <div v-if="notification.show" class="floating-toast" :class="notification.type">
          <svg v-if="notification.type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <svg v-else-if="notification.type === 'warning'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <span>{{ notification.message }}</span>
        </div>
      </transition>

      <div class="profile-card">
        
        <!-- Sección Izquierda -->
        <div 
          class="profile-section" 
          :style="{ transform: `translateY(${profileTranslateY}px)` }"
        >
          <h1 class="main-title">PERFIL DEL <br> <span class="highlight">GIMNASIO</span></h1>
          
          <div class="avatar-wrapper" @click="triggerFileInput" title="Subir logotipo">
            <div class="avatar-circle">
              <img v-if="previewImage" :src="previewImage" alt="Vista previa" class="avatar-img" />
              <svg v-else viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <button type="button" class="avatar-action btn-camera" title="Cambiar logotipo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </button>
            <input type="file" ref="fileInput" @change="onFileSelected" accept="image/*" style="display: none" />
          </div>

          <h3 class="gym-name-display">{{ form.nombreGimnasio || 'Gimnasio' }}</h3>
          <p class="profile-hint">Actualiza la información de tu establecimiento y administrador.</p>
        </div>

        <!-- Columna Derecha: Formularios -->
        <div class="forms-wrapper">
          <form @submit.prevent="handleSaveChanges">
            
            <!-- Datos del Gimnasio y Membresía -->
            <div class="login-card">
              <h3 class="section-title">Información del Establecimiento</h3>
              <div class="form-grid">
                <div class="input-group">
                  <label for="nombreGimnasio">Nombre del gimnasio</label>
                  <input id="nombreGimnasio" type="text" v-model="form.nombreGimnasio" required />
                </div>
                <div class="input-group">
                  <label for="curp">CURP (Administrador)</label>
                  <input id="curp" type="text" v-model="form.curp" disabled class="input-disabled" title="El CURP no se puede editar" />
                </div>
              </div>

              <div class="form-grid mt-3">
                <div class="input-group">
                  <label for="membresiaActual">Membresía actual del sitio</label>
                  <div class="membership-inline-row">
                    <input id="membresiaActual" type="text" v-model="form.membresiaActual" disabled class="input-disabled" />
                    <button type="button" class="action-btn" @click="handleUpdateMembership" title="Actualizar membresía">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
                    </button>
                  </div>
                </div>

                <div class="input-group special-buttons-group">
                  <label>&nbsp;</label>
                  <div class="dual-action-buttons">
                    <button 
                      type="button" 
                      class="btn-custom-action btn-sede" 
                      :class="{ 'btn-disabled': !isProMember }"
                      @click="handleAddSede"
                    >
                      Agregar otra Sede
                    </button>
                    <button 
                      type="button" 
                      class="btn-custom-action btn-ai" 
                      :class="{ 'btn-disabled': !isProMember }"
                      @click="handleInteractAI"
                    >
                      Interactuar IA
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Datos del Administrador -->
            <div class="login-card">
              <h3 class="section-title">Datos del Administrador</h3>
              <div class="form-grid">
                <div class="input-group">
                  <label for="nombres">Nombre(s)</label>
                  <input id="nombres" type="text" v-model="form.nombres" required />
                </div>
                <div class="input-group">
                  <label for="apellidoP">Apellido paterno</label>
                  <input id="apellidoP" type="text" v-model="form.apellidoP" required />
                </div>
                <div class="input-group">
                  <label for="apellidoM">Apellido materno</label>
                  <input id="apellidoM" type="text" v-model="form.apellidoM" required />
                </div>
                <div class="input-group">
                  <label for="fechaNac">Fecha de nacimiento</label>
                  <input id="fechaNac" type="date" v-model="form.fechaNac" required />
                </div>
                <div class="input-group">
                  <label for="celular">Teléfono celular</label>
                  <input id="celular" type="tel" v-model="form.celular" required />
                </div>
                <div class="input-group">
                  <label for="email">Correo electrónico</label>
                  <input id="email" type="email" v-model="form.email" required />
                </div>
                <div class="input-group">
                  <label for="password">Nueva contraseña</label>
                  <div class="input-wrapper">
                    <input id="password" :type="showPassword ? 'text' : 'password'" v-model="form.password" placeholder="Dejar en blanco para mantener" />
                    <button type="button" class="toggle-password-btn" @click="showPassword = !showPassword">
                      <svg v-if="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </button>
                  </div>
                </div>
                <div class="input-group">
                  <label for="confirmPassword">Confirmar contraseña</label>
                  <input id="confirmPassword" type="password" v-model="form.confirmPassword" placeholder="Repetir contraseña" />
                </div>
              </div>
            </div>

            <!-- Ubicación del Gimnasio -->
            <div class="login-card">
              <h3 class="section-title">Ubicación del Gimnasio</h3>
              <div class="form-grid">
                <div class="input-group">
                  <label for="entidad">Entidad</label>
                  <input id="entidad" type="text" v-model="form.entidad" required />
                </div>
                <div class="input-group">
                  <label for="municipio">Municipio</label>
                  <input id="municipio" type="text" v-model="form.municipio" required />
                </div>
                <div class="input-group">
                  <label for="colonia">Colonia</label>
                  <input id="colonia" type="text" v-model="form.colonia" required />
                </div>
                <div class="input-group">
                  <label for="cp">Código postal</label>
                  <input id="cp" type="text" v-model="form.cp" required />
                </div>
                <div class="input-group span-2">
                  <label for="calle">Calle</label>
                  <input id="calle" type="text" v-model="form.calle" required />
                </div>
                <div class="input-group">
                  <label for="numExt">Núm. exterior</label>
                  <input id="numExt" type="text" v-model="form.numExt" required />
                </div>
                <div class="input-group">
                  <label for="numInt">Núm. interior</label>
                  <input id="numInt" type="text" v-model="form.numInt" />
                </div>
              </div>
            </div>

            <!-- Configuración de Operación -->
            <div class="login-card">
              <h3 class="section-title">Configuración de Operación</h3>
              <div class="input-group mb-3">
                <label>Días de apertura</label>
                <div class="days-container">
                  <button
                    type="button"
                    v-for="day in allDays"
                    :key="day"
                    class="day-chip"
                    :class="{ active: form.selectedDays.includes(day) }"
                    @click="toggleDay(day)"
                  >
                    {{ day }}
                  </button>
                </div>
              </div>

              <div class="form-grid">
                <div class="input-group">
                  <label for="precioMes">Mensualidad ($)</label>
                  <input id="precioMes" type="number" v-model="form.precioMes" required />
                </div>
                <div class="input-group">
                  <label for="precioSem">Semanal ($)</label>
                  <input id="precioSem" type="number" v-model="form.precioSem" required />
                </div>
              </div>
            </div>

            <button type="submit" class="btn-primary">Guardar Cambios</button>
          </form>
        </div>
      </div>

      <!-- Componente Modular Externo de Pago (Con transición integrada) -->
      <MembershipModal 
        v-if="showPaymentModal" 
        @close="showPaymentModal = false" 
        @success="handlePaymentSuccess" 
      />

      <!-- Modal para Agregar Sede -->
      <div v-if="showAddSedeModal" class="modal-overlay" @click.self="showAddSedeModal = false">
        <div class="modal-container animate-modal">
          <div class="modal-header">
            <h3>Registro de Nueva Sede / Gimnasio</h3>
            <button class="close-btn" @click="showAddSedeModal = false">&times;</button>
          </div>
          <div class="modal-body">
            <RegisterGymModal @close="showAddSedeModal = false" />
          </div>
        </div>
      </div>

      <!-- Modal para Interactuar con la IA -->
      <div v-if="showAIModal" class="modal-overlay" @click.self="showAIModal = false">
        <div class="modal-container animate-modal">
          <div class="modal-header">
            <h3>Asistente IA - Gestión de Gimnasio</h3>
            <button class="close-btn" @click="showAIModal = false">&times;</button>
          </div>
          <div class="modal-body">
            <AIChatModal @close="showAIModal = false" />
          </div>
        </div>
      </div>

    </main>
  </HeadingAdmin>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;600;700&display=swap');

.main-content { 
  display: flex; 
  justify-content: center; 
  width: 100%; 
  padding: 40px clamp(16px, 3vw, 40px); 
  box-sizing: border-box; 
  position: relative;
}

.highlight { color: #3b82f6; }

/* Animación de apertura de modales */
.animate-modal {
  animation: modalScale 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes modalScale {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

/* Toast Notificación Flotante */
.floating-toast {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 22px;
  border-radius: 14px;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  backdrop-filter: blur(10px);
}
.floating-toast.success {
  background: rgba(16, 185, 129, 0.9);
  color: #fff;
  border: 1px solid rgba(52, 211, 153, 0.4);
}
.floating-toast.warning {
  background: rgba(245, 158, 11, 0.9);
  color: #fff;
  border: 1px solid rgba(251, 191, 36, 0.4);
}
.floating-toast.info {
  background: rgba(59, 130, 246, 0.9);
  color: #fff;
  border: 1px solid rgba(96, 165, 250, 0.4);
}

.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-20px); }

.profile-card { 
  display: grid; 
  grid-template-columns: 340px minmax(0, 1fr); 
  gap: 30px; 
  width: 100%; 
  max-width: 1250px;
  margin: 0 auto;   
  align-items: start; 
}

.profile-section { 
  background: rgba(18, 18, 18, 0.75); 
  backdrop-filter: blur(12px);
  padding: 40px 24px; 
  border-radius: 24px; 
  border: 1px solid rgba(255, 255, 255, 0.09);
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  text-align: center;
  position: sticky;
  top: 30px;
  transition: transform 0.1s cubic-bezier(0, 0, 0.2, 1);
  will-change: transform;
}

.main-title { 
  font-family: 'Anton', sans-serif; 
  font-size: 2.2rem; 
  color: #fff; 
  margin: 0 0 24px 0; 
  line-height: 1.1; 
  text-transform: uppercase; 
  letter-spacing: 0.5px;
}

.gym-name-display {
  font-family: 'Anton', sans-serif;
  font-size: 1.3rem;
  color: #fff;
  margin: 16px 0 6px;
  letter-spacing: 0.5px;
}

.profile-hint {
  font-family: 'Inter', sans-serif;
  color: #94a3b8;
  font-size: 0.85rem;
  line-height: 1.4;
  margin-top: 6px;
}

.forms-wrapper { 
  display: flex; 
  flex-direction: column; 
  gap: 32px; 
  width: 100%; 
}

.login-card { 
  background: rgba(18, 18, 18, 0.75); 
  backdrop-filter: blur(12px);
  padding: 36px; 
  margin-top: 25px;
  border-radius: 24px; 
  border: 1px solid rgba(255, 255, 255, 0.12); 
  box-sizing: border-box;
}

.form-grid { 
  display: grid; 
  grid-template-columns: repeat(2, 1fr); 
  gap: 24px; 
}

.span-2 { grid-column: span 2; }
.mt-3 { margin-top: 24px; }
.mb-3 { margin-bottom: 24px; }

.input-group { 
  display: flex; 
  flex-direction: column; 
  gap: 8px; 
}

label { 
  font-family: 'Oswald', sans-serif; 
  color: #f5f5f4; 
  font-size: 0.85rem; 
  font-weight: 600; 
  letter-spacing: 0.5px;
}

input { 
  background: #141414; 
  border: 1.5px solid rgba(255, 255, 255, 0.12); 
  border-radius: 12px; 
  color: #fff; 
  padding: 12px 14px; 
  width: 100%; 
  box-sizing: border-box; 
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.input-disabled {
  background: #0d0d0d;
  color: #71717a;
  border-color: rgba(255, 255, 255, 0.06);
  cursor: not-allowed;
}

.section-title { 
  font-family: 'Oswald', sans-serif; 
  color: #5b8bf0; 
  font-size: 0.95rem; 
  margin: 0 0 24px 0; 
  text-transform: uppercase; 
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08); 
  padding-bottom: 12px; 
}

.avatar-circle { 
  width: 150px; 
  height: 150px; 
  background: #141414; 
  border-radius: 50%; 
  border: 4px solid #3b82f6; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-wrapper { 
  position: relative; 
  margin-bottom: 10px; 
  cursor: pointer;
}

.avatar-action { 
  position: absolute; 
  width: 42px; 
  height: 42px; 
  border-radius: 50%; 
  background: #3b82f6; 
  border: 2px solid #121212; 
  cursor: pointer; 
  bottom: 0; 
  right: 0; 
  display: flex; 
  align-items: center; 
  justify-content: center;
  color: white;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.avatar-action svg { width: 20px; height: 20px; }

.membership-inline-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-btn {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #60a5fa;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #3b82f6;
  color: white;
}

.action-btn svg { width: 20px; height: 20px; }

.dual-action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.btn-custom-action {
  padding: 12px 14px;
  border-radius: 12px;
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.15);
  text-transform: uppercase;
  transition: all 0.2s ease;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-sede, .btn-ai {
  background: linear-gradient(135deg, rgba(187, 247, 208, 0.25), rgba(96, 165, 250, 0.25));
  color: #e2e8f0;
  border-color: rgba(96, 165, 250, 0.4);
}

.btn-sede:hover:not(.btn-disabled), .btn-ai:hover:not(.btn-disabled) {
  background: linear-gradient(135deg, rgba(187, 247, 208, 0.4), rgba(96, 165, 250, 0.4));
  color: #ffffff;
}

.btn-disabled {
  background: rgba(255, 255, 255, 0.03) !important;
  color: #71717a !important;
  border-color: rgba(255, 255, 255, 0.06) !important;
  cursor: not-allowed !important;
}

.days-container { display: flex; gap: 6px; flex-wrap: wrap; }
.day-chip {
  padding: 8px 14px;
  border-radius: 10px;
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
  color: #f5f5f4;
  transition: all 0.2s ease;
}
.day-chip.active {
  border-color: #3b82f6;
  background: #3b82f6;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.input-wrapper { position: relative; }
.toggle-password-btn {
  position: absolute; right: 0; top: 0; height: 100%; width: 44px;
  background: transparent; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: rgba(245, 245, 244, 0.4);
}

.btn-primary {
  width: 100%;
  padding: 16px;
  background: #1c4fd6;
  color: white;
  border: none;
  border-radius: 14px;
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.5px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(28, 79, 214, 0.35);
  margin-top: 10px;
}

.btn-primary:hover {
  background: #1742be;
  transform: translateY(-2px);
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-container {
  background: #161616;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.6);
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  font-family: 'Oswald', sans-serif;
  color: #fff;
  font-size: 1.2rem;
  margin: 0;
  letter-spacing: 0.5px;
}

.close-btn {
  background: transparent;
  border: none;
  color: #aaa;
  font-size: 1.8rem;
  cursor: pointer;
  line-height: 1;
}

.close-btn:hover { color: #fff; }

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

@media (max-width: 1024px) { 
  .profile-card { grid-template-columns: 1fr; } 
  .profile-section { position: static; transform: none !important; }
}

@media (max-width: 768px) {
  .form-grid { grid-template-columns: 1fr; gap: 14px; }
  .span-2 { grid-column: span 1; }
  .dual-action-buttons { grid-template-columns: 1fr; }
}
</style>