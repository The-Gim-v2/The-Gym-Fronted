<template>
  <HeadingOwner>
    <NotificationSystem ref="toastRef" />
    <main class="main-content">
      <div class="profile-card">
        <div class="profile-section">
          <h1 class="main-title">Registra a tu <br> <span class="highlight">Personal</span></h1>
          
          <div class="avatar-wrapper">
            <div class="avatar-circle" @click="$refs.fileInput.click()" title="Hacer clic para subir foto">
              <img v-if="avatarPreview" :src="avatarPreview" alt="Vista previa del empleado" class="avatar-img" />
              <svg v-else viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <button type="button" class="avatar-action btn-camera" @click="$refs.fileInput.click()" title="Subir fotografía">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </button>
            <input type="file" ref="fileInput" accept="image/*" style="display: none" @change="handleFileChange" />
          </div>
          <p class="profile-hint">Sube una fotografía oficial o reciente para el expediente del empleado.</p>
        </div>

        <div class="forms-wrapper">
          
          <div class="login-card">
            <h3 class="section-title">Credenciales y Rol</h3>
            <div class="form-grid">
              <div class="input-group">
                <label>Rol en el sistema</label>
                <select v-model="form.rol" class="custom-select">
                  <option value="" disabled>Seleccionar rol</option>
                  <option value="Owner">Dueño</option>
                  <option value="entrenador">Entrenador</option>
                  <option value="recepcion">Recepción</option>
                </select>
              </div>
              <div class="input-group">
                <label>Correo electrónico</label>
                <input type="email" v-model="form.email" placeholder="correo@ejemplo.com">
              </div>
              <div class="input-group span-full" v-if="form.rol === 'entrenador'">
                <label>Especialidad</label>
                <input type="text" v-model="form.especialidad" placeholder="Ej. Musculación, Funcional, Yoga">
              </div>
            </div>
          </div>

          <div class="login-card">
            <h3 class="section-title">Datos del empleado</h3>
            <div class="form-grid">
              <div class="input-group span-full">
                <label>CURP</label>
                <input type="text" v-model="form.curp" placeholder="Ej. ABCD010101HDF000">
              </div>
              <div class="input-group">
                <label>Nombres</label>
                <input type="text" v-model="form.nombres" placeholder="Ej. Juan">
              </div>
              <div class="input-group">
                <label>Apellido Paterno</label>
                <input type="text" v-model="form.apellidoP" placeholder="Ej. Pérez">
              </div>
              <div class="input-group">
                <label>Apellido Materno</label>
                <input type="text" v-model="form.apellidoM" placeholder="Ej. Gómez">
              </div>
              <div class="input-group">
                <label>Fecha de Nacimiento</label>
                <input type="date" v-model="form.fechaNacimiento">
              </div>
              <div class="input-group">
                <label>Celular</label>
                <input type="text" v-model="form.celular" placeholder="+52 000 000 0000">
              </div>

              <template v-if="form.rol !== 'recepcion' && form.rol !== 'Owner'">
                <div class="input-group">
                  <label>Facebook</label>
                  <input type="text" v-model="form.facebook" placeholder="usuario_fb">
                </div>
                <div class="input-group">
                  <label>Instagram</label>
                  <input type="text" v-model="form.instagram" placeholder="@usuario_ig">
                </div>
                <div class="input-group">
                  <label>TikTok</label>
                  <input type="text" v-model="form.tiktok" placeholder="@usuario_tt">
                </div>
                <div class="input-group">
                  <label>Otras app</label>
                  <input type="text" v-model="form.otrasApps" placeholder="Ej. X, LinkedIn">
                </div>
              </template>
            </div>
          </div>

          <div class="login-card">
            <h3 class="section-title">Horario de trabajo</h3>
            <div class="form-grid">
              <div class="input-group">
                <label>Entrada</label>
                <input type="time" v-model="form.horaEntrada">
              </div>
              <div class="input-group">
                <label>Salida</label>
                <input type="time" v-model="form.horaSalida">
              </div>
            </div>
          </div>

          <button type="button" class="btn-primary" @click="saveRegistration">Finalizar Registro</button>
        </div>
      </div>
    </main>
  </HeadingOwner>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import HeadingOwner from '../HeadingOwner.vue';
import NotificationSystem from '../../Modals/NotificationSystem.vue'; 

const router = useRouter();
const toastRef = ref(null);
const fileInput = ref(null);
const avatarPreview = ref(null);

const form = reactive({
  curp: '',
  nombres: '',
  apellidoP: '',
  apellidoM: '',
  fechaNacimiento: '',
  celular: '',
  facebook: '',
  instagram: '',
  tiktok: '',
  otrasApps: '',
  rol: '',
  email: '',
  especialidad: '',
  horaEntrada: '',
  horaSalida: ''
});

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    avatarPreview.value = URL.createObjectURL(file);
  }
};

const saveRegistration = () => {
  if (!form.nombres || !form.apellidoP) {
    toastRef.value?.notify('Por favor, completa los campos obligatorios (Nombres y Apellido Paterno)', 'warning');
    return;
  }
  
  try {
    console.log("Datos del personal a guardar:", form);
    toastRef.value?.notify('Registro guardado con éxito', 'success');
  } catch (error) {
    toastRef.value?.notify('Error al guardar el registro', 'error');
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
  color: var(--color-texto-general, #e5e5e5);
}

.highlight { 
  color: var(--color-highlight, #3b82f6); 
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
  background: var(--bg-cards, rgba(18, 18, 18, 0.75)); 
  backdrop-filter: blur(12px);
  padding: 40px 24px; 
  border-radius: var(--app-border-radius, 24px); 
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
  color: var(--color-titulos, #fff); 
  margin: 0 0 24px 0; 
  line-height: 1.1; 
  text-transform: uppercase; 
  letter-spacing: 0.5px;
}

.profile-hint {
  font-family: 'Inter', sans-serif;
  color: var(--color-texto-general, #94a3b8);
  font-size: 0.85rem;
  line-height: 1.4;
  margin-top: 10px;
  opacity: 0.8;
}

.forms-wrapper { 
  display: flex; 
  flex-direction: column; 
  gap: 20px; 
  width: 100%; 
}

.login-card { 
  background: var(--bg-cards, rgba(18, 18, 18, 0.75)); 
  backdrop-filter: blur(12px);
  padding: 30px; 
  border-radius: var(--app-border-radius, 24px); 
  border: 1px solid rgba(255, 255, 255, 0.12); 
  box-sizing: border-box;
}

.form-grid { 
  display: grid; 
  grid-template-columns: repeat(2, 1fr); 
  gap: 20px; 
}

.form-grid .span-full {
  grid-column: span 2;
}

.input-group { 
  display: flex; 
  flex-direction: column; 
  gap: 8px; 
}

label { 
  font-family: 'Oswald', sans-serif; 
  color: var(--color-texto-general, #f5f5f4); 
  font-size: 0.85rem; 
  font-weight: 600; 
  letter-spacing: 0.5px;
}

input, .custom-select { 
  background: var(--bg-cards, #141414); 
  border: 1.5px solid rgba(255, 255, 255, 0.12); 
  border-radius: var(--app-border-radius, 12px); 
  color: var(--color-texto-general, #fff); 
  padding: 12px 14px; 
  width: 100%; 
  box-sizing: border-box; 
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus, .custom-select:focus {
  border-color: var(--color-highlight, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.custom-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 16px;
  padding-right: 40px;
  cursor: pointer;
}

.section-title { 
  font-family: 'Oswald', sans-serif; 
  color: var(--color-highlight, #5b8bf0); 
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
  background: var(--bg-cards, #141414); 
  border-radius: 50%; 
  border: 4px solid var(--color-highlight, #3b82f6); 
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
  background: var(--color-highlight, #3b82f6); 
  border: 2px solid var(--bg-cards, #121212); 
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

.btn-primary {
  padding: 16px 36px;
  background: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, white);
  border: none;
  border-radius: var(--app-border-radius, 12px);
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 16px rgba(28, 79, 214, 0.4);
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

  .form-grid .span-full {
    grid-column: span 1;
  }

  .login-card { 
    padding: 20px;
    border-radius: var(--app-border-radius, 20px);
  }

  .avatar-circle {
    width: 130px;
    height: 130px;
  }
}
</style>