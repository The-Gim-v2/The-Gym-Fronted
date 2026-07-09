<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Logo from '@/landing/logo.vue';

const VALID_USERS: Record<string, string> = {
  'admin@gmail.com': 'Administrador',
  'dueño@gmail.com': 'Dueño',
  'recepcionista@gmail.com': 'Recepcionista',
  'cliente@gmail.com': 'Cliente',
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
  const role = VALID_USERS[userEmail];

  if (password.value !== '123') {
    errorMessage.value = 'Contraseña incorrecta. Intenta de nuevo.';
    successMessage.value = '';
    return;
  }
  if (!role) {
    errorMessage.value = 'Usuario no reconocido.';
    successMessage.value = '';
    return;
  }

  errorMessage.value = '';
  successMessage.value = `Acceso concedido como ${role}. Redirigiendo...`;

  if (userEmail === 'admin@gmail.com') {
    router.push({ name: 'admin-dashboard' });
  }
};
</script>

<template>
  <div class="login-page">
    <div class="glow"></div>

    <header class="top-bar">
      <router-link :to="{ name: 'home' }" class="top-brand">
        <Logo />
        <span class="logo-text-sm">FitManage Pro</span>
      </router-link>
    </header>

    <main class="login-container">
      <div class="login-card">
        <div class="card-header">
          <h1 class="title">INICIA <span class="highlight-text">SESIÓN</span></h1>
          <p class="subtitle">Gestiona tu gimnasio de forma inteligente</p>
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

          <router-link to="/Record" class="btn-secondary">Registrar tu gimnasio</router-link>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
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

@keyframes pulseGlow { 0%, 100% { opacity: 0.28; } 50% { opacity: 0.5; } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
@keyframes shake {
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(2px); }
  30%, 50%, 70% { transform: translateX(-4px); }
  40%, 60% { transform: translateX(4px); }
}

.top-bar {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px clamp(20px, 4vw, 60px);
  box-sizing: border-box;
  position: relative;
}

.top-brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.logo-text-sm {
  font-family: 'Anton', sans-serif;
  font-size: 18px;
  letter-spacing: 0.3px;
  color: #f5f5f4;
}

.login-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px 60px;
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
  padding: clamp(32px, 5vw, 50px);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.55);
  box-sizing: border-box;
  animation: fadeUp 0.6s ease both;
}

.card-header { text-align: center; margin-bottom: 32px; }

.title {
  font-family: 'Anton', sans-serif;
  font-size: clamp(1.9rem, 5vw, 2.6rem);
  letter-spacing: -1px;
  text-transform: uppercase;
  margin: 0 0 8px;
  color: #f5f5f4;
}

.highlight-text { color: #3a6bd6; }

.subtitle { font-size: 14px; color: rgba(245, 245, 244, 0.55); margin: 0; }

.login-form { display: flex; flex-direction: column; gap: 22px; }

.input-group { display: flex; flex-direction: column; gap: 8px; }

.label-row { display: flex; justify-content: space-between; align-items: center; }

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

.divider {
  position: relative;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 4px;
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

@media (max-width: 480px) {
  .login-card { padding: 35px 25px; }
  .title { font-size: 2.2rem; }
}
</style>
