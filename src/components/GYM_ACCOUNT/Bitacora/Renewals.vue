<template>
  <HeadingGYM_ACCOUNT>
    <NotificationSystem ref="toastRef" />
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
            <button v-if="searchQuery" class="search-clear" type="button" @click="searchQuery = ''" aria-label="Clear">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      </header>

      <!-- RESUMEN -->
      <section class="stats-row">
        <div class="stat-card" v-for="s in stats" :key="s.key" :class="'stat-' + s.tone">
          <span class="stat-value">{{ s.value }}</span>
          <span class="stat-label">{{ t(s.key) }}</span>
        </div>
      </section>

      <!-- ESCRITORIO -->
      <div class="table-container desktop-only" :id="!isMobile ? 'tutorial-step-1' : undefined">
        <table class="user-table">
          <thead>
            <tr>
              <th>{{ t('colPhoto') }}</th>
              <th>{{ t('colName') }}</th>
              <th>{{ t('colEmail') }}</th>
              <th>{{ t('colType') }}</th>
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
              <td><span class="type-chip">{{ typeLabel(user.mensualidad) }}</span></td>
              <td class="text-muted">{{ user.expiredDate }}</td>
              <td><span class="status-badge" :class="getDebtClass(user.status)">{{ user.debt }}</span></td>
              <td>
                <div class="actions-cell" :id="!isMobile && index === 0 ? 'tutorial-step-2' : undefined">
                  <button class="icon-btn" :title="t('renewBtn')" @click="handleOpenRenew(user)"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.5 4a3.5 3.5 0 1 0 5 0m-5 0V3m5 6l-5-5-5 5"/></svg></button>
                  <button class="icon-btn delete-icon-btn" :title="t('deleteBtn')" @click="confirmDelete(user)"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="7" class="empty-state-cell">
                <div class="empty-state">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <span>{{ t('emptyState') }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="table-footer">{{ filteredUsers.length }} {{ t('resultsLabel') }}</div>
      </div>

      <!-- MÓVIL -->
      <div class="mobile-only">
        <div
          v-for="(user, index) in filteredUsers"
          :key="user.id"
          class="user-card"
          :class="'card-' + getDebtClass(user.status)"
          :id="isMobile && index === 0 ? 'tutorial-step-1' : undefined"
        >
          <div class="card-top-section">
            <div class="avatar-small" :style="avatarStyle(user.id)">{{ getInitials(user.name) }}</div>
            <div class="card-user-titles">
              <div class="text-bold name-text">{{ user.name }}</div>
              <div class="badges-row">
                <span class="status-badge" :class="getDebtClass(user.status)">{{ user.debt }}</span>
                <span class="type-chip">{{ typeLabel(user.mensualidad) }}</span>
              </div>
            </div>
          </div>

          <div class="card-meta">
            <span class="meta-row"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><span class="email-text">{{ user.email }}</span></span>
            <span class="meta-row expiration-warning"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg><span class="vence-label">{{ t('expiresLabel') }}:</span> {{ user.expiredDate }}</span>
            <span class="meta-row"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg><span class="phone-text">{{ user.phone }}</span></span>
          </div>

          <div class="card-actions" :id="isMobile && index === 0 ? 'tutorial-step-2' : undefined">
            <button class="action-chip btn-renew-chip" @click="handleOpenRenew(user)">
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

      <!-- Modal de renovación -->
      <transition name="pop">
        <div v-if="activeModal === 'renovacion'" class="modal-wrapper" @click.self="activeModal = null">
          <RenovacionModal :user="selectedUser" @close="activeModal = null" @renewed="handleRenewSuccess" />
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
  </HeadingGYM_ACCOUNT>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import HeadingGYM_ACCOUNT from '../HeadingGYM_ACCOUNT.vue';
import ModalComponent from '../../Modals/ModalComponent.vue';
import RenovacionModal from '../Componets/Account-Recovery.vue';
import NotificationSystem from '../../Modals/NotificationSystem.vue';

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
const toastRef = ref<any>(null);

// Idiomas
const currentLang = ref<string>(localStorage.getItem('GYM_ACCOUNT-idioma') || 'es');
const handleLangChange = (e: Event) => {
  const customEvent = e as CustomEvent<{ idioma?: string }>;
  if (customEvent.detail?.idioma) currentLang.value = customEvent.detail.idioma;
};

const langData: Record<'es' | 'en', Record<string, string>> = {
  es: {
    renewalsTitle: 'Renovaciones',
    renewalsSubtitle: 'Gestiona las membresías vencidas o próximas a vencer de los usuarios',
    searchPlaceholder: 'Buscar usuario...',
    monthly: 'Mensual',
    fortnightly: 'Quincenal',
    colPhoto: 'Foto',
    colName: 'Nombre',
    colEmail: 'Correo',
    colType: 'Pago',
    colExpiration: 'Vencimiento',
    colDebt: 'Adeudo',
    colActions: 'Acciones',
    expiresLabel: 'Vence',
    renewBtn: 'Renovar',
    deleteBtn: 'Eliminar',
    emptyState: 'No se encontraron resultados con esos filtros.',
    resultsLabel: 'resultados',
    statTotal: 'Total',
    statExpired: 'Vencidos',
    statPending: 'Pendientes',
    statDebt: 'Adeudo total',
    deleteTitle: '¿Eliminar usuario?',
    deleteMsgPre: '¿Estás seguro de que deseas eliminar a',
    deleteMsgPost: 'permanentemente? Esta acción no se puede deshacer.',
    cancelBtn: 'Cancelar',
    confirmDeleteBtn: 'Sí, eliminar',
    successDeleted: 'Usuario eliminado correctamente',
    successRenewed: 'Membresía renovada correctamente'
  },
  en: {
    renewalsTitle: 'Renewals',
    renewalsSubtitle: 'Manage expired or upcoming membership renewals for users',
    searchPlaceholder: 'Search user...',
    monthly: 'Monthly',
    fortnightly: 'Fortnightly',
    colPhoto: 'Photo',
    colName: 'Name',
    colEmail: 'Email',
    colType: 'Payment',
    colExpiration: 'Expiration',
    colDebt: 'Debt',
    colActions: 'Actions',
    expiresLabel: 'Expires',
    renewBtn: 'Renew',
    deleteBtn: 'Delete',
    emptyState: 'No results found with those filters.',
    resultsLabel: 'results',
    statTotal: 'Total',
    statExpired: 'Expired',
    statPending: 'Pending',
    statDebt: 'Total debt',
    deleteTitle: 'Delete user?',
    deleteMsgPre: 'Are you sure you want to permanently delete',
    deleteMsgPost: '? This action cannot be undone.',
    cancelBtn: 'Cancel',
    confirmDeleteBtn: 'Yes, delete',
    successDeleted: 'User deleted successfully',
    successRenewed: 'Membership renewed successfully'
  }
};

const t = (key: string): string => {
  const langKey = (currentLang.value === 'en' ? 'en' : 'es') as 'es' | 'en';
  return langData[langKey][key] || langData.es[key] || key;
};

const typeLabel = (m: string): string => (m === 'Quincenal' ? t('fortnightly') : t('monthly'));

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
  { id: 5, name: 'Jorge Luis Ramires Sanchez', email: 'jorge@gmail.com', expiredDate: '18/03/2026', mensualidad: 'Quincenal', debt: '$0.00', status: 'Activo', phone: '+52 481 127 7421' }
]);

const filteredUsers = computed(() => {
  const term = searchQuery.value.toLowerCase().trim();
  return users.value.filter(user =>
    user.name.toLowerCase().includes(term) ||
    user.email.toLowerCase().includes(term) ||
    user.debt.toLowerCase().includes(term) ||
    user.phone.toLowerCase().includes(term) ||
    user.mensualidad.toLowerCase().includes(term) ||
    user.status.toLowerCase().includes(term) ||
    user.expiredDate.toLowerCase().includes(term) ||
    user.id.toString().includes(term)
  );
});

const parseAmount = (s: string): number => parseFloat(s.replace(/[^0-9.]/g, '')) || 0;
const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);

const stats = computed(() => {
  const list = filteredUsers.value;
  const total = list.reduce((sum, u) => sum + parseAmount(u.debt), 0);
  return [
    { key: 'statTotal', value: String(list.length), tone: 'total' },
    { key: 'statExpired', value: String(list.filter(u => u.status === 'Inactivo').length), tone: 'red' },
    { key: 'statPending', value: String(list.filter(u => u.status === 'Pendiente').length), tone: 'orange' },
    { key: 'statDebt', value: formatCurrency(total), tone: 'red' }
  ];
});

const avatarGradients: string[] = [
  'linear-gradient(135deg, #7e22ce, #4c1d95)',
  'linear-gradient(135deg, #ea580c, #9a3412)',
  'linear-gradient(135deg, #db2777, #9d174d)',
  'linear-gradient(135deg, #dc2626, #7f1d1d)',
  'linear-gradient(135deg, #2563eb, #1e3a8a)',
  'linear-gradient(135deg, #059669, #064e3b)'
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

const handleOpenRenew = (user: User) => {
  selectedUser.value = user;
  activeModal.value = 'renovacion';
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
  toastRef.value?.notify(t('successDeleted'), 'success');
};

const handleRenewSuccess = () => {
  activeModal.value = null;
  toastRef.value?.notify(t('successRenewed'), 'success');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=Oswald:wght@500;600;700&display=swap');

.main-content,
.modal-wrapper {
  --accent: var(--color-highlight, #3b82f6);
  --card-bg: var(--bg-cards, #121416);
  --radius: var(--app-border-radius, 14px);
  --radius-small: 10px;
  --line: color-mix(in srgb, var(--color-texto-general, #94a3b8) 16%, transparent);
  --line-soft: color-mix(in srgb, var(--color-texto-general, #94a3b8) 9%, transparent);
  --muted: color-mix(in srgb, var(--color-texto-general, #94a3b8) 68%, transparent);
}

.main-content *,
.main-content *::before,
.main-content *::after { box-sizing: border-box; }

.main-content {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 34px 36px 55px;
  color: var(--color-texto-general, #e5e7eb);
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* HEADER */
.header-section { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 22px; }
.title-wrapper { min-width: 260px; display: flex; flex-direction: column; gap: 6px; }
.main-title {
  margin: 0;
  color: var(--color-titulos, #ffffff);
  font-family: 'Anton', sans-serif;
  font-size: clamp(1.9rem, 3vw, 2.55rem);
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
.title-underline { display: block; width: 58px; height: 3px; margin-top: 2px; border-radius: 999px; background: linear-gradient(90deg, var(--accent), transparent); }
.main-subtitle { max-width: 580px; margin: 1px 0 0; color: var(--muted); font-size: 0.82rem; font-weight: 500; line-height: 1.5; }

/* BUSCADOR */
.actions-bar { display: flex; align-items: center; justify-content: flex-end; gap: 10px; }
.search-wrapper { position: relative; display: flex; align-items: center; min-width: 250px; }
.search-icon { position: absolute; z-index: 2; left: 14px; color: var(--muted); pointer-events: none; opacity: 0.75; }
.search-input {
  width: 260px; height: 44px; padding: 0 38px 0 40px;
  border: 1px solid var(--line); border-radius: var(--radius-small);
  background: var(--card-bg); color: var(--color-texto-general, #ffffff);
  font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 500; outline: none;
  transition: width 0.2s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}
.search-input::placeholder { color: var(--muted); opacity: 0.68; }
.search-input:hover { border-color: color-mix(in srgb, var(--color-texto-general, #ffffff) 25%, transparent); }
.search-input:focus { width: 290px; border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 16%, transparent); }

.search-clear {
  position: absolute; right: 10px; width: 22px; height: 22px;
  display: flex; align-items: center; justify-content: center;
  border: none; border-radius: 50%;
  background: color-mix(in srgb, var(--color-texto-general, #ffffff) 10%, transparent);
  color: var(--muted); cursor: pointer; transition: background 0.15s ease;
}
.search-clear:hover { background: color-mix(in srgb, var(--color-texto-general, #ffffff) 20%, transparent); }

/* RESUMEN */
.stats-row { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-bottom: 18px; }
.stat-card { position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 3px; padding: 15px 18px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--card-bg); }
.stat-card::before { content: ''; position: absolute; top: 0; bottom: 0; left: 0; width: 3px; background: var(--tone, var(--accent)); }
.stat-total { --tone: var(--accent); }
.stat-orange { --tone: #fbbf24; }
.stat-red { --tone: #f87171; }
.stat-value { color: var(--color-titulos, #ffffff); font-family: 'Oswald', sans-serif; font-size: 1.5rem; font-weight: 600; line-height: 1.15; white-space: nowrap; }
.stat-label { color: var(--muted); font-size: 0.68rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; }

.desktop-only { display: block; }
.mobile-only { display: none; }

/* TABLA */
.table-container { position: relative; width: 100%; overflow: hidden; border: 1px solid var(--line); border-radius: var(--radius); background: var(--card-bg); box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18); }
.table-container::before { content: ''; position: absolute; z-index: 3; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--accent), transparent); opacity: 0.7; pointer-events: none; }
.user-table { width: 100%; border-collapse: collapse; color: var(--color-texto-general, #e5e7eb); text-align: left; }
.user-table thead { background: color-mix(in srgb, var(--card-bg) 95%, var(--color-texto-general, #ffffff)); }
.user-table th { padding: 15px 18px; border-bottom: 1px solid var(--line); color: var(--muted); font-size: 0.68rem; font-weight: 700; letter-spacing: 0.065em; text-transform: uppercase; white-space: nowrap; }
.user-table td { padding: 13px 18px; border-top: 1px solid var(--line-soft); font-size: 0.82rem; vertical-align: middle; }
.user-table tbody tr:first-child td { border-top: none; }
.user-table tbody tr { transition: background 0.17s ease, box-shadow 0.17s ease; }

@media (hover: hover) {
  .user-table tbody tr:hover { background: color-mix(in srgb, var(--accent) 5%, transparent); box-shadow: inset 3px 0 0 color-mix(in srgb, var(--accent) 80%, transparent); }
}

.table-footer { padding: 11px 18px; border-top: 1px solid var(--line-soft); color: var(--muted); font-size: 0.72rem; font-weight: 500; text-align: right; }

/* AVATAR / TEXTO */
.avatar-small {
  width: 41px; height: 41px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.14); border-radius: 11px; color: #ffffff;
  font-size: 0.74rem; font-weight: 700; letter-spacing: 0.02em;
  box-shadow: 0 5px 14px rgba(0, 0, 0, 0.24);
}
.text-bold { color: var(--color-titulos, #ffffff); font-weight: 600; }
.text-muted { color: var(--muted); }

.type-chip {
  display: inline-flex; align-items: center; min-height: 26px; padding: 3px 10px;
  border: 1px solid var(--line); border-radius: 8px;
  background: color-mix(in srgb, var(--color-texto-general, #ffffff) 4%, transparent);
  color: var(--color-texto-general, #e5e7eb); font-size: 0.7rem; font-weight: 600; white-space: nowrap;
}

/* ADEUDOS */
.status-badge { width: fit-content; min-height: 27px; display: inline-flex; align-items: center; gap: 7px; padding: 4px 11px; border: 1px solid transparent; border-radius: 999px; font-size: 0.72rem; font-weight: 700; white-space: nowrap; }
.status-badge::before { content: ''; width: 6px; height: 6px; flex-shrink: 0; border-radius: 50%; background: currentColor; box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 14%, transparent); }
.debt-pending { color: #fbbf24; border-color: rgba(251, 191, 36, 0.25); background: rgba(251, 191, 36, 0.08); }
.debt-inactive { color: #f87171; border-color: rgba(248, 113, 113, 0.25); background: rgba(248, 113, 113, 0.08); }
.debt-default { color: #34d399; border-color: rgba(52, 211, 153, 0.25); background: rgba(52, 211, 153, 0.08); }

.badges-row { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }

/* ACCIONES */
.actions-cell { display: flex; align-items: center; gap: 7px; }
.icon-btn {
  width: 37px; height: 37px; display: inline-flex; align-items: center; justify-content: center; padding: 0;
  border: 1px solid var(--line); border-radius: 9px;
  background: color-mix(in srgb, var(--color-texto-general, #ffffff) 2.5%, transparent);
  color: var(--muted); cursor: pointer;
  transition: color 0.18s ease, background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
}
.icon-btn svg { width: 17px; height: 17px; }
.icon-btn:not(.delete-icon-btn):hover { color: #60a5fa; border-color: rgba(59, 130, 246, 0.42); background: rgba(59, 130, 246, 0.1); box-shadow: 0 5px 13px rgba(59, 130, 246, 0.08); transform: translateY(-1px); }
.delete-icon-btn:hover { color: #f87171; border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.09); box-shadow: 0 5px 13px rgba(239, 68, 68, 0.08); transform: translateY(-1px); }
.icon-btn:active { transform: translateY(0); }

/* EMPTY */
.empty-state-cell { padding: 0 !important; border-top: none !important; }
.empty-state, .empty-state-mobile { min-height: 260px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 45px 20px; color: var(--muted); font-size: 0.82rem; font-weight: 500; text-align: center; }
.empty-state svg, .empty-state-mobile svg { opacity: 0.4; }

/* DATOS TARJETA */
.card-meta { display: flex; flex-direction: column; gap: 7px; color: var(--muted); font-size: 0.78rem; }
.meta-row { min-width: 0; display: flex; align-items: center; gap: 7px; }
.meta-row svg { flex-shrink: 0; opacity: 0.65; }
.email-text { overflow-wrap: anywhere; color: #93c5fd; }
.expiration-warning, .vence-label { color: #fb923c; }
.expiration-warning { font-weight: 500; }
.vence-label { font-weight: 600; }
.phone-text { color: var(--muted); }

/* MODALES (sin backdrop-filter para evitar artefactos al hacer scroll) */
.modal-wrapper { position: fixed; z-index: 9999; inset: 0; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(0, 0, 0, 0.78); }
.modal-body-custom { padding: 10px 5px; color: var(--color-texto-general, #ffffff); text-align: center; }
.modal-icon-container { width: 54px; height: 54px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; border-radius: 15px; }
.danger-bg { border: 1px solid rgba(248, 113, 113, 0.2); background: rgba(248, 113, 113, 0.08); }
.modal-body-custom h2 { margin: 0 0 9px; color: var(--color-titulos, #ffffff); font-family: 'Oswald', sans-serif; font-size: 1.25rem; font-weight: 600; }
.modal-body-custom p { margin: 0 0 22px; color: var(--muted); font-size: 0.8rem; line-height: 1.6; }
.highlight-name { color: var(--color-titulos, #ffffff); font-weight: 700; }
.modal-buttons { display: flex; gap: 10px; }
.btn-modal { min-height: 42px; flex: 1; padding: 0 16px; border-radius: 10px; font-family: 'Inter', sans-serif; font-size: 0.78rem; font-weight: 650; cursor: pointer; transition: background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease; }
.btn-modal.secondary { border: 1px solid var(--line); background: color-mix(in srgb, var(--color-texto-general, #ffffff) 4%, transparent); color: var(--color-texto-general, #d1d5db); }
.btn-modal.secondary:hover { background: color-mix(in srgb, var(--color-texto-general, #ffffff) 8%, transparent); transform: translateY(-1px); }
.btn-modal.danger { border: 1px solid rgba(239, 68, 68, 0.75); background: #dc2626; color: #ffffff; }
.btn-modal.danger:hover { background: #ef4444; box-shadow: 0 6px 16px rgba(239, 68, 68, 0.2); transform: translateY(-1px); }

:deep(.notification-container),
:deep(.toast-container) {
  width: calc(100% - 32px) !important; max-width: 480px !important; box-sizing: border-box !important;
  left: 50% !important; right: auto !important; margin: 0 auto !important; transform: translateX(-50%) !important;
}

.pop-enter-active, .pop-leave-active { transition: opacity 0.2s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; }

.search-input:focus-visible, .icon-btn:focus-visible, .action-chip:focus-visible,
.btn-modal:focus-visible, .search-clear:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

/* TABLET */
@media (max-width: 1100px) {
  .main-content { padding: 30px 24px 48px; }
  .header-section { align-items: flex-start; flex-direction: column; gap: 17px; }
  .actions-bar { width: 100%; }
  .search-wrapper { width: 100%; }
  .search-input, .search-input:focus { width: 100%; }
}

/* MÓVIL */
@media (max-width: 900px) {
  .desktop-only { display: none !important; }
  .mobile-only { display: block !important; }
  .main-content { width: 100%; max-width: 100%; padding: 20px 14px 36px; overflow-x: hidden; }
  .header-section { width: 100%; align-items: stretch; margin-bottom: 16px; }
  .title-wrapper { width: 100%; min-width: 0; }
  .main-title { font-size: 1.85rem; }
  .main-subtitle { max-width: 100%; font-size: 0.76rem; }
  .actions-bar { width: 100%; }
  .search-wrapper { width: 100%; min-width: 0; }
  .search-input, .search-input:focus { width: 100%; max-width: 100%; }

  .stats-row { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; margin-bottom: 14px; }
  .stat-card { padding: 12px 14px; }
  .stat-value { font-size: 1.2rem; }

  .user-card { position: relative; width: 100%; overflow: hidden; margin-bottom: 11px; padding: 16px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--card-bg); box-shadow: 0 9px 28px rgba(0, 0, 0, 0.17); }
  .user-card::before { content: ''; position: absolute; top: 0; bottom: 0; left: 0; width: 3px; background: var(--accent); }
  .user-card.card-debt-pending::before { background: #fbbf24; }
  .user-card.card-debt-inactive::before { background: #f87171; }
  .user-card.card-debt-default::before { background: #34d399; }
  .card-top-section { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 13px; }
  .user-card .avatar-small { width: 44px; height: 44px; border-radius: 12px; font-size: 0.78rem; }
  .card-user-titles { min-width: 0; display: flex; flex: 1; flex-direction: column; align-items: flex-start; gap: 7px; }
  .name-text { width: 100%; overflow: hidden; color: var(--color-titulos, #ffffff); font-size: 0.88rem; font-weight: 600; line-height: 1.3; text-overflow: ellipsis; white-space: nowrap; }
  .card-meta { display: grid; gap: 8px; margin-bottom: 13px; padding: 11px 12px; border: 1px solid var(--line-soft); border-radius: 11px; background: color-mix(in srgb, var(--color-texto-general, #ffffff) 2%, transparent); font-size: 0.75rem; }
  .email-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .card-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; padding-top: 12px; border-top: 1px solid var(--line-soft); }
  .action-chip {
    min-width: 0; min-height: 40px; display: flex; align-items: center; justify-content: center; gap: 7px; padding: 8px 10px;
    border: 1px solid var(--line); border-radius: 9px; font-family: 'Inter', sans-serif; font-size: 0.75rem; font-weight: 600; cursor: pointer;
    transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease, transform 0.18s ease;
  }
  .action-chip svg { flex-shrink: 0; }
  .btn-renew-chip { color: #60a5fa; border-color: rgba(59, 130, 246, 0.2); background: rgba(59, 130, 246, 0.06); }
  .btn-renew-chip:hover { color: #93c5fd; border-color: rgba(59, 130, 246, 0.4); background: rgba(59, 130, 246, 0.12); transform: translateY(-1px); }
  .btn-delete-chip { color: #f87171; border-color: rgba(239, 68, 68, 0.18); background: rgba(239, 68, 68, 0.05); }
  .btn-delete-chip:hover { color: #fca5a5; border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.11); transform: translateY(-1px); }

  .empty-state-mobile { min-height: 240px; margin-top: 8px; border: 1px dashed var(--line); border-radius: var(--radius); background: var(--card-bg); }
}

/* TELÉFONOS */
@media (max-width: 560px) {
  .main-content { padding: 17px 11px 30px; }
  .main-title { font-size: 1.7rem; }
  .user-card { padding: 15px; }
}

@media (max-width: 380px) {
  .main-content { padding-left: 9px; padding-right: 9px; }
  .main-title { font-size: 1.55rem; }
  .stat-value { font-size: 1.05rem; }
  .card-actions { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .search-input, .user-table tbody tr, .icon-btn, .action-chip, .btn-modal,
  .pop-enter-active, .pop-leave-active { transition: none !important; }
}
</style>