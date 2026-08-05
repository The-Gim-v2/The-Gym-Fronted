<script setup lang="ts">
import { reactive, ref } from 'vue';

const emit = defineEmits(['close']);

const allDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const fileInput = ref<HTMLInputElement | null>(null);
const previewImage = ref<string | null>(null);
const submitted = ref(false);

const adminData = {
  curp: 'IFC220101HSLPR01',
  nombres: 'Juan Carlos',
  apellidoP: 'Pérez',
  apellidoM: 'Gómez',
  fechaNac: '1985-06-15',
  celular: '4811234567',
  email: 'contacto@ironfitness.com'
};

const form = reactive({
  nombreGimnasio: '',
  entidad: 'San Luis Potosí',
  municipio: '',
  cp: '',
  colonia: '',
  calle: '',
  numExt: '',
  numInt: '',
  selectedDays: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  precioMes: '',
  precioSem: ''
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

const handleRegisterSede = () => {
  const payload = {
    ...adminData,
    ...form,
    logotipo: previewImage.value
  };
  console.log('Registro de nueva sede:', payload);
  submitted.value = true;
  setTimeout(() => {
    emit('close');
  }, 2000);
};
</script>

<template>
  <div class="register-page-modal">
    <div class="header-section">
      <h2 class="title">REGISTRAR NUEVA <span class="highlight-text">SEDE</span></h2>
      <p class="subtitle">Tus datos de administrador ya están vinculados. Agrega la información de la nueva sucursal.</p>
    </div>

    <div v-if="submitted" class="alert-success">¡Sede registrada exitosamente! Redirigiendo...</div>

    <form @submit.prevent="handleRegisterSede">
      <div class="rg-grid">

        <!-- Columna 1: Imagen y Datos de la Sede -->
        <div class="form-column">
          <h3 class="section-divider first">Logotipo de la sucursal</h3>
          <div class="upload-container">
            <div class="image-preview" @click="triggerFileInput">
              <img v-if="previewImage" :src="previewImage" class="profile-img" />
              <div v-else class="upload-placeholder">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                <span>Subir</span>
              </div>
            </div>
            <input type="file" ref="fileInput" @change="onFileSelected" accept="image/*" style="display: none" />
            <p class="upload-info">Logotipo distintivo para esta sede</p>
          </div>

          <h3 class="section-divider">Identidad de la sucursal</h3>
          <div class="input-group">
            <label for="nombreGimnasio">Nombre de la sucursal / Gimnasio</label>
            <input id="nombreGimnasio" type="text" v-model="form.nombreGimnasio" placeholder="Ej. Iron Fitness Norte" required />
          </div>

          <div class="admin-locked-info">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <span>Administrador vinculado: <strong>{{ adminData.nombres }} {{ adminData.apellidoP }}</strong> (CURP: {{ adminData.curp }})</span>
          </div>
        </div>

        <!-- Columna 2: Ubicación de la Sede -->
        <div class="form-column">
          <h3 class="section-divider first">Ubicación de la nueva sede</h3>
          <div class="stack-gap">
            <div class="rg-row">
              <div class="input-group">
                <label for="entidad">Entidad</label>
                <input id="entidad" type="text" v-model="form.entidad" required />
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

        <!-- Columna 3: Operación de la Sede -->
        <div class="form-column">
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
              <label for="precioMes">Mensualidad ($)</label>
              <input id="precioMes" type="number" v-model="form.precioMes" placeholder="0.00" required />
            </div>
            <div class="input-group">
              <label for="precioSem">Semanal ($)</label>
              <input id="precioSem" type="number" v-model="form.precioSem" placeholder="0.00" required />
            </div>
          </div>

          <div class="actions-section">
            <button type="submit" class="btn-primary">
              Registrar sucursal
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </div>

      </div>
    </form>
  </div>
</template>

<style scoped>
.register-page-modal {
  color: var(--color-texto-general, #e5e5e5);
  font-family: inherit;
  width: 100%;
}

.header-section { text-align: center; margin-bottom: 24px; }

.title {
  font-family: 'Anton', sans-serif;
  font-size: 2rem;
  letter-spacing: -0.5px;
  text-transform: uppercase;
  margin: 0 0 6px;
  color: var(--color-titulos, #fff);
}

.highlight-text { color: var(--color-highlight, #3b82f6); }

.subtitle { font-size: 14.5px; color: var(--color-texto-general, rgba(255, 255, 255, 0.8)); margin: 0; }

.alert-success {
  font-size: 14px;
  font-weight: 600;
  padding: 14px 16px;
  border-radius: var(--app-border-radius, 10px);
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.4);
  color: #22c55e;
  margin-bottom: 20px;
  text-align: center;
}

.rg-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  align-items: start;
}

.form-column { display: flex; flex-direction: column; gap: 10px; min-width: 0; }

.section-divider {
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.6px;
  color: var(--color-titulos, #fff);
  border-bottom: 1px solid rgba(255, 255, 255, 0.09);
  padding-bottom: 6px;
  margin: 18px 0 8px;
  text-transform: uppercase;
}

.section-divider.first { margin: 0 0 8px; }

.admin-locked-info {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.09);
  padding: 14px;
  border-radius: var(--app-border-radius, 10px);
  font-size: 13.5px;
  color: var(--color-texto-general, #ccc);
  margin-top: 12px;
  line-height: 1.4;
}

.admin-locked-info strong { color: var(--color-titulos, #fff); }
.admin-locked-info svg { flex-shrink: 0; color: var(--color-highlight, #3b82f6); }

.upload-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.03);
  padding: 14px;
  border-radius: var(--app-border-radius, 12px);
  border: 1px dashed rgba(255, 255, 255, 0.15);
}

.image-preview {
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--app-border-radius, 10px);
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.profile-img { width: 100%; height: 100%; object-fit: cover; }

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-texto-general, #aaa);
  gap: 4px;
  text-align: center;
}

.upload-placeholder span { font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--color-texto-general, #fff); }

.upload-info { font-size: 13.5px; color: var(--color-texto-general, #aaa); margin: 0; line-height: 1.4; }

.stack-gap { display: flex; flex-direction: column; gap: 12px; }

.rg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.input-group { display: flex; flex-direction: column; gap: 6px; }

label {
  font-family: 'Oswald', sans-serif;
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: var(--color-texto-general, #ccc);
}

input {
  width: 100%;
  padding: 12px 14px;
  background: var(--bg-cards, #141414);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: var(--app-border-radius, 10px);
  color: var(--color-texto-general, #fff);
  font-weight: 500;
  font-size: 14.5px;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input::placeholder { color: rgba(255, 255, 255, 0.3); }

input:focus {
  border-color: var(--color-highlight, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.days-container { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px; }

.day-chip {
  padding: 8px 12px;
  border-radius: var(--app-border-radius, 8px);
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 12.5px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: rgba(255, 255, 255, 0.03);
  color: var(--color-texto-general, #aaa);
  transition: all 0.2s ease;
}

.day-chip:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.day-chip.active {
  border-color: var(--color-highlight, #3b82f6);
  background: var(--color-highlight, #3b82f6);
  color: #ffffff;
}

.price-row { margin-top: 12px; }

.actions-section { margin-top: 28px; }

.btn-primary {
  width: 100%;
  padding: 15px;
  background: var(--color-highlight, #3b82f6);
  color: #ffffff;
  border: none;
  border-radius: var(--app-border-radius, 10px);
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  transition: all 0.25s ease;
}

.btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

@media (max-width: 900px) {
  .rg-grid { grid-template-columns: 1fr; }
}
</style>