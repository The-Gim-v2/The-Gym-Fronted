<template>
<HeadingMember>
  <div class="detail-wrapper">

    <div class="detail-inner" v-if="entrenador">

      <button type="button" class="back-btn" @click="volver">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        {{ t('back') }}
      </button>

      <!-- PORTADA + PERFIL -->
      <div class="cover-card" id="tutorial-trainer-header">
        <div class="cover-photo" :style="{ backgroundImage: `url(${entrenador.fotoPortada})` }"></div>
        <div class="cover-overlay"></div>

        <div class="cover-content">
          <div class="profile-avatar">
            <img :src="entrenador.foto" :alt="nombreCompleto" />
          </div>

          <div class="profile-texts">
            <span class="badge-pill">{{ entrenador.especialidad }}</span>
            <h1>{{ nombreCompleto }}</h1>
            <p class="profile-sede">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              {{ entrenador.sedeNombre }} — {{ entrenador.ciudad }}, {{ entrenador.estado }}
            </p>

            <div class="rating-row">
              <div class="stars">
                <svg v-for="n in 5" :key="n" width="16" height="16" viewBox="0 0 24 24" :fill="n <= Math.round(entrenador.calificacionPromedio) ? '#fbbf24' : 'none'" stroke="#fbbf24" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </div>
              <span class="rating-number">{{ entrenador.calificacionPromedio.toFixed(1) }}</span>
              <span class="rating-count">({{ entrenador.resenas.length }} {{ t('reviews') }})</span>
            </div>
          </div>

          <div class="cover-actions">
            <button class="whatsapp-contact-btn" @click="contactarWhatsapp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              {{ t('contactWhatsapp') }}
            </button>
            <a v-if="entrenador.celular" :href="`tel:${entrenador.celular}`" class="call-btn" :title="t('call')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </a>
          </div>
        </div>
      </div>

      <!-- STATS RÁPIDAS -->
      <div class="quick-stats-row" id="tutorial-trainer-stats">
        <div class="stat-box">
          <span class="stat-value">{{ entrenador.aniosExperiencia }}</span>
          <span class="stat-label">{{ t('yearsExp') }}</span>
        </div>
        <div class="stat-box">
          <span class="stat-value">{{ entrenador.alumnosEntrenados }}+</span>
          <span class="stat-label">{{ t('studentsTrained') }}</span>
        </div>
        <div class="stat-box">
          <span class="stat-value">{{ entrenador.calificacionPromedio.toFixed(1) }}</span>
          <span class="stat-label">{{ t('avgRating') }}</span>
        </div>
        <div class="stat-box">
          <span class="stat-value">{{ entrenador.resenas.length }}</span>
          <span class="stat-label">{{ t('reviews') }}</span>
        </div>
      </div>

      <!-- DASHBOARD DE 2 COLUMNAS -->
      <div class="dashboard-grid">

        <div class="left-column">

          <div class="panel-box" id="tutorial-trainer-bio">
            <h3>{{ t('aboutTitle') }}</h3>
            <p>{{ entrenador.bio }}</p>
          </div>

          <div class="panel-box">
            <h3>{{ t('specialtiesTitle') }}</h3>
            <div class="tags-wrap">
              <span v-for="esp in entrenador.especialidades" :key="esp" class="specialty-tag">{{ esp }}</span>
            </div>
          </div>

          <div class="panel-box" v-if="entrenador.certificaciones?.length">
            <h3>{{ t('certsTitle') }}</h3>
            <div class="cert-list">
              <div v-for="cert in entrenador.certificaciones" :key="cert" class="cert-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                {{ cert }}
              </div>
            </div>
          </div>

          <!-- UBICACIÓN -->
          <div class="panel-box map-panel" id="tutorial-trainer-location">
            <div class="panel-header">
              <h3>{{ t('locationTitle') }}</h3>
              <a class="route-gps-btn" :href="mapsDirectionsUrl" target="_blank" rel="noopener">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                {{ t('howToGetThere') }}
              </a>
            </div>
            <div class="map-container-inner">
              <div ref="mapElement" class="map-canvas"></div>
              <div class="map-watermark-overlay">
                <span class="watermark-text">{{ entrenador.sedeNombre }}</span>
              </div>
            </div>
            <p class="sede-address">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              {{ entrenador.sedeDireccion }}
            </p>
          </div>

        </div>

        <div class="right-column">

          <div class="panel-box" id="tutorial-trainer-contact">
            <h3>{{ t('contactTitle') }}</h3>
            <div class="contact-list">
              <a v-if="entrenador.celular" :href="`tel:${entrenador.celular}`" class="contact-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                {{ entrenador.celular }}
              </a>
              <a v-if="entrenador.redes?.instagram" :href="`https://instagram.com/${entrenador.redes.instagram.replace('@','')}`" target="_blank" rel="noopener" class="contact-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                {{ entrenador.redes.instagram }}
              </a>
              <span v-if="entrenador.redes?.tiktok" class="contact-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                {{ entrenador.redes.tiktok }}
              </span>
              <span v-if="entrenador.redes?.facebook" class="contact-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                {{ entrenador.redes.facebook }}
              </span>
            </div>
          </div>

          <div class="panel-box">
            <h3>{{ t('scheduleTitle') }}</h3>
            <div class="schedule-list">
              <div class="schedule-item">
                <span class="day">{{ t('scheduleDays') }}</span>
                <span class="time">{{ entrenador.horaEntrada }} - {{ entrenador.horaSalida }}</span>
              </div>
            </div>
          </div>

          <button type="button" class="cta-main-btn" @click="contactarWhatsapp">
            {{ t('ctaContact') }}
          </button>

        </div>
      </div>

      <!-- RESEÑAS -->
      <div class="panel-box reviews-panel" id="tutorial-trainer-reviews">
        <div class="panel-header">
          <h3>{{ t('reviewsTitle') }}</h3>
          <div class="rating-row">
            <div class="stars">
              <svg v-for="n in 5" :key="n" width="15" height="15" viewBox="0 0 24 24" :fill="n <= Math.round(entrenador.calificacionPromedio) ? '#fbbf24' : 'none'" stroke="#fbbf24" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            <span class="rating-number">{{ entrenador.calificacionPromedio.toFixed(1) }}</span>
          </div>
        </div>

        <div class="reviews-grid" v-if="entrenador.resenas.length">
          <div v-for="res in entrenador.resenas" :key="res.id" class="review-card">
            <div class="review-header">
              <div class="review-avatar">{{ res.iniciales }}</div>
              <div class="review-meta">
                <strong>{{ res.nombre }}</strong>
                <div class="stars small">
                  <svg v-for="n in 5" :key="n" width="12" height="12" viewBox="0 0 24 24" :fill="n <= res.calificacion ? '#fbbf24' : 'none'" stroke="#fbbf24" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </div>
              </div>
              <span class="review-date">{{ res.fecha }}</span>
            </div>
            <p class="review-text">{{ res.comentario }}</p>
          </div>
        </div>
        <p v-else class="no-reviews-text">{{ t('noReviews') }}</p>
      </div>

    </div>

    <!-- ESTADO: ENTRENADOR NO ENCONTRADO -->
    <div class="not-found-wrapper" v-else>
      <div class="not-found-card">
        <div class="not-found-icon">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <h2>{{ t('notFoundTitle') }}</h2>
        <p>{{ t('notFoundDesc') }}</p>
        <button type="button" class="cta-main-btn" @click="volver">{{ t('back') }}</button>
      </div>
    </div>

  </div>
</HeadingMember>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import L from 'leaflet';
import HeadingMember from '../HeadingMember.vue';
import 'leaflet/dist/leaflet.css';

const route = useRoute();
const router = useRouter();
const currentLang = ref(localStorage.getItem('member-idioma') || 'es');
const mapElement = ref(null);
let map = null;

/* -------------------------------------------------------------------- */
/* En producción esto vendría de tu API usando route.params.id.         */
/* -------------------------------------------------------------------- */
const entrenadoresDB = {
  101: {
    id: 101, nombres: 'Daniela', apellidoP: 'Reyes', apellidoM: 'Cortés',
    especialidad: 'Entrenamiento de Fuerza',
    especialidades: ['Fuerza', 'Hipertrofia', 'Powerlifting', 'Movilidad'],
    foto: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
    fotoPortada: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80',
    sedeId: 1, sedeNombre: 'IronFit Valles Centro', sedeDireccion: 'Blvd. Carlos Lasso #120, Centro',
    sedeLat: 21.9902, sedeLng: -99.0301,
    ciudad: 'Ciudad Valles', estado: 'San Luis Potosí',
    celular: '+52 481 100 2211', horaEntrada: '06:00', horaSalida: '14:00', aniosExperiencia: 6,
    alumnosEntrenados: 180,
    bio: 'Especialista en fuerza e hipertrofia, con enfoque en técnica y progresión segura de cargas. Trabajo contigo desde el primer día para construir una base sólida antes de aumentar la intensidad.',
    certificaciones: ['NSCA-CPT', 'Especialidad en Powerlifting'],
    redes: { instagram: '@dani.fuerza', tiktok: '@dani.fuerza' },
    calificacionPromedio: 4.8,
    resenas: [
      { id: 1, nombre: 'Luis M.', iniciales: 'LM', calificacion: 5, fecha: 'Jul 2026', comentario: 'Excelente seguimiento en cada sesión, mi técnica en sentadilla mejoró muchísimo.' },
      { id: 2, nombre: 'Karla P.', iniciales: 'KP', calificacion: 5, fecha: 'Jun 2026', comentario: 'Muy profesional y puntual, siempre explica el porqué de cada ejercicio.' },
      { id: 3, nombre: 'Ricardo A.', iniciales: 'RA', calificacion: 4, fecha: 'May 2026', comentario: 'Buenas rutinas, a veces el horario se complica pero vale la pena.' }
    ]
  },
  102: {
    id: 102, nombres: 'Marco', apellidoP: 'Villanueva', apellidoM: 'Ibarra',
    especialidad: 'Boxeo y Acondicionamiento',
    especialidades: ['Boxeo', 'HIIT', 'Acondicionamiento'],
    foto: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80',
    fotoPortada: 'https://images.unsplash.com/photo-1571902943202-507f2718ea0d?auto=format&fit=crop&w=1400&q=80',
    sedeId: 1, sedeNombre: 'IronFit Valles Centro', sedeDireccion: 'Blvd. Carlos Lasso #120, Centro',
    sedeLat: 21.9902, sedeLng: -99.0301,
    ciudad: 'Ciudad Valles', estado: 'San Luis Potosí',
    celular: '+52 481 100 3344', horaEntrada: '14:00', horaSalida: '21:00', aniosExperiencia: 4,
    alumnosEntrenados: 95,
    bio: 'Ex boxeador amateur, entrena acondicionamiento de alta intensidad basado en fundamentos de boxeo. Ideal si buscas quemar grasa mientras aprendes técnica real.',
    certificaciones: ['Entrenador de Boxeo FMB'],
    redes: { instagram: '@marcobox_fit', facebook: 'MarcoBoxFit' },
    calificacionPromedio: 4.6,
    resenas: [
      { id: 1, nombre: 'Andrea G.', iniciales: 'AG', calificacion: 5, fecha: 'Jul 2026', comentario: 'Las clases son intensas pero muy divertidas, se nota que sabe de boxeo real.' },
      { id: 2, nombre: 'Pablo S.', iniciales: 'PS', calificacion: 4, fecha: 'Jun 2026', comentario: 'Buen entrenador, a veces las sesiones se alargan un poco.' }
    ]
  },
  103: {
    id: 103, nombres: 'Paola', apellidoP: 'Serrano', apellidoM: 'Munguía',
    especialidad: 'Yoga y Movilidad',
    especialidades: ['Yoga', 'Movilidad', 'Recuperación'],
    foto: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    fotoPortada: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=80',
    sedeId: 1, sedeNombre: 'IronFit Valles Centro', sedeDireccion: 'Blvd. Carlos Lasso #120, Centro',
    sedeLat: 21.9902, sedeLng: -99.0301,
    ciudad: 'Ciudad Valles', estado: 'San Luis Potosí',
    celular: '+52 481 100 5566', horaEntrada: '07:00', horaSalida: '13:00', aniosExperiencia: 8,
    alumnosEntrenados: 210,
    bio: 'Instructora certificada en Hatha y Vinyasa, enfocada en movilidad funcional y recuperación activa para complementar cualquier rutina de fuerza o cardio.',
    certificaciones: ['RYT-500'],
    redes: { instagram: '@paola.yoga' },
    calificacionPromedio: 5.0,
    resenas: [
      { id: 1, nombre: 'Mariana V.', iniciales: 'MV', calificacion: 5, fecha: 'Ago 2026', comentario: 'Sus clases me ayudaron a recuperarme de una lesión de rodilla, súper atenta.' },
      { id: 2, nombre: 'Jorge T.', iniciales: 'JT', calificacion: 5, fecha: 'Jul 2026', comentario: 'La mejor forma de terminar la semana, muy relajante y profesional.' }
    ]
  },
  104: {
    id: 104, nombres: 'Héctor', apellidoP: 'Domínguez', apellidoM: 'Ramos',
    especialidad: 'CrossFit',
    especialidades: ['CrossFit', 'Levantamientos Olímpicos', 'Metcon'],
    foto: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
    fotoPortada: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=80',
    sedeId: 2, sedeNombre: 'IronFit Norte - Plaza San José', sedeDireccion: 'Carretera Mante #450, Local 4',
    sedeLat: 22.0050, sedeLng: -99.0210,
    ciudad: 'Ciudad Valles', estado: 'San Luis Potosí',
    celular: '+52 481 200 1122', horaEntrada: '05:00', horaSalida: '12:00', aniosExperiencia: 5,
    alumnosEntrenados: 140,
    bio: 'Coach de CrossFit nivel 2, especializado en levantamientos olímpicos y metcons de alta intensidad.',
    certificaciones: ['CrossFit Level 2'],
    redes: { instagram: '@hector.crossfit' },
    calificacionPromedio: 4.7,
    resenas: [
      { id: 1, nombre: 'Fernando C.', iniciales: 'FC', calificacion: 5, fecha: 'Jul 2026', comentario: 'Sabe corregir técnica en tiempo real, mis levantamientos mejoraron mucho.' }
    ]
  }
};

const entrenador = computed(() => entrenadoresDB[route.params.id] || null);
const nombreCompleto = computed(() =>
  entrenador.value ? `${entrenador.value.nombres} ${entrenador.value.apellidoP}${entrenador.value.apellidoM ? ' ' + entrenador.value.apellidoM : ''}` : ''
);

const mapsDirectionsUrl = computed(() => {
  if (!entrenador.value) return '#';
  return `https://www.google.com/maps/dir/?api=1&destination=${entrenador.value.sedeLat},${entrenador.value.sedeLng}`;
});

const initMap = () => {
  if (!mapElement.value || !entrenador.value) return;

  map = L.map(mapElement.value, { zoomControl: false, attributionControl: false })
    .setView([entrenador.value.sedeLat, entrenador.value.sedeLng], 15);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd'
  }).addTo(map);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  const customIcon = L.divIcon({
    className: 'custom-map-marker',
    html: `<div class="marker-pin"></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });

  L.marker([entrenador.value.sedeLat, entrenador.value.sedeLng], { icon: customIcon })
    .addTo(map)
    .bindPopup(`<b>${entrenador.value.sedeNombre}</b><br>${entrenador.value.sedeDireccion}`);
};

const destroyMap = () => {
  if (map) {
    map.remove();
    map = null;
  }
};

const contactarWhatsapp = () => {
  if (!entrenador.value?.celular) return;
  const cleanPhone = entrenador.value.celular.replace(/[^0-9]/g, '');
  const message = encodeURIComponent(`Hola ${entrenador.value.nombres}, te escribo desde la plataforma de IronFit para conocer más sobre tus clases.`);
  window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
};

const traducciones = {
  es: {
    back: 'Volver a entrenadores',
    reviews: 'reseñas',
    reviewsTitle: 'Reseñas de alumnos',
    noReviews: 'Este entrenador aún no tiene reseñas.',
    yearsExp: 'Años de experiencia',
    studentsTrained: 'Alumnos entrenados',
    avgRating: 'Calificación',
    aboutTitle: 'Sobre el entrenador',
    specialtiesTitle: 'Especialidades',
    certsTitle: 'Certificaciones',
    contactTitle: 'Contacto y Redes',
    scheduleTitle: 'Horario',
    scheduleDays: 'Horario de atención',
    locationTitle: 'Ubicación de la Sede',
    howToGetThere: '¿Cómo llegar?',
    contactWhatsapp: 'Contactar por WhatsApp',
    call: 'Llamar',
    ctaContact: 'Contactar a este entrenador',
    notFoundTitle: 'No encontramos a este entrenador',
    notFoundDesc: 'Puede que el enlace sea incorrecto o que necesites una membresía Plus para verlo.'
  },
  en: {
    back: 'Back to trainers',
    reviews: 'reviews',
    reviewsTitle: 'Member reviews',
    noReviews: 'This trainer has no reviews yet.',
    yearsExp: 'Years of experience',
    studentsTrained: 'Students trained',
    avgRating: 'Rating',
    aboutTitle: 'About the trainer',
    specialtiesTitle: 'Specialties',
    certsTitle: 'Certifications',
    contactTitle: 'Contact & Social',
    scheduleTitle: 'Schedule',
    scheduleDays: 'Available hours',
    locationTitle: 'Gym Location',
    howToGetThere: 'Get directions',
    contactWhatsapp: 'Contact via WhatsApp',
    call: 'Call',
    ctaContact: 'Contact this trainer',
    notFoundTitle: "We couldn't find this trainer",
    notFoundDesc: 'The link may be wrong, or you may need a Plus membership to view it.'
  }
};

const t = (key) => {
  const langTable = traducciones[currentLang.value] || traducciones.es;
  return langTable[key] || traducciones.es[key] || key;
};

const handleLangChange = (e) => {
  if (e.detail && e.detail.idioma) currentLang.value = e.detail.idioma;
};

const volver = () => router.back();

onMounted(() => {
  window.addEventListener('idioma-changed', handleLangChange);
  nextTick(() => initMap());
});

onUnmounted(() => {
  window.removeEventListener('idioma-changed', handleLangChange);
  destroyMap();
});

watch(() => route.params.id, () => {
  destroyMap();
  nextTick(() => initMap());
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Anton&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;600;700&display=swap');

.detail-wrapper {
  background: var(--bg-custom, var(--color-interfaz, #0a0a0c));
  min-height: calc(100vh - 65px);
  color: var(--color-texto-general, #f5f5f4);
  font-family: 'Inter', sans-serif;
}

.detail-inner {
  max-width: 1180px;
  margin: 0 auto;
  width: 100%;
  padding: 32px clamp(16px, 3vw, 40px) 60px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-sizing: border-box;
}

.back-btn {
  align-self: flex-start;
  background: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, #ffffff);
  border: none;
  padding: 9px 18px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Oswald', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  cursor: pointer;
  transition: transform 0.15s ease, filter 0.2s ease;
}
.back-btn:hover { filter: brightness(1.1); transform: translateY(-2px); }

/* ===== PORTADA + PERFIL ===== */
.cover-card {
  position: relative;
  border-radius: var(--app-border-radius, 20px);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 15px 35px rgba(0,0,0,0.5);
}

.cover-photo {
  height: 220px;
  background-size: cover;
  background-position: center;
  filter: brightness(0.55);
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 15%, rgba(10,10,12,0.55) 60%, var(--bg-cards, #121212) 100%);
}

.cover-content {
  position: relative;
  z-index: 2;
  margin-top: -70px;
  padding: 0 30px 26px;
  display: flex;
  align-items: flex-end;
  gap: 22px;
  flex-wrap: wrap;
}

.profile-avatar {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--color-highlight, #3b82f6);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.35);
  flex-shrink: 0;
  background: #141418;
}
.profile-avatar img { width: 100%; height: 100%; object-fit: cover; }

.profile-texts { flex: 1; min-width: 220px; padding-bottom: 4px; }

.badge-pill {
  display: inline-block;
  background: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, #ffffff);
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.profile-texts h1 {
  font-family: 'Anton', sans-serif;
  font-size: 1.9rem;
  margin: 0 0 8px 0;
  color: #fff;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  line-height: 1.1;
}

.profile-sede {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: rgba(245, 245, 244, 0.75);
  margin: 0 0 10px 0;
}
.profile-sede svg { color: var(--color-highlight, #60a5fa); flex-shrink: 0; }

.rating-row { display: flex; align-items: center; gap: 8px; }
.stars { display: flex; gap: 2px; }
.stars.small svg { width: 12px; height: 12px; }
.rating-number { font-weight: 700; color: #fff; font-size: 0.9rem; }
.rating-count { font-size: 0.8rem; color: rgba(245, 245, 244, 0.55); }

.cover-actions { display: flex; align-items: center; gap: 10px; padding-bottom: 6px; }

.whatsapp-contact-btn {
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #34d399;
  padding: 10px 16px;
  border-radius: 10px;
  font-family: 'Oswald', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s ease, color 0.2s ease, transform 0.15s ease;
}
.whatsapp-contact-btn:hover { background: rgba(16, 185, 129, 0.25); color: #fff; transform: translateY(-1px); }

.call-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #f5f5f4;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s ease;
}
.call-btn:hover { background: rgba(255, 255, 255, 0.14); }

/* ===== STATS ===== */
.quick-stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
.stat-box {
  background: var(--bg-cards, #121212);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--app-border-radius, 16px);
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}
.stat-value {
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-highlight, #60a5fa);
}
.stat-label {
  font-size: 0.72rem;
  color: rgba(245, 245, 244, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* ===== DASHBOARD ===== */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 20px;
}
.left-column, .right-column {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
}

.panel-box {
  background: var(--bg-cards, #121212);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--app-border-radius, 18px);
  padding: 22px;
  box-sizing: border-box;
}
.panel-box h3 {
  margin: 0 0 14px 0;
  font-family: 'Oswald', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-titulos, #fff);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.panel-box h3::before {
  content: '';
  width: 3px;
  height: 16px;
  border-radius: 3px;
  flex-shrink: 0;
  background: linear-gradient(180deg, var(--color-botones, #1c4fd6), rgba(37, 99, 235, 0.25));
}
.panel-box p {
  margin: 0;
  font-size: 0.87rem;
  color: rgba(245, 245, 244, 0.75);
  line-height: 1.65;
}

.tags-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
.specialty-tag {
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #60a5fa;
  padding: 6px 13px;
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 600;
}

.cert-list { display: flex; flex-direction: column; gap: 9px; }
.cert-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.83rem;
  color: rgba(245, 245, 244, 0.85);
}
.cert-item svg { color: #10b981; flex-shrink: 0; }

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
}
.panel-header h3 { margin: 0; }

.route-gps-btn {
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.4);
  color: #60a5fa;
  font-family: 'Oswald', sans-serif;
  font-size: 0.74rem;
  font-weight: 700;
  padding: 7px 13px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s ease, transform 0.15s ease;
}
.route-gps-btn:hover { background: rgba(59, 130, 246, 0.25); color: #fff; transform: translateY(-1px); }

.map-container-inner {
  position: relative;
  width: 100%;
  height: 220px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 12px;
}
.map-canvas { width: 100%; height: 100%; z-index: 1; }

.map-watermark-overlay {
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 400;
  background: rgba(10, 10, 12, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
  pointer-events: none;
}
.watermark-text {
  font-size: 0.68rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  font-family: 'Oswald', sans-serif;
}

.sede-address {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem !important;
  color: rgba(245, 245, 244, 0.65) !important;
}
.sede-address svg { color: var(--color-highlight, #3b82f6); flex-shrink: 0; }

:deep(.custom-map-marker) { background: transparent; border: none; }
:deep(.marker-pin) {
  width: 22px; height: 22px;
  background: #3b82f6;
  border: 3px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.8);
}

.contact-list { display: flex; flex-direction: column; }
.contact-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  color: rgba(245, 245, 244, 0.8);
  text-decoration: none;
  font-size: 0.86rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: color 0.2s;
}
.contact-list a.contact-row:hover { color: var(--color-highlight, #60a5fa); }
.contact-row:last-child { border-bottom: none; }
.contact-row svg { color: var(--color-highlight, #3b82f6); flex-shrink: 0; }

.schedule-list { display: flex; flex-direction: column; gap: 8px; }
.schedule-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  font-size: 0.83rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.schedule-item .day { color: rgba(245, 245, 244, 0.6); }
.schedule-item .time { color: #fff; font-weight: 600; font-family: 'Oswald', sans-serif; }

.cta-main-btn {
  width: 100%;
  background: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, #ffffff);
  border: none;
  padding: 15px;
  border-radius: var(--app-border-radius, 14px);
  font-family: 'Oswald', sans-serif;
  font-size: 0.92rem;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
  transition: filter 0.2s ease, transform 0.15s ease;
}
.cta-main-btn:hover { filter: brightness(1.08); transform: translateY(-2px); }

/* ===== RESEÑAS ===== */
.reviews-panel .panel-header { margin-bottom: 18px; }
.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
.review-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.review-header { display: flex; align-items: center; gap: 10px; }
.review-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.15);
  color: var(--color-highlight, #60a5fa);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 0.8rem;
  flex-shrink: 0;
}
.review-meta { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.review-meta strong { font-size: 0.85rem; color: #fff; }
.review-date { font-size: 0.72rem; color: rgba(245, 245, 244, 0.45); white-space: nowrap; }
.review-text { margin: 0; font-size: 0.83rem; line-height: 1.55; color: rgba(245, 245, 244, 0.75); }
.no-reviews-text { margin: 0; font-size: 0.85rem; color: rgba(245, 245, 244, 0.5); }

/* ===== ESTADO VACÍO ===== */
.not-found-wrapper {
  min-height: calc(100vh - 65px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.not-found-card {
  max-width: 420px;
  width: 100%;
  background: var(--bg-cards, #121212);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--app-border-radius, 24px);
  padding: 44px 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  box-shadow: 0 20px 45px rgba(0,0,0,0.5);
}

.not-found-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.35);
  color: var(--color-highlight, #60a5fa);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.2);
  margin-bottom: 6px;
}

.not-found-card h2 {
  margin: 0;
  font-family: 'Oswald', sans-serif;
  font-size: 1.25rem;
  color: #fff;
}

.not-found-card p {
  margin: 0 0 10px 0;
  font-size: 0.88rem;
  color: rgba(245, 245, 244, 0.6);
  line-height: 1.55;
}

.not-found-card .cta-main-btn { width: auto; padding: 12px 26px; }

/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .dashboard-grid { grid-template-columns: 1fr; }
  .quick-stats-row { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .detail-inner { padding: 20px 14px 48px; gap: 18px; }
  .cover-photo { height: 160px; }
  .cover-content { margin-top: -55px; padding: 0 18px 20px; gap: 14px; }
  .profile-avatar { width: 96px; height: 96px; border-width: 3px; }
  .profile-texts h1 { font-size: 1.4rem; }
  .cover-actions { width: 100%; }
  .whatsapp-contact-btn { flex: 1; justify-content: center; }
  .panel-box { padding: 18px; }
  .map-container-inner { height: 190px; }
}

@media (max-width: 480px) {
  .cover-content { flex-direction: column; align-items: flex-start; }
  .profile-texts { padding-bottom: 0; }
  .cover-actions { padding-bottom: 0; }
  .quick-stats-row { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .stat-box { padding: 12px; }
  .stat-value { font-size: 1.25rem; }
  .reviews-grid { grid-template-columns: 1fr; }
  .not-found-card { padding: 34px 22px; }
}
</style>