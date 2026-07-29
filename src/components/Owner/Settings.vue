<template>
  <HeadingOwner>
    <main class="main-content">
      <div class="header-section">
        <div>
          <h1 class="main-title">Configuración <span class="highlight">de la Página</span></h1>
          <p class="subtitle">Personaliza tu sitio web a tu manera.</p>
        </div>
        <button class="btn-primary" @click="guardarCambios">Guardar Cambios</button>
      </div>

      <!-- Sección General -->
      <section class="form-panel">
        <div class="panel-header"><h2>General</h2></div>
        
        <div class="config-row">
          <div class="config-info">
            <label>Notificaciones</label>
            <p>Configura tus preferencias de notificación.</p>
          </div>
          <label class="switch-container" title="Activar/Desactivar notificaciones">
            <input type="checkbox" v-model="settings.notificaciones" class="toggle-input">
            <span class="toggle-slider"></span>
          </label>
        </div>

        <div class="config-row">
          <div class="config-info">
            <label>Tutorial</label>
            <p>Aprende a utilizar todas las funcionalidades.</p>
          </div>
          <label class="switch-container" title="Activar/Desactivar tutorial">
            <input type="checkbox" v-model="settings.tutorial" class="toggle-input">
            <span class="toggle-slider"></span>
          </label>
        </div>
      </section>

      <!-- Apariencia -->
      <section class="form-panel">
        <div class="panel-header"><h2>Apariencia</h2></div>
        
        <div class="config-row column-mobile">
          <div class="config-info">
            <label>Tema de la Interfaz</label>
            <p>Altera el color de tu sitio web.</p>
          </div>
          <div class="theme-controls">
            <div class="color-option">
              <span>Tablas</span>
              <div class="color-picker-wrapper" :style="{ backgroundColor: settings.colors.tablas }">
                <input type="color" v-model="settings.colors.tablas">
              </div>
            </div>
            <div class="color-option">
              <span>Interfaz</span>
              <div class="color-picker-wrapper" :style="{ backgroundColor: settings.colors.interfaz }">
                <input type="color" v-model="settings.colors.interfaz">
              </div>
            </div>
            <div class="color-option">
              <span>Botones</span>
              <div class="color-picker-wrapper" :style="{ backgroundColor: settings.colors.botones }">
                <input type="color" v-model="settings.colors.botones">
              </div>
            </div>
          </div>
        </div>

        <div class="config-row">
          <div class="config-info">
            <label>Tamaño de Fuente</label>
            <p>Selecciona el tamaño base.</p>
          </div>
          <div class="select-wrapper">
            <select v-model="settings.fontSize" class="font-select">
              <option value="12">Pequeña (12px)</option>
              <option value="14">Normal (14px)</option>
              <option value="16">Grande (16px)</option>
              <option value="18">Extra Grande (18px)</option>
            </select>
          </div>
        </div>
      </section>

      <!-- Exportación -->
      <section class="form-panel">
        <div class="panel-header"><h2>Exportación de datos</h2></div>
        <div class="config-row">
          <div class="config-info">
            <label>Formato de exportación</label>
            <p>Formato al descargar bitácoras y respaldos.</p>
          </div>
          <div class="export-actions">
            <button class="btn-export excel" @click="exportar('excel')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line></svg>
              Excel
            </button>
            <button class="btn-export yml" @click="exportar('yml')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              YML
            </button>
          </div>
        </div>
      </section>

      <transition name="fade">
        <div v-if="toast.visible" class="toast-notification">
          {{ toast.message }}
        </div>
      </transition>
    </main>
  </HeadingOwner>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import HeadingOwner from './HeadingOwner.vue';

const toast = reactive({ visible: false, message: '' });

const settings = reactive({
  notificaciones: false,
  tutorial: localStorage.getItem('tutorialActivo') === 'true', 
  fontSize: localStorage.getItem('app-fontSize') || '14',
  colors: JSON.parse(localStorage.getItem('app-colors')) || { 
    tablas: '#3b82f6', 
    interfaz: '#1c4fd6', 
    botones: '#ffffff' 
  }
});

const showToast = (msg) => {
  toast.message = msg;
  toast.visible = true;
  setTimeout(() => { toast.visible = false; }, 3000);
};

const guardarCambios = async () => {
  try {
    localStorage.setItem('tutorialActivo', settings.tutorial);
    localStorage.setItem('app-colors', JSON.stringify(settings.colors));
    localStorage.setItem('app-fontSize', settings.fontSize);
    
    aplicarEstilos();
    window.dispatchEvent(new Event('tutorial-updated'));

    console.log("Guardando configuración...", settings);
    
    if (settings.notificaciones) {
      await fetch('/api/notificaciones/activar', { method: 'POST' }).catch(() => {});
    }
    showToast("Configuración guardada exitosamente.");
  } catch (error) {
    console.error("Error al guardar:", error);
    showToast("Error al guardar la configuración.");
  }
};

const aplicarEstilos = () => {
  const root = document.documentElement;
  root.style.setProperty('--color-tablas', settings.colors.tablas);
  root.style.setProperty('--color-interfaz', settings.colors.interfaz);
  root.style.setProperty('--color-botones', settings.colors.botones);
  root.style.setProperty('--base-font-size', settings.fontSize + 'px');
};

onMounted(() => {
  aplicarEstilos();
});

const exportar = async (tipo) => {
  try {
    const endpoint = tipo === 'excel' ? '/api/exportar/bitacoras' : '/api/exportar/basedatos';
    const response = await fetch(endpoint);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = tipo === 'excel' ? 'bitacora_completa.xlsx' : 'backup_db.yml';
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast(`Descargando archivo ${tipo.toUpperCase()}...`);
  } catch (error) {
    console.error(`Error al descargar ${tipo}:`, error);
    showToast(`Descargando archivo ${tipo.toUpperCase()} (Simulado)...`);
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=Oswald:wght@400;600;700&display=swap');

.main-content { 
  padding: 40px clamp(16px, 3vw, 40px); 
  max-width: 950px; 
  margin: 0 auto; 
  color: #fff; 
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
}

.header-section { 
  display: flex; 
  justify-content: space-between; 
  align-items: flex-end; 
  margin-bottom: 30px; 
  gap: 20px;
}

.main-title { 
  font-family: 'Anton', sans-serif; 
  font-size: 2.5rem; 
  margin: 0; 
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.highlight { color: #3b82f6; }
.subtitle { color: #94a3b8; font-size: 0.95rem; margin-top: 5px; }

/* Panels */
.form-panel { 
  background: rgba(18, 18, 18, 0.75); 
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.09); 
  border-radius: 20px; 
  padding: 30px; 
  margin-bottom: 24px; 
  box-sizing: border-box;
}

.panel-header h2 { 
  font-family: 'Oswald', sans-serif; 
  font-size: 1.1rem; 
  color: #5b8bf0;
  margin: 0 0 20px 0; 
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08); 
  padding-bottom: 12px; 
}

/* Config Rows */
.config-row { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding: 16px 0; 
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  gap: 20px;
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
  font-size: 1rem;
  color: #f5f5f4;
  letter-spacing: 0.5px;
}

.config-info p { 
  font-size: 0.85rem; 
  color: #94a3b8; 
  margin: 4px 0 0 0; 
}

/* Toggle Switch Moderno */
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
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.toggle-input:checked + .toggle-slider:before {
  transform: translateX(23px);
}

/* Theme Controls */
.theme-controls { 
  display: flex; 
  gap: 16px; 
  font-family: 'Oswald', sans-serif; 
}

.color-option { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 6px; 
  font-size: 0.8rem;
  color: #a1a1aa;
}

.color-picker-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  position: relative;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  transition: transform 0.2s;
}

.color-picker-wrapper:hover {
  transform: scale(1.08);
}

.color-picker-wrapper input[type="color"] {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  cursor: pointer;
  border: none;
  background: transparent;
}

/* Select Estilizado */
.select-wrapper {
  position: relative;
  min-width: 180px;
}

.font-select {
  background: #141414;
  color: white;
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  padding: 10px 14px;
  border-radius: 12px;
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
  border-color: #3b82f6; 
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

/* Botones de Acción */
.btn-primary { 
  background: #1c4fd6; 
  color: white; 
  border: none; 
  padding: 14px 24px; 
  border-radius: 12px; 
  font-family: 'Oswald', sans-serif;
  font-weight: 700; 
  font-size: 0.95rem;
  letter-spacing: 0.5px;
  cursor: pointer; 
  text-transform: uppercase;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 14px rgba(28, 79, 214, 0.35);
  white-space: nowrap;
}

.export-actions {
  display: flex;
  gap: 10px;
}

.btn-export { 
  background: #141414; 
  color: white; 
  border: 1.5px solid rgba(255, 255, 255, 0.12); 
  padding: 10px 18px; 
  border-radius: 12px; 
  cursor: pointer; 
  font-family: 'Oswald', sans-serif;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-export svg {
  width: 16px;
  height: 16px;
}

.btn-export:hover { 
  border-color: #3b82f6; 
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
}

/* Toast Notificación */
.toast-notification {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #1c4fd6;
  color: white;
  padding: 16px 24px;
  border-radius: 14px;
  font-family: 'Oswald', sans-serif;
  letter-spacing: 0.5px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  z-index: 1000;
  border: 1px solid rgba(255,255,255,0.15);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px); }

@media (hover: hover) {
  .btn-primary:hover {
    transform: translateY(-2px);
    background: #1742be;
    box-shadow: 0 6px 18px rgba(28, 79, 214, 0.5);
  }
}

.btn-primary:active { transform: scale(0.96); }

/* Responsive Media Queries */
@media (max-width: 768px) {
  .main-content { padding: 16px; }
  
  .header-section { 
    flex-direction: column; 
    align-items: flex-start; 
    gap: 16px; 
  }
  
  .btn-primary { width: 100%; }

  .config-row { 
    flex-direction: column; 
    align-items: flex-start; 
    gap: 14px;
    padding: 16px 0;
  }

  .config-row .switch-container {
    align-self: flex-end;
    margin-top: -35px;
  }

  .column-mobile {
    align-items: flex-start;
  }

  .theme-controls { 
    width: 100%; 
    justify-content: space-between; 
  }

  .export-actions {
    width: 100%;
  }

  .btn-export { 
    flex: 1; 
    justify-content: center;
  } 

  .select-wrapper {
    width: 100%;
  }
}
</style>