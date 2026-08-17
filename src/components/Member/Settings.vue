<template>
  <Headingmember>
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
      
      <section class="form-panel" id="panel-temas">
        <div class="panel-header">
          <h2>{{ t('themesTitle') }}</h2>
          <button id="btn-reset-colores" class="btn-reset-colors" @click="restaurarColoresPorDefecto" :title="t('resetColorsTooltip')">
            {{ t('resetColorsBtn') }}
          </button>
        </div>
        <div class="presets-grid">
          <button
            v-for="(preset, key) in colorPresets"
            :key="key"
            :id="`preset-${key}`"
            class="preset-card"
            :class="{ 'is-active': presetActivo === key }"
            :style="{
              '--accent': preset.colors.highlight,
              '--bg1': preset.colors.tarjetas,
              '--bg2': preset.colors.headingBg,
            }"
            @click="aplicarPreset(key)"
          >
            <span v-if="presetActivo === key" class="preset-check">✓</span>
            <span class="preset-swatches">
              <span class="swatch" :style="{ background: preset.colors.botones }"></span>
              <span class="swatch" :style="{ background: preset.colors.highlight }"></span>
              <span class="swatch" :style="{ background: preset.colors.tarjetas }"></span>
              <span class="swatch" :style="{ background: preset.colors.titulos }"></span>
            </span>
            <span class="preset-label">{{ preset.label }}</span>
          </button>
        </div>
      </section>

      <section class="form-panel" id="panel-general">
        <div class="panel-header"><h2>{{ t('generalSectionTitle') }}</h2></div>
        
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

      <section class="form-panel" id="panel-apariencia-avanzada">
        <div class="panel-header">
          <h2>{{ t('advancedAppearanceTitle') }}</h2>
        </div>
        
        <div class="config-row column-mobile" id="row-paleta-colores">
          <div class="config-info">
            <label>{{ t('detailedPaletteLabel') }}</label>
            <p>{{ t('detailedPaletteDesc') }}</p>
          </div>
          
          <div class="color-grid">
            <div class="color-card" id="container-color-headingBg">
              <span class="color-label">{{ t('colorHeadingSup') }}</span>
              <div class="color-picker-wrapper">
                <input type="color" id="color-headingBg" v-model="settings.colors.headingBg">
                <div class="color-preview" :style="{ backgroundColor: settings.colors.headingBg }"></div>
              </div>
            </div>

            <div class="color-card" id="container-color-tablas">
              <span class="color-label">{{ t('colorTablas') }}</span>
              <div class="color-picker-wrapper">
                <input type="color" id="color-tablas" v-model="settings.colors.tablas">
                <div class="color-preview" :style="{ backgroundColor: settings.colors.tablas }"></div>
              </div>
            </div>

            <div class="color-card" id="container-color-interfaz">
              <span class="color-label">{{ t('colorInterfaz') }}</span>
              <div class="color-picker-wrapper">
                <input type="color" id="color-interfaz" v-model="settings.colors.interfaz">
                <div class="color-preview" :style="{ backgroundColor: settings.colors.interfaz }"></div>
              </div>
            </div>

            <div class="color-card" id="container-color-botones">
              <span class="color-label">{{ t('colorBotones') }}</span>
              <div class="color-picker-wrapper">
                <input type="color" id="color-botones" v-model="settings.colors.botones">
                <div class="color-preview" :style="{ backgroundColor: settings.colors.botones }"></div>
              </div>
            </div>

            <div class="color-card" id="container-color-tarjetas">
              <span class="color-label">{{ t('colorTarjetas') }}</span>
              <div class="color-picker-wrapper">
                <input type="color" id="color-tarjetas" v-model="settings.colors.tarjetas">
                <div class="color-preview" :style="{ backgroundColor: settings.colors.tarjetas }"></div>
              </div>
            </div>

            <div class="color-card" id="container-color-titulos">
              <span class="color-label">{{ t('colorTitulares') }}</span>
              <div class="color-picker-wrapper">
                <input type="color" id="color-titulos" v-model="settings.colors.titulos">
                <div class="color-preview" :style="{ backgroundColor: settings.colors.titulos }"></div>
              </div>
            </div>

            <div class="color-card" id="container-color-highlight">
              <span class="color-label">{{ t('colorHighlight') }}</span>
              <div class="color-picker-wrapper">
                <input type="color" id="color-highlight" v-model="settings.colors.highlight">
                <div class="color-preview" :style="{ backgroundColor: settings.colors.highlight }"></div>
              </div>
            </div>

            <div class="color-card" id="container-color-etiquetas">
              <span class="color-label">{{ t('colorEtiquetas') }}</span>
              <div class="color-picker-wrapper">
                <input type="color" id="color-etiquetas" v-model="settings.colors.etiquetas">
                <div class="color-preview" :style="{ backgroundColor: settings.colors.etiquetas }"></div>
              </div>
            </div>

            <div class="color-card" id="container-color-textoGeneral">
              <span class="color-label">{{ t('colorTextoGeneral') }}</span>
              <div class="color-picker-wrapper">
                <input type="color" id="color-textoGeneral" v-model="settings.colors.textoGeneral">
                <div class="color-preview" :style="{ backgroundColor: settings.colors.textoGeneral }"></div>
              </div>
            </div>

            <div class="color-card" id="container-color-textoBotones">
              <span class="color-label">{{ t('colorTextoBotones') }}</span>
              <div class="color-picker-wrapper">
                <input type="color" id="color-textoBotones" v-model="settings.colors.textoBotones">
                <div class="color-preview" :style="{ backgroundColor: settings.colors.textoBotones }"></div>
              </div>
            </div>

            <div class="color-card" id="container-color-svgColor">
              <span class="color-label">{{ t('colorSvgIcons') }}</span>
              <div class="color-picker-wrapper">
                <input type="color" id="color-svgColor" v-model="settings.colors.svgColor">
                <div class="color-preview" :style="{ backgroundColor: settings.colors.svgColor }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="config-row" id="row-densidad">
          <div class="config-info">
            <label for="select-densidad">{{ t('interfaceDensityLabel') }}</label>
            <p>{{ t('interfaceDensityDesc') }}</p>
          </div>
          <div class="select-wrapper">
            <select id="select-densidad" v-model="settings.densidad" class="font-select">
              <option value="espacioso">{{ t('densitySpacious') }}</option>
              <option value="normal">{{ t('densityNormal') }}</option>
              <option value="compacto">{{ t('densityCompact') }}</option>
            </select>
          </div>
        </div>

        <div class="config-row" id="row-border-radius">
          <div class="config-info">
            <label for="select-border-radius">{{ t('borderStyleLabel') }}</label>
            <p>{{ t('borderStyleDesc') }}</p>
          </div>
          <div class="select-wrapper">
            <select id="select-border-radius" v-model="settings.borderRadius" class="font-select">
              <option value="8px">{{ t('borderSquare') }}</option>
              <option value="16px">{{ t('borderSmooth') }}</option>
              <option value="24px">{{ t('borderRounded') }}</option>
            </select>
          </div>
        </div>
      </section>


      <transition name="fade">
        <div v-if="toast.visible" id="toast-notification-box" class="toast-notification">
          {{ toast.message }}
        </div>
      </transition>
    </main>
  </Headingmember>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue';
import Headingmember from './HeadingMember.vue';
import { useLang } from './useLang.js';

const { setLang } = useLang();

const translations = {
  es: {
    configPageTitle: "Configuración",
    configPageHighlight: "de la Página",
    configPageSubtitle: "Personaliza tu sitio web a tu manera.",
    saveChangesBtn: "Guardar Cambios",
    themesTitle: "Temas y Combinaciones Rápidas (30 Estilos)",
    resetColorsBtn: "Restaurar Originales",
    resetColorsTooltip: "Volver a los colores iniciales",
    generalSectionTitle: "General",
    notificationsLabel: "Notificaciones",
    notificationsDesc: "Configura tus preferencias de notificación.",
    notificationsToggleTitle: "Activar/Desactivar notificaciones",
    tutorialLabel: "Tutorial",
    tutorialDesc: "Aprende a utilizar todas las funcionalidades.",
    tutorialToggleTitle: "Activar/Desactivar tutorial",
    interfaceLanguageLabel: "Idioma de la Interfaz",
    interfaceLanguageDesc: "Selecciona el idioma principal del sistema.",
    spanishOption: "Español",
    englishOption: "English (Inglés)",
    advancedAppearanceTitle: "Apariencia Avanzada",
    detailedPaletteLabel: "Paleta de Colores Detallada",
    detailedPaletteDesc: "Personaliza cada componente de la interfaz y el Heading de forma independiente.",
    colorHeadingSup: "Heading Sup.",
    colorTablas: "Tablas",
    colorInterfaz: "Interfaz",
    colorBotones: "Botones Fondo",
    colorTarjetas: "Tarjetas",
    colorTitulares: "Titulares",
    colorHighlight: "Highlight",
    colorEtiquetas: "Etiquetas",
    colorTextoGeneral: "Textos Gr.",
    colorTextoBotones: "Txt Botones",
    colorSvgIcons: "Iconos SVG",
    interfaceDensityLabel: "Densidad de la Interfaz",
    interfaceDensityDesc: "Elige el espaciado general de los elementos.",
    densitySpacious: "Espacioso (Cómodo)",
    densityNormal: "Normal (Estándar)",
    densityCompact: "Compacto (Más datos)",
    borderStyleLabel: "Estilo de Bordes",
    borderStyleDesc: "Define la curvatura de los paneles y botones.",
    borderSquare: "Cuadrado (Moderno)",
    borderSmooth: "Suave (Estándar)",
    borderRounded: "Muy Redondeado",
    exportSectionTitle: "Exportación de datos",
    exportFormatLabel: "Formato de exportación",
    exportFormatDesc: "Formato al descargar bitácoras y respaldos.",
    toastColorsRestored: "Colores restaurados y guardados.",
    toastPresetApplied: "Tema combinado '{label}' aplicado y guardado.",
    toastmemberSaved: "Configuración de member guardada globalmente.",
    toastLocalSaved: "Configuración guardada localmente.",
    toastSaveError: "Error al guardar la configuración.",
    toastDownloading: "Descargando archivo {tipo}..."
  },
  en: {
    configPageTitle: "Page",
    configPageHighlight: "Configuration",
    configPageSubtitle: "Customize your website your way.",
    saveChangesBtn: "Save Changes",
    themesTitle: "Themes and Quick Combinations (30 Styles)",
    resetColorsBtn: "Restore Originals",
    resetColorsTooltip: "Return to initial colors",
    generalSectionTitle: "General",
    notificationsLabel: "Notifications",
    notificationsDesc: "Configure your notification preferences.",
    notificationsToggleTitle: "Enable/Disable notifications",
    tutorialLabel: "Tutorial",
    tutorialDesc: "Learn how to use all functionalities.",
    tutorialToggleTitle: "Enable/Disable tutorial",
    interfaceLanguageLabel: "Interface Language",
    interfaceLanguageDesc: "Select the main system language.",
    spanishOption: "Spanish",
    englishOption: "English",
    advancedAppearanceTitle: "Advanced Appearance",
    detailedPaletteLabel: "Detailed Color Palette",
    detailedPaletteDesc: "Customize each interface component and the Heading independently.",
    colorHeadingSup: "Heading Sup.",
    colorTablas: "Tables",
    colorInterfaz: "Interface",
    colorBotones: "Buttons Bg",
    colorTarjetas: "Cards",
    colorTitulares: "Headlines",
    colorHighlight: "Highlight",
    colorEtiquetas: "Tags",
    colorTextoGeneral: "Gen. Text",
    colorTextoBotones: "Btn Text",
    colorSvgIcons: "SVG Icons",
    interfaceDensityLabel: "Interface Density",
    interfaceDensityDesc: "Choose the general spacing of elements.",
    densitySpacious: "Spacious (Comfortable)",
    densityNormal: "Normal (Standard)",
    densityCompact: "Compact (More data)",
    borderStyleLabel: "Border Style",
    borderStyleDesc: "Define the curvature of panels and buttons.",
    borderSquare: "Square (Modern)",
    borderSmooth: "Smooth (Standard)",
    borderRounded: "Fully Rounded",
    exportSectionTitle: "Data Export",
    exportFormatLabel: "Export Format",
    exportFormatDesc: "Format when downloading loMembergs and backups.",
    toastColorsRestored: "Colors restored and saved.",
    toastPresetApplied: "Combined theme '{label}' applied and saved.",
    toastmemberSaved: "member configuration saved globally.",
    toastLocalSaved: "Configuration saved locally.",
    toastSaveError: "Error saving configuration.",
    toastDownloading: "Downloading {tipo} file..."
  }
};

// `t` depende de settings.idioma; como es una función no se ejecuta hasta que
// se llama, así que puede referenciar `settings` aunque se declare antes.
const t = (key) => {
  return translations[settings.idioma]?.[key] || translations['es'][key] || key;
};

// ============================================================
// CAMBIO 1: safeJsonParse
// Antes: JSON.parse(localStorage.getItem('app-colors')) directo en la
// inicialización de `settings`. Si esa llave tenía un valor corrupto o
// inválido, JSON.parse lanzaba una excepción dentro de <script setup> y
// tumbaba el montaje de TODO el componente (pantalla en blanco). Con este
// helper, si el dato está corrupto se ignora y se usa el valor por defecto.
// ============================================================
function safeJsonParse(raw, fallback = null) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.warn('localStorage corrupto, usando valores por defecto:', e);
    return fallback;
  }
}

// ============================================================
// CAMBIO 2: namespacing por rol (el bug principal)
// Antes, colores/densidad/borderRadius se guardaban en llaves GLOBALES:
// 'app-colors', 'app-densidad', 'app-radius'. Como Owner, Member y
// Recepción compartían esas mismas llaves, guardar cambios en cualquiera
// de los tres roles sobrescribía el tema de los otros dos.
// Ahora cada rol guarda/lee bajo su propia llave: app-colors-member,
// app-densidad-member, app-radius-member (y lo mismo para owner/recepcion).
// ROLE_KEY usa 'user_role' porque es la misma llave que usa el router y
// App.vue (antes este archivo usaba 'userRole', que no coincidía con nada
// y por eso el bloque `if (userRole === 'member')` casi nunca se cumplía).
// ============================================================
const ROLE_KEY = 'user_role';

const claveColores = () => {
  const rol = (localStorage.getItem(ROLE_KEY) || '').toLowerCase();
  return `app-colors-${rol}`; // ej: app-colors-member
};
const claveRadius = () => {
  const rol = (localStorage.getItem(ROLE_KEY) || '').toLowerCase();
  return `app-radius-${rol}`;
};
const claveDensidad = () => {
  const rol = (localStorage.getItem(ROLE_KEY) || '').toLowerCase();
  return `app-densidad-${rol}`;
};

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
  gymFemenino: { 
    label: '🌸 Fit Femme (Gym)', 
    colors: { headingBg: '#1f0d14', tablas: '#2a121b', interfaz: '#16080e', botones: '#db2777', tarjetas: '#200b12', titulos: '#fff1f2', highlight: '#f472b6', etiquetas: '#fbcfe8', textoGeneral: '#f472b6', textoBotones: '#ffffff', svgColor: '#f472b6' } 
  },
  barbieVibe: { 
    label: '💖 Barbie Power', 
    colors: { headingBg: '#240615', tablas: '#3b0a22', interfaz: '#1c030f', botones: '#ec4899', tarjetas: '#2c071a', titulos: '#fdf2f8', highlight: '#f472b6', etiquetas: '#fbcfe8', textoGeneral: '#f472b6', textoBotones: '#ffffff', svgColor: '#f472b6' } 
  },
  gymMasculino: { 
    label: '🏋️‍♂️ Iron Masculino', 
    colors: { headingBg: '#0d0d12', tablas: '#181822', interfaz: '#09090e', botones: '#2563eb', tarjetas: '#13131c', titulos: '#ffffff', highlight: '#3b82f6', etiquetas: '#f4f4f5', textoGeneral: '#a1a1aa', textoBotones: '#ffffff', svgColor: '#3b82f6' } 
  },
  cyberpunk: { 
    label: '⚡ Cyberpunk Blue', 
    colors: { headingBg: '#0a0a14', tablas: '#16162b', interfaz: '#05050d', botones: '#f43f5e', tarjetas: '#0f0f1f', titulos: '#ffffff', highlight: '#f43f5e', etiquetas: '#e2e8f0', textoGeneral: '#94a3b8', textoBotones: '#ffffff', svgColor: '#f43f5e' } 
  },
  emeraldMatrix: { 
    label: '🟢 Emerald Matrix', 
    colors: { headingBg: '#022c22', tablas: '#064e3b', interfaz: '#021a14', botones: '#059669', tarjetas: '#042f24', titulos: '#ecfdf5', highlight: '#34d399', etiquetas: '#a7f3d0', textoGeneral: '#6ee7b7', textoBotones: '#ffffff', svgColor: '#34d399' } 
  },
  sunsetOrange: { 
    label: '🌅 Sunset Orange', 
    colors: { headingBg: '#2c1209', tablas: '#431407', interfaz: '#1c0b05', botones: '#f97316', tarjetas: '#260e05', titulos: '#fff7ed', highlight: '#fb923c', etiquetas: '#fed7aa', textoGeneral: '#fdba74', textoBotones: '#ffffff', svgColor: '#fb923c' } 
  },
  royalPurple: { 
    label: '👑 Royal Purple', 
    colors: { headingBg: '#1e1b4b', tablas: '#312e81', interfaz: '#0f172a', botones: '#7c3aed', tarjetas: '#1e293b', titulos: '#f8fafc', highlight: '#a78bfa', etiquetas: '#ddd6fe', textoGeneral: '#cbd5e1', textoBotones: '#ffffff', svgColor: '#a78bfa' } 
  },
  neonGlow: { 
    label: '🧪 Neon Lime', 
    colors: { headingBg: '#0f172a', tablas: '#1e293b', interfaz: '#090d16', botones: '#84cc16', tarjetas: '#111827', titulos: '#ffffff', highlight: '#a3e635', etiquetas: '#ecfccb', textoGeneral: '#9ca3af', textoBotones: '#000000', svgColor: '#a3e635' } 
  },
  crimsonDark: { 
    label: '🩸 Crimson Blood', 
    colors: { headingBg: '#2b0b0b', tablas: '#451010', interfaz: '#1a0505', botones: '#dc2626', tarjetas: '#240a0a', titulos: '#fef2f2', highlight: '#f87171', etiquetas: '#fecaca', textoGeneral: '#fca5a5', textoBotones: '#ffffff', svgColor: '#f87171' } 
  },
  arcticFrost: { 
    label: '❄️ Arctic Frost', 
    colors: { headingBg: '#082f49', tablas: '#0369a1', interfaz: '#021524', botones: '#0284c7', tarjetas: '#0c233b', titulos: '#f0f9ff', highlight: '#38bdf8', etiquetas: '#bae6fd', textoGeneral: '#7dd3fc', textoBotones: '#ffffff', svgColor: '#38bdf8' } 
  },
  goldenLuxury: { 
    label: '✨ Golden Luxury', 
    colors: { headingBg: '#272007', tablas: '#42360a', interfaz: '#161203', botones: '#d97706', tarjetas: '#201a05', titulos: '#fefce8', highlight: '#fbbf24', etiquetas: '#fef08a', textoGeneral: '#fde047', textoBotones: '#ffffff', svgColor: '#fbbf24' } 
  },
  midnightTeal: { 
    label: '🌊 Midnight Teal', 
    colors: { headingBg: '#042f2e', tablas: '#115e59', interfaz: '#021a19', botones: '#0d9488', tarjetas: '#082524', titulos: '#f0fdf4', highlight: '#2dd4bf', etiquetas: '#99f6e4', textoGeneral: '#5eead4', textoBotones: '#ffffff', svgColor: '#2dd4bf' } 
  },
  cherryBlossom: { 
    label: '🌸 Cherry Blossom', 
    colors: { headingBg: '#2a0813', tablas: '#4c0f22', interfaz: '#19040b', botones: '#e11d48', tarjetas: '#220610', titulos: '#fff1f2', highlight: '#fb7185', etiquetas: '#fecdd3', textoGeneral: '#fda4af', textoBotones: '#ffffff', svgColor: '#fb7185' } 
  },
  coffeeLatte: { 
    label: '☕ Coffee Latte', 
    colors: { headingBg: '#231815', tablas: '#3d2b25', interfaz: '#140e0c', botones: '#b45309', tarjetas: '#1c1310', titulos: '#fdf8f6', highlight: '#d97706', etiquetas: '#fde68a', textoGeneral: '#d1a18d', textoBotones: '#ffffff', svgColor: '#d97706' } 
  },
  matrixHacker: { 
    label: '💻 Matrix Hacker', 
    colors: { headingBg: '#051c0d', tablas: '#0a361a', interfaz: '#020f07', botones: '#16a34a', tarjetas: '#06170b', titulos: '#f0fdf4', highlight: '#22c55e', etiquetas: '#bbf7d0', textoGeneral: '#4ade80', textoBotones: '#ffffff', svgColor: '#22c55e' } 
  },
  deepSpace: { 
    label: '🌌 Deep Space', 
    colors: { headingBg: '#0f172a', tablas: '#1e1b4b', interfaz: '#090d16', botones: '#6366f1', tarjetas: '#111827', titulos: '#ffffff', highlight: '#818cf8', etiquetas: '#c7d2fe', textoGeneral: '#9ca3af', textoBotones: '#ffffff', svgColor: '#818cf8' } 
  },
  neonPink: { 
    label: '💖 Neon Synthwave', 
    colors: { headingBg: '#2e0824', tablas: '#4a0d3b', interfaz: '#1a0414', botones: '#d946ef', tarjetas: '#24061c', titulos: '#fdf4ff', highlight: '#e879f9', etiquetas: '#f5d0fe', textoGeneral: '#f0abfc', textoBotones: '#ffffff', svgColor: '#e879f9' } 
  },
  toxicGreen: { 
    label: '☢️ Toxic Hazard', 
    colors: { headingBg: '#1a2e05', tablas: '#2e4d0a', interfaz: '#0f1a02', botones: '#65a30d', tarjetas: '#142203', titulos: '#f7fee7', highlight: '#84cc16', etiquetas: '#d9f99d', textoGeneral: '#bef264', textoBotones: '#ffffff', svgColor: '#84cc16' } 
  },
  lavenderDream: { 
    label: '💜 Lavender Dream', 
    colors: { headingBg: '#2e1065', tablas: '#4c1d95', interfaz: '#170838', botones: '#8b5cf6', tarjetas: '#230c4f', titulos: '#f5f3ff', highlight: '#a78bfa', etiquetas: '#ddd6fe', textoGeneral: '#c4b5fd', textoBotones: '#ffffff', svgColor: '#a78bfa' } 
  },
  copperRust: { 
    label: '🧱 Copper Rust', 
    colors: { headingBg: '#2c1810', tablas: '#4a281b', interfaz: '#170d08', botones: '#c2410c', tarjetas: '#21120b', titulos: '#fff7ed', highlight: '#ea580c', etiquetas: '#ffedd5', textoGeneral: '#fdba74', textoBotones: '#ffffff', svgColor: '#ea580c' } 
  },
  electricAmber: { 
    label: '⚡ Electric Amber', 
    colors: { headingBg: '#291b03', tablas: '#473005', interfaz: '#140e01', botones: '#f59e0b', tarjetas: '#1f1402', titulos: '#fffbeb', highlight: '#fbbf24', etiquetas: '#fef3c7', textoGeneral: '#fde68a', textoBotones: '#000000', svgColor: '#fbbf24' } 
  },
  steelBlue: { 
    label: '🛡️ Steel Blue', 
    colors: { headingBg: '#0f172a', tablas: '#334155', interfaz: '#090d16', botones: '#475569', tarjetas: '#1e293b', titulos: '#f8fafc', highlight: '#94a3b8', etiquetas: '#e2e8f0', textoGeneral: '#cbd5e1', textoBotones: '#ffffff', svgColor: '#94a3b8' } 
  },
  velvetRuby: { 
    label: '🍷 Velvet Ruby', 
    colors: { headingBg: '#3b0764', tablas: '#581c87', interfaz: '#1e0333', botones: '#9333ea', tarjetas: '#2e054d', titulos: '#faf5ff', highlight: '#c084fc', etiquetas: '#e9d5ff', textoGeneral: '#d8b4fe', textoBotones: '#ffffff', svgColor: '#c084fc' } 
  },
  mintFresh: { 
    label: '🍃 Mint Fresh', 
    colors: { headingBg: '#064e3b', tablas: '#065f46', interfaz: '#022c22', botones: '#10b981', tarjetas: '#04382c', titulos: '#ecfdf5', highlight: '#34d399', etiquetas: '#a7f3d0', textoGeneral: '#6ee7b7', textoBotones: '#ffffff', svgColor: '#34d399' } 
  },
  slateMinimal: { 
    label: '✒️ Slate Minimal', 
    colors: { headingBg: '#18181b', tablas: '#27272a', interfaz: '#09090b', botones: '#52525b', tarjetas: '#1c1c1f', titulos: '#fafafa', highlight: '#a1a1aa', etiquetas: '#f4f4f5', textoGeneral: '#d4d4d8', textoBotones: '#ffffff', svgColor: '#a1a1aa' } 
  },
  neonCyan: { 
    label: '🌐 Neon Cyan', 
    colors: { headingBg: '#082f49', tablas: '#075985', interfaz: '#031624', botones: '#06b6d4', tarjetas: '#0b2236', titulos: '#ecfeff', highlight: '#22d3ee', etiquetas: '#cffafe', textoGeneral: '#67e8f9', textoBotones: '#000000', svgColor: '#22d3ee' } 
  },
  sunsetCoral: { 
    label: '🍑 Sunset Coral', 
    colors: { headingBg: '#311018', tablas: '#521b28', interfaz: '#1c080d', botones: '#f43f5e', tarjetas: '#260c13', titulos: '#fff1f2', highlight: '#fb7185', etiquetas: '#fecdd3', textoGeneral: '#fda4af', textoBotones: '#ffffff', svgColor: '#fb7185' } 
  },
  graphiteOrange: { 
    label: '🏎️ Graphite Orange', 
    colors: { headingBg: '#18181b', tablas: '#27272a', interfaz: '#09090b', botones: '#ea580c', tarjetas: '#1c1c1f', titulos: '#ffffff', highlight: '#f97316', etiquetas: '#fed7aa', textoGeneral: '#a1a1aa', textoBotones: '#ffffff', svgColor: '#f97316' } 
  },
  neonViolet: { 
    label: '🔮 Neon Violet', 
    colors: { headingBg: '#1e1b4b', tablas: '#3730a3', interfaz: '#0f0e26', botones: '#7c3aed', tarjetas: '#171536', titulos: '#f5f3ff', highlight: '#8b5cf6', etiquetas: '#ddd6fe', textoGeneral: '#a5b4fc', textoBotones: '#ffffff', svgColor: '#8b5cf6' } 
  },
  solarFlare: { 
    label: '☀️ Solar Flare', 
    colors: { headingBg: '#3b1c05', tablas: '#5c2d08', interfaz: '#1c0d02', botones: '#ea580c', tarjetas: '#2b1403', titulos: '#fff7ed', highlight: '#fb923c', etiquetas: '#ffedd5', textoGeneral: '#fdba74', textoBotones: '#ffffff', svgColor: '#fb923c' } 
  }
};

// CAMBIO: settings.colors/densidad/borderRadius ahora usan safeJsonParse y
// las llaves NAMESPACEADAS por rol (claveColores/claveDensidad/claveRadius),
// en vez de 'app-colors' / 'app-densidad' / 'app-radius' globales.
const settings = reactive({
  notificaciones: false,
  tutorial: localStorage.getItem('tutorialActivo') === 'true', 
  idioma: localStorage.getItem('member-idioma') || 'es',
  densidad: localStorage.getItem(claveDensidad()) || 'normal',
  borderRadius: localStorage.getItem(claveRadius()) || '16px',
  colors: safeJsonParse(localStorage.getItem(claveColores())) || { ...defaultColors }
});

// ============================================================
// CAMBIO 3: presetActivo faltaba estar sincronizado correctamente.
// Antes era un ref inicializado desde 'app-preset-activo' (llave global,
// compartida entre roles) y sólo se actualizaba al hacer click en un
// preset. Si otro rol pisaba esa llave, o si los colores llegaban desde
// el backend/otra fuente, el check ✓ quedaba desincronizado del tema
// realmente aplicado. Ahora es un computed: compara los colores actuales
// contra cada preset y devuelve la llave del que coincide, igual que en
// owner.
// ============================================================
const presetActivo = computed(() => {
  const actual = JSON.stringify(settings.colors);
  const key = Object.keys(colorPresets).find(
    (k) => JSON.stringify(colorPresets[k].colors) === actual
  );
  return key || null;
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

const restaurarColoresPorDefecto = () => {
  settings.colors = { ...defaultColors };
  guardarCambios(); 
  showToast(t('toastColorsRestored'));
};

const aplicarPreset = (tipoPreset) => {
  if (colorPresets[tipoPreset]) {
    settings.colors = { ...colorPresets[tipoPreset].colors };
    // CAMBIO: se guarda en la llave namespaceada por rol, no en 'app-colors' global.
    localStorage.setItem(claveColores(), JSON.stringify(settings.colors));
    aplicarEstilos();
    window.dispatchEvent(new CustomEvent('app-settings-updated', { detail: settings }));
    showToast(t('toastPresetApplied').replace('{label}', colorPresets[tipoPreset].label));
  }
};

const guardarCambios = async () => {
  try {
    // CAMBIO: ROLE_KEY ('user_role') en vez de 'userRole', para que coincida
    // con la llave real que usan el router y App.vue.
    const userRole = localStorage.getItem(ROLE_KEY) || 'member';

    localStorage.setItem('tutorialActivo', settings.tutorial);
    localStorage.setItem('member-idioma', settings.idioma);
    // CAMBIO: llaves namespaceadas por rol en vez de 'app-colors' / 'app-densidad' / 'app-radius' globales.
    localStorage.setItem(claveColores(), JSON.stringify(settings.colors));
    localStorage.setItem(claveDensidad(), settings.densidad);
    localStorage.setItem(claveRadius(), settings.borderRadius);
    
    aplicarEstilos();
    
    window.dispatchEvent(new Event('tutorial-updated'));
    window.dispatchEvent(new CustomEvent('app-settings-updated', { detail: settings }));
    window.dispatchEvent(new CustomEvent('idioma-changed', { detail: { idioma: settings.idioma } }));

    if (settings.notificaciones) {
      await fetch('/api/notificaciones/activar', { method: 'POST' }).catch(() => {});
    }

    if (userRole === 'member') {
      try {
        await fetch('/api/member/configuracion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          },
          body: JSON.stringify({
            idioma: settings.idioma,
            densidad: settings.densidad,
            borderRadius: settings.borderRadius,
            colors: settings.colors,
            tutorial: settings.tutorial
          })
        });
      } catch (backendError) {
        console.warn("Sincronización en la nube omitida temporalmente:", backendError);
      }
      showToast(t('toastmemberSaved'));
    } else {
      showToast(t('toastLocalSaved'));
    }
  } catch (error) {
    console.error("Error al guardar:", error);
    showToast(t('toastSaveError'));
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

onMounted(async () => {
  aplicarEstilos();

  window.addEventListener('idioma-changed', (e) => {
    if (e.detail && e.detail.idioma) {
      settings.idioma = e.detail.idioma;
    }
  });

  // CAMBIO: ROLE_KEY ('user_role') en vez de 'userRole'.
  const userRole = localStorage.getItem(ROLE_KEY) || 'member';
  if (userRole === 'member') {
    try {
      const res = await fetch('/api/member/configuracion', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.idioma) {
          settings.idioma = data.idioma;
          localStorage.setItem('member-idioma', data.idioma);
        }
      }
    } catch (e) {
      // Ignorar si no hay red
    }
  }
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
    showToast(t('toastDownloading').replace('{tipo}', tipo.toUpperCase()));
  } catch (error) {
    console.error(`Error al descargar ${tipo}:`, error);
    showToast(t('toastDownloading').replace('{tipo}', tipo.toUpperCase()) + " (Simulado)");
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

/* ===================================================================
   Temas / Presets — rediseñados como tarjetas con vista previa real
   =================================================================== */
.presets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  max-height: 420px;
  overflow-y: auto;
  padding: 4px 6px 4px 2px;
}

.presets-grid::-webkit-scrollbar { width: 6px; }
.presets-grid::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 4px; }
.presets-grid::-webkit-scrollbar-track { background: transparent; }

.preset-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 14px 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: linear-gradient(155deg, var(--bg1) 0%, var(--bg2) 100%);
  cursor: pointer;
  font-family: 'Oswald', sans-serif;
  text-align: center;
  overflow: hidden;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.preset-card::after {
  /* leve viñeta para que el texto siempre sea legible sobre cualquier color */
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 100%);
  pointer-events: none;
}

.preset-card:hover {
  transform: translateY(-3px);
  border-color: var(--accent);
  box-shadow: 0 10px 24px -8px var(--accent);
}

.preset-card.is-active {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--accent), 0 10px 24px -8px var(--accent);
}

.preset-check {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--accent);
  color: #0b0b0e;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
}

.preset-swatches {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swatch {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.55);
  box-shadow: 0 2px 6px rgba(0,0,0,0.35);
  margin-left: -8px;
  transition: transform 0.2s ease;
}
.swatch:first-child { margin-left: 0; }
.preset-card:hover .swatch { transform: translateY(-2px); }
.swatch:nth-child(1) { transition-delay: 0s; }
.swatch:nth-child(2) { transition-delay: 0.03s; }
.swatch:nth-child(3) { transition-delay: 0.06s; }
.swatch:nth-child(4) { transition-delay: 0.09s; }

.preset-label {
  position: relative;
  z-index: 1;
  font-size: 0.78rem;
  line-height: 1.25;
  color: #ffffff;
  text-shadow: 0 1px 4px rgba(0,0,0,0.6);
  letter-spacing: 0.2px;
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
  .btn-primary {  width: 100%; }
  .config-row { flex-direction: column; align-items: flex-start; gap: 14px; padding: 16px 0; }
  .config-row .switch-container { align-self: flex-end; margin-top: -35px; }
  .column-mobile { align-items: flex-start; }
  .export-actions { width: 100%; }
  .btn-export { flex: 1; justify-content: center; } 
  .select-wrapper { width: 100%; }
  .presets-grid { grid-template-columns: repeat(2, 1fr); max-height: 360px; }
  .main-title { 
  font-family: 'Anton', sans-serif; 
  font-size: 1.8rem; }
 
}

@media (max-width: 480px) {
  .color-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  .color-card {
    padding: 8px 4px;
  }
  .presets-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .preset-card { padding: 12px 8px 10px; }
  .swatch { width: 18px; height: 18px; margin-left: -6px; }
  .preset-label { font-size: 0.7rem; }
}
</style>