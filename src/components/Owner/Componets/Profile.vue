<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router'; 
import HeadingOwner from '../HeadingOwner.vue';
import RegisterGymModal from '../../Record/Record-Gym.vue'; 
import AIChatModal from '../../Record/Record-Staff.vue'; 
import MembershipModal from '../../Modals/MembershipModal.vue';
import { traducciones } from '../i18n.js';

// Sistema de idioma reactivo igual que en tu ejemplo
const currentLang = ref(localStorage.getItem('owner-idioma') || 'es');
const router = useRouter();

const t = (key: string) => {
  const dict = traducciones as Record<string, Record<string, string>>;
  const langTable = dict[currentLang.value] || dict['es'] || {};
  const fallbackTable = dict['es'] || {};
  
  return langTable[key] || fallbackTable[key] || key;
};

const handleLangChange = (e: Event) => {
  const customEvent = e as CustomEvent<{ idioma?: string }>;
  if (customEvent.detail && customEvent.detail.idioma) {
    currentLang.value = customEvent.detail.idioma;
  }
};

onMounted(() => {
  window.addEventListener('idioma-changed', handleLangChange as EventListener);
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('idioma-changed', handleLangChange as EventListener);
  window.removeEventListener('scroll', handleScroll);
});

const allDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const fileInput = ref<HTMLInputElement | null>(null);
const previewImage = ref<string | null>(null);
const showPassword = ref(false);

// Control de modales
const showAddSedeModal = ref(false);
const showAIModal = ref(false);
const showPaymentModal = ref(false); 
const showCancelModal = ref(false);

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
    showNotification(t('toastLogoUpdated'), 'info');
  }
};

const handleSaveChanges = () => {
  console.log('Guardar cambios:', form);
  showNotification(t('toastChangesSaved'), 'success');
};

const handleUpdateMembership = () => {
  showPaymentModal.value = true;
};

const handlePaymentSuccess = (msg: string) => {
  showPaymentModal.value = false;
  showNotification(msg, 'success');
};

const handleCancelSubscription = () => {
  showCancelModal.value = true;
};

const confirmCancelSubscription = () => {
  showCancelModal.value = false;
  showNotification(t('toastCancelRequested'), 'warning');
};

const handleAddSede = () => {
  if (!isProMember.value) {
    showNotification(t('toastProOnlySede'), 'warning');
    return;
  }
  showAddSedeModal.value = true;
};

const handleInteractAI = () => {
  if (!isProMember.value) {
    showNotification(t('toastProOnlyAI'), 'warning');
    return;
  }
  showAIModal.value = true;
};
</script>

<template>
  <HeadingOwner>
    <main class="main-content" id="tutor-0">
      
      <!-- Notificación flotante tipo Toast -->
      <transition name="toast">
        <div v-if="notification.show" class="floating-toast" :class="notification.type" id="tutor-1">
          <svg v-if="notification.type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <svg v-else-if="notification.type === 'warning'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <span>{{ notification.message }}</span>
        </div>
      </transition>

      <div class="profile-card" id="tutor-2">
        
        <!-- Sección Izquierda -->
        <div 
          class="profile-section" 
          :style="{ transform: `translateY(${profileTranslateY}px)` }"
          id="tutor-3"
        >
          <h1 class="main-title" id="tutor-4" v-html="t('profileMainTitle')"></h1>
          
          <div class="avatar-wrapper" @click="triggerFileInput" :title="t('avatarUploadTitle')" id="tutor-5">
            <div class="avatar-circle" id="tutor-6">
              <img v-if="previewImage" :src="previewImage" :alt="t('avatarPreviewAlt')" class="avatar-img" />
              <svg v-else viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <button type="button" class="avatar-action btn-camera" :title="t('avatarChangeTitle')" id="tutor-7">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </button>
            <input type="file" ref="fileInput" @change="onFileSelected" accept="image/*" style="display: none" id="tutor-8" />
          </div>

          <h3 class="gym-name-display" id="tutor-9">{{ form.nombreGimnasio || t('gymDefaultName') }}</h3>
          <p class="profile-hint" id="tutor-10">{{ t('profileHintText') }}</p>
        </div>

        <!-- Columna Derecha: Formularios -->
        <div class="forms-wrapper" id="tutor-11">
          <form @submit.prevent="handleSaveChanges" id="tutor-12">
            
            <!-- Datos del Gimnasio y Membresía -->
            <div class="login-card" id="tutor-13">
              <h3 class="section-title" id="tutor-14">{{ t('sectionGymInfo') }}</h3>
              <div class="form-grid" id="tutor-15">
                <div class="input-group" id="tutor-16">
                  <label for="nombreGimnasio">{{ t('labelGymName') }}</label>
                  <input id="nombreGimnasio" type="text" v-model="form.nombreGimnasio" required />
                </div>
                <div class="input-group" id="tutor-17">
                  <label for="curp">{{ t('labelCurp') }}</label>
                  <input id="curp" type="text" v-model="form.curp" disabled class="input-disabled" :title="t('curpDisabledTitle')" />
                </div>
              </div>

              <div class="form-grid mt-3" id="tutor-18">
                <div class="input-group" id="tutor-19">
                  <label for="membresiaActual">{{ t('labelCurrentMembership') }}</label>
                  <div class="membership-inline-row" id="tutor-20">
                    <input id="membresiaActual" type="text" v-model="form.membresiaActual" disabled class="input-disabled" />
                    <button type="button" class="action-btn" @click="handleUpdateMembership" :title="t('updateMembershipTitle')" id="tutor-21">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
                    </button>
                  </div>
                  <button type="button" class="btn-cancel-subscription" @click="handleCancelSubscription" id="tutor-22">
                    {{ t('btnCancelSubscription') }}
                  </button>
                </div>

                <div class="input-group special-buttons-group" id="tutor-23">
                  <label>&nbsp;</label>
                  <div class="dual-action-buttons" id="tutor-24">
                    <button 
                      type="button" 
                      class="btn-custom-action btn-sede" 
                      :class="{ 'btn-disabled': !isProMember }"
                      @click="handleAddSede"
                      id="tutor-25"
                    >
                      {{ t('btnAddBranch') }}
                    </button>
                    <button 
                      type="button" 
                      class="btn-custom-action btn-ai" 
                      :class="{ 'btn-disabled': !isProMember }"
                      @click="handleInteractAI"
                      id="tutor-26"
                    >
                      {{ t('btnInteractAI') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Datos del Administrador -->
            <div class="login-card" id="tutor-27">
              <h3 class="section-title" id="tutor-28">{{ t('sectionAdminData') }}</h3>
              <div class="form-grid" id="tutor-29">
                <div class="input-group" id="tutor-30">
                  <label for="nombres">{{ t('labelNames') }}</label>
                  <input id="nombres" type="text" v-model="form.nombres" required />
                </div>
                <div class="input-group" id="tutor-31">
                  <label for="apellidoP">{{ t('labelLastNameP') }}</label>
                  <input id="apellidoP" type="text" v-model="form.apellidoP" required />
                </div>
                <div class="input-group" id="tutor-32">
                  <label for="apellidoM">{{ t('labelLastNameM') }}</label>
                  <input id="apellidoM" type="text" v-model="form.apellidoM" required />
                </div>
                <div class="input-group" id="tutor-33">
                  <label for="fechaNac">{{ t('labelBirthDate') }}</label>
                  <input id="fechaNac" type="date" v-model="form.fechaNac" required />
                </div>
                <div class="input-group" id="tutor-34">
                  <label for="celular">{{ t('labelPhone') }}</label>
                  <input id="celular" type="tel" v-model="form.celular" required />
                </div>
                <div class="input-group" id="tutor-35">
                  <label for="email">{{ t('labelEmail') }}</label>
                  <input id="email" type="email" v-model="form.email" required />
                </div>
                <div class="input-group" id="tutor-36">
                  <label for="password">{{ t('labelNewPassword') }}</label>
                  <div class="input-wrapper" id="tutor-37">
                    <input id="password" :type="showPassword ? 'text' : 'password'" v-model="form.password" :placeholder="t('passwordPlaceholder')" />
                    <button type="button" class="toggle-password-btn" @click="showPassword = !showPassword" id="tutor-38">
                      <svg v-if="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </button>
                  </div>
                </div>
                <div class="input-group" id="tutor-39">
                  <label for="confirmPassword">{{ t('labelConfirmPassword') }}</label>
                  <input id="confirmPassword" type="password" v-model="form.confirmPassword" :placeholder="t('confirmPasswordPlaceholder')" />
                </div>
              </div>
            </div>

            <!-- Ubicación del Gimnasio -->
            <div class="login-card" id="tutor-40">
              <h3 class="section-title" id="tutor-41">{{ t('sectionLocation') }}</h3>
              <div class="form-grid" id="tutor-42">
                <div class="input-group" id="tutor-43">
                  <label for="entidad">{{ t('labelState') }}</label>
                  <input id="entidad" type="text" v-model="form.entidad" required />
                </div>
                <div class="input-group" id="tutor-44">
                  <label for="municipio">{{ t('labelMunicipality') }}</label>
                  <input id="municipio" type="text" v-model="form.municipio" required />
                </div>
                <div class="input-group" id="tutor-45">
                  <label for="colonia">{{ t('labelNeighborhood') }}</label>
                  <input id="colonia" type="text" v-model="form.colonia" required />
                </div>
                <div class="input-group" id="tutor-46">
                  <label for="cp">{{ t('labelZipCode') }}</label>
                  <input id="cp" type="text" v-model="form.cp" required />
                </div>
                <div class="input-group span-2" id="tutor-47">
                  <label for="calle">{{ t('labelStreet') }}</label>
                  <input id="calle" type="text" v-model="form.calle" required />
                </div>
                <div class="input-group" id="tutor-48">
                  <label for="numExt">{{ t('labelExtNumber') }}</label>
                  <input id="numExt" type="text" v-model="form.numExt" required />
                </div>
                <div class="input-group" id="tutor-49">
                  <label for="numInt">{{ t('labelIntNumber') }}</label>
                  <input id="numInt" type="text" v-model="form.numInt" />
                </div>
              </div>
            </div>

            <!-- Configuración de Operación -->
            <div class="login-card" id="tutor-50">
              <h3 class="section-title" id="tutor-51">{{ t('sectionOperationConfig') }}</h3>
              <div class="input-group mb-3" id="tutor-52">
                <label>{{ t('labelOpeningDays') }}</label>
                <div class="days-container" id="tutor-53">
                  <button
                    type="button"
                    v-for="(day, index) in allDays"
                    :key="day"
                    class="day-chip"
                    :class="{ active: form.selectedDays.includes(day) }"
                    @click="toggleDay(day)"
                    :id="`tutor-${54 + index}`"
                  >
                    {{ day }}
                  </button>
                </div>
              </div>

              <div class="form-grid" id="tutor-61">
                <div class="input-group" id="tutor-62">
                  <label for="precioMes">{{ t('labelMonthlyPrice') }}</label>
                  <input id="precioMes" type="number" v-model="form.precioMes" required />
                </div>
                <div class="input-group" id="tutor-63">
                  <label for="precioSem">{{ t('labelWeeklyPrice') }}</label>
                  <input id="precioSem" type="number" v-model="form.precioSem" required />
                </div>
              </div>
            </div>

            <button type="submit" class="btn-primary" id="tutor-64">{{ t('btnSaveDataset') }}</button>
          </form>
        </div>
      </div>

      <!-- Modal Personalizado de Confirmación de Baja -->
      <div v-if="showCancelModal" class="modal-overlay" @click.self="showCancelModal = false" id="tutor-65">
        <div class="modal-container modal-small animate-modal" id="tutor-66">
          <div class="modal-header" id="tutor-67">
            <h3 id="tutor-68">{{ t('modalCancelTitle') }}</h3>
            <button class="close-btn" @click="showCancelModal = false" id="tutor-69">&times;</button>
          </div>
          <div class="modal-body text-center" id="tutor-70">
            <div class="warning-icon-wrapper" id="tutor-71">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <p class="modal-text" id="tutor-72">{{ t('modalCancelText') }}</p>
            <div class="modal-actions" id="tutor-73">
              <button type="button" class="btn-secondary-modal" @click="showCancelModal = false" id="tutor-74">{{ t('btnKeepPlan') }}</button>
              <button type="button" class="btn-danger-modal" @click="confirmCancelSubscription" id="tutor-75">{{ t('btnConfirmCancel') }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Componente Modular Externo de Pago -->
      <MembershipModal 
        v-if="showPaymentModal" 
        @close="showPaymentModal = false" 
        @success="handlePaymentSuccess" 
        id="tutor-76"
      />

      <!-- Modal para Agregar Sede -->
      <div v-if="showAddSedeModal" class="modal-overlay" @click.self="showAddSedeModal = false" id="tutor-77">
        <div class="modal-container animate-modal" id="tutor-78">
          <div class="modal-header" id="tutor-79">
            <h3 id="tutor-80">{{ t('modalAddSedeTitle') }}</h3>
            <button class="close-btn" @click="showAddSedeModal = false" id="tutor-81">&times;</button>
          </div>
          <div class="modal-body" id="tutor-82">
            <RegisterGymModal @close="showAddSedeModal = false" id="tutor-83" />
          </div>
        </div>
      </div>

      <!-- Modal para Interactuar con la IA -->
      <div v-if="showAIModal" class="modal-overlay" @click.self="showAIModal = false" id="tutor-84">
        <div class="modal-container animate-modal" id="tutor-85">
          <div class="modal-header" id="tutor-86">
            <h3 id="tutor-87">{{ t('modalAITitle') }}</h3>
            <button class="close-btn" @click="showAIModal = false" id="tutor-88">&times;</button>
          </div>
          <div class="modal-body" id="tutor-89">
            <AIChatModal @click="showAIModal = false" id="tutor-90" />
          </div>
        </div>
      </div>

    </main>
  </HeadingOwner>
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
  color: var(--color-texto-general, #e5e5e5);
}

.highlight { color: var(--color-highlight, #3b82f6); }

.animate-modal {
  animation: modalScale 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes modalScale {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.floating-toast {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 22px;
  border-radius: var(--app-border-radius, 14px);
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
  background: var(--bg-cards, rgba(18, 18, 18, 0.75)); 
  backdrop-filter: blur(12px);
  padding: 40px 24px; 
  border-radius: var(--app-border-radius, 24px); 
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.09));
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
  color: var(--color-titulos, #fff); 
  margin: 0 0 24px 0; 
  line-height: 1.1; 
  text-transform: uppercase; 
  letter-spacing: 0.5px;
}

.gym-name-display {
  font-family: 'Anton', sans-serif;
  font-size: 1.3rem;
  color: var(--color-titulos, #fff);
  margin: 16px 0 6px;
  letter-spacing: 0.5px;
}

.profile-hint {
  font-family: 'Inter', sans-serif;
  color: var(--color-highlight, #94a3b8);
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
  background: var(--bg-cards, rgba(18, 18, 18, 0.75)); 
  backdrop-filter: blur(12px);
  padding: 36px; 
  margin-top: 25px;
  border-radius: var(--app-border-radius, 24px); 
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.12)); 
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
  color: var(--color-etiquetas, var(--color-texto-general, #f5f5f4)); 
  font-size: 0.85rem; 
  font-weight: 600; 
  letter-spacing: 0.5px;
}

input { 
  background: var(--bg-input, var(--bg-cards, #141414)); 
  border: 1.5px solid var(--border-input, rgba(255, 255, 255, 0.12)); 
  border-radius: var(--app-border-radius, 12px); 
  color: var(--color-texto-input, var(--color-texto-general, #fff)); 
  padding: 12px 14px; 
  width: 100%; 
  box-sizing: border-box; 
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s, color 0.2s;
}

input:focus {
  border-color: var(--color-highlight, #3b82f6);
  outline: none;
  background: var(--bg-input-focus, var(--bg-cards, #141414));
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
  color: var(--color-highlight, #5b8bf0); 
  font-size: 0.95rem; 
  margin: 0 0 24px 0; 
  text-transform: uppercase; 
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border-line, rgba(255, 255, 255, 0.08)); 
  padding-bottom: 12px; 
}

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
  background: var(--color-botones, #3b82f6); 
  border: 2px solid var(--bg-cards, #121212); 
  cursor: pointer; 
  bottom: 0; 
  right: 0; 
  display: flex; 
  align-items: center; 
  justify-content: center;
  color: var(--color-texto-botones, white);
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
  border-radius: var(--app-border-radius, 12px);
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
  background: var(--color-botones, #3b82f6);
  color: white;
}

.action-btn svg { width: 20px; height: 20px; }

.btn-cancel-subscription {
  background: transparent;
  border: none;
  color: #ef4444;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  text-align: left;
  padding: 4px 0 0 2px;
  cursor: pointer;
  width: fit-content;
  transition: color 0.2s ease;
}

.btn-cancel-subscription:hover {
  color: #f87171;
  text-decoration: underline;
}

.dual-action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.btn-custom-action {
  padding: 12px 14px;
  border-radius: var(--app-border-radius, 12px);
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
  background: var(--color-botones, #1c4fd6);
  color: #e2e8f0;
  border-color: rgba(96, 165, 250, 0.4);
}

.btn-sede:hover:not(.btn-disabled), .btn-ai:hover:not(.btn-disabled) {
  background: var(--color-botones, #1c4fd6);
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
  border-radius: var(--app-border-radius, 10px);
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
  border-color: var(--color-highlight, #3b82f6);
  background: var(--color-highlight, #3b82f6);
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
  background: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, white);
  border: none;
  border-radius: var(--app-border-radius, 14px);
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
  background: var(--color-botones, #1742be);
  transform: translateY(-2px);
  filter: brightness(0.95);
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
  background: var(--bg-cards, #161616);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.15));
  border-radius: var(--app-border-radius, 20px);
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.6);
}

.modal-small {
  max-width: 440px !important;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-line, rgba(255, 255, 255, 0.08));
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  font-family: 'Oswald', sans-serif;
  color: var(--color-titulos, #fff);
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

.text-center { text-align: center; }

.warning-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px auto;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.modal-text {
  font-family: 'Inter', sans-serif;
  color: #cbd5e1;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 24px;
}

.modal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.btn-secondary-modal {
  padding: 12px;
  border-radius: var(--app-border-radius, 12px);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  text-transform: uppercase;
  transition: background 0.2s;
}

.btn-secondary-modal:hover {
  background: rgba(255, 255, 255, 0.12);
}

.btn-danger-modal {
  padding: 12px;
  border-radius: var(--app-border-radius, 12px);
  background: #ef4444;
  border: none;
  color: #fff;
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  text-transform: uppercase;
  transition: background 0.2s;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-danger-modal:hover {
  background: #dc2626;
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