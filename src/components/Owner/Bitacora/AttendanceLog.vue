<template>
  <HeadingOwner>
    <NotificationSystem ref="toastRef" />
    <main class="main-content">
      <header class="header-section">
        <div class="title-wrapper">
          <h1 class="main-title">{{ t('asistenciaTitle') }} <span class="highlight">{{ t('semanalHighlight') }}</span></h1>
          <span class="title-underline"></span>
          <p class="main-subtitle">{{ t('pageSubtitle') }}</p>
        </div>

        <!-- ID 0 aplicado a la barra de acciones/filtros -->
        <div class="actions-bar" id="tutorial-step-0">
          <div class="select-wrapper">
            <svg class="select-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <select class="status-select" v-model="selectedDay">
                <option value="">{{ t('allDaysOption') }}</option>
                <option value="Lunes">{{ t('monday') }}</option>
                <option value="Martes">{{ t('tuesday') }}</option>
                <option value="Miercoles">{{ t('wednesday') }}</option>
                <option value="Jueves">{{ t('thursday') }}</option>
                <option value="Viernes">{{ t('friday') }}</option>
                <option value="Sabado">{{ t('saturday') }}</option>
                <option value="Domingo">{{ t('sunday') }}</option>
            </select>
            <svg class="select-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>

          <button class="btn-bulk" @click="activeModal = 'asistencias'">
              <span class="btn-bulk-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="18" height="18">
                    <path d="M18 20V10M12 20V4M6 20v-6"/>
                </svg>
              </span>
              <div class="btn-text-wrapper">
                  <span class="btn-label">{{ t('reportsLabel') }}</span>
                  <span class="highlight-text-custom">{{ t('viewGraph') }}</span>
              </div>
          </button>

          <div class="search-wrapper">
            <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" class="search-input" :placeholder="t('searchPlaceholder')" v-model="searchQuery">
          </div>
        </div>
      </header>

      <!-- VISTA ESCRITORIO (ID 1 aplicado solo si no es móvil) -->
      <div class="table-container desktop-only" :id="!isMobile ? 'tutorial-step-1' : undefined">
        <table class="user-table">
          <thead>
            <tr>
              <th>{{ t('colPhoto') }}</th>
              <th>{{ t('colName') }}</th>
              <th>{{ t('colEmail') }}</th>
              <th>{{ t('colMembership') }}</th>
              <th>{{ t('colExpiration') }}</th>
              <th>{{ t('colStatus') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td><div class="avatar-small" :style="avatarStyle(user.id)">{{ getInitials(user.name) }}</div></td>
              <td class="text-bold">{{ user.name }}</td>
              <td class="text-muted">{{ user.email }}</td>
              <td><span :class="['status-badge2', getMembershipClass(user.membership)]">{{ user.membership }}</span></td>
              <td class="text-muted">{{ user.expirationDate }}</td>
              <td><span :class="['status-badge', getStatusClass(user.status)]">{{ user.status }}</span></td>
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

      <!-- VISTA MÓVIL (ID 1 aplicado únicamente al primer elemento de la lista móvil) -->
      <div class="mobile-only">
        <div
          v-for="(user, index) in filteredUsers"
          :key="user.id"
          class="user-card"
          :class="getStatusClass(user.status)"
          :id="isMobile && index === 0 ? 'tutorial-step-1' : undefined"
        >
          <div class="card-top-section">
            <div class="avatar-small" :style="avatarStyle(user.id)">{{ getInitials(user.name) }}</div>
            <div class="card-user-titles">
              <div class="text-bold name-text">{{ user.name }}</div>
              <div class="badges-row">
                <span :class="['status-badge2', getMembershipClass(user.membership)]">{{ user.membership }}</span>
                <span :class="['status-badge', getStatusClass(user.status)]">{{ user.status }}</span>
              </div>
            </div>
          </div>

          <div class="card-meta">
            <span class="meta-row"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><span class="email-text">{{ user.email }}</span></span>
            <span class="meta-row expiration-warning"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg><span class="vence-label">{{ t('expiresLabel') }}:</span> {{ user.expirationDate }}</span>
            <span class="meta-row"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg><span class="phone-text">{{ user.phone }}</span></span>
          </div>
        </div>

        <div v-if="filteredUsers.length === 0" class="empty-state-mobile">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span>{{ t('emptyState') }}</span>
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
      <div v-if="activeModal === 'asistencias'" class="modal-wrapper" @click.self="activeModal = null">
        <Asistencias @close="activeModal = null" />
      </div>
    </transition>
  </HeadingOwner>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import HeadingOwner from '../HeadingOwner.vue';
import ModalComponent from '../../Modals/ModalComponent.vue';
import Asistencias from '../Componets/Attendance.vue';
import NotificationSystem from '../../Modals/NotificationSystem.vue';

interface User {
  id: number;
  name: string;
  email: string;
  expirationDate: string;
  status: string;
  phone: string;
  mensualidad: string;
  membership: string;
  dia: string;
}

const activeModal = ref<string | null>(null);
const toastRef = ref<any>(null);
const router = useRouter();
const showDelete = ref<boolean>(false);
const selectedUser = ref<User | null>(null);
const selectedDay = ref<string>('');
const searchQuery = ref<string>('');

const currentLang = ref<string>(localStorage.getItem('owner-idioma') || 'es');

const handleLangChange = (e: Event) => {
  const customEvent = e as CustomEvent<{ idioma?: string }>;
  if (customEvent.detail && customEvent.detail.idioma) {
    currentLang.value = customEvent.detail.idioma;
  }
};

onMounted(() => {
  window.addEventListener('idioma-changed', handleLangChange as EventListener);
  window.addEventListener('resize', updateWidth);
});

onUnmounted(() => {
  window.removeEventListener('idioma-changed', handleLangChange as EventListener);
  window.removeEventListener('resize', updateWidth);
});

const langData: Record<'es' | 'en', Record<string, string>> = {
  es: {
    asistenciaTitle: 'Asistencia',
    semanalHighlight: 'Semanal',
    pageSubtitle: 'Consulta y filtra la asistencia semanal de tus miembros.',
    allDaysOption: 'Dia Semanal (Todas)',
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miercoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sabado',
    sunday: 'Domingo',
    reportsLabel: 'Reportes',
    viewGraph: 'Ver Gráfica',
    searchPlaceholder: 'Buscar usuario...',
    colPhoto: 'Foto',
    colName: 'Nombre',
    colEmail: 'Correo',
    colMembership: 'Membresia',
    colExpiration: 'Fecha a Vencer',
    colStatus: 'Status',
    expiresLabel: 'Vence',
    emptyState: 'No se encontraron resultados con esos filtros.',
    deleteTitle: '¿Eliminar usuario?',
    deleteMsgPre: '¿Deseas eliminar a',
    deleteMsgPost: 'temporalmente?',
    cancelBtn: 'Cancelar',
    confirmBtn: 'Confirmar'
  },
  en: {
    asistenciaTitle: 'Weekly',
    semanalHighlight: 'Attendance',
    pageSubtitle: "Check and filter your members' weekly attendance.",
    allDaysOption: 'Weekday (All)',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
    reportsLabel: 'Reports',
    viewGraph: 'View Chart',
    searchPlaceholder: 'Search user...',
    colPhoto: 'Photo',
    colName: 'Name',
    colEmail: 'Email',
    colMembership: 'Membership',
    colExpiration: 'Expiration Date',
    colStatus: 'Status',
    expiresLabel: 'Expires',
    emptyState: 'No results found with those filters.',
    deleteTitle: 'Delete user?',
    deleteMsgPre: 'Do you want to temporarily delete',
    deleteMsgPost: '?',
    cancelBtn: 'Cancel',
    confirmBtn: 'Confirm'
  }
};

const t = (key: string) => {
  const langKey = (currentLang.value === 'en' ? 'en' : 'es') as 'es' | 'en';
  const table = langData[langKey] || langData.es;
  return table[key] || langData.es[key] || key;
};

const isMobile = ref<boolean>(window.innerWidth <= 900);
const updateWidth = () => {
  isMobile.value = window.innerWidth <= 900;
};

const users = ref<User[]>([
  { id: 1, name: 'Maria Luis Ramires Sanchez', email: 'Maria.luis@example.com', expirationDate: '18/03/2026', status: 'Activo', phone: '+52 481 123 4321', mensualidad: 'Mensual', membership: '2 Meses', dia: 'Lunes' },
  { id: 2, name: 'Francisco Luis Ramires Sanchez', email: 'Francisco.luis@example.com', expirationDate: '18/03/2026', status: 'Pendiente', phone: '+52 481 123 4321', mensualidad: 'Quincenal', membership: '1 Mes', dia: 'Martes' },
  { id: 3, name: 'Luis Ramires Sanchez', email: 'Luis.luis@example.com', expirationDate: '18/03/2026', status: 'Activo', phone: '+52 481 123 4321', mensualidad: 'Mensual', membership: '4 Meses', dia: 'Miercoles' },
  { id: 4, name: 'Jose Luis Ramires Sanchez', email: 'Jose.luis@example.com', expirationDate: '18/03/2026', status: 'Inactivo', phone: '+52 481 123 4321', mensualidad: 'Quincenal', membership: '1 Mes', dia: 'Jueves' },
  { id: 5, name: 'Mario Luis Ramires Sanchez', email: 'Mario.luis@example.com', expirationDate: '18/03/2026', status: 'Pendiente', phone: '+52 481 123 4321', mensualidad: 'Mensual', membership: '3 Meses', dia: 'Viernes' },
  { id: 6, name: 'Jesus Luis Ramires Sanchez', email: 'Jesus.luis@example.com', expirationDate: '18/03/2026', status: 'Inactivo', phone: '+52 481 123 4321', mensualidad: 'Quincenal', membership: '1 Mes', dia: 'Sabado' },
  { id: 7, name: 'Ana Luis Ramires Sanchez', email: 'Ana.luis@example.com', expirationDate: '18/03/2026', status: 'Activo', phone: '+52 481 123 4321', mensualidad: 'Mensual', membership: '2 Meses', dia: 'Martes' },
  { id: 8, name: 'Carlos Luis Ramires Sanchez', email: 'Carlos.luis@example.com', expirationDate: '18/03/2026', status: 'Pendiente', phone: '+52 481 123 4321', mensualidad: 'Quincenal', membership: '1 Mes', dia: 'Lunes' }
]);

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchStatus = selectedDay.value ? user.dia === selectedDay.value : true;

    const term = searchQuery.value.toLowerCase();
    const matchSearch =
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.membership.toLowerCase().includes(term) ||
      user.status.toLowerCase().includes(term) ||
      user.mensualidad.toLowerCase().includes(term) ||
      user.phone.toLowerCase().includes(term) ||
      user.expirationDate.toLowerCase().includes(term) ||
      user.id.toString().includes(term);

    return matchStatus && matchSearch;
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

const getStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    'Activo': 'status-green',
    'Inactivo': 'status-red',
    'Pendiente': 'status-orange',
    'Próximo a vencer': 'status-yellow'
  };
  return classes[status] || 'status-default';
};
</script>

<style scoped>
.main-content { padding: 30px 40px 60px; max-width: 1400px; margin: 0 auto; color: var(--color-texto-general, #e5e5e5); font-family: 'Inter', sans-serif; }

.header-section { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 26px; flex-wrap: wrap; gap: 20px; }
.title-wrapper { display: flex; flex-direction: column; gap: 4px; min-width: 260px; }
.main-title { font-family: 'Anton', sans-serif; font-size: clamp(1.6rem, 4vw, 2.2rem); color: var(--color-titulos, #fff); margin: 0; letter-spacing: 0.5px; text-transform: uppercase; }
.highlight { color: var(--color-highlight, #3b82f6); }
.title-underline { display: block; width: 60px; height: 4px; margin: 2px 0 4px; border-radius: 4px; background: linear-gradient(90deg, var(--color-highlight, #3b82f6), transparent); }
.main-subtitle { font-size: 0.85rem; color: rgba(245, 245, 244, 0.55); margin: 0; }

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

.actions-bar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }

.search-wrapper, .select-wrapper { position: relative; display: flex; align-items: center; }
.search-icon, .select-icon { position: absolute; left: 12px; color: rgba(245, 245, 244, 0.4); pointer-events: none; z-index: 1; }
.select-arrow { position: absolute; right: 12px; color: rgba(245, 245, 244, 0.4); pointer-events: none; }

.search-input, .status-select {
  background: rgba(0, 0, 0, 0.28);
  border: 1px solid var(--border-input, rgba(255, 255, 255, 0.1));
  padding: 11px 14px;
  border-radius: var(--app-border-radius, 10px);
  color: var(--color-texto-general, #fff);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: 'Inter', sans-serif;
}
.search-input { width: 230px; padding-left: 36px; }
.search-input:focus, .status-select:focus {
  border-color: var(--color-highlight, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.status-select {
  padding-left: 36px;
  padding-right: 30px;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  min-width: 175px;
}
.status-select option { background-color: #18181b; color: #fff; }

.btn-bulk {
  background: rgba(0, 0, 0, 0.28);
  border: 1px solid var(--border-input, rgba(255, 255, 255, 0.1));
  padding: 8px 16px 8px 8px;
  border-radius: var(--app-border-radius, 10px);
  color: var(--color-texto-general, #fff);
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  white-space: nowrap;
  font-size: 0.9rem;
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}
.btn-bulk-icon {
  width: 32px; height: 32px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border-radius: 8px;
  background: rgba(59, 130, 246, 0.14);
  color: var(--color-highlight, #3b82f6);
}
@media (hover: hover) {
  .btn-bulk:hover { background: rgba(255, 255, 255, 0.05); border-color: var(--color-highlight, #3b82f6); transform: translateY(-1px); }
}

.btn-text-wrapper { display: flex; flex-direction: column; align-items: flex-start; line-height: 1.15; }
.btn-label { font-size: 0.63rem; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(245, 245, 244, 0.5); font-weight: 600; font-family: 'Oswald', sans-serif; }
.highlight-text-custom { font-size: 0.95rem; font-weight: 700; color: var(--color-highlight-alt, #34d399); }

.badges-row { display: flex; gap: 8px; margin: 6px 0 0 0; flex-wrap: wrap; align-items: center; }

.card-meta { font-size: 0.83rem; color: rgba(245, 245, 244, 0.6); line-height: 1.4; display: flex; flex-direction: column; gap: 7px; padding-left: 2px; margin-top: 12px; }
.meta-row { display: flex; align-items: center; gap: 7px; }
.meta-row svg { flex-shrink: 0; opacity: 0.6; }
.email-text { color: rgba(147, 197, 253, 0.9); overflow-wrap: anywhere; }
.expiration-warning { color: #fb923c; font-weight: 500; }
.vence-label { color: #fb923c; }
.phone-text { color: rgba(245, 245, 244, 0.55); }

.membership-purple { background: rgba(126, 34, 206, 0.16); color: #c084fc; border-color: rgba(107, 33, 168, 0.5); }
.membership-orange { background: rgba(194, 65, 12, 0.16); color: #fb923c; border-color: rgba(154, 52, 18, 0.5); }
.membership-pink   { background: rgba(190, 24, 93, 0.16); color: #f472b6; border-color: rgba(157, 23, 77, 0.5); }
.membership-red    { background: rgba(153, 27, 27, 0.16); color: #f87171; border-color: rgba(127, 29, 29, 0.5); }
.membership-blue   { background: rgba(30, 64, 175, 0.16); color: #60a5fa; border-color: rgba(30, 58, 138, 0.5); }
.membership-green  { background: rgba(6, 78, 59, 0.16); color: #34d399; border-color: rgba(6, 78, 59, 0.5); }
.membership-default { background: #333; color: #fff; border-color: #555; }

.desktop-only { display: block; }
.mobile-only { display: none; }

@media (max-width: 900px) {
  .desktop-only { display: none; }
  .mobile-only { display: block; }
  .main-content { padding: 18px 14px 40px; }
  .header-section { flex-direction: column; align-items: stretch; gap: 16px; }

  .actions-bar { display: flex; flex-direction: column; gap: 10px; width: 100%; }
  .search-wrapper { order: -1; width: 100%; }
  .search-input { width: 100%; }
  .select-wrapper { width: 100%; order: 0; }
  .status-select { width: 100%; }
  .btn-bulk { width: 100%; order: 1; justify-content: center; padding: 12px; }
  .btn-text-wrapper { align-items: center; }

  .name-text { font-size: 0.95rem; line-height: 1.25; color: var(--color-titulos, #fff); font-weight: 600; }

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
  .user-card.status-green { border-left-color: #34d399; }
  .user-card.status-red { border-left-color: #f87171; }
  .user-card.status-orange { border-left-color: #fbbf24; }
  .user-card.status-yellow { border-left-color: #fef08a; }

  .card-top-section { display: flex; align-items: flex-start; gap: 12px; }

  .card-user-titles { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; flex: 1; min-width: 0; }
}

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

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.72rem;
  border: 1px solid;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: 'Oswald', sans-serif;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}
.status-badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; box-shadow: 0 0 5px currentColor; }

.status-green { background: rgba(6, 78, 59, 0.22); color: #34d399; border-color: rgba(6, 78, 59, 0.55); }
.status-red { background: rgba(153, 27, 27, 0.22); color: #f87171; border-color: rgba(153, 27, 27, 0.55); }
.status-orange { background: rgba(180, 83, 9, 0.22); color: #fbbf24; border-color: rgba(180, 83, 9, 0.55); }
.status-yellow { background: rgba(161, 161, 35, 0.22); color: #fef08a; border-color: rgba(161, 161, 35, 0.55); }
.status-default { background: #333; color: #fff; border-color: #555; }

.text-bold { font-weight: 600; color: var(--color-titulos, #fff); }
.status-badge2 { padding: 3px 11px; border-radius: 20px; font-size: 0.74rem; border: 1px solid; font-weight: 600; display: inline-block; }

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

.modal-body-custom { text-align: center; color: var(--color-texto-general, #fff); padding: 10px 5px; }
.modal-body-custom h2 { font-size: 1.3rem; margin-bottom: 10px; font-weight: 600; color: var(--color-titulos, #fff); }
.modal-body-custom p { color: var(--color-texto-secundario, #aaa); font-size: 0.9rem; margin-bottom: 20px; line-height: 1.5; }
.highlight-name { color: var(--color-titulos, #fff); font-weight: 600; }

.modal-icon-container { width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px auto; }
.danger-bg { background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.2); }

.modal-buttons { display: flex; gap: 10px; }
.btn-modal { flex: 1; padding: 10px; border-radius: var(--app-border-radius, 8px); font-size: 0.9rem; font-weight: 600; cursor: pointer; border: none; transition: opacity 0.2s; }
.btn-modal.secondary { background: rgba(255, 255, 255, 0.05); color: var(--color-texto-general, #ccc); border: 1px solid rgba(255, 255, 255, 0.1); }
.btn-modal.danger { background: #ef4444; color: white; }
.btn-modal:hover { opacity: 0.9; }
</style>