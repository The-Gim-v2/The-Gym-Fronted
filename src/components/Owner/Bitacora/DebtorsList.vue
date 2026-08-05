<template>
  <HeadingOwner>
    <NotificationSystem ref="toastRef" />
    <main class="main-content">
      <header class="header-section">
        <h1 class="main-title">Deudores</h1>
      
        <div class="actions-bar">
            <select class="status-select" v-model="selectedMembership">
                <option value="">Mensualidad (Todas)</option>
                <option value="Mensual">Mensual</option>
                <option value="Quincenal">Quincenal</option>
            </select>
            <select class="status-select" v-model="selectedStatus">
                <option value="">Status (Todos)</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Inactivo">Inactivo</option>
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
      <div class="table-container desktop-only">
        <table class="user-table">
          <thead>
            <tr><th>Foto</th><th>Nombre</th><th>Correo</th><th>Vencimiento</th><th>Adeudo</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td><div class="avatar-small"></div></td>
              <td class="text-bold">{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.expiredDate }}</td>
              <td><span class="status-badge" :class="getDebtClass(user.status)">{{ user.debt }}</span></td>
              <td class="actions-cell">
                <button class="icon-btn" title="Email" @click="activeModal = 'enviocorreo'"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></button>
                <button class="icon-btn whatsapp-icon-btn" title="WhatsApp" @click="openWhatsApp(user.phone)"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 5.6 8.5 8.5 0 0 1-7.6-5.6 8.38 8.38 0 0 1-.9-3.8A8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z"/><path d="M9 12l2 2 4-4"/></svg></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- VISTA MÓVIL -->
      <div class="mobile-only">
        <div v-for="user in filteredUsers" :key="user.id" class="user-card">
          <div class="card-top-section">
            <div class="avatar-small"></div>
            <div class="card-user-titles">
              <div class="text-bold name-text">{{ user.name }}</div>
              <span class="status-badge" :class="getDebtClass(user.status)">{{ user.debt }}</span>
            </div>
          </div>
          
          <div class="card-meta">
            <span class="email-text">{{ user.email }}</span>
            <span class="expiration-warning"><span class="vence-label">Vence:</span> {{ user.expiredDate }}</span>
            <span class="phone-text">{{ user.phone }}</span>
          </div>

          <div class="card-actions">
            <button class="action-chip btn-email-chip" @click="activeModal = 'enviocorreo'">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <span>Email</span>
            </button>
            <button class="action-chip btn-whatsapp-chip" @click="openWhatsApp(user.phone)">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 5.6 8.5 8.5 0 0 1-7.6-5.6 8.38 8.38 0 0 1-.9-3.8A8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z"/><path d="M9 12l2 2 4-4"/></svg>
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Eliminar -->
      <ModalComponent :isOpen="showDelete" @close="showDelete = false">
        <div class="modal-body-custom">
          <div class="modal-icon-container danger-bg">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#ef4444" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </div>
          <h2>¿Eliminar usuario?</h2>
          <p>¿Deseas eliminar a <span class="highlight-name">{{ selectedUser?.name }}</span> temporalmente?</p>
          <div class="modal-buttons">
            <button class="btn-modal secondary" @click="showDelete = false">Cancelar</button>
            <button class="btn-modal danger">Confirmar</button>
          </div>
        </div>
      </ModalComponent>
    </main>

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

  .btn-email-chip {
    color: #38bdf8;
  }
  .btn-email-chip:hover {
    background: rgba(56, 189, 248, 0.1);
    border-color: rgba(56, 189, 248, 0.3);
  }

  .btn-whatsapp-chip {
    color: #22c55e;
  }
  .btn-whatsapp-chip:hover {
    background: rgba(34, 197, 94, 0.1);
    border-color: rgba(34, 197, 94, 0.3);
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
.whatsapp-icon-btn:hover { color: #22c55e; border-color: rgba(34, 197, 94, 0.4); }

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

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import HeadingOwner from '../HeadingOwner.vue';
import ModalComponent from '../../Modals/ModalComponent.vue';
import CorreoMasivo from '../Componets/Bulk-Email.vue';
import EnvioCorreo from '../Componets/Mail.vue';
import NotificationSystem from '../../Modals/NotificationSystem.vue'; 

const activeModal = ref(null);
const router = useRouter();
const showDelete = ref(false);
const selectedUser = ref(null);

const selectedMembership = ref(''); 
const selectedStatus = ref(''); 
const searchQuery = ref('');

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchMembership = selectedMembership.value ? user.mensualidad === selectedMembership.value : true;
    const matchStatus = selectedStatus.value ? user.status === selectedStatus.value : true;
    
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
    
    return matchMembership && matchStatus && matchSearch;
  });
});

const getDebtClass = (status) => {
  if (status === 'Pendiente') return 'debt-pending';
  if (status === 'Inactivo') return 'debt-inactive';
  return 'debt-default';
};

const users = ref([
  { id: 1, name: 'Jesus Luis Ramires Sanchez', email: 'jesusluis@gmail.com', expiredDate: '18/03/2026', mensualidad: 'Mensual', debt: '$600.00', status: 'Pendiente', phone: '+52 481 123 4321' },
  { id: 2, name: 'Armando Luis Ramires Sanchez', email: 'jesusluis@gmail.com', expiredDate: '18/03/2026', mensualidad: 'Mensual', debt: '$700.00', status: 'Inactivo', phone: '+52 481 123 4321' },
  { id: 3, name: 'Luis Luis Ramires Sanchez', email: 'jesusluis@gmail.com', expiredDate: '18/03/2026', mensualidad: 'Mensual', debt: '$900.00', status: 'Pendiente', phone: '+52 481 123 4321' },
  { id: 4, name: 'Francisco Luis Ramires Sanchez', email: 'jesusluis@gmail.com', expiredDate: '18/03/2026', mensualidad: 'Quincenal', debt: '$500.00', status: 'Pendiente', phone: '+52 481 123 4321' },
  { id: 5, name: 'Jorge Luis Ramires Sanchez', email: 'jesusluis@gmail.com', expiredDate: '18/03/2026', mensualidad: 'Quincenal', debt: '$800.00', status: 'Inactivo', phone: '+52 481 123 4321' },
  { id: 6, name: 'Maria Luis Ramires Sanchez', email: 'jesusluis@gmail.com', expiredDate: '18/03/2026', mensualidad: 'Quincenal', debt: '$500.00', status: 'Pendiente', phone: '+52 481 123 4321' },
  { id: 7, name: 'Fernando Luis Ramires Sanchez', email: 'jesusluis@gmail.com', expiredDate: '18/03/2026', mensualidad: 'Quincenal', debt: '$800.00', status: 'Inactivo', phone: '+52 481 123 4321' },
  { id: 8, name: 'Erick Luis Ramires Sanchez', email: 'jesusluis@gmail.com', expiredDate: '18/03/2026', mensualidad: 'Quincenal', debt: '$500.00', status: 'Pendiente', phone: '+52 481 123 4321' },
]);

const openWhatsApp = (phone) => window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank');
</script>