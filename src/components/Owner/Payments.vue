<template>
  <HeadingOwner>
    <NotificationSystem ref="toastRef" />
    <main class="main-content">
      <header class="header-section">
        <div class="title-wrapper">
          <h1 class="main-title">Pagos</h1>
          <!--<p class="main-subtitle">Control y registro de pagos, membresías y estados de cuenta</p>-->
        </div>
      
        <div class="actions-bar" id="tutorial-step-0">
            <select class="status-select" v-model="selectedMembership">
                <option value="">Mensualidad (Todas)</option>
                <option value="Mensual">Mensual</option>
                <option value="Quincenal">Quincenal</option>
            </select>
            <select class="status-select" v-model="selectedStatus">
                <option value="">Status (Todos)</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Próximo a vencer">Próximo a vencer</option>
            </select>
            <button class="btn-bulk" @click="activeModal = 'enviomasivo'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              Correo Masivo
            </button>
            <input type="text" class="search-input" placeholder="Buscar usuario..." v-model="searchQuery">
        </div>
      </header>

      <!-- VISTA ESCRITORIO -->
      <div v-if="!isMobile" class="table-container desktop-only" id="tutorial-step-1">
        <table class="user-table">
          <thead>
            <tr><th>Foto</th><th>Nombre</th><th>Correo</th><th>Fecha a Vencer</th><th>Status</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in filteredUsers" :key="user.id">
              <td><div class="avatar-small"></div></td>
              <td class="text-bold">{{user.name}}</td>
              <td>{{user.email}}</td>
              <td>{{user.expirationDate}}</td>
              <td><span :class="['status-badge', getStatusClass(user.status)]">{{ user.status }}</span></td>
              
                <td class="actions-cell" :id="index === 0 ? 'tutorial-step-2' : null">
                <button class="icon-btn" title="Pago" @click="goToPayments(user.id)">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"/><circle cx="12" cy="12" r="3"/><path d="M12 9v6M10.5 10.5h3M10.5 13.5h3"/><path d="M6 3h14c1.1 0 2 .9 2 2v10"/></svg>
                </button>
                <button class="icon-btn" title="Editar" @click="goToEdit(user.id)">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="icon-btn" title="Eliminar" @click="confirmDelete(user)">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- VISTA MÓVIL -->
      <div class="mobile-only">
       <div v-for="(user, index) in filteredUsers" :key="user.id" class="user-card" :id="index === 0 ? 'tutorial-step-1' : null">
          <div class="card-top-section">
            <div class="avatar-small"></div>
            <div class="card-user-titles">
              <div class="text-bold name-text">{{ user.name }}</div>
              <div class="badges-row">
                <span class="status-badge" :class="getStatusClass(user.status)">{{ user.status }}</span>
                <span class="membership-badge">{{ user.mensualidad }}</span>
              </div>
            </div>
          </div>
          
          <div class="card-meta">
            <span class="email-text">{{ user.email }}</span>
            <span class="expiration-warning"><span class="vence-label">Vence:</span> {{ user.expirationDate }}</span>
            <span class="phone-text">{{ user.phone }}</span>
          </div>

          <div class="card-actions" :id="index === 0 ? 'tutorial-step-2' : null">
            <button class="action-chip btn-pay-chip" @click="goToPayments(user.id)">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"/><circle cx="12" cy="12" r="3"/><path d="M12 9v6M10.5 10.5h3M10.5 13.5h3"/><path d="M6 3h14c1.1 0 2 .9 2 2v10"/></svg>
              <span>Pago</span>
            </button>
            <button class="action-chip btn-edit-chip" @click="goToEdit(user.id)">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              <span>Editar</span>
            </button>
            <button class="action-chip btn-delete-chip" @click="confirmDelete(user)">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              <span>Eliminar</span>
            </button>
          </div>
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
              <h2>¿DESEA ELIMINARLO?</h2>
              <p>¿Deseas eliminar a <span class="highlight-name">{{ selectedUser?.name }}</span> temporalmente?</p>
              <div class="modal-buttons">
                <button class="btn-modal secondary" @click="showDelete = false">Cancelar</button>
                <button class="btn-modal danger" @click="executeDelete">Confirmar</button>
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
  </HeadingOwner>
</template>

<style scoped>
.main-content { padding: 30px 40px; max-width: 1400px; margin: 0 auto; color: var(--color-texto-general, #e5e5e5); }
.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; flex-wrap: wrap; gap: 20px; }

.title-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.main-title { font-family: 'Anton', sans-serif; font-size: 2rem; color: var(--color-titulos, #fff); margin: 0; letter-spacing: 0.5px; }
.main-subtitle { font-size: 0.88rem; color: var(--color-texto-general, #888); margin: 0; opacity: 0.8; }

.actions-bar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
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
    padding: 4px 10px; 
    border-radius: 20px; 
    font-size: 0.82rem; 
    font-weight: 600;
    border: 1px solid transparent;
    display: inline-block;
}

.membership-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
  background: rgba(56, 189, 248, 0.08);
  display: inline-block;
}

.status-green { color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.3); background: rgba(34, 197, 94, 0.08); }
.status-red { color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.08); }
.status-orange { color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); background: rgba(245, 158, 11, 0.08); }
.status-yellow { color: #eab308; border: 1px solid rgba(234, 179, 8, 0.3); background: rgba(234, 179, 8, 0.08); }
.status-default { color: #ccc; border: 1px solid #444; background: #222; }

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
  .search-input, .status-select, .btn-bulk { 
    width: 100%; 
  }
  .search-input { order: -1; }

  .user-card {
    background: var(--bg-cards, #141416);
    padding: 16px;
    border-radius: var(--app-border-radius, 14px);
    border: 1px solid rgba(255, 255, 255, 0.09);
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
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.1);
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

  .badges-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
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

  .expiration-warning {
    color: #fb923c;
    font-weight: 500;
  }
  
  .vence-label {
    color: #fb923c;
  }

  .phone-text {
    color: var(--color-texto-general, #888);
    opacity: 0.7;
  }

  .card-actions {
    border-top: 1px dashed rgba(255, 255, 255, 0.12);
    padding-top: 12px;
    display: flex;
    gap: 8px;
  }

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

  .action-chip:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }

  .btn-pay-chip { color: #38bdf8; }
  .btn-pay-chip:hover { background: rgba(56, 189, 248, 0.1); border-color: rgba(56, 189, 248, 0.3); }

  .btn-edit-chip { color: #fbbf24; }
  .btn-edit-chip:hover { background: rgba(251, 191, 36, 0.1); border-color: rgba(251, 191, 36, 0.3); }

  .btn-delete-chip { color: #f87171; }
  .btn-delete-chip:hover { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); }
}

.table-container { 
  background: var(--bg-cards, #111); 
  border-radius: var(--app-border-radius, 14px); 
  border: 1px solid rgba(255, 255, 255, 0.09); 
  overflow: hidden; 
  box-shadow: 0 4px 20px rgba(0,0,0,0.4); 
}
.user-table { width: 100%; border-collapse: collapse; color: var(--color-texto-general, #e5e5e5); text-align: left; }
.user-table th { padding: 16px 20px; background: rgba(255, 255, 255, 0.02); font-family: 'Oswald', sans-serif; font-size: 0.85rem; text-transform: uppercase; color: var(--color-texto-general, #888); letter-spacing: 0.5px; border-bottom: 1px solid rgba(255, 255, 255, 0.09); }
.user-table td { padding: 16px 20px; border-top: 1px solid rgba(255, 255, 255, 0.05); font-size: 0.92rem; vertical-align: middle; }
.user-table tr:hover { background: rgba(255, 255, 255, 0.02); }

.actions-cell { display: flex; gap: 10px; }
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

.avatar-small { 
  width: 40px; 
  height: 40px; 
  background: rgba(255, 255, 255, 0.05); 
  color: var(--color-texto-general, #bbb); 
  border-radius: 50%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-weight: 700; 
  font-size: 0.9rem; 
  border: 1px solid rgba(255, 255, 255, 0.1); 
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

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import HeadingOwner from './HeadingOwner.vue';
import CorreoMasivo from './Componets/Bulk-Email.vue';
import NotificationSystem from '../Modals/NotificationSystem.vue'; 
import ModalComponent from '../Modals/ModalComponent.vue';

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
  toastRef.value.notify('Usuario eliminado correctamente', 'success');
};

const goToPayments = (id) => router.push(`/Owner/pay/${id}`);
const goToEdit = (id) => router.push(`/Owner/editar-usuario/${id}`);
</script>