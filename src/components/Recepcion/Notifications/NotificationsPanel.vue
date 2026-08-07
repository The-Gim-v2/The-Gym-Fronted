<template>
  <transition name="slide-fade">
    <div v-if="isOpen" class="notifications-panel">
      
      <div v-if="currentView === 'list'" class="view-content">
        <div class="panel-header">
          <h3>{{ t('notificationsTitle') }}</h3>
          <div class="header-actions">
            <button class="btn-pill" @click="$emit('mark-read')" :title="t('markReadTooltip')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>{{ t('readBtn') }}</span>
            </button>
            <button class="btn-icon" @click="currentView = 'settings'" :title="t('settingsTooltip')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </button>
            <button class="btn-icon" @click="$emit('close')" :title="t('closeTooltip')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>
        <div class="notifications-list">
          <div v-for="item in notifications" :key="item.id" class="notif-card">
            <div class="notif-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path></svg>
            </div>
            <div class="notif-content">
              <h4>{{ item.title }}</h4>
              <p>{{ item.message }}</p>
              <span class="timestamp">{{ item.time }}</span>
            </div>
            <div v-if="!item.read" class="dot-unread"></div>
          </div>
        </div>
      </div>

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

        <div class="notifications-list settings-scroll">
           
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

           <div class="settings-section-title">{{ t('typesSectionTitle') }}</div>
           
           <!-- Corrección aquí: Usar item.labelKey en lugar de item.key -->
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

           <div class="settings-section-title">{{ t('privacySectionTitle') }}</div>
           <div class="notif-card setting-item-card info-card">
              <div class="notif-content full-width">
                 <h4>{{ t('aiExternalTitle') }}</h4>
                 <p>{{ t('aiExternalDesc') }}</p>
              </div>
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
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps<{ isOpen: boolean, notifications: any[] }>();
const emit = defineEmits(['close', 'mark-read']);
const currentView = ref('list');

const currentLang = ref(localStorage.getItem('app-idioma') || 'es');

const handleLangChange = (e: Event) => {
  const customEvent = e as CustomEvent<{ idioma?: string }>;
  if (customEvent.detail && customEvent.detail.idioma) {
    currentLang.value = customEvent.detail.idioma;
  }
};

onMounted(() => {
  window.addEventListener('idioma-changed', handleLangChange as EventListener);
});

onUnmounted(() => {
  window.removeEventListener('idioma-changed', handleLangChange as EventListener);
});

// Tipado estricto para evitar el error de TypeScript en 'table'
const langData: Record<'es' | 'en', Record<string, string>> = {
  es: {
    notificationsTitle: 'Notificaciones',
    markReadTooltip: 'Marcar leídas',
    readBtn: 'Leídas',
    settingsTooltip: 'Configuración',
    closeTooltip: 'Cerrar',
    settingsSubtitle: 'Configura tus preferencias',
    backTooltip: 'Volver',
    pushSectionTitle: 'PUSH NOTIFICATIONS',
    pushDisabledTitle: 'Desactivadas',
    pushDisabledDesc: 'Alertas cuando la app está cerrada',
    activateBtn: 'Activar',
    generalSectionTitle: 'GENERAL',
    inAppTitle: 'In-App',
    inAppDesc: 'Campanita de notificaciones',
    soundTitle: 'Sonido',
    soundDesc: 'Al recibir notificación',
    typesSectionTitle: 'TIPOS DE NOTIFICACIÓN',
    privacySectionTitle: 'PRIVACIDAD E IA',
    aiExternalTitle: 'Servicios externos de IA',
    aiExternalDesc: 'Sin autorización. Las funciones de IA solicitarán permiso antes de enviar datos.',
    closeBtn: 'Cerrar',
    labelMessages: 'Mensajes',
    descMessages: 'Nuevos mensajes de chat',
    labelRoutines: 'Rutinas',
    descRoutines: 'Planes de entrenamiento',
    labelProgress: 'Progreso',
    descProgress: 'Hábitos, rachas y seguimiento diario',
    labelSchedule: 'Agenda',
    descSchedule: 'Citas y recordatorios',
    labelForms: 'Formularios',
    descForms: 'Encuestas y mediciones',
    labelSystem: 'Sistema',
    descSystem: 'Alertas del sistema'
  },
  en: {
    notificationsTitle: 'Notifications',
    markReadTooltip: 'Mark as read',
    readBtn: 'Read',
    settingsTooltip: 'Settings',
    closeTooltip: 'Close',
    settingsSubtitle: 'Configure your preferences',
    backTooltip: 'Back',
    pushSectionTitle: 'PUSH NOTIFICATIONS',
    pushDisabledTitle: 'Disabled',
    pushDisabledDesc: 'Alerts when the app is closed',
    activateBtn: 'Activate',
    generalSectionTitle: 'GENERAL',
    inAppTitle: 'In-App',
    inAppDesc: 'Notification bell',
    soundTitle: 'Sound',
    soundDesc: 'When receiving notification',
    typesSectionTitle: 'NOTIFICATION TYPES',
    privacySectionTitle: 'PRIVACY & AI',
    aiExternalTitle: 'External AI Services',
    aiExternalDesc: 'Unauthorized. AI features will request permission before sending data.',
    closeBtn: 'Close',
    labelMessages: 'Messages',
    descMessages: 'New chat messages',
    labelRoutines: 'Routines',
    descRoutines: 'Workout plans',
    labelProgress: 'Progress',
    descProgress: 'Habits, streaks and daily tracking',
    labelSchedule: 'Schedule',
    descSchedule: 'Appointments and reminders',
    labelForms: 'Forms',
    descForms: 'Surveys and measurements',
    labelSystem: 'System',
    descSystem: 'System alerts'
  }
};

const t = (key: string) => {
  const langKey = (currentLang.value === 'en' ? 'en' : 'es') as 'es' | 'en';
  const table = langData[langKey] || langData.es;
  return table[key] || langData.es[key] || key;
};

const settings = ref({
  inApp: true,
  sound: true
});

const notificationTypes = ref([
  { labelKey: 'labelMessages', descKey: 'descMessages', value: true },
  { labelKey: 'labelRoutines', descKey: 'descRoutines', value: true },
  { labelKey: 'labelProgress', descKey: 'descProgress', value: true },
  { labelKey: 'labelSchedule', descKey: 'descSchedule', value: true },
  { labelKey: 'labelForms', descKey: 'descForms', value: true },
  { labelKey: 'labelSystem', descKey: 'descSystem', value: true }
]);

const activatePush = () => {};

watch(() => props.isOpen, (val) => { if (val) currentView.value = 'list'; });
</script>

<style scoped>
.notifications-panel {
  position: fixed;
  top: 75px;
  right: 20px;
  width: 380px;
  max-height: 85vh;
  background: #17171c;
  border: 1px solid rgba(255, 255, 255, 0.14);
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
  background: #17171c;
}

.header-titles h3 {
  margin: 0;
  color: #fff;
  font-size: 1.05rem;
  font-weight: 600;
}

.panel-subtitle {
  font-size: 0.75rem;
  color: #9ca3af;
}

.notifications-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.settings-scroll {
  padding-bottom: 8px;
}

.settings-section-title {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #9ca3af;
  margin: 16px 8px 8px 8px;
}

.settings-section-title:first-of-type {
  margin-top: 4px;
}

.notif-card {
  padding: 14px;
  display: flex;
  gap: 14px;
  border-radius: var(--app-border-radius, 14px);
  background: #212128;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: background 0.2s, border-color 0.2s;
  cursor: pointer;
  position: relative;
  align-items: center;
  margin-bottom: 8px;
}

.notif-card:hover {
  background: #2a2a33;
  border-color: rgba(255, 255, 255, 0.1);
}

.notif-icon {
  width: 40px;
  height: 40px;
  background: rgba(59, 130, 246, 0.12);
  color: var(--color-highlight, #3b82f6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notif-content {
  flex: 1;
  min-width: 0;
}

.notif-content.full-width {
  width: 100%;
}

.notif-content h4 {
  margin: 0;
  font-size: 0.9rem;
  color: #fff;
  font-weight: 500;
}

.notif-content p {
  margin: 3px 0 0 0;
  font-size: 0.75rem;
  color: #a1a1aa;
  line-height: 1.3;
}

.timestamp {
  font-size: 0.7rem;
  color: #71717a;
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

.btn-pill {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: var(--color-highlight, #3b82f6);
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-pill:hover {
  background: rgba(255, 255, 255, 0.15);
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
  color: #d1d5db;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s, color 0.2s;
}

.btn-icon:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.toggle-switch {
  appearance: none;
  width: 40px;
  height: 22px;
  background: #3f3f46;
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
  background: #17171c;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.btn-close-large {
  width: 100%;
  background: #212128;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 11px;
  border-radius: var(--app-border-radius, 14px);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  text-align: center;
}

.btn-close-large:hover {
  background: #2a2a33;
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