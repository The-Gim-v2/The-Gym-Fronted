<template>
  <Heading>
    <NotificationSystem ref="toastRef" />
    <main class="main-content  " >
      <div class="profile-card" >
        <!-- Sección Perfil -->
        <div class="profile-section">
          <h1 class="main-title">Registra tus <br> <span class="highlight">Clientes</span></h1>
          <div class="avatar-wrapper">
            <div class="avatar-circle">
              <img v-if="previewImage" :src="previewImage" class="avatar-img" />
              <svg v-else viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <button type="button" class="avatar-action btn-camera" @click="triggerFileInput">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </button>
            <input type="file" ref="fileInput" accept="image/*" @change="onFileSelected" style="display: none" />
          </div>
        </div>

        <!-- Formularios -->
        <div class="forms-wrapper">
          <form @submit.prevent="saveRegistration">
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
                <input type="password" v-model="form.password" placeholder="********" required>
                </div>

                <div class="input-group">
                <label>Confirmar Contraseña</label>
                <input type="password" v-model="form.confirmPassword" placeholder="********" required>
                </div>

              </div>
            </div>

            <div class="login-card">
              <h3 class="section-title">Registro de Físico</h3>
              <div class="form-grid">
                <div class="input-group">
                  <label>Peso (Kg)</label>
                  <input type="number" v-model="form.peso" placeholder="Ej. 70">
                </div>
                <div class="input-group">
                  <label>Altura (cm)</label>
                  <input type="number" v-model="form.altura" placeholder="Ej. 175">
                </div>
              </div>
            </div>

            <div class="login-card">
              <h3 class="section-title">Datos de Membresía</h3>
              <div class="membership-header">
              </div>
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
import { ref, reactive } from 'vue';
import Heading from '../Record/Heading.vue';
import AddCorteComponent from '../../components/Admin/Componets/Cut.vue';

import Help from '../../components/Admin/Componets/Help.vue';
import NotificationSystem from '../../components/Modals/NotificationSystem.vue'; 

const activeModal = ref(null);
const toastRef = ref(null);
const fileInput = ref(null);
const previewImage = ref(null);
const showPassword = ref(false);
const showConfirmPassword = ref(false); // Nueva variable

const form = reactive({
  nombres: '', apellidoP: '', apellidoM: '',
  fechaNacimiento: '', celular: '', email: '',
  password: '',          // Asegúrate de tener esto
  confirmPassword: '',   // Agrega este campo
  peso: '', altura: '',
  tipoMembresia: 'mes',
  fechaInscripcion: '', fechaCorte: ''
});

const triggerFileInput = () => fileInput.value?.click();

const onFileSelected = (event) => {
  const file = event.target.files[0];
  if (file) previewImage.value = URL.createObjectURL(file);
};

const saveRegistration = () => {
  if (!form.nombres || !form.apellidoP) {
    toastRef.value.notify('Completa los campos obligatorios', 'warning');
    return;
  }
  console.log("Registro de cliente enviado:", form);
  toastRef.value.notify('Cliente registrado exitosamente', 'success');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;700;800&family=Oswald:wght@400;700&display=swap');

.main-content { display: flex; justify-content: center; width: 100%; padding: 40px clamp(16px, 3vw, 40px); box-sizing: border-box; }
.highlight { color: #3b82f6; }
.profile-card { 
  
  display: grid; 
  grid-template-columns: 320px auto; 
  gap: 30px; 
  width: 100%; 
  max-width: 1100px;
  margin: 0 auto;   
  align-items: start; 
  justify-content: center; 
}

.footer-link {
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 16px; /* Letra más grande */
  color: rgba(245, 245, 244, 0.7);
  margin-top: 20px; /* Altura/separación del botón */
  padding-bottom: 10px;
}

.footer-link a { 
  color: #5b8bf0; 
  text-decoration: none; 
  font-weight: 700; 
}

.footer-link a:hover { 
  text-decoration: underline; 
}

.password-container {
  position: relative;
  display: flex;
  align-items: center;
}

/* Ajusta el padding para que el texto no choque con el ojo */
.password-container input {
  padding-right: 45px; 
}

.eye-btn {
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px; /* Aumentar un poco el área de clic ayuda mucho */
  height: 40px;
  padding: 0;
  z-index: 10;
  pointer-events: auto; /* Asegura que el botón reciba el clic */
}

.eye-btn svg {
  width: 22px;
  height: 22px;
  stroke: white;
  pointer-events: none; /* Hace que el clic atraviese el icono y toque el botón */
}
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

.actions-group { display: flex; gap: 10px; }

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #3b82f6;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: transform 0.2s, background 0.2s;
}

.action-btn:hover {
  background: #2563eb;
  transform: scale(1.1);
}

.action-btn svg {
  width: 20px;
  height: 20px;
}

.profile-section { 
  background: rgba(18, 18, 18, 0.7); 
  padding: 40px 20px; 
  border-radius: 24px; 
  border: 1px solid rgba(255, 255, 255, 0.09);
  display: flex; flex-direction: column; align-items: center; text-align: center;
}
.forms-wrapper { 
  display: flex; 
  flex-direction: column; 
  gap: 20px; 
  width: 100%; 
  max-width: 700px; 
}
.login-card { 
  background: rgba(18, 18, 18, 0.7); 
  padding: 40px; 
  border-radius: 24px; 
  border: 1px solid rgba(255, 255, 255, 0.12); 
  margin-bottom: 20px;
}
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.input-group { display: flex; flex-direction: column; gap: 8px; }
/* Tipografía y otros elementos */
.main-title { font-family: 'Anton', sans-serif; font-size: 2rem; color: #fff; margin: 0 0 20px 0; line-height: 1.1; text-transform: uppercase; }
.section-title { font-family: 'Oswald', sans-serif; color: #5b8bf0; font-size: 14px; margin-bottom: 15px; text-transform: uppercase; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 8px; }

label { font-family: 'Oswald', sans-serif; color: #f5f5f4; font-size: 11px; font-weight: 700; }
input { 
  background: #141414; 
  border: 1.5px solid rgba(255, 255, 255, 0.12); 
  border-radius: 12px; 
  color: #fff; 
  padding: 10px 14px; 
  width: 100%; 
  box-sizing: border-box; 
}
.input-group label { font-family: 'Oswald', sans-serif; font-size: 14px; color: #fff; letter-spacing: 0.5px; font-weight: 500; }

/* Avatar */
.avatar-circle { width: 140px; height: 140px; background: #141414; border-radius: 50%; border: 4px solid #3b82f6; display: flex; align-items: center; justify-content: center; }
.avatar-wrapper { position: relative; margin-bottom: 20px; }
.avatar-action { position: absolute; width: 45px; height: 45px; border-radius: 50%; background: #2bacf1cb; border: 2px solid #000; cursor: pointer; bottom: 0; right: 0; display: flex; align-items: center; justify-content: center; }


/* Membresía */
.membership-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.toggle-group-small { display: flex; gap: 5px; background: rgba(255,255,255,0.1); padding: 4px; border-radius: 8px; }
.btn-toggle-small { padding: 4px 16px; border: none; color: white; border-radius: 6px; cursor: pointer; font-size: 0.8rem; background: transparent; }
.btn-toggle-small.active { background: #3b82f6; }
.icon-svg { width: 24px; cursor: pointer; }


.avatar-action svg {
  width: 24px;  
  height: 24px;
  
}

.btn-primary {
  width: 100%;
  padding: 16px;
  background: #1c4fd6;
  color: white;
  border: none;
  border-radius: 12px;
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  cursor: pointer;
  text-transform: uppercase;
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}


.avatar-action:active {
  transform: scale(0.9);
}

@media (hover: hover) {
  .btn-primary:hover {
    transform: scale(1.02); 
  }
}

.btn-primary:active {
  transform: scale(0.95);
}
.avatar-action {
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.2s;
  touch-action: manipulation;
}



@media (max-width: 1024px) { .profile-card { grid-template-columns: 1fr; } }
@media (min-width: 1440px) { .profile-card { max-width: 1600px; gap: 60px; } }



@media (max-width: 768px) {
.avatar-action {
    width: 35px;
    height: 35px;
  }
  
  .avatar-action:active {
    transform: scale(0.9);
  }
  

  .main-content {
    padding: 10px;
    width: 100%;
  }

  .profile-card { grid-template-columns: 1fr; } /* Apila todo en una columna */
  .form-grid { grid-template-columns: 1fr; }   /* Los inputs ahora van uno debajo de otro */
  .profile-section { width: 100%; box-sizing: border-box; }



  .rg-grid { 
    grid-template-columns: 1fr; 
    gap: 15px; 
  }

  .login-card { 
    width: 100%;
    box-sizing: border-box; 
    margin-bottom: 10px;
    padding: 15px;
  }

  .avatar-action {
    width: 35px; /* Tamaño reducido de 50px a 35px */
    height: 35px;
  }
  .avatar-circle {
    width: 120px;
    height: 120px;
  }
}
</style>