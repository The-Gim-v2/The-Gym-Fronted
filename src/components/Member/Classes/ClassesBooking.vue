<template>
  <HeadingMember>
  <div class="classes-wrapper">
    <main class="classes-main">

      <!-- HERO -->
      <section class="hero-banner">
        <img class="hero-bg-img" src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=1600" alt="" />
        <div class="hero-gradient"></div>

        <div class="hero-content">
          <span class="gym-badge-tag">{{ t.headerTag }}</span>
          <h1 class="main-heading">
            {{ t.mainTitle1 }} <span class="highlight-color">{{ t.mainTitle2 }}</span>
          </h1>
          <p class="hero-desc">{{ t.heroDesc }}</p>
        </div>

      </section>

      <!-- BARRA DE MÉTRICAS (Corregido a Flexbox para perfecta alineación) -->
      <div class="stats-bar glass-card">
        <div class="stat-item-bar">
          <div class="stat-icon-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <div class="stat-item-text">
            <span class="stat-num">{{ myBookings.length }}</span>
            <span class="stat-label">{{ t.summaryMyBookings }}</span>
          </div>
        </div>

        <div class="stat-divider"></div>

        <div class="stat-item-bar">
          <div class="stat-icon-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div class="stat-item-text">
            <span class="stat-num">{{ selectedDayClasses.length }}</span>
            <span class="stat-label">{{ t.summarySelectedDay }}</span>
          </div>
        </div>

        <div class="stat-divider"></div>

        <div class="stat-item-bar">
          <div class="stat-icon-box accent-icon-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <div class="stat-item-text">
            <span class="stat-num">{{ totalSpotsLeftToday }}</span>
            <span class="stat-label">{{ t.summarySpotsLeft }}</span>
          </div>
        </div>
      </div>

      <!-- SELECTOR DE FECHA (estilo calendario) -->
      <div class="date-strip-wrapper glass-card">
        <div class="date-strip-scroll custom-scrollbar-x">
          <button
            v-for="(d, idx) in weekDates"
            :key="idx"
            class="date-chip"
            :class="{ active: selectedDateIndex === idx }"
            @click="selectedDateIndex = idx"
          >
            <span class="date-chip-day">{{ t.daysShort[d.dayKey] }}</span>
            <span class="date-chip-num">{{ d.dateNum }}</span>
            <span v-if="d.isToday" class="date-chip-today-dot"></span>
            <span class="date-chip-count" v-if="classCountByDay[d.dayKey]">{{ classCountByDay[d.dayKey] }}</span>
          </button>
        </div>

        <label class="only-booked-toggle">
          <input type="checkbox" v-model="onlyMyBookings" />
          <span class="toggle-track"><span class="toggle-thumb"></span></span>
          <span class="toggle-label-text">{{ t.onlyMyBookingsLabel }}</span>
        </label>
      </div>

      <!-- LEYENDA / FILTRO DE CATEGORÍAS -->
      <div class="category-legend-row">
        <button
          type="button"
          class="legend-chip"
          :class="{ active: activeCategory === 'all' }"
          @click="activeCategory = 'all'"
        >{{ t.categoryAll }}</button>
        <button
          v-for="cat in categoryKeys"
          :key="cat"
          type="button"
          class="legend-chip"
          :class="{ active: activeCategory === cat }"
          :style="{ '--cat-dot': categoryColors[cat] }"
          @click="activeCategory = cat"
        >
          <span class="legend-dot"></span>{{ t.cats[cat] || cat }}
        </button>
      </div>

      <!-- TIMELINE DEL DÍA SELECCIONADO -->
      <div v-if="filteredDayClasses.length" class="timeline-container">
        <div
          v-for="cls in filteredDayClasses"
          :key="cls.id"
          class="timeline-row"
        >
          <div class="timeline-time-col">
            <span class="time-start">{{ cls.startTime }}</span>
            <span class="time-end">{{ endTime(cls) }}</span>
          </div>

          <div class="timeline-axis">
            <span class="timeline-dot" :style="{ background: categoryColors[cls.category] }"></span>
            <span class="timeline-line"></span>
          </div>

          <div
            class="timeline-card"
            :class="{ 'is-booked': isBooked(cls.id), 'is-full': spotsLeft(cls) <= 0 && !isBooked(cls.id) }"
            :style="{ '--cat-color': categoryColors[cls.category] }"
          >
            <div class="tc-media" @click="openDetail(cls)">
              <img :src="cls.image" :alt="cls.name" loading="lazy" @error="(e) => { e.target.src = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=400'; }">
              <span v-if="isBooked(cls.id)" class="tc-booked-check">✓</span>
            </div>

            <div class="tc-body">
              <div class="tc-top-row">
                <span class="tc-cat-tag" :style="{ color: categoryColors[cls.category], background: categoryColors[cls.category] + '1c', borderColor: categoryColors[cls.category] + '55' }">
                  {{ t.cats[cls.category] || cls.category }}
                </span>
                <span class="tc-level-tag">{{ translateLevel(cls.level) }}</span>
              </div>

              <h3 class="tc-title" @click="openDetail(cls)">{{ cls.name }}</h3>

              <div class="tc-instructor-row">
                <img :src="cls.instructorAvatar" :alt="cls.instructor" class="tc-avatar" />
                <span class="tc-instructor-name">{{ cls.instructor }}</span>
                <span class="tc-dot-sep">·</span>
                <span class="tc-duration">{{ cls.duration }} {{ t.minutesShort }}</span>
              </div>
            </div>

            <div class="tc-action-col">
              <div class="capacity-ring" :style="ringStyle(cls)">
                <div class="capacity-ring-inner">
                  <span class="ring-num">{{ spotsLeft(cls) }}</span>
                  <span class="ring-label">{{ t.spotsShort }}</span>
                </div>
              </div>

              <button
                v-if="isBooked(cls.id)"
                class="btn-pill cancel-action"
                @click="cancelBooking(cls)"
              >{{ t.cancelBookingBtn }}</button>
              <button
                v-else
                class="btn-pill"
                :disabled="spotsLeft(cls) <= 0"
                @click="bookClass(cls)"
              >{{ spotsLeft(cls) <= 0 ? t.fullBtn : t.bookBtn }}</button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state-box glass-card">
        <div class="waiting-icon-ring">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </div>
        <h3>{{ t.emptyTitle }}</h3>
        <p>{{ t.emptyDesc }}</p>
      </div>

    </main>

    <!-- MODAL DE DETALLE -->
    <div class="modal-backdrop" v-if="selectedClass" @click.self="selectedClass = null">
      <div class="modal-content glass-card custom-scrollbar" :style="{ '--cat-color': categoryColors[selectedClass.category] }">
        <div class="modal-hero-media">
          <img :src="selectedClass.image" :alt="selectedClass.name" @error="(e) => { e.target.src = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800'; }">
          <div class="modal-hero-overlay"></div>
          <button class="close-btn" @click="selectedClass = null">&times;</button>
          <span class="modal-cat-tag" :style="{ color: categoryColors[selectedClass.category], background: categoryColors[selectedClass.category] + '26', borderColor: categoryColors[selectedClass.category] + '55' }">
            {{ t.cats[selectedClass.category] || selectedClass.category }}
          </span>
          <h2 class="modal-hero-title">{{ selectedClass.name }}</h2>
        </div>

        <div class="modal-body">
          <p class="modal-desc">{{ selectedClass.description }}</p>

          <div class="modal-instructor-row">
            <img :src="selectedClass.instructorAvatar" :alt="selectedClass.instructor" class="tc-avatar lg" />
            <div>
              <span class="modal-instructor-name">{{ selectedClass.instructor }}</span>
              <span class="modal-instructor-role">{{ t.instructorLabel }}</span>
            </div>
          </div>

          <div class="modal-info-grid">
            <div class="modal-info-item">
              <span class="info-label">{{ t.scheduleLabel }}</span>
              <span class="info-value">{{ t.days[selectedClass.day] }} · {{ selectedClass.startTime }}</span>
            </div>
            <div class="modal-info-item">
              <span class="info-label">{{ t.durationLabel }}</span>
              <span class="info-value">{{ selectedClass.duration }} {{ t.minutesShort }}</span>
            </div>
            <div class="modal-info-item">
              <span class="info-label">{{ t.spotsLabel }}</span>
              <span class="info-value">{{ spotsLeft(selectedClass) }} / {{ selectedClass.capacity }}</span>
            </div>
            <div class="modal-info-item">
              <span class="info-label">{{ t.levelLabel }}</span>
              <span class="info-value">{{ translateLevel(selectedClass.level) }}</span>
            </div>
          </div>

          <div class="modal-footer">
            <button
              v-if="isBooked(selectedClass.id)"
              class="btn-pill cancel-action wide"
              @click="cancelBooking(selectedClass)"
            >{{ t.cancelBookingBtn }}</button>
            <button
              v-else
              class="btn-pill wide"
              :disabled="spotsLeft(selectedClass) <= 0"
              @click="bookClass(selectedClass)"
            >{{ spotsLeft(selectedClass) <= 0 ? t.fullBtn : t.bookBtn }}</button>
          </div>
        </div>
      </div>
    </div>

  </div>
  </HeadingMember>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Archivo+Black&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;600;700&display=swap');

.classes-wrapper {
  background: var(--bg-custom, #0a0a0a);
  min-height: 100vh;
  color: var(--color-texto-general, #f5f5f4);
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
}

.classes-main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 40px clamp(16px, 3vw, 32px) 60px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.glass-card {
  background: var(--bg-cards, #121212);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.08));
  border-radius: var(--app-border-radius, 22px);
}

/* ==================== HERO ==================== */
.hero-banner {
  position: relative;
  border-radius: var(--app-border-radius, 22px);
  overflow: hidden;
  min-height: 260px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 32px 30px 46px;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.5);
}

.hero-bg-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.hero-gradient {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(5,5,5,0.55) 0%, rgba(8,8,10,0.65) 45%, rgba(6,6,8,0.96) 100%);
}

.hero-content { position: relative; z-index: 2; display: flex; flex-direction: column; gap: 10px; }

.gym-badge-tag {
  align-self: flex-start;
  font-family: 'Oswald', sans-serif;
  font-size: 0.68rem;
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(96, 165, 250, 0.4);
  color: #93c5fd;
  padding: 5px 12px;
  border-radius: 50px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  backdrop-filter: blur(6px);
}

.main-heading {
  font-family: 'Anton', sans-serif;
  font-size: 2.3rem;
  font-weight: 400;
  margin: 0;
  color: #fff;
  letter-spacing: 0.3px;
  line-height: 1.1;
  text-transform: uppercase;
}
.highlight-color { color: var(--color-highlight, #60a5fa); }

.hero-desc { font-size: 0.92rem; color: rgba(245, 245, 244, 0.75); margin: 0; font-weight: 500; line-height: 1.5; max-width: 520px; }

/* ==================== BARRA DE MÉTRICAS (CORREGIDA) ==================== */
.stats-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px clamp(16px, 3vw, 28px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
  gap: 12px;
}

.stat-item-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
  padding: 4px;
}

.stat-icon-box {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.25);
  color: var(--color-highlight, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-icon-box.accent-icon-box { background: rgba(52, 211, 153, 0.1); border-color: rgba(52, 211, 153, 0.3); color: #34d399; }

.stat-item-text { display: flex; flex-direction: column; min-width: 0; }
.stat-num { font-family: 'Oswald', sans-serif; font-size: 1.2rem; font-weight: 700; color: #fff; line-height: 1.1; }
.stat-label {
  font-size: 0.62rem; text-transform: uppercase; color: rgba(245, 245, 244, 0.5); font-weight: 600;
  letter-spacing: 0.3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.stat-divider { width: 1px; height: 30px; background: rgba(255, 255, 255, 0.08); flex-shrink: 0; }

/* ==================== SELECTOR DE FECHA ==================== */
.date-strip-wrapper {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.date-strip-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.date-chip {
  position: relative;
  flex: 0 0 60px;
  background: rgba(255, 255, 255, 0.03);
  border: 1.5px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 10px 4px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  cursor: pointer;
  transition: all 0.18s ease;
  color: rgba(245, 245, 244, 0.65);
}
.date-chip:hover { border-color: rgba(59, 130, 246, 0.4); color: #fff; transform: translateY(-1px); }
.date-chip.active {
  background: var(--color-botones, #3b82f6);
  border-color: var(--color-botones, #3b82f6);
  color: var(--color-texto-botones, #fff);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
}
.date-chip-day { font-family: 'Oswald', sans-serif; font-size: 0.66rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; opacity: 0.8; }
.date-chip-num { font-family: 'Anton', sans-serif; font-size: 1.2rem; line-height: 1.15; }
.date-chip-today-dot { position: absolute; top: 6px; right: 8px; width: 5px; height: 5px; border-radius: 50%; background: #34d399; }
.date-chip-count {
  font-size: 0.6rem; font-weight: 700; background: rgba(255,255,255,0.12);
  padding: 1px 6px; border-radius: 20px; margin-top: 2px;
}
.date-chip.active .date-chip-count { background: rgba(255,255,255,0.25); }

.only-booked-toggle { display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none; align-self: flex-start; }
.only-booked-toggle input { display: none; }
.toggle-track {
  width: 36px; height: 20px; border-radius: 20px; background: rgba(255, 255, 255, 0.12);
  position: relative; transition: background 0.2s ease; flex-shrink: 0;
}
.toggle-thumb {
  position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%;
  background: #fff; transition: transform 0.2s ease;
}
.only-booked-toggle input:checked + .toggle-track { background: var(--color-botones, #3b82f6); }
.only-booked-toggle input:checked + .toggle-track .toggle-thumb { transform: translateX(16px); }
.toggle-label-text { font-size: 0.8rem; font-weight: 600; color: rgba(245, 245, 244, 0.7); }

/* ==================== LEYENDA DE CATEGORÍAS ==================== */
.category-legend-row { display: flex; gap: 8px; flex-wrap: wrap; }

.legend-chip {
  display: flex; align-items: center; gap: 7px;
  background: rgba(255, 255, 255, 0.035);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  color: rgba(245, 245, 244, 0.7);
  padding: 7px 14px;
  border-radius: 50px;
  font-family: 'Oswald', sans-serif;
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s ease;
}
.legend-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--cat-dot, #3b82f6); flex-shrink: 0; }
.legend-chip:hover { border-color: rgba(255,255,255,0.25); color: #fff; transform: translateY(-1px); }
.legend-chip.active {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

/* ==================== TIMELINE ==================== */
.timeline-container { display: flex; flex-direction: column; }

.timeline-row { display: flex; gap: 14px; }

.timeline-time-col {
  flex: 0 0 52px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-top: 14px;
  gap: 1px;
}
.time-start { font-family: 'Oswald', sans-serif; font-size: 0.85rem; font-weight: 700; color: #fff; }
.time-end { font-size: 0.66rem; color: rgba(245, 245, 244, 0.4); font-weight: 600; }

.timeline-axis { flex: 0 0 16px; display: flex; flex-direction: column; align-items: center; }
.timeline-dot { width: 12px; height: 12px; border-radius: 50%; margin-top: 16px; box-shadow: 0 0 0 4px rgba(255,255,255,0.05); flex-shrink: 0; }
.timeline-line { flex: 1; width: 2px; background: rgba(255, 255, 255, 0.08); margin-top: 4px; min-height: 20px; }
.timeline-row:last-child .timeline-line { display: none; }

.timeline-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--bg-cards, #121212);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.08));
  border-left: 3px solid var(--cat-color, #3b82f6);
  border-radius: 16px;
  padding: 14px 16px;
  margin-bottom: 14px;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
.timeline-card:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(0,0,0,0.35); }
.timeline-card.is-booked { background: color-mix(in srgb, var(--cat-color, #3b82f6) 6%, var(--bg-cards, #121212)); }
.timeline-card.is-full { opacity: 0.65; }

.tc-media { position: relative; width: 64px; height: 64px; border-radius: 12px; overflow: hidden; flex-shrink: 0; cursor: pointer; background: #050505; }
.tc-media img { width: 100%; height: 100%; object-fit: cover; }
.tc-booked-check {
  position: absolute; bottom: 3px; right: 3px; background: #10b981; color: #fff;
  width: 17px; height: 17px; border-radius: 50%; font-size: 0.62rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center; border: 2px solid var(--bg-cards, #121212);
}

.tc-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
.tc-top-row { display: flex; gap: 6px; align-items: center; }
.tc-cat-tag {
  font-family: 'Oswald', sans-serif; font-size: 0.62rem; font-weight: 700; padding: 2px 8px;
  border-radius: 6px; text-transform: uppercase; letter-spacing: 0.4px; border: 1px solid;
}
.tc-level-tag { font-size: 0.68rem; color: rgba(245, 245, 244, 0.45); font-weight: 600; }

.tc-title { margin: 0; font-family: 'Oswald', sans-serif; font-size: 1rem; color: var(--color-titulos, #ffffff); cursor: pointer; line-height: 1.25; }
.tc-title:hover { text-decoration: underline; text-underline-offset: 3px; }

.tc-instructor-row { display: flex; align-items: center; gap: 7px; font-size: 0.76rem; color: rgba(245, 245, 244, 0.55); }
.tc-avatar { width: 20px; height: 20px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.tc-avatar.lg { width: 44px; height: 44px; }
.tc-instructor-name { font-weight: 600; color: rgba(245, 245, 244, 0.8); }
.tc-dot-sep { opacity: 0.4; }

.tc-action-col { display: flex; flex-direction: column; align-items: center; gap: 8px; flex-shrink: 0; }

.capacity-ring {
  width: 46px; height: 46px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}
.capacity-ring-inner {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--bg-cards, #121212);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.ring-num { font-family: 'Oswald', sans-serif; font-size: 0.72rem; font-weight: 800; color: #fff; line-height: 1; }
.ring-label { font-size: 0.42rem; text-transform: uppercase; color: rgba(245, 245, 244, 0.4); font-weight: 700; letter-spacing: 0.3px; }

.btn-pill {
  background: var(--color-botones, #3b82f6);
  color: var(--color-texto-botones, white);
  border: none;
  padding: 7px 14px;
  border-radius: 50px;
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  cursor: pointer;
  white-space: nowrap;
  transition: filter 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease;
}
.btn-pill:hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 6px 14px rgba(59, 130, 246, 0.35); }
.btn-pill:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; filter: none; }
.btn-pill.cancel-action { background: rgba(248, 113, 113, 0.14); color: #f87171; border: 1px solid rgba(248, 113, 113, 0.35); }
.btn-pill.cancel-action:hover { background: rgba(248, 113, 113, 0.24); box-shadow: none; }
.btn-pill.wide { width: 100%; padding: 12px; font-size: 0.78rem; }

/* ==================== EMPTY STATE ==================== */
.empty-state-box {
  text-align: center; padding: 56px 24px; display: flex; flex-direction: column;
  align-items: center; gap: 16px; color: rgba(245, 245, 244, 0.6);
}
.waiting-icon-ring {
  width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.25); color: var(--color-highlight, #3b82f6);
}
.empty-state-box h3 { margin: 0; color: #fff; font-family: 'Anton', sans-serif; font-size: 1.15rem; text-transform: uppercase; letter-spacing: 0.3px; }
.empty-state-box p { margin: 0; font-size: 0.85rem; max-width: 340px; line-height: 1.5; }

/* ==================== MODAL ==================== */
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; z-index: 99999; padding: 20px; box-sizing: border-box;
}
.modal-content {
  width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto;
  background: var(--bg-cards, #111111) !important; border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.12)) !important;
  border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
  animation: modalAppear 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes modalAppear { from { opacity: 0; transform: translateY(15px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

.custom-scrollbar::-webkit-scrollbar, .custom-scrollbar-x::-webkit-scrollbar { width: 6px; height: 5px; }
.custom-scrollbar::-webkit-scrollbar-track, .custom-scrollbar-x::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb, .custom-scrollbar-x::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }

.modal-hero-media { position: relative; height: 180px; width: 100%; }
.modal-hero-media img { width: 100%; height: 100%; object-fit: cover; border-radius: 24px 24px 0 0; }
.modal-hero-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(10,10,10,0.85) 100%); border-radius: 24px 24px 0 0; }

.close-btn {
  position: absolute; top: 12px; right: 12px; z-index: 3;
  background: rgba(0, 0, 0, 0.5); border: 1px solid rgba(255, 255, 255, 0.2); color: #fff;
  width: 32px; height: 32px; border-radius: 50%; font-size: 1.2rem; display: flex;
  align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s ease;
}
.close-btn:hover { background: rgba(0, 0, 0, 0.75); }

.modal-cat-tag {
  position: absolute; bottom: 44px; left: 20px; z-index: 2;
  font-family: 'Oswald', sans-serif; font-size: 0.64rem; font-weight: 700; padding: 4px 10px;
  border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid;
}
.modal-hero-title {
  position: absolute; bottom: 12px; left: 20px; right: 20px; z-index: 2; margin: 0;
  font-family: 'Anton', sans-serif; font-size: 1.35rem; color: #fff; text-transform: uppercase; letter-spacing: 0.3px;
}

.modal-body { padding: 22px; display: flex; flex-direction: column; gap: 18px; }
.modal-desc { font-size: 0.86rem; color: rgba(245, 245, 244, 0.72); margin: 0; line-height: 1.6; }

.modal-instructor-row { display: flex; align-items: center; gap: 12px; }
.modal-instructor-name { display: block; font-size: 0.88rem; font-weight: 700; color: #fff; }
.modal-instructor-role { display: block; font-size: 0.68rem; color: rgba(245, 245, 244, 0.45); text-transform: uppercase; letter-spacing: 0.3px; margin-top: 1px; }

.modal-info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.modal-info-item {
  display: flex; flex-direction: column; gap: 4px; background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07); padding: 10px 12px; border-radius: 10px;
}
.info-label { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.4px; color: rgba(245, 245, 244, 0.45); font-weight: 700; }
.info-value { font-size: 0.83rem; color: #fff; font-weight: 600; }

.modal-footer { margin-top: 2px; }

/* ==================== RESPONSIVE ==================== */
@media (max-width: 640px) {
  .classes-main { padding: 16px 10px 40px; gap: 16px; }

  .hero-banner { padding: 22px 18px 26px; min-height: 200px; border-radius: 18px; }
  .main-heading { font-size: 1.5rem; }
  .hero-desc { font-size: 0.85rem; max-width: 100%; }
  .gym-badge-tag { font-size: 0.62rem; padding: 4px 10px; }

  .stats-bar { padding: 12px 8px; border-radius: 16px; }
  .stat-item-bar { flex-direction: column; gap: 6px; text-align: center; padding: 2px; }
  .stat-item-text { align-items: center; }
  .stat-icon-box { width: 28px; height: 28px; }
  .stat-num { font-size: 1.02rem; }
  .stat-label { font-size: 0.54rem; white-space: normal; line-height: 1.15; }
  .stat-divider { height: 34px; }

  .date-strip-wrapper { padding: 16px 12px; border-radius: 16px; }
  .date-chip { flex: 0 0 52px; padding: 8px 3px 6px; }

  .category-legend-row {gap: 6px; }
  .legend-chip { padding: 6px 11px; font-size: 0.7rem; }

  .timeline-time-col { flex: 0 0 40px; padding-top: 12px; }
  .timeline-axis { flex: 0 0 14px; }

  .timeline-card { flex-wrap: wrap; padding: 12px; gap: 12px; }
  .tc-media { width: 56px; height: 56px; }
  .tc-body { flex: 1 1 auto; }
  .tc-action-col {
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin-top: 2px;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .modal-content { max-width: 100%; }
  .modal-info-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 380px) {
  .stats-bar { flex-direction: column; gap: 10px; }
  .stat-divider { width: 100%; height: 1px; }
  .stat-item-bar { flex-direction: row; justify-content: flex-start; width: 100%; padding-left: 8px; }
  .stat-item-text { align-items: flex-start; }
}
</style>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useLang } from '../useLang.js';
import HeadingMember from '../HeadingMember.vue';

const { lang } = useLang();

const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const categoryKeys = ['yoga', 'spinning', 'crossfit', 'boxing', 'pilates', 'zumba'];

const categoryColors = {
  yoga: '#a855f7',
  spinning: '#f97316',
  crossfit: '#ef4444',
  boxing: '#eab308',
  pilates: '#14b8a6',
  zumba: '#ec4899'
};

const props = defineProps({
  classesList: {
    type: Array,
    default: () => [
      { id: 'c1', name: 'Power Yoga', category: 'yoga', level: 'Principiante', day: 'mon', startTime: '07:00', duration: 45, capacity: 20, booked: 12, instructor: 'Marisol Reyes', instructorAvatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=150', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400', description: 'Sesión de yoga dinámico enfocada en fuerza, flexibilidad y respiración controlada.' },
      { id: 'c2', name: 'Spinning HIIT', category: 'spinning', level: 'Intermedio', day: 'mon', startTime: '18:30', duration: 40, capacity: 18, booked: 18, instructor: 'Daniel Ortiz', instructorAvatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=150', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400', description: 'Cardio de alta intensidad sobre bicicleta estática con intervalos cronometrados.' },
      { id: 'c3', name: 'CrossFit WOD', category: 'crossfit', level: 'Avanzado', day: 'mon', startTime: '19:30', duration: 60, capacity: 15, booked: 9, instructor: 'Luis Fernández', instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400', description: 'Entrenamiento funcional de alta intensidad con movimientos variados cada sesión.' },
      { id: 'c4', name: 'Boxeo Fitness', category: 'boxing', level: 'Intermedio', day: 'wed', startTime: '20:00', duration: 50, capacity: 16, booked: 6, instructor: 'Karla Jiménez', instructorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150', image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&q=80&w=400', description: 'Técnica de boxeo combinada con acondicionamiento cardiovascular.' },
      { id: 'c5', name: 'Pilates Reformer', category: 'pilates', level: 'Principiante', day: 'thu', startTime: '09:00', duration: 45, capacity: 12, booked: 12, instructor: 'Marisol Reyes', instructorAvatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=150', image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=400', description: 'Trabajo de core y postura con control total del movimiento.' },
      { id: 'c6', name: 'Zumba Party', category: 'zumba', level: 'Principiante', day: 'fri', startTime: '18:00', duration: 50, capacity: 25, booked: 14, instructor: 'Karla Jiménez', instructorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=400', description: 'Baile con ritmos latinos, quema calórica y mucha energía en grupo.' },
      { id: 'c7', name: 'Yoga Restaurativo', category: 'yoga', level: 'Principiante', day: 'wed', startTime: '07:30', duration: 40, capacity: 20, booked: 5, instructor: 'Marisol Reyes', instructorAvatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=150', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400', description: 'Estiramientos profundos y respiración para liberar tensión acumulada.' },
      { id: 'c8', name: 'Spinning Endurance', category: 'spinning', level: 'Avanzado', day: 'fri', startTime: '07:00', duration: 45, capacity: 18, booked: 4, instructor: 'Daniel Ortiz', instructorAvatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=150', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400', description: 'Recorrido de resistencia con cambios de ritmo sostenidos.' }
    ]
  },
  initialBookings: { type: Array, default: () => [] }
});

const emit = defineEmits(['book-class', 'cancel-class']);

// -------------------- TRADUCCIONES --------------------
const traducciones = {
  es: {
    headerTag: 'Clases Grupales',
    mainTitle1: 'Reserva tus',
    mainTitle2: 'Clases',
    heroDesc: 'Elige el horario que más te acomode y asegura tu lugar antes de que se llene.',
    summaryMyBookings: 'Mis reservas',
    summarySelectedDay: 'Clases este día',
    summarySpotsLeft: 'Lugares hoy',
    onlyMyBookingsLabel: 'Solo mis reservas',
    categoryAll: 'Todas',
    instructorLabel: 'Instructor',
    minutesShort: 'min',
    spotsShort: 'lugares',
    bookBtn: 'Reservar',
    fullBtn: 'Lleno',
    cancelBookingBtn: 'Cancelar',
    scheduleLabel: 'Horario',
    durationLabel: 'Duración',
    spotsLabel: 'Cupo',
    levelLabel: 'Nivel',
    emptyTitle: 'No hay clases este día',
    emptyDesc: 'Prueba otro día o cambia el filtro de categoría.',
    levelBeginner: 'Principiante',
    levelIntermediate: 'Intermedio',
    levelAdvanced: 'Avanzado',
    days: { mon: 'Lunes', tue: 'Martes', wed: 'Miércoles', thu: 'Jueves', fri: 'Viernes', sat: 'Sábado', sun: 'Domingo' },
    daysShort: { mon: 'Lun', tue: 'Mar', wed: 'Mié', thu: 'Jue', fri: 'Vie', sat: 'Sáb', sun: 'Dom' },
    cats: { yoga: 'Yoga', spinning: 'Spinning', crossfit: 'CrossFit', boxing: 'Boxeo', pilates: 'Pilates', zumba: 'Zumba' }
  },
  en: {
    headerTag: 'Group Classes',
    mainTitle1: 'Book your',
    mainTitle2: 'Classes',
    heroDesc: 'Pick the schedule that fits you best and grab your spot before it fills up.',
    summaryMyBookings: 'My bookings',
    summarySelectedDay: 'Classes this day',
    summarySpotsLeft: 'Spots today',
    onlyMyBookingsLabel: 'Only my bookings',
    categoryAll: 'All',
    instructorLabel: 'Instructor',
    minutesShort: 'min',
    spotsShort: 'spots',
    bookBtn: 'Book',
    fullBtn: 'Full',
    cancelBookingBtn: 'Cancel',
    scheduleLabel: 'Schedule',
    durationLabel: 'Duration',
    spotsLabel: 'Capacity',
    levelLabel: 'Level',
    emptyTitle: 'No classes this day',
    emptyDesc: 'Try another day or change the category filter.',
    levelBeginner: 'Beginner',
    levelIntermediate: 'Intermediate',
    levelAdvanced: 'Advanced',
    days: { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' },
    daysShort: { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' },
    cats: { yoga: 'Yoga', spinning: 'Spinning', crossfit: 'CrossFit', boxing: 'Boxing', pilates: 'Pilates', zumba: 'Zumba' }
  }
};

const t = computed(() => traducciones[lang.value] || traducciones.es);

const translateLevel = (level) => {
  if (level === 'Principiante') return t.value.levelBeginner;
  if (level === 'Intermedio') return t.value.levelIntermediate;
  if (level === 'Avanzado') return t.value.levelAdvanced;
  return level;
};

// -------------------- FECHAS (tira estilo calendario) --------------------
const jsDayToKey = (jsDay) => dayKeys[(jsDay + 6) % 7];

const weekDates = (() => {
  const arr = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    arr.push({
      date: d,
      dateNum: d.getDate(),
      dayKey: jsDayToKey(d.getDay()),
      isToday: i === 0
    });
  }
  return arr;
})();

const selectedDateIndex = ref(0);
const selectedDayKey = computed(() => weekDates[selectedDateIndex.value].dayKey);

// -------------------- ESTADO DE RESERVAS --------------------
const bookedCounts = reactive({});
props.classesList.forEach((c) => { bookedCounts[c.id] = c.booked || 0; });

const myBookings = ref([...props.initialBookings]);
const activeCategory = ref('all');
const onlyMyBookings = ref(false);
const selectedClass = ref(null);

const isBooked = (id) => myBookings.value.includes(id);

const spotsLeft = (cls) => {
  const bookedCount = bookedCounts[cls.id] ?? cls.booked ?? 0;
  return Math.max(cls.capacity - bookedCount, 0);
};

const occupancyRatio = (cls) => {
  const bookedCount = bookedCounts[cls.id] ?? cls.booked ?? 0;
  if (!cls.capacity) return 0;
  return Math.min(bookedCount / cls.capacity, 1);
};

const ringStyle = (cls) => {
  const ratio = occupancyRatio(cls);
  const color = ratio >= 1 ? '#f87171' : ratio >= 0.75 ? '#f59e0b' : (categoryColors[cls.category] || 'var(--color-highlight, #3b82f6)');
  return {
    background: `conic-gradient(${color} ${ratio * 360}deg, rgba(255,255,255,0.08) ${ratio * 360}deg)`
  };
};

const endTime = (cls) => {
  const [h, m] = cls.startTime.split(':').map(Number);
  const total = h * 60 + m + cls.duration;
  const eh = Math.floor(total / 60) % 24;
  const em = total % 60;
  return `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`;
};

const bookClass = (cls) => {
  if (spotsLeft(cls) <= 0 || isBooked(cls.id)) return;
  bookedCounts[cls.id] = (bookedCounts[cls.id] ?? cls.booked ?? 0) + 1;
  myBookings.value.push(cls.id);
  emit('book-class', cls);
};

const cancelBooking = (cls) => {
  if (!isBooked(cls.id)) return;
  bookedCounts[cls.id] = Math.max((bookedCounts[cls.id] ?? cls.booked ?? 0) - 1, 0);
  myBookings.value = myBookings.value.filter((id) => id !== cls.id);
  emit('cancel-class', cls);
};

const openDetail = (cls) => { selectedClass.value = cls; };

// -------------------- DERIVADOS --------------------
const selectedDayClasses = computed(() => {
  return props.classesList
    .filter((c) => c.day === selectedDayKey.value)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
});

const filteredDayClasses = computed(() => {
  return selectedDayClasses.value.filter((cls) => {
    if (activeCategory.value !== 'all' && cls.category !== activeCategory.value) return false;
    if (onlyMyBookings.value && !isBooked(cls.id)) return false;
    return true;
  });
});

const classCountByDay = computed(() => {
  const counts = {};
  props.classesList.forEach((c) => { counts[c.day] = (counts[c.day] || 0) + 1; });
  return counts;
});

const totalSpotsLeftToday = computed(() => {
  return selectedDayClasses.value.reduce((sum, c) => sum + spotsLeft(c), 0);
});
</script>
