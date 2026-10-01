<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import MembershipModal from './MembershipModal.vue';
import WeeklySchedule from './WeeklySchedule.vue';

const route = useRoute();

const fileInput = ref<HTMLInputElement | null>(null);
const previewImage = ref<string | null>(null);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const submitted = ref(false);
const showPaymentModal = ref(false);
const errorMessage = ref<string | null>(null);

const planQuery = ((route.query.plan as string) || '').toLowerCase();

const form = reactive({
  nombreGimnasio: '',
  curp: '', nombres: '', apellidoP: '', apellidoM: '',
  fechaNac: '', celular: '',
  email: '', password: '', confirmPassword: '',
  entidad: '', municipio: '',
  lat: null as number | null, lng: null as number | null,
  horarios: {} as Record<string, { open: string; close: string }>,
  precioMes: '', precioSem: '',
  tipoMembresia: planQuery ? `Plan ${route.query.plan}` : 'Plan Pro Mensual'
});

const triggerFileInput = () => fileInput.value?.click();

const onFileSelected = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) previewImage.value = URL.createObjectURL(file);
};

/* UBICACIÓN */
const locating = ref(false);
const locationStatus = ref<'idle' | 'ok' | 'partial' | 'error'>('idle');
const locationMessage = ref('');

const useMyLocation = () => {
  if (!('geolocation' in navigator)) {
    locationStatus.value = 'error';
    locationMessage.value = 'Tu dispositivo no permite obtener la ubicación. Escríbela manualmente.';
    return;
  }

  locating.value = true;
  locationStatus.value = 'idle';

  navigator.geolocation.getCurrentPosition(
    async pos => {
      form.lat = pos.coords.latitude;
      form.lng = pos.coords.longitude;

      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&accept-language=es&lat=${form.lat}&lon=${form.lng}`;
        const res = await fetch(url);
        const data = await res.json();
        const a = data.address || {};

        form.entidad = a.state || form.entidad;
        form.municipio = a.city || a.town || a.municipality || a.village || a.county || form.municipio;

        locationStatus.value = form.entidad && form.municipio ? 'ok' : 'partial';
        locationMessage.value = locationStatus.value === 'ok'
          ? 'Ubicación detectada. Puedes corregirla si hace falta.'
          : 'Guardamos tu ubicación, pero completa estado y municipio a mano.';
      } catch {
        locationStatus.value = 'partial';
        locationMessage.value = 'Guardamos tu ubicación, pero completa estado y municipio a mano.';
      } finally {
        locating.value = false;
      }
    },
    err => {
      locating.value = false;
      locationStatus.value = 'error';
      locationMessage.value = err.code === err.PERMISSION_DENIED
        ? 'Permiso de ubicación denegado. Actívalo en tu navegador o escríbela manualmente.'
        : 'No pudimos obtener tu ubicación. Escríbela manualmente.';
    },
    { enableHighAccuracy: true, timeout: 12000 }
  );
};

const handleRegisterClick = () => {
  errorMessage.value = null;

  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Las contraseñas no coinciden. Por favor, verifícalas.';
    return;
  }

  if (Object.keys(form.horarios).length === 0) {
    errorMessage.value = 'Por favor, selecciona al menos un día de apertura.';
    return;
  }

  showPaymentModal.value = true;
};

const handlePaymentSuccess = (msg: string) => {
  showPaymentModal.value = false;
  console.log(msg, { ...form });
  submitted.value = true;
};
</script>

<template>
  <div class="register-page">
    <MembershipModal
      v-if="showPaymentModal"
      v-model="form.tipoMembresia"
      @close="showPaymentModal = false"
      @success="handlePaymentSuccess"
    />

    <main class="main-content">
      <div class="register-card">

        <div class="header-section">
          <h1>REGISTRA TU <span>GIMNASIO</span></h1>
          <p>Solo lo básico para empezar. El resto lo completas después desde tu perfil.</p>
        </div>

        <div v-if="submitted" class="alert success">
          ¡Solicitud enviada con éxito! Revisaremos los datos de tu gimnasio y te contactaremos pronto.
        </div>

        <div v-if="errorMessage" class="alert error">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleRegisterClick">
          <div class="rg-grid">

            <!-- =======================
                 COLUMNA 1
            ======================== -->
            <div class="form-column">
              <h3 class="section-title first">Tu gimnasio</h3>

              <div class="upload-container">
                <div class="image-preview" @click="triggerFileInput">
                  <img v-if="previewImage" :src="previewImage" class="profile-img" alt="Vista previa logo" />

                  <div v-else class="upload-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                    <span>Logo</span>
                  </div>
                </div>

                <input ref="fileInput" type="file" accept="image/*" hidden @change="onFileSelected" />

                <div class="upload-text">
                  <strong>Logotipo del gimnasio</strong>
                  <span>Opcional · JPG, PNG o WEBP</span>
                </div>
              </div>

              <div class="field">
                <label for="nombreGimnasio">Nombre del gimnasio</label>
                <input id="nombreGimnasio" v-model="form.nombreGimnasio" type="text" placeholder="Ej. Iron Fitness Center" required />
              </div>

              <h3 class="section-title">Ubicación</h3>

              <button
                type="button"
                class="location-btn"
                :class="locationStatus"
                :disabled="locating"
                @click="useMyLocation"
              >
                <span v-if="locating" class="spinner"></span>

                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                  <circle cx="12" cy="12" r="8"/>
                </svg>

                {{ locating ? 'Obteniendo ubicación…' : 'Usar mi ubicación actual' }}
              </button>

              <p v-if="locationMessage" class="location-message" :class="locationStatus">
                {{ locationMessage }}
              </p>

              <div class="field-row">
                <div class="field">
                  <label for="entidad">Estado</label>
                  <input id="entidad" v-model="form.entidad" type="text" placeholder="Ej. Tamaulipas" required />
                </div>

                <div class="field">
                  <label for="municipio">Municipio</label>
                  <input id="municipio" v-model="form.municipio" type="text" placeholder="Ej. Tampico" required />
                </div>
              </div>

              <h3 class="section-title">Precios</h3>

              <div class="field-row">
                <div class="field">
                  <div class="label-help">
                    <label for="precioMes">Mensualidad ($)</label>

                    <span class="help-icon">
                      ?
                      <span class="tooltip">Precio fijo para los pagos mensuales del sistema.</span>
                    </span>
                  </div>

                  <div class="money-input">
                    <span>$</span>
                    <input id="precioMes" v-model="form.precioMes" type="number" min="0" placeholder="0.00" required />
                  </div>
                </div>

                <div class="field">
                  <div class="label-help">
                    <label for="precioSem">Semanal ($)</label>

                    <span class="help-icon">
                      ?
                      <span class="tooltip">Precio fijo para los accesos semanales.</span>
                    </span>
                  </div>

                  <div class="money-input">
                    <span>$</span>
                    <input id="precioSem" v-model="form.precioSem" type="number" min="0" placeholder="0.00" required />
                  </div>
                </div>
              </div>
            </div>

            <!-- =======================
                 COLUMNA 2
            ======================== -->
            <div class="form-column">
              <h3 class="section-title first">Datos personales</h3>

              <div class="fields">
                <div class="field">
                  <label for="curp">CURP</label>
                  <input id="curp" v-model="form.curp" type="text" maxlength="18" placeholder="ABCD123456HDFR01" required />
                </div>

                <div class="field">
                  <label for="nombres">Nombre(s)</label>
                  <input id="nombres" v-model="form.nombres" type="text" placeholder="Ingresa tus nombres" required />
                </div>

                <div class="field-row">
                  <div class="field">
                    <label for="apellidoP">Apellido paterno</label>
                    <input id="apellidoP" v-model="form.apellidoP" type="text" placeholder="Paterno" required />
                  </div>

                  <div class="field">
                    <label for="apellidoM">Apellido materno</label>
                    <input id="apellidoM" v-model="form.apellidoM" type="text" placeholder="Materno" required />
                  </div>
                </div>

                <div class="field-row">
                  <div class="field">
                    <label for="fechaNac">Fecha de nacimiento</label>
                    <input id="fechaNac" v-model="form.fechaNac" type="date" required />
                  </div>

                  <div class="field">
                    <label for="celular">Teléfono celular</label>
                    <input id="celular" v-model="form.celular" type="tel" placeholder="Ej. 4811234567" required />
                  </div>
                </div>
              </div>

              <h3 class="section-title">Cuenta de acceso</h3>

              <div class="fields">
                <div class="field">
                  <label for="email">Correo electrónico</label>
                  <input id="email" v-model="form.email" type="email" placeholder="admin@gimnasio.com" required />
                </div>

                <div class="field-row">
                  <div class="field">
                    <label for="password">Contraseña</label>

                    <div class="password-field">
                      <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" required />

                      <button type="button" aria-label="Mostrar contraseña" @click="showPassword = !showPassword">
                        <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>

                        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                          <rect x="3" y="11" width="18" height="10" rx="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div class="field">
                    <label for="confirmPassword">Confirmar contraseña</label>

                    <div class="password-field">
                      <input id="confirmPassword" v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" placeholder="••••••••" required />

                      <button type="button" aria-label="Mostrar contraseña" @click="showConfirmPassword = !showConfirmPassword">
                        <svg v-if="showConfirmPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>

                        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                          <rect x="3" y="11" width="18" height="10" rx="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- =======================
                 COLUMNA 3
            ======================== -->
            <div class="form-column rg-col3">
              <h3 class="section-title first">Horarios de apertura</h3>

              <div class="schedule-wrapper">
                <WeeklySchedule
                  v-model="form.horarios"
                  open-label="Apertura"
                  close-label="Cierre"
                  days-label="Días de apertura"
                />
              </div>

              <div class="actions">
                <button type="submit" class="submit-btn">
                  <span>Registrar gimnasio y pagar</span>

                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                  </svg>
                </button>

                <p class="login-link">
                  ¿Ya tienes cuenta?
                  <router-link :to="{ name: 'login' }">Inicia sesión</router-link>
                </p>
              </div>
            </div>

          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
.register-page { position: relative; color: #f5f5f4; font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
.main-content { display: flex; justify-content: center; width: 100%; padding: 24px clamp(16px,3vw,40px) 40px; box-sizing: border-box; }
.register-card { width: 100%; max-width: 1400px; padding: clamp(26px,3vw,40px); box-sizing: border-box; background: linear-gradient(145deg,rgba(19,19,20,.94),rgba(12,12,13,.96)); border: 1px solid rgba(255,255,255,.08); border-radius: 22px; box-shadow: 0 28px 65px rgba(0,0,0,.45),inset 0 1px rgba(255,255,255,.025); }

.header-section { margin-bottom: 32px; text-align: center; }
.header-section h1 { margin: 0 0 8px; color: #f5f5f4; font-family: 'Anton',sans-serif; font-size: clamp(1.8rem,4vw,2.35rem); font-weight: 400; line-height: 1.1; letter-spacing: -.4px; text-transform: uppercase; }
.header-section h1 span { color: #4e7fe8; }
.header-section p { max-width: 580px; margin: 0 auto; color: rgba(245,245,244,.46); font-size: 13px; line-height: 1.5; }

.alert { margin-bottom: 22px; padding: 13px 15px; border-radius: 10px; font-size: 13px; font-weight: 500; line-height: 1.45; }
.alert.success { color: #a9c0f5; background: rgba(28,79,214,.1); border: 1px solid rgba(78,119,218,.3); }
.alert.error { color: #fca5a5; background: rgba(239,68,68,.09); border: 1px solid rgba(239,68,68,.28); }

.rg-grid { display: grid; grid-template-columns: 1fr; gap: clamp(28px,3vw,42px); align-items: start; }
.form-column,.fields,.field { display: flex; flex-direction: column; }
.form-column { gap: 14px; min-width: 0; }
.fields { gap: 14px; }
.field { gap: 7px; min-width: 0; }
.field-row { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }

.section-title { display: flex; align-items: center; gap: 7px; margin: 16px 0 1px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,.07); color: #6e94e9; font-family: inherit; font-size: 11px; font-weight: 700; letter-spacing: .7px; text-transform: uppercase; }
.section-title.first { margin-top: 0; }

label { color: rgba(245,245,244,.72); font-family: inherit; font-size: 11px; font-weight: 600; line-height: 1.4; }
input { width: 100%; min-width: 0; min-height: 46px; padding: 11px 13px; box-sizing: border-box; background: rgba(255,255,255,.025); border: 1px solid rgba(255,255,255,.105); border-radius: 10px; outline: none; color: #f5f5f4; font-family: inherit; font-size: 13px; font-weight: 500; transition: border-color .2s ease,background .2s ease,box-shadow .2s ease; }
input::placeholder { color: rgba(245,245,244,.27); font-weight: 400; }
input:hover { border-color: rgba(255,255,255,.17); }
input:focus { border-color: #3c69d5; background: rgba(255,255,255,.035); box-shadow: 0 0 0 3px rgba(28,79,214,.11); }
input[type="date"] { color-scheme: dark; }

.upload-container { display: flex; align-items: center; gap: 14px; padding: 13px; background: rgba(255,255,255,.018); border: 1px dashed rgba(255,255,255,.13); border-radius: 12px; transition: .2s ease; }
.upload-container:hover { border-color: rgba(91,139,240,.36); background: rgba(91,139,240,.02); }
.image-preview { width: 66px; height: 66px; flex-shrink: 0; display: grid; place-items: center; overflow: hidden; background: #111214; border: 1px solid rgba(255,255,255,.1); border-radius: 10px; cursor: pointer; }
.profile-img { width: 100%; height: 100%; object-fit: cover; }
.upload-placeholder { display: flex; flex-direction: column; align-items: center; gap: 5px; color: rgba(245,245,244,.38); }
.upload-placeholder svg { width: 20px; height: 20px; }
.upload-placeholder span { font-size: 8px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; }
.upload-text { display: flex; flex-direction: column; gap: 4px; }
.upload-text strong { color: rgba(245,245,244,.78); font-size: 11.5px; font-weight: 600; }
.upload-text span { color: rgba(245,245,244,.35); font-size: 10px; }

.password-field { position: relative; }
.password-field input { padding-right: 42px; }
.password-field button { position: absolute; top: 0; right: 0; width: 42px; height: 100%; display: grid; place-items: center; padding: 0; border: 0; background: transparent; color: rgba(245,245,244,.36); cursor: pointer; }
.password-field button:hover { color: rgba(245,245,244,.75); }
.password-field svg { width: 17px; height: 17px; }

.location-btn { width: 100%; min-height: 46px; display: flex; align-items: center; justify-content: center; gap: 9px; padding: 11px 14px; border: 1px solid rgba(77,117,210,.38); border-radius: 10px; background: rgba(28,79,214,.075); color: #8aa9ef; font-family: inherit; font-size: 11.5px; font-weight: 600; cursor: pointer; transition: background .2s ease,border-color .2s ease,color .2s ease; }
.location-btn svg { width: 17px; height: 17px; }
.location-btn:hover:not(:disabled) { background: rgba(28,79,214,.13); border-color: rgba(77,117,210,.55); }
.location-btn:disabled { opacity: .65; cursor: progress; }
.location-btn.ok { color: #86dba6; background: rgba(74,222,128,.065); border-color: rgba(74,222,128,.28); }

.location-message { margin: -5px 0 0; color: rgba(245,245,244,.45); font-size: 10.5px; line-height: 1.45; }
.location-message.ok { color: #83d8a2; }
.location-message.error { color: #f6a4a4; }
.location-message.partial { color: #e8c976; }

.spinner { width: 14px; height: 14px; border: 2px solid rgba(143,180,248,.25); border-top-color: #8fb4f8; border-radius: 50%; animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.label-help { display: flex; align-items: center; gap: 6px; }
.help-icon { position: relative; width: 15px; height: 15px; display: grid; place-items: center; flex-shrink: 0; border-radius: 50%; background: rgba(255,255,255,.07); color: rgba(245,245,244,.5); font-size: 9px; font-weight: 700; cursor: help; }
.tooltip { position: absolute; z-index: 50; bottom: calc(100% + 8px); left: 50%; width: 185px; padding: 8px 10px; visibility: hidden; opacity: 0; transform: translateX(-50%) translateY(3px); border: 1px solid rgba(255,255,255,.1); border-radius: 8px; background: #161719; box-shadow: 0 12px 28px rgba(0,0,0,.5); color: rgba(245,245,244,.72); font-family: 'Inter',sans-serif; font-size: 10px; font-weight: 400; line-height: 1.4; text-align: center; transition: .15s ease; }
.help-icon:hover .tooltip { visibility: visible; opacity: 1; transform: translateX(-50%) translateY(0); }

.money-input { position: relative; }
.money-input > span { position: absolute; z-index: 1; top: 50%; left: 13px; transform: translateY(-50%); color: rgba(245,245,244,.38); font-size: 12px; font-weight: 600; pointer-events: none; }
.money-input input { padding-left: 27px; }

.schedule-wrapper { min-width: 0; padding: 3px 0; }

.actions { display: flex; flex-direction: column; gap: 12px; margin-top: 18px; }
.submit-btn { width: 100%; min-height: 49px; display: flex; align-items: center; justify-content: center; gap: 9px; padding: 12px 16px; border: 0; border-radius: 10px; background: #1c4fd6; color: #fff; font-family: inherit; font-size: 12px; font-weight: 700; letter-spacing: .3px; text-transform: uppercase; cursor: pointer; box-shadow: 0 8px 22px rgba(28,79,214,.22); transition: background .2s ease,transform .2s ease,box-shadow .2s ease; }
.submit-btn:hover { background: #2459df; transform: translateY(-1px); box-shadow: 0 11px 26px rgba(28,79,214,.28); }
.submit-btn svg { width: 17px; height: 17px; transition: transform .2s ease; }
.submit-btn:hover svg { transform: translateX(3px); }

.login-link { margin: 0; color: rgba(245,245,244,.4); font-size: 11.5px; text-align: center; }
.login-link a { color: #7197eb; font-weight: 600; text-decoration: none; }
.login-link a:hover { text-decoration: underline; }

@media (min-width:1200px) {
  .rg-grid { grid-template-columns: repeat(3,minmax(0,1fr)); }
}

@media (min-width:900px) and (max-width:1199px) {
  .rg-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .rg-col3 { grid-column: 1/-1; width: 100%; max-width: 700px; margin: 0 auto; }
}

@media (max-width:768px) {
  .main-content { padding: 18px 14px 30px; }
  .register-card { padding: 22px 18px; border-radius: 18px; }
  .field-row { grid-template-columns: 1fr; }
}

@media (max-width:420px) {
  .register-card { padding: 20px 15px; }
  .header-section h1 { font-size: 1.7rem; }
  .header-section p { font-size: 12px; }
  .upload-container { align-items: flex-start; }
}
</style>