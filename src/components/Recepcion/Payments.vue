<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import HeadingRecepcion from './HeadingRecepcion.vue';
import CorreoMasivo from './Componets/Bulk-Email.vue';
import NotificationSystem from '../Modals/NotificationSystem.vue'; 
import ModalComponent from '../Modals/ModalComponent.vue';
import { traducciones } from './i18n.js';

const currentLang = ref(localStorage.getItem('Recepcion-idioma') || 'es');

const t = (key) => {
  const langTable = traducciones[currentLang.value] || traducciones.es;
  return langTable[key] || traducciones.es[key] || key;
};

const handleLangChange = (e) => {
  if (e.detail && e.detail.idioma) {
    currentLang.value = e.detail.idioma;
  }
};

const windowWidth = ref(window.innerWidth);
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  window.addEventListener('idioma-changed', handleLangChange);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('idioma-changed', handleLangChange);
});

const isMobile = computed(() => windowWidth.value <= 900);

const activeModal = ref(null);
const toastRef = ref(null);

const router = useRouter();
const showDelete = ref(false);
const selectedUser = ref(null);

const searchQuery = ref('');
const selectedMembership = ref(''); 
const selectedStatus = ref('');

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchMembership = selectedMembership.value ? user.mensualidad === selectedMembership.value : true;
    const matchStatus = selectedStatus.value ? user.status === selectedStatus.value : true;
    
    const term = searchQuery.value.toLowerCase();
    const matchSearch = user.name.toLowerCase().includes(term) || 
                        user.email.toLowerCase().includes(term) ||
                        user.phone.toLowerCase().includes(term) ||
                        user.mensualidad.toLowerCase().includes(term) ||
                        user.status.toLowerCase().includes(term) || 
                        user.expirationDate.toLowerCase().includes(term) ||
                        user.id.toString().includes(term);
    
    return matchMembership && matchStatus && matchSearch;
  });
});

const getStatusClass = (status) => {
  const classes = {
    'Activo': 'status-green',
    'Inactivo': 'status-red',
    'Pendiente': 'status-orange',
    'Próximo a vencer': 'status-yellow'
  };
  return classes[status] || 'status-default';
};

// Iniciales + gradiente de avatar (sin depender de fotos reales)
const avatarGradients = [
  'linear-gradient(135deg, #7e22ce, #4c1d95)',
  'linear-gradient(135deg, #ea580c, #9a3412)',
  'linear-gradient(135deg, #db2777, #9d174d)',
  'linear-gradient(135deg, #dc2626, #7f1d1d)',
  'linear-gradient(135deg, #2563eb, #1e3a8a)',
  'linear-gradient(135deg, #059669, #064e3b)',
];
const getInitials = (name) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
};
const avatarStyle = (id) => ({ backgroundImage: avatarGradients[id % avatarGradients.length] });

const users = ref([
  { id: 1, name: 'Maria Luis Ramires Sanchez', email: 'Maria.luis@example.com', expirationDate: '18/03/2026', status: 'Activo', phone: '+52 481 123 4321' , mensualidad: 'Mensual' },
  { id: 2, name: 'Francisco Luis Ramires Sanchez', email: 'Francisco.luis@example.com', expirationDate: '18/03/2026', status: 'Pendiente', phone: '+52 481 123 4321' , mensualidad: 'Quincenal' },
  { id: 3, name: 'Luis Ramires Sanchez', email: 'Luis.luis@example.com', expirationDate: '18/03/2026', status: 'Activo', phone: '+52 481 123 4321' , mensualidad: 'Mensual' },
  { id: 4, name: 'Jose Luis Ramires Sanchez', email: 'Jose.luis@example.com', expirationDate: '18/03/2026', status: 'Inactivo', phone: '+52 481 123 4321' , mensualidad: 'Quincenal' },
  { id: 5, name: 'Mario Luis Ramires Sanchez', email: 'Mario.luis@example.com', expirationDate: '18/03/2026', status: 'Pendiente', phone: '+52 481 123 4321' , mensualidad: 'Mensual' },
  { id: 6, name: 'Jesus Luis Ramires Sanchez', email: 'Jesus.luis@example.com', expirationDate: '18/03/2026', status: 'Inactivo', phone: '+52 481 123 4321' , mensualidad: 'Quincenal' },
  { id: 7, name: 'Ana Luis Ramires Sanchez', email: 'Ana.luis@example.com', expirationDate: '18/03/2026', status: 'Activo', phone: '+52 481 123 4321' , mensualidad: 'Mensual' },
  { id: 8, name: 'Carlos Luis Ramires Sanchez', email: 'Carlos.luis@example.com', expirationDate: '18/03/2026', status: 'Pendiente', phone: '+52 481 123 4321' , mensualidad: 'Quincenal' },
]);

const confirmDelete = (user) => { 
  selectedUser.value = user; 
  showDelete.value = true; 
};

const executeDelete = () => {
  if (!selectedUser.value) return;
  users.value = users.value.filter(u => u.id !== selectedUser.value.id);
  showDelete.value = false;
  selectedUser.value = null;
  toastRef.value.notify(t('userDeletedToast'), 'success');
};

const goToPayments = (id) => router.push(`/Recepcion/pay/${id}`);
const goToEdit = (id) => router.push(`/Recepcion/editar-usuario/${id}`);
</script>

<template>
  <HeadingRecepcion>
    <NotificationSystem ref="toastRef" />
    <main class="main-content">
      <header class="header-section">
        <div class="title-wrapper">
          <h1 class="main-title">{{ t('paymentsTitle') }}</h1>
          <span class="title-underline"></span>
          <p class="main-subtitle">{{ t('paymentsSubtitle') }}</p>
        </div>
      
        <div class="actions-bar" id="tutorial-step-0">
            <div class="select-wrapper">
              <svg class="select-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
              <select class="status-select" v-model="selectedMembership">
                  <option value="">{{ t('allMembershipsOption') }}</option>
                  <option value="Mensual">{{ t('monthlyOption') }}</option>
                  <option value="Quincenal">{{ t('biweeklyOption') }}</option>
              </select>
              <svg class="select-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>

            <div class="select-wrapper">
              <svg class="select-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <select class="status-select" v-model="selectedStatus">
                  <option value="">{{ t('allStatusesOption') }}</option>
                  <option value="Activo">{{ t('statusActive') }}</option>
                  <option value="Inactivo">{{ t('statusInactive') }}</option>
                  <option value="Pendiente">{{ t('statusPending') }}</option>
                  <option value="Próximo a vencer">{{ t('statusExpiringSoon') }}</option>
              </select>
              <svg class="select-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>

            <button class="btn-bulk" @click="activeModal = 'enviomasivo'">
              <span class="btn-bulk-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="17" height="17">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              {{ t('bulkEmailBtn') }}
            </button>

            <div class="search-wrapper">
              <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" class="search-input" :placeholder="t('searchUserPlaceholder')" v-model="searchQuery">
            </div>
        </div>
      </header>

      <!-- VISTA ESCRITORIO -->
      <div v-if="!isMobile" class="table-container desktop-only" id="tutorial-step-1">
        <table class="user-table">
          <thead>
            <tr><th>{{ t('tablePhoto') }}</th><th>{{ t('tableName') }}</th><th>{{ t('tableEmail') }}</th><th>{{ t('tableExpiration') }}</th><th>{{ t('tableStatus') }}</th><th>{{ t('tableActions') }}</th></tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in filteredUsers" :key="user.id">
              <td><div class="avatar-small" :style="avatarStyle(user.id)">{{ getInitials(user.name) }}</div></td>
              <td class="text-bold">{{user.name}}</td>
              <td class="text-muted">{{user.email}}</td>
              <td class="text-muted">{{user.expirationDate}}</td>
              <td><span :class="['status-badge', getStatusClass(user.status)]">{{ user.status }}</span></td>
              
              <td class="actions-cell" :id="!isMobile && index === 0 ? 'tutorial-step-2' : null">
                <button class="icon-btn" :title="t('tooltipPayment')" @click="goToPayments(user.id)">
                  <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"/><circle cx="12" cy="12" r="3"/><path d="M12 9v6M10.5 10.5h3M10.5 13.5h3"/><path d="M6 3h14c1.1 0 2 .9 2 2v10"/></svg>
                </button>
                <button class="icon-btn" :title="t('tooltipEdit')" @click="goToEdit(user.id)">
                  <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="icon-btn delete-icon-btn" :title="t('tooltipDelete')" @click="confirmDelete(user)">
                  <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="6" class="empty-state-cell">
                <div class="empty-state">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <span>{{ t('emptyStateUsers') }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- VISTA MÓVIL -->
      <div class="mobile-only">
       <div
          v-for="(user, index) in filteredUsers"
          :key="user.id"
          class="user-card"
          :class="getStatusClass(user.status)"
          :id="isMobile && index === 0 ? 'tutorial-step-1' : null"
        >
          <div class="card-top-section">
            <div class="avatar-small" :style="avatarStyle(user.id)">{{ getInitials(user.name) }}</div>
            <div class="card-user-titles">
              <div class="text-bold name-text">{{ user.name }}</div>
              <div class="badges-row">
                <span class="status-badge" :class="getStatusClass(user.status)">{{ user.status }}</span>
                <span class="membership-badge">{{ user.mensualidad }}</span>
              </div>
            </div>
          </div>
          
          <div class="card-meta">
            <span class="meta-row"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><span class="email-text">{{ user.email }}</span></span>
            <span class="meta-row expiration-warning"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg><span class="vence-label">{{ t('expiresLabel') }}:</span> {{ user.expirationDate }}</span>
            <span class="meta-row"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg><span class="phone-text">{{ user.phone }}</span></span>
          </div>

          <div class="card-actions" :id="isMobile && index === 0 ? 'tutorial-step-2' : null">
            <button class="action-chip btn-pay-chip" @click="goToPayments(user.id)">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"/><circle cx="12" cy="12" r="3"/><path d="M12 9v6M10.5 10.5h3M10.5 13.5h3"/><path d="M6 3h14c1.1 0 2 .9 2 2v10"/></svg>
              <span>{{ t('actionPayment') }}</span>
            </button>
            <button class="action-chip btn-edit-chip" @click="goToEdit(user.id)">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              <span>{{ t('actionEdit') }}</span>
            </button>
            <button class="action-chip btn-delete-chip" @click="confirmDelete(user)">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              <span>{{ t('actionDelete') }}</span>
            </button>
          </div>
        </div>

        <div v-if="filteredUsers.length === 0" class="empty-state-mobile">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span>{{ t('emptyStateUsers') }}</span>
        </div>
      </div>

    </main>
      <transition name="pop">
        <div v-if="showDelete" class="modal-wrapper" @click.self="showDelete = false">
          <div class="custom-modal-card">
            <div class="modal-body-custom">
              <div class="modal-icon-container danger-bg">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <h2>{{ t('deleteModalTitle') }}</h2>
              <p>{{ t('deleteModalTextPart1') }} <span class="highlight-name">{{ selectedUser?.name }}</span> {{ t('deleteModalTextPart2') }}</p>
              <div class="modal-buttons">
                <button class="btn-modal secondary" @click="showDelete = false">{{ t('btnCancel') }}</button>
                <button class="btn-modal danger" @click="executeDelete">{{ t('btnConfirm') }}</button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    <transition name="pop">
      <div v-if="activeModal === 'enviomasivo'" class="modal-wrapper" @click.self="activeModal = null">
        <CorreoMasivo @close="activeModal = null" />
      </div>
    </transition>   
  </HeadingRecepcion>
</template>

<style scoped>
.main-content { padding: 30px 40px 60px; max-width: 1400px; margin: 0 auto; color: var(--color-texto-general, #e5e5e5); font-family: 'Inter', sans-serif; }
.header-section { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 26px; flex-wrap: wrap; gap: 20px; }

.title-wrapper { display: flex; flex-direction: column; gap: 4px; min-width: 260px; }
.main-title { font-family: 'Anton', sans-serif; font-size: clamp(1.6rem, 4vw, 2.1rem); color: var(--color-titulos, #fff); margin: 0; letter-spacing: 0.5px; text-transform: uppercase; }
.title-underline { display: block; width: 60px; height: 4px; margin: 2px 0 4px; border-radius: 4px; background: linear-gradient(90deg, var(--color-highlight, #3b82f6), transparent); }
.main-subtitle { font-size: 0.85rem; color: rgba(245, 245, 244, 0.55); margin: 0; }

.actions-bar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }

.search-wrapper, .select-wrapper { position: relative; display: flex; align-items: center; }
.search-icon, .select-icon { position: absolute; left: 12px; color: rgba(245, 245, 244, 0.4); pointer-events: none; z-index: 1; }
.select-arrow { position: absolute; right: 12px; color: rgba(245, 245, 244, 0.4); pointer-events: none; }

.search-input, .status-select {
  background: rgba(0, 0, 0, 0.28);
  border: 1px solid var(--border-input, rgba(255, 255, 255, 0.1));
  padding: 11px 14px;
  border-radius: var(--app-border-radius, 10px);
  color: var(--color-texto-general, #fff);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: 'Inter', sans-serif;
}
.search-input { width: 220px; padding-left: 36px; }
.search-input:focus, .status-select:focus {
  border-color: var(--color-highlight, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.status-select {
  padding-left: 36px;
  padding-right: 30px;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  min-width: 175px;
}
.status-select option { background-color: #18181b; color: #fff; }

.btn-bulk {
  background: rgba(0, 0, 0, 0.28);
  border: 1px solid var(--border-input, rgba(255, 255, 255, 0.1));
  padding: 10px 16px;
  border-radius: var(--app-border-radius, 10px);
  color: var(--color-texto-general, #fff);
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
  white-space: nowrap;
  font-size: 0.9rem;
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}
.btn-bulk-icon {
  width: 26px; height: 26px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border-radius: 7px;
  background: rgba(59, 130, 246, 0.14);
  color: var(--color-highlight, #3b82f6);
}
@media (hover: hover) {
  .btn-bulk:hover { background: rgba(255, 255, 255, 0.05); border-color: var(--color-highlight, #3b82f6); transform: translateY(-1px); }
}

.modal-wrapper {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(8px);
  padding: 20px;
}

.desktop-only { display: block; }
.mobile-only { display: none; }

.status-badge { 
    padding: 4px 12px; 
    border-radius: 20px; 
    font-size: 0.78rem; 
    font-weight: 600;
    border: 1px solid transparent;
    display: inline-flex;
    align-items: center;
    gap: 5px;
}
.status-badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; box-shadow: 0 0 5px currentColor; }

.membership-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
  background: rgba(56, 189, 248, 0.1);
  display: inline-block;
}

.status-green { color: #34d399; border-color: rgba(6, 78, 59, 0.55); background: rgba(6, 78, 59, 0.22); }
.status-red { color: #f87171; border-color: rgba(153, 27, 27, 0.55); background: rgba(153, 27, 27, 0.22); }
.status-orange { color: #fbbf24; border-color: rgba(180, 83, 9, 0.55); background: rgba(180, 83, 9, 0.22); }
.status-yellow { color: #fef08a; border-color: rgba(161, 161, 35, 0.55); background: rgba(161, 161, 35, 0.22); }
.status-default { color: #ccc; border-color: #444; background: #222; }

@media (max-width: 900px) {
  .desktop-only { display: none; }
  .mobile-only { display: block; }
  .main-content { padding: 18px 14px 40px; }
  .header-section { flex-direction: column; align-items: stretch; gap: 16px; }

  .actions-bar { display: flex; flex-direction: column; gap: 10px; width: 100%; }
  .search-wrapper { order: -1; width: 100%; }
  .search-input { width: 100%; }
  .select-wrapper { width: 100%; }
  .status-select { width: 100%; }
  .btn-bulk { width: 100%; justify-content: center; padding: 12px; }

  .user-card {
    position: relative;
    background: rgba(0, 0, 0, 0.25);
    padding: 16px 16px 16px 18px;
    border-radius: var(--app-border-radius, 14px);
    border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.09));
    margin-bottom: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    border-left: 3px solid transparent;
  }
  .user-card.status-green { border-left-color: #34d399; }
  .user-card.status-red { border-left-color: #f87171; }
  .user-card.status-orange { border-left-color: #fbbf24; }
  .user-card.status-yellow { border-left-color: #fef08a; }

  .card-top-section { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 4px; }

  .card-user-titles { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; flex: 1; min-width: 0; }

  .badges-row { display: flex; gap: 6px; flex-wrap: wrap; }

  .name-text { font-size: 0.95rem; line-height: 1.25; color: var(--color-titulos, #fff); font-weight: 600; }

  .card-meta { font-size: 0.83rem; margin-bottom: 14px; }

  .card-actions { border-top: 1px dashed rgba(255, 255, 255, 0.12); padding-top: 12px; display: flex; gap: 8px; }

  .action-chip {
    flex: 1;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: var(--app-border-radius, 8px);
    padding: 10px 6px;
    color: #e2e8f0;
    font-size: 0.8rem;
    font-weight: 500;
    font-family: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }

  .action-chip:hover { background: rgba(255, 255, 255, 0.08); color: #fff; }

  .btn-pay-chip { color: #38bdf8; }
  .btn-pay-chip:hover { background: rgba(56, 189, 248, 0.1); border-color: rgba(56, 189, 248, 0.3); }

  .btn-edit-chip { color: #fbbf24; }
  .btn-edit-chip:hover { background: rgba(251, 191, 36, 0.1); border-color: rgba(251, 191, 36, 0.3); }

  .btn-delete-chip { color: #f87171; }
  .btn-delete-chip:hover { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); }
}

.card-meta { display: flex; flex-direction: column; gap: 7px; color: rgba(245, 245, 244, 0.6); padding-left: 2px; }
.meta-row { display: flex; align-items: center; gap: 7px; }
.meta-row svg { flex-shrink: 0; opacity: 0.6; }
.email-text { color: rgba(147, 197, 253, 0.9); overflow-wrap: anywhere; }
.expiration-warning { color: #fb923c; font-weight: 500; }
.vence-label { color: #fb923c; }
.phone-text { color: rgba(245, 245, 244, 0.55); }

.table-container {
  position: relative;
  background: var(--bg-cards, rgba(18, 18, 18, 0.75));
  backdrop-filter: blur(20px);
  border-radius: var(--app-border-radius, 18px);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.1));
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}
.table-container::before {
  content: '';
  position: absolute;
  top: 0; left: 24px; right: 24px;
  height: 2px;
  border-radius: 0 0 3px 3px;
  background: linear-gradient(90deg, transparent, var(--color-highlight, #3b82f6), transparent);
  opacity: 0.7;
}

.user-table { width: 100%; border-collapse: collapse; color: var(--color-texto-general, #e5e5e5); text-align: left; }
.user-table th { padding: 16px 20px; background: rgba(255, 255, 255, 0.02); font-family: 'Oswald', sans-serif; font-size: 0.72rem; text-transform: uppercase; color: rgba(245, 245, 244, 0.5); letter-spacing: 0.6px; border-bottom: 1px solid var(--border-line, rgba(255, 255, 255, 0.08)); }
.user-table td { padding: 14px 20px; border-top: 1px solid var(--border-line, rgba(255, 255, 255, 0.05)); font-size: 0.88rem; vertical-align: middle; }
.text-muted { color: rgba(245, 245, 244, 0.55); }

@media (hover: hover) {
  .user-table tbody tr { transition: background 0.15s ease; }
  .user-table tbody tr:hover { background: rgba(255, 255, 255, 0.025); box-shadow: inset 3px 0 0 var(--color-highlight, #3b82f6); }
}

.actions-cell { display: flex; gap: 10px; }
.icon-btn { 
  background: rgba(255, 255, 255, 0.03); 
  border: 1px solid rgba(255, 255, 255, 0.09); 
  border-radius: var(--app-border-radius, 8px); 
  cursor: pointer; 
  color: rgba(245, 245, 244, 0.7); 
  padding: 8px; 
  display: flex; 
  align-items: center; 
  justify-content: center;
  transition: all 0.2s ease;
}
.icon-btn:hover { background: rgba(255, 255, 255, 0.08); color: #fff; border-color: var(--color-highlight, #444); transform: translateY(-1px); }
.delete-icon-btn:hover { color: #ef4444; border-color: rgba(239, 68, 68, 0.4); }

.avatar-small {
  width: 40px; height: 40px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.78rem; letter-spacing: 0.3px;
  color: #fff;
  box-shadow: 0 3px 10px rgba(0,0,0,0.4), inset 0 0 0 1.5px rgba(255,255,255,0.12);
  flex-shrink: 0;
}

.text-bold { font-weight: 600; color: var(--color-titulos, #fff); }

.empty-state-cell { padding: 0 !important; border-top: none !important; }
.empty-state, .empty-state-mobile {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px;
  padding: 48px 20px;
  color: rgba(245, 245, 244, 0.35);
  font-size: 0.88rem;
  text-align: center;
}
.empty-state-mobile {
  background: rgba(0,0,0,0.2);
  border: 1px dashed var(--border-line, rgba(255,255,255,0.1));
  border-radius: var(--app-border-radius, 14px);
}

.custom-modal-card {
  background: var(--bg-cards, #18181b);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.15));
  border-radius: var(--app-border-radius, 20px);
  padding: 30px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.6);
}
.modal-body-custom { text-align: center; color: var(--color-texto-general, #fff); padding: 10px 5px; }
.modal-body-custom h2 { font-size: 1.3rem; margin-bottom: 10px; font-weight: 600; color: var(--color-titulos, #fff); }
.modal-body-custom p { color: var(--color-texto-general, #aaa); font-size: 0.9rem; margin-bottom: 20px; line-height: 1.5; }
.highlight-name { color: var(--color-titulos, #fff); font-weight: 600; }

.modal-icon-container { width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px auto; }
.danger-bg { background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.2); }

.modal-buttons { display: flex; gap: 10px; }
.btn-modal { flex: 1; padding: 10px; border-radius: var(--app-border-radius, 8px); font-size: 0.9rem; font-weight: 600; cursor: pointer; border: none; transition: opacity 0.2s; }
.btn-modal.secondary { background: rgba(255, 255, 255, 0.05); color: #ccc; border: 1px solid rgba(255, 255, 255, 0.1); }
.btn-modal.danger { background: #ef4444; color: white; }
.btn-modal:hover { opacity: 0.9; }

.pop-enter-active, .pop-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.pop-enter-from, .pop-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>