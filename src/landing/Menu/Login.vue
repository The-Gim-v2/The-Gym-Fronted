<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Logo from '@/landing/logo.vue';

// Mapeo seguro de usuarios válidos con sus respectivos roles y rutas de destino
const VALID_USERS: Record<string, { role: string; nameRoute: string }> = {
  'admin@gmail.com': { role: 'Admin', nameRoute: 'Admin-dashboard' },
  'propietario@gmail.com': { role: 'Owner', nameRoute: 'Owner-dashboard' },
  'recepcionista@gmail.com': { role: 'recepcion', nameRoute: 'recepcion-dashboard' },
  'miembro@gmail.com': { role: 'Member', nameRoute: 'Member-dashboard' },
};

const router = useRouter();
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const clearMessages = () => {
  errorMessage.value = '';
  successMessage.value = '';
};

const handleSubmit = () => {
  const userEmail = email.value.toLowerCase().trim();
  const userInfo = VALID_USERS[userEmail];

  // Validación estricta de credenciales
  if (password.value !== '123') {
    errorMessage.value = 'Contraseña incorrecta. Intenta de nuevo.';
    return;
  }

  if (!userInfo) {
    errorMessage.value = 'Usuario no reconocido o sin privilegios de acceso.';
    return;
  }

  errorMessage.value = '';
  successMessage.value = `Acceso concedido como ${userInfo.role}. Redirigiendo...`;

  // Asignación segura del rol en localStorage requerida por los guards de las rutas
  localStorage.setItem('user_role', userInfo.role);

  // Redirección controlada tras un breve retraso visual
  setTimeout(() => {
    router.push({ name: userInfo.nameRoute });
  }, 1000);
};
</script>

<template>
  <div class="login-page">
    <div class="glow"></div>

    <header class="top-bar">
      <router-link :to="{ name: 'home' }" class="top-brand">
        <Logo />
        <span class="logo-text">
          <span class="text-accent">SAHWA</span>
        </span>
      </router-link>
    </header>

    <main class="login-container">
      <div class="login-card">
        <div class="card-header">
          <h1 class="title">INICIA <span class="highlight">SESIÓN</span></h1>
          <p class="subtitle">Un solo acceso para todo tu equipo</p>

          <!-- Franja de roles: deja claro que este login sirve para todos, no solo dueños de gimnasio -->
          <!--<div class="role-badges">
            <span class="role-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"></path><path d="M6 21V8l6-4 6 4v13"></path><path d="M10 21v-6h4v6"></path></svg>
              Gimnasios
            </span>
            <span class="role-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5 17.5 17.5"></path><circle cx="5" cy="5" r="2.5"></circle><circle cx="19" cy="19" r="2.5"></circle></svg>
              Entrenadores
            </span>
            <span class="role-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 4.5 9 7l-1.5 3.5L9 13l-2 7"></path><circle cx="14.5" cy="4.5" r="1.6"></circle><path d="M11 10.5 14 9l3 2.5 3.5-1.5"></path><path d="M13.5 12 12 20"></path></svg>
              Atletas
            </span>
          </div>-->
        </div>

        <form @submit.prevent="handleSubmit" class="login-form">
          <div class="input-group">
            <label for="email">Correo electrónico</label>
            <div class="input-wrapper">
              <input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                v-model="email"
                @input="clearMessages"
                required
              />
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
          </div>

          <div class="input-group">
            <div class="label-row">
              <label for="password">Contraseña</label>
              <router-link :to="{ name: 'recover-password' }" class="forgot-link">¿Olvidaste tu contraseña?</router-link>
            </div>
            <div class="input-wrapper">
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Ingresa tu contraseña"
                v-model="password"
                @input="clearMessages"
                required
              />
              <button type="button" class="toggle-password-btn" @click="showPassword = !showPassword" aria-label="Mostrar contraseña">
                <svg v-if="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </button>
            </div>
          </div>

          <div v-if="errorMessage" class="alert alert-error">{{ errorMessage }}</div>
          <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

          <button type="submit" class="btn-primary">
            Entrar al sistema
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>

          <div class="divider"><span>¿ERES NUEVO?</span></div>

          <router-link to="/Record" class="btn-secondary">Registrarme en la plataforma</router-link>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;600;700&display=swap');

.login-page {
  min-height: 100vh;
  background: #0a0a0a;
  color: #f5f5f4;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.glow {
  position: absolute;
  top: -160px;
  left: 50%;
  transform: translateX(-50%);
  width: 720px;
  height: 720px;
  max-width: 160vw;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(28,79,214,0.32) 0%, rgba(28,79,214,0) 70%);
  filter: blur(10px);
  animation: pulseGlow 6s ease-in-out infinite;
  pointer-events: none;
}

.highlight { color: #3b82f6; }

@keyframes pulseGlow {
  0%, 100% { opacity: 0.28; }
  50% { opacity: 0.5; }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shake {
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(2px); }
  30%, 50%, 70% { transform: translateX(-4px); }
  40%, 60% { transform: translateX(4px); }
}

@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}

.top-bar {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px clamp(18px, 4vw, 60px);
  box-sizing: border-box;
  position: relative;
}

.top-brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.logo-text {
  font-family: 'Anton', sans-serif;
  font-size: clamp(19px, 5vw, 24px);
  letter-spacing: 1px;
  display: inline-block;
  animation: floatText 3s ease-in-out infinite;
}
.text-accent {
  background: linear-gradient(135deg, #60a5fa 0%, #3a6bd6 50%, #1d4ed8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 8px rgba(58, 107, 214, 0.4));
  display: inline-block;
}

@keyframes floatText {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
  100% { transform: translateY(0px); }
}

.login-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px 48px;
  position: relative;
}

.login-card {
  width: 100%;
  max-width: 440px;
  background: rgba(18, 18, 18, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 24px;
  padding: clamp(30px, 5vw, 50px);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.55);
  box-sizing: border-box;
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.card-header { text-align: center; margin-bottom: 28px; }

.title {
  font-family: 'Anton', sans-serif;
  font-size: clamp(1.75rem, 6vw, 2.6rem);
  letter-spacing: -1px;
  text-transform: uppercase;
  margin: 0 0 8px;
  color: #f5f5f4;
}

.subtitle { font-size: 14px; color: rgba(245, 245, 244, 0.55); margin: 0 0 16px; }

/* Franja de roles: comunica que el mismo login sirve para gimnasios, entrenadores y atletas */
.role-badges {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 7px;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 11px;
  border-radius: 50px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.25);
  color: #8fb4f8;
  font-family: 'Oswald', sans-serif;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  white-space: nowrap;
}
.role-badge svg { flex-shrink: 0; opacity: 0.85; }

.login-form { display: flex; flex-direction: column; gap: 20px; }

.input-group { display: flex; flex-direction: column; gap: 8px; }

.label-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px; }

label {
  font-family: 'Oswald', sans-serif;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: #f5f5f4;
}

.forgot-link { font-size: 12px; font-weight: 700; color: #5b8bf0; text-decoration: none; }
.forgot-link:hover { text-decoration: underline; }

.input-wrapper { position: relative; }

input {
  width: 100%;
  padding: 14px 46px 14px 16px;
  background: #141414;
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  color: #f5f5f4;
  font-weight: 600;
  font-size: 14.5px;
  min-height: 48px;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

input::placeholder { color: rgba(245, 245, 244, 0.4); }

input:focus {
  outline: none;
  border-color: #1c4fd6;
  box-shadow: 0 0 0 4px rgba(28, 79, 214, 0.25);
  background: #161616;
}

/* El navegador rellena estos campos con fondo blanco por defecto (autocompletado);
   forzamos que respete el tema oscuro de la tarjeta. */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-text-fill-color: #f5f5f4;
  -webkit-box-shadow: 0 0 0 1000px #141414 inset;
  box-shadow: 0 0 0 1000px #141414 inset;
  caret-color: #f5f5f4;
  transition: background-color 9999s ease-in-out 0s;
}

.input-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: rgba(245, 245, 244, 0.35);
  pointer-events: none;
}

.toggle-password-btn {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 46px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(245, 245, 244, 0.4);
}

.alert {
  font-size: 13px;
  font-weight: 600;
  padding: 12px 14px;
  border-radius: 10px;
}

.alert-error {
  background: rgba(220, 38, 38, 0.12);
  border: 1px solid rgba(220, 38, 38, 0.35);
  color: #f87171;
  animation: shake 0.4s ease;
}

.alert-success {
  background: rgba(28, 79, 214, 0.15);
  border: 1px solid rgba(28, 79, 214, 0.4);
  color: #8fb4f8;
  animation: fadeInScale 0.3s ease;
}

.btn-primary {
  width: 100%;
  padding: 16px;
  background: #1c4fd6;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 14.5px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 52px;
  box-shadow: 0 10px 24px rgba(28, 79, 214, 0.3);
  transition: all 0.25s ease;
}

.btn-primary:hover { background: #123ba0; transform: translateY(-2px); }
.btn-primary:active { transform: translateY(0); }

.divider {
  position: relative;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 2px;
}

.divider span {
  position: relative;
  top: -10px;
  background: #121212;
  padding: 2px 14px;
  font-family: 'Oswald', sans-serif;
  font-size: 11.5px;
  font-weight: 700;
  color: rgba(245, 245, 244, 0.5);
  border-radius: 20px;
}

.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 14px;
  background: rgba(255, 255, 255, 0.04);
  color: #f5f5f4;
  text-decoration: none;
  border: 1.5px solid rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 13.5px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  min-height: 48px;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: #1c4fd6;
  color: #5b8bf0;
}

/* ===== Responsive ===== */
@media (max-width: 480px) {
  .top-bar { padding: 16px 16px 4px; }
  .login-container { padding: 8px 12px 40px; align-items: flex-start; }
  .login-card { padding: 28px 20px; border-radius: 20px; }
  .card-header { margin-bottom: 22px; }
  .title { font-size: 1.7rem; }
  .subtitle { font-size: 13px; }
  .login-form { gap: 16px; }
}

@media (max-width: 360px) {
  .role-badges { gap: 5px; }
  .role-badge { padding: 5px 8px; font-size: 9.5px; }
  input { font-size: 13.5px; padding: 13px 42px 13px 14px; }
}
</style>