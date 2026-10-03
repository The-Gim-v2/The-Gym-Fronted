<script setup>
import { reactive, ref, computed, nextTick, onMounted, onUnmounted } from 'vue';
import HeadingOwner from '../HeadingOwner.vue';
import { traducciones } from '../i18n.js';
import NotificationSystem from '../../Modals/NotificationSystem.vue';

/* ============================ GENERAL ============================ */

const toastRef = ref(null);
const searchQuery = ref('');
const currentLang = ref(localStorage.getItem('owner-idioma') || 'es');

const t = (key) => {
  const langTable = traducciones[currentLang.value] || traducciones.es;
  return langTable?.[key] || traducciones.es?.[key] || key;
};

const txt = (es, en) => (currentLang.value === 'en' ? en : es);

const handleLangChange = (event) => {
  if (event.detail?.idioma) currentLang.value = event.detail.idioma;
};

/* ============================ FORMULARIO ============================ */

const form = reactive({
  curp: '',
  nombres: 'Carlos Luis',
  apellidoPaterno: 'Ramírez',
  apellidoMaterno: '',
  fechaNacimiento: '',
  celular: '',
  facebook: '',
  instagram: '',
  tiktok: '',
  otrasApp: '',
  correo: '',
  sedes: ['sede_norte'],
  rol: '',
  especialidad: '',
  entrada: '',
  salida: ''
});

const initials = computed(() =>
  [form.nombres, form.apellidoPaterno]
    .filter(Boolean)
    .map((value) => value.trim().charAt(0))
    .join('')
    .toUpperCase()
);

/* ============================ SEDES ============================ */

const listaSedes = ref([
  { id: 'sede_norte', nombre: 'Sucursal Norte (Centro)' },
  { id: 'sede_sur', nombre: 'Sucursal Sur (Plaza)' },
  { id: 'sede_oriente', nombre: 'Sucursal Oriente' },
  { id: 'sede_poniente', nombre: 'Sucursal Poniente' }
]);

const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

const toggleSede = (id) => {
  const index = form.sedes.indexOf(id);
  if (index > -1) form.sedes.splice(index, 1);
  else form.sedes.push(id);
};

const getSedesDisplayText = () => {
  if (form.sedes.length === 0) {
    return txt('Seleccionar sedes...', 'Select locations...');
  }

  return listaSedes.value
    .filter((sede) => form.sedes.includes(sede.id))
    .map((sede) => sede.nombre)
    .join(', ');
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};

const handleKeydown = (event) => {
  if (event.key === 'Escape') isDropdownOpen.value = false;
};

/* ============================ BÚSQUEDA ============================ */

const handleSearch = () => {
  if (!searchQuery.value.trim()) return;
  console.log('Buscando usuario:', searchQuery.value);
};

/* ============================ FOTO ============================ */

const fileInput = ref(null);
const avatarFile = ref(null);

const avatarSrc = ref(
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
);

const showPhotoOptions = ref(false);
const openPhotoOptions = () => (showPhotoOptions.value = true);
const closePhotoOptions = () => (showPhotoOptions.value = false);

const selectPhoto = () => {
  showPhotoOptions.value = false;
  if (!fileInput.value) return;
  fileInput.value.value = '';
  fileInput.value.click();
};

const setAvatarFile = (file) => {
  if (!file) return;

  if (avatarSrc.value && avatarSrc.value.startsWith('blob:')) {
    URL.revokeObjectURL(avatarSrc.value);
  }

  avatarFile.value = file;
  avatarSrc.value = URL.createObjectURL(file);
};

const handleFileChange = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    toastRef.value?.notify(
      txt('Selecciona una imagen válida.', 'Select a valid image.'),
      'warning'
    );
    event.target.value = '';
    return;
  }

  setAvatarFile(file);
  toastRef.value?.notify(
    txt('Foto seleccionada correctamente.', 'Photo selected successfully.'),
    'success'
  );
  event.target.value = '';
};

/* ============================ CÁMARA REAL ============================ */

const showCamera = ref(false);
const videoRef = ref(null);
const canvasRef = ref(null);
const cameraStream = ref(null);
const cameraFacingMode = ref('user');
const switchingCamera = ref(false);

const stopCamera = () => {
  if (cameraStream.value) {
    cameraStream.value.getTracks().forEach((track) => track.stop());
    cameraStream.value = null;
  }
  if (videoRef.value) videoRef.value.srcObject = null;
};

const startCamera = async () => {
  stopCamera();

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: { ideal: cameraFacingMode.value },
      width: { ideal: 1280 },
      height: { ideal: 720 }
    }
  });

  cameraStream.value = stream;
  await nextTick();

  if (!videoRef.value) {
    throw new Error('No se encontró el visor de cámara.');
  }

  videoRef.value.srcObject = stream;
  await videoRef.value.play();
};

const takePhoto = async () => {
  showPhotoOptions.value = false;

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    toastRef.value?.notify(
      txt(
        'Este navegador no permite utilizar la cámara.',
        'Camera is not supported by this browser.'
      ),
      'warning'
    );
    return;
  }

  cameraFacingMode.value = 'user';
  showCamera.value = true;
  await nextTick();

  try {
    await startCamera();
  } catch (error) {
    console.error(error);
    stopCamera();
    showCamera.value = false;

    let message = txt('No se pudo acceder a la cámara.', 'Could not access the camera.');

    if (error?.name === 'NotAllowedError') {
      message = txt(
        'Permiso de cámara rechazado. Actívalo desde el navegador.',
        'Camera permission was denied. Enable it in your browser.'
      );
    }
    if (error?.name === 'NotFoundError') {
      message = txt(
        'No se encontró una cámara en este dispositivo.',
        'No camera was found on this device.'
      );
    }
    if (error?.name === 'NotReadableError') {
      message = txt(
        'La cámara está siendo utilizada por otra aplicación.',
        'The camera is being used by another application.'
      );
    }

    toastRef.value?.notify(message, 'warning');
  }
};

const switchCamera = async () => {
  if (switchingCamera.value) return;
  switchingCamera.value = true;

  const previous = cameraFacingMode.value;
  cameraFacingMode.value = previous === 'user' ? 'environment' : 'user';

  try {
    await startCamera();
  } catch (error) {
    console.error(error);
    cameraFacingMode.value = previous;

    try {
      await startCamera();
    } catch {
      closeCamera();
    }

    toastRef.value?.notify(
      txt('La cámara seleccionada no está disponible.', 'The selected camera is not available.'),
      'warning'
    );
  } finally {
    switchingCamera.value = false;
  }
};

const closeCamera = () => {
  stopCamera();
  showCamera.value = false;
  switchingCamera.value = false;
};

const capturePhoto = () => {
  if (switchingCamera.value) return;

  const video = videoRef.value;
  const canvas = canvasRef.value;

  if (!video || !canvas || !video.videoWidth || !video.videoHeight) {
    toastRef.value?.notify(
      txt('La cámara todavía no está lista.', 'The camera is not ready yet.'),
      'warning'
    );
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const context = canvas.getContext('2d');
  if (!context) return;

  if (cameraFacingMode.value === 'user') {
    context.save();
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    context.restore();
  } else {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
  }

  canvas.toBlob(
    (blob) => {
      if (!blob) return;

      const file = new File([blob], `personal-${Date.now()}.jpg`, {
        type: 'image/jpeg'
      });

      setAvatarFile(file);
      closeCamera();

      toastRef.value?.notify(
        txt('Foto tomada correctamente.', 'Photo captured successfully.'),
        'success'
      );
    },
    'image/jpeg',
    0.92
  );
};

/* ============================ GUARDAR ============================ */

const saveChanges = () => {
  console.log('Guardando cambios...', { ...form, foto: avatarFile.value });

  toastRef.value?.notify(
    txt('Guardado correctamente', 'Saved successfully'),
    'success'
  );
};

/* ============================ CICLO DE VIDA ============================ */

onMounted(() => {
  window.addEventListener('idioma-changed', handleLangChange);
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('idioma-changed', handleLangChange);
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleKeydown);
  stopCamera();

  if (avatarSrc.value && avatarSrc.value.startsWith('blob:')) {
    URL.revokeObjectURL(avatarSrc.value);
  }
});
</script>

<template>
  <HeadingOwner>
    <NotificationSystem ref="toastRef" />

    <main class="main-content">
      <!-- ENCABEZADO -->
      <header class="page-header">
        <div class="page-heading">
          <span class="eyebrow">
            {{ txt('GESTIÓN DE PERSONAL', 'STAFF MANAGEMENT') }}
          </span>

          <h1>
            {{ txt('Perfil del', 'Staff') }}
            <span>{{ txt('personal', 'profile') }}</span>
          </h1>

          <p>
            {{
              txt(
                'Administra la información, credenciales, sedes y horario del personal.',
                'Manage staff information, credentials, locations and work schedules.'
              )
            }}
          </p>
        </div>

        <div id="tutor-0" class="input-group search-small">
          <label for="staff-search">{{ t('searchStaffLabel') }}</label>

          <div class="search-input-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
              id="staff-search"
              v-model="searchQuery"
              type="text"
              :placeholder="t('searchPlaceholder')"
              @keyup.enter="handleSearch"
            />
          </div>
        </div>
      </header>

      <div class="profile-card">
        <!-- PERFIL -->
        <aside id="tutor-1" class="profile-section">
          <div id="tutor-2" class="avatar-wrapper">
            <button
              type="button"
              class="avatar-circle"
              :aria-label="txt('Cambiar foto', 'Change photo')"
              @click="openPhotoOptions"
            >
              <img
                v-if="avatarSrc"
                :src="avatarSrc"
                :alt="t('avatarAlt')"
                class="user-avatar-img"
              />

              <span v-else class="avatar-initials">{{ initials }}</span>

              <span class="avatar-overlay">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                {{ txt('Cambiar foto', 'Change photo') }}
              </span>
            </button>

            <button
              id="tutor-3"
              type="button"
              class="avatar-action btn-camera"
              :title="t('changePhotoTitle')"
              :aria-label="t('changePhotoTitle')"
              @click="openPhotoOptions"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </button>

            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden-input"
              @change="handleFileChange"
            />
          </div>

          <h2 class="main-title">
            {{ form.nombres || '—' }}
            <span>{{ form.apellidoPaterno || '—' }}</span>
          </h2>

          <span class="status-badge">
            <i></i>
            {{ t('statusActive') }}
          </span>

          <p class="photo-hint">
            {{
              txt(
                'Toma una foto o selecciónala desde la galería.',
                'Take a photo or choose one from the gallery.'
              )
            }}
          </p>

          <dl class="profile-meta">
            <div>
              <dt>ID</dt>
              <dd>GymPer001</dd>
            </div>
            <div>
              <dt>{{ txt('Sedes', 'Locations') }}</dt>
              <dd>{{ form.sedes.length }}</dd>
            </div>
            <div>
              <dt>{{ txt('Rol', 'Role') }}</dt>
              <dd>{{ form.rol || txt('Sin asignar', 'Not assigned') }}</dd>
            </div>
          </dl>
        </aside>

        <!-- FORMULARIOS -->
        <div class="forms-wrapper">
          <!-- DATOS PERSONALES -->
          <section id="tutor-6" class="login-card">
            <div class="card-header-flex">
              <div class="card-title-group">
                <span class="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>

                <div>
                  <h3 class="section-title">{{ t('personalDataTitle') }}</h3>
                  <p>{{ t('personalDataSubtitle') }}</p>
                </div>
              </div>
            </div>

            <div class="form-grid-3">
              <div class="input-group">
                <label for="p-curp">CURP</label>
                <input id="p-curp" v-model="form.curp" type="text" maxlength="18" placeholder="CURP" />
              </div>

              <div class="input-group">
                <label for="p-nombres">{{ t('namesLabel') }}</label>
                <input
                  id="p-nombres"
                  v-model="form.nombres"
                  type="text"
                  autocomplete="given-name"
                  placeholder="Carlos Luis"
                />
              </div>

              <div class="input-group">
                <label for="p-paterno">{{ t('lastNamePaternalLabel') }}</label>
                <input
                  id="p-paterno"
                  v-model="form.apellidoPaterno"
                  type="text"
                  autocomplete="family-name"
                  placeholder="Ramírez"
                />
              </div>

              <div class="input-group">
                <label for="p-materno">{{ t('lastNameMaternalLabel') }}</label>
                <input id="p-materno" v-model="form.apellidoMaterno" type="text" placeholder="García" />
              </div>

              <div class="input-group">
                <label for="p-fecha">{{ t('birthDateLabel') }}</label>
                <input id="p-fecha" v-model="form.fechaNacimiento" type="date" />
              </div>

              <div class="input-group">
                <label for="p-celular">{{ t('phoneLabel') }}</label>
                <div class="input-with-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8.01 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <input
                    id="p-celular"
                    v-model="form.celular"
                    type="tel"
                    autocomplete="tel"
                    placeholder="+52 000 000 0000"
                  />
                </div>
              </div>

              <div class="input-group">
                <label for="p-facebook">Facebook</label>
                <div class="social-input">
                  <span>f</span>
                  <input id="p-facebook" v-model="form.facebook" type="text" placeholder="@usuario" />
                </div>
              </div>

              <div class="input-group">
                <label for="p-instagram">Instagram</label>
                <div class="social-input">
                  <span>◎</span>
                  <input id="p-instagram" v-model="form.instagram" type="text" placeholder="@usuario" />
                </div>
              </div>

              <div class="input-group">
                <label for="p-tiktok">TikTok</label>
                <div class="social-input">
                  <span>♪</span>
                  <input id="p-tiktok" v-model="form.tiktok" type="text" placeholder="@usuario" />
                </div>
              </div>

              <div class="input-group span-full">
                <label for="p-otras">{{ t('otherAppsLabel') }}</label>
                <input
                  id="p-otras"
                  v-model="form.otrasApp"
                  type="text"
                  :placeholder="
                    txt(
                      'LinkedIn, sitio web, otras redes...',
                      'LinkedIn, website, other social networks...'
                    )
                  "
                />
              </div>
            </div>
          </section>

          <div class="lower-grid">
            <!-- CREDENCIALES -->
            <section id="tutor-7" class="login-card">
              <div class="card-header-flex">
                <div class="card-title-group">
                  <span class="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>

                  <div>
                    <h3 class="section-title">{{ t('credentialsTitle') }}</h3>
                    <p>{{ txt('Acceso y permisos', 'Access and permissions') }}</p>
                  </div>
                </div>
              </div>

              <div class="form-grid-2">
                <div class="input-group span-full">
                  <label for="p-correo">{{ t('emailLabel') }}</label>
                  <div class="input-with-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <input
                      id="p-correo"
                      v-model="form.correo"
                      type="email"
                      autocomplete="email"
                      placeholder="personal@gimnasio.com"
                    />
                  </div>
                </div>

                <!-- SEDES -->
                <div class="input-group span-full">
                  <label>{{ t('locationLabel') }}</label>

                  <div ref="dropdownRef" class="custom-multiselect">
                    <button
                      type="button"
                      class="select-box-trigger"
                      :class="{ open: isDropdownOpen }"
                      :aria-expanded="isDropdownOpen"
                      aria-haspopup="listbox"
                      @click.stop="isDropdownOpen = !isDropdownOpen"
                    >
                      <span :class="{ 'placeholder-text': form.sedes.length === 0 }">
                        {{ getSedesDisplayText() }}
                      </span>

                      <svg
                        class="dropdown-arrow"
                        :class="{ rotate: isDropdownOpen }"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    <transition name="dropdown">
                      <div v-if="isDropdownOpen" class="dropdown-options-list" @click.stop>
                        <button
                          v-for="sede in listaSedes"
                          :key="sede.id"
                          type="button"
                          class="dropdown-option-item"
                          :class="{ selected: form.sedes.includes(sede.id) }"
                          @click="toggleSede(sede.id)"
                        >
                          <span class="option-checkbox">
                            <svg
                              v-if="form.sedes.includes(sede.id)"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="3"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>

                          <span>{{ sede.nombre }}</span>
                        </button>
                      </div>
                    </transition>
                  </div>
                </div>

                <div class="input-group">
                  <label for="p-rol">{{ t('systemRoleLabel') }}</label>
                  <input
                    id="p-rol"
                    v-model="form.rol"
                    type="text"
                    :placeholder="txt('Entrenador', 'Trainer')"
                  />
                </div>

                <div class="input-group">
                  <label for="p-especialidad">{{ t('specialtyLabel') }}</label>
                  <input
                    id="p-especialidad"
                    v-model="form.especialidad"
                    type="text"
                    :placeholder="txt('Musculación', 'Strength training')"
                  />
                </div>
              </div>
            </section>

            <!-- HORARIO -->
            <section id="tutor-8" class="login-card">
              <div class="card-header-flex">
                <div class="card-title-group">
                  <span class="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="9" />
                      <polyline points="12 7 12 12 15 14" />
                    </svg>
                  </span>

                  <div>
                    <h3 class="section-title">{{ t('workScheduleTitle') }}</h3>
                    <p>{{ txt('Jornada laboral', 'Work schedule') }}</p>
                  </div>
                </div>
              </div>

              <div class="form-grid-2">
                <div class="input-group">
                  <label for="p-entrada">{{ t('entryTimeLabel') }}</label>
                  <input id="p-entrada" v-model="form.entrada" type="time" />
                </div>

                <div class="input-group">
                  <label for="p-salida">{{ t('exitTimeLabel') }}</label>
                  <input id="p-salida" v-model="form.salida" type="time" />
                </div>
              </div>

              <p class="schedule-help">
                {{
                  txt(
                    'Define la hora de entrada y salida del personal.',
                    'Set the staff check-in and check-out times.'
                  )
                }}
              </p>

              <div v-if="form.entrada && form.salida" class="schedule-summary">
                <span>{{ txt('Jornada configurada', 'Schedule configured') }}</span>
                <strong>{{ form.entrada }} — {{ form.salida }}</strong>
              </div>
            </section>
          </div>

          <!-- GUARDAR -->
          <footer class="action-footer">
            <button id="tutor-9" type="button" class="btn-primary" @click="saveChanges">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              {{ t('saveChangesBtn') }}
            </button>
          </footer>
        </div>
      </div>
    </main>

    <!-- OPCIONES DE FOTO -->
    <transition name="modal">
      <div v-if="showPhotoOptions" class="modal-overlay" @click.self="closePhotoOptions">
        <div class="photo-modal" role="dialog" aria-modal="true">
          <header class="modal-header">
            <div>
              <h3>{{ txt('Actualizar fotografía', 'Update photo') }}</h3>
              <p>
                {{
                  txt(
                    'Selecciona cómo quieres agregar la fotografía.',
                    'Choose how you want to add the photo.'
                  )
                }}
              </p>
            </div>

            <button
              type="button"
              class="modal-close"
              :aria-label="txt('Cerrar', 'Close')"
              @click="closePhotoOptions"
            >
              ×
            </button>
          </header>

          <div class="photo-options">
            <button type="button" class="photo-option" @click="takePhoto">
              <span class="option-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </span>

              <span>
                <strong>{{ txt('Tomar foto', 'Take photo') }}</strong>
                <small>{{ txt('Utilizar la cámara de este dispositivo', 'Use this device camera') }}</small>
              </span>

              <b>›</b>
            </button>

            <button type="button" class="photo-option" @click="selectPhoto">
              <span class="option-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </span>

              <span>
                <strong>{{ txt('Seleccionar de galería', 'Choose from gallery') }}</strong>
                <small>{{ txt('Seleccionar una imagen existente', 'Select an existing image') }}</small>
              </span>

              <b>›</b>
            </button>
          </div>

          <button type="button" class="cancel-btn" @click="closePhotoOptions">
            {{ txt('Cancelar', 'Cancel') }}
          </button>
        </div>
      </div>
    </transition>

    <!-- CÁMARA -->
    <transition name="modal">
      <div v-if="showCamera" class="modal-overlay camera-overlay" @click.self="closeCamera">
        <div class="camera-modal" role="dialog" aria-modal="true">
          <header class="modal-header">
            <div>
              <h3>{{ txt('Tomar fotografía', 'Take photo') }}</h3>
              <p>
                {{
                  cameraFacingMode === 'user'
                    ? txt('Cámara frontal', 'Front camera')
                    : txt('Cámara trasera', 'Rear camera')
                }}
              </p>
            </div>

            <button
              type="button"
              class="modal-close"
              :aria-label="txt('Cerrar', 'Close')"
              @click="closeCamera"
            >
              ×
            </button>
          </header>

          <div class="camera-preview">
            <video
              ref="videoRef"
              autoplay
              playsinline
              muted
              :class="{ 'camera-mirrored': cameraFacingMode === 'user' }"
            ></video>

            <button
              type="button"
              class="switch-camera-btn"
              :disabled="switchingCamera"
              @click.stop="switchCamera"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4" />
                <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4" />
              </svg>
              {{ cameraFacingMode === 'user' ? txt('Trasera', 'Rear') : txt('Frontal', 'Front') }}
            </button>

            <div class="face-guide"></div>

            <div v-if="switchingCamera" class="camera-loading">
              <span></span>
            </div>
          </div>

          <canvas ref="canvasRef" class="hidden-canvas"></canvas>

          <div class="camera-actions">
            <button type="button" class="camera-cancel" @click="closeCamera">
              {{ txt('Cancelar', 'Cancel') }}
            </button>

            <button
              type="button"
              class="capture-btn"
              :disabled="switchingCamera"
              @click="capturePhoto"
            >
              <i><span></span></i>
              {{ txt('Tomar foto', 'Take photo') }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </HeadingOwner>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@500;600;700&display=swap');

.main-content {
  --accent: var(--color-highlight, #3b82f6);
  --card: var(--bg-cards, #121416);
  --text: var(--color-texto-general, #e5e7eb);
  --title: var(--color-titulos, #ffffff);
  --muted: #8b95a7;
  --line: color-mix(in srgb, var(--text) 10%, transparent);
  --input: color-mix(in srgb, var(--card) 90%, #ffffff);
  --radius: 14px;

  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 36px 56px;
  box-sizing: border-box;
  color: var(--text);
  font-family: 'Inter', sans-serif;
}

/* ============================ ENCABEZADO ============================ */

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
  margin-bottom: 26px;
}

.page-heading {
  min-width: 0;
}

.eyebrow {
  display: block;
  margin-bottom: 6px;
  color: var(--accent);
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.page-header h1 {
  margin: 0;
  color: var(--title);
  font-family: 'Oswald', sans-serif;
  font-size: clamp(1.7rem, 2.6vw, 2.25rem);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: 0.01em;
  text-transform: uppercase;
}

.page-header h1 span {
  color: var(--accent);
}

.page-header p {
  max-width: 600px;
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 0.8rem;
  line-height: 1.55;
}

/* ============================ INPUTS ============================ */

.search-small {
  width: min(100%, 320px);
  flex-shrink: 0;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
}

.input-group label {
  color: color-mix(in srgb, var(--text) 78%, transparent);
  font-size: 0.72rem;
  font-weight: 500;
  line-height: 1.2;
}

.input-group input {
  width: 100%;
  height: 44px;
  box-sizing: border-box;
  padding: 0 13px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--input);
  color: var(--color-texto-input, var(--text));
  font-family: 'Inter', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  outline: none;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.input-group input::placeholder {
  color: color-mix(in srgb, var(--muted) 70%, transparent);
  font-weight: 400;
}

.input-group input:hover {
  border-color: color-mix(in srgb, var(--text) 24%, transparent);
}

.input-group input:focus {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--input) 90%, var(--accent));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 16%, transparent);
}

.input-group input[type='date'],
.input-group input[type='time'] {
  color-scheme: dark;
}

.input-group input[type='date']::-webkit-calendar-picker-indicator,
.input-group input[type='time']::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.7;
}

.search-input-wrapper,
.input-with-icon,
.social-input {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input-wrapper svg,
.input-with-icon svg {
  position: absolute;
  z-index: 2;
  left: 13px;
  width: 16px;
  height: 16px;
  color: var(--muted);
  pointer-events: none;
}

.search-input-wrapper input,
.input-with-icon input {
  padding-left: 38px;
}

.social-input > span {
  position: absolute;
  z-index: 2;
  left: 13px;
  width: 18px;
  color: var(--accent);
  font-size: 0.84rem;
  font-weight: 700;
  text-align: center;
  pointer-events: none;
}

.social-input input {
  padding-left: 40px;
}

/* ============================ ESTRUCTURA ============================ */

.profile-card {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}

.profile-section,
.login-card {
  box-sizing: border-box;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--card);
}

/* ============================ PERFIL ============================ */

.profile-section {
  position: sticky;
  top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 22px 22px;
  overflow: hidden;
}

.profile-section::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 3px;
  background: var(--accent);
}

.avatar-wrapper {
  position: relative;
  width: 148px;
  margin-bottom: 20px;
}

.avatar-circle {
  position: relative;
  display: block;
  width: 148px;
  height: 148px;
  padding: 0;
  overflow: hidden;
  border: 2px solid color-mix(in srgb, var(--accent) 70%, transparent);
  border-radius: 50%;
  background: #080a0d;
  cursor: pointer;
  box-shadow: 0 0 0 6px color-mix(in srgb, var(--accent) 8%, transparent);
}

.user-avatar-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: var(--accent);
  font-family: 'Oswald', sans-serif;
  font-size: 2.5rem;
}

.avatar-overlay {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 8px 14px;
  background: rgba(0, 0, 0, 0.72);
  color: #ffffff;
  font-size: 0.66rem;
  font-weight: 600;
  transform: translateY(100%);
  transition: transform 0.2s ease;
}

.avatar-circle:hover .avatar-overlay,
.avatar-circle:focus-visible .avatar-overlay {
  transform: translateY(0);
}

.avatar-overlay svg {
  width: 14px;
  height: 14px;
}

.avatar-action {
  position: absolute;
  right: -6px;
  bottom: 4px;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 3px solid var(--card);
  border-radius: 50%;
  background: var(--color-botones, var(--accent));
  color: var(--color-texto-botones, #ffffff);
  cursor: pointer;
  transition: transform 0.18s ease, filter 0.18s ease;
}

.avatar-action:hover {
  transform: scale(1.08);
  filter: brightness(1.08);
}

.avatar-action svg {
  width: 16px;
  height: 16px;
}

.hidden-input,
.hidden-canvas {
  display: none;
}

.main-title {
  margin: 0 0 12px;
  color: var(--title);
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.15;
  text-align: center;
  text-transform: uppercase;
}

.main-title span {
  display: block;
  color: var(--accent);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 11px;
  border: 1px solid rgba(52, 211, 153, 0.25);
  border-radius: 999px;
  background: rgba(52, 211, 153, 0.08);
  color: #34d399;
  font-size: 0.66rem;
  font-weight: 600;
}

.status-badge i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.photo-hint {
  margin: 16px 0 20px;
  color: var(--muted);
  font-size: 0.7rem;
  line-height: 1.5;
  text-align: center;
}

.profile-meta {
  width: 100%;
  margin: 0;
  padding-top: 6px;
  border-top: 1px solid var(--line);
}

.profile-meta > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 2px;
  border-bottom: 1px solid var(--line);
}

.profile-meta > div:last-child {
  padding-bottom: 2px;
  border-bottom: 0;
}

.profile-meta dt {
  color: var(--muted);
  font-size: 0.72rem;
}

.profile-meta dd {
  margin: 0;
  overflow: hidden;
  color: var(--title);
  font-size: 0.76rem;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ============================ FORMULARIOS ============================ */

.forms-wrapper {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
}

.login-card {
  padding: 24px;
  overflow: visible;
}

.card-header-flex {
  margin-bottom: 20px;
}

.card-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 10px;
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  color: var(--accent);
}

.card-icon svg {
  width: 17px;
  height: 17px;
}

.card-title-group p {
  margin: 3px 0 0;
  color: var(--muted);
  font-size: 0.7rem;
}

.section-title {
  margin: 0;
  color: var(--title);
  font-family: 'Oswald', sans-serif;
  font-size: 1.02rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.form-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.form-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.form-grid-3 .span-full,
.form-grid-2 .span-full {
  grid-column: 1 / -1;
}

.lower-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  align-items: start;
}

/* ============================ MULTISELECT ============================ */

.custom-multiselect {
  position: relative;
  width: 100%;
}

.select-box-trigger {
  width: 100%;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  box-sizing: border-box;
  padding: 0 13px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--input);
  color: var(--text);
  font-family: 'Inter', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.select-box-trigger > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.select-box-trigger:hover {
  border-color: color-mix(in srgb, var(--text) 24%, transparent);
}

.select-box-trigger.open {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 16%, transparent);
}

.placeholder-text {
  color: var(--muted);
  font-weight: 400;
}

.dropdown-arrow {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: var(--muted);
  transition: transform 0.18s ease;
}

.dropdown-arrow.rotate {
  transform: rotate(180deg);
}

.dropdown-options-list {
  position: absolute;
  z-index: 200;
  top: calc(100% + 6px);
  right: 0;
  left: 0;
  max-height: 220px;
  overflow-y: auto;
  padding: 5px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--bg-cards, #121416);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
}

.dropdown-option-item {
  width: 100%;
  min-height: 40px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--muted);
  font-family: 'Inter', sans-serif;
  font-size: 0.76rem;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.dropdown-option-item:hover {
  background: color-mix(in srgb, var(--accent) 8%, transparent);
  color: var(--text);
}

.dropdown-option-item.selected {
  background: color-mix(in srgb, var(--accent) 13%, transparent);
  color: #93c5fd;
}

.option-checkbox {
  width: 16px;
  height: 16px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border: 1px solid color-mix(in srgb, var(--text) 25%, transparent);
  border-radius: 4px;
}

.dropdown-option-item.selected .option-checkbox {
  border-color: var(--accent);
  background: var(--accent);
  color: #ffffff;
}

.option-checkbox svg {
  width: 10px;
  height: 10px;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
  transform-origin: top;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.985);
}

/* ============================ HORARIO ============================ */

.schedule-help {
  margin: 14px 0 0;
  color: var(--muted);
  font-size: 0.72rem;
  line-height: 1.5;
}

.schedule-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 14px;
  padding: 11px 13px;
  border: 1px solid rgba(52, 211, 153, 0.2);
  border-radius: 10px;
  background: rgba(52, 211, 153, 0.07);
  color: #34d399;
  font-size: 0.72rem;
}

.schedule-summary strong {
  font-size: 0.78rem;
}

/* ============================ GUARDAR ============================ */

.action-footer {
  display: flex;
  justify-content: flex-end;
}

.btn-primary {
  min-height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 0 28px;
  border: 0;
  border-radius: 10px;
  background: var(--color-botones, var(--accent));
  color: var(--color-texto-botones, #ffffff);
  font-family: 'Inter', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.18s ease, filter 0.18s ease;
}

.btn-primary:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary svg {
  width: 16px;
  height: 16px;
}

/* ============================ FOCO VISIBLE ============================ */

.avatar-circle:focus-visible,
.avatar-action:focus-visible,
.btn-primary:focus-visible,
.select-box-trigger:focus-visible,
.dropdown-option-item:focus-visible,
.photo-option:focus-visible,
.modal-close:focus-visible,
.cancel-btn:focus-visible,
.camera-cancel:focus-visible,
.capture-btn:focus-visible,
.switch-camera-btn:focus-visible {
  outline: 2px solid var(--color-highlight, #3b82f6);
  outline-offset: 2px;
}

/* ============================ MODALES ============================ */

.modal-overlay {
  position: fixed;
  z-index: 4000;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(3px);
}

.camera-overlay {
  z-index: 4100;
  background: rgba(0, 0, 0, 0.92);
}

.photo-modal,
.camera-modal {
  width: min(100%, 440px);
  box-sizing: border-box;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  background: var(--bg-cards, #121416);
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.55);
}

.camera-modal {
  width: min(100%, 620px);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.modal-header h3 {
  margin: 0;
  color: var(--color-titulos, #ffffff);
  font-family: 'Oswald', sans-serif;
  font-size: 1.15rem;
  font-weight: 600;
  text-transform: uppercase;
}

.modal-header p {
  margin: 6px 0 0;
  color: #8b95a7;
  font-size: 0.74rem;
  line-height: 1.5;
}

.modal-close {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  color: #ffffff;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease;
}

.modal-close:hover {
  border-color: rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.09);
}

/* ============================ OPCIONES FOTO ============================ */

.photo-options {
  display: grid;
  gap: 10px;
}

.photo-option {
  width: 100%;
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.025);
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease;
}

.photo-option:hover {
  border-color: var(--color-highlight, #3b82f6);
  background: color-mix(in srgb, var(--color-highlight, #3b82f6) 7%, transparent);
}

.option-icon {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: color-mix(in srgb, var(--color-highlight, #3b82f6) 13%, transparent);
  color: var(--color-highlight, #60a5fa);
}

.option-icon svg {
  width: 20px;
  height: 20px;
}

.photo-option strong {
  display: block;
  color: var(--color-titulos, #ffffff);
  font-size: 0.8rem;
}

.photo-option small {
  display: block;
  margin-top: 3px;
  color: #8b95a7;
  font-size: 0.68rem;
}

.photo-option b {
  color: #8b95a7;
  font-size: 1.2rem;
}

.cancel-btn,
.camera-cancel {
  height: 42px;
  padding: 0 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: transparent;
  color: #aab2c0;
  font-family: 'Inter', sans-serif;
  font-size: 0.74rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease;
}

.cancel-btn:hover,
.camera-cancel:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.cancel-btn {
  width: 100%;
  margin-top: 14px;
}

/* ============================ CÁMARA ============================ */

.camera-preview {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  background: #000000;
}

.camera-preview video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-mirrored {
  transform: scaleX(-1);
}

.face-guide {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 46%;
  height: 70%;
  border: 2px dashed rgba(255, 255, 255, 0.38);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.switch-camera-btn {
  position: absolute;
  z-index: 3;
  top: 12px;
  right: 12px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 13px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.65);
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
}

.switch-camera-btn:disabled,
.capture-btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.switch-camera-btn svg {
  width: 15px;
  height: 15px;
}

.camera-loading {
  position: absolute;
  z-index: 4;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.25);
}

.camera-loading span {
  width: 34px;
  height: 34px;
  border: 3px solid rgba(255, 255, 255, 0.25);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.camera-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: 18px;
}

.capture-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 18px 7px 7px;
  border: 0;
  border-radius: 999px;
  background: var(--color-botones, #2563eb);
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.18s ease, transform 0.18s ease;
}

.capture-btn:hover:not(:disabled) {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.capture-btn i {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 2px solid #ffffff;
  border-radius: 50%;
}

.capture-btn i span {
  width: 23px;
  height: 23px;
  border-radius: 50%;
  background: #ffffff;
}

/* ============================ TRANSICIONES ============================ */

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.18s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* ============================ TOAST ============================ */

:deep(.notification-container),
:deep(.toast-container) {
  width: calc(100% - 32px) !important;
  max-width: 480px !important;
  left: 50% !important;
  right: auto !important;
  margin: 0 auto !important;
  box-sizing: border-box !important;
  transform: translateX(-50%) !important;
}

/* ============================ TABLET ============================ */

@media (max-width: 1100px) {
  .profile-card {
    grid-template-columns: 250px minmax(0, 1fr);
  }

  .form-grid-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lower-grid {
    grid-template-columns: 1fr;
  }
}

/* ============================ MÓVIL / TABLET ============================ */

@media (max-width: 900px) {
  .main-content {
    padding: 22px 18px 40px;
  }

  .page-header {
    align-items: stretch;
    flex-direction: column;
  }

  .search-small {
    width: 100%;
  }

  .profile-card {
    grid-template-columns: 1fr;
  }

  .profile-section {
    position: relative;
    top: auto;
  }

  .forms-wrapper {
    gap: 16px;
  }
}

/* ============================ TELÉFONO ============================ */

@media (max-width: 600px) {
  .main-content {
    padding: 16px 12px 32px;
  }

  .page-header {
    margin-bottom: 18px;
  }

  .page-header h1 {
    font-size: 1.45rem;
  }

  .profile-section {
    padding: 22px 16px 16px;
  }

  .login-card {
    padding: 18px 16px;
  }

  .form-grid-3,
  .form-grid-2 {
    grid-template-columns: 1fr;
  }

  .form-grid-3 .span-full,
  .form-grid-2 .span-full {
    grid-column: auto;
  }

  .action-footer {
    justify-content: stretch;
  }

  .btn-primary {
    width: 100%;
  }

  .modal-overlay {
    align-items: flex-end;
    padding: 8px;
  }

  .photo-modal,
  .camera-modal {
    padding: 18px 16px;
    border-radius: 16px;
  }

  .camera-overlay {
    align-items: center;
  }

  .camera-actions {
    align-items: stretch;
    flex-direction: column-reverse;
  }

  .camera-cancel,
  .capture-btn {
    width: 100%;
    justify-content: center;
  }

  .face-guide {
    width: 52%;
    height: 68%;
  }

  .dropdown-options-list {
    max-height: 200px;
  }
}

@media (max-width: 380px) {
  .main-content {
    padding-right: 8px;
    padding-left: 8px;
  }
}
</style>