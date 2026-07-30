<template>
  <div class="recovery-page">
    <div class="glow"></div>

    <header class="top-bar">
      <router-link :to="{ name: 'home' }" class="top-brand">
        <Logo />
        <span class="logo-text">
          <span class="text-accent">SAHWA</span>
        </span>
      </router-link>
    </header>

    <main class="recovery-container">
      <div class="recovery-card">
        <div class="card-header">
          <h1 class="title">RECUPERAR <span class="highlight-text">ACCESO</span></h1>
          <p class="subtitle">Ingresa tus datos para verificar tu identidad</p>
        </div>

        <form @submit.prevent="handleRecovery" class="recovery-form">
          <div class="input-group">
            <label for="email">Correo electrónico</label>
            <div class="input-wrapper">
              <input 
                id="email"
                type="email" 
                placeholder="correo@ejemplo.com" 
                v-model="email" 
                required 
              />
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
          </div>

          <div class="input-group">
            <label for="birthDate">Fecha de Nacimiento</label>
            <div class="input-wrapper" @click="showDatePicker">
              <input 
                id="birthDate"
                type="date" 
                ref="dateInput"
                v-model="birthDate"
                class="date-input-with-icon"
                required 
              />
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
          </div>

          <button type="submit" class="btn-primary">
            Mandar instrucciones
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>

          <div class="divider"><span>O TAMBIÉN</span></div>

          <router-link :to="{ name: 'login' }" class="btn-secondary">
            Inicia Sesión
          </router-link>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Logo from '@/landing/logo.vue';

const email = ref('');
const birthDate = ref('');
const dateInput = ref<HTMLInputElement | null>(null);

const showDatePicker = () => {
  if (dateInput.value) {
    dateInput.value.showPicker();
  }
};

const handleRecovery = () => {
  console.log('Recovery:', email.value, birthDate.value);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=Oswald:wght@400;700&display=swap');

.recovery-page {
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

.top-bar { width: 100%; max-width: 1400px; margin: 0 auto; padding: 24px clamp(20px, 4vw, 60px); box-sizing: border-box; }
.top-brand { display: inline-flex; align-items: center; gap: 12px; text-decoration: none; }

.logo-text {
  font-family: 'Anton', sans-serif;
  font-size: clamp(20px, 5vw, 24px);
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
.hamburger.is-active span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}
.hamburger.is-active span:nth-child(2) {
  opacity: 0;
}
.hamburger.is-active span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

.recovery-container { flex: 1; display: flex; align-items: center; justify-content: center; padding: 24px 16px 60px; }
.recovery-card {
  width: 100%;
  max-width: 440px;
  background: rgba(18, 18, 18, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 24px;
  padding: clamp(32px, 5vw, 50px);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.55);
  animation: fadeUp 0.6s ease both;
}

.card-header { text-align: center; margin-bottom: 32px; }
.title { font-family: 'Anton', sans-serif; font-size: clamp(1.9rem, 5vw, 2.6rem); letter-spacing: -1px; text-transform: uppercase; margin: 0 0 8px; }
.highlight-text { color: #1c4fd6; }
.subtitle { font-size: 14px; color: rgba(245, 245, 244, 0.55); margin: 0; }

.recovery-form { display: flex; flex-direction: column; gap: 22px; }
.input-group { display: flex; flex-direction: column; gap: 8px; }
label { font-family: 'Oswald', sans-serif; font-size: 12.5px; font-weight: 700; color: #f5f5f4; }

.input-wrapper { position: relative; }

input {
  width: 100%;
  padding: 14px 16px; 
  background: #141414;
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  color: #f5f5f4;
  font-size: 14.5px;
  min-height: 48px;
  transition: border-color 0.2s ease;
}


#email {
  padding-right: 46px; 
}


#birthDate {
  padding-right: 46px;
}


input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0;
  cursor: pointer;
}

input:focus { border-color: #1c4fd6; box-shadow: 0 0 0 4px rgba(28, 79, 214, 0.25); outline: none; }
.input-icon { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); width: 18px; color: rgba(245, 245, 244, 0.35); pointer-events: none; }

.btn-primary {
  width: 100%; padding: 16px; background: #1c4fd6; color: #ffffff; border: none; border-radius: 12px;
  font-family: 'Oswald', sans-serif; font-weight: 700; text-transform: uppercase; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 9px; min-height: 52px;
  transition: all 0.25s ease;
}
.btn-primary:hover { background: #123ba0; transform: translateY(-2px); }

.divider { position: relative; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1); margin-top: 4px; }
.divider span { position: relative; top: -10px; background: #121212; padding: 2px 14px; font-family: 'Oswald', sans-serif; font-size: 11.5px; color: rgba(245, 245, 244, 0.5); }

.btn-secondary {
  display: flex; align-items: center; justify-content: center; width: 100%; padding: 14px;
  background: rgba(255, 255, 255, 0.04); color: #f5f5f4; text-decoration: none;
  border: 1.5px solid rgba(255, 255, 255, 0.14); border-radius: 12px; font-family: 'Oswald', sans-serif;
  text-transform: uppercase; min-height: 48px; transition: all 0.2s ease;
}
.btn-secondary:hover { border-color: #1c4fd6; color: #5b8bf0; }
</style>