<template>
  <HeadingOwner>
    <NotificationSystem ref="toastRef" />

    <main class="main-content">
      <div class="profile-card">

        <!-- =====================================================
             PERFIL / FOTO
        ====================================================== -->
        <aside class="profile-section" id="tutorial-step-0">
          <div class="profile-content">

            <h1 class="main-title">
              <template v-if="currentLang === 'es'">
                Registra a tu <br>
                <span class="highlight">Personal</span>
              </template>

              <template v-else-if="currentLang === 'en'">
                Register your <br>
                <span class="highlight">Staff</span>
              </template>

              <template v-else-if="currentLang === 'fr'">
                Enregistrez votre <br>
                <span class="highlight">Personnel</span>
              </template>

              <template v-else-if="currentLang === 'pt'">
                Registre sua <br>
                <span class="highlight">Equipe</span>
              </template>
            </h1>

            <!-- FOTO DE PERFIL -->
            <div class="avatar-wrapper">
              <div class="avatar-ring">
                <div
                  class="avatar-circle"
                  @click="openPhotoOptions"
                  :title="t('titleAvatarClick')"
                >
                  <img
                    v-if="avatarPreview"
                    :src="avatarPreview"
                    :alt="t('altEmployeePreview')"
                    class="avatar-img"
                  />

                  <svg
                    v-else
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    <path
                      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                    />
                  </svg>
                </div>
              </div>

              <button
                type="button"
                class="avatar-action btn-camera"
                @click="openPhotoOptions"
                :title="t('titleUploadPhoto')"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                  />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>

              <!--
                Este input se usa ÚNICAMENTE cuando el usuario
                selecciona "Subir una foto".
              -->
              <input
                type="file"
                ref="fileInput"
                accept="image/*"
                style="display: none"
                @change="handleFileChange"
              />
            </div>

            <p class="profile-hint">
              {{ t('hintEmployeePhoto') }}
            </p>

            <!-- RESUMEN -->
            <dl class="profile-summary">
              <div class="summary-item">
                <dt>{{ t('names') }}</dt>

                <dd
                  :class="{
                    empty: !form.nombres && !form.apellidoP
                  }"
                >
                  {{
                    [
                      form.nombres,
                      form.apellidoP,
                      form.apellidoM
                    ]
                      .filter(Boolean)
                      .join(' ') || '—'
                  }}
                </dd>
              </div>

              <div class="summary-item">
                <dt>{{ t('systemRole') }}</dt>

                <dd>
                  <span
                    v-if="form.rol"
                    class="plan-chip"
                  >
                    {{
                      form.rol === 'gerente'
                        ? 'Gerente'
                        : form.rol === 'entrenador'
                          ? t('roleTrainer')
                          : t('roleReception')
                    }}
                  </span>

                  <span
                    v-else
                    class="empty"
                  >
                    —
                  </span>
                </dd>
              </div>

              <div class="summary-item">
                <dt>{{ t('allowedLocations') }}</dt>

                <dd
                  :class="{
                    empty: form.sedes.length === 0
                  }"
                >
                  {{ form.sedes.length || '—' }}
                </dd>
              </div>

              <div class="summary-item">
                <dt>{{ t('workSchedule') }}</dt>

                <dd
                  :class="{
                    empty:
                      !form.horaEntrada ||
                      !form.horaSalida
                  }"
                >
                  {{
                    form.horaEntrada &&
                    form.horaSalida
                      ? `${form.horaEntrada} – ${form.horaSalida}`
                      : '—'
                  }}
                </dd>
              </div>
            </dl>
          </div>
        </aside>

        <!-- =====================================================
             FORMULARIOS
        ====================================================== -->
        <div class="forms-wrapper">

          <!-- CREDENCIALES Y ROL -->
          <section
            class="login-card"
            id="tutorial-step-1"
          >
            <header class="card-header">
              <h3 class="section-title">
                {{ t('credentialsAndRole') }}
              </h3>
            </header>

            <div class="form-grid">

              <!-- ROL -->
              <div class="input-group">
                <label>
                  {{ t('systemRole') }}
                </label>

                <select
                  v-model="form.rol"
                  class="custom-select"
                >
                  <option
                    value=""
                    disabled
                  >
                    {{ t('selectRole') }}
                  </option>

                  <option value="gerente">
                    Gerente
                  </option>

                  <option value="entrenador">
                    {{ t('roleTrainer') }}
                  </option>

                  <option value="recepcion">
                    {{ t('roleReception') }}
                  </option>
                </select>
              </div>

              <!-- CORREO -->
              <div class="input-group">
                <label>
                  {{ t('email') }}
                </label>

                <div class="input-with-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    />
                    <polyline
                      points="22,6 12,13 2,6"
                    />
                  </svg>

                  <input
                    type="email"
                    v-model="form.email"
                    placeholder="correo@ejemplo.com"
                  >
                </div>
              </div>

              <!-- CONTRASEÑAS -->
              <template
                v-if="
                  form.rol === 'gerente' ||
                  form.rol === 'recepcion'
                "
              >
                <div class="input-group">
                  <label>
                    {{ t('password') }}
                  </label>

                  <input
                    type="password"
                    v-model="form.password"
                    placeholder="••••••••"
                  >
                </div>

                <div class="input-group">
                  <label>
                    {{ t('confirmPassword') }}
                  </label>

                  <input
                    type="password"
                    v-model="form.confirmPassword"
                    placeholder="••••••••"
                  >
                </div>
              </template>

              <!-- ESPECIALIDAD -->
              <div
                class="input-group"
                v-if="form.rol === 'entrenador'"
              >
                <label>
                  {{ t('specialty') }}
                </label>

                <input
                  type="text"
                  v-model="form.especialidad"
                  :placeholder="t('placeholderSpecialty')"
                >
              </div>

              <!-- SEDES -->
              <div
                class="input-group"
                :class="{
                  'sedes-right-col':
                    form.rol !== 'entrenador'
                }"
              >
                <label>
                  {{ t('allowedLocations') }}
                </label>

                <div
                  class="custom-multiselect"
                  ref="dropdownRef"
                >
                  <div
                    class="select-box-trigger"
                    :class="{
                      open: isDropdownOpen
                    }"
                    @click="
                      isDropdownOpen =
                        !isDropdownOpen
                    "
                  >
                    <span
                      class="trigger-text"
                      :class="{
                        'placeholder-text':
                          form.sedes.length === 0
                      }"
                    >
                      {{ getSedesDisplayText() }}
                    </span>

                    <svg
                      class="dropdown-arrow"
                      :class="{
                        rotate: isDropdownOpen
                      }"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline
                        points="6 9 12 15 18 9"
                      />
                    </svg>
                  </div>

                  <div
                    class="dropdown-options-list"
                    v-if="isDropdownOpen"
                  >
                    <div
                      v-for="sede in listaSedes"
                      :key="sede.id"
                      class="dropdown-option-item"
                      :class="{
                        selected:
                          form.sedes.includes(
                            sede.id
                          )
                      }"
                      @click="toggleSede(sede.id)"
                    >
                      <div class="option-checkbox">
                        <svg
                          v-if="
                            form.sedes.includes(
                              sede.id
                            )
                          "
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="3"
                        >
                          <polyline
                            points="20 6 9 17 4 12"
                          />
                        </svg>
                      </div>

                      <span>
                        {{ sede.nombre }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          <!-- =================================================
               DATOS DEL EMPLEADO
          ================================================== -->
          <section
            class="login-card"
            id="tutorial-step-2"
          >
            <header class="card-header">
              <h3 class="section-title">
                {{ t('employeeData') }}
              </h3>
            </header>

            <div class="form-grid">

              <div class="input-group span-full">
                <label>
                  {{ t('curp') }}
                </label>

                <input
                  type="text"
                  v-model="form.curp"
                  placeholder="Ej. ABCD010101HDF000"
                >
              </div>

              <div class="input-group">
                <label>
                  {{ t('names') }}
                  <span class="required">*</span>
                </label>

                <input
                  type="text"
                  v-model="form.nombres"
                  :placeholder="t('placeholderName')"
                >
              </div>

              <div class="input-group">
                <label>
                  {{ t('lastNameP') }}
                  <span class="required">*</span>
                </label>

                <input
                  type="text"
                  v-model="form.apellidoP"
                  :placeholder="
                    t('placeholderLastNameP')
                  "
                >
              </div>

              <div class="input-group">
                <label>
                  {{ t('lastNameM') }}
                </label>

                <input
                  type="text"
                  v-model="form.apellidoM"
                  :placeholder="
                    t('placeholderLastNameM')
                  "
                >
              </div>

              <div class="input-group">
                <label>
                  {{ t('birthDate') }}
                </label>

                <input
                  type="date"
                  v-model="form.fechaNacimiento"
                >
              </div>

              <div class="input-group">
                <label>
                  {{ t('cellphone') }}
                </label>

                <div class="input-with-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8.01 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z"
                    />
                  </svg>

                  <input
                    type="text"
                    v-model="form.celular"
                    placeholder="+52 000 000 0000"
                  >
                </div>
              </div>

              <!-- REDES SOLO ENTRENADOR -->
              <template
                v-if="
                  form.rol !== 'recepcion' &&
                  form.rol !== 'gerente'
                "
              >
                <div class="input-group">
                  <label>
                    {{ t('facebook') }}
                  </label>

                  <input
                    type="text"
                    v-model="form.facebook"
                    placeholder="usuario_fb"
                  >
                </div>

                <div class="input-group">
                  <label>
                    {{ t('instagram') }}
                  </label>

                  <input
                    type="text"
                    v-model="form.instagram"
                    placeholder="@usuario_ig"
                  >
                </div>

                <div class="input-group">
                  <label>
                    {{ t('tiktok') }}
                  </label>

                  <input
                    type="text"
                    v-model="form.tiktok"
                    placeholder="@usuario_tt"
                  >
                </div>

                <div class="input-group">
                  <label>
                    {{ t('otherApps') }}
                  </label>

                  <input
                    type="text"
                    v-model="form.otrasApps"
                    :placeholder="
                      t('placeholderOtherApps')
                    "
                  >
                </div>
              </template>

            </div>
          </section>

          <!-- =================================================
               HORARIO DE TRABAJO
          ================================================== -->
          <section
            class="login-card"
            id="tutorial-step-3"
          >
            <header class="card-header">
              <h3 class="section-title">
                {{ t('workSchedule') }}
              </h3>
            </header>

            <div class="form-grid">
              <div class="date-field">
                <div class="date-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                    />
                    <polyline
                      points="12 6 12 12 16 14"
                    />
                  </svg>
                </div>

                <div class="date-content">
                  <label>
                    {{ t('entryTime') }}
                  </label>

                  <input
                    type="time"
                    v-model="form.horaEntrada"
                  >
                </div>
              </div>

              <div class="date-field">
                <div class="date-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                    />
                    <polyline
                      points="12 6 12 12 16 14"
                    />
                  </svg>
                </div>

                <div class="date-content">
                  <label>
                    {{ t('exitTime') }}
                  </label>

                  <input
                    type="time"
                    v-model="form.horaSalida"
                  >
                </div>
              </div>
            </div>
          </section>

          <!-- BOTÓN REGISTRAR -->
          <div class="registration-footer">
            <div class="required-hint">
              <span class="required">*</span>

              {{
                currentLang === 'en'
                  ? 'Required fields'
                  : currentLang === 'fr'
                    ? 'Champs obligatoires'
                    : currentLang === 'pt'
                      ? 'Campos obrigatórios'
                      : 'Campos obligatorios'
              }}
            </div>

            <button
              type="button"
              class="btn-primary"
              @click="saveRegistration"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
                />
                <polyline
                  points="17 21 17 13 7 13 7 21"
                />
                <polyline
                  points="7 3 7 8 15 8"
                />
              </svg>

              {{ t('finishButtonStaff') }}
            </button>
          </div>

        </div>
      </div>
    </main>

    <!-- =====================================================
         SELECCIONAR CÁMARA O GALERÍA
    ====================================================== -->
    <transition name="photo-menu">
      <div
        v-if="showPhotoOptions"
        class="photo-options-overlay"
        @click.self="closePhotoOptions"
      >
        <div class="photo-options-modal">
          <div class="photo-options-handle"></div>

          <div class="photo-options-header">
            <div>
              <span class="photo-options-eyebrow">
                {{ currentLang === 'en' ? 'PROFILE PHOTO' : 'FOTO DE PERFIL' }}
              </span>

              <h3>
                {{
                  currentLang === 'en'
                    ? 'Add staff photo'
                    : 'Agregar foto del personal'
                }}
              </h3>

              <p>
                {{
                  currentLang === 'en'
                    ? 'Choose how you want to add the image.'
                    : 'Selecciona cómo quieres agregar la imagen.'
                }}
              </p>
            </div>

            <button
              type="button"
              class="modal-close-btn"
              @click="closePhotoOptions"
            >
              ×
            </button>
          </div>

          <div class="photo-options-grid">
            <!-- CÁMARA -->
            <button
              type="button"
              class="photo-option"
              @click="takePhoto"
            >
              <div class="photo-option-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                  />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>

              <div class="photo-option-text">
                <strong>
                  {{ currentLang === 'en' ? 'Take photo' : 'Tomar foto' }}
                </strong>

                <span>
                  {{
                    currentLang === 'en'
                      ? 'Open your device camera'
                      : 'Abrir la cámara del dispositivo'
                  }}
                </span>
              </div>

              <svg
                class="photo-option-arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <!-- GALERÍA -->
            <button
              type="button"
              class="photo-option"
              @click="selectPhoto"
            >
              <div class="photo-option-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>

              <div class="photo-option-text">
                <strong>
                  {{
                    currentLang === 'en'
                      ? 'Choose image'
                      : 'Subir desde galería'
                  }}
                </strong>

                <span>
                  {{
                    currentLang === 'en'
                      ? 'Select an existing image'
                      : 'Seleccionar una imagen existente'
                  }}
                </span>
              </div>

              <svg
                class="photo-option-arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <button
            type="button"
            class="photo-cancel"
            @click="closePhotoOptions"
          >
            {{ currentLang === 'en' ? 'Cancel' : 'Cancelar' }}
          </button>
        </div>
      </div>
    </transition>

    <!-- =====================================================
         CÁMARA REAL
    ====================================================== -->
    <transition name="photo-menu">
      <div
        v-if="showCamera"
        class="camera-overlay"
        @click.self="closeCamera"
      >
        <div class="camera-modal">
          <div class="camera-header">
            <div>
              <span class="camera-eyebrow">
                {{ currentLang === 'en' ? 'CAMERA' : 'CÁMARA' }}
              </span>

              <h3>
                {{
                  currentLang === 'en'
                    ? 'Take staff photo'
                    : 'Tomar foto del personal'
                }}
              </h3>

              <p>
                {{
                  cameraFacingMode === 'user'
                    ? (
                      currentLang === 'en'
                        ? 'Front camera'
                        : 'Cámara frontal'
                    )
                    : (
                      currentLang === 'en'
                        ? 'Rear camera'
                        : 'Cámara trasera'
                    )
                }}
              </p>
            </div>

            <button
              type="button"
              class="modal-close-btn"
              @click="closeCamera"
            >
              ×
            </button>
          </div>

          <!-- VISOR -->
          <div class="camera-preview">
            <video
              ref="videoRef"
              autoplay
              playsinline
              muted
              :class="{
                'camera-mirrored': cameraFacingMode === 'user'
              }"
            ></video>

            <!-- CAMBIAR CÁMARA -->
            <button
              type="button"
              class="switch-camera-btn"
              :disabled="switchingCamera"
              @click.stop="switchCamera"
            >
              <svg
                :class="{ rotating: switchingCamera }"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4" />
                <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4" />
              </svg>

              <span>
                {{
                  cameraFacingMode === 'user'
                    ? (
                      currentLang === 'en'
                        ? 'Rear'
                        : 'Trasera'
                    )
                    : (
                      currentLang === 'en'
                        ? 'Front'
                        : 'Frontal'
                    )
                }}
              </span>
            </button>

            <div class="camera-guide">
              <div class="face-guide"></div>
            </div>

            <div
              v-if="switchingCamera"
              class="camera-switching"
            >
              <span class="camera-loader"></span>
            </div>
          </div>

          <canvas
            ref="canvasRef"
            class="hidden-canvas"
          ></canvas>

          <div class="camera-actions">
            <button
              type="button"
              class="camera-cancel-btn"
              @click="closeCamera"
            >
              {{ currentLang === 'en' ? 'Cancel' : 'Cancelar' }}
            </button>

            <button
              type="button"
              class="capture-btn"
              :disabled="switchingCamera"
              @click="capturePhoto"
            >
              <span class="capture-circle">
                <span></span>
              </span>

              {{
                currentLang === 'en'
                  ? 'Take photo'
                  : 'Tomar foto'
              }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </HeadingOwner>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  onMounted,
  onUnmounted,
  nextTick
} from 'vue';

import HeadingOwner from '../HeadingOwner.vue';
import NotificationSystem from '../../Modals/NotificationSystem.vue';
import { traducciones } from '../i18n.js';

/* =========================================================
   NOTIFICACIONES
========================================================= */

const toastRef = ref(null);

/* =========================================================
   IDIOMA
========================================================= */

const currentLang = ref(
  localStorage.getItem('owner-idioma') || 'es'
);

const t = (key) => {
  const langTable =
    traducciones[currentLang.value] ||
    traducciones.es;

  return (
    langTable?.[key] ||
    traducciones.es?.[key] ||
    key
  );
};

const handleLangChange = (event) => {
  if (event.detail?.idioma) {
    currentLang.value =
      event.detail.idioma;
  }
};

/* =========================================================
   TEXTOS PARA FOTO Y CÁMARA
========================================================= */

const photoText = computed(() => {
  const texts = {
    es: {
      title: 'Foto del personal',
      subtitle:
        'Elige cómo deseas agregar la fotografía.',

      takePhoto:
        'Tomar una foto',

      takePhotoHint:
        'Usar la cámara del dispositivo',

      uploadPhoto:
        'Subir una foto',

      uploadPhotoHint:
        'Elegir una imagen de la galería',

      cameraTitle:
        'Tomar fotografía',

      frontCamera:
        'Cámara frontal',

      backCamera:
        'Cámara trasera',

      startingCamera:
        'Iniciando cámara...',

      switchCamera:
        'Cambiar cámara',

      capture:
        'Capturar foto',

      cancel:
        'Cancelar',

      cameraUnavailable:
        'No se pudo acceder a la cámara. Revisa los permisos del navegador.',

      cameraNotFound:
        'No se encontró una cámara disponible en este dispositivo.',

      cameraBusy:
        'La cámara está siendo utilizada por otra aplicación.',

      cameraPermission:
        'El permiso para utilizar la cámara fue rechazado.',

      invalidImage:
        'Selecciona una imagen válida.',

      photoCaptured:
        'Foto capturada correctamente.',

      photoSelected:
        'Foto seleccionada correctamente.'
    },

    en: {
      title: 'Staff photo',
      subtitle:
        'Choose how you want to add the photo.',

      takePhoto:
        'Take a photo',

      takePhotoHint:
        'Use the device camera',

      uploadPhoto:
        'Upload a photo',

      uploadPhotoHint:
        'Choose an image from the gallery',

      cameraTitle:
        'Take photo',

      frontCamera:
        'Front camera',

      backCamera:
        'Rear camera',

      startingCamera:
        'Starting camera...',

      switchCamera:
        'Switch camera',

      capture:
        'Take photo',

      cancel:
        'Cancel',

      cameraUnavailable:
        'Camera access failed. Check your browser permissions.',

      cameraNotFound:
        'No camera was found on this device.',

      cameraBusy:
        'The camera is being used by another application.',

      cameraPermission:
        'Camera permission was denied.',

      invalidImage:
        'Select a valid image.',

      photoCaptured:
        'Photo captured successfully.',

      photoSelected:
        'Photo selected successfully.'
    },

    fr: {
      title:
        'Photo du personnel',

      subtitle:
        'Choisissez comment ajouter la photo.',

      takePhoto:
        'Prendre une photo',

      takePhotoHint:
        'Utiliser la caméra de l’appareil',

      uploadPhoto:
        'Importer une photo',

      uploadPhotoHint:
        'Choisir une image de la galerie',

      cameraTitle:
        'Prendre une photo',

      frontCamera:
        'Caméra avant',

      backCamera:
        'Caméra arrière',

      startingCamera:
        'Démarrage de la caméra...',

      switchCamera:
        'Changer de caméra',

      capture:
        'Prendre la photo',

      cancel:
        'Annuler',

      cameraUnavailable:
        'Impossible d’accéder à la caméra. Vérifiez les autorisations du navigateur.',

      cameraNotFound:
        'Aucune caméra disponible n’a été trouvée.',

      cameraBusy:
        'La caméra est utilisée par une autre application.',

      cameraPermission:
        'L’autorisation d’utiliser la caméra a été refusée.',

      invalidImage:
        'Sélectionnez une image valide.',

      photoCaptured:
        'Photo prise avec succès.',

      photoSelected:
        'Photo sélectionnée avec succès.'
    },

    pt: {
      title:
        'Foto da equipe',

      subtitle:
        'Escolha como deseja adicionar a foto.',

      takePhoto:
        'Tirar uma foto',

      takePhotoHint:
        'Usar a câmera do dispositivo',

      uploadPhoto:
        'Enviar uma foto',

      uploadPhotoHint:
        'Escolher uma imagem da galeria',

      cameraTitle:
        'Tirar foto',

      frontCamera:
        'Câmera frontal',

      backCamera:
        'Câmera traseira',

      startingCamera:
        'Iniciando câmera...',

      switchCamera:
        'Trocar câmera',

      capture:
        'Capturar foto',

      cancel:
        'Cancelar',

      cameraUnavailable:
        'Não foi possível acessar a câmera. Verifique as permissões do navegador.',

      cameraNotFound:
        'Nenhuma câmera disponível foi encontrada.',

      cameraBusy:
        'A câmera está sendo usada por outro aplicativo.',

      cameraPermission:
        'A permissão para usar a câmera foi negada.',

      invalidImage:
        'Selecione uma imagem válida.',

      photoCaptured:
        'Foto capturada com sucesso.',

      photoSelected:
        'Foto selecionada com sucesso.'
    }
  };

  return (
    texts[currentLang.value] ||
    texts.es
  );
});

/* =========================================================
   FORMULARIO
========================================================= */

const form = reactive({
  /* CREDENCIALES */
  rol: '',
  email: '',
  password: '',
  confirmPassword: '',

  /* ENTRENADOR */
  especialidad: '',

  /* SEDES */
  sedes: [],

  /* DATOS PERSONALES */
  curp: '',
  nombres: '',
  apellidoP: '',
  apellidoM: '',
  fechaNacimiento: '',
  celular: '',

  /* REDES */
  facebook: '',
  instagram: '',
  tiktok: '',
  otrasApps: '',

  /* HORARIO */
  horaEntrada: '',
  horaSalida: ''
});

/* =========================================================
   SEDES
========================================================= */

const listaSedes = ref([
  {
    id: 1,
    nombre: 'Sucursal Centro'
  },
  {
    id: 2,
    nombre: 'Sucursal Norte'
  },
  {
    id: 3,
    nombre: 'Sucursal Sur'
  }
]);

const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

/*
  Selecciona o elimina una sede.
*/
const toggleSede = (id) => {
  const index =
    form.sedes.indexOf(id);

  if (index === -1) {
    form.sedes.push(id);
  } else {
    form.sedes.splice(
      index,
      1
    );
  }
};

/*
  Texto que aparece en el selector
  de sedes.
*/
const getSedesDisplayText = () => {
  if (
    form.sedes.length === 0
  ) {
    if (
      currentLang.value === 'en'
    ) {
      return 'Select locations';
    }

    if (
      currentLang.value === 'fr'
    ) {
      return 'Sélectionner les sites';
    }

    if (
      currentLang.value === 'pt'
    ) {
      return 'Selecionar unidades';
    }

    return 'Seleccionar sedes';
  }

  if (
    form.sedes.length === 1
  ) {
    const sede =
      listaSedes.value.find(
        (item) =>
          item.id ===
          form.sedes[0]
      );

    return (
      sede?.nombre ||
      '1'
    );
  }

  if (
    currentLang.value === 'en'
  ) {
    return `${form.sedes.length} locations selected`;
  }

  if (
    currentLang.value === 'fr'
  ) {
    return `${form.sedes.length} sites sélectionnés`;
  }

  if (
    currentLang.value === 'pt'
  ) {
    return `${form.sedes.length} unidades selecionadas`;
  }

  return `${form.sedes.length} sedes seleccionadas`;
};

/*
  Cierra el dropdown cuando se hace
  clic fuera de él.
*/
const handleClickOutside = (
  event
) => {
  if (
    dropdownRef.value &&
    !dropdownRef.value.contains(
      event.target
    )
  ) {
    isDropdownOpen.value =
      false;
  }
};

/* =========================================================
   FOTO / GALERÍA
========================================================= */

const fileInput = ref(null);
const avatarPreview = ref(null);
const avatarFile = ref(null);

const showPhotoOptions = ref(false);

const openPhotoOptions = () => {
  showPhotoOptions.value = true;
};

const closePhotoOptions = () => {
  showPhotoOptions.value = false;
};

const selectPhoto = () => {
  showPhotoOptions.value = false;

  if (!fileInput.value) return;

  fileInput.value.value = '';
  fileInput.value.click();
};

const setAvatarFile = (file) => {
  if (!file) return;

  if (
    avatarPreview.value &&
    avatarPreview.value.startsWith('blob:')
  ) {
    URL.revokeObjectURL(avatarPreview.value);
  }

  avatarFile.value = file;
  avatarPreview.value = URL.createObjectURL(file);
};

const handleFileChange = (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith('image/')) {
    toastRef.value?.notify(
      currentLang.value === 'en'
        ? 'Select a valid image.'
        : 'Selecciona una imagen válida.',
      'warning'
    );

    event.target.value = '';
    return;
  }

  setAvatarFile(file);

  toastRef.value?.notify(
    currentLang.value === 'en'
      ? 'Photo added successfully.'
      : 'Foto agregada correctamente.',
    'success'
  );

  event.target.value = '';
};

/* =========================================================
   CÁMARA
========================================================= */

const showCamera = ref(false);
const videoRef = ref(null);
const canvasRef = ref(null);

const cameraStream = ref(null);

/*
  user        = frontal
  environment = trasera
*/
const cameraFacingMode = ref('user');

const switchingCamera = ref(false);

/*
  Detiene todos los tracks activos.
*/
const stopCamera = () => {
  if (cameraStream.value) {
    cameraStream.value
      .getTracks()
      .forEach((track) => {
        track.stop();
      });

    cameraStream.value = null;
  }

  if (videoRef.value) {
    videoRef.value.srcObject = null;
  }
};

/*
  Inicia la cámara correspondiente.
*/
const startCamera = async () => {
  stopCamera();

  const constraints = {
    audio: false,
    video: {
      facingMode: {
        ideal: cameraFacingMode.value
      },
      width: {
        ideal: 1280
      },
      height: {
        ideal: 720
      }
    }
  };

  const stream =
    await navigator.mediaDevices.getUserMedia(
      constraints
    );

  cameraStream.value = stream;

  await nextTick();

  if (!videoRef.value) {
    throw new Error(
      'No se encontró el elemento de video.'
    );
  }

  videoRef.value.srcObject = stream;

  await videoRef.value.play();
};

/*
  Abre el modal y solicita permiso de cámara.
*/
const takePhoto = async () => {
  showPhotoOptions.value = false;

  if (
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia
  ) {
    toastRef.value?.notify(
      currentLang.value === 'en'
        ? 'Camera is not supported by this browser.'
        : 'Este navegador no permite utilizar la cámara.',
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
    console.error(
      'No se pudo abrir la cámara:',
      error
    );

    stopCamera();
    showCamera.value = false;

    let message =
      currentLang.value === 'en'
        ? 'Could not access the camera.'
        : 'No se pudo acceder a la cámara.';

    if (error?.name === 'NotAllowedError') {
      message =
        currentLang.value === 'en'
          ? 'Camera permission was denied. Enable camera permission in your browser.'
          : 'El permiso de cámara fue rechazado. Activa el permiso de cámara en tu navegador.';
    }

    if (error?.name === 'NotFoundError') {
      message =
        currentLang.value === 'en'
          ? 'No camera was found on this device.'
          : 'No se encontró una cámara en este dispositivo.';
    }

    if (error?.name === 'NotReadableError') {
      message =
        currentLang.value === 'en'
          ? 'The camera is being used by another application.'
          : 'La cámara está siendo utilizada por otra aplicación.';
    }

    toastRef.value?.notify(
      message,
      'warning'
    );
  }
};

/*
  Cambia entre frontal y trasera.
*/
const switchCamera = async () => {
  if (switchingCamera.value) return;

  switchingCamera.value = true;

  const previousMode =
    cameraFacingMode.value;

  const nextMode =
    previousMode === 'user'
      ? 'environment'
      : 'user';

  cameraFacingMode.value = nextMode;

  try {
    await startCamera();
  } catch (error) {
    console.error(
      'No se pudo cambiar de cámara:',
      error
    );

    /*
      Regresamos a la cámara anterior.
    */
    cameraFacingMode.value =
      previousMode;

    try {
      await startCamera();
    } catch (restoreError) {
      console.error(
        'No se pudo restaurar la cámara:',
        restoreError
      );

      closeCamera();
    }

    toastRef.value?.notify(
      currentLang.value === 'en'
        ? 'The selected camera is not available.'
        : 'La cámara seleccionada no está disponible.',
      'warning'
    );
  } finally {
    switchingCamera.value = false;
  }
};

/*
  Cierra modal y apaga cámara.
*/
const closeCamera = () => {
  stopCamera();
  showCamera.value = false;
  switchingCamera.value = false;
};

/*
  Captura el frame actual.
*/
const capturePhoto = () => {
  if (switchingCamera.value) return;

  const video = videoRef.value;
  const canvas = canvasRef.value;

  if (!video || !canvas) return;

  if (
    !video.videoWidth ||
    !video.videoHeight
  ) {
    toastRef.value?.notify(
      currentLang.value === 'en'
        ? 'The camera is not ready yet.'
        : 'La cámara todavía no está lista.',
      'warning'
    );

    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const context =
    canvas.getContext('2d');

  if (!context) {
    toastRef.value?.notify(
      currentLang.value === 'en'
        ? 'Could not process the photo.'
        : 'No se pudo procesar la fotografía.',
      'error'
    );

    return;
  }

  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  /*
    Frontal:
    guardamos la imagen como se ve
    en la vista previa (espejo).
  */
  if (cameraFacingMode.value === 'user') {
    context.save();

    context.translate(
      canvas.width,
      0
    );

    context.scale(-1, 1);

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    context.restore();
  } else {
    /*
      Trasera:
      orientación normal.
    */
    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );
  }

  canvas.toBlob(
    (blob) => {
      if (!blob) {
        toastRef.value?.notify(
          currentLang.value === 'en'
            ? 'Could not capture the photo.'
            : 'No se pudo capturar la fotografía.',
          'error'
        );

        return;
      }

      const file = new File(
        [blob],
        `personal-${Date.now()}.jpg`,
        {
          type: 'image/jpeg'
        }
      );

      setAvatarFile(file);

      closeCamera();

      toastRef.value?.notify(
        currentLang.value === 'en'
          ? 'Photo captured successfully.'
          : 'Foto tomada correctamente.',
        'success'
      );
    },
    'image/jpeg',
    0.92
  );
};

/* =========================================================
   VALIDACIÓN
========================================================= */

const validateForm = () => {
  /*
    CAMPOS PERSONALES
  */
  if (
    !form.nombres.trim() ||
    !form.apellidoP.trim()
  ) {
    toastRef.value?.notify(
      currentLang.value === 'en'
        ? 'Complete the required personal information.'
        : currentLang.value === 'fr'
          ? 'Complétez les informations personnelles obligatoires.'
          : currentLang.value === 'pt'
            ? 'Preencha as informações pessoais obrigatórias.'
            : 'Completa los datos personales obligatorios.',
      'warning'
    );

    return false;
  }

  /*
    ROL
  */
  if (
    !form.rol
  ) {
    toastRef.value?.notify(
      currentLang.value === 'en'
        ? 'Select a system role.'
        : currentLang.value === 'fr'
          ? 'Sélectionnez un rôle système.'
          : currentLang.value === 'pt'
            ? 'Selecione uma função no sistema.'
            : 'Selecciona un rol del sistema.',
      'warning'
    );

    return false;
  }

  /*
    CORREO
  */
  if (
    !form.email.trim()
  ) {
    toastRef.value?.notify(
      currentLang.value === 'en'
        ? 'Enter an email address.'
        : currentLang.value === 'fr'
          ? 'Entrez une adresse e-mail.'
          : currentLang.value === 'pt'
            ? 'Digite um endereço de e-mail.'
            : 'Ingresa un correo electrónico.',
      'warning'
    );

    return false;
  }

  /*
    CONTRASEÑA SOLO PARA
    GERENTE Y RECEPCIÓN.
  */
  if (
    form.rol === 'gerente' ||
    form.rol === 'recepcion'
  ) {
    if (
      !form.password ||
      !form.confirmPassword
    ) {
      toastRef.value?.notify(
        currentLang.value === 'en'
          ? 'Enter and confirm the password.'
          : currentLang.value === 'fr'
            ? 'Entrez et confirmez le mot de passe.'
            : currentLang.value === 'pt'
              ? 'Digite e confirme a senha.'
              : 'Ingresa y confirma la contraseña.',
        'warning'
      );

      return false;
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      toastRef.value?.notify(
        currentLang.value === 'en'
          ? 'Passwords do not match.'
          : currentLang.value === 'fr'
            ? 'Les mots de passe ne correspondent pas.'
            : currentLang.value === 'pt'
              ? 'As senhas não coincidem.'
              : 'Las contraseñas no coinciden.',
        'warning'
      );

      return false;
    }
  }

  /*
    ENTRENADOR:
    ESPECIALIDAD
  */
  if (
    form.rol ===
      'entrenador' &&
    !form.especialidad.trim()
  ) {
    toastRef.value?.notify(
      currentLang.value === 'en'
        ? 'Enter the trainer specialty.'
        : currentLang.value === 'fr'
          ? 'Entrez la spécialité de l’entraîneur.'
          : currentLang.value === 'pt'
            ? 'Digite a especialidade do treinador.'
            : 'Ingresa la especialidad del entrenador.',
      'warning'
    );

    return false;
  }

  return true;
};

/* =========================================================
   GUARDAR REGISTRO
========================================================= */

const saveRegistration = () => {
  if (
    !validateForm()
  ) {
    return;
  }

  try {
    /*
      Construimos los datos del
      empleado.

      IMPORTANTE:
      avatarFile contiene tanto:
      - foto subida desde galería
      - foto tomada con cámara
    */
    const data = {
      rol:
        form.rol,

      email:
        form.email.trim(),

      password:
        form.password,

      especialidad:
        form.especialidad.trim(),

      sedes:
        [...form.sedes],

      curp:
        form.curp.trim(),

      nombres:
        form.nombres.trim(),

      apellidoP:
        form.apellidoP.trim(),

      apellidoM:
        form.apellidoM.trim(),

      fechaNacimiento:
        form.fechaNacimiento,

      celular:
        form.celular.trim(),

      facebook:
        form.facebook.trim(),

      instagram:
        form.instagram.trim(),

      tiktok:
        form.tiktok.trim(),

      otrasApps:
        form.otrasApps.trim(),

      horaEntrada:
        form.horaEntrada,

      horaSalida:
        form.horaSalida,

      /*
        AQUÍ SE GUARDA LA FOTO.
      */
      foto:
        avatarFile.value
    };

    console.log(
      'Personal a registrar:',
      data
    );

    /*
      Aquí puedes enviar "data"
      a tu API posteriormente.
    */

    toastRef.value?.notify(
      currentLang.value === 'en'
        ? 'Staff member registered successfully.'
        : currentLang.value === 'fr'
          ? 'Personnel enregistré avec succès.'
          : currentLang.value === 'pt'
            ? 'Funcionário registrado com sucesso.'
            : 'Personal registrado correctamente.',
      'success'
    );
  } catch (error) {
    console.error(
      'Error al registrar personal:',
      error
    );

    toastRef.value?.notify(
      currentLang.value === 'en'
        ? 'An error occurred while registering the staff member.'
        : currentLang.value === 'fr'
          ? 'Une erreur s’est produite lors de l’enregistrement du personnel.'
          : currentLang.value === 'pt'
            ? 'Ocorreu um erro ao registrar o funcionário.'
            : 'Ocurrió un error al registrar al personal.',
      'error'
    );
  }
};

/* =========================================================
   CICLO DE VIDA
========================================================= */

onMounted(() => {
  /*
    Cambio global de idioma.
  */
  window.addEventListener(
    'idioma-changed',
    handleLangChange
  );

  /*
    Cerrar selector de sedes
    haciendo clic afuera.
  */
  document.addEventListener(
    'click',
    handleClickOutside
  );
});

onUnmounted(() => {
  window.removeEventListener(
    'idioma-changed',
    handleLangChange
  );

  document.removeEventListener(
    'click',
    handleClickOutside
  );

  /*
    MUY IMPORTANTE:
    Si el usuario cambia de pantalla
    mientras la cámara está abierta,
    apagamos la cámara.
  */
  stopCamera();

  /*
    Liberamos la URL temporal
    de la fotografía.
  */
  if (
    avatarPreview.value
  ) {
    URL.revokeObjectURL(
      avatarPreview.value
    );
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;600;700&display=swap');

/* =========================================================
   BASE
========================================================= */
* { box-sizing: border-box; }
.hidden-canvas { display: none; }

.main-content {
  width: 100%;
  min-height: calc(100vh - 80px);
  padding: 28px;
  font-family: 'Inter', sans-serif;
  color: var(--color-texto-general, #e5e7eb);
}
.profile-card {
  width: 100%;
  max-width: 1450px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 310px minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

/* =========================================================
   PANEL PERFIL
========================================================= */
.profile-section {
  position: sticky;
  top: 24px;
  overflow: hidden;
  border: 1px solid var(--border-cards, rgba(255,255,255,.08));
  border-radius: var(--app-border-radius, 20px);
  background: var(--bg-cards, #14161b);
  box-shadow: 0 12px 35px rgba(0,0,0,.18);
}
.profile-content { padding: 30px 26px; }
.main-title {
  margin: 0 0 27px;
  color: var(--color-titulos, #fff);
  font-family: 'Oswald', sans-serif;
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.12;
  letter-spacing: -.02em;
}
.highlight { color: var(--color-highlight, #3b82f6); }

/* ---------- Avatar ---------- */
.avatar-wrapper { position: relative; width: 132px; height: 132px; margin: 0 auto 15px; }
.avatar-ring {
  width: 132px; height: 132px;
  display: flex; align-items: center; justify-content: center;
  padding: 4px;
  border-radius: 50%;
  background: linear-gradient(145deg, var(--color-highlight, #3b82f6), color-mix(in srgb, var(--color-highlight, #3b82f6) 35%, transparent));
  box-shadow: 0 0 0 5px color-mix(in srgb, var(--color-highlight, #3b82f6) 8%, transparent), 0 12px 30px rgba(0,0,0,.28);
}
.avatar-circle {
  width: 100%; height: 100%;
  position: relative;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  cursor: pointer;
  border: 4px solid var(--bg-cards, #14161b);
  border-radius: 50%;
  background: #262a31;
  transition: transform .2s ease, filter .2s ease;
}
.avatar-circle:hover { transform: scale(1.015); filter: brightness(1.08); }
.avatar-circle svg { width: 60px; height: 60px; opacity: .8; }
.avatar-img { width: 100%; height: 100%; display: block; object-fit: cover; }
.avatar-action {
  position: absolute; right: 0; bottom: 5px;
  width: 39px; height: 39px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  border: 3px solid var(--bg-cards, #14161b);
  border-radius: 50%;
  background: var(--color-highlight, #3b82f6);
  color: #fff;
  box-shadow: 0 6px 16px rgba(0,0,0,.3);
  transition: transform .2s ease, filter .2s ease;
}
.avatar-action:hover { transform: translateY(-2px) scale(1.05); filter: brightness(1.1); }
.avatar-action:active { transform: scale(.95); }
.avatar-action svg { width: 18px; height: 18px; }
.profile-hint { margin: 0 0 25px; text-align: center; color: var(--color-texto-general, #94a3b8); font-size: .73rem; line-height: 1.5; opacity: .65; }

/* ---------- Resumen ---------- */
.profile-summary { margin: 0; padding: 20px 0 0; border-top: 1px solid rgba(255,255,255,.07); }
.summary-item { padding: 13px 0; border-bottom: 1px solid rgba(255,255,255,.055); }
.summary-item:last-child { border-bottom: none; }
.summary-item dt {
  margin-bottom: 6px;
  color: var(--color-texto-general, #94a3b8);
  font-size: .66rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
  opacity: .58;
}
.summary-item dd { margin: 0; color: var(--color-titulos, #fff); font-size: .83rem; font-weight: 500; line-height: 1.4; overflow-wrap: anywhere; }
.summary-item dd.empty, .empty { color: var(--color-texto-general, #94a3b8); opacity: .45; }
.plan-chip {
  display: inline-flex; align-items: center;
  min-height: 25px; padding: 4px 9px;
  border: 1px solid color-mix(in srgb, var(--color-highlight, #3b82f6) 22%, transparent);
  border-radius: 7px;
  background: color-mix(in srgb, var(--color-highlight, #3b82f6) 10%, transparent);
  color: var(--color-highlight, #60a5fa);
  font-size: .68rem; font-weight: 700;
}

/* =========================================================
   FORMULARIOS
========================================================= */
.forms-wrapper { min-width: 0; display: flex; flex-direction: column; gap: 18px; }
.login-card {
  overflow: visible;
  border: 1px solid var(--border-cards, rgba(255,255,255,.08));
  border-radius: var(--app-border-radius, 18px);
  background: var(--bg-cards, #14161b);
  box-shadow: 0 8px 28px rgba(0,0,0,.12);
}
.card-header { padding: 18px 22px; border-bottom: 1px solid rgba(255,255,255,.065); }
.section-title {
  position: relative;
  margin: 0; padding-left: 13px;
  color: var(--color-titulos, #fff);
  font-family: 'Oswald', sans-serif;
  font-size: 1.05rem; font-weight: 600; letter-spacing: .01em;
}
.section-title::before {
  content: '';
  position: absolute; top: 50%; left: 0;
  width: 3px; height: 18px;
  border-radius: 3px;
  background: var(--color-highlight, #3b82f6);
  transform: translateY(-50%);
}
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 20px; padding: 22px; }
.span-full { grid-column: 1 / -1; }
.sedes-right-col { grid-column: 2; }

.input-group { min-width: 0; display: flex; flex-direction: column; gap: 7px; }
.input-group label, .date-content label {
  color: var(--color-texto-general, #d1d5db);
  font-size: .71rem; font-weight: 600; letter-spacing: .015em;
}
.required { color: #ef4444; }

.input-group input, .input-group select, .date-content input {
  width: 100%; min-height: 43px;
  padding: 0 13px;
  outline: none;
  border: 1px solid var(--border-inputs, rgba(255,255,255,.1));
  border-radius: 10px;
  background: var(--bg-inputs, rgba(255,255,255,.035));
  color: var(--color-texto-general, #e5e7eb);
  font-family: 'Inter', sans-serif; font-size: .79rem;
  transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
}
.input-group input::placeholder { color: var(--color-texto-general, #94a3b8); opacity: .35; }
.input-group input:hover, .input-group select:hover, .date-content input:hover { border-color: rgba(255,255,255,.17); }
.input-group input:focus, .input-group select:focus, .date-content input:focus {
  border-color: var(--color-highlight, #3b82f6);
  background: color-mix(in srgb, var(--color-highlight, #3b82f6) 3%, var(--bg-inputs, #1a1d23));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-highlight, #3b82f6) 11%, transparent);
}
.custom-select { cursor: pointer; appearance: auto; }
.custom-select option { background: #17191e; color: #fff; }

.input-with-icon { position: relative; }
.input-with-icon svg {
  position: absolute; top: 50%; left: 13px;
  width: 16px; height: 16px;
  pointer-events: none;
  color: var(--color-texto-general, #94a3b8);
  opacity: .55;
  transform: translateY(-50%);
}
.input-with-icon input { padding-left: 40px; }

/* ---------- Multiselect sedes ---------- */
.custom-multiselect { position: relative; width: 100%; }
.select-box-trigger {
  width: 100%; min-height: 43px;
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  padding: 0 12px 0 13px;
  cursor: pointer; user-select: none;
  border: 1px solid var(--border-inputs, rgba(255,255,255,.1));
  border-radius: 10px;
  background: var(--bg-inputs, rgba(255,255,255,.035));
  transition: border-color .2s ease, box-shadow .2s ease;
}
.select-box-trigger:hover { border-color: rgba(255,255,255,.17); }
.select-box-trigger.open {
  border-color: var(--color-highlight, #3b82f6);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-highlight, #3b82f6) 10%, transparent);
}
.trigger-text { min-width: 0; overflow: hidden; color: var(--color-texto-general, #e5e7eb); font-size: .79rem; text-overflow: ellipsis; white-space: nowrap; }
.placeholder-text { opacity: .4; }
.dropdown-arrow { width: 15px; height: 15px; flex-shrink: 0; color: var(--color-texto-general, #94a3b8); transition: transform .2s ease; }
.dropdown-arrow.rotate { transform: rotate(180deg); }
.dropdown-options-list {
  position: absolute; z-index: 80;
  top: calc(100% + 6px); right: 0; left: 0;
  max-height: 230px; overflow-y: auto;
  padding: 6px;
  border: 1px solid var(--border-cards, rgba(255,255,255,.1));
  border-radius: 11px;
  background: var(--bg-cards, #17191e);
  box-shadow: 0 15px 35px rgba(0,0,0,.4);
}
.dropdown-options-list::-webkit-scrollbar { width: 5px; }
.dropdown-options-list::-webkit-scrollbar-track { background: transparent; }
.dropdown-options-list::-webkit-scrollbar-thumb { border-radius: 10px; background: rgba(255,255,255,.14); }
.dropdown-option-item {
  display: flex; align-items: center; gap: 10px;
  min-height: 39px; padding: 7px 9px;
  cursor: pointer; border-radius: 7px;
  color: var(--color-texto-general, #e5e7eb);
  font-size: .77rem;
  transition: background .16s ease;
}
.dropdown-option-item:hover { background: rgba(255,255,255,.055); }
.dropdown-option-item.selected { background: color-mix(in srgb, var(--color-highlight, #3b82f6) 10%, transparent); }
.option-checkbox {
  width: 18px; height: 18px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  border: 1px solid rgba(255,255,255,.18); border-radius: 5px;
}
.dropdown-option-item.selected .option-checkbox { border-color: var(--color-highlight, #3b82f6); background: var(--color-highlight, #3b82f6); color: #fff; }
.option-checkbox svg { width: 12px; height: 12px; }

/* ---------- Horarios ---------- */
.date-field {
  min-height: 78px;
  display: flex; align-items: center; gap: 13px;
  padding: 13px;
  border: 1px solid var(--border-inputs, rgba(255,255,255,.08));
  border-radius: 12px;
  background: rgba(255,255,255,.022);
}
.date-icon {
  width: 39px; height: 39px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  border-radius: 10px;
  background: color-mix(in srgb, var(--color-highlight, #3b82f6) 11%, transparent);
  color: var(--color-highlight, #60a5fa);
}
.date-icon svg { width: 18px; height: 18px; }
.date-content { min-width: 0; flex: 1; }
.date-content label { display: block; margin-bottom: 6px; }
.date-content input { min-height: 37px; }

/* ---------- Pie ---------- */
.registration-footer { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 5px 2px 18px; }
.required-hint { color: var(--color-texto-general, #94a3b8); font-size: .7rem; opacity: .6; }
.btn-primary {
  min-height: 45px;
  display: inline-flex; align-items: center; justify-content: center; gap: 9px;
  padding: 0 22px;
  cursor: pointer; border: none; border-radius: 10px;
  background: var(--color-botones, var(--color-highlight, #3b82f6));
  color: var(--color-texto-botones, #fff);
  font-family: 'Inter', sans-serif; font-size: .78rem; font-weight: 700;
  box-shadow: 0 7px 18px color-mix(in srgb, var(--color-botones, #3b82f6) 20%, transparent);
  transition: transform .2s ease, filter .2s ease, box-shadow .2s ease;
}
.btn-primary:hover { transform: translateY(-1px); filter: brightness(1.08); box-shadow: 0 9px 22px color-mix(in srgb, var(--color-botones, #3b82f6) 27%, transparent); }
.btn-primary:active { transform: scale(.98); }
.btn-primary svg { width: 17px; height: 17px; }

/* =========================================================
   PANEL DE FOTO Y CÁMARA (idéntico al registro de clientes)
========================================================= */
.photo-options-overlay, .camera-overlay {
  position: fixed; z-index: 3000; inset: 0;
  display: flex; align-items: center; justify-content: center;
  padding: 18px;
  background: rgba(0,0,0,.78);
}
.camera-overlay { z-index: 4000; background: rgba(0,0,0,.9); }

.photo-options-modal, .camera-modal {
  width: 100%; max-width: 440px;
  padding: 24px;
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 20px;
  background: var(--bg-cards, #151515);
  box-shadow: 0 30px 80px rgba(0,0,0,.55);
}
.camera-modal { max-width: 620px; }
.photo-options-handle { display: none; }

.photo-options-header, .camera-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 18px; margin-bottom: 20px;
}
.photo-options-eyebrow, .camera-eyebrow {
  display: block; margin-bottom: 5px;
  color: var(--color-highlight, #3b82f6);
  font: 700 .6rem 'Inter', sans-serif; letter-spacing: 1px;
}
.photo-options-header h3, .camera-header h3 {
  margin: 0;
  color: var(--color-titulos, #fff);
  font: 400 1.25rem 'Anton', sans-serif;
  text-transform: uppercase;
}
.photo-options-header p, .camera-header p {
  margin: 5px 0 0;
  color: var(--color-texto-general, #94a3b8);
  font: 400 .74rem/1.5 'Inter', sans-serif;
  opacity: .7;
}
.modal-close-btn {
  width: 34px; height: 34px; flex-shrink: 0;
  display: grid; place-items: center;
  padding: 0;
  border: 1px solid rgba(255,255,255,.1); border-radius: 9px;
  background: rgba(255,255,255,.04);
  color: #fff; cursor: pointer; font-size: 1.3rem;
}

/* ---------- Opciones ---------- */
.photo-options-grid { display: flex; flex-direction: column; gap: 9px; }
.photo-option {
  width: 100%; min-height: 72px;
  display: flex; align-items: center; gap: 13px;
  padding: 11px 13px;
  border: 1px solid rgba(255,255,255,.08); border-radius: 13px;
  background: rgba(255,255,255,.025);
  color: inherit; text-align: left; cursor: pointer;
}
.photo-option:hover { border-color: var(--color-highlight, #3b82f6); }
.photo-option-icon {
  width: 44px; height: 44px; flex-shrink: 0;
  display: grid; place-items: center;
  border-radius: 11px;
  background: color-mix(in srgb, var(--color-highlight, #3b82f6) 13%, transparent);
  color: var(--color-highlight, #60a5fa);
}
.photo-option-icon svg { width: 20px; height: 20px; }
.photo-option-text { flex: 1; }
.photo-option-text strong { display: block; color: var(--color-titulos, #fff); font: 600 .8rem 'Inter', sans-serif; }
.photo-option-text span { display: block; margin-top: 3px; color: var(--color-texto-general, #94a3b8); font: 400 .68rem 'Inter', sans-serif; }
.photo-option-arrow { width: 16px; color: var(--color-texto-general, #94a3b8); }
.photo-cancel {
  width: 100%; height: 40px; margin-top: 13px;
  border: 1px solid rgba(255,255,255,.08); border-radius: 10px;
  background: transparent;
  color: var(--color-texto-general, #94a3b8); cursor: pointer;
}

/* ---------- Visor ---------- */
.camera-preview {
  position: relative; width: 100%;
  aspect-ratio: 4 / 3; overflow: hidden;
  border: 1px solid rgba(255,255,255,.1); border-radius: 18px;
  background: #000;
}
.camera-preview video { width: 100%; height: 100%; display: block; object-fit: cover; }
.camera-preview video.camera-mirrored { transform: scaleX(-1); }

.camera-guide { position: absolute; z-index: 2; inset: 0; display: grid; place-items: center; pointer-events: none; }
.face-guide { width: 47%; height: 70%; border: 2px dashed rgba(255,255,255,.45); border-radius: 50%; }

.switch-camera-btn {
  position: absolute; z-index: 10; top: 14px; right: 14px;
  display: flex; align-items: center; gap: 7px;
  min-height: 38px; padding: 0 13px;
  border: 1px solid rgba(255,255,255,.25); border-radius: 999px;
  background: rgba(0,0,0,.62);
  color: #fff; font: 600 .7rem 'Inter', sans-serif;
  cursor: pointer; box-shadow: 0 5px 16px rgba(0,0,0,.3);
}
.switch-camera-btn:hover { background: rgba(0,0,0,.8); }
.switch-camera-btn:disabled { cursor: wait; opacity: .65; }
.switch-camera-btn svg { width: 16px; height: 16px; }
.switch-camera-btn svg.rotating { animation: cameraRotate .7s linear infinite; }
@keyframes cameraRotate { to { transform: rotate(360deg); } }

.camera-switching { position: absolute; z-index: 8; inset: 0; display: grid; place-items: center; background: rgba(0,0,0,.28); pointer-events: none; }
.camera-loader { width: 38px; height: 38px; border: 3px solid rgba(255,255,255,.25); border-top-color: #fff; border-radius: 50%; animation: cameraRotate .7s linear infinite; }

/* ---------- Capturar ---------- */
.camera-actions { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-top: 18px; }
.camera-cancel-btn {
  min-width: 110px; padding: 11px 18px;
  border: 1px solid rgba(255,255,255,.1); border-radius: 12px;
  background: rgba(255,255,255,.04);
  color: var(--color-texto-general, #cbd5e1); cursor: pointer;
}
.capture-btn {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 18px 8px 8px;
  border: none; border-radius: 999px;
  background: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, #fff);
  font: 700 .78rem 'Inter', sans-serif; cursor: pointer;
}
.capture-btn:disabled { cursor: wait; opacity: .6; }
.capture-circle { width: 38px; height: 38px; display: grid; place-items: center; border: 2px solid #fff; border-radius: 50%; }
.capture-circle span { width: 27px; height: 27px; display: block; border-radius: 50%; background: #fff; transition: transform .15s ease; }
.capture-btn:hover:not(:disabled) .capture-circle span { transform: scale(.85); }

/* ---------- Transición ---------- */
.photo-menu-enter-active, .photo-menu-leave-active { transition: opacity .2s ease; }
.photo-menu-enter-active .photo-options-modal, .photo-menu-leave-active .photo-options-modal,
.photo-menu-enter-active .camera-modal, .photo-menu-leave-active .camera-modal { transition: opacity .2s ease, transform .22s ease; }
.photo-menu-enter-from, .photo-menu-leave-to { opacity: 0; }
.photo-menu-enter-from .photo-options-modal, .photo-menu-leave-to .photo-options-modal,
.photo-menu-enter-from .camera-modal, .photo-menu-leave-to .camera-modal { opacity: 0; transform: translateY(10px) scale(.97); }

/* =========================================================
   RESPONSIVE (formulario del personal)
========================================================= */
@media (max-width: 1150px) {
  .main-content { padding: 22px; }
  .profile-card { grid-template-columns: 275px minmax(0, 1fr); gap: 18px; }
  .profile-content { padding: 25px 21px; }
  .main-title { font-size: 1.75rem; }
}
@media (max-width: 900px) {
  .main-content { padding: 18px; }
  .profile-card { grid-template-columns: 1fr; }
  .profile-section { position: relative; top: auto; }
  .profile-content { display: grid; grid-template-columns: 1fr auto; column-gap: 30px; align-items: center; }
  .main-title { grid-column: 1; margin-bottom: 15px; }
  .avatar-wrapper { grid-column: 2; grid-row: 1 / span 2; margin: 0 10px 0 0; }
  .profile-hint { display: none; }
  .profile-summary { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; margin-top: 20px; }
  .summary-item { padding: 12px 15px; border-right: 1px solid rgba(255,255,255,.06); border-bottom: none; }
  .summary-item:first-child { padding-left: 0; }
  .summary-item:last-child { border-right: none; }
}
@media (max-width: 680px) {
  .main-content { padding: 12px; }
  .profile-card { gap: 14px; }
  .profile-content { display: block; padding: 23px 18px; text-align: center; }
  .main-title { font-size: 1.65rem; }
  .avatar-wrapper { margin: 0 auto 14px; }
  .profile-hint { display: block; }
  .profile-summary { display: grid; grid-template-columns: repeat(2, 1fr); margin-top: 15px; text-align: left; }
  .summary-item { padding: 12px; border-right: 1px solid rgba(255,255,255,.055); border-bottom: 1px solid rgba(255,255,255,.055); }
  .summary-item:nth-child(2n) { border-right: none; }
  .summary-item:nth-last-child(-n + 2) { border-bottom: none; }
  .form-grid { grid-template-columns: 1fr; gap: 16px; padding: 18px; }
  .span-full, .sedes-right-col { grid-column: 1; }
  .card-header { padding: 16px 18px; }
  .registration-footer { flex-direction: column; align-items: stretch; gap: 12px; padding: 2px 0 14px; }
  .required-hint { padding-left: 2px; }
  .btn-primary { width: 100%; }
}
@media (max-width: 430px) {
  .main-content { padding: 9px; }
  .profile-content { padding: 21px 15px; }
  .main-title { font-size: 1.5rem; }
  .avatar-wrapper, .avatar-ring { width: 120px; height: 120px; }
  .profile-summary { grid-template-columns: 1fr; }
  .summary-item { padding: 11px 0; border-right: none; border-bottom: 1px solid rgba(255,255,255,.055); }
  .summary-item:nth-last-child(-n + 2) { border-bottom: 1px solid rgba(255,255,255,.055); }
  .summary-item:last-child { border-bottom: none; }
  .form-grid { padding: 16px 14px; }
  .date-field { padding: 11px; }
  .camera-header h3 { font-size: 1.05rem; }
  .switch-camera-btn span { display: none; }
  .switch-camera-btn { width: 40px; height: 40px; padding: 0; justify-content: center; }
  .switch-camera-btn svg { width: 19px; height: 19px; }
}

/* =========================================================
   RESPONSIVE (panel de foto / cámara, igual que clientes)
========================================================= */
@media (max-width: 650px) {
  .photo-options-overlay { align-items: flex-end; padding: 0; }
  .photo-options-modal { max-width: none; padding: 12px 17px 20px; border-radius: 22px 22px 0 0; }
  .photo-options-handle { width: 38px; height: 4px; display: block; margin: 0 auto 17px; border-radius: 999px; background: rgba(255,255,255,.16); }

  .camera-overlay { align-items: flex-end; padding: 0; }
  .camera-modal { max-width: none; padding: 17px 14px calc(18px + env(safe-area-inset-bottom)); border-radius: 24px 24px 0 0; }
  .camera-preview { aspect-ratio: 3 / 4; }
  .switch-camera-btn { top: 11px; right: 11px; min-height: 38px; padding: 0 12px; }
  .camera-actions { flex-direction: column-reverse; }
  .camera-cancel-btn, .capture-btn { width: 100%; justify-content: center; }
}

@media (prefers-reduced-motion: reduce) {
  .avatar-circle, .avatar-action, .btn-primary, .capture-circle span { transition: none; }
  .camera-loader, .switch-camera-btn svg.rotating { animation-duration: 1.4s; }
}
</style>