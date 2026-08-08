<template>
  <HeadingRecepcion>
    <main class="main-content">
      <div class="header-section">
        <div class="header-titles">
          <h1 class="main-title">{{ t('configPageTitle') }} <span class="highlight">{{ t('configPageHighlight') }}</span></h1>
          <p class="subtitle">{{ t('configPageSubtitle') }}</p>
        </div>
        <button id="btn-guardar-cambios" class="btn-primary" @click="guardarCambios">
          <span>{{ t('saveChangesBtn') }}</span>
        </button>
      </div>

      <div class="panels-container">
        <section class="form-panel" id="panel-general">
          <div class="panel-header">
            <h2>{{ t('generalSectionTitle') }}</h2>
          </div>
          
          <div class="config-row" id="row-notificaciones">
            <div class="config-info">
              <label for="input-notificaciones">{{ t('notificationsLabel') }}</label>
              <p>{{ t('notificationsDesc') }}</p>
            </div>
            <label class="switch-container" :title="t('notificationsToggleTitle')" for="input-notificaciones">
              <input type="checkbox" id="input-notificaciones" v-model="settings.notificaciones" class="toggle-input">
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="config-row" id="row-tutorial">
            <div class="config-info">
              <label for="input-tutorial">{{ t('tutorialLabel') }}</label>
              <p>{{ t('tutorialDesc') }}</p>
            </div>
            <label class="switch-container" :title="t('tutorialToggleTitle')" for="input-tutorial">
              <input type="checkbox" id="input-tutorial" v-model="settings.tutorial" class="toggle-input">
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="config-row" id="row-idioma">
            <div class="config-info">
              <label for="select-idioma">{{ t('interfaceLanguageLabel') }}</label>
              <p>{{ t('interfaceLanguageDesc') }}</p>
            </div>
            <div class="select-wrapper">
              <select id="select-idioma" v-model="settings.idioma" @change="cambiarIdioma" class="font-select">
                <option value="es">{{ t('spanishOption') }}</option>
                <option value="en">{{ t('englishOption') }}</option>
              </select>
            </div>
          </div>
        </section>
      </div>

      <transition name="fade">
        <div v-if="toast.visible" id="toast-notification-box" class="toast-notification">
          {{ toast.message }}
        </div>
      </transition>
    </main>
  </HeadingRecepcion>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import HeadingRecepcion from './HeadingRecepcion.vue';
import { useLang } from './useLang.js';

const { setLang } = useLang();

const translations = {
  es: {
    configPageTitle: "Configuración",
    configPageHighlight: "General",
    configPageSubtitle: "Personaliza las preferencias principales de tu sistema.",
    saveChangesBtn: "Guardar Cambios",
    generalSectionTitle: "Preferencias del Sistema",
    notificationsLabel: "Notificaciones",
    notificationsDesc: "Configura tus preferencias de notificación en tiempo real.",
    notificationsToggleTitle: "Activar/Desactivar notificaciones",
    tutorialLabel: "Tutorial Interactivo",
    tutorialDesc: "Muestra las guías de ayuda al iniciar las vistas.",
    tutorialToggleTitle: "Activar/Desactivar tutorial",
    interfaceLanguageLabel: "Idioma de la Interfaz",
    interfaceLanguageDesc: "Selecciona el idioma principal de los textos.",
    spanishOption: "Español",
    englishOption: "English (Inglés)",
    toastRecepcionSaved: "Configuración guardada globalmente.",
    toastLocalSaved: "Configuración guardada localmente.",
    toastSaveError: "Error al guardar la configuración."
  },
  en: {
    configPageTitle: "System",
    configPageHighlight: "Configuration",
    configPageSubtitle: "Customize your main system preferences.",
    saveChangesBtn: "Save Changes",
    generalSectionTitle: "System Preferences",
    notificationsLabel: "Notifications",
    notificationsDesc: "Configure your real-time notification preferences.",
    notificationsToggleTitle: "Enable/Disable notifications",
    tutorialLabel: "Interactive Tutorial",
    tutorialDesc: "Show helper guides when entering views.",
    tutorialToggleTitle: "Enable/Disable tutorial",
    interfaceLanguageLabel: "Interface Language",
    interfaceLanguageDesc: "Select the primary display language.",
    spanishOption: "Spanish",
    englishOption: "English",
    toastRecepcionSaved: "Configuration saved globally.",
    toastLocalSaved: "Configuration saved locally.",
    toastSaveError: "Error saving configuration."
  }
};

const t = (key) => {
  return translations[settings.idioma]?.[key] || translations['es'][key] || key;
};

const settings = reactive({
  notificaciones: false,
  tutorial: localStorage.getItem('tutorialActivo') === 'true', 
  idioma: localStorage.getItem('recepcion-idioma') || 'es',
  densidad: localStorage.getItem('app-densidad') || 'normal',
  borderRadius: localStorage.getItem('app-radius') || '16px',
});

const cambiarIdioma = (event) => {
  const nuevoIdioma = event.target.value;
  settings.idioma = nuevoIdioma;
  setLang(nuevoIdioma);
};

const toast = reactive({ visible: false, message: '' });

const showToast = (msg) => {
  toast.message = msg;
  toast.visible = true;
  setTimeout(() => { toast.visible = false; }, 3000);
};

const guardarCambios = async () => {
  try {
    const userRole = localStorage.getItem('userRole') || 'Recepcion';

    localStorage.setItem('tutorialActivo', settings.tutorial);
    localStorage.setItem('recepcion-idioma', settings.idioma);
    
    window.dispatchEvent(new Event('tutorial-updated'));
    window.dispatchEvent(new CustomEvent('app-settings-updated', { detail: settings }));
    window.dispatchEvent(new CustomEvent('idioma-changed', { detail: { idioma: settings.idioma } }));

    if (settings.notificaciones) {
      await fetch('/api/notificaciones/activar', { method: 'POST' }).catch(() => {});
    }

    if (userRole === 'Recepcion') {
      try {
        await fetch('/api/Recepcion/configuracion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          },
          body: JSON.stringify({
            idioma: settings.idioma,
            tutorial: settings.tutorial
          })
        });
      } catch (backendError) {
        console.warn("Sincronización en la nube omitida temporalmente:", backendError);
      }
      showToast(t('toastRecepcionSaved'));
    } else {
      showToast(t('toastLocalSaved'));
    }
  } catch (error) {
    console.error("Error al guardar:", error);
    showToast(t('toastSaveError'));
  }
};

onMounted(async () => {
  window.addEventListener('idioma-changed', (e) => {
    if (e.detail && e.detail.idioma) {
      settings.idioma = e.detail.idioma;
    }
  });

  const userRole = localStorage.getItem('userRole') || 'Recepcion';
  if (userRole === 'Recepcion') {
    try {
      const res = await fetch('/api/Recepcion/configuracion', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.idioma) {
          settings.idioma = data.idioma;
          localStorage.setItem('recepcion-idioma', data.idioma);
        }
      }
    } catch (e) {}
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=Oswald:wght@400;600;700&display=swap');

.main-content { 
  padding: 48px 20px; 
  max-width: 800px; 
  margin: 0 auto; 
  color: var(--color-texto-general, #fff); 
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
}

.header-section { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 36px; 
  gap: 24px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 24px 28px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.header-titles {
  display: flex;
  flex-direction: column;
}

.main-title { 
  font-family: 'Anton', sans-serif; 
  font-size: 2.2rem; 
  margin: 0; 
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--color-titulos, #ffffff);
  line-height: 1.1;
}

.highlight { 
  color: var(--color-highlight, #3b82f6); 
}

.subtitle { 
  color: var(--color-texto-general, #94a3b8); 
  font-size: 0.9rem; 
  margin: 6px 0 0 0; 
}

.panels-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-panel { 
  background: var(--bg-cards, rgba(18, 18, 18, 0.8)); 
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08); 
  border-radius: 16px; 
  padding: 32px; 
  box-sizing: border-box;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.panel-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08); 
  padding-bottom: 14px;
  margin-bottom: 24px;
}

.panel-header h2 { 
  font-family: 'Oswald', sans-serif; 
  font-size: 1.15rem; 
  color: var(--color-highlight, #3b82f6);
  margin: 0; 
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.config-row { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding: 18px 0; 
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  gap: 24px;
}

.config-row:last-child { 
  border-bottom: none; 
  padding-bottom: 0; 
}

.config-row:first-of-type { 
  padding-top: 0; 
}

.config-info label { 
  font-family: 'Oswald', sans-serif; 
  display: block; 
  font-size: 1.05rem;
  color: var(--color-etiquetas, #f5f5f4);
  letter-spacing: 0.5px;
  cursor: pointer;
}

.config-info p { 
  font-size: 0.85rem; 
  color: var(--color-texto-general, #94a3b8); 
  margin: 4px 0 0 0; 
}

.switch-container {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
  flex-shrink: 0;
  cursor: pointer;
}

.toggle-input { 
  opacity: 0; 
  width: 0; 
  height: 0; 
}

.toggle-slider {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #262626;
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 2.5px;
  background-color: white;
  transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-radius: 50%;
}

.toggle-input:checked + .toggle-slider {
  background-color: var(--color-highlight, #3b82f6);
  border-color: var(--color-highlight, #3b82f6);
}

.toggle-input:checked + .toggle-slider:before {
  transform: translateX(23px);
}

.select-wrapper { 
  position: relative; 
  min-width: 200px; 
}

.font-select {
  background: rgba(15, 15, 15, 0.9);
  color: var(--color-etiquetas, #fff);
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  padding: 10px 16px;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
  width: 100%;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 16px;
  padding-right: 40px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.font-select:focus { 
  border-color: var(--color-highlight, #3b82f6); 
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.btn-primary { 
  background: var(--color-botones, #1c4fd6); 
  color: var(--color-texto-botones, #ffffff); 
  border: none; 
  padding: 12px 24px; 
  border-radius: 12px; 
  font-family: 'Oswald', sans-serif;
  font-weight: 600; 
  font-size: 0.95rem;
  letter-spacing: 0.5px;
  cursor: pointer; 
  text-transform: uppercase;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(28, 79, 214, 0.35);
  white-space: nowrap;
}

.btn-primary:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
  box-shadow: 0 6px 18px rgba(28, 79, 214, 0.5);
}

.btn-primary:active { 
  transform: scale(0.97); 
}

.toast-notification {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, #ffffff);
  padding: 16px 24px;
  border-radius: 12px;
  font-family: 'Oswald', sans-serif;
  letter-spacing: 0.5px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  z-index: 1000;
  border: 1px solid rgba(255,255,255,0.15);
}

.fade-enter-active, .fade-leave-active { 
  transition: opacity 0.3s ease, transform 0.3s ease; 
}
.fade-enter-from, .fade-leave-to { 
  opacity: 0; 
  transform: translateY(10px); 
}

@media (max-width: 768px) {
  .main-content { 
    padding: 16px; 
  }
  .header-section { 
    flex-direction: column; 
    align-items: flex-start; 
    gap: 16px; 
    padding: 20px;
  }
  .btn-primary { 
    width: 100%; 
  }
  .config-row { 
    flex-direction: column; 
    align-items: flex-start; 
    gap: 12px; 
  }
  .select-wrapper { 
    width: 100%; 
  }
}
</style>