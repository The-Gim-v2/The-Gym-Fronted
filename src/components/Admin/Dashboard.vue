<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'; 

const router = useRouter(); 

interface GymUser {
  id: number;
  name: string;
  owner: string;
  email: string;
  phone: string;
  plan: string;
  status: 'activo' | 'pendiente' | 'bloqueado' | 'baja';
  registrationDate: string;
  sedes: number;
}

const gyms = ref<GymUser[]>([
  {
    id: 1,
    name: 'FitCenter Central',
    owner: 'Carlos Mendoza',
    email: 'carlos@fitcenter.com',
    phone: '5512345678',
    plan: 'Pro',
    status: 'activo',
    registrationDate: '2026-07-10',
    sedes: 4
  },
  {
    id: 2,
    name: 'Iron Gym Polanco',
    owner: 'Ana Sofía Garza',
    email: 'anasofia@irongym.mx',
    phone: '5587654321',
    plan: 'Avanzada',
    status: 'pendiente',
    registrationDate: '2026-07-15',
    sedes: 2
  },
  {
    id: 3,
    name: 'Energy Fitness',
    owner: 'Roberto Gómez',
    email: 'roberto@energy.com',
    phone: '5598761234',
    plan: 'Básica',
    status: 'bloqueado',
    registrationDate: '2026-06-20',
    sedes: 1
  },
  {
    id: 4,
    name: 'Crossfit Xelhua',
    owner: 'Silvestre Jesús',
    email: 'silvestre@xelhua.com',
    phone: '5533221144',
    plan: 'Sistema Avanzado',
    status: 'activo',
    registrationDate: '2026-07-25',
    sedes: 3
  }
]);

const searchQuery = ref('');
const statusFilter = ref('todos');
const showEditModal = ref(false);
const showLogoutModal = ref(false); // Estado para el modal de cerrar sesión
const selectedGym = ref<GymUser | null>(null);

const filteredGyms = computed(() => {
  return gyms.value.filter(gym => {
    const matchesSearch = 
      gym.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      gym.owner.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      gym.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    const matchesStatus = statusFilter.value === 'todos' || gym.status === statusFilter.value;

    return matchesSearch && matchesStatus;
  });
});

const openEditModal = (gym: GymUser) => {
  selectedGym.value = { ...gym };
  showEditModal.value = true;
};

const saveGymChanges = () => {
  if (!selectedGym.value) return;
  const index = gyms.value.findIndex(g => g.id === selectedGym.value?.id);
  if (index !== -1) {
    gyms.value[index] = { ...selectedGym.value };
  }
  showEditModal.value = false;
  alert('Información del gimnasio actualizada con éxito.');
};

const updateStatus = (status: 'activo' | 'pendiente' | 'bloqueado' | 'baja') => {
  if (selectedGym.value) {
    selectedGym.value.status = status;
  }
};

const deleteGym = (id: number) => {
  if (confirm('¿Estás seguro de eliminar permanentemente este gimnasio? Esta acción no se puede deshacer.')) {
    gyms.value = gyms.value.filter(g => g.id !== id);
    showEditModal.value = false;
  }
};

// Funciones para el flujo del modal de cierre de sesión animado
const confirmLogout = () => {
  localStorage.removeItem('user_role');
  localStorage.removeItem('token'); 
  localStorage.removeItem('user');
  showLogoutModal.value = false;
   router.replace({ name: 'login' }); 
};

</script>

<template>
  <div class="dashboard-wrapper">
    <div class="dashboard-container">
      
      <!-- Encabezado -->
      <div class="dashboard-header">
        <div class="header-titles">
          <div>
            <h2 class="main-title">Panel de <span class="text-accent">Control</span></h2>
            <p class="subtitle">Gestión de gimnasios, estados de mensualidad y accesos.</p>
          </div>
        </div>

        <div class="header-actions-right">
          <div class="stats-pill">
            <span>Total: <strong>{{ gyms.length }}</strong></span>
          </div>
          <button class="logout-btn" @click="showLogoutModal = true" title="Cerrar sesión">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      <!-- Barra de Filtros y Buscador -->
      <div class="filters-bar">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Buscar por nombre, dueño o correo..." 
          />
        </div>

        <div class="status-filter-group">
          <select v-model="statusFilter" class="select-filter">
            <option value="todos">Todos los estados</option>
            <option value="activo">Activo (Pagado)</option>
            <option value="pendiente">Pendiente (Sin pago)</option>
            <option value="bloqueado">Bloqueado</option>
            <option value="baja">Dado de baja</option>
          </select>
        </div>
      </div>

      <!-- VISTA ESCRITORIO (TABLA) -->
      <div class="table-card desktop-only">
        <div class="table-responsive">
          <table class="gym-table">
            <thead>
              <tr>
                <th>Gimnasio</th>
                <th>Dueño / Contacto</th>
                <th>Plan Actual</th>
                <th>Sedes</th>
                <th>Fecha Registro</th>
                <th>Estatus Mensualidad</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="gym in filteredGyms" :key="gym.id">
                <td>
                  <div class="gym-name">{{ gym.name }}</div>
                  <div class="gym-email">{{ gym.email }}</div>
                </td>
                <td>
                  <div class="owner-name">{{ gym.owner }}</div>
                  <div class="owner-phone">{{ gym.phone }}</div>
                </td>
                <td>
                  <span class="plan-badge">{{ gym.plan }}</span>
                </td>
                <td>{{ gym.sedes }}</td>
                <td>{{ gym.registrationDate }}</td>
                <td>
                  <span :class="['status-badge', gym.status]">
                    {{ gym.status.toUpperCase() }}
                  </span>
                </td>
                <td class="text-right">
                  <button class="action-btn" @click="openEditModal(gym)" title="Editar y gestionar">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Gestionar
                  </button>
                </td>
              </tr>
              <tr v-if="filteredGyms.length === 0">
                <td colspan="7" class="empty-state">No se encontraron gimnasios con los filtros seleccionados.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- VISTA MÓVIL (TARJETAS) -->
      <div class="mobile-only">
        <div v-for="gym in filteredGyms" :key="gym.id" class="gym-card-mobile">
          <div class="card-header-mobile">
            <div>
              <div class="gym-name">{{ gym.name }}</div>
              <div class="gym-email">{{ gym.email }}</div>
            </div>
            <span :class="['status-badge', gym.status]">
              {{ gym.status.toUpperCase() }}
            </span>
          </div>

          <div class="card-body-mobile">
            <div class="info-row">
              <span class="info-label">Dueño:</span>
              <span class="info-value">{{ gym.owner }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Teléfono:</span>
              <span class="info-value">{{ gym.phone }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Plan:</span>
              <span class="plan-badge">{{ gym.plan }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Sedes / Registro:</span>
              <span class="info-value">{{ gym.sedes }} sedes ({{ gym.registrationDate }})</span>
            </div>
          </div>

          <div class="card-footer-mobile">
            <button class="action-btn full-width" @click="openEditModal(gym)">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Gestionar Gimnasio
            </button>
          </div>
        </div>

        <div v-if="filteredGyms.length === 0" class="empty-state">
          No se encontraron gimnasios con los filtros seleccionados.
        </div>
      </div>

      <!-- MODAL DE EDICIÓN / GESTIÓN DE USUARIO -->
      <div v-if="showEditModal && selectedGym" class="modal-overlay" @click.self="showEditModal = false">
        <div class="modal-container animate-modal">
          <div class="modal-header">
            <h3>Gestionar: {{ selectedGym.name }}</h3>
            <button class="close-btn" @click="showEditModal = false">&times;</button>
          </div>

          <div class="modal-body">
            <form @submit.prevent="saveGymChanges" class="edit-form">
              
              <div class="form-grid">
                <div class="input-group">
                  <label>Nombre del Gimnasio</label>
                  <input type="text" v-model="selectedGym.name" required />
                </div>
                <div class="input-group">
                  <label>Nombre del Propietario</label>
                  <input type="text" v-model="selectedGym.owner" required />
                </div>
                <div class="input-group">
                  <label>Correo Electrónico</label>
                  <input type="email" v-model="selectedGym.email" required />
                </div>
                <div class="input-group">
                  <label>Teléfono</label>
                  <input type="text" v-model="selectedGym.phone" required />
                </div>
                <div class="input-group">
                  <label>Plan Contratado</label>
                  <input type="text" v-model="selectedGym.plan" required />
                </div>
                <div class="input-group">
                  <label>Número de Sedes</label>
                  <input type="number" v-model="selectedGym.sedes" min="1" required />
                </div>
              </div>

              <!-- Sección de Control de Estatus y Acciones Críticas -->
              <div class="management-actions-box">
                <label class="section-label">Estatus de Mensualidad y Acceso</label>
                <div class="status-action-buttons">
                  <button 
                    type="button" 
                    class="status-ctrl-btn active-ctrl" 
                    :class="{ selected: selectedGym.status === 'activo' }"
                    @click="updateStatus('activo')"
                  >
                    Activo (Pagado)
                  </button>
                  <button 
                    type="button" 
                    class="status-ctrl-btn pending-ctrl" 
                    :class="{ selected: selectedGym.status === 'pendiente' }"
                    @click="updateStatus('pendiente')"
                  >
                    Pendiente
                  </button>
                  <button 
                    type="button" 
                    class="status-ctrl-btn block-ctrl" 
                    :class="{ selected: selectedGym.status === 'bloqueado' }"
                    @click="updateStatus('bloqueado')"
                  >
                    Bloquear
                  </button>
                  <button 
                    type="button" 
                    class="status-ctrl-btn baja-ctrl" 
                    :class="{ selected: selectedGym.status === 'baja' }"
                    @click="updateStatus('baja')"
                  >
                    Dar de Baja
                  </button>
                </div>
              </div>

              <div class="modal-footer-actions">
                <button type="button" class="btn-delete" @click="deleteGym(selectedGym.id)">
                  Eliminar
                </button>
                <div class="right-actions">
                  <button type="button" class="btn-secondary" @click="showEditModal = false">Cancelar</button>
                  <button type="submit" class="btn-primary">Guardar</button>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>

      <!-- MODAL ANIMADO DE CIERRE DE SESIÓN -->
      <div v-if="showLogoutModal" class="modal-overlay" @click.self="showLogoutModal = false">
        <div class="modal-container logout-modal-container animate-modal">
          <div class="logout-modal-body">
            <div class="logout-icon-wrapper">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </div>
            <h3>Cierre de Sesión</h3>
            <p>¿Estás seguro de que deseas cerrar sesión?</p>
            
            <div class="logout-modal-actions">
              <button type="button" class="btn-secondary" @click="showLogoutModal = false">Cancelar</button>
              <button type="button" class="btn-danger-solid" @click="confirmLogout">Cerrar Sesión</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  position: relative;
  min-height: 100vh;
  padding: 40px 20px;
  background: #161616;
  font-family: 'Inter', sans-serif;
  color: #f5f5f4;
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 30px;
  gap: 16px;
  flex-wrap: wrap;
}

.header-actions-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.main-title {
  font-family: 'Anton', sans-serif;
  font-size: clamp(2rem, 4vw, 2.5rem);
  text-transform: uppercase;
  margin: 0;
  letter-spacing: 0.5px;
  color: #ffffff;
}

.text-accent { color: #3b82f6; }

.subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 6px 0 0;
}

.stats-pill {
  background: rgba(28, 79, 214, 0.15);
  border: 1px solid rgba(28, 79, 214, 0.4);
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13px;
  color: #8fb4f8;
  height: fit-content;
}

.logout-btn {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #f87171;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  height: fit-content;
}

.logout-btn:hover {
  background: #ef4444;
  color: #fff;
}

/* Filtros y buscador */
.filters-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 280px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #888;
}

.search-box input {
  width: 100%;
  background: #1f1f1f;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 12px 14px 12px 42px;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.search-box input:focus {
  border-color: #3b82f6;
}

.select-filter {
  background: #1f1f1f;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 12px 16px;
  color: #fff;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  width: 100%;
}

/* Control de vistas escritorio/móvil */
.desktop-only { display: block; }
.mobile-only { display: none; }

/* Estilos de la Tabla (Escritorio) */
.table-card {
  background: #1c1c1c;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.gym-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
}

.gym-table th {
  background: #161616;
  padding: 16px 20px;
  color: #888;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.5px;
}

.gym-table td {
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  color: #e5e5e5;
}

.gym-name { font-weight: 600; color: #fff; }
.gym-email, .owner-phone { font-size: 12px; color: #888; }
.owner-name { color: #d4d4d4; }

.plan-badge {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  display: inline-block;
}

.status-badge.activo { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
.status-badge.pendiente { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
.status-badge.bloqueado { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
.status-badge.baja { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }

.text-right { text-align: right; }

.action-btn {
  background: rgba(28, 79, 214, 0.15);
  border: 1px solid rgba(28, 79, 214, 0.4);
  color: #8fb4f8;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #1c4fd6;
  color: #fff;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #888;
}

/* Estilos de Tarjetas Móviles */
@media (max-width: 900px) {
  .desktop-only { display: none; }
  .mobile-only { display: block; }
  .dashboard-wrapper { padding: 20px 12px; }
  .dashboard-header { flex-direction: column; align-items: flex-start; gap: 16px; }
  .header-actions-right { width: 100%; justify-content: space-between; }
  .filters-bar { flex-direction: column; }
  .search-box, .status-filter-group { width: 100%; min-width: 100%; }

  .gym-card-mobile {
    background: #1c1c1c;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  }

  .card-header-mobile {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .card-body-mobile {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
    font-size: 13px;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .info-label {
    color: #888;
  }

  .info-value {
    color: #e5e5e5;
    font-weight: 500;
  }

  .card-footer-mobile {
    display: flex;
    gap: 8px;
  }

  .action-btn.full-width {
    width: 100%;
    justify-content: center;
    padding: 10px;
    font-size: 13px;
  }
}

/* Modal Estilos y Animaciones */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 16px;
  animation: fadeIn 0.25s ease-out forwards;
}

.modal-container {
  background: #161616;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0,0,0,0.8);
  animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.logout-modal-container {
  max-width: 420px;
}

.logout-modal-body {
  padding: 32px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logout-icon-wrapper {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.logout-modal-body h3 {
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  color: #fff;
  font-family: 'Oswald', sans-serif;
  letter-spacing: 0.5px;
}

.logout-modal-body p {
  color: #aaa;
  font-size: 14px;
  margin: 0 0 24px 0;
}

.logout-modal-actions {
  display: flex;
  gap: 12px;
  width: 100%;
}

.logout-modal-actions button {
  flex: 1;
}

.btn-danger-solid {
  background: #ef4444;
  border: none;
  color: #fff;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-danger-solid:hover {
  background: #dc2626;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.92) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1c1c1c;
}

.modal-header h3 {
  margin: 0;
  font-family: 'Oswald', sans-serif;
  font-size: 1.15rem;
  color: #fff;
  letter-spacing: 0.5px;
}

.close-btn {
  background: transparent;
  border: none;
  color: #aaa;
  font-size: 1.8rem;
  cursor: pointer;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

@media(max-width: 650px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group label {
  font-size: 12px;
  color: #aaa;
}

.input-group input {
  background: #1f1f1f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px 12px;
  color: #fff;
  font-size: 14px;
  outline: none;
}

.input-group input:focus {
  border-color: #3b82f6;
}

.management-actions-box {
  background: #1f1f1f;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
}

.section-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 12px;
}

.status-action-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

@media(min-width: 550px) {
  .status-action-buttons {
    grid-template-columns: repeat(4, 1fr);
  }
}

.status-ctrl-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #aaa;
  padding: 10px 6px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.status-ctrl-btn.active-ctrl.selected { background: #10b981; color: #fff; border-color: #10b981; }
.status-ctrl-btn.pending-ctrl.selected { background: #3b82f6; color: #fff; border-color: #3b82f6; }
.status-ctrl-btn.block-ctrl.selected { background: #f59e0b; color: #fff; border-color: #f59e0b; }
.status-ctrl-btn.baja-ctrl.selected { background: #ef4444; color: #fff; border-color: #ef4444; }

.modal-footer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.right-actions {
  display: flex;
  gap: 10px;
}

.btn-delete {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}

.btn-delete:hover {
  background: #ef4444;
  color: #fff;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}

.btn-primary {
  background: #1c4fd6;
  border: none;
  color: #fff;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  font-family: 'Oswald', sans-serif;
  letter-spacing: 0.5px;
}

.btn-primary:hover {
  background: #153eb5;
}
</style>