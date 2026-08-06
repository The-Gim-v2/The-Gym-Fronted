<template>
  <HeadingOwner>
    <main class="main-content">
      <div class="header-section">
        <div>
          <h1 class="main-title">Configuración <span class="highlight">de la Página</span></h1>
          <p class="subtitle">Personaliza tu sitio web a tu manera.</p>
        </div>
        <button id="btn-guardar-cambios" class="btn-primary" @click="guardarCambios">Guardar Cambios</button>
      </div>

      <section class="form-panel" id="panel-temas">
        <div class="panel-header">
          <h2>Temas y Combinaciones Rápidas (30 Estilos)</h2>
          <button id="btn-reset-colores" class="btn-reset-colors" @click="restaurarColoresPorDefecto" title="Volver a los colores iniciales">
            Restaurar Originales
          </button>
        </div>
        <div class="presets-grid">
          <button v-for="(preset, key) in colorPresets" :key="key" :id="`preset-${key}`" class="preset-btn" @click="aplicarPreset(key)">
            {{ preset.label }}
          </button>
        </div>
      </section>

      <section class="form-panel" id="panel-general">
        <div class="panel-header"><h2>General</h2></div>
        
        <div class="config-row" id="row-notificaciones">
          <div class="config-info">
            <label for="input-notificaciones">Notificaciones</label>
            <p>Configura tus preferencias de notificación.</p>
          </div>
          <label class="switch-container" title="Activar/Desactivar notificaciones" for="input-notificaciones">
            <input type="checkbox" id="input-notificaciones" v-model="settings.notificaciones" class="toggle-input">
            <span class="toggle-slider"></span>
          </label>
        </div>

        <div class="config-row" id="row-tutorial">
          <div class="config-info">
            <label for="input-tutorial">Tutorial</label>
            <p>Aprende a utilizar todas las funcionalidades.</p>
          </div>
          <label class="switch-container" title="Activar/Desactivar tutorial" for="input-tutorial">
            <input type="checkbox" id="input-tutorial" v-model="settings.tutorial" class="toggle-input">
            <span class="toggle-slider"></span>
          </label>
        </div>

        <div class="config-row" id="row-idioma">
          <div class="config-info">
            <label for="select-idioma">Idioma de la Interfaz</label>
            <p>Selecciona el idioma principal del sistema.</p>
          </div>
          <div class="select-wrapper">
            <select id="select-idioma" v-model="settings.idioma" class="font-select">
              <option value="es">Español</option>
              <option value="en">English (Inglés)</option>
              <option value="fr">Français (Francés)</option>
              <option value="pt">Português (Portugués)</option>
            </select>
          </div>
        </div>
      </section>

      <section class="form-panel" id="panel-apariencia-avanzada">
        <div class="panel-header">
          <h2>Apariencia Avanzada</h2>
        </div>
        
        <div class="config-row column-mobile" id="row-paleta-colores">
          <div class="config-info">
            <label>Paleta de Colores Detallada</label>
            <p>Personaliza cada componente de la interfaz y el Heading de forma independiente.</p>
          </div>
          
          <div class="color-grid">
            <div class="color-card" id="container-color-headingBg">
              <span class="color-label">Heading Sup.</span>
              <div class="color-picker-wrapper">
                <input type="color" id="color-headingBg" v-model="settings.colors.headingBg">
                <div class="color-preview" :style="{ backgroundColor: settings.colors.headingBg }"></div>
              </div>
            </div>

            <div class="color-card" id="container-color-tablas">
              <span class="color-label">Tablas</span>
              <div class="color-picker-wrapper">
                <input type="color" id="color-tablas" v-model="settings.colors.tablas">
                <div class="color-preview" :style="{ backgroundColor: settings.colors.tablas }"></div>
              </div>
            </div>

            <div class="color-card" id="container-color-interfaz">
              <span class="color-label">Interfaz</span>
              <div class="color-picker-wrapper">
                <input type="color" id="color-interfaz" v-model="settings.colors.interfaz">
                <div class="color-preview" :style="{ backgroundColor: settings.colors.interfaz }"></div>
              </div>
            </div>

            <div class="color-card" id="container-color-botones">
              <span class="color-label">Botones Fondo</span>
              <div class="color-picker-wrapper">
                <input type="color" id="color-botones" v-model="settings.colors.botones">
                <div class="color-preview" :style="{ backgroundColor: settings.colors.botones }"></div>
              </div>
            </div>

            <div class="color-card" id="container-color-tarjetas">
              <span class="color-label">Tarjetas</span>
              <div class="color-picker-wrapper">
                <input type="color" id="color-tarjetas" v-model="settings.colors.tarjetas">
                <div class="color-preview" :style="{ backgroundColor: settings.colors.tarjetas }"></div>
              </div>
            </div>

            <div class="color-card" id="container-color-titulos">
              <span class="color-label">Titulares</span>
              <div class="color-picker-wrapper">
                <input type="color" id="color-titulos" v-model="settings.colors.titulos">
                <div class="color-preview" :style="{ backgroundColor: settings.colors.titulos }"></div>
              </div>
            </div>

            <div class="color-card" id="container-color-highlight">
              <span class="color-label">Highlight</span>
              <div class="color-picker-wrapper">
                <input type="color" id="color-highlight" v-model="settings.colors.highlight">
                <div class="color-preview" :style="{ backgroundColor: settings.colors.highlight }"></div>
              </div>
            </div>

            <div class="color-card" id="container-color-etiquetas">
              <span class="color-label">Etiquetas</span>
              <div class="color-picker-wrapper">
                <input type="color" id="color-etiquetas" v-model="settings.colors.etiquetas">
                <div class="color-preview" :style="{ backgroundColor: settings.colors.etiquetas }"></div>
              </div>
            </div>

            <div class="color-card" id="container-color-textoGeneral">
              <span class="color-label">Textos Gr.</span>
              <div class="color-picker-wrapper">
                <input type="color" id="color-textoGeneral" v-model="settings.colors.textoGeneral">
                <div class="color-preview" :style="{ backgroundColor: settings.colors.textoGeneral }"></div>
              </div>
            </div>

            <div class="color-card" id="container-color-textoBotones">
              <span class="color-label">Txt Botones</span>
              <div class="color-picker-wrapper">
                <input type="color" id="color-textoBotones" v-model="settings.colors.textoBotones">
                <div class="color-preview" :style="{ backgroundColor: settings.colors.textoBotones }"></div>
              </div>
            </div>

            <div class="color-card" id="container-color-svgColor">
              <span class="color-label">Iconos SVG</span>
              <div class="color-picker-wrapper">
                <input type="color" id="color-svgColor" v-model="settings.colors.svgColor">
                <div class="color-preview" :style="{ backgroundColor: settings.colors.svgColor }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="config-row" id="row-densidad">
          <div class="config-info">
            <label for="select-densidad">Densidad de la Interfaz</label>
            <p>Elige el espaciado general de los elementos.</p>
          </div>
          <div class="select-wrapper">
            <select id="select-densidad" v-model="settings.densidad" class="font-select">
              <option value="espacioso">Espacioso (Cómodo)</option>
              <option value="normal">Normal (Estándar)</option>
              <option value="compacto">Compacto (Más datos)</option>
            </select>
          </div>
        </div>

        <div class="config-row" id="row-border-radius">
          <div class="config-info">
            <label for="select-border-radius">Estilo de Bordes</label>
            <p>Define la curvatura de los paneles y botones.</p>
          </div>
          <div class="select-wrapper">
            <select id="select-border-radius" v-model="settings.borderRadius" class="font-select">
              <option value="8px">Cuadrado (Moderno)</option>
              <option value="16px">Suave (Estándar)</option>
              <option value="24px">Muy Redondeado</option>
            </select>
          </div>
        </div>
      </section>

      <section class="form-panel" id="panel-exportacion">
        <div class="panel-header"><h2>Exportación de datos</h2></div>
        <div class="config-row">
          <div class="config-info">
            <label>Formato de exportación</label>
            <p>Formato al descargar bitácoras y respaldos.</p>
          </div>
          <div class="export-actions">
            <button id="btn-export-excel" class="btn-export excel" @click="exportar('excel')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line></svg>
              Excel
            </button>
            <button id="btn-export-yml" class="btn-export yml" @click="exportar('yml')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              YML
            </button>
          </div>
        </div>
      </section>

      <transition name="fade">
        <div v-if="toast.visible" id="toast-notification-box" class="toast-notification">
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

const colorPresets = {
  // Temas Femeninos / Suaves / Estéticos
  gymFemenino: { label: '🌸 Fit Femme (Gym)', colors: { headingBg: '#1f0d14', tablas: '#2a121b', interfaz: '#16080e', botones: '#db2777', tarjetas: '#200b12', titulos: '#fff1f2', highlight: '#f472b6', etiquetas: '#fbcfe8', textoGeneral: '#f472b6', textoBotones: '#ffffff', svgColor: '#f472b6' } },
  barbieVibe: { label: '💖 Barbie Power', colors: { headingBg: '#240615', tablas: '#3b0a22', interfaz: '#1c030f', botones: '#ec4899', tarjetas: '#2c071a', titulos: '#fdf2f8', highlight: '#f472b6', etiquetas: '#fbcfe8', textoGeneral: '#f472b6', textoBotones: '#ffffff', svgColor: '#f472b6' } },
  lavenderChic: { label: '💜 Lavender Chic', colors: { headingBg: '#190e24', tablas: '#281738', interfaz: '#12091a', botones: '#9333ea', tarjetas: '#1e112b', titulos: '#faf5ff', highlight: '#c084fc', etiquetas: '#e9d5ff', textoGeneral: '#d8b4fe', textoBotones: '#ffffff', svgColor: '#c084fc' } },
  velvetOrchid: { label: '🌷 Velvet Orchid', colors: { headingBg: '#1f0814', tablas: '#331022', interfaz: '#14050d', botones: '#be185d', tarjetas: '#210a17', titulos: '#fdf4f8', highlight: '#f43f5e', etiquetas: '#fbcfe8', textoGeneral: '#fda4af', textoBotones: '#ffffff', svgColor: '#f43f5e' } },
  blushNude: { label: '🩰 Blush Nude', colors: { headingBg: '#1f1214', tablas: '#2e1c1f', interfaz: '#140a0c', botones: '#b45309', tarjetas: '#211315', titulos: '#fef3c7', highlight: '#fbbf24', etiquetas: '#fde68a', textoGeneral: '#d1d5db', textoBotones: '#ffffff', svgColor: '#fbbf24' } },
  coralPeach: { label: '🍑 Coral Peach', colors: { headingBg: '#24100b', tablas: '#3b1d14', interfaz: '#170b07', botones: '#f97316', tarjetas: '#26130e', titulos: '#fff7ed', highlight: '#fb923c', etiquetas: '#ffedd5', textoGeneral: '#fdba74', textoBotones: '#ffffff', svgColor: '#fb923c' } },
  softMintGirl: { label: '🌿 Mint Elegance', colors: { headingBg: '#091c16', tablas: '#112e24', interfaz: '#05120e', botones: '#10b981', tarjetas: '#0c211a', titulos: '#ecfdf5', highlight: '#34d399', etiquetas: '#a7f3d0', textoGeneral: '#6ee7b7', textoBotones: '#ffffff', svgColor: '#34d399' } },
  cherryBlossom: { label: '🌸 Cherry Blossom', colors: { headingBg: '#260c17', tablas: '#3d1425', interfaz: '#19070f', botones: '#e11d48', tarjetas: '#2b0e1b', titulos: '#fff1f2', highlight: '#fb7185', etiquetas: '#ffe4e6', textoGeneral: '#fda4af', textoBotones: '#ffffff', svgColor: '#fb7185' } },
  neonVibe: { label: '💎 Neon Violet', colors: { headingBg: '#16072b', tablas: '#271047', interfaz: '#0f0420', botones: '#a855f7', tarjetas: '#1c0a36', titulos: '#faf5ff', highlight: '#c084fc', etiquetas: '#f3e8ff', textoGeneral: '#d8b4fe', textoBotones: '#ffffff', svgColor: '#c084fc' } },
  sunset: { label: '🌅 Sunset Orange', colors: { headingBg: '#3b160b', tablas: '#5c2211', interfaz: '#260e07', botones: '#ea580c', tarjetas: '#42190d', titulos: '#fff7ed', highlight: '#fb923c', etiquetas: '#ffedd5', textoGeneral: '#fdba74', textoBotones: '#ffffff', svgColor: '#fb923c' } },

  // Temas Masculinos / Sobrios / Industriales / Gym
  gymMasculino: { label: '🏋️‍♂️ Iron Masculino', colors: { headingBg: '#0d0d12', tablas: '#181822', interfaz: '#09090e', botones: '#2563eb', tarjetas: '#13131c', titulos: '#ffffff', highlight: '#3b82f6', etiquetas: '#f4f4f5', textoGeneral: '#a1a1aa', textoBotones: '#ffffff', svgColor: '#3b82f6' } },
  steelIndustrial: { label: '⚙️ Steel Industrial', colors: { headingBg: '#111827', tablas: '#1f2937', interfaz: '#0b0f19', botones: '#475569', tarjetas: '#141c2e', titulos: '#f8fafc', highlight: '#94a3b8', etiquetas: '#cbd5e1', textoGeneral: '#94a3b8', textoBotones: '#ffffff', svgColor: '#94a3b8' } },
  tacticalArmy: { label: '🪖 Tactical Army', colors: { headingBg: '#12170f', tablas: '#222b1c', interfaz: '#0c0f0a', botones: '#4d7c0f', tarjetas: '#171f13', titulos: '#f7fee7', highlight: '#84cc16', etiquetas: '#ecfccb', textoGeneral: '#a3e635', textoBotones: '#ffffff', svgColor: '#84cc16' } },
  carbonMatrix: { label: '🏁 Carbon Matrix', colors: { headingBg: '#080808', tablas: '#141414', interfaz: '#030303', botones: '#e11d48', tarjetas: '#0d0d0d', titulos: '#fafafa', highlight: '#fb7185', etiquetas: '#f4f4f5', textoGeneral: '#a1a1aa', textoBotones: '#ffffff', svgColor: '#fb7185' } },
  arcticIce: { label: '❄️ Arctic Ice', colors: { headingBg: '#07111e', tablas: '#0f243d', interfaz: '#040a12', botones: '#0284c7', tarjetas: '#0a1728', titulos: '#f0f9ff', highlight: '#38bdf8', etiquetas: '#bae6fd', textoGeneral: '#7dd3fc', textoBotones: '#ffffff', svgColor: '#38bdf8' } },
  mafiaDark: { label: '🕶️ Dark Syndicate', colors: { headingBg: '#121212', tablas: '#1f1f1f', interfaz: '#0a0a0a', botones: '#d97706', tarjetas: '#161616', titulos: '#fffbeb', highlight: '#f59e0b', etiquetas: '#fde68a', textoGeneral: '#9ca3af', textoBotones: '#ffffff', svgColor: '#f59e0b' } },
  copperOxide: { label: '🔩 Copper Oxide', colors: { headingBg: '#17100c', tablas: '#2b1f18', interfaz: '#0f0a08', botones: '#ea580c', tarjetas: '#1f1510', titulos: '#fff7ed', highlight: '#f97316', etiquetas: '#fed7aa', textoGeneral: '#d1d5db', textoBotones: '#ffffff', svgColor: '#f97316' } },
  cyberpunk: { label: '⚡ Cyberpunk Blue', colors: { headingBg: '#0a0a14', tablas: '#16162b', interfaz: '#05050d', botones: '#f43f5e', tarjetas: '#0f0f1f', titulos: '#ffffff', highlight: '#f43f5e', etiquetas: '#e2e8f0', textoGeneral: '#94a3b8', textoBotones: '#ffffff', svgColor: '#f43f5e' } },
  esmeralda: { label: '🟢 Esmeralda Pro', colors: { headingBg: '#04241d', tablas: '#063b30', interfaz: '#021712', botones: '#059669', tarjetas: '#052b22', titulos: '#ecfdf5', highlight: '#34d399', etiquetas: '#d1fae5', textoGeneral: '#a7f3d0', textoBotones: '#ffffff', svgColor: '#34d399' } },
  minimal: { label: '⚪ Minimal Clean', colors: { headingBg: '#1c1c21', tablas: '#2a2a33', interfaz: '#121215', botones: '#e4e4e7', tarjetas: '#202026', titulos: '#f4f4f5', highlight: '#a1a1aa', etiquetas: '#fafafa', textoGeneral: '#a1a1aa', textoBotones: '#18181b', svgColor: '#e4e4e7' } },

  // Otros temas balanceados profesionales
  deepMidnight: { label: '🌙 Deep Midnight', colors: { headingBg: '#111827', tablas: '#1e1b4b', interfaz: '#0b0f19', botones: '#6366f1', tarjetas: '#172033', titulos: '#f8fafc', highlight: '#818cf8', etiquetas: '#e2e8f0', textoGeneral: '#94a3b8', textoBotones: '#ffffff', svgColor: '#818cf8' } },
  coffeeWarm: { label: '☕ Warm Mocha', colors: { headingBg: '#19110e', tablas: '#2e1e19', interfaz: '#0f0a08', botones: '#b45309', tarjetas: '#211613', titulos: '#fefae0', highlight: '#d97706', etiquetas: '#fef08a', textoGeneral: '#d4d4d4', textoBotones: '#ffffff', svgColor: '#d97706' } },
  royalGold: { label: '👑 Royal Gold', colors: { headingBg: '#171508', tablas: '#2e290f', interfaz: '#0f0d04', botones: '#ca8a04', tarjetas: '#211d0a', titulos: '#fefce8', highlight: '#eab308', etiquetas: '#fef08a', textoGeneral: '#d4d4d4', textoBotones: '#ffffff', svgColor: '#eab308' } },
  matrixCode: { label: '💻 Matrix Green', colors: { headingBg: '#031c0e', tablas: '#073319', interfaz: '#010d06', botones: '#16a34a', tarjetas: '#052412', titulos: '#f0fdf4', highlight: '#22c55e', etiquetas: '#dcfce7', textoGeneral: '#86efac', textoBotones: '#ffffff', svgColor: '#22c55e' } },
  electricLime: { label: '⚡ Electric Lime', colors: { headingBg: '#0d1a0d', tablas: '#1a331a', interfaz: '#070f07', botones: '#65a30d', tarjetas: '#122412', titulos: '#f7fee7', highlight: '#bef264', etiquetas: '#ecfccb', textoGeneral: '#a3e635', textoBotones: '#ffffff', svgColor: '#bef264' } },
  crimsonPower: { label: '🩸 Crimson Power', colors: { headingBg: '#210808', tablas: '#3d0c0c', interfaz: '#140303', botones: '#dc2626', tarjetas: '#2b0a0a', titulos: '#fef2f2', highlight: '#f87171', etiquetas: '#fee2e2', textoGeneral: '#fca5a5', textoBotones: '#ffffff', svgColor: '#f87171' } },
  titaniumPro: { label: '🦾 Titanium Pro', colors: { headingBg: '#111827', tablas: '#1f2937', interfaz: '#0b0f19', botones: '#374151', tarjetas: '#161e2e', titulos: '#ffffff', highlight: '#60a5fa', etiquetas: '#e5e7eb', textoGeneral: '#9ca3af', textoBotones: '#ffffff', svgColor: '#60a5fa' } },
  solarFlare: { label: '☀️ Solar Flare', colors: { headingBg: '#241702', tablas: '#402a04', interfaz: '#140d01', botones: '#d97706', tarjetas: '#2e1e03', titulos: '#fffbeb', highlight: '#fbbf24', etiquetas: '#fef3c7', textoGeneral: '#fcd34d', textoBotones: '#ffffff', svgColor: '#fbbf24' } },
  toxicCyber: { label: '☣️ Toxic Cyber', colors: { headingBg: '#031c16', tablas: '#073b2e', interfaz: '#010f0b', botones: '#0d9488', tarjetas: '#052920', titulos: '#f0fdfa', highlight: '#2dd4bf', etiquetas: '#ccfbf1', textoGeneral: '#5eead4', textoBotones: '#ffffff', svgColor: '#2dd4bf' } },
  zenithBlue: { label: '🌐 Zenith Blue', colors: { headingBg: '#0d132e', tablas: '#182452', interfaz: '#070a1a', botones: '#3b82f6', tarjetas: '#131b3b', titulos: '#eff6ff', highlight: '#60a5fa', etiquetas: '#dbeafe', textoGeneral: '#93c5fd', textoBotones: '#ffffff', svgColor: '#60a5fa' } }
};

const settings = reactive({
  notificaciones: false,
  tutorial: localStorage.getItem('tutorialActivo') === 'true', 
  idioma: localStorage.getItem('app-idioma') || 'es',
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
  guardarCambios(); 
  showToast("Colores restaurados y guardados.");
};

const aplicarPreset = (tipoPreset) => {
  if (colorPresets[tipoPreset]) {
    settings.colors = { ...colorPresets[tipoPreset].colors };
    localStorage.setItem('app-colors', JSON.stringify(settings.colors));
    aplicarEstilos();
    window.dispatchEvent(new CustomEvent('app-settings-updated', { detail: settings }));
    showToast(`Tema combinado '${colorPresets[tipoPreset].label}' aplicado y guardado.`);
  }
};

const guardarCambios = async () => {
  try {
    localStorage.setItem('tutorialActivo', settings.tutorial);
    localStorage.setItem('app-idioma', settings.idioma);
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

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(105px, 1fr));
  gap: 12px;
  width: 100%;
}

.color-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 10px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  transition: all 0.2s ease;
}

.color-card:hover {
  border-color: var(--color-highlight, rgba(34, 197, 94, 0.4));
  background: rgba(255, 255, 255, 0.05);
}

.color-label {
  font-family: 'Oswald', sans-serif;
  font-size: 0.75rem;
  color: var(--color-etiquetas, #d4d4d8);
  text-align: center;
  line-height: 1.2;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-picker-wrapper {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  transition: transform 0.2s;
}

.color-picker-wrapper:hover { transform: scale(1.08); }

.color-picker-wrapper input[type="color"] {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.color-preview {
  width: 100%;
  height: 100%;
  border-radius: 6px;
}

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
  .export-actions { width: 100%; }
  .btn-export { flex: 1; justify-content: center; } 
  .select-wrapper { width: 100%; }
  .preset-btn { flex: 1 1 100%; }
}

@media (max-width: 480px) {
  .color-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  .color-card {
    padding: 8px 4px;
  }
}
</style>