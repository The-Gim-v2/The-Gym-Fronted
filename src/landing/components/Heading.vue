<script setup lang="ts">
import { ref } from 'vue';
import Logo from '../logo.vue';

const isMenuOpen = ref(false);

const NAV_LINKS = [
  { id: 'sobre-nosotros', label: 'Sobre nosotros' },
  { id: 'beneficios', label: 'Beneficios' },
  { id: 'resultados', label: 'Resultados' },
  { id: 'experiencia-app', label: 'App' },
  { id: 'mensualidades', label: 'Precios' },
];

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
  isMenuOpen.value = false;
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
  <header class="nav-wrapper">
    <div class="nav-container">
      <div class="logo-section" @click="scrollToSection('sobre-nosotros')">
        <Logo />
        <span class="logo-text">
          <span class="text-accent">SAHWA</span>
        </span>
      </div>

      <nav class="desktop-links">
        <button v-for="link in NAV_LINKS" :key="link.id" @click="scrollToSection(link.id)" class="nav-link">
          {{ link.label }}
        </button>
      </nav>

      <div class="auth-actions">
        <router-link to="/login" class="login-link">Iniciar sesión</router-link>
        <router-link to="/Record" class="register-btn">Registrar Gimnasio</router-link>
      </div>

      <button class="mobile-toggle" aria-label="Abrir menú" @click="toggleMenu">
        <div :class="['hamburger', { 'is-active': isMenuOpen }]">
          <span></span><span></span><span></span>
        </div>
      </button>
    </div>

    <Transition name="slide">
      <div v-if="isMenuOpen" class="mobile-menu">
        <button v-for="link in NAV_LINKS" :key="link.id" @click="scrollToSection(link.id)" class="mobile-link">
          {{ link.label }}
        </button>
        <div class="mobile-auth">
          <router-link to="/login" class="mobile-login" @click="isMenuOpen = false">Iniciar sesión</router-link>
          <router-link to="/Record" class="mobile-register" @click="isMenuOpen = false">Registrar Gimnasio</router-link>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.nav-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(5, 5, 8, 0.92);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  z-index: 1000;
  font-family: 'Inter', sans-serif;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 14px clamp(16px, 4vw, 60px);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: clamp(8px, 2vw, 12px);
  cursor: pointer;
  /* Evita selección de texto molesta en móviles al tocar rápido */
  user-select: none; 
}

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

.desktop-links {
  display: flex;
  gap: 32px;
}

.nav-link {
  background: transparent;
  border: none;
  color: rgba(245, 245, 244, 0.65);
  font-family: 'Inter', sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.25s ease;
}

.nav-link:hover { color: #ffffff; }

.auth-actions {
  display: flex;
  align-items: center;
  gap: 22px;
}

.login-link {
  color: rgba(245, 245, 244, 0.8);
  font-family: 'Inter', sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  text-transform: uppercase;
  text-decoration: none;
  transition: color 0.25s ease;
}

.login-link:hover { color: #60a5fa; }

.register-btn {
  background: #1c4fd6;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-size: 13.5px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 11px 22px;
  border-radius: 12px;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(28, 79, 214, 0.3);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.register-btn:hover { 
  background: #1844c0; 
  transform: translateY(-2px); 
  box-shadow: 0 6px 20px rgba(28, 79, 214, 0.45);
}

.mobile-toggle {
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px; /* Mayor área táctil en dispositivos móviles */
}

.hamburger {
  width: 24px;
  height: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger span {
  display: block;
  width: 100%;
  height: 2px;
  background: #f5f5f4;
  transition: all 0.3s ease;
  border-radius: 2px;
}

/* Animación opcional de hamburguesa a X si está activo */
.hamburger.is-active span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}
.hamburger.is-active span:nth-child(2) {
  opacity: 0;
}
.hamburger.is-active span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: rgba(5, 5, 8, 0.98);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 20px 24px 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
}

.mobile-link {
  background: transparent;
  border: none;
  color: rgba(245, 245, 244, 0.8);
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 600;
  text-transform: uppercase;
  text-align: left;
  padding: 10px 0;
  cursor: pointer;
  transition: color 0.2s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.mobile-link:hover { color: #60a5fa; }

.mobile-auth {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 10px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.mobile-login, .mobile-register {
  text-align: center;
  padding: 14px;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  text-decoration: none;
}

.mobile-login { 
  background: rgba(255, 255, 255, 0.05); 
  color: #f5f5f4; 
  border: 1px solid rgba(255, 255, 255, 0.08); 
}

.mobile-register { 
  background: #1c4fd6; 
  color: #ffffff; 
  box-shadow: 0 4px 12px rgba(28, 79, 214, 0.3);
}

.slide-enter-active, .slide-leave-active { 
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); 
}
.slide-enter-from, .slide-leave-to { 
  opacity: 0; 
  transform: translateY(-10px); 
}

@media (max-width: 900px) {
  .desktop-links, .auth-actions { display: none; }
  .mobile-toggle { display: block; }
}
</style>