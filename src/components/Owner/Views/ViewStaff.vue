<template>
  <HeadingOwner>
    <NotificationSystem ref="toastRef" />
    <main class="main-content">
      <header class="header-section">
        <div class="title-wrapper">
          <h1 class="main-title">{{ t('staffTitle') }}</h1>
          <p class="result-count">{{ filteredUsers.length }} {{ filteredUsers.length === 1 ? t('resultSingular') : t('resultPlural') }}</p>
        </div>
      
        <div class="actions-bar" id="tutorial-step-0">
            <select class="status-select" v-model="selectedRoleFilter">
              <option value="Todos">{{ t('roleAll') }}</option>
              <option value="Recepcionista">{{ t('roleReceptionist') }}</option>
              <option value="Entrenador">{{ t('roleTrainer') }}</option>
              <option value="Owner">{{ t('roleOwner') }}</option>
            </select>
            <button class="btn-bulk" @click="activeModal = 'enviomasivo'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              {{ t('bulkEmailBtn') }}
            </button>
            <div class="search-wrapper">
              <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" class="search-input" :placeholder="t('searchPlaceholder')" v-model="searchQuery">
            </div>
        </div>
      </header>
        
      <div v-if="!isMobile" class="table-container desktop-only" id="tutorial-step-1">
        <table class="user-table" v-if="filteredUsers.length">
          <thead>
            <tr>
              <th>{{ t('tablePhoto') }}</th>
              <th>{{ t('tableName') }}</th>
              <th>{{ t('tableEmail') }}</th>
              <th>{{ t('tablePhone') }}</th>
              <th>{{ t('tableSystemRole') }}</th>
              <th class="th-actions">{{ t('tableActions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in filteredUsers" :key="user.id">
              <td><div class="avatar-small" :style="{ background: avatarColor(user.name) }">{{ initials(user.name) }}</div></td>
              <td class="text-bold">{{ user.name }}</td>
              <td class="text-muted">{{ user.email }}</td>
              <td class="text-muted">{{ user.phone }}</td>
              <td><span :class="['status-badge', getRoleClass(user.role)]"><i class="status-dot"></i>{{ user.role }}</span></td>
              <td class="actions-cell" :id="index === 0 ? 'tutorial-step-2' : null">
                <button class="icon-btn btn-email" :title="t('actionEmail')" @click="activeModal = 'enviocorreo'">
                  <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </button>
                <button class="icon-btn btn-wa" :title="t('actionWhatsApp')" @click="openWhatsApp(user.phone)">
                  <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 5.6 8.5 8.5 0 0 1-7.6-5.6 8.38 8.38 0 0 1-.9-3.8A8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z"/><path d="M9 12l2 2 4-4"/></svg>
                </button>
                <button class="icon-btn btn-edit" :title="t('actionEdit')" @click="goToEdit(user.id)">
                  <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="icon-btn btn-delete" :title="t('actionDelete')" @click="confirmDelete(user)">
                  <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="empty-state">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <p>{{ t('emptyStateText') || 'Sin resultados para tu búsqueda' }}</p>
        </div>
      </div>

      <!-- VISTA MÓVIL (Renderizada solo si SÍ es móvil) -->
      <div v-else class="mobile-only">
        <div v-if="!filteredUsers.length" class="empty-state">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <p>{{ t('emptyStateText') || 'Sin resultados para tu búsqueda' }}</p>
        </div>
        <div v-for="(user, index) in filteredUsers" :key="user.id" class="user-card" :id="index === 0 ? 'tutorial-step-1' : null">
           <div class="card-top-section">
            <div class="avatar-small" :style="{ background: avatarColor(user.name) }">{{ initials(user.name) }}</div>
            <div class="card-user-titles">
              <div class="text-bold name-text">{{ user.name }}</div>
              <span :class="['status-badge', getRoleClass(user.role)]"><i class="status-dot"></i>{{ user.role }}</span>
            </div>
          </div>
          
          <div class="card-meta">
            <span class="email-text">{{ user.email }}</span>
            <span class="phone-text">{{ user.phone }}</span>
          </div>

          <div class="card-actions" :id="index === 0 ? 'tutorial-step-2' : null">
            <button class="action-chip btn-email-chip" @click="activeModal = 'enviocorreo'">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <span>Email</span>
            </button>
            <button class="action-chip btn-wa-chip" @click="openWhatsApp(user.phone)">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 5.6 8.5 8.5 0 0 1-7.6-5.6 8.38 8.38 0 0 1-.9-3.8A8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z"/><path d="M9 12l2 2 4-4"/></svg>
              <span>WApp</span>
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
      </div>

      <!-- Modal QR -->
      <ModalComponent :isOpen="showQR" @close="showQR = false">
        <div class="modal-body-custom">
          <h2 class="modal-heading-accent">{{ t('modalQrTitle') }}</h2>
          <div class="qr-wrapper">
              <img src="../../../assets/qr.png" alt="QR" class="qr-image" />
          </div>
          <p class="modal-subtext">
              {{ t('modalQrText') }}
          </p>
          <button class="btn-bulk btn-block">{{ t('modalQrDownload') }}</button>
        </div>
      </ModalComponent>

    </main>

    <!-- Modal de Eliminación -->
    <transition name="pop">
      <div v-if="showDelete" class="modal-wrapper" @click.self="showDelete = false">
        <div class="custom-modal-card">
          <div class="modal-body-custom">
            <div class="modal-icon-container danger-bg">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h2>{{ t('modalDeleteTitle') }}</h2>
            <p>{{ t('modalDeleteDescPart1') }} <span class="highlight-name">{{ selectedUser?.name }}</span> {{ t('modalDeleteDescPart2') }}</p>
            <div class="modal-buttons">
              <button class="btn-modal secondary" @click="showDelete = false">{{ t('modalCancel') }}</button>
              <button class="btn-modal danger" @click="executeDelete">{{ t('modalConfirm') }}</button>
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

    <transition name="pop">
      <div v-if="activeModal === 'enviocorreo'" class="modal-wrapper" @click.self="activeModal = null">
        <EnvioCorreo @close="activeModal = null" />
      </div>
    </transition>   
  </HeadingOwner>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import HeadingOwner from '../HeadingOwner.vue';
import ModalComponent from '../../Modals/ModalComponent.vue';
import CorreoMasivo from '../Componets/Bulk-Email.vue';
import EnvioCorreo from '../Componets/Mail.vue';
import NotificationSystem from '../../Modals/NotificationSystem.vue'; 
import { traducciones } from '../i18n.js';

const activeModal = ref(null);
const toastRef = ref(null);

const router = useRouter();
const showQR = ref(false);
const showDelete = ref(false);
const selectedUser = ref(null);

const searchQuery = ref('');
const selectedRoleFilter = ref('Todos');

const currentLang = ref(localStorage.getItem('owner-idioma') || 'es');

const t = (key) => {
  const langTable = traducciones[currentLang.value] || traducciones.es;
  return langTable[key] || traducciones.es[key] || key;
};

const handleLangChange = (e) => {
  if (e.detail && e.detail.idioma) {
    currentLang.value = e.detail.idioma;
  }
};

// Detección reactiva para saber si está en móvil (< 900px)
const isMobile = ref(window.innerWidth <= 900);
const handleResize = () => {
  isMobile.value = window.innerWidth <= 900;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  window.addEventListener('idioma-changed', handleLangChange);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('idioma-changed', handleLangChange);
});

const filteredUsers = computed(() => {
  let result = selectedRoleFilter.value === 'Todos' 
    ? users.value 
    : users.value.filter(user => user.role === selectedRoleFilter.value);

  if (searchQuery.value) {
    const term = searchQuery.value.toLowerCase();
    result = result.filter(user => 
      user.name.toLowerCase().includes(term) || 
      user.email.toLowerCase().includes(term) ||
      user.phone.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term) || 
      user.id.toString().includes(term)
    );
  }
  return result;
});

const getRoleClass = (role) => {
  const classes = {
    'Recepcionista': 'role-recepcionista',
    'Entrenador': 'role-entrenador',
    'Owner': 'role-Owner'
  };
  return classes[role] || 'role-default';
};

// --- Iniciales y color de avatar (identidad visual consistente por usuario) ---
const AVATAR_PALETTE = ['#3b82f6', '#a855f7', '#22c55e', '#f59e0b', '#ec4899', '#14b8a6', '#6366f1', '#ef4444'];

const initials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  const first = parts[0][0] || '';
  const second = parts.length > 1 ? parts[1][0] : '';
  return (first + second).toUpperCase();
};

const avatarColor = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const color = AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
  return `linear-gradient(135deg, ${color}, ${color}99)`;
};

const users = ref([
  { id: 1, name: 'Armando Luis Ramires Sanchez', email: 'Armandoluis@gmail.com', phone: '+52 481 1265412', role: 'Recepcionista' },
  { id: 2, name: 'Francisco Luis Ramires Sanchez', email: 'Francisco.luis@example.com', phone: '+52 4811 243422', role: 'Entrenador' },
  { id: 3, name: 'Maria Luis Ramires Sanchez', email: 'Maria.luis@example.com', phone: '+52 4811 243423', role: 'Recepcionista' },
  { id: 4, name: 'Jorge Luis Ramires Sanchez', email: 'Jorge.luis@example.com', phone: '+52 4811 243424', role: 'Entrenador' },
  { id: 5, name: 'Mario Luis Ramires Sanchez', email: 'Mario.luis@example.com', phone: '+52 4811 243425', role: 'Recepcionista' },
  { id: 6, name: 'Luis Ramires Sanchez', email: 'Luis.ramires@example.com', phone: '+52 4811 243426', role: 'Recepcionista' },
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
  if (toastRef.value) {
    toastRef.value.notify(t('msgDeleteStaffSuccess'), 'success');
  }
};

const goToEdit = (id) => router.push(`/Owner/editar-staff/${id}`);
const openWhatsApp = (phone) => window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank');
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;600;700&display=swap');

.main-content { padding: 30px 40px; max-width: 1400px; margin: 0 auto; color: var(--color-texto-general, #e5e5e5); }
.header-section { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 28px; flex-wrap: wrap; gap: 20px; }

.title-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.main-title { font-family: 'Anton', sans-serif; font-size: 2rem; color: var(--color-titulos, #fff); margin: 0; letter-spacing: 0.5px; text-transform: uppercase; }
.result-count { margin: 0; font-size: 0.85rem; color: var(--color-texto-general, #888); opacity: 0.75; font-weight: 500; }
.main-subtitle { font-size: 0.88rem; color: var(--color-texto-general, #888); margin: 0; opacity: 0.8; }

.actions-bar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.status-select { 
  background: var(--bg-cards, #141414); 
  border: 1.5px solid rgba(255, 255, 255, 0.1); 
  padding: 10px 14px; 
  border-radius: var(--app-border-radius, 10px); 
  color: var(--color-texto-general, #fff); 
  font-size: 0.9rem;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.status-select:hover { background: rgba(255, 255, 255, 0.04); border-color: rgba(255, 255, 255, 0.2); }
.status-select:focus { border-color: var(--color-highlight, #3b82f6); box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); }

.search-wrapper { position: relative; display: flex; align-items: center; }
.search-icon { position: absolute; left: 12px; color: var(--color-texto-general, #777); pointer-events: none; opacity: 0.7; }
.search-input {
  background: var(--bg-cards, #141414);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  padding: 10px 14px 10px 36px;
  border-radius: var(--app-border-radius, 10px);
  color: var(--color-texto-general, #fff);
  font-size: 0.9rem;
  outline: none;
  width: 220px;
  transition: border-color 0.2s, width 0.2s, box-shadow 0.2s;
}
.search-input:focus { border-color: var(--color-highlight, #3b82f6); width: 250px; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); }

.btn-bulk {
  background: var(--bg-cards, #141414);
  border: 1.5px solid rgba(255, 255, 255, 0.1); 
  padding: 10px 16px;
  border-radius: var(--app-border-radius, 10px);
  color: var(--color-texto-general, #fff); 
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  white-space: nowrap;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background 0.2s, border-color 0.2s, transform 0.15s, box-shadow 0.2s;
}
.btn-bulk:hover { background: rgba(59, 130, 246, 0.1); border-color: var(--color-highlight, #3b82f6); transform: translateY(-1px); box-shadow: 0 6px 14px rgba(59, 130, 246, 0.2); }
.btn-bulk:active { transform: translateY(0); }
.btn-bulk svg { color: var(--color-highlight, #3b82f6); flex-shrink: 0; }
.btn-block { width: 100%; }

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

.status-badge { 
    padding: 4px 12px 4px 8px; 
    border-radius: 20px; 
    font-size: 0.8rem; 
    font-weight: 600;
    border: 1px solid transparent;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    width: fit-content;
}
.status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; display: inline-block; flex-shrink: 0; }

.role-recepcionista { background: rgba(16, 185, 129, 0.08); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
.role-entrenador { background: rgba(59, 130, 246, 0.08); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
.role-Owner { background: rgba(168, 85, 247, 0.08); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); }
.role-default { background: #222; color: #ccc; border: 1px solid #444; }
:deep(.notification-container),
:deep(.toast-container) {
  width: calc(100% - 32px) !important;
  max-width: 480px !important;
  box-sizing: border-box !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  right: auto !important;
  margin: 0 auto !important;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 80px 20px;
  color: var(--color-texto-general, #777);
  opacity: 0.7;
  text-align: center;
}
.empty-state p { margin: 0; font-size: 0.95rem; }

@media (max-width: 900px) {
  .main-content { padding: 20px 14px; }
  .header-section { flex-direction: column; align-items: stretch; gap: 15px; }

  .actions-bar { 
    display: flex; 
    flex-direction: column;
    gap: 10px; 
    width: 100%; 
  }
  .status-select, .btn-bulk, .search-wrapper { 
    width: 100%; 
  }
  .search-input { width: 100%; }
  .search-input:focus { width: 100%; }
  .search-wrapper { order: -1; }

  .user-card {
    background: var(--bg-cards, #141416);
    padding: 18px;
    border-radius: var(--app-border-radius, 18px);
    border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.09));
    margin-bottom: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .user-card:active { border-color: rgba(255, 255, 255, 0.18); }

  .card-top-section {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
  }

  .avatar-small {
    width: 44px;
    height: 44px;
    font-size: 0.85rem;
  }

  .card-user-titles {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 7px;
    flex: 1;
    min-width: 0;
  }

  .name-text {
    font-size: 0.95rem;
    line-height: 1.25;
    color: var(--color-titulos, #fff);
    font-weight: 600;
  }

  .card-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 0.85rem;
    margin-bottom: 14px;
    padding-left: 2px;
  }

  .email-text {
    color: var(--color-texto-general, #94a3b8);
    opacity: 0.8;
  }

  .phone-text {
    color: var(--color-texto-general, #888);
    opacity: 0.7;
  }

  .card-actions {
    border-top: 1px dashed rgba(255, 255, 255, 0.12);
    padding-top: 12px;
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .action-chip {
    flex: 1;
    min-width: 55px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: var(--app-border-radius, 10px);
    padding: 8px 4px;
    color: #e2e8f0;
    font-size: 0.72rem;
    font-weight: 500;
    font-family: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }

  .action-chip:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }

  .btn-email-chip { color: #38bdf8; }
  .btn-email-chip:hover { background: rgba(56, 189, 248, 0.1); border-color: rgba(56, 189, 248, 0.3); }

  .btn-wa-chip { color: #22c55e; }
  .btn-wa-chip:hover { background: rgba(34, 197, 94, 0.1); border-color: rgba(34, 197, 94, 0.3); }

  .btn-edit-chip { color: #fbbf24; }
  .btn-edit-chip:hover { background: rgba(251, 191, 36, 0.1); border-color: rgba(251, 191, 36, 0.3); }

  .btn-delete-chip { color: #f87171; }
  .btn-delete-chip:hover { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); }
}

.table-container { 
  background: var(--bg-cards, #111); 
  border-radius: var(--app-border-radius, 18px); 
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.09)); 
  overflow: hidden; 
  box-shadow: 0 4px 20px rgba(0,0,0,0.4); 
  position: relative;
}
.table-container::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-botones, #1c4fd6), var(--color-highlight, #60a5fa), var(--color-botones, #1c4fd6));
}
.user-table { width: 100%; border-collapse: collapse; color: var(--color-texto-general, #e5e5e5); text-align: left; }
.user-table th { padding: 16px 20px; background: rgba(255, 255, 255, 0.025); font-family: 'Oswald', sans-serif; font-size: 0.8rem; text-transform: uppercase; color: var(--color-texto-general, #888); letter-spacing: 0.6px; border-bottom: 1px solid rgba(255, 255, 255, 0.09); white-space: nowrap; }
.th-actions { text-align: left; }
.user-table td { padding: 14px 20px; border-top: 1px solid rgba(255, 255, 255, 0.05); font-size: 0.9rem; vertical-align: middle; }
.user-table tbody tr { transition: background 0.15s; }
.user-table tbody tr:nth-child(even) { background: rgba(255, 255, 255, 0.012); }
.user-table tr:hover { background: rgba(59, 130, 246, 0.06); }
.text-muted { color: var(--color-texto-general, #999); opacity: 0.85; }

.actions-cell { display: flex; gap: 8px; }
.icon-btn { 
  background: rgba(255, 255, 255, 0.03); 
  border: 1px solid rgba(255, 255, 255, 0.09); 
  border-radius: var(--app-border-radius, 8px); 
  cursor: pointer; 
  color: var(--color-texto-general, #aaa); 
  padding: 8px; 
  display: flex; 
  align-items: center; 
  justify-content: center;
  transition: all 0.18s ease;
}
.icon-btn:hover { transform: translateY(-1px); }
.icon-btn.btn-email:hover { background: rgba(56, 189, 248, 0.1); border-color: rgba(56, 189, 248, 0.35); color: #38bdf8; }
.icon-btn.btn-wa:hover { background: rgba(34, 197, 94, 0.1); border-color: rgba(34, 197, 94, 0.35); color: #22c55e; }
.icon-btn.btn-edit:hover { background: rgba(251, 191, 36, 0.1); border-color: rgba(251, 191, 36, 0.35); color: #fbbf24; }
.icon-btn.btn-delete:hover { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.35); color: #ef4444; }

.avatar-small { 
  width: 40px; 
  height: 40px; 
  color: #fff; 
  border-radius: 50%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-weight: 700; 
  font-size: 0.78rem; 
  letter-spacing: 0.3px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
}

.text-bold { font-weight: 600; color: var(--color-titulos, #fff); }
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
.modal-heading-accent { color: var(--color-highlight, #3b82f6); margin-bottom: 15px; font-family: 'Anton', sans-serif; font-size: 1.3rem; text-transform: uppercase; }
.modal-subtext { color: #aaa; font-size: 0.9rem; margin: 20px 0; }
.qr-wrapper { display: flex; justify-content: center; }
.qr-image { max-width: 180px; display: block; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); }
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