<script setup lang="ts">
import { reactive, ref, onUnmounted } from 'vue';
import WeeklySchedule from '../../landing/Menu/WeeklySchedule.vue';

const emit = defineEmits(['close']);

const fileInput = ref<HTMLInputElement | null>(null);
const previewImage = ref<string | null>(null);
const selectedLogo = ref<File | null>(null);
const submitted = ref(false);

/* =========================================================
   DATOS DEL ADMINISTRADOR
========================================================= */

const adminData = {
  curp: 'IFC220101HSLPR01',
  nombres: 'Juan Carlos',
  apellidoP: 'Pérez',
  apellidoM: 'Gómez',
  fechaNac: '1985-06-15',
  celular: '4811234567',
  email: 'contacto@ironfitness.com'
};

/* =========================================================
   FORMULARIO
========================================================= */

const form = reactive({
  nombreGimnasio: '',

  /* Ubicación */
  entidad: 'San Luis Potosí',
  municipio: '',
  cp: '',
  colonia: '',
  calle: '',
  numExt: '',
  numInt: '',

  /* Coordenadas */
  lat: null as number | null,
  lng: null as number | null,

  /* Horarios */
  horarios: {} as Record<string, { open: string; close: string }>,

  /* Precios */
  precioMes: '',
  precioSem: ''
});

/* =========================================================
   LOGOTIPO
========================================================= */

const triggerFileInput = () => {
  fileInput.value?.click();
};

const onFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  if (!file.type.startsWith('image/')) {
    input.value = '';
    return;
  }

  if (previewImage.value) {
    URL.revokeObjectURL(previewImage.value);
  }

  selectedLogo.value = file;
  previewImage.value = URL.createObjectURL(file);
};

onUnmounted(() => {
  if (previewImage.value) {
    URL.revokeObjectURL(previewImage.value);
  }
});

/* =========================================================
   UBICACIÓN ACTUAL
========================================================= */

const locating = ref(false);

const locationStatus = ref<
  'idle' | 'ok' | 'partial' | 'error'
>('idle');

const locationMessage = ref('');

/* ---------------------------------------------------------
   Función auxiliar para obtener el primer valor disponible
--------------------------------------------------------- */

const firstAddressValue = (
  ...values: Array<string | undefined | null>
) => {
  return values.find(
    value =>
      typeof value === 'string' &&
      value.trim().length > 0
  ) || '';
};

/* ---------------------------------------------------------
   Usar ubicación actual
--------------------------------------------------------- */

const useMyLocation = () => {
  if (!('geolocation' in navigator)) {
    locationStatus.value = 'error';
    locationMessage.value =
      'Tu dispositivo no permite obtener la ubicación. Puedes escribirla manualmente.';
    return;
  }

  locating.value = true;
  locationStatus.value = 'idle';
  locationMessage.value = '';

  navigator.geolocation.getCurrentPosition(
    async position => {
      form.lat = position.coords.latitude;
      form.lng = position.coords.longitude;

      try {
        const url =
          `https://nominatim.openstreetmap.org/reverse` +
          `?format=jsonv2` +
          `&addressdetails=1` +
          `&accept-language=es` +
          `&lat=${form.lat}` +
          `&lon=${form.lng}`;

        const response = await fetch(url, {
          headers: {
            Accept: 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('No se pudo consultar la dirección');
        }

        const data = await response.json();
        const address = data.address || {};

        /* Estado / Entidad */
        const entidad = firstAddressValue(
          address.state,
          address.region
        );

        /* Municipio */
        const municipio = firstAddressValue(
          address.city,
          address.town,
          address.municipality,
          address.village,
          address.county
        );

        /* Colonia */
        const colonia = firstAddressValue(
          address.suburb,
          address.neighbourhood,
          address.quarter,
          address.residential,
          address.city_district
        );

        /* Código postal */
        const cp = firstAddressValue(
          address.postcode
        );

        /* Calle */
        const calle = firstAddressValue(
          address.road,
          address.pedestrian,
          address.footway,
          address.path
        );

        /* Número exterior */
        const numExt = firstAddressValue(
          address.house_number
        );

        /*
         * Solamente sustituimos un campo cuando
         * Nominatim realmente encontró información.
         *
         * De esta forma los campos continúan siendo
         * completamente editables.
         */

        if (entidad) {
          form.entidad = entidad;
        }

        if (municipio) {
          form.municipio = municipio;
        }

        if (colonia) {
          form.colonia = colonia;
        }

        if (cp) {
          form.cp = cp;
        }

        if (calle) {
          form.calle = calle;
        }

        if (numExt) {
          form.numExt = numExt;
        }

        const completeLocation =
          Boolean(form.entidad) &&
          Boolean(form.municipio);

        locationStatus.value =
          completeLocation ? 'ok' : 'partial';

        locationMessage.value =
          completeLocation
            ? 'Ubicación detectada. Revisa los datos y corrige cualquier campo si es necesario.'
            : 'Guardamos las coordenadas, pero algunos datos de la dirección deben completarse manualmente.';
      } catch (error) {
        console.error(
          'Error obteniendo la dirección:',
          error
        );

        locationStatus.value = 'partial';

        locationMessage.value =
          'Guardamos las coordenadas, pero no pudimos completar toda la dirección. Puedes escribirla manualmente.';
      } finally {
        locating.value = false;
      }
    },

    error => {
      locating.value = false;
      locationStatus.value = 'error';

      switch (error.code) {
        case error.PERMISSION_DENIED:
          locationMessage.value =
            'Permiso de ubicación denegado. Actívalo en tu navegador o escribe la dirección manualmente.';
          break;

        case error.POSITION_UNAVAILABLE:
          locationMessage.value =
            'La ubicación no está disponible en este momento. Puedes escribirla manualmente.';
          break;

        case error.TIMEOUT:
          locationMessage.value =
            'La búsqueda de ubicación tardó demasiado. Inténtalo nuevamente o escribe la dirección manualmente.';
          break;

        default:
          locationMessage.value =
            'No pudimos obtener tu ubicación. Puedes escribirla manualmente.';
      }
    },

    {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 0
    }
  );
};

/* =========================================================
   REGISTRAR SEDE
========================================================= */

const handleRegisterSede = () => {
  if (!form.nombreGimnasio.trim()) {
    return;
  }

  if (
    !form.entidad.trim() ||
    !form.municipio.trim() ||
    !form.colonia.trim() ||
    !form.cp.trim() ||
    !form.calle.trim() ||
    !form.numExt.trim()
  ) {
    return;
  }

  if (Object.keys(form.horarios).length === 0) {
    return;
  }

  const payload = {
    ...adminData,

    ...form,

    logotipo: selectedLogo.value,

    direccion: {
      entidad: form.entidad,
      municipio: form.municipio,
      colonia: form.colonia,
      cp: form.cp,
      calle: form.calle,
      numExt: form.numExt,
      numInt: form.numInt
    },

    coordenadas: {
      lat: form.lat,
      lng: form.lng
    }
  };

  console.log(
    'Registro de nueva sede:',
    payload
  );

  submitted.value = true;

  setTimeout(() => {
    emit('close');
  }, 2000);
};
</script>

<template>
  <div class="register-page-modal">

    <!-- INTRO -->
    <p class="intro">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
      Tus datos de administrador ya están vinculados. Agrega la información de la nueva sucursal.
    </p>

    <!-- ÉXITO -->
    <div v-if="submitted" class="alert-success">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      <span>¡Sede registrada exitosamente! Redirigiendo...</span>
    </div>

    <form @submit.prevent="handleRegisterSede">
      <div class="rg-grid">

        <!-- =================================================
             COLUMNA IZQUIERDA: IDENTIDAD + UBICACIÓN
        ================================================== -->
        <div class="form-column">

          <!-- IDENTIDAD -->
          <section class="rg-card">
            <h3 class="card-title">Identidad de la sucursal</h3>

            <div class="identity-row">
              <div class="logo-picker">
                <div class="image-preview" @click="triggerFileInput" title="Subir logotipo">
                  <img v-if="previewImage" :src="previewImage" class="profile-img" alt="Logotipo de la sucursal" />
                  <div v-else class="upload-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </div>
                </div>
                <span class="logo-hint">Logotipo<br>(opcional)</span>
                <input ref="fileInput" type="file" accept="image/*" hidden @change="onFileSelected" />
              </div>

              <div class="input-group grow">
                <label for="nombreGimnasio">Nombre de la sucursal / Gimnasio</label>
                <input id="nombreGimnasio" v-model="form.nombreGimnasio" type="text" placeholder="Ej. Iron Fitness Norte" required />
              </div>
            </div>

            <div class="admin-locked-info">
              <div class="admin-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div class="admin-text">
                <span>Administrador vinculado</span>
                <strong>{{ adminData.nombres }} {{ adminData.apellidoP }}</strong>
              </div>
              <small class="admin-curp">CURP: {{ adminData.curp }}</small>
            </div>
          </section>

          <!-- UBICACIÓN -->
          <section class="rg-card">
            <div class="card-head">
              <h3 class="card-title">Ubicación</h3>

              <button type="button" class="location-chip" :class="locationStatus" :disabled="locating" @click="useMyLocation">
                <span v-if="locating" class="spinner"></span>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                  <circle cx="12" cy="12" r="8" />
                </svg>
                {{ locating ? 'Ubicando…' : 'Mi ubicación' }}
              </button>
            </div>

            <p v-if="locationMessage" class="location-message" :class="locationStatus">
              <span class="dot"></span>{{ locationMessage }}
            </p>

            <div v-if="form.lat !== null && form.lng !== null" class="coordinates-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{{ form.lat.toFixed(6) }}, {{ form.lng.toFixed(6) }}</span>
            </div>

            <div class="address-grid">
              <div class="input-group">
                <label for="entidad">Estado / Entidad</label>
                <input id="entidad" v-model="form.entidad" type="text" placeholder="Ej. Tamaulipas" required />
              </div>

              <div class="input-group">
                <label for="municipio">Municipio</label>
                <input id="municipio" v-model="form.municipio" type="text" placeholder="Ej. Tampico" required />
              </div>

              <div class="input-group">
                <label for="colonia">Colonia</label>
                <input id="colonia" v-model="form.colonia" type="text" placeholder="Colonia" required />
              </div>

              <div class="input-group">
                <label for="cp">Código postal</label>
                <input id="cp" v-model="form.cp" type="text" inputmode="numeric" placeholder="C.P." required />
              </div>

              <div class="input-group span-2">
                <label for="calle">Calle</label>
                <input id="calle" v-model="form.calle" type="text" placeholder="Nombre de la calle" required />
              </div>

              <div class="input-group">
                <label for="numExt">Núm. exterior</label>
                <input id="numExt" v-model="form.numExt" type="text" placeholder="Ext." required />
              </div>

              <div class="input-group">
                <label for="numInt">Núm. interior</label>
                <input id="numInt" v-model="form.numInt" type="text" placeholder="Int. (opcional)" />
              </div>
            </div>
          </section>
        </div>

        <!-- =================================================
             COLUMNA DERECHA: OPERACIÓN
        ================================================== -->
        <div class="form-column">

          <!-- HORARIOS -->
          <section class="rg-card">
            <h3 class="card-title">Horarios de apertura</h3>
            <p class="card-sub">Configura los días y horarios de esta sede.</p>

            <!-- Mismo componente utilizado en el registro principal -->
            <div class="schedule-wrapper">
              <WeeklySchedule
                v-model="form.horarios"
                open-label="Apertura"
                close-label="Cierre"
                days-label="Días de apertura"
              />
            </div>
          </section>

          <!-- PRECIOS -->
          <section class="rg-card">
            <h3 class="card-title">Precios de la sede</h3>

            <div class="price-grid">
              <div class="input-group">
                <label for="precioMes">Mensualidad</label>
                <div class="money-input">
                  <span>$</span>
                  <input id="precioMes" v-model="form.precioMes" type="number" min="0" step="0.01" placeholder="0.00" required />
                </div>
              </div>

              <div class="input-group">
                <label for="precioSem">Semanal</label>
                <div class="money-input">
                  <span>$</span>
                  <input id="precioSem" v-model="form.precioSem" type="number" min="0" step="0.01" placeholder="0.00" required />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- ACCIONES -->
      <div class="actions-section">
        <p class="form-note">
          La nueva sede quedará vinculada automáticamente a tu cuenta de administrador.
        </p>

        <button type="submit" class="btn-primary">
          <span>Registrar sucursal</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=Oswald:wght@400;600;700&display=swap');

.register-page-modal {
  width: 100%;
  color: var(--color-texto-general, #e5e5e5);
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
}
.register-page-modal *,
.register-page-modal *::before,
.register-page-modal *::after { box-sizing: border-box; }

/* =========================================================
   INTRO / ALERTA
========================================================= */
.intro {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 0 0 18px;
  padding: 11px 14px;
  border: 1px solid color-mix(in srgb, var(--color-highlight, #3b82f6) 25%, transparent);
  border-radius: var(--app-border-radius, 12px);
  background: color-mix(in srgb, var(--color-highlight, #3b82f6) 7%, transparent);
  color: var(--color-texto-general, #cbd5e1);
  font-size: 12.5px;
  line-height: 1.45;
}
.intro svg { width: 16px; height: 16px; flex-shrink: 0; color: var(--color-highlight, #60a5fa); }

.alert-success {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  margin-bottom: 18px;
  padding: 12px 16px;
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: var(--app-border-radius, 12px);
  background: rgba(34, 197, 94, 0.08);
  color: #86dba6;
  font-size: 12.5px;
  font-weight: 600;
}
.alert-success svg { width: 18px; height: 18px; flex-shrink: 0; }

/* =========================================================
   LAYOUT
========================================================= */
.rg-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.form-column { display: flex; flex-direction: column; gap: 18px; min-width: 0; }

.rg-card {
  padding: 20px 20px 22px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: var(--app-border-radius, 18px);
  background: rgba(255, 255, 255, 0.02);
  transition: border-color 0.2s ease;
}
.rg-card:focus-within { border-color: color-mix(in srgb, var(--color-highlight, #3b82f6) 40%, transparent); }

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.card-head .card-title { margin-bottom: 0; }

.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 16px;
  color: var(--color-titulos, #fff);
  font-family: 'Anton', sans-serif;
  font-size: 1.02rem;
  font-weight: 400;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.card-title::before {
  content: '';
  width: 4px;
  height: 17px;
  border-radius: 4px;
  flex-shrink: 0;
  background: linear-gradient(180deg, var(--color-botones, #1c4fd6), rgba(37, 99, 235, 0.25));
}

.card-sub {
  margin: -8px 0 14px 14px;
  color: var(--color-texto-general, #94a3b8);
  font-size: 11.5px;
  opacity: 0.6;
}

/* =========================================================
   CAMPOS
========================================================= */
.input-group { display: flex; flex-direction: column; gap: 7px; min-width: 0; }
.input-group.grow { flex: 1; }

label {
  color: var(--color-texto-general, #f5f5f4);
  font: 600 0.76rem/1.3 'Oswald', sans-serif;
  letter-spacing: 0.35px;
}

input {
  width: 100%;
  min-width: 0;
  height: 46px;
  padding: 0 14px;
  outline: none;
  border: 1.5px solid var(--border-input, rgba(255, 255, 255, 0.12));
  border-radius: var(--app-border-radius, 12px);
  background: var(--bg-input, rgba(255, 255, 255, 0.03));
  color: var(--color-texto-input, var(--color-texto-general, #fff));
  font: 400 0.88rem 'Inter', sans-serif;
  color-scheme: var(--color-scheme, dark);
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}
input::placeholder { color: var(--color-texto-general, #94a3b8); opacity: 0.4; }
input:hover { border-color: rgba(255, 255, 255, 0.22); }
input:focus {
  border-color: var(--color-highlight, #3b82f6);
  background: var(--bg-input-focus, rgba(255, 255, 255, 0.045));
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);
}

.address-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.address-grid .span-2 { grid-column: span 2; }

/* =========================================================
   IDENTIDAD
========================================================= */
.identity-row { display: flex; align-items: flex-end; gap: 16px; }

.logo-picker { display: flex; flex-direction: column; align-items: center; gap: 6px; flex-shrink: 0; }

.image-preview {
  width: 74px;
  height: 74px;
  display: grid;
  place-items: center;
  overflow: hidden;
  cursor: pointer;
  border: 1.5px dashed rgba(255, 255, 255, 0.2);
  border-radius: var(--app-border-radius, 16px);
  background: #111214;
  transition: border-color 0.2s, background 0.2s;
}
.image-preview:hover {
  border-color: var(--color-highlight, #3b82f6);
  background: color-mix(in srgb, var(--color-highlight, #3b82f6) 6%, #111214);
}
.profile-img { width: 100%; height: 100%; object-fit: cover; }
.upload-placeholder { display: grid; place-items: center; color: var(--color-highlight, #60a5fa); opacity: 0.8; }
.upload-placeholder svg { width: 24px; height: 24px; }
.logo-hint {
  color: var(--color-texto-general, #94a3b8);
  font-size: 9.5px;
  line-height: 1.25;
  text-align: center;
  opacity: 0.55;
}

.admin-locked-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--app-border-radius, 12px);
  background: rgba(255, 255, 255, 0.025);
}
.admin-icon {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: color-mix(in srgb, var(--color-highlight, #3b82f6) 14%, transparent);
  color: var(--color-highlight, #60a5fa);
}
.admin-icon svg { width: 17px; height: 17px; }
.admin-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
.admin-text > span {
  color: var(--color-texto-general, #94a3b8);
  font-size: 10px;
  font-weight: 500;
  opacity: 0.6;
}
.admin-text strong {
  overflow: hidden;
  color: var(--color-titulos, #fff);
  font-size: 13px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.admin-curp {
  flex-shrink: 0;
  color: var(--color-texto-general, #94a3b8);
  font-size: 10px;
  opacity: 0.5;
}

/* =========================================================
   UBICACIÓN
========================================================= */
.location-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 34px;
  padding: 0 14px;
  cursor: pointer;
  white-space: nowrap;
  border: 1px solid rgba(96, 165, 250, 0.35);
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.12);
  color: #93b4f5;
  font: 600 12px 'Inter', sans-serif;
  transition: background 0.2s, transform 0.15s, border-color 0.2s;
}
.location-chip svg { width: 15px; height: 15px; flex-shrink: 0; }
.location-chip:hover:not(:disabled) { background: rgba(37, 99, 235, 0.22); transform: translateY(-1px); }
.location-chip:disabled { opacity: 0.65; cursor: progress; }
.location-chip.ok { color: #86dba6; border-color: rgba(74, 222, 128, 0.35); background: rgba(74, 222, 128, 0.08); }
.location-chip.partial { color: #e8c976; border-color: rgba(232, 201, 118, 0.35); background: rgba(232, 201, 118, 0.08); }
.location-chip.error { color: #f6a4a4; border-color: rgba(239, 68, 68, 0.35); background: rgba(239, 68, 68, 0.08); }

.location-message {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 0 0 12px;
  color: var(--color-texto-general, #94a3b8);
  font: 500 11.5px/1.45 'Inter', sans-serif;
}
.location-message .dot { width: 7px; height: 7px; margin-top: 4px; flex-shrink: 0; border-radius: 50%; background: currentColor; }
.location-message.ok { color: #83d8a2; }
.location-message.partial { color: #e8c976; }
.location-message.error { color: #f6a4a4; }

.coordinates-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  max-width: 100%;
  margin: 0 0 14px;
  padding: 6px 12px;
  border: 1px solid rgba(74, 222, 128, 0.2);
  border-radius: 999px;
  background: rgba(74, 222, 128, 0.06);
  color: #83d8a2;
  font: 600 11px 'Inter', sans-serif;
}
.coordinates-pill svg { width: 14px; height: 14px; flex-shrink: 0; }
.coordinates-pill span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(143, 180, 248, 0.25);
  border-top-color: var(--color-highlight, #8fb4f8);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* =========================================================
   HORARIO / PRECIOS
========================================================= */
.schedule-wrapper { width: 100%; min-width: 0; }

.price-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }

.money-input { position: relative; }
.money-input > span {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 14px;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--color-texto-general, #94a3b8);
  font-size: 13px;
  font-weight: 600;
  opacity: 0.55;
}
.money-input input { padding-left: 30px; font-weight: 600; }

/* =========================================================
   ACCIONES (sin recuadro)
========================================================= */
.actions-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: 20px;
  padding: 0 2px;
}

.form-note {
  max-width: 420px;
  margin: 0;
  color: var(--color-texto-general, #94a3b8);
  font-size: 11.5px;
  line-height: 1.45;
  opacity: 0.6;
}

.btn-primary {
  min-width: 250px;
  min-height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 13px 26px;
  cursor: pointer;
  border: none;
  border-radius: var(--app-border-radius, 12px);
  background: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, #fff);
  font: 700 0.92rem 'Oswald', sans-serif;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  box-shadow: 0 6px 18px color-mix(in srgb, var(--color-botones, #1c4fd6) 40%, transparent);
  transition: filter 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}
.btn-primary svg { width: 17px; height: 17px; transition: transform 0.2s ease; }
.btn-primary:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
  box-shadow: 0 10px 24px color-mix(in srgb, var(--color-botones, #1c4fd6) 50%, transparent);
}
.btn-primary:hover svg { transform: translateX(3px); }
.btn-primary:active { transform: scale(0.98); }

/* =========================================================
   RESPONSIVE
========================================================= */
@media (max-width: 980px) {
  .rg-grid { grid-template-columns: 1fr; }
}

@media (max-width: 560px) {
  .rg-card { padding: 16px 14px 18px; }
  .address-grid,
  .price-grid { grid-template-columns: 1fr; }
  .address-grid .span-2 { grid-column: auto; }
  .identity-row { flex-direction: column; align-items: stretch; }
  .logo-picker { flex-direction: row; justify-content: flex-start; gap: 12px; }
  .logo-hint { text-align: left; }
  .admin-locked-info { flex-wrap: wrap; }
  .admin-curp { width: 100%; }
  .actions-section { flex-direction: column-reverse; align-items: stretch; }
  .form-note { max-width: none; text-align: center; }
  .btn-primary { width: 100%; min-width: 0; }
}
</style>