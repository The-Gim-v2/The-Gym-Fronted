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
  { id: 1, name: 'FitCenter Central', owner: 'Carlos Mendoza', email: 'carlos@fitcenter.com', phone: '5512345678', plan: 'Pro', status: 'activo', registrationDate: '2026-07-10', sedes: 4 },
  { id: 2, name: 'Iron Gym Polanco', owner: 'Ana Sofía Garza', email: 'anasofia@irongym.mx', phone: '5587654321', plan: 'Avanzada', status: 'pendiente', registrationDate: '2026-07-15', sedes: 2 },
  { id: 3, name: 'Energy Fitness', owner: 'Roberto Gómez', email: 'roberto@energy.com', phone: '5598761234', plan: 'Básica', status: 'bloqueado', registrationDate: '2026-06-20', sedes: 1 },
  { id: 4, name: 'Crossfit Xelhua', owner: 'Silvestre Jesús', email: 'silvestre@xelhua.com', phone: '5533221144', plan: 'Sistema Avanzado', status: 'activo', registrationDate: '2026-07-25', sedes: 3 }
]);

const searchQuery = ref('');
const statusFilter = ref('todos');
const showEditModal = ref(false);
const showLogoutModal = ref(false);
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

/* --- Solo para el diseño: resumen por estatus e iniciales --- */
const statusList = [
  { key: 'activo', label: 'Activos' },
  { key: 'pendiente', label: 'Pendientes' },
  { key: 'bloqueado', label: 'Bloqueados' },
  { key: 'baja', label: 'De baja' }
];
const countByStatus = (s: string) => gyms.value.filter(g => g.status === s).length;
const toggleStatusFilter = (s: string) => {
  statusFilter.value = statusFilter.value === s ? 'todos' : s;
};
const initials = (name: string) =>
  name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();

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
          <h2 class="main-title">Panel de <span class="text-accent">Control</span></h2>
          <p class="subtitle">Gestión de gimnasios, estados de mensualidad y accesos.</p>
        </div>

        <div class="header-actions-right">
          <div class="stats-pill">
            <span>Total <strong>{{ gyms.length }}</strong></span>
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

      <!-- Resumen por estatus (clic para filtrar) -->
      <div class="stats-row">
        <button
          v-for="s in statusList"
          :key="s.key"
          type="button"
          class="stat-tile"
          :class="[s.key, { active: statusFilter === s.key }]"
          @click="toggleStatusFilter(s.key)"
        >
          <span class="stat-count">{{ countByStatus(s.key) }}</span>
          <span class="stat-label">{{ s.label }}</span>
        </button>
      </div>

      <!-- Buscador y filtro -->
      <div class="filters-bar">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" v-model="searchQuery" placeholder="Buscar por nombre, dueño o correo..." />
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
              <tr v-for="gym in filteredGyms" :key="gym.id" :class="gym.status">
                <td>
                  <div class="gym-cell">
                    <span class="avatar">{{ initials(gym.name) }}</span>
                    <div>
                      <div class="gym-name">{{ gym.name }}</div>
                      <div class="gym-email">{{ gym.email }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="owner-name">{{ gym.owner }}</div>
                  <div class="owner-phone">{{ gym.phone }}</div>
                </td>
                <td><span class="plan-badge">{{ gym.plan }}</span></td>
                <td class="num">{{ gym.sedes }}</td>
                <td class="num">{{ gym.registrationDate }}</td>
                <td>
                  <span :class="['status-badge', gym.status]">{{ gym.status }}</span>
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
        <div v-for="gym in filteredGyms" :key="gym.id" class="gym-card-mobile" :class="gym.status">
          <div class="card-header-mobile">
            <div class="gym-cell">
              <span class="avatar">{{ initials(gym.name) }}</span>
              <div>
                <div class="gym-name">{{ gym.name }}</div>
                <div class="gym-email">{{ gym.email }}</div>
              </div>
            </div>
            <span :class="['status-badge', gym.status]">{{ gym.status }}</span>
          </div>

          <div class="card-body-mobile">
            <div class="info-row">
              <span class="info-label">Dueño</span>
              <span class="info-value">{{ gym.owner }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Teléfono</span>
              <span class="info-value">{{ gym.phone }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Plan</span>
              <span class="plan-badge">{{ gym.plan }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Sedes / Registro</span>
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

      <!-- MODAL DE EDICIÓN -->
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

              <div class="management-actions-box">
                <label class="section-label">Estatus de Mensualidad y Acceso</label>
                <div class="status-action-buttons">
                  <button type="button" class="status-ctrl-btn active-ctrl" :class="{ selected: selectedGym.status === 'activo' }" @click="updateStatus('activo')">
                    Activo (Pagado)
                  </button>
                  <button type="button" class="status-ctrl-btn pending-ctrl" :class="{ selected: selectedGym.status === 'pendiente' }" @click="updateStatus('pendiente')">
                    Pendiente
                  </button>
                  <button type="button" class="status-ctrl-btn block-ctrl" :class="{ selected: selectedGym.status === 'bloqueado' }" @click="updateStatus('bloqueado')">
                    Bloquear
                  </button>
                  <button type="button" class="status-ctrl-btn baja-ctrl" :class="{ selected: selectedGym.status === 'baja' }" @click="updateStatus('baja')">
                    Dar de Baja
                  </button>
                </div>
              </div>

              <div class="modal-footer-actions">
                <button type="button" class="btn-delete" @click="deleteGym(selectedGym.id)">Eliminar</button>
                <div class="right-actions">
                  <button type="button" class="btn-secondary" @click="showEditModal = false">Cancelar</button>
                  <button type="submit" class="btn-primary">Guardar</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- MODAL CIERRE DE SESIÓN -->
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
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=Oswald:wght@500;600&display=swap');

/* ---------- Tokens (usan tu tema si existe) ---------- */
.dashboard-wrapper {
  --bg: var(--bg-custom, #0f0f10);
  --surface: var(--bg-cards, #171718);
  --surface-2: rgba(255,255,255,.04);
  --line: rgba(255,255,255,.09);
  --line-soft: rgba(255,255,255,.055);
  --text: var(--color-etiquetas, #f5f5f4);
  --muted: #9a9aa3;
  --accent: var(--color-highlight, #3b82f6);
  --btn: var(--color-botones, #1c4fd6);
  --btn-text: var(--color-texto-botones, #fff);
  --r: var(--app-border-radius, 16px);
  --r-sm: calc(var(--app-border-radius, 16px) * .55);
  --ok: #34d399;
  --warn: #fbbf24;
  --bad: #f87171;
  --off: #9ca3af;

  min-height: 100vh;
  padding: 36px 24px 64px;
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.dashboard-wrapper *, .dashboard-wrapper *::before, .dashboard-wrapper *::after { box-sizing: border-box; }
.dashboard-container { width: 100%; max-width: 1360px; margin: 0 auto; }

/* Color por estatus: se reutiliza en badges, tiles, filas y botones */
.activo, .active-ctrl { --tone: var(--ok); }
.pendiente, .pending-ctrl { --tone: var(--warn); }
.bloqueado, .block-ctrl { --tone: var(--bad); }
.baja, .baja-ctrl { --tone: var(--off); }

/* ---------- Encabezado ---------- */
.dashboard-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 18px;
  padding: 28px 30px;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--r);
  background:
    radial-gradient(120% 140% at 0% 0%, color-mix(in srgb, var(--accent) 15%, transparent), transparent 55%),
    var(--surface);
}
.header-titles { min-width: 0; }
.main-title {
  margin: 0;
  color: var(--color-titulos, #fff);
  font-family: 'Anton', sans-serif;
  font-size: clamp(1.9rem, 3.2vw, 2.6rem);
  font-weight: 400;
  line-height: 1.05;
  letter-spacing: .01em;
  text-transform: uppercase;
}
.text-accent { color: var(--accent); }
.subtitle { max-width: 56ch; margin: 9px 0 0; color: var(--muted); font-size: .92rem; line-height: 1.55; }

.header-actions-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.stats-pill {
  height: 42px;
  display: inline-flex;
  align-items: center;
  padding: 0 16px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--surface-2);
  color: var(--muted);
  font-size: .84rem;
  white-space: nowrap;
}
.stats-pill strong { margin-left: 8px; color: var(--text); font-size: 1rem; font-weight: 700; }

.logout-btn {
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 16px;
  border: 1px solid color-mix(in srgb, var(--bad) 35%, transparent);
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--bad);
  font: 600 .84rem 'Inter', sans-serif;
  cursor: pointer;
  transition: background .15s, border-color .15s;
}
.logout-btn:hover { background: color-mix(in srgb, var(--bad) 12%, transparent); border-color: var(--bad); }

/* ---------- Resumen por estatus ---------- */
.stats-row { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-bottom: 16px; }
.stat-tile {
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 16px 18px 16px 22px;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--surface);
  color: var(--text);
  text-align: left;
  cursor: pointer;
  transition: border-color .15s, background .15s;
}
.stat-tile::before {
  content: '';
  position: absolute; left: 0; top: 0; bottom: 0;
  width: 4px;
  background: var(--tone);
}
.stat-tile:hover { border-color: color-mix(in srgb, var(--tone) 55%, transparent); }
.stat-tile.active {
  border-color: var(--tone);
  background: color-mix(in srgb, var(--tone) 10%, var(--surface));
}
.stat-count { font: 400 1.9rem/1 'Anton', sans-serif; color: var(--tone); }
.stat-label { color: var(--muted); font-size: .86rem; font-weight: 600; }
.stat-tile.active .stat-label { color: var(--text); }

/* ---------- Filtros ---------- */
.filters-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.search-box { position: relative; flex: 1; min-width: 260px; }
.search-icon {
  position: absolute; top: 50%; left: 15px;
  width: 17px; height: 17px;
  color: var(--muted);
  pointer-events: none;
  transform: translateY(-50%);
}
.search-box input, .select-filter {
  width: 100%;
  height: 46px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  outline: none;
  background: var(--surface);
  color: var(--text);
  font: 500 .9rem 'Inter', sans-serif;
  transition: border-color .15s, box-shadow .15s;
}
.search-box input { padding: 0 16px 0 44px; }
.search-box input::placeholder { color: #6b6b73; }
.search-box input:hover, .select-filter:hover { border-color: rgba(255,255,255,.18); }
.search-box input:focus, .select-filter:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent);
}
.status-filter-group { width: 230px; flex-shrink: 0; }
.select-filter {
  padding: 0 40px 0 14px;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  color-scheme: dark;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239a9aa3' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 16px;
}

/* ---------- Tabla ---------- */
.desktop-only { display: block; }
.mobile-only { display: none; }
.table-card { overflow: hidden; border: 1px solid var(--line); border-radius: var(--r); background: var(--surface); }
.table-responsive { width: 100%; overflow-x: auto; scrollbar-width: thin; scrollbar-color: #3a3a3f transparent; }
.gym-table { width: 100%; min-width: 1000px; border-collapse: collapse; text-align: left; font-size: .88rem; }
.gym-table thead { background: var(--surface-2); }
.gym-table th {
  height: 50px;
  padding: 0 20px;
  border-bottom: 1px solid var(--line);
  color: var(--muted);
  font-size: .76rem;
  font-weight: 600;
  letter-spacing: .02em;
  white-space: nowrap;
}
.gym-table td { padding: 16px 20px; border-bottom: 1px solid var(--line-soft); color: #d9d9dc; vertical-align: middle; }
.gym-table td:first-child { box-shadow: inset 4px 0 0 var(--tone, transparent); }
.gym-table tbody tr { transition: background .15s; }
.gym-table tbody tr:hover { background: color-mix(in srgb, var(--tone, var(--accent)) 6%, transparent); }
.gym-table tbody tr:last-child td { border-bottom: 0; }
.num { font-variant-numeric: tabular-nums; }

.gym-cell { display: flex; align-items: center; gap: 12px; min-width: 0; }
.avatar {
  width: 40px; height: 40px;
  flex-shrink: 0;
  display: grid; place-items: center;
  border-radius: var(--r-sm);
  background: color-mix(in srgb, var(--accent) 16%, transparent);
  color: var(--accent);
  font: 500 .95rem 'Oswald', sans-serif;
  letter-spacing: .02em;
}
.gym-name { margin-bottom: 2px; color: var(--text); font-size: .94rem; font-weight: 600; white-space: nowrap; }
.owner-name { margin-bottom: 2px; color: #dcdce0; font-size: .88rem; font-weight: 500; white-space: nowrap; }
.gym-email, .owner-phone { color: var(--muted); font-size: .8rem; white-space: nowrap; }

.plan-badge {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 11px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface-2);
  color: #d0d0d4;
  font-size: .78rem;
  font-weight: 600;
  white-space: nowrap;
}
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 28px;
  padding: 0 12px;
  border: 1px solid color-mix(in srgb, var(--tone) 35%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--tone) 10%, transparent);
  color: var(--tone);
  font-size: .78rem;
  font-weight: 700;
  text-transform: capitalize;
  white-space: nowrap;
}
.status-badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

.text-right { text-align: right; }
.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--surface-2);
  color: var(--text);
  font: 600 .8rem 'Inter', sans-serif;
  cursor: pointer;
  transition: border-color .15s, background .15s, color .15s;
}
.action-btn svg { width: 15px; height: 15px; }
.action-btn:hover { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 12%, transparent); color: var(--accent); }
.empty-state { padding: 60px 24px !important; color: var(--muted) !important; font-size: .9rem; text-align: center !important; }

/* ---------- Tarjetas móvil ---------- */
.gym-card-mobile {
  margin-bottom: 12px;
  padding: 18px 18px 18px 22px;
  border: 1px solid var(--line);
  border-radius: var(--r);
  background: var(--surface);
  box-shadow: inset 4px 0 0 var(--tone);
}
.card-header-mobile {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line-soft);
}
.card-body-mobile { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
.info-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 26px; }
.info-label { color: var(--muted); font-size: .82rem; }
.info-value { color: #dcdce0; font-size: .86rem; font-weight: 500; text-align: right; }
.card-footer-mobile { padding-top: 14px; border-top: 1px solid var(--line-soft); }
.action-btn.full-width { width: 100%; min-height: 42px; }

/* ---------- Modal ---------- */
.modal-overlay {
  position: fixed; inset: 0; z-index: 2000;
  display: flex; align-items: center; justify-content: center;
  padding: 18px;
  background: rgba(0,0,0,.72);
  backdrop-filter: blur(3px);
  animation: fadeIn .2s ease forwards;
}
.modal-container {
  width: 100%;
  max-width: 720px;
  max-height: min(90vh, 800px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--r);
  background: var(--surface);
  box-shadow: 0 30px 80px rgba(0,0,0,.6);
  animation: scaleUp .24s cubic-bezier(.16,1,.3,1) forwards;
}
.modal-header { min-height: 68px; display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 0 24px; border-bottom: 1px solid var(--line); }
.modal-header h3 {
  overflow: hidden;
  margin: 0;
  color: var(--color-titulos, #fff);
  font-family: 'Oswald', sans-serif;
  font-size: 1.15rem;
  font-weight: 500;
  letter-spacing: .02em;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.close-btn {
  width: 36px; height: 36px;
  flex-shrink: 0;
  display: grid; place-items: center;
  padding: 0;
  border: 1px solid transparent;
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--muted);
  font-size: 1.6rem;
  line-height: 1;
  cursor: pointer;
  transition: background .15s, color .15s;
}
.close-btn:hover { background: var(--surface-2); color: #fff; }
.modal-body { padding: 24px; overflow-y: auto; scrollbar-width: thin; scrollbar-color: #3a3a3f transparent; }
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-bottom: 22px; }
.input-group { min-width: 0; display: flex; flex-direction: column; gap: 7px; }
.input-group label { color: var(--muted); font-size: .8rem; font-weight: 600; }
.input-group input {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  outline: none;
  background: var(--surface-2);
  color: var(--text);
  font: 500 .9rem 'Inter', sans-serif;
  transition: border-color .15s, box-shadow .15s;
}
.input-group input:hover { border-color: rgba(255,255,255,.18); }
.input-group input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent); }

.management-actions-box { margin-bottom: 22px; padding: 18px; border: 1px solid var(--line); border-radius: var(--r-sm); background: var(--surface-2); }
.section-label { display: block; margin-bottom: 12px; color: var(--text); font-size: .88rem; font-weight: 600; }
.status-action-buttons { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
.status-ctrl-btn {
  min-height: 42px;
  padding: 0 10px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--muted);
  font: 600 .8rem 'Inter', sans-serif;
  cursor: pointer;
  transition: border-color .15s, background .15s, color .15s;
}
.status-ctrl-btn:hover { border-color: rgba(255,255,255,.22); color: var(--text); }
.status-ctrl-btn.selected { color: var(--tone); border-color: var(--tone); background: color-mix(in srgb, var(--tone) 14%, transparent); }

.modal-footer-actions { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 20px; border-top: 1px solid var(--line); }
.right-actions { display: flex; align-items: center; gap: 10px; }
.btn-delete, .btn-secondary, .btn-primary, .btn-danger-solid {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  border: 1px solid transparent;
  border-radius: var(--r-sm);
  font: 600 .86rem 'Inter', sans-serif;
  cursor: pointer;
  transition: transform .15s, filter .15s, background .15s, border-color .15s;
}
.btn-delete { border-color: color-mix(in srgb, var(--bad) 35%, transparent); background: transparent; color: var(--bad); }
.btn-delete:hover { background: color-mix(in srgb, var(--bad) 12%, transparent); border-color: var(--bad); }
.btn-secondary { border-color: var(--line); background: transparent; color: #c8c8cd; }
.btn-secondary:hover { background: var(--surface-2); color: #fff; }
.btn-primary {
  background: var(--btn);
  color: var(--btn-text);
  box-shadow: 0 1px 0 rgba(255,255,255,.18) inset, 0 10px 24px -10px color-mix(in srgb, var(--btn) 70%, transparent);
}
.btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
.btn-danger-solid { background: #dc2626; color: #fff; }
.btn-danger-solid:hover { filter: brightness(1.1); }

/* ---------- Cerrar sesión ---------- */
.logout-modal-container { max-width: 400px; }
.logout-modal-body { display: flex; flex-direction: column; align-items: center; padding: 34px 28px 28px; text-align: center; }
.logout-icon-wrapper {
  width: 58px; height: 58px;
  display: grid; place-items: center;
  margin-bottom: 18px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--bad) 12%, transparent);
  color: var(--bad);
}
.logout-icon-wrapper svg { width: 26px; height: 26px; }
.logout-modal-body h3 { margin: 0 0 8px; color: #fff; font-family: 'Oswald', sans-serif; font-size: 1.25rem; font-weight: 500; }
.logout-modal-body p { margin: 0 0 24px; color: var(--muted); font-size: .92rem; line-height: 1.5; }
.logout-modal-actions { width: 100%; display: flex; gap: 10px; }
.logout-modal-actions button { flex: 1; }

/* ---------- Foco ---------- */
.logout-btn:focus-visible, .action-btn:focus-visible, .close-btn:focus-visible, .stat-tile:focus-visible,
.status-ctrl-btn:focus-visible, .btn-delete:focus-visible, .btn-secondary:focus-visible,
.btn-primary:focus-visible, .btn-danger-solid:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes scaleUp { from { opacity: 0; transform: translateY(8px) scale(.97); } to { opacity: 1; transform: none; } }

/* ---------- Responsive ---------- */
@media (max-width: 900px) {
  .desktop-only { display: none; }
  .mobile-only { display: block; }
  .dashboard-wrapper { padding: 22px 14px 44px; }
  .stats-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .filters-bar { flex-direction: column; align-items: stretch; }
  .search-box, .status-filter-group { width: 100%; min-width: 0; }
}
@media (max-width: 650px) {
  .dashboard-wrapper { padding: 14px 10px 32px; }
  .dashboard-header { flex-direction: column; align-items: stretch; gap: 18px; padding: 22px 18px; }
  .header-actions-right { width: 100%; }
  .stats-pill, .logout-btn { flex: 1; justify-content: center; }
  .form-grid { grid-template-columns: 1fr; gap: 14px; }
  .modal-overlay { padding: 10px; align-items: flex-end; }
  .modal-container { max-height: 92vh; }
  .modal-header { padding: 0 18px; }
  .modal-body { padding: 18px; }
  .status-action-buttons { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .modal-footer-actions { flex-direction: column-reverse; align-items: stretch; }
  .right-actions { width: 100%; }
  .right-actions button, .btn-delete { flex: 1; width: 100%; }
}
@media (max-width: 430px) {
  .header-actions-right { flex-direction: column; }
  .stats-pill, .logout-btn { width: 100%; }
  .card-header-mobile { flex-direction: column; }
  .logout-modal-actions { flex-direction: column; }
}
@media (prefers-reduced-motion: reduce) {
  .dashboard-wrapper * { transition: none !important; }
  .modal-overlay, .modal-container { animation: none; }
}
</style>