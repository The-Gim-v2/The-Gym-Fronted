<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import Logo from '@/landing/logo.vue';

const VALID_USERS:Record<string,{role:string;nameRoute:string}>={
  'admin@gmail.com':{role:'Admin',nameRoute:'Admin-dashboard'},
  'gym@gmail.com':{role:'GYM_ACCOUNT',nameRoute:'GYM_ACCOUNT-dashboard'},
  'recepcionista@gmail.com':{role:'GYM_RECEPCIONIST',nameRoute:'GYM_RECEPCIONIST-dashboard'},
  'miembro@gmail.com':{role:'Member',nameRoute:'Member-dashboard'},
  'propietario@gmail.com':{role:'GYM_ADMIN',nameRoute:'GYM_ADMIN-dashboard'},
  'gerente@gmail.com':{role:'GYM_MANAGER',nameRoute:'GYM_MANAGER-dashboard'}
};

const router=useRouter();
const email=ref('');
const password=ref('');
const showPassword=ref(false);
const errorMessage=ref('');
const successMessage=ref('');

const clearMessages=()=>{errorMessage.value='';successMessage.value=''};

const handleSubmit=()=>{
  const userEmail=email.value.toLowerCase().trim();
  const userInfo=VALID_USERS[userEmail];

  if(password.value!=='123'){
    errorMessage.value='Contraseña incorrecta. Intenta de nuevo.';
    return;
  }

  if(!userInfo){
    errorMessage.value='Usuario no reconocido o sin privilegios de acceso.';
    return;
  }

  errorMessage.value='';
  successMessage.value=`Acceso concedido como ${userInfo.role}. Redirigiendo...`;
  localStorage.setItem('user_role',userInfo.role);

  setTimeout(()=>{
    router.push({name:userInfo.nameRoute});
  },1000);
};
</script>

<template>
  <div class="login-page">
    <div class="background-glow glow-one"></div>
    <div class="background-glow glow-two"></div>

    <!-- ENCABEZADO -->
    <header class="topbar">
      <router-link :to="{name:'home'}" class="brand" aria-label="SAHWA - Inicio">
        <div class="brand-logo"><Logo/></div>
        <span>SAHWA</span>
      </router-link>

      <router-link :to="{name:'home'}" class="back-link" aria-label="Volver al inicio">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m14.5 17-5-5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Volver al inicio</span>
      </router-link>
    </header>

    <main class="login-main">
      <div class="login-layout">

        <!-- PANEL IZQUIERDO -->
        <section class="welcome-panel">
          <div class="welcome-content">
            <span class="eyebrow">PLATAFORMA SAHWA</span>

            <h1>
              Todo tu gimnasio
              <span>en un solo lugar.</span>
            </h1>

            <p class="welcome-description">
              Accede a las herramientas y funciones disponibles para tu cuenta desde una plataforma centralizada, rápida y segura.
            </p>

            <div class="features">
              <div class="feature">
                <div class="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 3 4.5 7v5c0 4.4 2.9 7.6 7.5 9 4.6-1.4 7.5-4.6 7.5-9V7L12 3Z"
                      stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
                    <path d="m9 12 2 2 4-4"
                      stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>

                <div>
                  <strong>Acceso personalizado</strong>
                  <span>Visualiza las funciones disponibles según tu cuenta.</span>
                </div>
              </div>

              <div class="feature">
                <div class="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="9" cy="8" r="3.2"
                      stroke="currentColor" stroke-width="1.7"/>
                    <path d="M3.5 19c.4-3.4 2.4-5.3 5.5-5.3s5.1 1.9 5.5 5.3M16 8.5c2.6.1 4 1.6 4.4 4M16.3 14c2.5.3 3.8 1.8 4.2 4.2"
                      stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                  </svg>
                </div>

                <div>
                  <strong>Una plataforma para todos</strong>
                  <span>Centraliza la experiencia de usuarios, miembros y equipo.</span>
                </div>
              </div>

              <div class="feature">
                <div class="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12.5 9.5 17 19 7.5"
                      stroke="currentColor" stroke-width="1.7"
                      stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="12" r="9"
                      stroke="currentColor" stroke-width="1.7"/>
                  </svg>
                </div>

                <div>
                  <strong>Información a tu alcance</strong>
                  <span>Consulta rápidamente las herramientas que necesitas.</span>
                </div>
              </div>
            </div>
          </div>

          <div class="welcome-footer">
            <span class="status-dot"></span>
            <span>Sistema disponible</span>
          </div>
        </section>
        <!-- PANEL LOGIN -->
        <section class="login-panel">
          <div class="form-container">

            <div class="form-header">
              <span class="form-eyebrow">BIENVENIDO</span>
              <h2>Inicia <span>sesión</span></h2>
              <p>Ingresa tus credenciales para acceder a tu cuenta.</p>
            </div>

            <form class="login-form" @submit.prevent="handleSubmit">

              <!-- CORREO -->
              <div class="input-group">
                <label for="email">Correo electrónico</label>

                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" stroke-width="1.7"/>
                    <path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>

                  <input
                    id="email"
                    v-model="email"
                    type="email"
                    autocomplete="email"
                    placeholder="correo@ejemplo.com"
                    required
                    @input="clearMessages"
                  >
                </div>
              </div>

              <!-- CONTRASEÑA -->
              <div class="input-group">
                <div class="label-row">
                  <label for="password">Contraseña</label>

                  <router-link :to="{name:'recover-password'}" class="forgot-link">
                    ¿Olvidaste tu contraseña?
                  </router-link>
                </div>

                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="5" y="10" width="14" height="10" rx="2.5" stroke="currentColor" stroke-width="1.7"/>
                    <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                  </svg>

                  <input
                    id="password"
                    v-model="password"
                    :type="showPassword?'text':'password'"
                    autocomplete="current-password"
                    placeholder="Ingresa tu contraseña"
                    required
                    @input="clearMessages"
                  >

                  <button
                    type="button"
                    class="password-toggle"
                    :aria-label="showPassword?'Ocultar contraseña':'Mostrar contraseña'"
                    @click="showPassword=!showPassword"
                  >
                    <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" stroke-width="1.7"/>
                      <circle cx="12" cy="12" r="2.7" stroke="currentColor" stroke-width="1.7"/>
                    </svg>

                    <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M3 3l18 18M10.6 6.15A9.7 9.7 0 0 1 12 6c6 0 9.5 6 9.5 6a14.7 14.7 0 0 1-2.3 2.9M6.2 6.2C3.9 7.8 2.5 12 2.5 12s3.5 6 9.5 6a10 10 0 0 0 3.1-.5M9.9 9.9a3 3 0 0 0 4.2 4.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- ERROR -->
              <div v-if="errorMessage" class="alert alert-error" role="alert">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/>
                  <path d="M12 7.8v5.4M12 16.5h.01" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
                </svg>
                <span>{{errorMessage}}</span>
              </div>

              <!-- ÉXITO -->
              <div v-if="successMessage" class="alert alert-success" role="status">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/>
                  <path d="m8 12 2.6 2.6 5.4-5.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{{successMessage}}</span>
              </div>

              <!-- BOTÓN -->
              <button type="submit" class="login-button">
                <span>Iniciar sesión</span>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>

              <!-- REGISTRO -->
              <div class="register">
                <span>¿No tienes una cuenta?</span>
                <router-link to="/Record">Crear cuenta</router-link>
              </div>
            </form>

            <div class="form-footer">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="5" y="10" width="14" height="10" rx="2.5" stroke="currentColor" stroke-width="1.6"/>
                <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" stroke="currentColor" stroke-width="1.6"/>
              </svg>
              <span>Acceso seguro</span>
            </div>

          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

*{box-sizing:border-box}

.login-page{
  --bg:#09090a;
  --surface:#111112;
  --surface-2:#0e0e0f;
  --field:#151516;
  --line:rgba(255,255,255,.08);
  --line-strong:rgba(255,255,255,.14);
  --text:#f3f5f9;
  --text-2:#a8a8ac;
  --text-3:#78787d;
  --accent:#4f7cff;
  --accent-soft:#8fadff;
  --accent-deep:#2f5ee8;
  --danger:#f08a8a;
  --ok:#7fd8a3;

  width:100%;
  min-height:100dvh;
  position:relative;
  display:flex;
  flex-direction:column;
  overflow:hidden;
  background:var(--bg);
  color:var(--text);
  font-family:'Inter',system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  -webkit-font-smoothing:antialiased;
}

.login-page:before{
  content:"";
  position:absolute;
  inset:0;
  pointer-events:none;
  background:
    linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);
  background-size:56px 56px;
  mask-image:radial-gradient(ellipse 70% 60% at 50% 35%,#000,transparent 80%);
  -webkit-mask-image:radial-gradient(ellipse 70% 60% at 50% 35%,#000,transparent 80%);
}

.background-glow{
  position:absolute;
  border-radius:50%;
  pointer-events:none;
}

.glow-one{
  width:760px;
  height:760px;
  top:-460px;
  left:50%;
  transform:translateX(-50%);
  background:radial-gradient(circle,rgba(66,112,240,.26),transparent 66%);
}

.glow-two{
  width:560px;
  height:560px;
  right:-300px;
  bottom:-320px;
  background:radial-gradient(circle,rgba(47,94,232,.12),transparent 70%);
}

/* HEADER */

.topbar{
  width:100%;
  max-width:1500px;
  height:84px;
  margin:0 auto;
  padding:0 clamp(24px,5vw,76px);
  position:relative;
  z-index:5;
  display:flex;
  align-items:center;
  justify-content:space-between;
}

.brand{
  display:flex;
  align-items:center;
  gap:11px;
  color:#fff;
  text-decoration:none;
  border-radius:8px;
}

.brand-logo{
  display:flex;
  align-items:center;
  justify-content:center;
}

.brand span{
  color:var(--text);
  font-size:18px;
  font-weight:800;
  letter-spacing:1.6px;
}

.back-link{
  display:flex;
  align-items:center;
  gap:6px;
  padding:9px 14px 9px 10px;
  border:1px solid var(--line);
  border-radius:999px;
  background:rgba(255,255,255,.02);
  color:var(--text-2);
  font-size:13px;
  font-weight:600;
  text-decoration:none;
  transition:color .2s,border-color .2s,background .2s;
}

.back-link svg{
  width:17px;
  height:17px;
  transition:transform .2s;
}

.back-link:hover{
  color:var(--text);
  border-color:var(--line-strong);
  background:rgba(255,255,255,.05);
}

.back-link:hover svg{
  transform:translateX(-2px);
}

.brand:focus-visible,
.back-link:focus-visible,
.forgot-link:focus-visible,
.register a:focus-visible,
.login-button:focus-visible,
.password-toggle:focus-visible{
  outline:2px solid var(--accent-soft);
  outline-offset:3px;
}

/* CONTENEDOR */

.login-main{
  flex:1;
  min-height:0;
  position:relative;
  z-index:2;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:24px clamp(30px,6vw,90px) 72px;
}

.login-layout{
  width:100%;
  max-width:1160px;
  min-height:610px;
  display:grid;
  grid-template-columns:minmax(0,1.05fr) minmax(420px,.95fr);
  overflow:hidden;
  border:1px solid var(--line);
  border-radius:28px;
  background:linear-gradient(145deg,rgba(19,19,20,.94),rgba(12,12,13,.96));
  box-shadow:
    0 0 0 1px rgba(255,255,255,.02) inset,
    0 40px 110px rgba(0,0,0,.55);
}

/* PANEL IZQUIERDO */

.welcome-panel{
  position:relative;
  overflow:hidden;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  padding:60px 62px 38px;
  border-right:1px solid var(--line);
  background:
    radial-gradient(circle at 12% 8%,rgba(60,106,240,.09),transparent 40%),
    linear-gradient(150deg,#151516 0%,#101011 58%,#0b0b0c 100%);
}

.welcome-panel:before,
.welcome-panel:after{
  content:"";
  position:absolute;
  border:1px solid rgba(110,150,255,.12);
  border-radius:50%;
  pointer-events:none;
}

.welcome-panel:before{
  width:380px;
  height:380px;
  right:-170px;
  bottom:-190px;
}

.welcome-panel:after{
  width:250px;
  height:250px;
  right:-110px;
  bottom:-125px;
  border-color:rgba(110,150,255,.16);
}

.welcome-content{
  max-width:500px;
  position:relative;
  z-index:2;
}

.eyebrow{
  display:inline-flex;
  align-items:center;
  gap:9px;
  margin-bottom:22px;
  padding:7px 13px 7px 11px;
  border:1px solid rgba(110,150,255,.28);
  border-radius:999px;
  background:rgba(79,124,255,.09);
  color:var(--accent-soft);
  font-size:11px;
  font-weight:700;
  letter-spacing:1.2px;
}

.eyebrow:before{
  content:"";
  width:6px;
  height:6px;
  border-radius:50%;
  background:var(--accent-soft);
  box-shadow:0 0 0 3px rgba(143,173,255,.18);
}

.welcome-content h1{
  max-width:500px;
  margin:0;
  color:var(--text);
  font-size:clamp(38px,3.5vw,52px);
  line-height:1.05;
  font-weight:750;
  letter-spacing:-2px;
}

.welcome-content h1 span{
  display:block;
  background:linear-gradient(90deg,#7ea1ff,#4f7cff);
  -webkit-background-clip:text;
  background-clip:text;
  -webkit-text-fill-color:transparent;
  color:var(--accent);
}

.welcome-description{
  max-width:450px;
  margin:22px 0 0;
  color:var(--text-2);
  font-size:15px;
  line-height:1.65;
}

/* CARACTERÍSTICAS */

.features{
  display:flex;
  flex-direction:column;
  gap:12px;
  margin-top:38px;
}

.feature{
  display:flex;
  align-items:center;
  gap:15px;
  padding:13px 15px;
  border:1px solid rgba(110,150,255,.12);
  border-radius:14px;
  background:rgba(255,255,255,.025);
  transition:border-color .2s,background .2s;
}

.feature:hover{
  border-color:rgba(110,150,255,.28);
  background:rgba(79,124,255,.06);
}

.feature-icon{
  width:42px;
  height:42px;
  flex:0 0 42px;
  display:grid;
  place-items:center;
  border:1px solid rgba(110,150,255,.3);
  border-radius:11px;
  background:rgba(79,124,255,.12);
  color:var(--accent-soft);
}

.feature-icon svg{
  width:20px;
  height:20px;
}

.feature>div:last-child{
  min-width:0;
  display:flex;
  flex-direction:column;
  gap:3px;
}

.feature strong{
  color:var(--text);
  font-size:14.5px;
  font-weight:650;
}

.feature span{
  color:var(--text-3);
  font-size:13px;
  line-height:1.45;
}

.welcome-footer{
  position:relative;
  z-index:2;
  display:flex;
  align-items:center;
  gap:9px;
  margin-top:32px;
  color:var(--text-3);
  font-size:12.5px;
}

.status-dot{
  width:7px;
  height:7px;
  border-radius:50%;
  background:#49b879;
  box-shadow:0 0 0 3px rgba(73,184,121,.18);
}

/* PANEL LOGIN */

.login-panel{
  min-width:0;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:56px 58px;
  background:var(--surface-2);
}

.form-container{
  width:100%;
  max-width:390px;
}

.form-header{
  margin-bottom:32px;
}

.form-eyebrow{
  display:block;
  margin-bottom:10px;
  color:var(--accent-soft);
  font-size:11px;
  font-weight:700;
  letter-spacing:1.3px;
}

.form-header h2{
  margin:0 0 10px;
  color:var(--text);
  font-size:32px;
  line-height:1.12;
  font-weight:750;
  letter-spacing:-1px;
}

.form-header h2 span{
  color:var(--accent);
}

.form-header p{
  margin:0;
  color:var(--text-2);
  font-size:14px;
  line-height:1.55;
}

.login-form{
  display:flex;
  flex-direction:column;
  gap:20px;
}

.input-group{
  display:flex;
  flex-direction:column;
  gap:9px;
}

.label-row{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
}

label{
  color:#d3d7de;
  font-size:13px;
  font-weight:600;
}

.forgot-link{
  color:var(--accent-soft);
  font-size:12.5px;
  font-weight:600;
  text-decoration:none;
  border-radius:4px;
}

.forgot-link:hover{
  color:#b9ccff;
  text-decoration:underline;
  text-underline-offset:3px;
}

.input-wrapper{
  position:relative;
}

.input-icon{
  position:absolute;
  left:16px;
  top:50%;
  width:18px;
  height:18px;
  transform:translateY(-50%);
  color:var(--text-3);
  pointer-events:none;
  transition:color .2s;
}

.input-wrapper input{
  width:100%;
  height:54px;
  padding:0 50px 0 46px;
  border:1px solid var(--line-strong);
  border-radius:12px;
  outline:0;
  background:var(--field);
  color:var(--text);
  font-family:inherit;
  font-size:14.5px;
  font-weight:500;
  transition:border-color .2s,background .2s,box-shadow .2s;
}

.input-wrapper input::placeholder{
  color:#636368;
}

.input-wrapper input:hover{
  border-color:rgba(255,255,255,.24);
}

.input-wrapper input:focus{
  border-color:var(--accent);
  background:#18181a;
  box-shadow:0 0 0 4px rgba(79,124,255,.16);
}

.input-wrapper:focus-within .input-icon{
  color:var(--accent-soft);
}

.input-wrapper input:-webkit-autofill,
.input-wrapper input:-webkit-autofill:hover,
.input-wrapper input:-webkit-autofill:focus{
  -webkit-text-fill-color:var(--text);
  -webkit-box-shadow:0 0 0 1000px var(--field) inset;
  caret-color:#fff;
}

.password-toggle{
  position:absolute;
  top:6px;
  right:6px;
  width:42px;
  height:42px;
  display:grid;
  place-items:center;
  padding:0;
  border:0;
  border-radius:9px;
  background:transparent;
  color:var(--text-3);
  cursor:pointer;
  transition:background .2s,color .2s;
}

.password-toggle:hover{
  background:rgba(255,255,255,.06);
  color:#d3d7de;
}

.password-toggle svg{
  width:19px;
  height:19px;
}

/* MENSAJES */

.alert{
  display:flex;
  align-items:flex-start;
  gap:10px;
  padding:13px 14px;
  border-radius:12px;
  font-size:13px;
  font-weight:500;
  line-height:1.45;
}

.alert svg{
  width:18px;
  height:18px;
  flex:0 0 18px;
}

.alert-error{
  border:1px solid rgba(240,110,110,.34);
  background:rgba(200,60,60,.1);
  color:var(--danger);
}

.alert-success{
  border:1px solid rgba(80,190,125,.32);
  background:rgba(50,150,90,.1);
  color:var(--ok);
}

/* BOTÓN */

.login-button{
  width:100%;
  height:54px;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:9px;
  margin-top:4px;
  border:0;
  border-radius:12px;
  background:#1c4fd6;
  color:#fff;
  font-family:inherit;
  font-size:14.5px;
  font-weight:700;
  cursor:pointer;
  box-shadow:0 8px 22px rgba(28,79,214,.25);
  transition:background .2s,transform .2s,box-shadow .2s;
}

.login-button svg{
  width:18px;
  height:18px;
  transition:transform .2s;
}

.login-button:hover{
  background:#2459df;
  transform:translateY(-1px);
  box-shadow:0 12px 28px rgba(28,79,214,.34);
}

.login-button:hover svg{
  transform:translateX(3px);
}

.login-button:active{
  transform:none;
  background:#1a47c2;
}

.register{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  color:var(--text-3);
  font-size:13px;
}

.register a{
  color:var(--accent-soft);
  font-weight:650;
  text-decoration:none;
  border-radius:4px;
}

.register a:hover{
  color:#b9ccff;
  text-decoration:underline;
  text-underline-offset:3px;
}

.form-footer{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  margin-top:30px;
  padding-top:20px;
  border-top:1px solid var(--line);
  color:var(--text-3);
  font-size:12px;
}

.form-footer svg{
  width:15px;
  height:15px;
}

@media(prefers-reduced-motion:reduce){
  *,*:before,*:after{
    transition:none!important;
    animation-duration:.01ms!important;
  }
}

/* TABLET */

@media(max-width:1000px){
  .login-main{
    padding-left:25px;
    padding-right:25px;
  }

  .login-layout{
    max-width:900px;
    grid-template-columns:minmax(0,.95fr) minmax(390px,1.05fr);
  }

  .welcome-panel{
    padding:48px 38px 34px;
  }

  .welcome-content h1{
    font-size:37px;
  }

  .welcome-description{
    font-size:14px;
  }

  .login-panel{
    padding:48px 40px;
  }
}

/* MÓVIL */

@media(max-width:760px){
  .login-page{
    min-height:100dvh;
    overflow-x:hidden;
    overflow-y:auto;
  }

  .login-page:before{
    background-size:44px 44px;
  }

  .glow-one{
    width:520px;
    height:520px;
    top:-340px;
  }

  .glow-two{
    display:none;
  }

  .topbar{
    width:100%;
    height:68px;
    padding:0 17px;
  }

  .brand{
    gap:9px;
  }

  .brand span{
    font-size:16px;
    letter-spacing:1.4px;
  }

  .back-link{
    width:40px;
    height:40px;
    margin-left:auto;
    justify-content:center;
    padding:0;
    border-radius:12px;
    background:var(--surface);
  }

  .back-link span{
    display:none;
  }

  .back-link svg{
    width:19px;
    height:19px;
  }

  .login-main{
    flex:1;
    width:100%;
    min-height:calc(100dvh - 68px);
    align-items:center;
    padding:14px 15px 36px;
  }

  .login-layout{
    width:100%;
    max-width:440px;
    min-height:0;
    display:block;
    overflow:visible;
    border:0;
    border-radius:0;
    background:transparent;
    box-shadow:none;
  }

  .welcome-panel{
    display:none;
  }

  .login-panel{
    width:100%;
    display:block;
    padding:0;
    background:transparent;
  }

  .form-container{
    width:100%;
    max-width:none;
    padding:32px 24px 26px;
    border:1px solid var(--line);
    border-radius:20px;
    background:var(--surface-2);
    box-shadow:0 24px 60px rgba(0,0,0,.4);
  }

  .form-header{
    margin-bottom:28px;
  }

  .form-header h2{
    font-size:29px;
  }

  .login-form{
    gap:19px;
  }

  .input-wrapper input{
    height:54px;
    font-size:16px; /* evita el zoom automático en iOS */
  }

  .login-button{
    height:54px;
    font-size:15px;
  }

  .form-footer{
    margin-top:26px;
    padding-top:18px;
  }
}

/* TELÉFONOS */

@media(max-width:480px){
  .topbar{
    height:62px;
    padding:0 14px;
  }

  .brand span{
    font-size:15px;
  }

  .back-link{
    width:38px;
    height:38px;
    border-radius:11px;
  }

  .login-main{
    min-height:calc(100dvh - 62px);
    align-items:flex-start;
    padding:14px 11px 26px;
  }

  .login-layout{
    max-width:none;
  }

  .form-container{
    padding:28px 20px 24px;
    border-radius:18px;
  }

  .form-header{
    margin-bottom:26px;
  }

  .form-header h2{
    font-size:27px;
  }

  .label-row{
    gap:8px;
  }

  .input-wrapper input{
    padding-left:44px;
  }

  .register{
    flex-wrap:wrap;
  }
}

/* MÓVILES PEQUEÑOS */

@media(max-width:360px){
  .topbar{
    padding:0 10px;
  }

  .login-main{
    padding-left:8px;
    padding-right:8px;
  }

  .form-container{
    padding:24px 16px 21px;
  }

  .form-header h2{
    font-size:24px;
  }

  .label-row{
    align-items:flex-start;
    flex-direction:column;
    gap:5px;
  }

  .forgot-link{
    align-self:flex-end;
  }
}

/* PANTALLAS DE POCA ALTURA */

@media(max-height:720px) and (min-width:761px){
  .topbar{
    height:66px;
  }

  .login-main{
    padding-top:14px;
    padding-bottom:30px;
  }

  .login-layout{
    min-height:540px;
  }

  .welcome-panel{
    padding-top:40px;
    padding-bottom:30px;
  }

  .features{
    margin-top:26px;
    gap:9px;
  }

  .feature{
    padding:10px 13px;
  }

  .login-panel{
    padding-top:36px;
    padding-bottom:36px;
  }
}
</style>