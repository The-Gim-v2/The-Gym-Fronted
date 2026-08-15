<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import HeadingMember from '../HeadingMember.vue';
import UpgradeMembershipModal from '../Modals/UpgradeMembershipModal.vue';

const router = useRouter();
const currentLang = ref(localStorage.getItem('member-idioma') || 'es');

/* -------------------------------------------------------------------- */
/* DATOS MOCK — sustituir por la respuesta real de tu API / backend.    */
/* La forma de cada entrenador refleja los campos capturados en el      */
/* formulario de registro de personal (RegistroPersonal.vue).          */
/* -------------------------------------------------------------------- */

// Sede a la que pertenece el socio (misma que registeredGym en GestionSedes)
const miSedeId = 1;

const entrenadoresMiSede = ref([
  {
    id: 101,
    nombres: 'Daniela',
    apellidoP: 'Reyes',
    apellidoM: 'Cortés',
    especialidad: 'Entrenamiento de Fuerza',
    foto: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=80',
    sedeId: 1,
    sedeNombre: 'IronFit Valles Centro',
    ciudad: 'Ciudad Valles',
    estado: 'San Luis Potosí',
    celular: '+52 481 100 2211',
    horaEntrada: '06:00',
    horaSalida: '14:00',
    aniosExperiencia: 6,
    redes: { instagram: '@dani.fuerza', tiktok: '@dani.fuerza' }
  },
  {
    id: 102,
    nombres: 'Marco',
    apellidoP: 'Villanueva',
    apellidoM: 'Ibarra',
    especialidad: 'Boxeo y Acondicionamiento',
    foto: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80',
    sedeId: 1,
    sedeNombre: 'IronFit Valles Centro',
    ciudad: 'Ciudad Valles',
    estado: 'San Luis Potosí',
    celular: '+52 481 100 3344',
    horaEntrada: '14:00',
    horaSalida: '21:00',
    aniosExperiencia: 4,
    redes: { instagram: '@marcobox_fit', facebook: 'MarcoBoxFit' }
  },
  {
    id: 103,
    nombres: 'Paola',
    apellidoP: 'Serrano',
    apellidoM: 'Munguía',
    especialidad: 'Yoga y Movilidad',
    foto: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80',
    sedeId: 1,
    sedeNombre: 'IronFit Valles Centro',
    ciudad: 'Ciudad Valles',
    estado: 'San Luis Potosí',
    celular: '+52 481 100 5566',
    horaEntrada: '07:00',
    horaSalida: '13:00',
    aniosExperiencia: 8,
    redes: { instagram: '@paola.yoga' }
  }
]);

const entrenadoresLocales = ref([
  {
    id: 104,
    nombres: 'Héctor',
    apellidoP: 'Domínguez',
    apellidoM: 'Ramos',
    especialidad: 'CrossFit',
    foto: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
    sedeId: 2,
    sedeNombre: 'IronFit Norte - Plaza San José',
    ciudad: 'Ciudad Valles',
    estado: 'San Luis Potosí',
    celular: '+52 481 200 1122',
    horaEntrada: '05:00',
    horaSalida: '12:00',
    aniosExperiencia: 5,
    redes: { instagram: '@hector.crossfit' }
  },
  {
    id: 105,
    nombres: 'Renata',
    apellidoP: 'Cabrera',
    apellidoM: 'Solís',
    especialidad: 'Spinning',
    foto: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=400&q=80',
    sedeId: 3,
    sedeNombre: 'IronFit Poniente',
    ciudad: 'Ciudad Valles',
    estado: 'San Luis Potosí',
    celular: '+52 481 300 7788',
    horaEntrada: '16:00',
    horaSalida: '20:00',
    aniosExperiencia: 3,
    redes: { tiktok: '@renata.spin', instagram: '@renata.spin' }
  },
  {
    id: 106,
    nombres: 'Iván',
    apellidoP: 'Torres',
    apellidoM: 'Guerra',
    especialidad: 'Nutrición Deportiva',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    sedeId: 6,
    sedeNombre: 'IronFit Sur - Plaza Tangamanga',
    ciudad: 'Ciudad Valles',
    estado: 'San Luis Potosí',
    celular: '+52 481 400 9900',
    horaEntrada: '09:00',
    horaSalida: '17:00',
    aniosExperiencia: 7,
    redes: { instagram: '@ivan.nutricion' }
  }
]);

const entrenadoresNacionales = ref([
  {
    id: 107,
    nombres: 'Fernanda',
    apellidoP: 'López',
    apellidoM: 'Aguilar',
    especialidad: 'Pilates Reformer',
    foto: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=400&q=80',
    sedeNombre: 'IronFit CDMX Polanco (Plus)',
    ciudad: 'Polanco',
    estado: 'Ciudad de México'
  },
  {
    id: 108,
    nombres: 'Rodrigo',
    apellidoP: 'Elizondo',
    apellidoM: 'Farías',
    especialidad: 'Halterofilia',
    foto: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
    sedeNombre: 'IronFit Monterrey San Pedro (Plus)',
    ciudad: 'San Pedro Garza García',
    estado: 'Nuevo León'
  },
  {
    id: 109,
    nombres: 'Ximena',
    apellidoP: 'Bravo',
    apellidoM: 'Delgado',
    especialidad: 'Funcional / HIIT',
    foto: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=80',
    sedeNombre: 'IronFit Guadalajara Andares (Plus)',
    ciudad: 'Zapopan',
    estado: 'Jalisco'
  },
  {
    id: 110,
    nombres: 'Álvaro',
    apellidoP: 'Nájera',
    apellidoM: 'Pineda',
    especialidad: 'Boxeo',
    foto: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80',
    sedeNombre: 'IronFit Querétaro Antea (Plus)',
    ciudad: 'Querétaro',
    estado: 'Querétaro'
  }
]);

const estadoAbrevMap = {
  'San Luis Potosí': 'SLP',
  'Ciudad de México': 'CDMX',
  'Nuevo León': 'NL',
  'Jalisco': 'JAL',
  'Querétaro': 'QRO'
};
const abreviarEstado = (estado) => estadoAbrevMap[estado] || estado;

const nombreCompleto = (t) => `${t.nombres} ${t.apellidoP}${t.apellidoM ? ' ' + t.apellidoM : ''}`;
const iniciales = (t) => `${t.nombres?.[0] || ''}${t.apellidoP?.[0] || ''}`.toUpperCase();

const entrenadoresNacionalesPorEstado = computed(() => {
  const groups = {};
  for (const ent of entrenadoresNacionales.value) {
    if (!groups[ent.estado]) groups[ent.estado] = [];
    groups[ent.estado].push(ent);
  }
  return groups;
});

const statesCount = computed(() => Object.keys(entrenadoresNacionalesPorEstado.value).length);
const totalLocal = computed(() => entrenadoresMiSede.value.length + entrenadoresLocales.value.length);

/* Buscador */
const searchQuery = ref('');
const normalize = (str) => (str || '').toString().toLowerCase();

const matchesQuery = (ent, q) =>
  normalize(nombreCompleto(ent)).includes(q) ||
  normalize(ent.especialidad).includes(q) ||
  normalize(ent.ciudad).includes(q) ||
  normalize(ent.estado).includes(q) ||
  normalize(ent.sedeNombre).includes(q);

const filteredMiSede = computed(() => {
  const q = normalize(searchQuery.value);
  if (!q) return entrenadoresMiSede.value;
  return entrenadoresMiSede.value.filter((e) => matchesQuery(e, q));
});

const filteredLocales = computed(() => {
  const q = normalize(searchQuery.value);
  if (!q) return entrenadoresLocales.value;
  return entrenadoresLocales.value.filter((e) => matchesQuery(e, q));
});

const filteredNacionalesPorEstado = computed(() => {
  const q = normalize(searchQuery.value);
  if (!q) return entrenadoresNacionalesPorEstado.value;
  const result = {};
  for (const [estado, ents] of Object.entries(entrenadoresNacionalesPorEstado.value)) {
    const matches = ents.filter((e) => matchesQuery(e, q));
    if (matches.length) result[estado] = matches;
  }
  return result;
});

const hasNoResults = computed(() => {
  if (!searchQuery.value.trim()) return false;
  return filteredMiSede.value.length === 0 &&
    filteredLocales.value.length === 0 &&
    Object.keys(filteredNacionalesPorEstado.value).length === 0;
});

const showMembershipModal = ref(false);
const openMembershipModal = () => { showMembershipModal.value = true; };
const closeMembershipModal = () => { showMembershipModal.value = false; };

const irADetalle = (id) => {
  router.push({ name: 'member-trainers-chat', params: { id } });
};

/* i18n */
const traducciones = {
  es: {
    pageTitle: 'Nuestros Entrenadores',
    pageDesc: 'Conoce al equipo que entrena contigo en tu sede, descubre entrenadores en otras sucursales de la ciudad, o desbloquea la red nacional con Plus.',
    statsLocalLabel: 'entrenadores cerca de ti',
    statsStatesLabel: 'estados con cobertura Plus',
    searchPlaceholder: 'Busca por nombre, especialidad o ciudad...',
    miSedeTitle: 'Entrenadores en tu Sede',
    localesTitle: 'Entrenadores en Ciudad Valles',
    nacionalesTitle: 'Red Nacional (Acceso Plus Requerido)',
    yearsExp: 'años de experiencia',
    scheduleLabel: 'Horario',
    lockTitle: 'Exclusivo Membresía Plus',
    lockDesc: 'Conoce entrenadores en cualquier ciudad del país al actualizar tu plan.',
    lockBtn: 'Ver Planes y Actualizar',
    noResultsTitle: 'No encontramos entrenadores con ese criterio',
    noResultsDesc: 'Intenta buscar por otra especialidad, ciudad o nombre.',
    yourGymBadge: 'Tu Sede'
  },
  en: {
    pageTitle: 'Our Trainers',
    pageDesc: 'Meet the team training with you at your gym, discover trainers at other branches in the city, or unlock the national network with Plus.',
    statsLocalLabel: 'trainers near you',
    statsStatesLabel: 'states with Plus coverage',
    searchPlaceholder: 'Search by name, specialty or city...',
    miSedeTitle: 'Trainers at Your Gym',
    localesTitle: 'Trainers in Ciudad Valles',
    nacionalesTitle: 'National Network (Plus Access Required)',
    yearsExp: 'years of experience',
    scheduleLabel: 'Schedule',
    lockTitle: 'Plus Membership Exclusive',
    lockDesc: 'Meet trainers in any city nationwide by upgrading your plan.',
    lockBtn: 'View Plans & Upgrade',
    noResultsTitle: "We couldn't find any trainers matching that",
    noResultsDesc: 'Try searching a different specialty, city, or name.',
    yourGymBadge: 'Your Gym'
  }
};

const t = (key) => {
  const langTable = traducciones[currentLang.value] || traducciones.es;
  return langTable[key] || traducciones.es[key] || key;
};

const handleLangChange = (e) => {
  if (e.detail && e.detail.idioma) currentLang.value = e.detail.idioma;
};

onMounted(() => window.addEventListener('idioma-changed', handleLangChange));
onUnmounted(() => window.removeEventListener('idioma-changed', handleLangChange));
</script>

<template>
  <HeadingMember>
    <div class="saas-dashboard-wrapper">
      <main class="dashboard-main-container">

        <!-- HEADER -->
        <div class="section-header-box">
          <div class="header-text-content">
            <h1 class="main-heading">{{ t('pageTitle') }}</h1>
            <p class="hero-desc">{{ t('pageDesc') }}</p>

            <div class="stats-strip">
              <div class="stat-chip">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                <span><strong>{{ totalLocal }}</strong> {{ t('statsLocalLabel') }}</span>
              </div>
              <div class="stat-chip">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                <span><strong>{{ statesCount }}</strong> {{ t('statsStatesLabel') }}</span>
              </div>
            </div>
          </div>

          <div class="gym-search-bar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" v-model="searchQuery" :placeholder="t('searchPlaceholder')" />
            <button v-if="searchQuery" type="button" class="btn-clear-search" @click="searchQuery = ''" aria-label="Limpiar búsqueda">&times;</button>
          </div>
        </div>

        <!-- SECCIÓN 1: MI SEDE -->
        <div class="category-section" v-if="filteredMiSede.length">
          <div class="category-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <h2>{{ t('miSedeTitle') }}</h2>
          </div>

          <div class="trainers-grid-container">
            <div
              v-for="ent in filteredMiSede"
              :key="ent.id"
              class="glass-card trainer-item-card"
              @click="irADetalle(ent.id)"
            >
              <span class="badge-pill your-gym-badge">{{ t('yourGymBadge') }}</span>
              <div class="trainer-photo-wrap">
                <img v-if="ent.foto" :src="ent.foto" :alt="nombreCompleto(ent)" />
                <span v-else class="trainer-initials">{{ iniciales(ent) }}</span>
              </div>
              <h3>{{ nombreCompleto(ent) }}</h3>
              <p class="trainer-specialty">{{ ent.especialidad }}</p>

              <p class="drawer-text-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>{{ t('scheduleLabel') }}: {{ ent.horaEntrada }} - {{ ent.horaSalida }}</span>
              </p>
              <p class="drawer-text-item" v-if="ent.aniosExperiencia">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10"></path><path d="M18 20V4"></path><path d="M6 20v-4"></path></svg>
                <span>{{ ent.aniosExperiencia }} {{ t('yearsExp') }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- SECCIÓN 2: OTRAS SEDES DE LA CIUDAD -->
        <div class="category-section" v-if="filteredLocales.length">
          <div class="category-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <h2>{{ t('localesTitle') }}</h2>
          </div>

          <div class="trainers-grid-container">
            <div
              v-for="ent in filteredLocales"
              :key="ent.id"
              class="glass-card trainer-item-card"
              @click="irADetalle(ent.id)"
            >
              <div class="trainer-photo-wrap">
                <img v-if="ent.foto" :src="ent.foto" :alt="nombreCompleto(ent)" />
                <span v-else class="trainer-initials">{{ iniciales(ent) }}</span>
              </div>
              <h3>{{ nombreCompleto(ent) }}</h3>
              <p class="trainer-specialty">{{ ent.especialidad }}</p>

              <p class="drawer-text-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                <span>{{ ent.sedeNombre }}</span>
              </p>
              <p class="drawer-text-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>{{ t('scheduleLabel') }}: {{ ent.horaEntrada }} - {{ ent.horaSalida }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- SECCIÓN 3: RED NACIONAL (BLOQUEADA) -->
        <div class="category-section">
          <div class="category-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            <h2>{{ t('nacionalesTitle') }}</h2>
          </div>

          <div v-for="(ents, estado) in filteredNacionalesPorEstado" :key="estado" class="state-subsection">
            <h3 class="state-subheading">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              {{ estado }}
              <span class="state-count-pill">{{ ents.length }}</span>
            </h3>

            <div class="trainers-grid-container">
              <div v-for="ent in ents" :key="ent.id" class="glass-card trainer-item-card locked-trainer-card">
                <div class="membership-lock-overlay">
                  <div class="lock-icon-badge">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                  <span class="lock-title">{{ t('lockTitle') }}</span>
                  <p class="lock-desc">{{ t('lockDesc') }}</p>
                  <button class="btn-unlock-action" @click.stop="openMembershipModal">{{ t('lockBtn') }}</button>
                </div>

                <div class="blurred-content">
                  <div class="trainer-photo-wrap">
                    <img :src="ent.foto" :alt="nombreCompleto(ent)" />
                  </div>
                  <h3>{{ nombreCompleto(ent) }}</h3>
                  <p class="trainer-specialty">{{ ent.especialidad }}</p>
                  <p class="drawer-text-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    <span>{{ ent.sedeNombre }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="hasNoResults" class="no-results-box">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <h3>{{ t('noResultsTitle') }}</h3>
          <p>{{ t('noResultsDesc') }}</p>
        </div>

      </main>

      <transition name="pop">
        <div v-if="showMembershipModal" class="modal-wrapper" @click.self="closeMembershipModal">
          <UpgradeMembershipModal @close="closeMembershipModal" />
        </div>
      </transition>
    </div>
  </HeadingMember>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;700&display=swap');

.saas-dashboard-wrapper {
  background: var(--bg-custom, var(--color-interfaz, #0a0a0c));
  min-height: calc(100vh - 65px);
  color: var(--color-texto-general, #f5f5f4);
  font-family: 'Inter', sans-serif;
}

.dashboard-main-container {
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.section-header-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 24px;
}

.header-text-content { flex: 1; min-width: 280px; }

.main-heading {
  font-family: 'Archivo Black', sans-serif;
  font-size: 2.2rem;
  margin: 0;
  color: var(--color-titulos, #ffffff);
  letter-spacing: -1px;
}

.hero-desc {
  font-size: 0.95rem;
  color: var(--color-texto-general, rgba(245, 245, 244, 0.6));
  margin: 8px 0 0 0;
  max-width: 600px;
}

.stats-strip { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }

.stat-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  padding: 7px 14px;
  font-size: 0.8rem;
  color: rgba(245, 245, 244, 0.75);
}
.stat-chip svg { color: var(--color-highlight, #3b82f6); flex-shrink: 0; }
.stat-chip strong { color: #fff; font-weight: 700; }

.gym-search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-cards, #121212);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--app-border-radius, 14px);
  padding: 10px 16px;
  width: 340px;
  max-width: 100%;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.gym-search-bar:focus-within {
  border-color: rgba(59, 130, 246, 0.6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
.gym-search-bar svg { color: #94a3b8; flex-shrink: 0; }
.gym-search-bar input {
  flex: 1; min-width: 0; background: transparent; border: none;
  color: #fff; font-family: 'Inter', sans-serif; font-size: 0.95rem; padding: 4px 0;
}
.gym-search-bar input:focus { outline: none; }
.gym-search-bar input::placeholder { color: rgba(245, 245, 244, 0.4); }
.btn-clear-search {
  background: rgba(255, 255, 255, 0.08); border: none; color: #fff;
  width: 26px; height: 26px; border-radius: 50%; font-size: 1.1rem; line-height: 1;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: background 0.2s;
}
.btn-clear-search:hover { background: rgba(255, 255, 255, 0.16); }

.category-section { display: flex; flex-direction: column; gap: 20px; }

.category-header { display: flex; align-items: center; gap: 12px; color: var(--color-titulos, #fff); }
.category-header h2 { font-family: 'Oswald', sans-serif; font-size: 1.4rem; margin: 0; letter-spacing: 0.5px; font-weight: 700; }
.category-header svg { color: var(--color-highlight, #3b82f6); }

.state-subsection { display: flex; flex-direction: column; gap: 16px; }
.state-subsection + .state-subsection { margin-top: 8px; padding-top: 24px; border-top: 1px dashed rgba(255, 255, 255, 0.08); }

.state-subheading {
  display: flex; align-items: center; gap: 8px; margin: 0;
  font-family: 'Oswald', sans-serif; font-size: 1rem; font-weight: 600;
  color: rgba(245, 245, 244, 0.85); text-transform: uppercase;
}
.state-subheading svg { color: var(--color-highlight, #3b82f6); flex-shrink: 0; }
.state-count-pill {
  background: rgba(255, 255, 255, 0.08); color: rgba(245, 245, 244, 0.7);
  border-radius: 50px; padding: 1px 9px; font-size: 0.72rem; font-weight: 700;
}

.trainers-grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

.glass-card {
  background: var(--bg-cards, #121212);
  border-radius: var(--app-border-radius, 20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 16px 32px rgba(0,0,0,0.4);
}

.trainer-item-card {
  cursor: pointer;
  position: relative;
  padding: 26px 22px 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.trainer-item-card:hover {
  transform: translateY(-6px);
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 24px 48px rgba(59, 130, 246, 0.12), 0 12px 24px rgba(0, 0, 0, 0.6);
}

.your-gym-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, #ffffff);
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.trainer-photo-wrap {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--color-highlight, #3b82f6);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.2);
  margin-bottom: 16px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.12);
}
.trainer-photo-wrap img { width: 100%; height: 100%; object-fit: cover; }
.trainer-initials {
  font-family: 'Oswald', sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-highlight, #3b82f6);
}

.trainer-item-card h3 {
  margin: 0 0 6px 0;
  font-family: 'Oswald', sans-serif;
  font-size: 1.15rem;
  color: var(--color-titulos, #fff);
}

.trainer-specialty {
  margin: 0 0 14px 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-highlight, #60a5fa);
}

.drawer-text-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.8rem;
  color: rgba(245, 245, 244, 0.65);
  margin: 4px 0;
  line-height: 1.4;
  flex-wrap: wrap;
  word-break: break-word;
}
.drawer-text-item svg { flex-shrink: 0; color: var(--color-highlight, #3b82f6); }

.locked-trainer-card { cursor: default; }

.blurred-content { filter: blur(6px); user-select: none; pointer-events: none; opacity: 0.35; width: 100%; }

.membership-lock-overlay {
  position: absolute;
  inset: 0;
  background: var(--bg-cards, #121212);
  border-radius: var(--app-border-radius, 20px);
  backdrop-filter: blur(6px);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 22px;
  text-align: center;
  gap: 10px;
}

.lock-icon-badge {
  width: 48px; height: 48px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #ef4444;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 24px rgba(239, 68, 68, 0.2);
}

.lock-title { font-size: 1rem; font-weight: 700; color: #fff; font-family: 'Oswald', sans-serif; }
.lock-desc { font-size: 0.78rem; color: rgba(245, 245, 244, 0.65); margin: 0; line-height: 1.5; }

.btn-unlock-action {
  margin-top: 6px;
  background: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, #ffffff);
  border: none;
  padding: 9px 18px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
}
.btn-unlock-action:hover { opacity: 0.95; transform: scale(1.04); }

.no-results-box {
  display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px;
  padding: 48px 24px; color: rgba(245, 245, 244, 0.5);
  border: 1.5px dashed rgba(255, 255, 255, 0.1);
  border-radius: var(--app-border-radius, 20px);
}
.no-results-box svg { opacity: 0.5; }
.no-results-box h3 { margin: 4px 0 0; font-family: 'Oswald', sans-serif; font-size: 1.1rem; color: rgba(245, 245, 244, 0.8); }
.no-results-box p { margin: 0; font-size: 0.85rem; max-width: 320px; }

.modal-wrapper {
  position: fixed; inset: 0; z-index: 5000;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px);
  padding: 16px;
  box-sizing: border-box;
  overflow-y: auto;
}

.pop-enter-active, .pop-leave-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(0.95); }

@media (max-width: 768px) {
  .dashboard-main-container { padding: 20px 16px; gap: 28px; }
  .main-heading { font-size: 1.6rem; letter-spacing: -0.5px; }
  .hero-desc { font-size: 0.85rem; }
  .section-header-box { align-items: stretch; }
  .gym-search-bar { width: 100%; padding: 10px 14px; }
  .trainers-grid-container { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 14px; }
  .trainer-item-card { padding: 20px 14px 16px; }
  .trainer-photo-wrap { width: 76px; height: 76px; }
  .category-header h2 { font-size: 1.2rem; }
  .your-gym-badge { top: 10px; right: 10px; font-size: 0.58rem; padding: 3px 8px; }
}

@media (max-width: 420px) {
  .dashboard-main-container { padding: 16px 12px; gap: 22px; }
  .main-heading { font-size: 1.4rem; }
  .stats-strip { gap: 8px; }
  .stat-chip { font-size: 0.72rem; padding: 6px 11px; }
  .trainers-grid-container { grid-template-columns: 1fr 1fr; gap: 10px; }
  .trainer-item-card { padding: 16px 10px 14px; }
  .trainer-photo-wrap { width: 64px; height: 64px; margin-bottom: 10px; }
  .trainer-initials { font-size: 1.2rem; }
  .trainer-item-card h3 { font-size: 0.95rem; }
  .trainer-specialty { font-size: 0.72rem; margin-bottom: 10px; }
  .drawer-text-item { font-size: 0.68rem; gap: 5px; }
  .lock-icon-badge { width: 40px; height: 40px; }
  .lock-title { font-size: 0.85rem; }
  .lock-desc { font-size: 0.68rem; }
  .btn-unlock-action { padding: 7px 14px; font-size: 0.72rem; }
}
</style>