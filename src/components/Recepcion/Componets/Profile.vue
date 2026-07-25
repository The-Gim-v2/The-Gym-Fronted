<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted, computed } from 'vue';
import HeadingRecepcion from '../HeadingRecepcion.vue';
import RegisterGymModal from '../../Record/Record-Gym.vue'; 
import AIChatModal from '../../Record/Record-Staff.vue'; 
import MembershipModal from '../../Modals/MembershipModal.vue';

const fileInput = ref<HTMLInputElement | null>(null);
const previewImage = ref<string | null>(null);
const showPassword = ref(false);

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
  curp: 'GOMJ850615HSLPR01',
  nombres: 'Juan Carlos',
  apellidoP: 'Pérez',
  apellidoM: 'Gómez',
  fechaNac: '1985-06-15',
  celular: '4811234567',
  email: 'juancarlos@ironfitness.com',
  password: '',
  confirmPassword: ''
});

const triggerFileInput = () => fileInput.value?.click();
const onFileSelected = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    previewImage.value = URL.createObjectURL(file);
    showNotification('Fotografía actualizada temporalmente', 'info');
  }
};

const handleSaveChanges = () => {
  console.log('Guardar cambios:', form);
  showNotification('¡Cambios guardados correctamente!', 'success');
};
</script>

<template>
  <HeadingRecepcion>
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
          <h1 class="main-title">PERFIL DEL <br> <span class="highlight">RECEPCIONISTA</span></h1>
          
          <div class="avatar-wrapper" @click="triggerFileInput" title="Subir fotografía">
            <div class="avatar-circle">
              <img v-if="previewImage" :src="previewImage" alt="Vista previa" class="avatar-img" />
              <svg v-else viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <button type="button" class="avatar-action btn-camera" title="Cambiar fotografía">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </button>
            <input type="file" ref="fileInput" @change="onFileSelected" accept="image/*" style="display: none" />
          </div>

          <h3 class="gym-name-display">{{ `${form.nombres} ${form.apellidoP}` }}</h3>
          <p class="profile-hint">Actualiza tu información personal y credenciales de acceso.</p>
        </div>

        <!-- Columna Derecha: Formulario -->
        <div class="forms-wrapper">
          <form @submit.prevent="handleSaveChanges">
            
            <!-- Datos Personales -->
            <div class="login-card">
              <h3 class="section-title">Datos Personales</h3>
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
                  <label for="curp">CURP</label>
                  <input id="curp" type="text" v-model="form.curp" disabled class="input-disabled" title="El CURP no se puede editar" />
                </div>
                <div class="input-group">
                  <label for="fechaNac">Fecha de nacimiento</label>
                  <input id="fechaNac" type="date" v-model="form.fechaNac" required />
                </div>
                <div class="input-group">
                  <label for="celular">Teléfono celular</label>
                  <input id="celular" type="tel" v-model="form.celular" required />
                </div>
                <div class="input-group span-2">
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

            <div class="button-container">
              <button type="submit" class="btn-primary">Guardar Cambios</button>
            </div>
          </form>
        </div>
      </div>

    </main>
  </HeadingRecepcion>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;600;700&display=swap');

.main-content { 
  display: flex; 
  justify-content: center; 
  width: 100%; 
  padding: 40px clamp(12px, 3vw, 40px); 
  box-sizing: border-box; 
  position: relative;
  overflow-x: hidden;
}

.highlight { color: #3b82f6; }

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
  min-width: 0; /* Evita que los elementos hijosfuercen el ancho en flex */
}

.login-card { 
  background: rgba(18, 18, 18, 0.75); 
  backdrop-filter: blur(12px);
  padding: 36px; 
  margin-top: 25px;
  border-radius: 24px; 
  border: 1px solid rgba(255, 255, 255, 0.12); 
  box-sizing: border-box;
  width: 100%;
}

.form-grid { 
  display: grid; 
  grid-template-columns: repeat(2, 1fr); 
  gap: 24px; 
}

.span-2 { grid-column: span 2; }

.input-group { 
  display: flex; 
  flex-direction: column; 
  gap: 8px; 
  min-width: 0; /* Previene desbordamiento en grids con celdas flexibles */
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

.input-wrapper { position: relative; width: 100%; }
.toggle-password-btn {
  position: absolute; right: 0; top: 0; height: 100%; width: 44px;
  background: transparent; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: rgba(245, 245, 244, 0.4);
}

.button-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
}

.btn-primary {
  width: 50%; /* Botón al 50% en pantallas grandes */
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
}

.btn-primary:hover {
  background: #1742be;
  transform: translateY(-2px);
}


@media (max-width: 1024px) { 
  .profile-card { grid-template-columns: 1fr; } 
  .profile-section { position: static; transform: none !important; }
}

@media (max-width: 768px) {
  .main-content {
    padding: 20px 10px; /* Reducción de márgenes laterales en móvil */
  }
  .login-card {
    padding: 20px 16px; /* Tarjeta adaptada para pantallas compactas */
    margin-top: 15px;
  }
  .btn-primary {
    width: 100%;
  }
  .form-grid { 
    grid-template-columns: 1fr; 
    gap: 16px; 
  }
  .span-2 { grid-column: span 1; }
  .main-title {
    font-size: 1.8rem;
  }
}
</style>