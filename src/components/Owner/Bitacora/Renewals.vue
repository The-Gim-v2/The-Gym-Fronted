<template>
  <HeadingOwner>
    <main class="main-content">
      <header class="header-section">
        <div class="title-wrapper">
          <h1 class="main-title">{{ t('renewalsTitle') }}</h1>
          <p class="main-subtitle">{{ t('renewalsSubtitle') }}</p>
        </div>
      
        <div class="actions-bar" id="tutorial-step-0">
            <input type="text" class="search-input" :placeholder="t('searchPlaceholder')" v-model="searchQuery">
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
              <td><div class="avatar-small"></div></td>
              <td class="text-bold">{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.expiredDate }}</td>
              <td><span class="status-badge" :class="getDebtClass(user.status)">{{ user.debt }}</span></td>
              <td class="actions-cell" :id="!isMobile && index === 0 ? 'tutorial-step-2' : undefined">
                <button class="icon-btn" :title="t('renewBtn')" @click="activeModal = 'renovacion'; selectedUser = user"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.5 4a3.5 3.5 0 1 0 5 0m-5 0V3m5 6l-5-5-5 5"/></svg></button>
                <button class="icon-btn delete-icon-btn" :title="t('deleteBtn')" @click="confirmDelete(user)"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
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
          :id="isMobile && index === 0 ? 'tutorial-step-1' : undefined"
        >
          <div class="card-top-section">
            <div class="avatar-small"></div>
            <div class="card-user-titles">
              <div class="text-bold name-text">{{ user.name }}</div>
              <span class="status-badge" :class="getDebtClass(user.status)">{{ user.debt }}</span>
            </div>
          </div>
          
          <div class="card-meta">
            <span class="email-text">{{ user.email }}</span>
            <span class="expiration-warning"><span class="vence-label">{{ t('expiresLabel') }}:</span> {{ user.expiredDate }}</span>
            <span class="phone-text">{{ user.phone }}</span>
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
.main-content { padding: 30px 40px; max-width: 1400px; margin: 0 auto; color: var(--color-texto-general, #e5e5e5); }
.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; flex-wrap: wrap; gap: 20px; }

.title-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.main-title { font-family: 'Anton', sans-serif; font-size: 2rem; color: var(--color-titulos, #fff); margin: 0; letter-spacing: 0.5px; }
.main-subtitle { font-size: 0.88rem; color: var(--color-texto-secundario, #888); margin: 0; }

.actions-bar { display: flex; gap: 15px; align-items: center; }
.search-input, .status-select { 
  background: var(--bg-cards, #141414); 
  border: 1px solid rgba(255, 255, 255, 0.09); 
  padding: 10px 14px; 
  border-radius: var(--app-border-radius, 10px); 
  color: var(--color-texto-general, #fff); 
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}
.search-input { width: 220px; }
.search-input:focus, .status-select:focus { border-color: var(--color-highlight, #3b82f6); }

.desktop-only { display: block; }
.mobile-only { display: none; }

.debt-pending { color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); background: rgba(245, 158, 11, 0.08); }
.debt-inactive { color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.08); }
.debt-default { color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.3); background: rgba(34, 197, 94, 0.08); }

@media (max-width: 900px) {
  .desktop-only { display: none; }
  .mobile-only { display: block; }
  .main-content { padding: 20px 15px; }
  .header-section { flex-direction: column; align-items: stretch; gap: 15px; }

  .actions-bar { 
    display: flex; 
    flex-direction: column;
    gap: 10px; 
    width: 100%; 
  }
  .search-input { 
    order: -1; 
    width: 100%; 
  }

  .user-card {
    background: var(--bg-cards, #141416);
    padding: 16px;
    border-radius: var(--app-border-radius, 14px);
    border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.08));
    margin-bottom: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  }

  .card-top-section {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
  }

  .avatar-small {
    width: 44px;
    height: 44px;
    background: var(--bg-input, #26262b);
    border-radius: 50%;
    border: 1px solid var(--border-input, #333);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9rem;
    color: var(--color-texto-general, #bbb);
    flex-shrink: 0;
  }

  .card-user-titles {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    flex: 1;
    min-width: 0;
  }

  .name-text {
    font-size: 0.95rem;
    line-height: 1.25;
    color: var(--color-titulos, #fff);
    font-weight: 600;
  }

  .status-badge {
    font-size: 0.75rem;
    padding: 3px 10px;
    border-radius: 20px;
    font-weight: 600;
    display: inline-block;
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
    color: var(--color-highlight, #94a3b8);
  }

  .expiration-warning {
    color: #fb923c;
    font-weight: 500;
  }
  
  .vence-label {
    color: #fb923c;
  }

  .phone-text {
    color: var(--color-texto-secundario, #888);
  }

  .card-actions {
    position: relative;
    border-top: 1px dashed rgba(255, 255, 255, 0.12);
    padding-top: 12px;
    display: flex;
    gap: 10px;
  }

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

  .action-chip:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }

  .btn-renew-chip {
    color: #38bdf8;
  }

  .btn-renew-chip:hover {
    background: rgba(56, 189, 248, 0.1);
    border-color: rgba(56, 189, 248, 0.3);
  }

  .btn-delete-chip {
    color: #f87171;
  }

  .btn-delete-chip:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.3);
  }
}

.table-container { background: var(--bg-cards, #111); border-radius: var(--app-border-radius, 14px); border: 1px solid var(--border-cards, #222); overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
.user-table { width: 100%; border-collapse: collapse; color: var(--color-texto-general, #e5e5e5); text-align: left; }
.user-table th { padding: 16px 20px; background: var(--bg-cards, #161616); font-family: 'Oswald', sans-serif; font-size: 0.85rem; text-transform: uppercase; color: var(--color-texto-secundario, #888); letter-spacing: 0.5px; border-bottom: 1px solid var(--border-line, #222); }
.user-table td { padding: 16px 20px; border-top: 1px solid var(--border-line, #1a1a1a); font-size: 0.92rem; vertical-align: middle; }
.user-table tr:hover { background: rgba(255, 255, 255, 0.015); }

.actions-cell { display: flex; gap: 12px; }
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
  transition: all 0.2s ease;
}
.icon-btn:hover { background: rgba(255, 255, 255, 0.08); color: #fff; border-color: var(--color-highlight, #444); transform: translateY(-1px); }
.delete-icon-btn:hover { color: #ef4444; border-color: rgba(239, 68, 68, 0.4); }

.avatar-small { width: 40px; height: 40px; background: var(--bg-input, #262626); color: var(--color-texto-general, #bbb); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; border: 1px solid var(--border-input, #333); }

.text-bold { font-weight: 600; color: var(--color-titulos, #fff); }

.status-badge { 
    padding: 4px 10px; 
    border-radius: 20px; 
    font-size: 0.82rem; 
    font-weight: 600;
    border: 1px solid transparent;
    display: inline-block;
}

/* Clases para el modal envolvente con la transición pop */
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

.pop-enter-active, .pop-leave-active {
  transition: all 0.25s ease;
}
.pop-enter-from, .pop-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Modales personalizados */
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