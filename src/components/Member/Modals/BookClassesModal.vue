<template>
  <div class="modal-box glass-card-modal">
    <div class="modal-header">
      <div class="header-icon-title">
        <svg class="svg-modal" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>
        <div>
          <h3>{{ t.modalTitle }}</h3>
          <span class="sub-title">{{ t.modalSubTitle }}</span>
        </div>
      </div>
      <button class="close-btn" @click="$emit('close')">&times;</button>
    </div>

    <div class="categories-bar">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        :class="['cat-btn', { active: selectedCategory === cat.id }]"
        @click="selectedCategory = cat.id"
      >
        {{ cat.name }}
      </button>
    </div>

    <div class="modal-body custom-scroll">
      <div class="classes-container">
        <div 
          v-for="(item, index) in filteredClasses" 
          :key="index"
          class="class-card-item"
          :class="{ 'booked-card': item.isBooked }"
        >
          <div class="class-main-info">
            <div class="time-badge">
              <span class="day">{{ translateDay(item.dayKey) }}</span>
              <span class="hour">{{ item.time }}</span>
            </div>
            
            <div class="class-details">
              <span class="class-name">{{ item.name }}</span>
              <div class="class-meta">
                <span class="instructor">{{ t.instructorLabel }}: <strong>{{ item.instructor }}</strong></span>
                <span class="spots" :class="{ 'warning': item.spotsLeft <= 3 }">
                  {{ item.isBooked ? t.spotsConfirmed : t.spotsAvailable(item.spotsLeft) }}
                </span>
              </div>
            </div>
          </div>

          <div class="class-action">
            <button 
              v-if="!item.isBooked"
              class="btn-book"
              @click="bookClass(item)"
            >
              {{ t.btnBook }}
            </button>
            <button 
              v-else
              class="btn-cancel-book"
              @click="cancelBooking(item)"
            >
              {{ t.btnCancel }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <div class="footer-info">
        {{ t.activeBookings }}: <strong>{{ bookedCount }} {{ t.classesLabel }}</strong>
      </div>
      <button class="btn-primary" @click="$emit('close')">{{ t.closeBtn }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useLang } from '../useLang.js';

defineEmits(['close']);

const { lang } = useLang();

const traducciones = {
  es: {
    modalTitle: "Reservar Clases",
    modalSubTitle: "Aparta tu lugar en disciplinas y horarios",
    catAll: "Todas",
    catCycling: "Ciclismo",
    catFunctional: "Funcional",
    catYoga: "Yoga / Relax",
    instructorLabel: "Instructor",
    spotsConfirmed: "✓ Tu lugar está confirmado",
    spotsAvailable: (spots) => `${spots} lugares disponibles`,
    btnBook: "Reservar",
    btnCancel: "Cancelar",
    activeBookings: "Mis reservas activas",
    classesLabel: "clase(s)",
    closeBtn: "Cerrar",
    dayToday: "Hoy",
    dayTomorrow: "Mañana",
    dayWednesday: "Miércoles"
  },
  en: {
    modalTitle: "Book Classes",
    modalSubTitle: "Reserve your spot in disciplines and schedules",
    catAll: "All",
    catCycling: "Cycling",
    catFunctional: "Functional",
    catYoga: "Yoga / Relax",
    instructorLabel: "Instructor",
    spotsConfirmed: "✓ Your spot is confirmed",
    spotsAvailable: (spots) => `${spots} spots available`,
    btnBook: "Book",
    btnCancel: "Cancel",
    activeBookings: "My active bookings",
    classesLabel: "class(es)",
    closeBtn: "Close",
    dayToday: "Today",
    dayTomorrow: "Tomorrow",
    dayWednesday: "Wednesday"
  }
};

const t = computed(() => traducciones[lang.value] || traducciones.es);

const selectedCategory = ref('todas');

const categories = computed(() => [
  { id: 'todas', name: t.value.catAll },
  { id: 'ciclismo', name: t.value.catCycling },
  { id: 'funcional', name: t.value.catFunctional },
  { id: 'yoga', name: t.value.catYoga }
]);

const classesList = ref([
  { 
    id: 1, 
    name: 'Spinning Avanzado', 
    category: 'ciclismo', 
    dayKey: 'Hoy', 
    time: '18:00 hrs', 
    instructor: 'Marco', 
    spotsLeft: 2, 
    isBooked: false 
  },
  { 
    id: 2, 
    name: 'Functional Training', 
    category: 'funcional', 
    dayKey: 'Mañana', 
    time: '08:00 hrs', 
    instructor: 'Sofia', 
    spotsLeft: 5, 
    isBooked: true 
  },
  { 
    id: 3, 
    name: 'Power Yoga & Stretching', 
    category: 'yoga', 
    dayKey: 'Mañana', 
    time: '19:30 hrs', 
    instructor: 'Elena', 
    spotsLeft: 1, 
    isBooked: false 
  },
  { 
    id: 4, 
    name: 'HIIT Extreme Circuit', 
    category: 'funcional', 
    dayKey: 'Miércoles', 
    time: '07:00 hrs', 
    instructor: 'Carlos', 
    spotsLeft: 8, 
    isBooked: false 
  }
]);

const translateDay = (dayKey) => {
  if (dayKey === 'Hoy') return t.value.dayToday;
  if (dayKey === 'Mañana') return t.value.dayTomorrow;
  if (dayKey === 'Miércoles') return t.value.dayWednesday;
  return dayKey;
};

const filteredClasses = computed(() => {
  if (selectedCategory.value === 'todas') return classesList.value;
  return classesList.value.filter(c => c.category === selectedCategory.value);
});

const bookedCount = computed(() => {
  return classesList.value.filter(c => c.isBooked).length;
});

const bookClass = (item) => {
  if (item.spotsLeft > 0) {
    item.isBooked = true;
    item.spotsLeft -= 1;
  }
};

const cancelBooking = (item) => {
  item.isBooked = false;
  item.spotsLeft += 1;
};
</script>

<style scoped>
.modal-box {
  background: var(--bg-cards, #121212);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--app-border-radius, 20px);
  width: 100%;
  max-width: 620px;
  max-height: 90vh;
  padding: 24px;
  color: var(--color-texto-general, #f5f5f4);
  box-shadow: 0 25px 50px rgba(0,0,0,0.8);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-icon-title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon-title h3 {
  margin: 0;
  font-family: 'Oswald', sans-serif;
  font-size: 1.35rem;
  color: var(--color-titulos, #fff);
  letter-spacing: 0.5px;
}

.sub-title {
  font-size: 0.8rem;
  color: var(--color-highlight, #3b82f6);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.svg-modal {
  width: 28px;
  height: 28px;
  fill: var(--color-highlight, #3b82f6);
  flex-shrink: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.8rem;
  cursor: pointer;
  opacity: 0.7;
  padding: 0 4px;
}
.close-btn:hover { opacity: 1; }

/* Barra de Categorías / Filtros */
.categories-bar {
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.02);
  padding: 4px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow-x: auto;
}

.cat-btn {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--color-texto-general, rgba(245, 245, 244, 0.6));
  padding: 8px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  text-align: center;
}

.cat-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.04);
}

.cat-btn.active {
   background: var(--color-botones, #1c4fd6); 
  color: var(--color-texto-botones, #ffffff); 
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Cuerpo y scroll */
.modal-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  max-height: 400px;
  padding-right: 4px;
}

.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 4px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--color-highlight, #3b82f6);
}

.classes-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Tarjeta individual de clase */
.class-card-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 14px 16px;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.class-card-item:hover {
  border-color: rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.04);
}

.class-card-item.booked-card {
  background: rgba(59, 130, 246, 0.04);
  border-color: rgba(59, 130, 246, 0.2);
}

.class-main-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

/* Badge de tiempo */
.time-badge {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 8px 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 65px;
}

.time-badge .day {
  font-size: 0.65rem;
  text-transform: uppercase;
  color: var(--color-highlight, #3b82f6);
  font-weight: 700;
}

.time-badge .hour {
  font-family: 'Oswald', sans-serif;
  font-size: 0.95rem;
  color: #fff;
}

.class-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.class-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-titulos, #fff);
}

.class-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  font-size: 0.75rem;
  opacity: 0.7;
}

.class-meta strong {
  opacity: 1;
  color: #fff;
}

.spots.warning {
  color: #f59e0b; /* Alerta si quedan pocos lugares */
  font-weight: 600;
}

/* Botones de acción */
.class-action {
  display: flex;
  align-items: center;
}

.btn-book {
  background: rgba(59, 130, 246, 0.15);
  color: var(--color-highlight, #3b82f6);
  border: 1px solid var(--color-highlight, #3b82f6);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-book:hover { 
  background: var(--color-highlight, #3b82f6); 
  color: #fff; 
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-cancel-book {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel-book:hover {
  background: #ef4444;
  color: #fff;
}

/* Footer */
.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 14px;
}

.footer-info {
  font-size: 0.8rem;
  opacity: 0.7;
}

.footer-info strong {
  color: var(--color-highlight, #3b82f6);
}

.btn-primary {
   background: var(--color-botones, #1c4fd6); 
  color: var(--color-texto-botones, #ffffff); 
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.2s ease;
}

.btn-primary:hover { 
  filter: brightness(1.1); 
}
</style>