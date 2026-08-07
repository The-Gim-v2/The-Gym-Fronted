<template>
  <HeadingOwner>
    <NotificationSystem ref="toastRef" />
    <main class="main-content">
      <header class="header-section">
        <h1 class="main-title">{{ t('incomesTitle') }}</h1>
      
        <div class="actions-bar" id="tutorial-step-0">
            <select class="status-select" v-model="selectedMembership">
                <option value="">{{ t('membershipAll') }}</option>
                <option value="Mensual">{{ t('monthly') }}</option>
                <option value="Quincenal">{{ t('fortnightly') }}</option>
            </select>
            <button class="btn-bulk" @click="activeModal = 'ganancias'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
                <div class="btn-text-wrapper">
                    <span class="btn-label">{{ t('totalIncomes') }}</span>
                    <span class="highlight-text-custom">{{ formatCurrency(totalIncome) }}</span>
                </div>
            </button>
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
              <th>{{ t('colMembership') }}</th>
              <th>{{ t('colAmount') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in filteredUsers" :key="user.id">
              <td><div class="avatar-small"></div></td>
              <td class="text-bold">{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.expirationDate }}</td>
              <td><span :class="['status-badge2', getMembershipClass(user.membership)]">{{ user.membership }}</span></td>
              <td><span class="status-badge">{{ user.amount }}</span></td>
              <td class="actions-cell"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- VISTA MÓVIL REESTRUCTURADA -->
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
              <div class="badges-row">
                <span :class="['status-badge2', getMembershipClass(user.membership)]">{{ user.membership }}</span>
                <span class="status-badge">{{ user.amount }}</span>
              </div>
            </div>
          </div>
          
          <div class="card-meta">
            <span class="email-text">{{ user.email }}</span>
            <span class="expiration-warning"><span class="vence-label">{{ t('expiresLabel') }}:</span> {{ user.expirationDate }}</span>
            <span class="phone-text">{{ user.phone }}</span>
          </div>
        </div>
      </div>

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
            <button class="btn-modal danger">{{ t('confirmBtn') }}</button>
          </div>
        </div>
      </ModalComponent>

    </main>
      <transition name="pop">
      <div v-if="activeModal === 'ganancias'" class="modal-wrapper" @click.self="activeModal = null">
        <Ganancias @close="activeModal = null" />
      </div>
    </transition>  
  </HeadingOwner>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import HeadingOwner from '../HeadingOwner.vue';
import ModalComponent from '../../Modals/ModalComponent.vue';
import Ganancias from '../Componets/Earnings.vue';
import NotificationSystem from '../../Modals/NotificationSystem.vue'; 

interface User {
  id: number;
  name: string;
  email: string;
  expirationDate: string;
  membership: string;
  amount: string;
  mensualidad: string;
  phone: string;
}

const activeModal = ref<string | null>(null);
const router = useRouter();
const showDelete = ref<boolean>(false);
const selectedUser = ref<User | null>(null);
const selectedMembership = ref<string>(''); 
const searchQuery = ref<string>('');
const toastRef = ref<any>(null);

// Sistema de Idiomas
const currentLang = ref<string>(localStorage.getItem('app-idioma') || 'es');
const handleLangChange = (e: Event): void => {
  const customEvent = e as CustomEvent<{ idioma?: string }>;
  if (customEvent.detail?.idioma) currentLang.value = customEvent.detail.idioma;
};

const langData: Record<'es' | 'en', Record<string, string>> = {
  es: {
    incomesTitle: 'Ingresos',
    membershipAll: 'Mensualidad (Todas)',
    monthly: 'Mensual',
    fortnightly: 'Quincenal',
    totalIncomes: 'Ingresos Totales',
    searchPlaceholder: 'Buscar usuario...',
    colPhoto: 'Foto',
    colName: 'Nombre',
    colEmail: 'Correo',
    colExpiration: 'Fecha a Vencer',
    colMembership: 'Membresia',
    colAmount: 'Monto',
    expiresLabel: 'Vence',
    deleteTitle: '¿Eliminar usuario?',
    deleteMsgPre: '¿Deseas eliminar a',
    deleteMsgPost: 'temporalmente?',
    cancelBtn: 'Cancelar',
    confirmBtn: 'Confirmar'
  },
  en: {
    incomesTitle: 'Incomes',
    membershipAll: 'Membership (All)',
    monthly: 'Monthly',
    fortnightly: 'Fortnightly',
    totalIncomes: 'Total Incomes',
    searchPlaceholder: 'Search user...',
    colPhoto: 'Photo',
    colName: 'Name',
    colEmail: 'Email',
    colExpiration: 'Expiration Date',
    colMembership: 'Membership',
    colAmount: 'Amount',
    expiresLabel: 'Expires',
    deleteTitle: 'Delete user?',
    deleteMsgPre: 'Do you want to temporarily delete',
    deleteMsgPost: '?',
    cancelBtn: 'Cancel',
    confirmBtn: 'Confirm'
  }
};

const t = (key: string): string => {
  const langKey = (currentLang.value === 'en' ? 'en' : 'es') as 'es' | 'en';
  return langData[langKey][key] || langData.es[key] || key;
};

// Detectar pantalla móvil de manera reactiva para evitar duplicidad de IDs en el DOM
const isMobile = ref<boolean>(window.innerWidth <= 900);
const updateWidth = (): void => {
  isMobile.value = window.innerWidth <= 900;
};

onMounted(() => {
  window.addEventListener('idioma-changed', handleLangChange as EventListener);
  window.addEventListener('resize', updateWidth);
});

onUnmounted(() => {
  window.removeEventListener('idioma-changed', handleLangChange as EventListener);
  window.removeEventListener('resize', updateWidth);
});

const users = ref<User[]>([
  { id: 1, name: 'Jesus Luis Ramires Sanchez', email: 'jesusluis@gmail.com', expirationDate: '18/03/2026', membership: '1 Mes', amount: '$ 900.00', mensualidad: 'Mensual', phone: '+52 481 123 4321' },
  { id: 2, name: 'Maria Luis Ramires Sanchez', email: 'jesusluis@gmail.com', expirationDate: '18/03/2026', membership: '2 Meses', amount: '$ 500.00', mensualidad: 'Quincenal', phone: '+52 481 123 4321' },
  { id: 3, name: 'Erick Luis Ramires Sanchez', email: 'jesusluis@gmail.com', expirationDate: '18/03/2026', membership: '4 Meses', amount: '$ 500.00', mensualidad: 'Mensual', phone: '+52 481 123 4321' },
  { id: 4, name: 'Luis Luis Ramires Sanchez', email: 'jesusluis@gmail.com', expirationDate: '18/03/2026', membership: '6 Meses', amount: '$ 800.00', mensualidad: 'Quincenal', phone: '+52 481 123 4321' },
  { id: 5, name: 'Fernando Luis Ramires Sanchez', email: 'jesusluis@gmail.com', expirationDate: '18/03/2026', membership: '2 Meses', amount: '$ 500.00', mensualidad: 'Mensual', phone: '+52 481 123 4321' },
  { id: 6, name: 'Mario Luis Ramires Sanchez', email: 'jesusluis@gmail.com', expirationDate: '18/03/2026', membership: '3 Meses', amount: '$ 500.00', mensualidad: 'Quincenal', phone: '+52 481 123 4321' },
  { id: 7, name: 'Jorge Luis Ramires Sanchez', email: 'jesusluis@gmail.com', expirationDate: '18/03/2026', membership: '5 Meses', amount: '$ 500.00', mensualidad: 'Mensual', phone: '+52 481 123 4321' },
  { id: 8, name: 'Francisco Luis Ramires Sanchez', email: 'jesusluis@gmail.com', expirationDate: '18/03/2026', membership: '1 Mes', amount: '$ 500.00', mensualidad: 'Quincenal', phone: '+52 481 123 4321' }
]);

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchMembership = selectedMembership.value ? user.mensualidad === selectedMembership.value : true;
    
    const term = searchQuery.value.toLowerCase();
    const matchSearch = 
      user.name.toLowerCase().includes(term) || 
      user.email.toLowerCase().includes(term) ||
      user.membership.toLowerCase().includes(term) ||
      user.amount.toLowerCase().includes(term) ||
      user.mensualidad.toLowerCase().includes(term) || 
      user.phone.toLowerCase().includes(term) ||
      user.expirationDate.toLowerCase().includes(term) ||
      user.id.toString().includes(term);
    
    return matchMembership && matchSearch;
  });
});

const totalIncome = computed(() => {
  return filteredUsers.value.reduce((sum, user) => {
    const amountValue = parseFloat(user.amount.replace(/[^0-9.]/g, '')) || 0;
    return sum + amountValue;
  }, 0);
});

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value);
};

const getMembershipClass = (membership: string): string => {
  const classes: Record<string, string> = {
    '1 Mes': 'membership-red',
    '2 Meses': 'membership-blue',
    '3 Meses': 'membership-green',
    '4 Meses': 'membership-purple',
    '5 Meses': 'membership-orange',
    '6 Meses': 'membership-pink'
  };
  return classes[membership] || 'membership-default';
};
</script>

<style scoped>
.main-content { padding: 30px 40px; max-width: 1400px; margin: 0 auto; color: var(--color-texto-general, #e5e5e5); }
.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; flex-wrap: wrap; gap: 20px; }
.main-title { font-family: 'Anton', sans-serif; font-size: 2rem; color: var(--color-titulos, #fff); margin: 0; letter-spacing: 0.5px; }

.modal-wrapper {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.actions-bar { display: flex; gap: 15px; align-items: center; flex-wrap: wrap; }

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

/* Select de días unificado */
.status-select {
  background: var(--bg-cards, #141414); 
  border: 1.5px solid var(--border-input, #2a2a2e);
  padding: 10px 14px;
  border-radius: var(--app-border-radius, 10px);
  color: var(--color-texto-input, var(--color-texto-general, #fff));
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s, color 0.2s;
}
.status-select:focus { 
  border-color: var(--color-highlight, #3b82f6); 
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.btn-bulk {
  background: var(--bg-cards, #141414);
  border: 1px solid rgba(255, 255, 255, 0.09); 
  padding: 10px 16px;
  border-radius: var(--app-border-radius, 10px);
  color: var(--color-texto-general, #fff); 
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  white-space: nowrap;
  font-size: 0.9rem;
  transition: background 0.2s, border-color 0.2s;
}
.btn-bulk:hover { background: rgba(255, 255, 255, 0.05); border-color: var(--color-highlight, #444); }
.btn-bulk svg { color: var(--color-highlight, #3b82f6); }

.badges-row {
    display: flex;
    gap: 8px;
    margin: 6px 0 0 0;
    flex-wrap: wrap;
    align-items: center;
}

.card-meta { 
    font-size: 0.85rem; 
    color: var(--color-texto-secundario, #888); 
    line-height: 1.4;
    display: flex;
    flex-direction: column;
    gap: 4px;
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

.membership-purple { background: rgba(126, 34, 206, 0.2); color: #c084fc; border-color: #6b21a8; }
.membership-orange { background: rgba(194, 65, 12, 0.2); color: #fb923c; border-color: #9a3412; }
.membership-pink   { background: rgba(190, 24, 93, 0.2); color: #f472b6; border-color: #9d174d; }
.membership-red    { background: rgba(153, 27, 27, 0.2); color: #f87171; border-color: #7f1d1d; }
.membership-blue   { background: rgba(30, 64, 175, 0.2); color: #60a5fa; border-color: #1e3a8a; }
.membership-green  { background: rgba(6, 78, 59, 0.2); color: #34d399; border-color: #064e3b; }
.membership-default { background: var(--bg-input, #333); color: var(--color-texto-general, #fff); border-color: var(--border-input, #555); }

.desktop-only { display: block; }
.mobile-only { display: none; }

.phone-text { color: var(--color-texto-secundario, #888); }


.btn-text-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.1;
}

.btn-label { 
    font-size: 0.65rem; 
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--color-texto-secundario, #888); 
    font-weight: 600; 
}

.highlight-text-custom { 
    font-size: 0.95rem; 
    font-weight: 700; 
    color: var(--color-highlight, #588ef2); 
}

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

  .status-select { 
    width: 100%; 
    order: 0;
  }    
  .btn-bulk { 
    width: 100%;
    order: 1;
    justify-content: center;
    padding: 12px;
  }
    
  .btn-text-wrapper {
      align-items: center;
  }

  .name-text {
    font-size: 0.95rem;
    line-height: 1.25;
    color: var(--color-titulos, #fff);
    font-weight: 600;
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
    gap: 4px;
    flex: 1;
    min-width: 0;
  }
}

.table-container { background: var(--bg-cards, #111); border-radius: var(--app-border-radius, 14px); border: 1px solid var(--border-cards, #222); overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
.user-table { width: 100%; border-collapse: collapse; color: var(--color-texto-general, #e5e5e5); text-align: left; }
.user-table th { padding: 16px 20px; background: var(--bg-cards, #161616); font-family: 'Oswald', sans-serif; font-size: 0.85rem; text-transform: uppercase; color: var(--color-texto-secundario, #888); letter-spacing: 0.5px; border-bottom: 1px solid var(--border-line, #222); }
.user-table td { padding: 16px 20px; border-top: 1px solid var(--border-line, #1a1a1a); font-size: 0.92rem; vertical-align: middle; }
.user-table tr:hover { background: rgba(255, 255, 255, 0.015); }

.actions-cell { display: flex; gap: 12px; }
.avatar-small { width: 40px; height: 40px; background: var(--bg-input, #262626); color: var(--color-texto-general, #bbb); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; border: 1px solid var(--border-input, #333); }

.status-badge { 
    background: rgba(6, 78, 59, 0.3); 
    color: #34d399; 
    padding: 3px 10px; 
    border-radius: 20px; 
    font-size: 0.75rem; 
    border: 1px solid rgba(6, 78, 59, 0.6);
    font-weight: 600;
    display: inline-block;
}

.status-badge2 { 
    padding: 3px 10px; 
    border-radius: 20px; 
    font-size: 0.75rem; 
    border: 1px solid;
    font-weight: 600;
    display: inline-block;
}

.text-bold { font-weight: 600; color: var(--color-titulos, #fff); }

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
