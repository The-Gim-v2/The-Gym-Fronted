<template>
  <HeadingAdmin>
    <NotificationSystem ref="toastRef" />
    <main class="main-content">
      <header class="header-section">
        <div class="title-wrapper">
          <h1 class="main-title">Personal</h1>
         <!-- <p class="main-subtitle">Control y administración general del equipo de trabajo</p>-->
        </div>
      
        <div class="actions-bar">
            <select class="status-select" v-model="selectedRoleFilter">
              <option value="Todos">Todos los roles</option>
              <option value="Recepcionista">Recepcionista</option>
              <option value="Entrenador">Entrenador</option>
              <option value="Administrador">Administrador</option>
            </select>
            <button class="btn-bulk" @click="activeModal = 'enviomasivo'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              Correo Masivo
            </button>
            <input type="text" class="search-input" placeholder="Buscar personal..." v-model="searchQuery">
        </div>
      </header>
            

      <!-- VISTA ESCRITORIO -->
      <div class="table-container desktop-only">
        <table class="user-table">
          <thead>
            <tr><th>Foto</th><th>Nombre</th><th>Correo</th><th>Celular</th><th>Rol Sistema</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td><div class="avatar-small"></div></td>
              <td class="text-bold">{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone }}</td>
              <td><span :class="['status-badge', getRoleClass(user.role)]">{{ user.role }}</span></td>
              <td class="actions-cell">
                <button class="icon-btn" title="Email" @click="activeModal = 'enviocorreo'">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </button>
                <button class="icon-btn" title="WhatsApp" @click="openWhatsApp(user.phone)">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 5.6 8.5 8.5 0 0 1-7.6-5.6 8.38 8.38 0 0 1-.9-3.8A8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z"/><path d="M9 12l2 2 4-4"/></svg>
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

      <!-- VISTA MÓVIL REESTRUCTURADA -->
      <div class="mobile-only">
        <div v-for="user in filteredUsers" :key="user.id" class="user-card">
          <div class="card-top-section">
            <div class="avatar-small"></div>
            <div class="card-user-titles">
              <div class="text-bold name-text">{{ user.name }}</div>
              <span :class="['status-badge', getRoleClass(user.role)]">{{ user.role }}</span>
            </div>
          </div>
          
          <div class="card-meta">
            <span class="email-text">{{ user.email }}</span>
            <span class="phone-text">{{ user.phone }}</span>
          </div>

          <div class="card-actions">
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
              <span>Editar</span>
            </button>
            <button class="action-chip btn-delete-chip" @click="confirmDelete(user)">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal QR -->
      <ModalComponent :isOpen="showQR" @close="showQR = false">
        <div class="modal-body-custom">
          <h2 style="color: #3b82f6; margin-bottom: 15px; font-family: 'Oswald', sans-serif; font-size: 1.3rem; text-transform: uppercase;">Código QR de Acceso</h2>
          <div class="qr-wrapper">
              <img src="../../../assets/qr.png" alt="QR" class="qr-image" style="max-width: 180px; margin: 0 auto; display: block; border-radius: 8px;" />
          </div>
          <p style="color:#aaa; font-size:0.9rem; margin: 20px 0;">
              Muestra este código en la entrada para que los socios registren su asistencia.
          </p>
          <button class="btn-bulk" style="width:100%; display: flex; justify-content: center; align-items: center;">Descargar para Imprimir</button>
        </div>
      </ModalComponent>

      <!-- Modal Eliminar Unificado -->
      <ModalComponent :isOpen="showDelete" @close="showDelete = false">
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
  </HeadingAdmin>
</template>

<style scoped>
.main-content { padding: 30px 40px; max-width: 1400px; margin: 0 auto; }
.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; flex-wrap: wrap; gap: 20px; }

.title-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.main-title { font-family: 'Anton', sans-serif; font-size: 2rem; color: #fff; margin: 0; letter-spacing: 0.5px; }
.main-subtitle { font-size: 0.88rem; color: #888; margin: 0; }

.actions-bar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.search-input, .status-select { 
  background: #141414; 
  border: 1px solid #2a2a2a; 
  padding: 10px 14px; 
  border-radius: 10px; 
  color: #fff; 
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}
.search-input { width: 220px; }
.search-input:focus, .status-select:focus { border-color: #3b82f6; }

.btn-bulk {
  background: #141414;
  border: 1px solid #2a2a2a; 
  padding: 10px 16px;
  border-radius: 10px;
  color: #fff; 
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  white-space: nowrap;
  font-size: 0.9rem;
  transition: background 0.2s, border-color 0.2s;
}
.btn-bulk:hover { background: #1f1f1f; border-color: #444; }
.btn-bulk svg { color: #3b82f6; }

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

/* Colores específicos para ROLES */
.role-recepcionista { background: rgba(16, 185, 129, 0.08); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
.role-entrenador { background: rgba(59, 130, 246, 0.08); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
.role-admin { background: rgba(168, 85, 247, 0.08); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); }
.role-default { background: #222; color: #ccc; border: 1px solid #444; }

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
    background: #141416;
    padding: 16px;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.08);
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
    background: #26262b;
    border-radius: 50%;
    border: 1px solid #333;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9rem;
    color: #bbb;
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
    color: #fff;
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
    color: #94a3b8;
  }

  .phone-text {
    color: #888;
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
    border-radius: 8px;
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

  .btn-email-chip {
    color: #38bdf8;
  }
  .btn-email-chip:hover {
    background: rgba(56, 189, 248, 0.1);
    border-color: rgba(56, 189, 248, 0.3);
  }

  .btn-wa-chip {
    color: #22c55e;
  }
  .btn-wa-chip:hover {
    background: rgba(34, 197, 94, 0.1);
    border-color: rgba(34, 197, 94, 0.3);
  }

  .btn-edit-chip {
    color: #fbbf24;
  }
  .btn-edit-chip:hover {
    background: rgba(251, 191, 36, 0.1);
    border-color: rgba(251, 191, 36, 0.3);
  }

  .btn-delete-chip {
    color: #f87171;
  }
  .btn-delete-chip:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.3);
  }
}

.table-container { background: #111; border-radius: 14px; border: 1px solid #222; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
.user-table { width: 100%; border-collapse: collapse; color: #e5e5e5; text-align: left; }
.user-table th { padding: 16px 20px; background: #161616; font-family: 'Oswald', sans-serif; font-size: 0.85rem; text-transform: uppercase; color: #888; letter-spacing: 0.5px; border-bottom: 1px solid #222; }
.user-table td { padding: 16px 20px; border-top: 1px solid #1a1a1a; font-size: 0.92rem; vertical-align: middle; }
.user-table tr:hover { background: rgba(255, 255, 255, 0.015); }

.actions-cell { display: flex; gap: 10px; }
.icon-btn { 
  background: #181818; 
  border: 1px solid #2a2a2a; 
  border-radius: 8px; 
  cursor: pointer; 
  color: #aaa; 
  padding: 8px; 
  display: flex; 
  align-items: center; 
  justify-content: center;
  transition: all 0.2s ease;
}
.icon-btn:hover { background: #262626; color: #fff; border-color: #444; transform: translateY(-1px); }
.avatar-small { width: 40px; height: 40px; background: #262626; color: #bbb; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; border: 1px solid #333; }

.text-bold { font-weight: 600; color: #fff; }

.modal-body-custom { text-align: center; color: #fff; padding: 10px 5px; }
.modal-body-custom h2 { font-size: 1.3rem; margin-bottom: 10px; font-weight: 600; }
.modal-body-custom p { color: #aaa; font-size: 0.9rem; margin-bottom: 20px; line-height: 1.5; }
.highlight-name { color: #fff; font-weight: 600; }

.modal-icon-container { width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px auto; }
.danger-bg { background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.2); }

.modal-buttons { display: flex; gap: 10px; }
.btn-modal { flex: 1; padding: 10px; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; border: none; transition: opacity 0.2s; }
.btn-modal.secondary { background: #222; color: #ccc; border: 1px solid #333; }
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
import HeadingAdmin from '../HeadingAdmin.vue';
import ModalComponent from '../../Modals/ModalComponent.vue';
import CorreoMasivo from '../Componets/Bulk-Email.vue';
import EnvioCorreo from '../Componets/Mail.vue';
import NotificationSystem from '../../Modals/NotificationSystem.vue'; 

const activeModal = ref(null);
const toastRef = ref(null);

const router = useRouter();
const showQR = ref(false);
const showDelete = ref(false);
const selectedUser = ref(null);

const searchQuery = ref('');
const selectedRoleFilter = ref('Todos');

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
    'Administrador': 'role-admin'
  };
  return classes[role] || 'role-default';
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
    toastRef.value.notify('Personal eliminado correctamente', 'success');
  }
};

const goToEdit = (id) => router.push(`/admin/editar-staff/${id}`);
const openWhatsApp = (phone) => window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank');
</script>