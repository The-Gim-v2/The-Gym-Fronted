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

      <section class="form-panel">
        <div class="panel-header">
          <h2>Temas y Combinaciones Rápidas (24 Estilos)</h2>
          <button class="btn-reset-colors" @click="restaurarColoresPorDefecto" title="Volver a los colores iniciales">
            Restaurar Originales
          </button>
        </div>
        <div class="presets-grid">
          <button class="preset-btn" @click="aplicarPreset('gymFemenino')">🌸 Fit Femme (Gym)</button>
          <button class="preset-btn" @click="aplicarPreset('gymMasculino')">🏋️‍♂️ Iron Masculino</button>
          
          <button class="preset-btn" @click="aplicarPreset('lavenderChic')">💜 Lavender Chic</button>
          <button class="preset-btn" @click="aplicarPreset('coralPeach')">🍑 Coral Peach</button>
          <button class="preset-btn" @click="aplicarPreset('barbieVibe')">💖 Barbie Power</button>
          <button class="preset-btn" @click="aplicarPreset('velvetOrchid')">🌷 Velvet Orchid</button>
          <button class="preset-btn" @click="aplicarPreset('blushNude')">🩰 Blush Nude</button>
          <button class="preset-btn" @click="aplicarPreset('softMintGirl')">🌿 Mint Elegance</button>

          <button class="preset-btn" @click="aplicarPreset('steelIndustrial')">⚙️ Steel Industrial</button>
          <button class="preset-btn" @click="aplicarPreset('tacticalArmy')">🪖 Tactical Army</button>
          <button class="preset-btn" @click="aplicarPreset('carbonMatrix')">🏁 Carbon Matrix</button>
          <button class="preset-btn" @click="aplicarPreset('arcticIce')">❄️ Arctic Ice</button>
          <button class="preset-btn" @click="aplicarPreset('mafiaDark')">🕶️ Dark Syndicate</button>
          <button class="preset-btn" @click="aplicarPreset('copperOxide')">🔩 Copper Oxide</button>

          <button class="preset-btn" @click="aplicarPreset('cyberpunk')">⚡ Cyberpunk Blue</button>
          <button class="preset-btn" @click="aplicarPreset('esmeralda')">🟢 Esmeralda Pro</button>
          <button class="preset-btn" @click="aplicarPreset('sunset')">🌅 Sunset Orange</button>
          <button class="preset-btn" @click="aplicarPreset('minimal')">⚪ Minimal Clean</button>
          <button class="preset-btn" @click="aplicarPreset('deepMidnight')">🌙 Deep Midnight</button>
          <button class="preset-btn" @click="aplicarPreset('neonVibe')">💎 Neon Violet</button>
          <button class="preset-btn" @click="aplicarPreset('coffeeWarm')">☕ Warm Mocha</button>
          <button class="preset-btn" @click="aplicarPreset('royalGold')">👑 Royal Gold</button>
          <button class="preset-btn" @click="aplicarPreset('matrixCode')">💻 Matrix Green</button>
          <button class="preset-btn" @click="aplicarPreset('cherryBlossom')">🌸 Cherry Blossom</button>
        </div>
      </section>

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

      <section class="form-panel">
        <div class="panel-header">
          <h2>Apariencia Avanzada</h2>
        </div>
        
        <div class="config-row column-mobile">
          <div class="config-info">
            <label>Paleta de Colores Detallada</label>
            <p>Personaliza cada componente de la interfaz y el Heading de forma independiente.</p>
          </div>
          <div class="theme-controls">
            <div class="color-option">
              <span>Heading Sup.</span>
              <div class="color-picker-wrapper" :style="{ backgroundColor: settings.colors.headingBg }">
                <input type="color" v-model="settings.colors.headingBg">
              </div>
            </div>
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
              <span>Botones Fondo</span>
              <div class="color-picker-wrapper" :style="{ backgroundColor: settings.colors.botones }">
                <input type="color" v-model="settings.colors.botones">
              </div>
            </div>
            <div class="color-option">
              <span>Tarjetas</span>
              <div class="color-picker-wrapper" :style="{ backgroundColor: settings.colors.tarjetas }">
                <input type="color" v-model="settings.colors.tarjetas">
              </div>
            </div>
            <div class="color-option">
              <span>Titulares</span>
              <div class="color-picker-wrapper" :style="{ backgroundColor: settings.colors.titulos }">
                <input type="color" v-model="settings.colors.titulos">
              </div>
            </div>
            <div class="color-option">
              <span>Highlight</span>
              <div class="color-picker-wrapper" :style="{ backgroundColor: settings.colors.highlight }">
                <input type="color" v-model="settings.colors.highlight">
              </div>
            </div>
            <div class="color-option">
              <span>Etiquetas</span>
              <div class="color-picker-wrapper" :style="{ backgroundColor: settings.colors.etiquetas }">
                <input type="color" v-model="settings.colors.etiquetas">
              </div>
            </div>
            <div class="color-option">
              <span>Textos Gr.</span>
              <div class="color-picker-wrapper" :style="{ backgroundColor: settings.colors.textoGeneral }">
                <input type="color" v-model="settings.colors.textoGeneral">
              </div>
            </div>
            <div class="color-option">
              <span>Txt Botones</span>
              <div class="color-picker-wrapper" :style="{ backgroundColor: settings.colors.textoBotones }">
                <input type="color" v-model="settings.colors.textoBotones">
              </div>
            </div>
            <div class="color-option">
              <span>Iconos SVG</span>
              <div class="color-picker-wrapper" :style="{ backgroundColor: settings.colors.svgColor }">
                <input type="color" v-model="settings.colors.svgColor">
              </div>
            </div>
          </div>
        </div>

        <div class="config-row">
          <div class="config-info">
            <label>Densidad de la Interfaz</label>
            <p>Elige el espaciado general de los elementos.</p>
          </div>
          <div class="select-wrapper">
            <select v-model="settings.densidad" class="font-select">
              <option value="espacioso">Espacioso (Cómodo)</option>
              <option value="normal">Normal (Estándar)</option>
              <option value="compacto">Compacto (Más datos)</option>
            </select>
          </div>
        </div>

        <div class="config-row">
          <div class="config-info">
            <label>Estilo de Bordes</label>
            <p>Define la curvatura de los paneles y botones.</p>
          </div>
          <div class="select-wrapper">
            <select v-model="settings.borderRadius" class="font-select">
              <option value="8px">Cuadrado (Moderno)</option>
              <option value="16px">Suave (Estándar)</option>
              <option value="24px">Muy Redondeado</option>
            </select>
          </div>
        </div>
      </section>

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

// Valores por defecto iniciales detallados (incluyendo headingBg)
const defaultColors = { 
  headingBg: '#0b0b0e',
  tablas: '#111', 
  interfaz: '#0a0a0a', 
  botones: '#1c4fd6',
  tarjetas: '#121212',
  titulos: '#ffffff',
  highlight: '#3b82f6',
  etiquetas: '#f5f5f4',
  textoGeneral: '#94a3b8',
  textoBotones: '#ffffff',
  svgColor: '#ffffff'
};

// 24 Presets de colores combinados
const colorPresets = {
  // Gimnasio / Estilos Base
  gymFemenino: { headingBg: '#1f0a10', tablas: '#4a1525', interfaz: '#1f0a10', botones: '#db2777', tarjetas: '#2d101b', titulos: '#fff1f2', highlight: '#f472b6', etiquetas: '#fbcfe8', textoGeneral: '#f472b6', textoBotones: '#ffffff', svgColor: '#f472b6' },
  gymMasculino: { headingBg: '#09090b', tablas: '#18181b', interfaz: '#09090b', botones: '#2563eb', tarjetas: '#121216', titulos: '#ffffff', highlight: '#3b82f6', etiquetas: '#f4f4f5', textoGeneral: '#a1a1aa', textoBotones: '#ffffff', svgColor: '#3b82f6' },

  // Estilos Femeninos (1 a 6)
  lavenderChic: { headingBg: '#170d1f', tablas: '#311e3b', interfaz: '#170d1f', botones: '#9333ea', tarjetas: '#22132b', titulos: '#faf5ff', highlight: '#c084fc', etiquetas: '#e9d5ff', textoGeneral: '#d8b4fe', textoBotones: '#ffffff', svgColor: '#c084fc' },
  coralPeach: { headingBg: '#210d08', tablas: '#4a2318', interfaz: '#210d08', botones: '#f97316', tarjetas: '#30160f', titulos: '#fff7ed', highlight: '#fb923c', etiquetas: '#ffedd5', textoGeneral: '#fdba74', textoBotones: '#ffffff', svgColor: '#fb923c' },
  barbieVibe: { headingBg: '#220310', tablas: '#500724', interfaz: '#220310', botones: '#ec4899', tarjetas: '#38041a', titulos: '#fdf2f8', highlight: '#f472b6', etiquetas: '#fbcfe8', textoGeneral: '#f472b6', textoBotones: '#ffffff', svgColor: '#f472b6' },
  velvetOrchid: { headingBg: '#1a0711', tablas: '#3b1227', interfaz: '#1a0711', botones: '#be185d', tarjetas: '#290c1b', titulos: '#fdf4f8', highlight: '#f43f5e', etiquetas: '#fbcfe8', textoGeneral: '#fda4af', textoBotones: '#ffffff', svgColor: '#f43f5e' },
  blushNude: { headingBg: '#1c0f11', tablas: '#362224', interfaz: '#1c0f11', botones: '#d97706', tarjetas: '#261719', titulos: '#fef3c7', highlight: '#fbbf24', etiquetas: '#fde68a', textoGeneral: '#e5e7eb', textoBotones: '#ffffff', svgColor: '#fbbf24' },
  softMintGirl: { headingBg: '#081a14', tablas: '#133529', interfaz: '#081a14', botones: '#10b981', tarjetas: '#0e241c', titulos: '#ecfdf5', highlight: '#34d399', etiquetas: '#a7f3d0', textoGeneral: '#6ee7b7', textoBotones: '#ffffff', svgColor: '#34d399' },

  // Estilos Masculinos (7 a 12)
  steelIndustrial: { headingBg: '#0f172a', tablas: '#1e293b', interfaz: '#0f172a', botones: '#475569', tarjetas: '#141c2e', titulos: '#f8fafc', highlight: '#94a3b8', etiquetas: '#cbd5e1', textoGeneral: '#64748b', textoBotones: '#ffffff', svgColor: '#94a3b8' },
  tacticalArmy: { headingBg: '#10140d', tablas: '#222b1c', interfaz: '#10140d', botones: '#4d7c0f', tarjetas: '#171d13', titulos: '#f7fee7', highlight: '#84cc16', etiquetas: '#ecfccb', textoGeneral: '#a3e635', textoBotones: '#ffffff', svgColor: '#84cc16' },
  carbonMatrix: { headingBg: '#050505', tablas: '#121212', interfaz: '#050505', botones: '#e11d48', tarjetas: '#0a0a0a', titulos: '#fafafa', highlight: '#fb7185', etiquetas: '#f4f4f5', textoGeneral: '#a1a1aa', textoBotones: '#ffffff', svgColor: '#fb7185' },
  arcticIce: { headingBg: '#030c17', tablas: '#0c2340', interfaz: '#030c17', botones: '#0284c7', tarjetas: '#071628', titulos: '#f0f9ff', highlight: '#38bdf8', etiquetas: '#bae6fd', textoGeneral: '#7dd3fc', textoBotones: '#ffffff', svgColor: '#38bdf8' },
  mafiaDark: { headingBg: '#0d0d0d', tablas: '#1a1a1a', interfaz: '#0d0d0d', botones: '#d97706', tarjetas: '#141414', titulos: '#fffbeb', highlight: '#f59e0b', etiquetas: '#fde68a', textoGeneral: '#9ca3af', textoBotones: '#ffffff', svgColor: '#f59e0b' },
  copperOxide: { headingBg: '#120c0a', tablas: '#291e18', interfaz: '#120c0a', botones: '#ea580c', tarjetas: '#1c130f', titulos: '#fff7ed', highlight: '#f97316', etiquetas: '#fed7aa', textoGeneral: '#d1d5db', textoBotones: '#ffffff', svgColor: '#f97316' },

  // Estilos Adicionales (13 a 24)
  cyberpunk: { headingBg: '#05050a', tablas: '#111', interfaz: '#05050a', botones: '#f43f5e', tarjetas: '#0f0f17', titulos: '#ffffff', highlight: '#f43f5e', etiquetas: '#e2e8f0', textoGeneral: '#94a3b8', textoBotones: '#ffffff', svgColor: '#f43f5e' },
  esmeralda: { headingBg: '#022c22', tablas: '#064e3b', interfaz: '#022c22', botones: '#059669', tarjetas: '#065f46', titulos: '#ecfdf5', highlight: '#34d399', etiquetas: '#d1fae5', textoGeneral: '#a7f3d0', textoBotones: '#ffffff', svgColor: '#34d399' },
  sunset: { headingBg: '#431407', tablas: '#7c2d12', interfaz: '#431407', botones: '#ea580c', tarjetas: '#531908', titulos: '#fff7ed', highlight: '#fb923c', etiquetas: '#ffedd5', textoGeneral: '#fdba74', textoBotones: '#ffffff', svgColor: '#fb923c' },
  minimal: { headingBg: '#18181b', tablas: '#27272a', interfaz: '#18181b', botones: '#e4e4e7', tarjetas: '#202024', titulos: '#f4f4f5', highlight: '#a1a1aa', etiquetas: '#fafafa', textoGeneral: '#71717a', textoBotones: '#18181b', svgColor: '#e4e4e7' },
  deepMidnight: { headingBg: '#0f172a', tablas: '#1e1b4b', interfaz: '#0f172a', botones: '#6366f1', tarjetas: '#172033', titulos: '#f8fafc', highlight: '#818cf8', etiquetas: '#e2e8f0', textoGeneral: '#94a3b8', textoBotones: '#ffffff', svgColor: '#818cf8' },
  neonVibe: { headingBg: '#130525', tablas: '#2e1065', interfaz: '#130525', botones: '#a855f7', tarjetas: '#1e0b36', titulos: '#faf5ff', highlight: '#c084fc', etiquetas: '#f3e8ff', textoGeneral: '#d8b4fe', textoBotones: '#ffffff', svgColor: '#c084fc' },
  coffeeWarm: { headingBg: '#140c0a', tablas: '#291b16', interfaz: '#140c0a', botones: '#854d0e', tarjetas: '#1c120f', titulos: '#fefae0', highlight: '#ca8a04', etiquetas: '#fef08a', textoGeneral: '#d4d4d4', textoBotones: '#ffffff', svgColor: '#ca8a04' },
  royalGold: { headingBg: '#111005', tablas: '#2b260d', interfaz: '#111005', botones: '#ca8a04', tarjetas: '#1c1a0c', titulos: '#fefce8', highlight: '#eab308', etiquetas: '#fef08a', textoGeneral: '#d4d4d4', textoBotones: '#ffffff', svgColor: '#eab308' },
  matrixCode: { headingBg: '#021008', tablas: '#062312', interfaz: '#021008', botones: '#16a34a', tarjetas: '#04180d', titulos: '#f0fdf4', highlight: '#22c55e', etiquetas: '#dcfce7', textoGeneral: '#86efac', textoBotones: '#ffffff', svgColor: '#22c55e' },
  cherryBlossom: { headingBg: '#240a14', tablas: '#4d142b', interfaz: '#240a14', botones: '#e11d48', tarjetas: '#330d1d', titulos: '#fff1f2', highlight: '#fb7185', etiquetas: '#ffe4e6', textoGeneral: '#fda4af', textoBotones: '#ffffff', svgColor: '#fb7185' }
};

const settings = reactive({
  notificaciones: false,
  tutorial: localStorage.getItem('tutorialActivo') === 'true', 
  densidad: localStorage.getItem('app-densidad') || 'normal',
  borderRadius: localStorage.getItem('app-radius') || '16px',
  colors: JSON.parse(localStorage.getItem('app-colors')) || { ...defaultColors }
});

const showToast = (msg) => {
  toast.message = msg;
  toast.visible = true;
  setTimeout(() => { toast.visible = false; }, 3000);
};

const restaurarColoresPorDefecto = () => {
  settings.colors = { ...defaultColors };
  guardarCambios(); // También guarda automáticamente al restaurar
  showToast("Colores restaurados y guardados.");
};

const aplicarPreset = (tipoPreset) => {
  if (colorPresets[tipoPreset]) {
    settings.colors = { ...colorPresets[tipoPreset] };
    // Guardado automático inmediato al hacer clic en el tema
    localStorage.setItem('app-colors', JSON.stringify(settings.colors));
    aplicarEstilos();
    window.dispatchEvent(new CustomEvent('app-settings-updated', { detail: settings }));
    showToast(`Tema combinado '${tipoPreset}' aplicado y guardado.`);
  }
};

const guardarCambios = async () => {
  try {
    localStorage.setItem('tutorialActivo', settings.tutorial);
    localStorage.setItem('app-colors', JSON.stringify(settings.colors));
    localStorage.setItem('app-densidad', settings.densidad);
    localStorage.setItem('app-radius', settings.borderRadius);
    
    aplicarEstilos();
    
    window.dispatchEvent(new Event('tutorial-updated'));
    window.dispatchEvent(new CustomEvent('app-settings-updated', { detail: settings }));

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
  root.style.setProperty('--color-heading-bg', settings.colors.headingBg);
  root.style.setProperty('--color-tablas', settings.colors.tablas);
  root.style.setProperty('--color-interfaz', settings.colors.interfaz);
  root.style.setProperty('--color-botones', settings.colors.botones);
  root.style.setProperty('--bg-cards', settings.colors.tarjetas);
  root.style.setProperty('--bg-custom', settings.colors.interfaz);
  root.style.setProperty('--app-border-radius', settings.borderRadius);
  
  root.style.setProperty('--color-titulos', settings.colors.titulos);
  root.style.setProperty('--color-highlight', settings.colors.highlight);
  root.style.setProperty('--color-etiquetas', settings.colors.etiquetas);
  root.style.setProperty('--color-texto-general', settings.colors.textoGeneral);
  root.style.setProperty('--color-texto-botones', settings.colors.textoBotones);
  root.style.setProperty('--color-svg', settings.colors.svgColor);

  if (settings.densidad === 'compacto') {
    root.style.setProperty('--panel-padding', '16px');
    root.style.setProperty('--row-padding', '10px 0');
  } else if (settings.densidad === 'espacioso') {
    root.style.setProperty('--panel-padding', '38px');
    root.style.setProperty('--row-padding', '22px 0');
  } else {
    root.style.setProperty('--panel-padding', '30px');
    root.style.setProperty('--row-padding', '16px 0');
  }
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
  color: var(--color-texto-general, #fff); 
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
  color: var(--color-titulos, #ffffff) !important;
}

.highlight { color: var(--color-highlight, #3b82f6); }
.subtitle { color: var(--color-texto-general, #94a3b8); font-size: 0.95rem; margin-top: 5px; }

/* Botones de Presets */
.presets-grid {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  max-height: 240px;
  overflow-y: auto;
  padding-right: 4px;
}

.presets-grid::-webkit-scrollbar {
  width: 6px;
}
.presets-grid::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.preset-btn {
  background: var(--bg-custom, #141414);
  color: var(--color-etiquetas, #fff);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 8px 14px;
  border-radius: 8px;
  font-family: 'Oswald', sans-serif;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1 1 calc(33.333% - 10px);
  min-width: 140px;
  text-align: center;
}

.preset-btn:hover {
  border-color: var(--color-highlight, #3b82f6);
  background: rgba(59, 130, 246, 0.1);
}

/* Panels / Tarjetas dinámicas */
.form-panel { 
  background: var(--bg-cards, rgba(18, 18, 18, 0.75)); 
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.09); 
  border-radius: var(--app-border-radius, 20px); 
  padding: var(--panel-padding, 30px); 
  margin-bottom: 24px; 
  box-sizing: border-box;
  transition: padding 0.3s ease, border-radius 0.3s ease, background-color 0.3s ease;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08); 
  padding-bottom: 12px;
  margin-bottom: 20px;
  gap: 10px;
  flex-wrap: wrap;
}

.panel-header h2 { 
  font-family: 'Oswald', sans-serif; 
  font-size: 1.1rem; 
  color: var(--color-highlight, #5b8bf0);
  margin: 0; 
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-reset-colors {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--color-texto-general, #94a3b8);
  font-family: 'Oswald', sans-serif;
  font-size: 0.75rem;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-reset-colors:hover {
  border-color: var(--color-highlight, #3b82f6);
  color: var(--color-titulos, #ffffff);
  background: rgba(59, 130, 246, 0.1);
}

/* Config Rows dinámicos */
.config-row { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding: var(--row-padding, 16px 0); 
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  gap: 20px;
  transition: padding 0.3s ease;
}

.config-row:last-child { border-bottom: none; padding-bottom: 0; }
.config-row:first-of-type { padding-top: 0; }

.config-info label { 
  font-family: 'Oswald', sans-serif; 
  display: block; 
  font-size: 1rem;
  color: var(--color-etiquetas, #f5f5f4);
  letter-spacing: 0.5px;
}

.config-info p { 
  font-size: 0.85rem; 
  color: var(--color-texto-general, #94a3b8); 
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

.toggle-input { opacity: 0; width: 0; height: 0; }

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

/* Theme Controls */
.theme-controls { 
  display: flex; 
  gap: 16px; 
  font-family: 'Oswald', sans-serif; 
  flex-wrap: wrap;
}

.color-option { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 6px; 
  font-size: 0.8rem;
  color: var(--color-texto-general, #a1a1aa);
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

.color-picker-wrapper:hover { transform: scale(1.08); }

.color-picker-wrapper input[type="color"] {
  position: absolute;
  top: -50%; left: -50%;
  width: 200%; height: 200%;
  cursor: pointer;
  border: none;
  background: transparent;
}

/* Select Estilizado */
.select-wrapper { position: relative; min-width: 180px; }

.font-select {
  background: var(--bg-custom, #141414);
  color: var(--color-etiquetas, #fff);
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  padding: 10px 14px;
  border-radius: var(--app-border-radius, 12px);
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

/* Botones de Acción */
.btn-primary { 
  background: var(--color-botones, #1c4fd6); 
  color: var(--color-texto-botones, #ffffff); 
  border: none; 
  padding: 14px 24px; 
  border-radius: var(--app-border-radius, 12px); 
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

.export-actions { display: flex; gap: 10px; }

.btn-export { 
  background: var(--bg-custom, #141414); 
  color: var(--color-texto-botones, white); 
  border: 1.5px solid rgba(255, 255, 255, 0.12); 
  padding: 10px 18px; 
  border-radius: var(--app-border-radius, 12px); 
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
  stroke: var(--color-svg, #ffffff);
}

.btn-export:hover { 
  border-color: var(--color-highlight, #3b82f6); 
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-highlight, #60a5fa);
}

/* Toast Notificación */
.toast-notification {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, #ffffff);
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
    filter: brightness(0.9);
    box-shadow: 0 6px 18px rgba(28, 79, 214, 0.5);
  }
}

.btn-primary:active { transform: scale(0.96); }

@media (max-width: 768px) {
  .main-content { padding: 16px; }
  .header-section { flex-direction: column; align-items: flex-start; gap: 16px; }
  .btn-primary { width: 100%; }
  .config-row { flex-direction: column; align-items: flex-start; gap: 14px; padding: 16px 0; }
  .config-row .switch-container { align-self: flex-end; margin-top: -35px; }
  .column-mobile { align-items: flex-start; }
  .theme-controls { width: 100%; justify-content: space-between; }
  .export-actions { width: 100%; }
  .btn-export { flex: 1; justify-content: center; } 
  .select-wrapper { width: 100%; }
  .preset-btn { flex: 1 1 100%; }
}
</style>