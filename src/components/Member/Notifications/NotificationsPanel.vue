<template>
  <transition name="slide-fade">
    <div v-if="isOpen" ref="panelRef" class="notifications-panel glass-card-modal">
      
      <!-- VISTA 1: LISTA DE NOTIFICACIONES -->
      <div v-if="currentView === 'list'" class="view-content">
        <div class="panel-header">
          <h3>{{ t('notificationsTitle') }}</h3>
          <div class="header-actions">
            <!-- Botón de ajustes -->
            <button class="btn-icon" @click="currentView = 'settings'" :title="t('settingsTooltip')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </button>
            <!-- Botón cerrar principal -->
            <button class="btn-icon" @click="$emit('close')" :title="t('closeTooltip')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>

        <!-- Sub-pestañas: Todas / No Leídas / Leídas -->
        <div class="filter-tabs-bar">
          <button :class="['filter-btn', { active: listFilter === 'all' }]" @click="listFilter = 'all'">
            {{ t('filterAll') }}
          </button>
          <button :class="['filter-btn', { active: listFilter === 'unread' }]" @click="listFilter = 'unread'">
            {{ t('filterUnread') }}
          </button>
          <button :class="['filter-btn', { active: listFilter === 'read' }]" @click="listFilter = 'read'">
            {{ t('filterRead') }}
          </button>
        </div>

        <!-- Barra de Acciones Masivas (Seleccionar / Borrar / Marcar) -->
        <div class="bulk-actions-bar" v-if="filteredNotifications.length > 0">
          <label class="select-all-label">
            <input type="checkbox" class="custom-checkbox" :checked="isAllSelected" @change="toggleSelectAll" />
            <span>{{ t('selectAll') }}</span>
          </label>
          <div class="bulk-buttons" v-if="selectedIds.length > 0">
            <button class="btn-action-text" @click="markSelectedAsRead">{{ t('markAsReadBtn') }}</button>
            <button class="btn-action-text delete" @click="deleteSelected">{{ t('deleteSelectedBtn') }} ({{ selectedIds.length }})</button>
          </div>
          <div v-else class="bulk-buttons">
            <button class="btn-action-text delete" @click="deleteAll">{{ t('deleteAllBtn') }}</button>
          </div>
        </div>
        
        <div class="notifications-list custom-scroll">
          <div v-if="filteredNotifications.length === 0" class="empty-state">
            <p>{{ t('emptyList') }}</p>
          </div>

          <div v-for="item in filteredNotifications" :key="item.id" class="notif-card" :class="{ unread: !item.read }">
            <input type="checkbox" class="custom-checkbox card-checkbox" :value="item.id" v-model="selectedIds" />
            <div class="notif-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path></svg>
            </div>
            <div class="notif-content" @click="$emit('toggle-read', item.id)">
              <h4>{{ item.title }}</h4>
              <p>{{ item.message }}</p>
              <span class="timestamp">{{ item.time }}</span>
            </div>
            <div v-if="!item.read" class="dot-unread"></div>
          </div>
        </div>
      </div>

      <!-- VISTA 2: CONFIGURACIÓN -->
      <div v-else class="view-content">
        <div class="panel-header">
          <div class="header-titles">
            <h3>{{ t('notificationsTitle') }}</h3>
            <span class="panel-subtitle">{{ t('settingsSubtitle') }}</span>
          </div>
          <button class="btn-icon" @click="currentView = 'list'" :title="t('backTooltip')">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div class="notifications-list settings-scroll custom-scroll">
           
           <div class="settings-section-title">{{ t('pushSectionTitle') }}</div>
           <div class="notif-card setting-item-card banner-card">
              <div class="notif-icon">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13.73 21a2 2 0 0 1-3.46 0"></path><path d="M18.63 13A17.89 17.89 0 0 1 18 8"></path><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              </div>
              <div class="notif-content">
                 <h4>{{ t('pushDisabledTitle') }}</h4>
                 <p>{{ t('pushDisabledDesc') }}</p>
              </div>
              <button class="btn-pill-action" @click="activatePush">{{ t('activateBtn') }}</button>
           </div>

           <div class="settings-section-title">{{ t('generalSectionTitle') }}</div>
           
           <div class="notif-card setting-item-card">
              <div class="notif-icon">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path></svg>
              </div>
              <div class="notif-content">
                 <h4>{{ t('inAppTitle') }}</h4>
                 <p>{{ t('inAppDesc') }}</p>
              </div>
              <input type="checkbox" class="toggle-switch" v-model="settings.inApp" />
           </div>

           <div class="notif-card setting-item-card">
              <div class="notif-icon">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
              </div>
              <div class="notif-content">
                 <h4>{{ t('soundTitle') }}</h4>
                 <p>{{ t('soundDesc') }}</p>
              </div>
              <input type="checkbox" class="toggle-switch" v-model="settings.sound" />
           </div>

           <!-- Selector de Sonido Interactivo -->
           <div class="notif-card setting-item-card select-card" v-if="settings.sound">
              <div class="notif-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
              </div>
              <div class="notif-content">
                 <h4>{{ t('selectSoundTitle') }}</h4>
                 <p>{{ t('selectSoundDesc') }}</p>
              </div>
              <select class="sound-selector" v-model="settings.selectedSound" @change="previewSound">
                 <option value="bell">🔔 {{ t('soundBell') }}</option>
                 <option value="crystal">✨ {{ t('soundCrystal') }}</option>
                 <option value="marimba">🎶 {{ t('soundMarimba') }}</option>
                 <option value="digital">💻 {{ t('soundDigital') }}</option>
              </select>
           </div>

           <div class="settings-section-title">{{ t('typesSectionTitle') }}</div>
           
           <div v-for="item in notificationTypes" :key="item.labelKey" class="notif-card setting-item-card">
              <div class="notif-icon">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <div class="notif-content">
                 <h4>{{ t(item.labelKey) }}</h4>
                 <p>{{ t(item.descKey) }}</p>
              </div>
              <input type="checkbox" class="toggle-switch" v-model="item.value" />
           </div>

        </div>

        <div class="panel-footer-action">
           <button class="btn-close-large" @click="currentView = 'list'">{{ t('closeBtn') }}</button>
        </div>
      </div>

    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps<{ isOpen: boolean, notifications: any[] }>();
const emit = defineEmits(['close', 'mark-read', 'delete-notifications', 'toggle-read']);

const currentView = ref('list');
const listFilter = ref<'all' | 'unread' | 'read'>('all');
const selectedIds = ref<any[]>([]);
const panelRef = ref<HTMLElement | null>(null);

const currentLang = ref(localStorage.getItem('member-idioma') || 'es');

const handleLangChange = (e: Event) => {
  const customEvent = e as CustomEvent<{ idioma?: string }>;
  if (customEvent.detail && customEvent.detail.idioma) {
    currentLang.value = customEvent.detail.idioma;
  }
};

const handleClickOutside = (event: MouseEvent) => {
  if (props.isOpen && panelRef.value && !panelRef.value.contains(event.target as Node)) {
    emit('close');
  }
};

onMounted(() => {
  window.addEventListener('idioma-changed', handleLangChange as EventListener);
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('idioma-changed', handleLangChange as EventListener);
  document.removeEventListener('mousedown', handleClickOutside);
});

const langData: Record<'es' | 'en', Record<string, string>> = {
  es: {
    notificationsTitle: 'Notificaciones',
    settingsTooltip: 'Configuración',
    closeTooltip: 'Cerrar',
    settingsSubtitle: 'Configura tus preferencias',
    backTooltip: 'Volver',
    filterAll: 'Todas',
    filterUnread: 'No leídas',
    filterRead: 'Leídas',
    selectAll: 'Seleccionar todas',
    markAsReadBtn: 'Marcar leídas',
    deleteSelectedBtn: 'Eliminar',
    deleteAllBtn: 'Borrar todas',
    pushSectionTitle: 'PUSH NOTIFICATIONS',
    pushDisabledTitle: 'Desactivadas',
    pushDisabledDesc: 'Alertas cuando la app está cerrada',
    activateBtn: 'Activar',
    generalSectionTitle: 'GENERAL',
    inAppTitle: 'In-App',
    inAppDesc: 'Campanita de notificaciones',
    soundTitle: 'Sonido',
    soundDesc: 'Reproducir tono al recibir alertas',
    selectSoundTitle: 'Tono de alerta',
    selectSoundDesc: 'Elige tu sonido preferido',
    soundBell: 'Campana Clásica',
    soundCrystal: 'Cristal Suave',
    soundMarimba: 'Marimba Fit',
    soundDigital: 'Digital App',
    typesSectionTitle: 'TIPOS DE NOTIFICACIÓN',
    emptyList: 'No hay notificaciones en esta sección',
    closeBtn: 'Cerrar',
    labelMessages: 'Mensajes',
    descMessages: 'Nuevos mensajes de chat con tu coach',
    labelRoutines: 'Rutinas',
    descRoutines: 'Nuevos planes de entrenamiento',
    labelProgress: 'Progreso',
    descProgress: 'Hábitos, rachas y seguimiento',
    labelSchedule: 'Agenda',
    descSchedule: 'Citas y recordatorios de clases',
    labelForms: 'Formularios',
    descForms: 'Encuestas y mediciones corporales',
    labelSystem: 'Sistema',
    descSystem: 'Avisos importantes de la membresía'
  },
  en: {
    notificationsTitle: 'Notifications',
    settingsTooltip: 'Settings',
    closeTooltip: 'Close',
    settingsSubtitle: 'Configure your preferences',
    backTooltip: 'Back',
    filterAll: 'All',
    filterUnread: 'Unread',
    filterRead: 'Read',
    selectAll: 'Select all',
    markAsReadBtn: 'Mark read',
    deleteSelectedBtn: 'Delete',
    deleteAllBtn: 'Clear all',
    pushSectionTitle: 'PUSH NOTIFICATIONS',
    pushDisabledTitle: 'Disabled',
    pushDisabledDesc: 'Alerts when the app is closed',
    activateBtn: 'Activate',
    generalSectionTitle: 'GENERAL',
    inAppTitle: 'In-App',
    inAppDesc: 'Notification bell alerts',
    soundTitle: 'Sound',
    soundDesc: 'Play tone when alerts arrive',
    selectSoundTitle: 'Alert Tone',
    selectSoundDesc: 'Choose your preferred sound',
    soundBell: 'Classic Bell',
    soundCrystal: 'Soft Crystal',
    soundMarimba: 'Fit Marimba',
    soundDigital: 'Digital App',
    typesSectionTitle: 'NOTIFICATION TYPES',
    emptyList: 'No notifications in this section',
    closeBtn: 'Close',
    labelMessages: 'Messages',
    descMessages: 'New chat messages with your coach',
    labelRoutines: 'Routines',
    descRoutines: 'New workout plans',
    labelProgress: 'Progress',
    descProgress: 'Habits, streaks and tracking',
    labelSchedule: 'Schedule',
    descSchedule: 'Appointments and class reminders',
    labelForms: 'Forms',
    descForms: 'Surveys and body measurements',
    labelSystem: 'System',
    descSystem: 'Important membership notices'
  }
};

const t = (key: string) => {
  const langKey = (currentLang.value === 'en' ? 'en' : 'es') as 'es' | 'en';
  const table = langData[langKey] || langData.es;
  return table[key] || langData.es[key] || key;
};

const settings = ref({
  inApp: true,
  sound: true,
  selectedSound: 'bell'
});

const notificationTypes = ref([
  { labelKey: 'labelMessages', descKey: 'descMessages', value: true },
  { labelKey: 'labelRoutines', descKey: 'descRoutines', value: true },
  { labelKey: 'labelProgress', descKey: 'descProgress', value: true },
  { labelKey: 'labelSchedule', descKey: 'descSchedule', value: true },
  { labelKey: 'labelForms', descKey: 'descForms', value: true },
  { labelKey: 'labelSystem', descKey: 'descSystem', value: true }
]);

// Filtrado reactivo de notificaciones
const filteredNotifications = computed(() => {
  if (listFilter.value === 'unread') return props.notifications.filter(n => !n.read);
  if (listFilter.value === 'read') return props.notifications.filter(n => n.read);
  return props.notifications;
});

const isAllSelected = computed(() => {
  return filteredNotifications.value.length > 0 && selectedIds.value.length === filteredNotifications.value.length;
});

const toggleSelectAll = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.checked) {
    selectedIds.value = filteredNotifications.value.map(n => n.id);
  } else {
    selectedIds.value = [];
  }
};

const markSelectedAsRead = () => {
  emit('mark-read', selectedIds.value);
  selectedIds.value = [];
};

const deleteSelected = () => {
  emit('delete-notifications', selectedIds.value);
  selectedIds.value = [];
};

const deleteAll = () => {
  const allCurrentIds = filteredNotifications.value.map(n => n.id);
  emit('delete-notifications', allCurrentIds);
  selectedIds.value = [];
};

const activatePush = () => {};

// Simulación de audio al cambiar de tono de alerta
const previewSound = () => {
  if (!settings.value.sound) return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const typeMap: Record<string, { freq: number, type: OscillatorType }> = {
      bell: { freq: 587.33, type: 'sine' },
      crystal: { freq: 880, type: 'triangle' },
      marimba: { freq: 440, type: 'square' },
      digital: { freq: 750, type: 'sawtooth' }
    };
    
    const config = typeMap[settings.value.selectedSound] ?? typeMap.bell!;
    osc.type = config.type;
    osc.frequency.setValueAtTime(config.freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    // Manejo silencioso si el navegador bloquea audio sin interacción previa
  }
};

watch(() => props.isOpen, (val) => { 
  if (val) {
    currentView.value = 'list';
    selectedIds.value = [];
  } 
});
</script>

<style scoped>
.notifications-panel {
  position: fixed;
  top: 75px;
  right: 20px;
  width: 400px;
  max-height: 85vh;
   background: var(--bg-custom, var(--color-interfaz, #0a0a0a));
  border: 1px solid var(--app-border-color, rgba(255, 255, 255, 0.14));
  border-radius: var(--app-border-radius, 20px);
  display: flex;
  flex-direction: column;
  z-index: 2000;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.view-content {
  display: flex;
  flex-direction: column;
  max-height: 85vh;
  height: 100%;
}

.panel-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
  background: inherit;
}

.header-titles h3 {
  margin: 0;
  color: var(--app-text-primary, #fff);
  font-size: 1.05rem;
  font-weight: 600;
}

.panel-subtitle {
  font-size: 0.75rem;
  color: var(--app-text-secondary, #9ca3af);
}

/* Filtros de Pestañas (Todas / No leídas / Leídas) */
.filter-tabs-bar {
  display: flex;
  padding: 8px 12px;
  gap: 6px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.filter-btn {
  flex: 1;
  padding: 6px 0;
  background: transparent;
  border: none;
  border-radius: 10px;
  color: var(--app-text-secondary, #9ca3af);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn.active {
  background: rgba(255, 255, 255, 0.1);
  color: var(--app-text-primary, #fff);
  font-weight: 600;
}

/* Barra de Acciones Masivas */
.bulk-actions-bar {
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--app-bg-card-secondary, #212128);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.75rem;
}

.select-all-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--app-text-secondary, #9ca3af);
  cursor: pointer;
}

.bulk-buttons {
  display: flex;
  gap: 12px;
}

.btn-action-text {
  background: none;
  border: none;
  color: var(--color-highlight, #3b82f6);
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0;
}

.btn-action-text.delete {
  color: #ef4444;
}

.btn-action-text:hover {
  text-decoration: underline;
}

.notifications-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.empty-state {
  text-align: center;
  padding: 35px;
  color: var(--app-text-secondary, #9ca3af);
  font-size: 0.85rem;
}

.settings-scroll {
  padding-bottom: 8px;
}

.settings-section-title {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--app-text-secondary, #9ca3af);
  margin: 16px 8px 8px 8px;
}

.settings-section-title:first-of-type {
  margin-top: 4px;
}

.notif-card {
  padding: 14px;
  display: flex;
  gap: 12px;
  border-radius: var(--app-border-radius, 14px);
  background: var(--app-bg-card-secondary, #212128);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: background 0.2s, border-color 0.2s;
  cursor: pointer;
  position: relative;
  align-items: center;
  margin-bottom: 8px;
}

.notif-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
}

.custom-checkbox {
  appearance: none;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}

.custom-checkbox:checked {
  background: var(--color-highlight, #3b82f6);
  border-color: var(--color-highlight, #3b82f6);
}

.custom-checkbox:checked::after {
  content: '✔';
  font-size: 10px;
  color: #fff;
}

.notif-icon {
  width: 36px;
  height: 36px;
  background: rgba(59, 130, 246, 0.12);
  color: var(--color-highlight, #3b82f6);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notif-content {
  flex: 1;
  min-width: 0;
}

.notif-content h4 {
  margin: 0;
  font-size: 0.88rem;
  color: var(--app-text-primary, #fff);
  font-weight: 500;
}

.notif-content p {
  margin: 3px 0 0 0;
  font-size: 0.75rem;
  color: var(--app-text-secondary, #a1a1aa);
  line-height: 1.3;
}

.timestamp {
  font-size: 0.7rem;
  color: var(--app-text-muted, #71717a);
  display: block;
  margin-top: 4px;
}

.dot-unread {
  width: 8px;
  height: 8px;
  background: var(--color-highlight, #3b82f6);
  border-radius: 50%;
  position: absolute;
  right: 16px;
  top: 16px;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-pill-action {
  background: var(--color-highlight, #3b82f6);
  color: #fff;
  border: none;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-pill-action:hover {
  opacity: 0.9;
}

.btn-icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--app-text-primary, #d1d5db);
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s, color 0.2s;
}

.btn-icon:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

/* Selector de Sonido */
.sound-selector {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--app-text-primary, #fff);
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  outline: none;
  cursor: pointer;
}

.sound-selector option {
  background: #17171c;
  color: #fff;
}

.toggle-switch {
  appearance: none;
  width: 40px;
  height: 22px;
  background: var(--app-bg-switch, #3f3f46);
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s;
  outline: none;
  flex-shrink: 0;
}

.toggle-switch:checked {
  background: var(--color-highlight, #3b82f6);
}

.toggle-switch::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
}

.toggle-switch:checked::before {
  transform: translateX(18px);
}

.panel-footer-action {
  padding: 12px 16px;
  background: inherit;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.btn-close-large {
  width: 100%;
  background: var(--app-bg-card-secondary, #212128);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--app-text-primary, #fff);
  padding: 11px;
  border-radius: var(--app-border-radius, 14px);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  text-align: center;
}

.btn-close-large:hover {
  background: rgba(255, 255, 255, 0.06);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 480px) {
  .notifications-panel {
    top: 55px;
    right: 8px;
    left: 8px;
    width: auto;
    max-height: 88vh;
    border-radius: 16px;
  }
  
  .notif-card {
    padding: 12px;
    gap: 10px;
  }

  .panel-header {
    padding: 14px 16px;
  }
}
</style>