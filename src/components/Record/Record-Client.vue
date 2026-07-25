<template>
  <Heading>
    <NotificationSystem ref="toastRef" />
    <main class="main-content">
      <div class="profile-card">
        <!-- Sección Perfil (Izquierda) -->
        <div class="profile-section">
          <h1 class="main-title">Registra a tus <br> <span class="highlight">Clientes</span></h1>
          
          <div class="avatar-wrapper">
            <div class="avatar-circle" @click="triggerFileInput" title="Hacer clic para subir foto">
              <img v-if="previewImage" :src="previewImage" alt="Vista previa del cliente" class="avatar-img" />
              <svg v-else viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <button type="button" class="avatar-action btn-camera" @click="triggerFileInput" title="Subir fotografía">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </button>
            <input type="file" ref="fileInput" accept="image/*" @change="onFileSelected" style="display: none" />
          </div>
          <p class="profile-hint">Sube una fotografía reciente para el expediente del cliente.</p>
        </div>

        <!-- Formularios (Derecha) -->
        <div class="forms-wrapper">
          <form @submit.prevent="saveRegistration">
            
            <!-- Tarjeta 1: Datos Personales -->
            <div class="login-card">
              <h3 class="section-title">Datos Personales</h3>
              <div class="form-grid">
                <div class="input-group">
                  <label>Nombres</label>
                  <input type="text" v-model="form.nombres" placeholder="Ej. Juan" required>
                </div>
                <div class="input-group">
                  <label>Apellido Paterno</label>
                  <input type="text" v-model="form.apellidoP" placeholder="Ej. Pérez" required>
                </div>
                <div class="input-group">
                  <label>Apellido Materno</label>
                  <input type="text" v-model="form.apellidoM" placeholder="Ej. Gómez">
                </div>
                <div class="input-group">
                  <label>Fecha de Nacimiento</label>
                  <input type="date" v-model="form.fechaNacimiento" required>
                </div>
                <div class="input-group">
                  <label>Celular</label>
                  <input type="tel" v-model="form.celular" placeholder="+52 000 000 0000">
                </div>
                <div class="input-group">
                  <label>Correo electrónico</label>
                  <input type="email" v-model="form.email" placeholder="ejemplo@correo.com">
                </div>
                
                <div class="input-group">
                  <label>Contraseña</label>
                  <div class="password-container">
                    <input :type="showPassword ? 'text' : 'password'" v-model="form.password" placeholder="********" required>
                    <button type="button" class="eye-btn" @click="showPassword = !showPassword" :title="showPassword ? 'Ocultar contraseña' : 'Ver contraseña'">
                      <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                  </div>
                </div>

                <div class="input-group">
                  <label>Confirmar Contraseña</label>
                  <div class="password-container">
                    <input :type="showConfirmPassword ? 'text' : 'password'" v-model="form.confirmPassword" placeholder="********" required>
                    <button type="button" class="eye-btn" @click="showConfirmPassword = !showConfirmPassword" :title="showConfirmPassword ? 'Ocultar contraseña' : 'Ver contraseña'">
                      <svg v-if="showConfirmPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tarjeta 2: Registro de Físico -->
            <div class="login-card">
              <h3 class="section-title">Registro de Físico</h3>
              <div class="form-grid">
                <div class="input-group">
                  <label>Peso (Kg)</label>
                  <input type="number" step="0.1" v-model="form.peso" placeholder="Ej. 70">
                </div>
                <div class="input-group">
                  <label>Altura (cm)</label>
                  <input type="number" v-model="form.altura" placeholder="Ej. 175">
                </div>
              </div>
            </div>

            <!-- Tarjeta 3: Datos de Membresía -->
            <div class="login-card">
              <h3 class="section-title">Datos de Membresía</h3>
              <div class="form-grid">
                <div class="input-group">
                  <label>Inscripción</label>
                  <input type="date" v-model="form.fechaInscripcion">
                </div>
                <div class="input-group">
                  <label>Fecha Corte</label>
                  <input type="date" v-model="form.fechaCorte">
                </div>
              </div>
            </div>
            
            <button type="submit" class="btn-primary">Finalizar Registro</button>
            <div class="footer-link">
              ¿Ya tienes cuenta? <router-link :to="{ name: 'loginclient' }">Inicia sesión</router-link>
            </div>
          </form>
        </div>
      </div>
    </main>

    <!-- Modales -->
    <transition name="pop">
      <div v-if="activeModal" class="modal-wrapper" @click.self="activeModal = null">
        <AddCorteComponent v-if="activeModal === 'corte'" @close="activeModal = null" />
        <Help v-if="activeModal === 'help'" @close="activeModal = null" />
      </div>
    </transition>
  </Heading>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, reactive } from 'vue';
import Heading from '../Record/Heading.vue';
import Help from '../../components/Admin/Componets/Help.vue';
import NotificationSystem from '../../components/Modals/NotificationSystem.vue'; 

const activeModal = ref(null);
const toastRef = ref(null);
const fileInput = ref(null);
const previewImage = ref(null);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const form = reactive({
  nombres: '', 
  apellidoP: '', 
  apellidoM: '',
  fechaNacimiento: '', 
  celular: '', 
  email: '',
  password: '',          
  confirmPassword: '',   
  peso: '', 
  altura: '',
  tipoMembresia: 'mes',
  fechaInscripcion: '', 
  fechaCorte: ''
});

const triggerFileInput = () => fileInput.value?.click();

const onFileSelected = (event) => {
  const file = event.target.files[0];
  if (file) {
    previewImage.value = URL.createObjectURL(file);
  }
};

const saveRegistration = () => {
  if (!form.nombres || !form.apellidoP) {
    toastRef.value?.notify('Por favor, completa los campos obligatorios (Nombres y Apellido Paterno)', 'warning');
    return;
  }

  if (form.password !== form.confirmPassword) {
    toastRef.value?.notify('Las contraseñas no coinciden', 'error');
    return;
  }
  
  try {
    console.log("Registro de cliente enviado:", form);
    toastRef.value?.notify('Cliente registrado exitosamente', 'success');
  } catch (error) {
    toastRef.value?.notify('Error al registrar al cliente', 'error');
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;600;700&display=swap');

.main-content { 
  display: flex; 
  justify-content: center; 
  width: 100%; 
  padding: 40px clamp(16px, 3vw, 40px); 
  box-sizing: border-box; 
}

.highlight { 
  color: #3b82f6; 
}

.profile-card { 
  display: grid; 
  grid-template-columns: 340px minmax(0, 1fr); 
  gap: 30px; 
  width: 100%; 
  max-width: 1200px;
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

.profile-hint {
  font-family: 'Inter', sans-serif;
  color: #94a3b8;
  font-size: 0.85rem;
  line-height: 1.4;
  margin-top: 10px;
}

.forms-wrapper { 
  display: flex; 
  flex-direction: column; 
  gap: 20px; 
  width: 100%; 
}

.login-card { 
  background: rgba(18, 18, 18, 0.75); 
  backdrop-filter: blur(12px);
  padding: 30px; 
  border-radius: 24px; 
  border: 1px solid rgba(255, 255, 255, 0.12); 
  margin-bottom: 20px;
  box-sizing: border-box;
}

.form-grid { 
  display: grid; 
  grid-template-columns: repeat(2, 1fr); 
  gap: 20px; 
}

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
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.section-title { 
  font-family: 'Oswald', sans-serif; 
  color: #5b8bf0; 
  font-size: 0.95rem; 
  margin: 0 0 20px 0; 
  text-transform: uppercase; 
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08); 
  padding-bottom: 10px; 
}

/* Avatar Components */
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
  cursor: pointer;
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
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.2s;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  touch-action: manipulation;
}

.avatar-action svg {
  width: 20px;  
  height: 20px;
}

/* Password Eye Button */
.password-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.password-container input {
  padding-right: 48px; 
}

.eye-btn {
  position: absolute;
  right: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  color: #94a3b8;
  transition: color 0.2s;
}

.eye-btn:hover {
  color: #fff;
}

.eye-btn svg {
  width: 20px;
  height: 20px;
}

/* Footer Link */
.footer-link {
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.95rem;
  color: #94a3b8;
  margin-top: 24px;
}

.footer-link a { 
  color: #5b8bf0; 
  text-decoration: none; 
  font-weight: 700; 
}

.footer-link a:hover { 
  text-decoration: underline; 
}

/* Botón principal */
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
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 14px rgba(28, 79, 214, 0.35);
}

@media (hover: hover) {
  .btn-primary:hover {
    transform: translateY(-2px); 
    background: #1742be;
    box-shadow: 0 6px 18px rgba(28, 79, 214, 0.5);
  }
  .avatar-action:hover {
    transform: scale(1.08);
  }
}

.btn-primary:active, .avatar-action:active {
  transform: scale(0.96);
}

/* Modal */
.modal-wrapper {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.pop-enter-active, .pop-leave-active { transition: opacity 0.3s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; }

/* Responsive Media Queries */
@media (max-width: 1024px) { 
  .profile-card { 
    grid-template-columns: 1fr; 
  } 
  .profile-section {
    position: static;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 12px;
  }
  
  .form-grid { 
    grid-template-columns: 1fr; 
    gap: 14px;
  } 

  .login-card { 
    padding: 20px;
    border-radius: 20px;
  }

  .avatar-circle {
    width: 130px;
    height: 130px;
  }
}
</style>