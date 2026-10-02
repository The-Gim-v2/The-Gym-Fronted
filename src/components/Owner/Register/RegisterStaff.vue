<template>
  <HeadingOwner>
    <NotificationSystem ref="toastRef" />
    <main class="main-content">
      <div class="profile-card">

        <!-- =====================================================
             PERFIL / FOTO
        ====================================================== -->
        <aside class="profile-section" id="tutorial-step-0">
          <div class="profile-content">
            <h1 class="main-title">
              <template v-if="currentLang === 'es'">Registra a tu <br> <span class="highlight">Personal</span></template>
              <template v-else-if="currentLang === 'en'">Register your <br> <span class="highlight">Staff</span></template>
              <template v-else-if="currentLang === 'fr'">Enregistrez votre <br> <span class="highlight">Personnel</span></template>
              <template v-else-if="currentLang === 'pt'">Registre sua <br> <span class="highlight">Equipe</span></template>
            </h1>

            <div class="avatar-wrapper">
              <div class="avatar-ring">
                <div class="avatar-circle" @click="fileInput?.click()" :title="t('titleAvatarClick')">
                  <img v-if="avatarPreview" :src="avatarPreview" :alt="t('altEmployeePreview')" class="avatar-img" />
                  <svg v-else viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </div>
              </div>
              <button type="button" class="avatar-action btn-camera" @click="fileInput?.click()" :title="t('titleUploadPhoto')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </button>
              <input type="file" ref="fileInput" accept="image/*" style="display: none" @change="handleFileChange" />
            </div>

            <p class="profile-hint">{{ t('hintEmployeePhoto') }}</p>

            <!-- Resumen -->
            <dl class="profile-summary">
              <div class="summary-item">
                <dt>{{ t('names') }}</dt>
                <dd :class="{ empty: !form.nombres && !form.apellidoP }">
                  {{ [form.nombres, form.apellidoP, form.apellidoM].filter(Boolean).join(' ') || '—' }}
                </dd>
              </div>
              <div class="summary-item">
                <dt>{{ t('systemRole') }}</dt>
                <dd>
                  <span v-if="form.rol" class="plan-chip">
                    {{ form.rol === 'gerente' ? 'Gerente' : form.rol === 'entrenador' ? t('roleTrainer') : t('roleReception') }}
                  </span>
                  <span v-else class="empty">—</span>
                </dd>
              </div>
              <div class="summary-item">
                <dt>{{ t('allowedLocations') }}</dt>
                <dd :class="{ empty: form.sedes.length === 0 }">{{ form.sedes.length || '—' }}</dd>
              </div>
              <div class="summary-item">
                <dt>{{ t('workSchedule') }}</dt>
                <dd :class="{ empty: !form.horaEntrada || !form.horaSalida }">
                  {{ form.horaEntrada && form.horaSalida ? `${form.horaEntrada} – ${form.horaSalida}` : '—' }}
                </dd>
              </div>
            </dl>
          </div>
        </aside>

        <div class="forms-wrapper">

          <!-- CREDENCIALES Y ROL -->
          <section class="login-card" id="tutorial-step-1">
            <header class="card-header">
              <h3 class="section-title">{{ t('credentialsAndRole') }}</h3>
            </header>

            <div class="form-grid">

              <!-- Rol -->
              <div class="input-group">
                <label>{{ t('systemRole') }}</label>
                <select v-model="form.rol" class="custom-select">
                  <option value="" disabled>{{ t('selectRole') }}</option>
                  <option value="gerente">Gerente</option>
                  <option value="entrenador">{{ t('roleTrainer') }}</option>
                  <option value="recepcion">{{ t('roleReception') }}</option>
                </select>
              </div>

              <!-- Correo -->
              <div class="input-group">
                <label>{{ t('email') }}</label>
                <div class="input-with-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <input type="email" v-model="form.email" placeholder="correo@ejemplo.com">
                </div>
              </div>

              <!-- Contraseñas (Gerente / Recepción) -->
              <template v-if="form.rol === 'gerente' || form.rol === 'recepcion'">
                <div class="input-group">
                  <label>{{ t('password') }}</label>
                  <input type="password" v-model="form.password" placeholder="••••••••">
                </div>
                <div class="input-group">
                  <label>{{ t('confirmPassword') }}</label>
                  <input type="password" v-model="form.confirmPassword" placeholder="••••••••">
                </div>
              </template>

              <!-- Especialidad (Solo Entrenador) -->
              <div class="input-group" v-if="form.rol === 'entrenador'">
                <label>{{ t('specialty') }}</label>
                <input type="text" v-model="form.especialidad" :placeholder="t('placeholderSpecialty')">
              </div>

              <!-- Sedes -->
              <div class="input-group" :class="{ 'sedes-right-col': form.rol !== 'entrenador' }">
                <label>{{ t('allowedLocations') }}</label>
                <div class="custom-multiselect" ref="dropdownRef">
                  <div class="select-box-trigger" :class="{ open: isDropdownOpen }" @click="isDropdownOpen = !isDropdownOpen">
                    <span class="trigger-text" :class="{ 'placeholder-text': form.sedes.length === 0 }">
                      {{ getSedesDisplayText() }}
                    </span>
                    <svg class="dropdown-arrow" :class="{ rotate: isDropdownOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>

                  <!-- Lista desplegable hacia arriba -->
                  <div class="dropdown-options-list" v-if="isDropdownOpen">
                    <div
                      v-for="sede in listaSedes"
                      :key="sede.id"
                      class="dropdown-option-item"
                      :class="{ selected: form.sedes.includes(sede.id) }"
                      @click="toggleSede(sede.id)"
                    >
                      <div class="option-checkbox">
                        <svg v-if="form.sedes.includes(sede.id)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <span>{{ sede.nombre }}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          <!-- DATOS DEL EMPLEADO -->
          <section class="login-card" id="tutorial-step-2">
            <header class="card-header">
              <h3 class="section-title">{{ t('employeeData') }}</h3>
            </header>

            <div class="form-grid">
              <div class="input-group span-full">
                <label>{{ t('curp') }}</label>
                <input type="text" v-model="form.curp" placeholder="Ej. ABCD010101HDF000">
              </div>
              <div class="input-group">
                <label>{{ t('names') }}<span class="required">*</span></label>
                <input type="text" v-model="form.nombres" :placeholder="t('placeholderName')">
              </div>
              <div class="input-group">
                <label>{{ t('lastNameP') }}<span class="required">*</span></label>
                <input type="text" v-model="form.apellidoP" :placeholder="t('placeholderLastNameP')">
              </div>
              <div class="input-group">
                <label>{{ t('lastNameM') }}</label>
                <input type="text" v-model="form.apellidoM" :placeholder="t('placeholderLastNameM')">
              </div>
              <div class="input-group">
                <label>{{ t('birthDate') }}</label>
                <input type="date" v-model="form.fechaNacimiento">
              </div>
              <div class="input-group">
                <label>{{ t('cellphone') }}</label>
                <div class="input-with-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8.01 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z"/></svg>
                  <input type="text" v-model="form.celular" placeholder="+52 000 000 0000">
                </div>
              </div>

              <template v-if="form.rol !== 'recepcion' && form.rol !== 'gerente'">
                <div class="input-group">
                  <label>{{ t('facebook') }}</label>
                  <input type="text" v-model="form.facebook" placeholder="usuario_fb">
                </div>
                <div class="input-group">
                  <label>{{ t('instagram') }}</label>
                  <input type="text" v-model="form.instagram" placeholder="@usuario_ig">
                </div>
                <div class="input-group">
                  <label>{{ t('tiktok') }}</label>
                  <input type="text" v-model="form.tiktok" placeholder="@usuario_tt">
                </div>
                <div class="input-group">
                  <label>{{ t('otherApps') }}</label>
                  <input type="text" v-model="form.otrasApps" :placeholder="t('placeholderOtherApps')">
                </div>
              </template>
            </div>
          </section>

          <!-- HORARIO DE TRABAJO -->
          <section class="login-card" id="tutorial-step-3">
            <header class="card-header">
              <h3 class="section-title">{{ t('workSchedule') }}</h3>
            </header>

            <div class="form-grid">
              <div class="date-field">
                <div class="date-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div class="date-content">
                  <label>{{ t('entryTime') }}</label>
                  <input type="time" v-model="form.horaEntrada">
                </div>
              </div>
              <div class="date-field">
                <div class="date-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div class="date-content">
                  <label>{{ t('exitTime') }}</label>
                  <input type="time" v-model="form.horaSalida">
                </div>
              </div>
            </div>
          </section>

          <!-- BOTÓN REGISTRAR -->
          <div class="registration-footer">
            <div class="required-hint">
              <span class="required">*</span>
              {{ currentLang === 'en' ? 'Required fields' : currentLang === 'fr' ? 'Champs obligatoires' : currentLang === 'pt' ? 'Campos obrigatórios' : 'Campos obligatorios' }}
            </div>
            <button type="button" class="btn-primary" @click="saveRegistration">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              {{ t('finishButtonStaff') }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </HeadingOwner>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import HeadingOwner from '../HeadingOwner.vue';
import NotificationSystem from '../../Modals/NotificationSystem.vue'; 
import { traducciones } from '../i18n.js';

const router = useRouter();
const toastRef = ref(null);
const fileInput = ref(null);
const avatarPreview = ref(null);
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

const currentLang = ref(localStorage.getItem('owner-idioma') || 'es');

const listaSedes = ref([
  { id: 'sede_norte', nombre: 'Sucursal Norte (Centro)' },
  { id: 'sede_sur', nombre: 'Sucursal Sur (Plaza)' },
  { id: 'sede_oriente', nombre: 'Sucursal Oriente' },
  { id: 'sede_poniente', nombre: 'Sucursal Poniente' }
]);

const t = (key) => {
  const langTable = traducciones[currentLang.value] || traducciones.es;
  return langTable[key] || traducciones.es[key] || key;
};

const handleLangChange = (e) => {
  if (e.detail && e.detail.idioma) {
    currentLang.value = e.detail.idioma;
  }
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('idioma-changed', handleLangChange);
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('idioma-changed', handleLangChange);
  document.removeEventListener('click', handleClickOutside);
});

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
  password: '',
  confirmPassword: '',
  especialidad: '',
  horaEntrada: '',
  horaSalida: '',
  sedes: [] 
});

const toggleSede = (id) => {
  const index = form.sedes.indexOf(id);
  if (index > -1) {
    form.sedes.splice(index, 1);
  } else {
    form.sedes.push(id);
  }
};

const getSedesDisplayText = () => {
  if (form.sedes.length === 0) {
    return 'Seleccionar sedes...';
  }
  const nombresSeleccionados = listaSedes.value
    .filter(s => form.sedes.includes(s.id))
    .map(s => s.nombre);
  return nombresSeleccionados.join(', ');
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    avatarPreview.value = URL.createObjectURL(file);
  }
};

const saveRegistration = () => {
  if (!form.nombres || !form.apellidoP) {
    toastRef.value?.notify(t('msgWarningStaff'), 'warning');
    return;
  }

  if ((form.rol === 'gerente' || form.rol === 'recepcion') && form.password) {
    if (form.password !== form.confirmPassword) {
      toastRef.value?.notify('Las contraseñas no coinciden', 'error');
      return;
    }
  }
  
  try {
    console.log("Datos del personal a guardar:", form);
    toastRef.value?.notify(t('msgSuccess'), 'success');
  } catch (error) {
    toastRef.value?.notify(t('msgError'), 'error');
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;600;700&display=swap');

* { box-sizing: border-box; }

.main-content {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 36px clamp(16px, 3vw, 40px) 56px;
  color: var(--color-texto-general, #e5e5e5);
}

.highlight { color: var(--color-highlight, #3b82f6); }

.profile-card {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 24px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  align-items: start;
}

/* =========================================================
   PANEL IZQUIERDO
========================================================= */
.profile-section {
  position: sticky;
  top: 30px;
  overflow: hidden;
  padding: 34px 24px 26px;
  text-align: center;
  border: 1px solid var(--border-cards, rgba(255,255,255,.1));
  border-radius: var(--app-border-radius, 24px);
  background: var(--bg-cards, rgba(18,18,18,.75));
  backdrop-filter: blur(12px);
}
.profile-section::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 210px;
  background: radial-gradient(ellipse 70% 100% at 50% 0%, color-mix(in srgb, var(--color-botones, #1c4fd6) 32%, transparent), transparent 75%);
  pointer-events: none;
}
.profile-content { position: relative; width: 100%; }

.main-title {
  margin: 0 0 26px;
  font-family: 'Anton', sans-serif;
  font-size: 1.95rem;
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: .4px;
  text-transform: uppercase;
  color: var(--color-titulos, #fff);
}

.avatar-wrapper { position: relative; width: 156px; margin: 0 auto 14px; }
.avatar-ring {
  padding: 4px;
  border-radius: 50%;
  background: conic-gradient(from 210deg, var(--color-botones, #1c4fd6), var(--color-highlight, #60a5fa), var(--color-botones, #1c4fd6));
  box-shadow: 0 12px 30px rgba(0,0,0,.4);
}
.avatar-circle {
  width: 148px;
  height: 148px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  border-radius: 50%;
  border: 4px solid var(--bg-cards, #121212);
  background: #17191f;
  transition: filter .2s ease;
}
.avatar-circle svg { width: 58px; height: 58px; opacity: .55; }
.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.avatar-wrapper:hover .avatar-circle { filter: brightness(1.12); }

.avatar-action {
  position: absolute;
  right: 4px;
  bottom: 6px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  border: 3px solid var(--bg-cards, #121212);
  background: var(--color-highlight, #3b82f6);
  color: #fff;
  box-shadow: 0 4px 10px rgba(0,0,0,.35);
  transition: transform .2s ease;
  touch-action: manipulation;
}
.avatar-action:hover { transform: scale(1.08); }
.avatar-action svg { width: 18px; height: 18px; }

.profile-hint {
  max-width: 230px;
  margin: 0 auto;
  font: 400 .78rem/1.5 'Inter', sans-serif;
  color: var(--color-texto-general, #94a3b8);
  opacity: .7;
}

.profile-summary {
  display: grid;
  gap: 2px;
  margin: 26px 0 0;
  padding: 6px;
  text-align: left;
  border-radius: var(--app-border-radius, 14px);
  border: 1px solid rgba(255,255,255,.07);
  background: rgba(255,255,255,.025);
}
.summary-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
}
.summary-item + .summary-item { border-top: 1px solid rgba(255,255,255,.05); }
.summary-item dt {
  flex-shrink: 0;
  font: 500 .7rem 'Inter', sans-serif;
  color: var(--color-texto-general, #94a3b8);
  opacity: .7;
}
.summary-item dd {
  margin: 0;
  min-width: 0;
  overflow: hidden;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
  font: 600 .78rem 'Inter', sans-serif;
  color: var(--color-titulos, #fff);
}
.summary-item dd.empty,
.summary-item .empty { font-weight: 500; opacity: .4; }

.plan-chip {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-highlight, #3b82f6) 18%, transparent);
  color: var(--color-highlight, #60a5fa);
  font: 600 .72rem 'Inter', sans-serif;
}

/* =========================================================
   FORMULARIOS
========================================================= */
.forms-wrapper { display: flex; flex-direction: column; gap: 18px; width: 100%; min-width: 0; }

.login-card {
  position: relative;
  width: 100%;
  padding: 26px 28px 28px;
  border: 1px solid var(--border-cards, rgba(255,255,255,.12));
  border-radius: var(--app-border-radius, 24px);
  background: var(--bg-cards, rgba(18,18,18,.75));
  backdrop-filter: blur(12px);
  transition: border-color .2s ease, box-shadow .2s ease;
}
.login-card:hover { border-color: rgba(255,255,255,.2); box-shadow: 0 12px 32px rgba(0,0,0,.22); }
.login-card:focus-within { border-color: color-mix(in srgb, var(--color-highlight, #3b82f6) 45%, transparent); }

.card-header {
  margin-bottom: 22px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255,255,255,.07);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-family: 'Anton', sans-serif;
  font-size: 1.2rem;
  font-weight: 400;
  letter-spacing: .5px;
  text-transform: uppercase;
  color: var(--color-titulos, #fff);
}
.section-title::before {
  content: '';
  width: 4px;
  height: 20px;
  border-radius: 4px;
  flex-shrink: 0;
  background: linear-gradient(180deg, var(--color-botones, #1c4fd6), rgba(37,99,235,.25));
}

.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.form-grid .span-full { grid-column: span 2; }
.sedes-right-col { grid-column: 2; }

.input-group { display: flex; flex-direction: column; gap: 7px; min-width: 0; }

label {
  font: 600 .78rem 'Oswald', sans-serif;
  letter-spacing: .4px;
  color: var(--color-texto-general, #f5f5f4);
}
.required { margin-left: 3px; color: var(--color-highlight, #3b82f6); }

input,
.custom-select {
  width: 100%;
  height: 46px;
  padding: 0 14px;
  outline: none;
  border: 1.5px solid var(--border-input, rgba(255,255,255,.12));
  border-radius: var(--app-border-radius, 12px);
  background: var(--bg-input, rgba(255,255,255,.03));
  color: var(--color-texto-input, var(--color-texto-general, #fff));
  font: 400 .88rem 'Inter', sans-serif;
  color-scheme: var(--color-scheme, dark);
  transition: border-color .2s, box-shadow .2s, background .2s;
}
input::placeholder { color: var(--color-texto-general, #94a3b8); opacity: .4; }
input:hover,
.custom-select:hover { border-color: rgba(255,255,255,.22); }
input:focus,
.custom-select:focus {
  border-color: var(--color-highlight, #3b82f6);
  background: var(--bg-input-focus, rgba(255,255,255,.045));
  box-shadow: 0 0 0 3px rgba(59,130,246,.18);
}

.custom-select {
  appearance: none;
  padding-right: 40px;
  cursor: pointer;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 16px;
}
.custom-select option { background: #18181b; color: #fff; }

.input-with-icon { position: relative; }
.input-with-icon > svg {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 14px;
  width: 16px;
  height: 16px;
  pointer-events: none;
  transform: translateY(-50%);
  color: var(--color-texto-general, #94a3b8);
  opacity: .55;
  transition: color .2s, opacity .2s;
}
.input-with-icon:focus-within > svg { color: var(--color-highlight, #3b82f6); opacity: 1; }
.input-with-icon input { padding-left: 40px; }

/* Horario */
.date-field {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  padding: 16px;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: var(--app-border-radius, 14px);
  background: rgba(255,255,255,.02);
  transition: border-color .2s, background .2s;
}
.date-field:focus-within {
  border-color: color-mix(in srgb, var(--color-highlight, #3b82f6) 50%, transparent);
  background: color-mix(in srgb, var(--color-highlight, #3b82f6) 5%, transparent);
}
.date-icon {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: color-mix(in srgb, var(--color-highlight, #3b82f6) 14%, transparent);
  color: var(--color-highlight, #60a5fa);
}
.date-icon svg { width: 20px; height: 20px; }
.date-content { flex: 1; min-width: 0; }
.date-content label { display: block; margin-bottom: 7px; }

/* =========================================================
   MULTISELECT DE SEDES
========================================================= */
.custom-multiselect { position: relative; width: 100%; }

.select-box-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 46px;
  padding: 0 14px;
  cursor: pointer;
  user-select: none;
  border: 1.5px solid var(--border-input, rgba(255,255,255,.12));
  border-radius: var(--app-border-radius, 12px);
  background: var(--bg-input, rgba(255,255,255,.03));
  color: var(--color-texto-input, var(--color-texto-general, #fff));
  font: 400 .88rem 'Inter', sans-serif;
  transition: border-color .2s, box-shadow .2s;
}
.select-box-trigger:hover { border-color: rgba(255,255,255,.22); }
.select-box-trigger.open {
  border-color: var(--color-highlight, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59,130,246,.18);
}
.trigger-text { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.placeholder-text { color: var(--color-texto-general, #94a3b8); opacity: .45; }

.dropdown-arrow {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-left: 10px;
  stroke: #a1a1aa;
  transition: transform .2s ease;
}
.dropdown-arrow.rotate { transform: rotate(180deg); }

.dropdown-options-list {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  z-index: 100;
  width: 100%;
  max-height: 240px;
  overflow-y: auto;
  padding: 6px;
  border: 1.5px solid rgba(255,255,255,.15);
  border-radius: var(--app-border-radius, 12px);
  background: #18181b;
  box-shadow: 0 -10px 25px rgba(0,0,0,.6);
}

.dropdown-option-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 8px;
  color: #e4e4e7;
  font: 400 .88rem 'Inter', sans-serif;
  transition: background .15s, color .15s;
}
.dropdown-option-item:hover { background: rgba(59,130,246,.12); color: #fff; }
.dropdown-option-item.selected { background: rgba(59,130,246,.2); color: #fff; font-weight: 500; }

.option-checkbox {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border: 1.5px solid rgba(255,255,255,.3);
  transition: all .15s;
}
.dropdown-option-item.selected .option-checkbox {
  background: var(--color-highlight, #3b82f6);
  border-color: var(--color-highlight, #3b82f6);
  color: #fff;
}
.option-checkbox svg { width: 10px; height: 10px; }

/* =========================================================
   PIE
========================================================= */
.registration-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 4px 2px 0;
}
.required-hint {
  font: 500 .74rem 'Inter', sans-serif;
  color: var(--color-texto-general, #94a3b8);
  opacity: .7;
}

.btn-primary {
  min-width: 240px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 14px 30px;
  cursor: pointer;
  border: none;
  border-radius: var(--app-border-radius, 12px);
  background: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, #fff);
  font: 700 .95rem 'Oswald', sans-serif;
  letter-spacing: .6px;
  text-transform: uppercase;
  box-shadow: 0 6px 18px color-mix(in srgb, var(--color-botones, #1c4fd6) 45%, transparent);
  transition: transform .2s ease, filter .2s ease, box-shadow .2s ease;
}
.btn-primary svg { width: 17px; height: 17px; }
.btn-primary:active,
.avatar-action:active { transform: scale(.97); }

@media (hover: hover) {
  .btn-primary:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
    box-shadow: 0 10px 24px color-mix(in srgb, var(--color-botones, #1c4fd6) 55%, transparent);
  }
}

:deep(.notification-container),
:deep(.toast-container) {
  width: calc(100% - 32px) !important;
  max-width: 480px !important;
  box-sizing: border-box !important;
  left: 50% !important;
  right: auto !important;
  margin: 0 auto !important;
  transform: translateX(-50%) !important;
}

/* =========================================================
   RESPONSIVE
========================================================= */
@media (max-width: 1024px) {
  .profile-card { grid-template-columns: 1fr; gap: 20px; }
  .profile-section { position: static; }
  .profile-content { max-width: 420px; margin: 0 auto; }
}

@media (max-width: 768px) {
  .main-content { padding: 14px 12px 30px; }
  .form-grid { grid-template-columns: 1fr; gap: 14px; }
  .form-grid .span-full,
  .sedes-right-col { grid-column: span 1; }
  .login-card { padding: 20px 17px 22px; }
  .profile-section { padding: 28px 18px 22px; }
  .main-title { font-size: 1.7rem; }
  .registration-footer { flex-direction: column-reverse; align-items: stretch; }
  .required-hint { text-align: center; }
  .btn-primary { width: 100%; min-width: 0; }
}
</style>