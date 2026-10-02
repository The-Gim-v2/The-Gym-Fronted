<template>
  <HeadingRecepcion>
    <NotificationSystem ref="toastRef" />
    <main class="main-content">
      <div class="profile-card">
        <!-- PERFIL / FOTO DEL CLIENTE -->
        <aside class="profile-section" id="tutorial-step-0">
          <div class="profile-content">
            <span class="profile-label">{{ t('personalData') }}</span>
            <h1 class="main-title">{{ t('title1') }}<br><span class="highlight">{{ t('title2') }}</span></h1>

            <div class="avatar-wrapper">
              <div class="avatar-ring">
                <div class="avatar-circle" @click="fileInput?.click()">
                  <img v-if="avatarPreview" :src="avatarPreview" :alt="t('altPreview')" class="avatar-img" />
                  <svg v-else viewBox="0 0 24 24" fill="white">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              </div>

              <button type="button" class="avatar-action" @click="fileInput?.click()" :title="t('titleAvatar')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </button>

              <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="handleFileChange" />
            </div>

            <p class="profile-hint">{{ t('hintAvatar') }}</p>

            <dl class="profile-summary">
              <div class="summary-item">
                <dt>{{ currentLang === 'en' ? 'Client' : 'Cliente' }}</dt>
                <dd :class="{ empty: !clientName }">{{ clientName || (currentLang === 'en' ? 'New client' : 'Nuevo cliente') }}</dd>
              </div>

              <div class="summary-item">
                <dt>{{ t('membershipData') }}</dt>
                <dd><span class="plan-chip">{{ form.tipoMembresia === 'mes' ? t('month') : t('week') }}</span></dd>
              </div>

              <div class="summary-item">
                <dt>{{ t('enrollmentDate') }}</dt>
                <dd :class="{ empty: !form.fechaInscripcion }">{{ form.fechaInscripcion || '—' }}</dd>
              </div>

              <div class="summary-item">
                <dt>{{ t('dueDate') }}</dt>
                <dd :class="{ empty: !form.fechaCorte }">{{ form.fechaCorte || '—' }}</dd>
              </div>
            </dl>
          </div>
        </aside>

        <!-- FORMULARIOS -->
        <div class="forms-wrapper">

          <!-- DATOS PERSONALES -->
          <section class="login-card" id="tutorial-step-1">
            <header class="card-header">
              <div class="card-header-text">
                <h3 class="section-title">{{ t('personalData') }}</h3>
                <p class="section-description">{{ currentLang === 'en' ? 'Basic client information' : 'Información básica del cliente' }}</p>
              </div>
            </header>

            <div class="form-grid form-grid-3">
              <div class="input-group">
                <label>{{ t('names') }}<span class="required">*</span></label>
                <input type="text" v-model="form.nombres" :placeholder="t('placeholderName')" autocomplete="given-name" />
              </div>

              <div class="input-group">
                <label>{{ t('lastNameP') }}<span class="required">*</span></label>
                <input type="text" v-model="form.apellidoP" :placeholder="t('placeholderLastNameP')" autocomplete="family-name" />
              </div>

              <div class="input-group">
                <label>{{ t('lastNameM') }}<span class="required">*</span></label>
                <input type="text" v-model="form.apellidoM" :placeholder="t('placeholderLastNameM')" />
              </div>

              <div class="input-group">
                <label>{{ t('birthDate') }}<span class="required">*</span></label>
                <input type="date" v-model="form.fechaNacimiento" />
              </div>

              <div class="input-group">
                <label>{{ t('cellphone') }}</label>
                <div class="input-with-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8.01 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <input type="tel" v-model="form.celular" placeholder="+52 000 000 0000" autocomplete="tel" />
                </div>
              </div>

              <div class="input-group">
                <label>{{ t('email') }}</label>
                <div class="input-with-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input type="email" v-model="form.email" placeholder="ejemplo@correo.com" autocomplete="email" />
                </div>
              </div>
            </div>
          </section>

          <!-- REGISTRO FÍSICO -->
          <section class="login-card" id="tutorial-step-2">
            <header class="card-header">
              <div class="card-header-text">
                <h3 class="section-title">{{ t('physicalRecord') }}</h3>
                <p class="section-description">{{ currentLang === 'en' ? 'Initial physical measurements' : 'Medidas físicas iniciales' }}</p>
              </div>
            </header>

            <div class="physical-grid">
              <div class="measurement-field">
                <div class="measurement-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 3h12l3 18H3L6 3z"/>
                    <path d="M9 8a3 3 0 0 1 6 0"/>
                  </svg>
                </div>
                <div class="measurement-content">
                  <label>{{ t('weight') }}</label>
                  <div class="measurement-input">
                    <input type="number" step="0.1" min="0" v-model="form.peso" placeholder="70" />
                    <span>kg</span>
                  </div>
                </div>
              </div>

              <div class="measurement-field">
                <div class="measurement-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 2v20"/>
                    <path d="M6 4h5"/>
                    <path d="M6 8h3"/>
                    <path d="M6 12h5"/>
                    <path d="M6 16h3"/>
                    <path d="M6 20h5"/>
                    <path d="M15 4v16"/>
                    <path d="m12 7 3-3 3 3"/>
                    <path d="m12 17 3 3 3-3"/>
                  </svg>
                </div>
                <div class="measurement-content">
                  <label>{{ t('height') }}</label>
                  <div class="measurement-input">
                    <input type="number" min="0" v-model="form.altura" placeholder="175" />
                    <span>cm</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- MEMBRESÍA -->
          <section class="login-card" id="tutorial-step-3">
            <header class="card-header membership-header">
              <div class="card-header-text">
                <h3 class="section-title">{{ t('membershipData') }}</h3>
                <p class="section-description">{{ currentLang === 'en' ? 'Select the membership period and registration dates.' : 'Selecciona el periodo de membresía y las fechas del cliente.' }}</p>
              </div>

              <div class="membership-actions-row">
                <div class="toggle-group-small" :data-active="form.tipoMembresia">
                  <button type="button" class="btn-toggle-small" :class="{ active: form.tipoMembresia === 'mes' }" @click="form.tipoMembresia = 'mes'">{{ t('month') }}</button>
                  <button type="button" class="btn-toggle-small" :class="{ active: form.tipoMembresia === 'semana' }" @click="form.tipoMembresia = 'semana'">{{ t('week') }}</button>
                </div>

                <div class="actions-group">
                  <button type="button" class="action-btn" :title="t('titleCut')" @click="activeModal = 'corte'">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                  </button>

                  <button type="button" class="action-btn" :title="t('titleHelp')" @click="activeModal = 'help'">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  </button>
                </div>
              </div>
            </header>

            <div class="membership-date-grid">
              <div class="date-field">
                <div class="date-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div class="date-content">
                  <label>{{ t('enrollmentDate') }}</label>
                  <input type="date" v-model="form.fechaInscripcion" />
                </div>
              </div>

              <div class="date-field">
                <div class="date-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div class="date-content">
                  <label>{{ t('dueDate') }}</label>
                  <input type="date" v-model="form.fechaCorte" />
                </div>
              </div>
            </div>
          </section>

          <!-- BOTÓN REGISTRAR -->
          <div class="registration-footer">
            <div class="required-hint"><span class="required">*</span> {{ currentLang === 'en' ? 'Required fields' : 'Campos obligatorios' }}</div>

            <button type="button" class="btn-primary" @click="saveRegistration">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              {{ t('finishButton') }}
            </button>
          </div>
        </div>
      </div>
    </main>

    <transition name="pop">
      <div v-if="activeModal === 'corte'" class="modal-wrapper" @click.self="activeModal = null">
        <AddCorteComponent @close="activeModal = null" />
      </div>
    </transition>

    <transition name="pop">
      <div v-if="activeModal === 'help'" class="modal-wrapper" @click.self="activeModal = null">
        <Help @close="activeModal = null" />
      </div>
    </transition>
  </HeadingRecepcion>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import HeadingRecepcion from '../HeadingRecepcion.vue';
import AddCorteComponent from '../Componets/Cut.vue';
import Help from '../Componets/Help.vue';
import NotificationSystem from '../../Modals/NotificationSystem.vue';
import { traducciones } from '../i18n.js';

const activeModal = ref(null);
const toastRef = ref(null);
const fileInput = ref(null);
const avatarPreview = ref(null);
const avatarFile = ref(null);

const currentLang = ref(localStorage.getItem('Recepcion-idioma') || 'es');

const t = (key) => {
  const langTable = traducciones[currentLang.value] || traducciones.es;
  return langTable[key] || traducciones.es[key] || key;
};

const handleLangChange = (e) => {
  if (e.detail && e.detail.idioma) currentLang.value = e.detail.idioma;
};

onMounted(() => {
  window.addEventListener('idioma-changed', handleLangChange);
});

onUnmounted(() => {
  window.removeEventListener('idioma-changed', handleLangChange);
  if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value);
});

const form = reactive({
  nombres: '',
  apellidoP: '',
  apellidoM: '',
  fechaNacimiento: '',
  celular: '',
  email: '',
  peso: '',
  altura: '',
  tipoMembresia: 'mes',
  fechaInscripcion: '',
  fechaCorte: ''
});

const clientName = computed(() => {
  return [form.nombres, form.apellidoP, form.apellidoM].filter(Boolean).join(' ');
});

const handleFileChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    toastRef.value?.notify(
      currentLang.value === 'en' ? 'Select a valid image.' : 'Selecciona una imagen válida.',
      'warning'
    );
    e.target.value = '';
    return;
  }

  if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value);

  avatarFile.value = file;
  avatarPreview.value = URL.createObjectURL(file);
};

const saveRegistration = () => {
  if (!form.nombres || !form.apellidoP || !form.apellidoM || !form.fechaNacimiento) {
    toastRef.value?.notify(t('msgWarning'), 'warning');
    return;
  }

  try {
    const data = {
      nombres: form.nombres.trim(),
      apellidoP: form.apellidoP.trim(),
      apellidoM: form.apellidoM.trim(),
      fechaNacimiento: form.fechaNacimiento,
      celular: form.celular.trim(),
      email: form.email.trim(),
      peso: form.peso ? Number(form.peso) : null,
      altura: form.altura ? Number(form.altura) : null,
      tipoMembresia: form.tipoMembresia,
      fechaInscripcion: form.fechaInscripcion,
      fechaCorte: form.fechaCorte,
      foto: avatarFile.value
    };

    console.log('Datos a guardar:', data);
    toastRef.value?.notify(t('msgSuccess'), 'success');
  } catch (error) {
    console.error('Error al registrar cliente:', error);
    toastRef.value?.notify(t('msgError'), 'error');
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;600;700&display=swap');

*{box-sizing:border-box}
.main-content{display:flex;justify-content:center;width:100%;padding:36px clamp(16px,3vw,40px) 56px;color:var(--color-texto-general,#e5e5e5)}
.highlight{color:var(--color-highlight,#3b82f6)}
.profile-card{display:grid;grid-template-columns:300px minmax(0,1fr);gap:24px;width:100%;max-width:1180px;margin:0 auto;align-items:start}

/* PANEL IZQUIERDO - SIN STICKY PARA EVITAR EL CUADRO NEGRO */
.profile-section{position:relative;top:auto;align-self:start;overflow:hidden;padding:34px 24px 26px;text-align:center;border:1px solid var(--border-cards,rgba(255,255,255,.1));border-radius:var(--app-border-radius,24px);background:var(--bg-cards,rgba(18,18,18,.75))}
.profile-section::before{content:'';position:absolute;inset:0 0 auto 0;height:210px;background:radial-gradient(ellipse 70% 100% at 50% 0%,color-mix(in srgb,var(--color-botones,#1c4fd6) 32%,transparent),transparent 75%);pointer-events:none}
.profile-content{position:relative;width:100%}
.profile-label{display:inline-block;margin-bottom:12px;padding:4px 11px;border-radius:999px;border:1px solid color-mix(in srgb,var(--color-highlight,#3b82f6) 35%,transparent);background:color-mix(in srgb,var(--color-highlight,#3b82f6) 10%,transparent);color:var(--color-highlight,#60a5fa);font:600 .66rem 'Inter',sans-serif;letter-spacing:.3px}
.main-title{margin:0 0 26px;font-family:'Anton',sans-serif;font-size:1.85rem;font-weight:400;line-height:1.08;letter-spacing:.4px;text-transform:uppercase;color:var(--color-titulos,#fff)}

.avatar-wrapper{position:relative;width:140px;margin:0 auto 14px}
.avatar-ring{padding:4px;border-radius:50%;background:conic-gradient(from 210deg,var(--color-botones,#1c4fd6),var(--color-highlight,#60a5fa),var(--color-botones,#1c4fd6));box-shadow:0 12px 30px rgba(0,0,0,.4)}
.avatar-circle{width:132px;height:132px;display:flex;align-items:center;justify-content:center;overflow:hidden;cursor:pointer;border-radius:50%;border:4px solid var(--bg-cards,#121212);background:#17191f;transition:filter .2s ease}
.avatar-circle svg{width:52px;height:52px;opacity:.55}
.avatar-img{width:100%;height:100%;object-fit:cover}
.avatar-wrapper:hover .avatar-circle{filter:brightness(1.12)}
.avatar-action{position:absolute;right:2px;bottom:4px;width:38px;height:38px;display:flex;align-items:center;justify-content:center;cursor:pointer;border-radius:50%;border:3px solid var(--bg-cards,#121212);background:var(--color-highlight,#3b82f6);color:#fff;box-shadow:0 4px 10px rgba(0,0,0,.35);transition:transform .2s ease}
.avatar-action:hover{transform:scale(1.08)}
.avatar-action svg{width:17px;height:17px}
.profile-hint{max-width:220px;margin:0 auto;font:400 .76rem/1.5 'Inter',sans-serif;color:var(--color-texto-general,#94a3b8);opacity:.7}

.profile-summary{display:grid;gap:2px;margin:26px 0 0;padding:6px;text-align:left;border-radius:var(--app-border-radius,14px);border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.025)}
.summary-item{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px;border-radius:10px}
.summary-item+.summary-item{border-top:1px solid rgba(255,255,255,.05);border-radius:0}
.summary-item dt{flex-shrink:0;font:500 .7rem 'Inter',sans-serif;color:var(--color-texto-general,#94a3b8);opacity:.7}
.summary-item dd{margin:0;min-width:0;overflow:hidden;text-align:right;text-overflow:ellipsis;white-space:nowrap;font:600 .78rem 'Inter',sans-serif;color:var(--color-titulos,#fff)}
.summary-item dd.empty{font-weight:500;opacity:.4}
.plan-chip{display:inline-block;padding:3px 10px;border-radius:999px;background:color-mix(in srgb,var(--color-highlight,#3b82f6) 18%,transparent);color:var(--color-highlight,#60a5fa);font:600 .72rem 'Inter',sans-serif}

.forms-wrapper{display:flex;flex-direction:column;gap:18px;width:100%;min-width:0}
.login-card{width:100%;padding:26px 28px 28px;border:1px solid var(--border-cards,rgba(255,255,255,.12));border-radius:var(--app-border-radius,24px);background:var(--bg-cards,rgba(18,18,18,.75));backdrop-filter:blur(12px);transition:border-color .2s ease,box-shadow .2s ease}
.login-card:hover{border-color:rgba(255,255,255,.2);box-shadow:0 12px 32px rgba(0,0,0,.22)}
.login-card:focus-within{border-color:color-mix(in srgb,var(--color-highlight,#3b82f6) 45%,transparent)}

.card-header{display:flex;align-items:center;gap:14px;margin-bottom:22px;padding-bottom:18px;border-bottom:1px solid rgba(255,255,255,.07)}
.card-header-text{flex:1;min-width:0}
.section-title{display:flex;align-items:center;gap:12px;margin:0;font-family:'Anton',sans-serif;font-size:1.2rem;font-weight:400;letter-spacing:.5px;text-transform:uppercase;color:var(--color-titulos,#fff)}
.section-title::before{content:'';width:4px;height:20px;border-radius:4px;flex-shrink:0;background:linear-gradient(180deg,var(--color-botones,#1c4fd6),rgba(37,99,235,.25))}
.section-description{margin:3px 0 0;font:400 .74rem/1.4 'Inter',sans-serif;color:var(--color-texto-general,#94a3b8);opacity:.6}

.form-grid{display:grid;gap:18px}
.form-grid-3{grid-template-columns:repeat(3,minmax(0,1fr))}
.input-group{display:flex;flex-direction:column;gap:7px;min-width:0}
label{font:600 .78rem 'Oswald',sans-serif;letter-spacing:.4px;color:var(--color-texto-general,#f5f5f4)}
.required{margin-left:3px;color:var(--color-highlight,#3b82f6)}

input{width:100%;height:46px;padding:0 14px;outline:none;border:1.5px solid var(--border-input,rgba(255,255,255,.12));border-radius:var(--app-border-radius,12px);background:var(--bg-input,rgba(255,255,255,.03));color:var(--color-texto-input,var(--color-texto-general,#fff));font:400 .88rem 'Inter',sans-serif;color-scheme:var(--color-scheme,dark);transition:border-color .2s,box-shadow .2s,background .2s}
input::placeholder{color:var(--color-texto-general,#94a3b8);opacity:.4}
input:hover{border-color:rgba(255,255,255,.22)}
input:focus{border-color:var(--color-highlight,#3b82f6);background:var(--bg-input-focus,rgba(255,255,255,.045));box-shadow:0 0 0 3px rgba(59,130,246,.18)}

.input-with-icon{position:relative}
.input-with-icon>svg{position:absolute;z-index:2;top:50%;left:14px;width:16px;height:16px;pointer-events:none;transform:translateY(-50%);color:var(--color-texto-general,#94a3b8);opacity:.55;transition:color .2s,opacity .2s}
.input-with-icon:focus-within>svg{color:var(--color-highlight,#3b82f6);opacity:1}
.input-with-icon input{padding-left:40px}

.physical-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.measurement-field,.date-field{display:flex;align-items:center;gap:14px;min-width:0;padding:16px;border:1px solid rgba(255,255,255,.08);border-radius:var(--app-border-radius,14px);background:rgba(255,255,255,.02);transition:border-color .2s,background .2s}
.measurement-field:focus-within,.date-field:focus-within{border-color:color-mix(in srgb,var(--color-highlight,#3b82f6) 50%,transparent);background:color-mix(in srgb,var(--color-highlight,#3b82f6) 5%,transparent)}
.measurement-icon,.date-icon{width:44px;height:44px;flex-shrink:0;display:flex;align-items:center;justify-content:center;border-radius:12px;background:color-mix(in srgb,var(--color-highlight,#3b82f6) 14%,transparent);color:var(--color-highlight,#60a5fa)}
.measurement-icon svg,.date-icon svg{width:20px;height:20px}
.measurement-content,.date-content{flex:1;min-width:0}
.measurement-content label,.date-content label{display:block;margin-bottom:7px}
.measurement-input{position:relative}
.measurement-input input{padding-right:46px;font-weight:600;font-size:.95rem}
.measurement-input span{position:absolute;top:50%;right:14px;transform:translateY(-50%);pointer-events:none;font:600 .74rem 'Inter',sans-serif;color:var(--color-texto-general,#94a3b8);opacity:.7}

.membership-header{flex-wrap:wrap}
.membership-actions-row{display:flex;align-items:center;gap:12px}
.toggle-group-small{position:relative;display:grid;grid-template-columns:1fr 1fr;padding:4px;border:1px solid rgba(255,255,255,.07);border-radius:var(--app-border-radius,12px);background:rgba(255,255,255,.05)}
.toggle-group-small::before{content:'';position:absolute;top:4px;bottom:4px;left:4px;width:calc(50% - 4px);border-radius:calc(var(--app-border-radius,12px) - 3px);background:var(--color-highlight,#3b82f6);box-shadow:0 3px 10px rgba(59,130,246,.4);transition:transform .25s cubic-bezier(.4,0,.2,1)}
.toggle-group-small[data-active='semana']::before{transform:translateX(100%)}
.btn-toggle-small{position:relative;z-index:1;min-width:84px;padding:8px 16px;cursor:pointer;border:none;background:transparent;color:#a1a1aa;font:600 .78rem 'Oswald',sans-serif;letter-spacing:.4px;transition:color .2s ease}
.btn-toggle-small:hover,.btn-toggle-small.active{color:#fff}

.actions-group{display:flex;gap:8px}
.action-btn{width:38px;height:38px;display:flex;align-items:center;justify-content:center;cursor:pointer;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:rgba(255,255,255,.05);color:var(--color-texto-general,#cbd5e1);transition:background .2s,color .2s,border-color .2s,transform .15s}
.action-btn:hover{background:var(--color-highlight,#3b82f6);border-color:var(--color-highlight,#3b82f6);color:#fff;transform:translateY(-2px)}
.action-btn svg{width:16px;height:16px}

.membership-date-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}

.registration-footer{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:4px 2px 0}
.required-hint{font:500 .74rem 'Inter',sans-serif;color:var(--color-texto-general,#94a3b8);opacity:.7}

.btn-primary{min-width:240px;display:inline-flex;align-items:center;justify-content:center;gap:9px;padding:14px 30px;cursor:pointer;border:none;border-radius:var(--app-border-radius,12px);background:var(--color-botones,#1c4fd6);color:var(--color-texto-botones,#fff);font:700 .95rem 'Oswald',sans-serif;letter-spacing:.6px;text-transform:uppercase;box-shadow:0 6px 18px color-mix(in srgb,var(--color-botones,#1c4fd6) 45%,transparent);transition:transform .2s ease,filter .2s ease,box-shadow .2s ease}
.btn-primary svg{width:17px;height:17px}
.btn-primary:hover{transform:translateY(-2px);filter:brightness(1.1);box-shadow:0 10px 24px color-mix(in srgb,var(--color-botones,#1c4fd6) 55%,transparent)}
.btn-primary:active{transform:scale(.98)}

.modal-wrapper{position:fixed;z-index:1000;inset:0;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.75);backdrop-filter:blur(6px)}
.pop-enter-active,.pop-leave-active{transition:all .25s cubic-bezier(.175,.885,.32,1.275)}
.pop-enter-from,.pop-leave-to{opacity:0;transform:scale(.9)}

:deep(.notification-container),:deep(.toast-container){width:calc(100% - 32px)!important;max-width:480px!important;box-sizing:border-box!important;left:50%!important;right:auto!important;margin:0 auto!important;transform:translateX(-50%)!important}

@media(max-width:1050px){
  .profile-card{grid-template-columns:260px minmax(0,1fr)}
  .form-grid-3{grid-template-columns:repeat(2,minmax(0,1fr))}
}

@media(max-width:850px){
  .profile-card{grid-template-columns:1fr}
  .profile-section{position:relative;top:auto;transform:none}
  .profile-content{max-width:420px;margin:0 auto}
}

@media(max-width:650px){
  .main-content{padding:14px 12px 30px}
  .login-card{padding:20px 17px 22px}
  .form-grid-3,.physical-grid,.membership-date-grid{grid-template-columns:1fr}
  .membership-actions-row{width:100%;justify-content:space-between}
  .toggle-group-small{flex:1}
  .registration-footer{flex-direction:column-reverse;align-items:stretch}
  .required-hint{text-align:center}
  .btn-primary{width:100%;min-width:0}
}

@media(max-width:420px){
  .profile-section{padding:28px 16px 22px}
  .main-title{font-size:1.6rem}
  .measurement-field,.date-field{padding:13px;gap:11px}
  .measurement-icon,.date-icon{width:38px;height:38px}
}
</style>