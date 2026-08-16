<template>
  <HeadingOwner>
    <main class="main-content">
      <header class="header-section">
        <div class="title-wrapper">
          <h1 class="main-title">{{ t('renewalsTitle') }}</h1>
          <span class="title-underline"></span>
          <p class="main-subtitle">{{ t('renewalsSubtitle') }}</p>
        </div>

        <div class="actions-bar" id="tutorial-step-0">
          <div class="search-wrapper">
            <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" class="search-input" :placeholder="t('searchPlaceholder')" v-model="searchQuery">
          </div>
        </div>
      </header>

      <!-- VISTA ESCRITORIO -->
      <div class="table-container desktop-only" :id="!isMobile ? 'tutorial-step-1' : undefined">
        <table class="user-table">
          <thead>
            <tr>
              <th>{{ t('colPhoto') }}</th>
              <th>{{ t('colName') }}</th>
              <th>{{ t('colEmail') }}</th>
              <th>{{ t('colExpiration') }}</th>
              <th>{{ t('colDebt') }}</th>
              <th>{{ t('colActions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in filteredUsers" :key="user.id">
              <td><div class="avatar-small" :style="avatarStyle(user.id)">{{ getInitials(user.name) }}</div></td>
              <td class="text-bold">{{ user.name }}</td>
              <td class="text-muted">{{ user.email }}</td>
              <td class="text-muted">{{ user.expiredDate }}</td>
              <td><span class="status-badge" :class="getDebtClass(user.status)">{{ user.debt }}</span></td>
              <td class="actions-cell" :id="!isMobile && index === 0 ? 'tutorial-step-2' : undefined">
                <button class="icon-btn" :title="t('renewBtn')" @click="activeModal = 'renovacion'; selectedUser = user"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.5 4a3.5 3.5 0 1 0 5 0m-5 0V3m5 6l-5-5-5 5"/></svg></button>
                <button class="icon-btn delete-icon-btn" :title="t('deleteBtn')" @click="confirmDelete(user)"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="6" class="empty-state-cell">
                <div class="empty-state">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <span>{{ t('emptyState') }}</span>
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
          :class="getDebtClass(user.status)"
          :id="isMobile && index === 0 ? 'tutorial-step-1' : undefined"
        >
          <div class="card-top-section">
            <div class="avatar-small" :style="avatarStyle(user.id)">{{ getInitials(user.name) }}</div>
            <div class="card-user-titles">
              <div class="text-bold name-text">{{ user.name }}</div>
              <span class="status-badge" :class="getDebtClass(user.status)">{{ user.debt }}</span>
            </div>
          </div>

          <div class="card-meta">
            <span class="meta-row"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><span class="email-text">{{ user.email }}</span></span>
            <span class="meta-row expiration-warning"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg><span class="vence-label">{{ t('expiresLabel') }}:</span> {{ user.expiredDate }}</span>
            <span class="meta-row"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg><span class="phone-text">{{ user.phone }}</span></span>
          </div>

          <div class="card-actions" :id="isMobile && index === 0 ? 'tutorial-step-2' : undefined">
            <button class="action-chip btn-renew-chip" @click="activeModal = 'renovacion'; selectedUser = user">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.5 4a3.5 3.5 0 1 0 5 0m-5 0V3m5 6l-5-5-5 5"/></svg>
              <span>{{ t('renewBtn') }}</span>
            </button>
            <button class="action-chip btn-delete-chip" @click="confirmDelete(user)">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              <span>{{ t('deleteBtn') }}</span>
            </button>
          </div>
        </div>

        <div v-if="filteredUsers.length === 0" class="empty-state-mobile">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span>{{ t('emptyState') }}</span>
        </div>
      </div>

      <!-- TRANSICIÓN DE RENOVACIÓN (MODAL EXTERNO) -->
      <transition name="pop">
        <div v-if="activeModal === 'renovacion'" class="modal-wrapper" @click.self="activeModal = null">
          <RenovacionModal :user="selectedUser" @close="activeModal = null" />
        </div>
      </transition>

      <!-- Modal Eliminar -->
      <ModalComponent :isOpen="showDelete" @close="showDelete = false">
        <div class="modal-body-custom">
          <div class="modal-icon-container danger-bg">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#ef4444" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </div>
          <h2>{{ t('deleteTitle') }}</h2>
          <p>{{ t('deleteMsgPre') }} <span class="highlight-name">{{ selectedUser?.name }}</span> {{ t('deleteMsgPost') }}</p>
          <div class="modal-buttons">
            <button class="btn-modal secondary" @click="showDelete = false">{{ t('cancelBtn') }}</button>
            <button class="btn-modal danger" @click="executeDelete">{{ t('confirmDeleteBtn') }}</button>
          </div>
        </div>
      </ModalComponent>

    </main>
  </HeadingOwner>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import HeadingOwner from '../HeadingOwner.vue';
import ModalComponent from '../../Modals/ModalComponent.vue';
import RenovacionModal from '../Componets/Account-Recovery.vue';

interface User {
  id: number;
  name: string;
  email: string;
  expiredDate: string;
  mensualidad: string;
  debt: string;
  status: string;
  phone: string;
}

const activeModal = ref<string | null>(null);
const showDelete = ref<boolean>(false);
const selectedUser = ref<User | null>(null);
const searchQuery = ref<string>('');

// Sistema de Idiomas
const currentLang = ref<string>(localStorage.getItem('owner-idioma') || 'es');
const handleLangChange = (e: Event) => {
  const customEvent = e as CustomEvent<{ idioma?: string }>;
  if (customEvent.detail?.idioma) currentLang.value = customEvent.detail.idioma;
};

const langData: Record<'es' | 'en', Record<string, string>> = {
  es: {
    renewalsTitle: 'Renovaciones',
    renewalsSubtitle: 'Gestiona las membresías vencidas o próximas a vencer de los usuarios',
    searchPlaceholder: 'Buscar usuario...',
    colPhoto: 'Foto',
    colName: 'Nombre',
    colEmail: 'Correo',
    colExpiration: 'Vencimiento',
    colDebt: 'Adeudo',
    colActions: 'Acciones',
    expiresLabel: 'Vence',
    renewBtn: 'Renovar',
    deleteBtn: 'Eliminar',
    emptyState: 'No se encontraron resultados con esos filtros.',
    deleteTitle: '¿Eliminar usuario?',
    deleteMsgPre: '¿Estás seguro de que deseas eliminar a',
    deleteMsgPost: 'permanentemente? Esta acción no se puede deshacer.',
    cancelBtn: 'Cancelar',
    confirmDeleteBtn: 'Sí, eliminar'
  },
  en: {
    renewalsTitle: 'Renewals',
    renewalsSubtitle: 'Manage expired or upcoming membership renewals for users',
    searchPlaceholder: 'Search user...',
    colPhoto: 'Photo',
    colName: 'Name',
    colEmail: 'Email',
    colExpiration: 'Expiration',
    colDebt: 'Debt',
    colActions: 'Actions',
    expiresLabel: 'Expires',
    renewBtn: 'Renew',
    deleteBtn: 'Delete',
    emptyState: 'No results found with those filters.',
    deleteTitle: 'Delete user?',
    deleteMsgPre: 'Are you sure you want to permanently delete',
    deleteMsgPost: '? This action cannot be undone.',
    cancelBtn: 'Cancel',
    confirmDeleteBtn: 'Yes, delete'
  }
};

const t = (key: string): string => {
  const langKey = (currentLang.value === 'en' ? 'en' : 'es') as 'es' | 'en';
  return langData[langKey][key] || langData.es[key] || key;
};

const isMobile = ref<boolean>(window.innerWidth <= 900);
const handleResize = (): void => {
  isMobile.value = window.innerWidth <= 900;
};

onMounted(() => {
  window.addEventListener('idioma-changed', handleLangChange as EventListener);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('idioma-changed', handleLangChange as EventListener);
  window.removeEventListener('resize', handleResize);
});

const users = ref<User[]>([
  { id: 1, name: 'Jesus Luis Ramires Sanchez', email: 'jesusluis@gmail.com', expiredDate: '18/03/2026', mensualidad: 'Mensual', debt: '$600.00', status: 'Inactivo', phone: '+52 481 123 4321' },
  { id: 2, name: 'Armando Luis Ramires Sanchez', email: 'armando@gmail.com', expiredDate: '18/03/2026', mensualidad: 'Mensual', debt: '$700.00', status: 'Inactivo', phone: '+52 481 124 3421' },
  { id: 3, name: 'Luis Luis Ramires Sanchez', email: 'luis@gmail.com', expiredDate: '18/03/2026', mensualidad: 'Mensual', debt: '$900.00', status: 'Inactivo', phone: '+52 481 125 5421' },
  { id: 4, name: 'Francisco Luis Ramires', email: 'francisco@gmail.com', expiredDate: '18/03/2026', mensualidad: 'Quincenal', debt: '$500.00', status: 'Pendiente', phone: '+52 481 126 6421' },
  { id: 5, name: 'Jorge Luis Ramires Sanchez', email: 'jorge@gmail.com', expiredDate: '18/03/2026', mensualidad: 'Quincenal', debt: '$0.00', status: 'Activo', phone: '+52 481 127 7421' },
]);

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const term = searchQuery.value.toLowerCase();
    const matchSearch =
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.debt.toLowerCase().includes(term) ||
      user.phone.toLowerCase().includes(term) ||
      user.mensualidad.toLowerCase().includes(term) ||
      user.status.toLowerCase().includes(term) ||
      user.expiredDate.toLowerCase().includes(term) ||
      user.id.toString().includes(term);

    return matchSearch;
  });
});

// Iniciales + gradiente de avatar (sin depender de fotos reales)
const avatarGradients: string[] = [
  'linear-gradient(135deg, #7e22ce, #4c1d95)',
  'linear-gradient(135deg, #ea580c, #9a3412)',
  'linear-gradient(135deg, #db2777, #9d174d)',
  'linear-gradient(135deg, #dc2626, #7f1d1d)',
  'linear-gradient(135deg, #2563eb, #1e3a8a)',
  'linear-gradient(135deg, #059669, #064e3b)',
];
const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
};
const avatarStyle = (id: number) => ({ backgroundImage: avatarGradients[id % avatarGradients.length] });

const getDebtClass = (status: string): string => {
  if (status === 'Pendiente') return 'debt-pending';
  if (status === 'Inactivo') return 'debt-inactive';
  return 'debt-default';
};

const confirmDelete = (user: User): void => {
  selectedUser.value = user;
  showDelete.value = true;
};

const executeDelete = (): void => {
  if (!selectedUser.value) return;
  users.value = users.value.filter(u => u.id !== selectedUser.value?.id);
  showDelete.value = false;
  selectedUser.value = null;
};
</script>

<style scoped>
.main-content { padding: 30px 40px 60px; max-width: 1400px; margin: 0 auto; color: var(--color-texto-general, #e5e5e5); font-family: 'Inter', sans-serif; }

.header-section { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 26px; flex-wrap: wrap; gap: 20px; }
.title-wrapper { display: flex; flex-direction: column; gap: 4px; min-width: 260px; }
.main-title { font-family: 'Anton', sans-serif; font-size: clamp(1.6rem, 4vw, 2.1rem); color: var(--color-titulos, #fff); margin: 0; letter-spacing: 0.5px; text-transform: uppercase; }
.title-underline { display: block; width: 60px; height: 4px; margin: 2px 0 4px; border-radius: 4px; background: linear-gradient(90deg, var(--color-highlight, #3b82f6), transparent); }
.main-subtitle { font-size: 0.85rem; color: rgba(245, 245, 244, 0.55); margin: 0; }

.actions-bar { display: flex; gap: 15px; align-items: center; }

.search-wrapper { position: relative; display: flex; align-items: center; }
.search-icon { position: absolute; left: 12px; color: rgba(245, 245, 244, 0.4); pointer-events: none; z-index: 1; }
.search-input {
  background: rgba(0, 0, 0, 0.28);
  border: 1px solid var(--border-input, rgba(255, 255, 255, 0.1));
  padding: 11px 14px 11px 36px;
  border-radius: var(--app-border-radius, 10px);
  color: var(--color-texto-general, #fff);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 240px;
  font-family: 'Inter', sans-serif;
}
.search-input:focus { border-color: var(--color-highlight, #3b82f6); box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); }

.desktop-only { display: block; }
.mobile-only { display: none; }

.debt-pending { color: #f59e0b; border-color: rgba(245, 158, 11, 0.35); background: rgba(245, 158, 11, 0.1); }
.debt-inactive { color: #ef4444; border-color: rgba(239, 68, 68, 0.35); background: rgba(239, 68, 68, 0.1); }
.debt-default { color: #22c55e; border-color: rgba(34, 197, 94, 0.35); background: rgba(34, 197, 94, 0.1); }

@media (max-width: 900px) {
  .desktop-only { display: none; }
  .mobile-only { display: block; }
  .main-content { padding: 18px 14px 40px; }
  .header-section { flex-direction: column; align-items: stretch; gap: 16px; }

  .actions-bar { display: flex; flex-direction: column; gap: 10px; width: 100%; }
  .search-wrapper { width: 100%; }
  .search-input { width: 100%; }

  .user-card {
    position: relative;
    background: rgba(0, 0, 0, 0.25);
    padding: 16px 16px 16px 18px;
    border-radius: var(--app-border-radius, 14px);
    border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.08));
    margin-bottom: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    border-left: 3px solid transparent;
  }
  .user-card.debt-pending { border-left-color: #f59e0b; }
  .user-card.debt-inactive { border-left-color: #ef4444; }
  .user-card.debt-default { border-left-color: #22c55e; }

  .card-top-section { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 4px; }
  .card-user-titles { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; flex: 1; min-width: 0; }
  .name-text { font-size: 0.95rem; line-height: 1.25; color: var(--color-titulos, #fff); font-weight: 600; }

  .card-meta { font-size: 0.83rem; margin-bottom: 14px; }

  .card-actions { position: relative; border-top: 1px dashed rgba(255, 255, 255, 0.12); padding-top: 12px; display: flex; gap: 10px; }

  .action-chip {
    flex: 1;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 10px 8px;
    color: var(--color-texto-general, #e2e8f0);
    font-size: 0.85rem;
    font-weight: 500;
    font-family: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }
  .action-chip:hover { background: rgba(255, 255, 255, 0.08); color: #fff; }
  .btn-renew-chip { color: #38bdf8; }
  .btn-renew-chip:hover { background: rgba(56, 189, 248, 0.1); border-color: rgba(56, 189, 248, 0.3); }
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
.user-table th { padding: 16px 20px; background: rgba(255,255,255,0.02); font-family: 'Oswald', sans-serif; font-size: 0.72rem; text-transform: uppercase; color: rgba(245, 245, 244, 0.5); letter-spacing: 0.6px; border-bottom: 1px solid var(--border-line, rgba(255,255,255,0.08)); }
.user-table td { padding: 14px 20px; border-top: 1px solid var(--border-line, rgba(255,255,255,0.05)); font-size: 0.88rem; vertical-align: middle; }
.text-muted { color: rgba(245, 245, 244, 0.55); }

@media (hover: hover) {
  .user-table tbody tr { transition: background 0.15s ease; }
  .user-table tbody tr:hover { background: rgba(255, 255, 255, 0.025); box-shadow: inset 3px 0 0 var(--color-highlight, #3b82f6); }
}

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

/* Modal envolvente con la transición pop */
.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.pop-enter-active, .pop-leave-active { transition: all 0.25s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(0.9); }

.modal-body-custom { text-align: center; color: var(--color-texto-general, #fff); padding: 10px 5px; }
.modal-body-custom h2 { font-size: 1.3rem; margin-bottom: 10px; font-weight: 600; color: var(--color-titulos, #fff); }
.modal-body-custom p { color: var(--color-texto-secundario, #aaa); font-size: 0.9rem; margin-bottom: 20px; line-height: 1.5; }
.highlight-name { color: var(--color-titulos, #fff); font-weight: 600; }

.modal-icon-container { width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px auto; }
.danger-bg { background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.2); }

.modal-buttons { display: flex; gap: 10px; }
.btn-modal { flex: 1; padding: 10px; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; border: none; transition: opacity 0.2s; }
.btn-modal.secondary { background: rgba(255, 255, 255, 0.05); color: var(--color-texto-general, #ccc); border: 1px solid rgba(255, 255, 255, 0.1); }
.btn-modal.danger { background: #ef4444; color: white; }
.btn-modal:hover { opacity: 0.9; }
</style>