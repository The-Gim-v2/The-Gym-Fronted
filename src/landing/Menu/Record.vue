<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import Logo from '@/landing/logo.vue';
import MembershipModal from './MembershipModal.vue';

const route = useRoute();

const allDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const fileInput = ref<HTMLInputElement | null>(null);
const previewImage = ref<string | null>(null);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const submitted = ref(false);
const showPaymentModal = ref(false);
const errorMessage = ref<string | null>(null);

// Capturar el plan de la URL de forma segura por si el modal lo necesita al abrirse
const planQuery = (route.query.plan as string || '').toLowerCase();

const form = reactive({
  nombreGimnasio: '',
  curp: '', nombres: '', apellidoP: '', apellidoM: '',
  fechaNac: '', celular: '',
  entidad: 'SLP', municipio: '', cp: '', colonia: '', calle: '', numExt: '', numInt: '',
  selectedDays: [] as string[],
  precioMes: '', precioSem: '',
  email: '', password: '', confirmPassword: '',
  tipoMembresia: planQuery ? `Plan ${route.query.plan}` : 'Plan Pro Mensual'
});

const toggleDay = (day: string) => {
  const index = form.selectedDays.indexOf(day);
  if (index > -1) form.selectedDays.splice(index, 1);
  else form.selectedDays.push(day);
};

const triggerFileInput = () => fileInput.value?.click();
const onFileSelected = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) previewImage.value = URL.createObjectURL(file);
};

// Interceptar el intento de registro para abrir el modal de pago/confirmación
const handleRegisterClick = () => {
  errorMessage.value = null;

  // Validar coincidencia de contraseñas primero
  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Las contraseñas no coinciden. Por favor, verifícalas.';
    return;
  }

  // Abrir el modal de pago/membresía directamente
  showPaymentModal.value = true;
};

// Se ejecuta cuando el usuario confirma el pago/suscripción desde el modal
const handlePaymentSuccess = (msg: string) => {
  showPaymentModal.value = false;
  console.log(msg);

  // Procedemos con el registro completo del gimnasio
  console.log('Registro exitoso enviado con membresía confirmada:', form);
  submitted.value = true;
};
</script>

<template>
  <div class="register-page">
    <div class="glow"></div>

    <MembershipModal 
      v-if="showPaymentModal" 
      v-model="form.tipoMembresia"
      @close="showPaymentModal = false"
      @success="handlePaymentSuccess"
    />
    
    <header class="top-bar">
      <router-link :to="{ name: 'home' }" class="top-brand">
        <Logo />
        <span class="logo-text">FITMANAGE <span class="text-accent">PRO</span></span>
      </router-link>
    </header>

    <main class="main-content">
      <div class="register-card">
        <div class="header-section">
          <h1 class="title">REGISTRA TU <span class="highlight-text">GIMNASIO</span></h1>
          <p class="subtitle">Únete a nuestra red de gestión fitness inteligente</p>
        </div>

        <div v-if="submitted" class="alert-success">
          ¡Solicitud enviada con éxito! Revisaremos los datos de tu gimnasio y te contactaremos pronto.
        </div>

        <div v-if="errorMessage" class="alert-error">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleRegisterClick">
          <div class="rg-grid">

            <div class="form-column">
              <h3 class="section-divider first">Imagen del gimnasio</h3>
              <div class="upload-container">
                <div class="image-preview" @click="triggerFileInput">
                  <img v-if="previewImage" :src="previewImage" class="profile-img" alt="Vista previa logo" />
                  <div v-else class="upload-placeholder">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                    <span>Subir</span>
                  </div>
                </div>
                <input type="file" ref="fileInput" @change="onFileSelected" accept="image/*" style="display: none" />
                <p class="upload-info">Haz clic para añadir el logotipo de tu gimnasio</p>
              </div>

              <h3 class="section-divider">Datos del gimnasio</h3>
              <div class="input-group">
                <label for="nombreGimnasio">Nombre del gimnasio</label>
                <input id="nombreGimnasio" type="text" v-model="form.nombreGimnasio" placeholder="Ej. Iron Fitness Center" required />
              </div>

              <h3 class="section-divider">Datos del administrador</h3>
              <div class="stack-gap">
                <div class="input-group">
                  <label for="curp">CURP</label>
                  <input id="curp" type="text" v-model="form.curp" placeholder="ABCD123456HDFR01" required />
                </div>
                <div class="input-group">
                  <label for="nombres">Nombre(s)</label>
                  <input id="nombres" type="text" v-model="form.nombres" placeholder="Ingresa tus nombres" required />
                </div>
                <div class="rg-row">
                  <div class="input-group">
                    <label for="apellidoP">Apellido paterno</label>
                    <input id="apellidoP" type="text" v-model="form.apellidoP" placeholder="Paterno" required />
                  </div>
                  <div class="input-group">
                    <label for="apellidoM">Apellido materno</label>
                    <input id="apellidoM" type="text" v-model="form.apellidoM" placeholder="Materno" required />
                  </div>
                </div>
                <div class="rg-row">
                  <div class="input-group">
                    <label for="fechaNac">Fecha de nacimiento</label>
                    <input id="fechaNac" type="date" v-model="form.fechaNac" required />
                  </div>
                  <div class="input-group">
                    <label for="celular">Teléfono celular</label>
                    <input id="celular" type="tel" v-model="form.celular" placeholder="Ej. 4811234567" required />
                  </div>
                </div>
              </div>
            </div>

            <div class="form-column">
              <h3 class="section-divider first">Cuenta de acceso</h3>
              <div class="stack-gap">
                <div class="input-group">
                  <label for="email">Correo electrónico</label>
                  <input id="email" type="email" v-model="form.email" placeholder="admin@gimnasio.com" required />
                </div>
                <div class="rg-row">
                  <div class="input-group">
                    <label for="password">Contraseña</label>
                    <div class="input-wrapper">
                      <input id="password" :type="showPassword ? 'text' : 'password'" v-model="form.password" placeholder="••••••••" required />
                      <button type="button" class="toggle-password-btn" @click="showPassword = !showPassword" aria-label="Mostrar contraseña">
                        <svg v-if="showPassword" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      </button>
                    </div>
                  </div>
                  <div class="input-group">
                    <label for="confirmPassword">Confirmar contraseña</label>
                    <div class="input-wrapper">
                      <input id="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" v-model="form.confirmPassword" placeholder="••••••••" required />
                      <button type="button" class="toggle-password-btn" @click="showConfirmPassword = !showConfirmPassword" aria-label="Mostrar contraseña de confirmación">
                        <svg v-if="showConfirmPassword" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <h3 class="section-divider">Ubicación del gimnasio</h3>
              <div class="stack-gap">
                <div class="rg-row">
                  <div class="input-group">
                    <label for="entidad">Entidad</label>
                    <div class="select-wrapper">
                      <select id="entidad" v-model="form.entidad" required>
                        <option value="SLP">San Luis Potosí</option>
                      </select>
                    </div>
                  </div>
                  <div class="input-group">
                    <label for="municipio">Municipio</label>
                    <input id="municipio" type="text" v-model="form.municipio" placeholder="Municipio" required />
                  </div>
                </div>
                <div class="rg-row">
                  <div class="input-group">
                    <label for="colonia">Colonia</label>
                    <input id="colonia" type="text" v-model="form.colonia" placeholder="Colonia" required />
                  </div>
                  <div class="input-group">
                    <label for="cp">Código postal</label>
                    <input id="cp" type="text" v-model="form.cp" placeholder="C.P." required />
                  </div>
                </div>
                <div class="input-group">
                  <label for="calle">Calle</label>
                  <input id="calle" type="text" v-model="form.calle" placeholder="Nombre de la calle" required />
                </div>
                <div class="rg-row">
                  <div class="input-group">
                    <label for="numExt">Núm. exterior</label>
                    <input id="numExt" type="text" v-model="form.numExt" placeholder="Ext." required />
                  </div>
                  <div class="input-group">
                    <label for="numInt">Núm. interior</label>
                    <input id="numInt" type="text" v-model="form.numInt" placeholder="Int. (opcional)" />
                  </div>
                </div>
              </div>
            </div>

            <div class="form-column rg-col3">
              <h3 class="section-divider first">Configuración de operación</h3>
              
              <div class="input-group">
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

              <div class="rg-row price-row">
                <div class="input-group">
                  <div class="label-help">
                    <label for="precioMes">Mensualidad ($)</label>
                    <div class="help-icon">?
                      <span class="tooltip">Precio fijo para los pagos mensuales del sistema.</span>
                    </div>
                  </div>
                  <input id="precioMes" type="number" v-model="form.precioMes" placeholder="0.00" required />
                </div>
                <div class="input-group">
                  <div class="label-help">
                    <label for="precioSem">Semanal ($)</label>
                    <div class="help-icon">?
                      <span class="tooltip">Precio fijo para los accesos semanales.</span>
                    </div>
                  </div>
                  <input id="precioSem" type="number" v-model="form.precioSem" placeholder="0.00" required />
                </div>
              </div>

              <div class="actions-section" style="margin-top: 28px;">
                <button type="submit" class="btn-primary">
                  Registrar gimnasio y pagar
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
                <div class="footer-link">
                  ¿Ya tienes cuenta? <router-link :to="{ name: 'login' }">Inicia sesión</router-link>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
.alert-error {
  font-size: 13px;
  font-weight: 600;
  padding: 14px 16px;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #fca5a5;
  margin-bottom: 24px;
}

.register-page {
  min-height: 100vh;
  background: #0a0a0a;
  color: #f5f5f4;
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow-x: hidden;
  padding-bottom: 60px;
}

.glow {
  position: absolute;
  top: -160px;
  left: 50%;
  transform: translateX(-50%);
  width: 720px;
  height: 720px;
  max-width: 160vw;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(28,79,214,0.32) 0%, rgba(28,79,214,0) 70%);
  filter: blur(10px);
  animation: pulseGlow 6s ease-in-out infinite;
  pointer-events: none;
}

@keyframes pulseGlow { 0%, 100% { opacity: 0.28; } 50% { opacity: 0.5; } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }

.top-bar {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px clamp(20px, 4vw, 40px);
  box-sizing: border-box;
  position: relative;
}

.top-brand { display: inline-flex; align-items: center; gap: 12px; text-decoration: none; }

.logo-text {
  font-family: 'Anton', sans-serif;
  font-size: 19px;
  letter-spacing: 0.3px;
  line-height: 1;
  white-space: nowrap;
  color: #f5f5f4;
}

.text-accent { color: #1c4fd6; }

.main-content {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 clamp(16px, 3vw, 40px);
  box-sizing: border-box;
}

.register-card {
  width: 100%;
  max-width: 1400px; 
  background: rgba(18, 18, 18, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 24px;
  padding: clamp(28px, 3vw, 48px);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.55);
  box-sizing: border-box;
  animation: fadeUp 0.6s ease both;
}

.header-section { text-align: center; margin-bottom: 32px; }

.title {
  font-family: 'Anton', sans-serif;
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  letter-spacing: -1px;
  text-transform: uppercase;
  margin: 0 0 8px;
  color: #f5f5f4;
}

.highlight-text { color: #3a6bd6; }

.subtitle { font-size: 14px; color: rgba(245, 245, 244, 0.55); margin: 0; }

.alert-success {
  font-size: 13px;
  font-weight: 600;
  padding: 14px 16px;
  border-radius: 10px;
  background: rgba(28, 79, 214, 0.15);
  border: 1px solid rgba(28, 79, 214, 0.4);
  color: #8fb4f8;
  margin-bottom: 24px;
}

.rg-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(24px, 2.5vw, 36px);
  align-items: start;
}

.form-column { display: flex; flex-direction: column; gap: 8px; min-width: 0; }

@media (min-width: 1200px) {
  .rg-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .rg-col3 {
    grid-column: auto;
    max-width: none;
    margin: 0;
  }
}

@media (min-width: 1024px) and (max-width: 1199px) {
  .rg-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .rg-col3 {
    grid-column: 1 / -1;
    max-width: 700px;
    margin: 0 auto;
    width: 100%;
  }
}

.section-divider {
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 12.5px;
  letter-spacing: 0.6px;
  color: #5b8bf0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 8px;
  margin: 22px 0 6px;
  text-transform: uppercase;
}

.section-divider.first { margin: 6px 0 6px; }

.upload-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 18px;
  background: rgba(255, 255, 255, 0.03);
  padding: 16px 18px;
  border-radius: 14px;
  border: 1.5px dashed rgba(255, 255, 255, 0.16);
}

.image-preview {
  width: 76px;
  height: 76px;
  background: #141414;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  flex-shrink: 0;
}

.profile-img { width: 100%; height: 100%; object-fit: cover; }

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(245, 245, 244, 0.45);
  gap: 4px;
  text-align: center;
}

.upload-placeholder span { font-size: 9px; font-weight: 700; text-transform: uppercase; }

.upload-info { font-size: 13px; font-weight: 400; color: rgba(245, 245, 244, 0.55); margin: 0; line-height: 1.4; }

.stack-gap { display: flex; flex-direction: column; gap: 14px; }

.rg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

.input-group { display: flex; flex-direction: column; gap: 8px; }

label {
  font-family: 'Oswald', sans-serif;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: #f5f5f4;
}

input, select {
  width: 100%;
  padding: 14px 16px;
  background: #141414;
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  color: #f5f5f4;
  font-weight: 600;
  font-size: 14.5px;
  min-height: 48px;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

input::placeholder { color: rgba(245, 245, 244, 0.4); }

input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.6; cursor: pointer; }

input:focus, select:focus {
  outline: none;
  border-color: #1c4fd6;
  box-shadow: 0 0 0 4px rgba(28, 79, 214, 0.25);
  background: #161616;
}

.input-wrapper { position: relative; }

.input-wrapper input { padding-right: 46px; }

.toggle-password-btn {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 44px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(245, 245, 244, 0.4);
}

.select-wrapper { position: relative; }

.select-wrapper::after {
  content: '';
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  border: 5px solid transparent;
  border-top-color: rgba(245, 245, 244, 0.5);
  pointer-events: none;
}

select { appearance: none; -webkit-appearance: none; padding-right: 40px; cursor: pointer; }
select option { background: #161616; color: #f5f5f4; }

.days-container { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px; }

.day-chip {
  padding: 9px 14px;
  border-radius: 9px;
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 12.5px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
  color: #f5f5f4;
  transition: all 0.25s ease;
}

.day-chip.active {
  border-color: #1c4fd6;
  background: #1c4fd6;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(28, 79, 214, 0.3);
}

.price-row { 
  margin-top: 14px; 
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.label-help { display: inline-flex; align-items: center; gap: 6px; position: relative; margin-bottom: 8px; }

.help-icon {
  width: 16px;
  height: 16px;
  background: rgba(255, 255, 255, 0.14);
  color: #f5f5f4;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  cursor: help;
  position: relative;
}

.tooltip {
  visibility: hidden;
  opacity: 0;
  width: 190px;
  background: #161616;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #f5f5f4;
  text-align: center;
  border-radius: 8px;
  padding: 8px 12px;
  position: absolute;
  z-index: 50;
  bottom: 135%;
  left: 50%;
  transform: translateX(-50%);
  transition: opacity 0.15s ease;
  font-family: 'Inter', sans-serif;
  font-size: 11.5px;
  font-weight: 400;
  line-height: 1.35;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
}

.help-icon:hover .tooltip { visibility: visible; opacity: 1; }

.actions-section { margin-top: 30px; display: flex; flex-direction: column; gap: 14px; }

.btn-primary {
  width: 100%;
  padding: 16px;
  background: #1c4fd6;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 14.5px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 52px;
  box-shadow: 0 10px 24px rgba(28, 79, 214, 0.3);
  transition: all 0.25s ease;
}

.btn-primary:hover { background: #123ba0; transform: translateY(-2px); }

.footer-link {
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 13.5px;
  color: rgba(245, 245, 244, 0.55);
}

.footer-link a { color: #5b8bf0; text-decoration: none; font-weight: 700; }
.footer-link a:hover { text-decoration: underline; }

@media (max-width: 768px) {
  .price-row { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .rg-row { grid-template-columns: 1fr; }
  .upload-container { flex-direction: column; text-align: center; }
}
</style>