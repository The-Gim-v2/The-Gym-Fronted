<template>
  <HeadingMember>
    <div class="saas-dashboard-wrapper">
      <main class="dashboard-main-container">

        <!-- HEADER -->
        <section class="glass-card header-card">
          <div class="header-top-row">
            <span class="gym-badge-tag">{{ t.badgeTag }}</span>
            <div class="header-counter-pill" v-if="history.length">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 3v18h18"></path><path d="M18.7 8l-5.1 5.1-4-4L3 15.5"></path></svg>
              <span>{{ history.length }} {{ t.recordsLabel }}</span>
            </div>
          </div>
          <div class="header-titles">
            <h1 class="main-heading">
              {{ t.mainTitle1 }} <span class="highlight-color">{{ t.mainTitle2 }}</span>
            </h1>
            <p class="hero-desc">{{ t.heroDesc }}</p>
          </div>
        </section>

        <!-- PERFIL BASE (compartido entre módulos) -->
        <section class="glass-card profile-panel">
          <div class="panel-title-row">
            <span class="panel-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              {{ t.profileTitle }}
            </span>
            <span class="panel-hint">{{ t.profileHint }}</span>
          </div>
          <div class="fields-grid">
            <div class="input-group">
              <label>{{ t.ageLabel }}</label>
              <input type="number" v-model.number="profile.age" min="10" max="100" class="styled-input" />
            </div>
            <div class="input-group">
              <label>{{ t.genderLabel }}</label>
              <select v-model="profile.gender" class="styled-select">
                <option value="male">{{ t.genderMale }}</option>
                <option value="female">{{ t.genderFemale }}</option>
              </select>
            </div>
            <div class="input-group">
              <label>{{ t.weightLabel }} (kg)</label>
              <input type="number" v-model.number="profile.weight" min="30" max="250" class="styled-input" />
            </div>
            <div class="input-group">
              <label>{{ t.heightLabel }} (cm)</label>
              <input type="number" v-model.number="profile.height" min="100" max="230" class="styled-input" />
            </div>
            <div class="input-group">
              <label>{{ t.activityLabel }}</label>
              <select v-model="profile.activity" class="styled-select">
                <option value="sedentary">{{ t.activitySedentary }}</option>
                <option value="light">{{ t.activityLight }}</option>
                <option value="moderate">{{ t.activityModerate }}</option>
                <option value="active">{{ t.activityActive }}</option>
                <option value="veryActive">{{ t.activityVeryActive }}</option>
              </select>
            </div>
            <div class="input-group">
              <label>{{ t.restingHrLabel }}</label>
              <input type="number" v-model.number="profile.restingHR" min="30" max="120" class="styled-input" :placeholder="t.optionalPlaceholder" />
            </div>
          </div>
        </section>

        <!-- TAB STRIP -->
        <div class="tab-strip-row">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="tab-strip-btn"
            :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            <component :is="tab.iconRender" />
            {{ tab.label }}
          </button>
        </div>

        <!-- ===================== TAB: COMPOSICIÓN ===================== -->
        <div v-if="activeTab === 'composition'" class="tab-content">

          <section class="glass-card advanced-measure-card">
            <div class="panel-title-row">
              <span class="panel-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 21l-4.35-4.35"></path><circle cx="10" cy="10" r="7"></circle></svg>
                {{ t.measurementsTitle }}
              </span>
              <span class="panel-hint">{{ t.measurementsHint }}</span>
            </div>
            <div class="fields-grid">
              <div class="input-group">
                <label>{{ t.neckLabel }} (cm)</label>
                <input type="number" v-model.number="measures.neck" min="20" max="60" class="styled-input" :placeholder="t.optionalPlaceholder" />
              </div>
              <div class="input-group">
                <label>{{ t.waistLabel }} (cm)</label>
                <input type="number" v-model.number="measures.waist" min="40" max="200" class="styled-input" :placeholder="t.optionalPlaceholder" />
              </div>
              <div class="input-group" v-if="profile.gender === 'female'">
                <label>{{ t.hipLabel }} (cm)</label>
                <input type="number" v-model.number="measures.hip" min="40" max="200" class="styled-input" :placeholder="t.optionalPlaceholder" />
              </div>
              <div class="input-group">
                <label>{{ t.wristLabel }} (cm)</label>
                <input type="number" v-model.number="measures.wrist" min="10" max="25" class="styled-input" :placeholder="t.optionalPlaceholder" />
              </div>
            </div>
          </section>

          <!-- IMC destacado -->
          <section class="glass-card imc-hero-card">
            <div class="imc-ring-wrapper">
              <div class="imc-ring" :style="imcRingStyle">
                <div class="imc-ring-inner">
                  <span class="imc-value">{{ comp.imc }}</span>
                  <span class="imc-unit">{{ t.imcLabel }}</span>
                </div>
              </div>
            </div>
            <div class="imc-info">
              <span class="imc-category-badge" :style="{ color: imcColor, background: imcColor + '1c', borderColor: imcColor + '55' }">
                {{ comp.imcCategory }}
              </span>
              <h3>{{ t.imcResultTitle }}</h3>
              <p>{{ t.imcResultDesc }}</p>
              <div class="ideal-weight-row">
                <span class="ideal-weight-label">{{ t.idealWeightLabel }}</span>
                <span class="ideal-weight-value">{{ comp.idealWeightMin }} – {{ comp.idealWeightMax }} kg</span>
              </div>
            </div>
          </section>

          <!-- Métricas secundarias de composición -->
          <section class="metrics-cards-grid">
            <div class="metric-result-card" v-if="comp.bodyFat !== null">
              <div class="metric-icon-box warning-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <div class="metric-result-text">
                <span class="metric-result-value">{{ comp.bodyFat }}%</span>
                <span class="metric-result-label">{{ t.bodyFatLabel }}</span>
                <span class="metric-result-sub">{{ comp.bodyFatCategory }}</span>
              </div>
            </div>
            <div class="metric-result-card" v-if="comp.leanMass !== null">
              <div class="metric-icon-box success-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6.5 6.5h11L21 21H3z"></path></svg>
              </div>
              <div class="metric-result-text">
                <span class="metric-result-value">{{ comp.leanMass }} kg</span>
                <span class="metric-result-label">{{ t.leanMassLabel }}</span>
              </div>
            </div>
            <div class="metric-result-card" v-if="comp.fatMass !== null">
              <div class="metric-icon-box neutral-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9"></circle></svg>
              </div>
              <div class="metric-result-text">
                <span class="metric-result-value">{{ comp.fatMass }} kg</span>
                <span class="metric-result-label">{{ t.fatMassLabel }}</span>
              </div>
            </div>
            <div class="metric-result-card" v-if="comp.whtr">
              <div class="metric-icon-box info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2l7 4v6c0 5-3 8-7 10-4-2-7-5-7-10V6z"></path></svg>
              </div>
              <div class="metric-result-text">
                <span class="metric-result-value">{{ comp.whtr }}</span>
                <span class="metric-result-label">{{ t.whtrLabel }}</span>
                <span class="metric-result-sub">{{ comp.whtrCategory }}</span>
              </div>
            </div>
            <div class="metric-result-card" v-if="comp.whr">
              <div class="metric-icon-box info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v20M2 12h20"></path></svg>
              </div>
              <div class="metric-result-text">
                <span class="metric-result-value">{{ comp.whr }}</span>
                <span class="metric-result-label">{{ t.whrLabel }}</span>
                <span class="metric-result-sub">{{ comp.whrCategory }}</span>
              </div>
            </div>
            <div class="metric-result-card" v-if="comp.frameSize">
              <div class="metric-icon-box accent-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="4" y="4" width="16" height="16" rx="2"></rect></svg>
              </div>
              <div class="metric-result-text">
                <span class="metric-result-value">{{ comp.frameSize }}</span>
                <span class="metric-result-label">{{ t.frameSizeLabel }}</span>
              </div>
            </div>
          </section>

          <section class="glass-card somatotype-card">
            <h3 class="section-subtitle"><span class="subtitle-dot"></span>{{ t.somatotypeTitle }}</h3>
            <div class="somatotype-row">
              <span class="somatotype-badge">{{ comp.somatotype }}</span>
              <p>{{ comp.somatotypeDesc }}</p>
            </div>
          </section>

          <div class="save-record-row">
            <button class="btn-save-record" @click="saveRecord">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline></svg>
              {{ t.saveRecordBtn }}
            </button>
            <transition name="fade">
              <span v-if="savedToast" class="saved-toast">✓ {{ t.savedToast }}</span>
            </transition>
          </div>
        </div>

        <!-- ===================== TAB: METABOLISMO ===================== -->
        <div v-if="activeTab === 'metabolism'" class="tab-content">

          <section class="glass-card bmr-compare-card">
            <h3 class="section-subtitle"><span class="subtitle-dot"></span>{{ t.bmrCompareTitle }}</h3>
            <div class="bmr-compare-grid">
              <div class="bmr-formula-box">
                <span class="bmr-formula-name">Mifflin-St Jeor</span>
                <span class="bmr-formula-value">{{ metab.bmrMifflin }} kcal</span>
                <span class="bmr-formula-tag">{{ t.bmrRecommendedTag }}</span>
              </div>
              <div class="bmr-formula-box secondary">
                <span class="bmr-formula-name">Harris-Benedict</span>
                <span class="bmr-formula-value">{{ metab.bmrHarris }} kcal</span>
              </div>
            </div>
            <p class="bmr-note">{{ t.bmrNote }}</p>
          </section>

          <section class="metrics-cards-grid">
            <div class="metric-result-card accent">
              <div class="metric-icon-box accent-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div class="metric-result-text">
                <span class="metric-result-value">{{ metab.tdee }} kcal</span>
                <span class="metric-result-label">{{ t.tdeeLabel }}</span>
              </div>
            </div>
            <div class="metric-result-card">
              <div class="metric-icon-box info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
              </div>
              <div class="metric-result-text">
                <span class="metric-result-value">{{ metab.water }} L</span>
                <span class="metric-result-label">{{ t.waterLabel }}</span>
              </div>
            </div>
          </section>

          <section class="glass-card calorie-goals-card">
            <h3 class="section-subtitle"><span class="subtitle-dot pink"></span>{{ t.calorieGoalsTitle }}</h3>
            <div class="calorie-goals-grid">
              <div class="calorie-goal-box cut">
                <span class="goal-label">{{ t.goalCut }}</span>
                <span class="goal-value">{{ metab.calorieCut }} kcal</span>
                <span class="goal-sub">-20%</span>
              </div>
              <div class="calorie-goal-box maintain">
                <span class="goal-label">{{ t.goalMaintainCal }}</span>
                <span class="goal-value">{{ metab.calorieMaintain }} kcal</span>
                <span class="goal-sub">0%</span>
              </div>
              <div class="calorie-goal-box bulk">
                <span class="goal-label">{{ t.goalBulk }}</span>
                <span class="goal-value">{{ metab.calorieBulk }} kcal</span>
                <span class="goal-sub">+15%</span>
              </div>
            </div>
          </section>
        </div>

        <!-- ===================== TAB: FUERZA (1RM) ===================== -->
        <div v-if="activeTab === 'strength'" class="tab-content">
          <section class="glass-card strength-input-card">
            <div class="panel-title-row">
              <span class="panel-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6.5 6.5h11L21 21H3z"></path></svg>
                {{ t.strengthInputTitle }}
              </span>
            </div>
            <div class="fields-grid">
              <div class="input-group">
                <label>{{ t.exerciseLabel }}</label>
                <input type="text" v-model="strength.exercise" class="styled-input" :placeholder="t.exercisePlaceholder" />
              </div>
              <div class="input-group">
                <label>{{ t.liftedWeightLabel }} (kg)</label>
                <input type="number" v-model.number="strength.weight" min="1" max="500" class="styled-input" />
              </div>
              <div class="input-group">
                <label>{{ t.repsLabel }}</label>
                <input type="number" v-model.number="strength.reps" min="1" max="15" class="styled-input" />
              </div>
            </div>
          </section>

          <section class="glass-card orm-hero-card">
            <div class="orm-ring">
              <div class="orm-ring-inner">
                <span class="orm-value">{{ strengthResults.oneRM }}</span>
                <span class="orm-unit">kg · 1RM</span>
              </div>
            </div>
            <div class="orm-formula-list">
              <div class="orm-formula-item">
                <span>Epley</span><strong>{{ strengthResults.epley }} kg</strong>
              </div>
              <div class="orm-formula-item">
                <span>Brzycki</span><strong>{{ strengthResults.brzycki }} kg</strong>
              </div>
            </div>
          </section>

          <section class="glass-card percent-table-card">
            <h3 class="section-subtitle"><span class="subtitle-dot"></span>{{ t.percentTableTitle }}</h3>
            <div class="percent-table">
              <div class="percent-row percent-header">
                <span>{{ t.percentColPct }}</span>
                <span>{{ t.percentColWeight }}</span>
                <span>{{ t.percentColReps }}</span>
              </div>
              <div class="percent-row" v-for="row in percentTable" :key="row.pct">
                <span>{{ row.pct }}%</span>
                <span>{{ row.weight }} kg</span>
                <span>{{ row.reps }}</span>
              </div>
            </div>
          </section>
        </div>

        <!-- ===================== TAB: ZONAS CARDIACAS ===================== -->
        <div v-if="activeTab === 'cardio'" class="tab-content">
          <section class="glass-card hr-hero-card">
            <div class="hr-max-box">
              <span class="hr-max-value">{{ cardio.maxHR }}</span>
              <span class="hr-max-label">{{ t.maxHrLabel }}</span>
              <span class="hr-max-formula">{{ t.tanakaFormula }}</span>
            </div>
          </section>

          <section class="glass-card hr-zones-card">
            <h3 class="section-subtitle"><span class="subtitle-dot"></span>{{ t.hrZonesTitle }}</h3>
            <div class="hr-zones-list">
              <div v-for="zone in cardio.zones" :key="zone.key" class="hr-zone-row">
                <div class="hr-zone-label-col">
                  <span class="hr-zone-color-dot" :style="{ background: zone.color }"></span>
                  <div>
                    <span class="hr-zone-name">{{ zone.name }}</span>
                    <span class="hr-zone-pct">{{ zone.pctMin }}–{{ zone.pctMax }}%</span>
                  </div>
                </div>
                <div class="hr-zone-bar-track">
                  <div class="hr-zone-bar-fill" :style="{ width: zone.pctMax + '%', background: zone.color }"></div>
                </div>
                <span class="hr-zone-bpm">{{ zone.bpmMin }}–{{ zone.bpmMax }} bpm</span>
              </div>
            </div>
            <p class="bmr-note">{{ profile.restingHR ? t.karvonenNote : t.karvonenHint }}</p>
          </section>
        </div>

        <!-- ===================== TAB: HISTORIAL ===================== -->
        <div v-if="activeTab === 'history'" class="tab-content">
          <section v-if="!history.length" class="waiting-box glass-card">
            <div class="waiting-icon-ring">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 3v18h18"></path><path d="M18.7 8l-5.1 5.1-4-4L3 15.5"></path></svg>
            </div>
            <h3>{{ t.emptyHistoryTitle }}</h3>
            <p>{{ t.emptyHistoryDesc }}</p>
          </section>

          <template v-else>
            <section class="glass-card sparkline-card">
              <h3 class="section-subtitle"><span class="subtitle-dot"></span>{{ t.weightTrendTitle }}</h3>
              <div class="sparkline-row">
                <div v-for="entry in history" :key="entry.id" class="sparkline-bar-col">
                  <div class="sparkline-bar-track">
                    <div class="sparkline-bar-fill" :style="{ height: sparklineHeight(entry.weight) + '%' }"></div>
                  </div>
                  <span class="sparkline-date">{{ formatShortDate(entry.date) }}</span>
                </div>
              </div>
            </section>

            <section class="glass-card history-list-card">
              <h3 class="section-subtitle"><span class="subtitle-dot pink"></span>{{ t.historyListTitle }}</h3>
              <div class="history-entries">
                <div v-for="(entry, idx) in reversedHistory" :key="entry.id" class="history-entry-row">
                  <div class="history-entry-date">{{ formatFullDate(entry.date) }}</div>
                  <div class="history-entry-stats">
                    <span class="history-stat"><strong>{{ entry.weight }}</strong> kg</span>
                    <span class="history-stat"><strong>{{ entry.imc }}</strong> {{ t.imcLabel }}</span>
                    <span class="history-stat" v-if="entry.bodyFat !== null"><strong>{{ entry.bodyFat }}%</strong> {{ t.bodyFatLabel }}</span>
                  </div>
                  <span
                    v-if="deltaFor(idx) !== null"
                    class="history-delta"
                    :class="deltaFor(idx) < 0 ? 'down' : deltaFor(idx) > 0 ? 'up' : 'flat'"
                  >
                    <svg v-if="deltaFor(idx) < 0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                    <svg v-else-if="deltaFor(idx) > 0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                    {{ Math.abs(deltaFor(idx)) }} kg
                  </span>
                  <button class="history-delete-btn" @click="removeRecord(entry.id)" :title="t.deleteRecordBtn">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              </div>
            </section>
          </template>
        </div>

        <p class="disclaimer-text">{{ t.disclaimer }}</p>

      </main>
    </div>
  </HeadingMember>
</template>

<script setup>
import { ref, reactive, computed, h } from 'vue';
import { useLang } from '../useLang.js';
import HeadingMember from '../HeadingMember.vue';

const { lang } = useLang();

/* ==================== TRADUCCIONES ==================== */
const traducciones = {
  es: {
    badgeTag: 'Herramientas Corporales',
    recordsLabel: 'registros',
    mainTitle1: 'Centro de Cálculos',
    mainTitle2: 'Corporales',
    heroDesc: 'Composición corporal, metabolismo, fuerza y zonas cardiacas en un solo lugar.',
    profileTitle: 'Perfil Base',
    profileHint: 'Estos datos alimentan todos los módulos',
    ageLabel: 'Edad', genderLabel: 'Género', genderMale: 'Masculino', genderFemale: 'Femenino',
    weightLabel: 'Peso', heightLabel: 'Altura', activityLabel: 'Actividad',
    activitySedentary: 'Sedentario', activityLight: 'Ligero', activityModerate: 'Moderado',
    activityActive: 'Activo', activityVeryActive: 'Muy activo',
    restingHrLabel: 'FC en reposo (bpm)',
    optionalPlaceholder: 'Opcional',
    tabComposition: 'Composición', tabMetabolism: 'Metabolismo', tabStrength: 'Fuerza (1RM)',
    tabCardio: 'Zonas Cardiacas', tabHistory: 'Historial',
    measurementsTitle: 'Medidas Corporales',
    measurementsHint: 'Para grasa corporal, ICC y talla de estructura',
    neckLabel: 'Cuello', waistLabel: 'Cintura', hipLabel: 'Cadera', wristLabel: 'Muñeca',
    imcLabel: 'IMC',
    imcResultTitle: 'Índice de Masa Corporal',
    imcResultDesc: 'Relación entre tu peso y tu estatura. Es un indicador general, no mide directamente la grasa corporal.',
    idealWeightLabel: 'Peso ideal estimado',
    bodyFatLabel: 'Grasa Corporal', leanMassLabel: 'Masa Magra', fatMassLabel: 'Masa Grasa',
    whtrLabel: 'Índice Cintura-Altura', whrLabel: 'Índice Cintura-Cadera', frameSizeLabel: 'Estructura Ósea',
    somatotypeTitle: 'Somatotipo estimado',
    somatotypeDescs: {
      ecto: 'Complexión delgada, metabolismo rápido y dificultad para ganar peso o músculo.',
      meso: 'Complexión atlética, gana músculo con relativa facilidad y mantiene buena definición.',
      endo: 'Complexión más robusta, tiende a almacenar grasa con más facilidad y responde bien al entrenamiento de fuerza.'
    },
    somatotypes: { ecto: 'Ectomorfo', meso: 'Mesomorfo', endo: 'Endomorfo' },
    saveRecordBtn: 'Guardar Registro de Hoy',
    savedToast: 'Registro guardado',
    bmrCompareTitle: 'Comparativa de Metabolismo Basal',
    bmrRecommendedTag: 'Recomendada',
    bmrNote: 'Mifflin-St Jeor es la fórmula más precisa según estudios recientes; Harris-Benedict es la clásica de referencia.',
    tdeeLabel: 'Gasto Calórico Diario (TDEE)',
    waterLabel: 'Hidratación recomendada',
    calorieGoalsTitle: 'Metas Calóricas por Objetivo',
    goalCut: 'Definición', goalMaintainCal: 'Mantenimiento', goalBulk: 'Volumen',
    strengthInputTitle: 'Calculadora de Repetición Máxima (1RM)',
    exerciseLabel: 'Ejercicio', exercisePlaceholder: 'Ej. Press de banca',
    liftedWeightLabel: 'Peso levantado', repsLabel: 'Repeticiones realizadas',
    percentTableTitle: 'Tabla de Porcentajes de Trabajo',
    percentColPct: '% 1RM', percentColWeight: 'Peso', percentColReps: 'Reps. aprox.',
    maxHrLabel: 'Frecuencia Cardiaca Máxima', tanakaFormula: 'Fórmula de Tanaka (208 - 0.7 × edad)',
    hrZonesTitle: 'Zonas de Entrenamiento Cardiovascular',
    zoneNames: { z1: 'Recuperación', z2: 'Quema de grasa', z3: 'Aeróbica', z4: 'Anaeróbica', z5: 'Máximo esfuerzo' },
    karvonenNote: 'Calculado con el método de Karvonen usando tu frecuencia cardiaca en reposo.',
    karvonenHint: 'Añade tu frecuencia cardiaca en reposo en el perfil base para un cálculo más preciso (método Karvonen).',
    emptyHistoryTitle: 'Aún no tienes registros guardados',
    emptyHistoryDesc: 'Ve a la pestaña de Composición y guarda tu primer registro para comenzar a ver tu progreso aquí.',
    weightTrendTitle: 'Tendencia de Peso',
    historyListTitle: 'Registros Guardados',
    deleteRecordBtn: 'Eliminar registro',
    disclaimer: 'Estos resultados son estimaciones basadas en fórmulas estándar (Mifflin-St Jeor, Harris-Benedict, Devine, Marina de EE.UU., Epley, Brzycki, Tanaka, Karvonen) y no sustituyen una evaluación profesional. Consulta a tu entrenador o médico para un plan personalizado.'
  },
  en: {
    badgeTag: 'Body Tools',
    recordsLabel: 'records',
    mainTitle1: 'Body Calculation',
    mainTitle2: 'Center',
    heroDesc: 'Body composition, metabolism, strength and heart-rate zones in one place.',
    profileTitle: 'Base Profile',
    profileHint: 'This data feeds every module',
    ageLabel: 'Age', genderLabel: 'Gender', genderMale: 'Male', genderFemale: 'Female',
    weightLabel: 'Weight', heightLabel: 'Height', activityLabel: 'Activity',
    activitySedentary: 'Sedentary', activityLight: 'Light', activityModerate: 'Moderate',
    activityActive: 'Active', activityVeryActive: 'Very active',
    restingHrLabel: 'Resting HR (bpm)',
    optionalPlaceholder: 'Optional',
    tabComposition: 'Composition', tabMetabolism: 'Metabolism', tabStrength: 'Strength (1RM)',
    tabCardio: 'HR Zones', tabHistory: 'History',
    measurementsTitle: 'Body Measurements',
    measurementsHint: 'For body fat, WHR and frame size',
    neckLabel: 'Neck', waistLabel: 'Waist', hipLabel: 'Hip', wristLabel: 'Wrist',
    imcLabel: 'BMI',
    imcResultTitle: 'Body Mass Index',
    imcResultDesc: 'Ratio between your weight and height. It is a general indicator, it does not directly measure body fat.',
    idealWeightLabel: 'Estimated ideal weight',
    bodyFatLabel: 'Body Fat', leanMassLabel: 'Lean Mass', fatMassLabel: 'Fat Mass',
    whtrLabel: 'Waist-to-Height Ratio', whrLabel: 'Waist-to-Hip Ratio', frameSizeLabel: 'Bone Frame Size',
    somatotypeTitle: 'Estimated Somatotype',
    somatotypeDescs: {
      ecto: 'Slim build, fast metabolism and difficulty gaining weight or muscle.',
      meso: 'Athletic build, gains muscle relatively easily and maintains good definition.',
      endo: 'Sturdier build, tends to store fat more easily and responds well to strength training.'
    },
    somatotypes: { ecto: 'Ectomorph', meso: 'Mesomorph', endo: 'Endomorph' },
    saveRecordBtn: "Save Today's Record",
    savedToast: 'Record saved',
    bmrCompareTitle: 'Basal Metabolic Rate Comparison',
    bmrRecommendedTag: 'Recommended',
    bmrNote: 'Mifflin-St Jeor is the most accurate formula per recent studies; Harris-Benedict is the classic reference.',
    tdeeLabel: 'Total Daily Energy Expenditure',
    waterLabel: 'Recommended hydration',
    calorieGoalsTitle: 'Calorie Targets by Goal',
    goalCut: 'Cutting', goalMaintainCal: 'Maintenance', goalBulk: 'Bulking',
    strengthInputTitle: 'One-Rep Max (1RM) Calculator',
    exerciseLabel: 'Exercise', exercisePlaceholder: 'E.g. Bench press',
    liftedWeightLabel: 'Weight lifted', repsLabel: 'Reps performed',
    percentTableTitle: 'Working Percentage Table',
    percentColPct: '% 1RM', percentColWeight: 'Weight', percentColReps: 'Approx. reps',
    maxHrLabel: 'Max Heart Rate', tanakaFormula: 'Tanaka formula (208 - 0.7 × age)',
    hrZonesTitle: 'Cardiovascular Training Zones',
    zoneNames: { z1: 'Recovery', z2: 'Fat burn', z3: 'Aerobic', z4: 'Anaerobic', z5: 'Max effort' },
    karvonenNote: 'Calculated with the Karvonen method using your resting heart rate.',
    karvonenHint: 'Add your resting heart rate in the base profile for a more precise calculation (Karvonen method).',
    emptyHistoryTitle: "You don't have any saved records yet",
    emptyHistoryDesc: 'Go to the Composition tab and save your first record to start seeing your progress here.',
    weightTrendTitle: 'Weight Trend',
    historyListTitle: 'Saved Records',
    deleteRecordBtn: 'Delete record',
    disclaimer: 'These results are estimates based on standard formulas (Mifflin-St Jeor, Harris-Benedict, Devine, U.S. Navy, Epley, Brzycki, Tanaka, Karvonen) and do not replace a professional evaluation. Consult your trainer or doctor for a personalized plan.'
  }
};

const t = computed(() => traducciones[lang.value] || traducciones.es);

/* ==================== ICONOS DE TABS ==================== */
const iconPaths = {
  composition: () => h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2.5 }, [
    h('path', { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' }), h('circle', { cx: 12, cy: 7, r: 4 })
  ]),
  metabolism: () => h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2.5 }, [
    h('path', { d: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' })
  ]),
  strength: () => h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2.5 }, [
    h('path', { d: 'M6.5 6.5h11L21 21H3z' })
  ]),
  cardio: () => h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2.5 }, [
    h('path', { d: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z' })
  ]),
  history: () => h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2.5 }, [
    h('path', { d: 'M3 3v18h18' }), h('path', { d: 'M18.7 8l-5.1 5.1-4-4L3 15.5' })
  ])
};

const activeTab = ref('composition');
const tabs = computed(() => [
  { key: 'composition', label: t.value.tabComposition, iconRender: iconPaths.composition },
  { key: 'metabolism', label: t.value.tabMetabolism, iconRender: iconPaths.metabolism },
  { key: 'strength', label: t.value.tabStrength, iconRender: iconPaths.strength },
  { key: 'cardio', label: t.value.tabCardio, iconRender: iconPaths.cardio },
  { key: 'history', label: t.value.tabHistory, iconRender: iconPaths.history }
]);

/* ==================== ESTADO ==================== */
const profile = reactive({
  age: 28, gender: 'male', weight: 75, height: 175, activity: 'moderate', restingHR: null
});

const measures = reactive({ neck: null, waist: null, hip: null, wrist: null });

const strength = reactive({ exercise: '', weight: 80, reps: 5 });

const activityFactors = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };

/* ==================== COMPOSICIÓN (reactivo) ==================== */
const comp = computed(() => {
  const { age, gender, weight, height } = profile;
  const heightM = height / 100;
  const imc = weight / (heightM * heightM);

  let imcCategoryKey = 'normal';
  if (imc < 18.5) imcCategoryKey = 'under';
  else if (imc < 25) imcCategoryKey = 'normal';
  else if (imc < 30) imcCategoryKey = 'over';
  else imcCategoryKey = 'obese';

  const imcCategories = {
    under: lang.value === 'es' ? 'Bajo peso' : 'Underweight',
    normal: lang.value === 'es' ? 'Peso normal' : 'Normal weight',
    over: lang.value === 'es' ? 'Sobrepeso' : 'Overweight',
    obese: lang.value === 'es' ? 'Obesidad' : 'Obesity'
  };

  const idealWeightMin = Math.round(18.5 * heightM * heightM * 10) / 10;
  const idealWeightMax = Math.round(24.9 * heightM * heightM * 10) / 10;

  // Grasa corporal (Navy)
  let bodyFat = null;
  const { neck, waist, hip, wrist } = measures;
  if (waist && neck && height) {
    if (gender === 'male' && waist - neck > 0) {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    } else if (gender === 'female' && hip && waist + hip - neck > 0) {
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(height)) - 450;
    }
    if (bodyFat !== null) bodyFat = Math.max(Math.round(bodyFat * 10) / 10, 0);
  }

  let bodyFatCategory = '';
  if (bodyFat !== null) {
    const ranges = gender === 'male'
      ? [[0, 6, 'Esencial/Atlético'], [6, 14, 'Fitness'], [14, 18, 'Aceptable'], [18, 25, 'Sobre el promedio'], [25, 100, 'Alto']]
      : [[0, 14, 'Esencial/Atlético'], [14, 21, 'Fitness'], [21, 25, 'Aceptable'], [25, 32, 'Sobre el promedio'], [32, 100, 'Alto']];
    const rangesEn = gender === 'male'
      ? [[0, 6, 'Essential/Athletic'], [6, 14, 'Fitness'], [14, 18, 'Acceptable'], [18, 25, 'Above average'], [25, 100, 'High']]
      : [[0, 14, 'Essential/Athletic'], [14, 21, 'Fitness'], [21, 25, 'Acceptable'], [25, 32, 'Above average'], [32, 100, 'High']];
    const activeRanges = lang.value === 'es' ? ranges : rangesEn;
    const found = activeRanges.find(([min, max]) => bodyFat >= min && bodyFat < max);
    bodyFatCategory = found ? found[2] : '';
  }

  const leanMass = bodyFat !== null ? Math.round(weight * (1 - bodyFat / 100) * 10) / 10 : null;
  const fatMass = bodyFat !== null ? Math.round((weight - leanMass) * 10) / 10 : null;

  let whtr = null, whtrCategory = '';
  if (waist) {
    whtr = Math.round((waist / height) * 100) / 100;
    whtrCategory = whtr < 0.5
      ? (lang.value === 'es' ? 'Saludable' : 'Healthy')
      : whtr < 0.6
        ? (lang.value === 'es' ? 'Riesgo moderado' : 'Moderate risk')
        : (lang.value === 'es' ? 'Riesgo elevado' : 'High risk');
  }

  let whr = null, whrCategory = '';
  if (waist && hip) {
    whr = Math.round((waist / hip) * 100) / 100;
    const threshold = gender === 'male' ? 0.9 : 0.85;
    whrCategory = whr <= threshold
      ? (lang.value === 'es' ? 'Bajo riesgo' : 'Low risk')
      : (lang.value === 'es' ? 'Riesgo elevado' : 'High risk');
  }

  let frameSize = null;
  if (wrist) {
    const r = height / wrist;
    const thresholds = gender === 'male' ? [10.4, 9.6] : [11, 10.1];
    if (r > thresholds[0]) frameSize = lang.value === 'es' ? 'Pequeña' : 'Small';
    else if (r >= thresholds[1]) frameSize = lang.value === 'es' ? 'Mediana' : 'Medium';
    else frameSize = lang.value === 'es' ? 'Grande' : 'Large';
  }

  let somatotypeKey = 'meso';
  if (imc < 20) somatotypeKey = 'ecto';
  else if (imc >= 26) somatotypeKey = 'endo';

  return {
    imc: imc.toFixed(1),
    imcCategory: imcCategories[imcCategoryKey],
    imcCategoryKey,
    idealWeightMin, idealWeightMax,
    bodyFat, bodyFatCategory,
    leanMass, fatMass,
    whtr, whtrCategory,
    whr, whrCategory,
    frameSize,
    somatotype: t.value.somatotypes[somatotypeKey],
    somatotypeDesc: t.value.somatotypeDescs[somatotypeKey]
  };
});

const imcColor = computed(() => {
  const colors = { under: '#38bdf8', normal: '#4ade80', over: '#facc15', obese: '#f87171' };
  return colors[comp.value.imcCategoryKey] || '#4ade80';
});
const imcRingStyle = computed(() => {
  const imc = parseFloat(comp.value.imc) || 0;
  const ratio = Math.min(imc / 40, 1);
  return { background: `conic-gradient(${imcColor.value} ${ratio * 360}deg, rgba(255,255,255,0.08) ${ratio * 360}deg)` };
});

/* ==================== METABOLISMO (reactivo) ==================== */
const metab = computed(() => {
  const { age, gender, weight, height, activity } = profile;

  let bmrMifflin = 10 * weight + 6.25 * height - 5 * age;
  bmrMifflin += gender === 'male' ? 5 : -161;

  let bmrHarris;
  if (gender === 'male') {
    bmrHarris = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  } else {
    bmrHarris = 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
  }

  const factor = activityFactors[activity] || 1.2;
  const tdee = Math.round(bmrMifflin * factor);
  const waterMl = weight * 35 * (activity === 'active' || activity === 'veryActive' ? 1.1 : 1);

  return {
    bmrMifflin: Math.round(bmrMifflin),
    bmrHarris: Math.round(bmrHarris),
    tdee,
    water: Math.round((waterMl / 1000) * 10) / 10,
    calorieCut: Math.round(tdee * 0.8),
    calorieMaintain: tdee,
    calorieBulk: Math.round(tdee * 1.15)
  };
});

/* ==================== FUERZA / 1RM (reactivo) ==================== */
const strengthResults = computed(() => {
  const { weight, reps } = strength;
  const w = weight || 0;
  const r = Math.max(reps || 1, 1);
  const epley = r === 1 ? w : w * (1 + r / 30);
  const brzycki = r === 1 ? w : w * (36 / (37 - Math.min(r, 36)));
  const oneRM = Math.round(((epley + brzycki) / 2) * 10) / 10;
  return {
    epley: Math.round(epley * 10) / 10,
    brzycki: Math.round(brzycki * 10) / 10,
    oneRM
  };
});

const repPercentMap = [
  { reps: 1, pct: 100 }, { reps: 2, pct: 95 }, { reps: 3, pct: 93 }, { reps: 4, pct: 90 },
  { reps: 5, pct: 87 }, { reps: 6, pct: 85 }, { reps: 8, pct: 80 }, { reps: 10, pct: 75 },
  { reps: 12, pct: 70 }, { reps: 15, pct: 65 }
];
const percentTable = computed(() => {
  const orm = strengthResults.value.oneRM;
  return repPercentMap.map((row) => ({
    pct: row.pct,
    weight: Math.round(orm * (row.pct / 100) * 10) / 10,
    reps: row.reps
  }));
});

/* ==================== ZONAS CARDIACAS (reactivo) ==================== */
const cardio = computed(() => {
  const { age, restingHR } = profile;
  const maxHR = Math.round(208 - 0.7 * age);
  const zoneDefs = [
    { key: 'z1', pctMin: 50, pctMax: 60, color: '#38bdf8' },
    { key: 'z2', pctMin: 60, pctMax: 70, color: '#4ade80' },
    { key: 'z3', pctMin: 70, pctMax: 80, color: '#facc15' },
    { key: 'z4', pctMin: 80, pctMax: 90, color: '#fb923c' },
    { key: 'z5', pctMin: 90, pctMax: 100, color: '#f87171' }
  ];

  const zones = zoneDefs.map((z) => {
    let bpmMin, bpmMax;
    if (restingHR) {
      bpmMin = Math.round((maxHR - restingHR) * (z.pctMin / 100) + restingHR);
      bpmMax = Math.round((maxHR - restingHR) * (z.pctMax / 100) + restingHR);
    } else {
      bpmMin = Math.round(maxHR * (z.pctMin / 100));
      bpmMax = Math.round(maxHR * (z.pctMax / 100));
    }
    return { ...z, name: t.value.zoneNames[z.key], bpmMin, bpmMax };
  });

  return { maxHR, zones };
});

/* ==================== HISTORIAL ==================== */
const history = ref([]);
const savedToast = ref(false);

const saveRecord = () => {
  history.value.push({
    id: Date.now(),
    date: new Date().toISOString(),
    weight: profile.weight,
    imc: comp.value.imc,
    bodyFat: comp.value.bodyFat
  });
  savedToast.value = true;
  setTimeout(() => { savedToast.value = false; }, 2200);
};

const removeRecord = (id) => {
  history.value = history.value.filter((e) => e.id !== id);
};

const reversedHistory = computed(() => [...history.value].reverse());

const deltaFor = (reversedIdx) => {
  const list = reversedHistory.value;
  if (reversedIdx >= list.length - 1) return null;
  const current = list[reversedIdx];
  const previous = list[reversedIdx + 1];
  return Math.round((current.weight - previous.weight) * 10) / 10;
};

const sparklineHeight = (weight) => {
  const weights = history.value.map((e) => e.weight);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  if (max === min) return 60;
  return 20 + ((weight - min) / (max - min)) * 75;
};

const formatShortDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString(lang.value === 'es' ? 'es-ES' : 'en-US', { day: '2-digit', month: 'short' });
};
const formatFullDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString(lang.value === 'es' ? 'es-ES' : 'en-US', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Archivo+Black&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;600;700&display=swap');

.saas-dashboard-wrapper {
  background: var(--bg-custom, #0a0a0a);
  min-height: 100vh;
  color: var(--color-texto-general, #f5f5f4);
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
}

.dashboard-main-container {
  flex: 1;
  max-width: 1180px;
  margin: 0 auto;
  width: 100%;
  padding: 40px clamp(16px, 3vw, 32px) 60px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.glass-card {
  background: var(--bg-cards, #121212);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.08));
  border-radius: var(--app-border-radius, 22px);
  padding: 26px 28px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.4);
  position: relative;
  overflow: hidden;
}

.header-card { display: flex; flex-direction: column; gap: 14px; }
.header-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
  background: linear-gradient(90deg, var(--color-botones, #1c4fd6), #60a5fa, var(--color-botones, #1c4fd6));
}
.header-top-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
.gym-badge-tag {
  font-family: 'Oswald', sans-serif; font-size: 0.68rem;
  background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3);
  color: var(--color-highlight, #60a5fa); padding: 5px 12px; border-radius: 50px;
  font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px;
}
.header-counter-pill {
  display: flex; align-items: center; gap: 7px; background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1); padding: 5px 12px; border-radius: 50px;
  font-size: 0.75rem; font-weight: 600; color: rgba(245, 245, 244, 0.7);
}
.header-counter-pill svg { color: var(--color-highlight, #3b82f6); }
.header-titles { display: flex; flex-direction: column; gap: 8px; }
.main-heading {
  font-family: 'Anton', sans-serif; font-size: 2.1rem; font-weight: 400; margin: 0;
  color: var(--color-titulos, #ffffff); letter-spacing: 0.3px; line-height: 1.1; text-transform: uppercase;
}
.highlight-color { color: var(--color-highlight, #3b82f6); }
.hero-desc { font-size: 0.9rem; color: rgba(245, 245, 244, 0.6); margin: 0; font-weight: 500; line-height: 1.5; max-width: 560px; }

.profile-panel { display: flex; flex-direction: column; gap: 16px; }
.panel-title-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
.panel-title {
  font-family: 'Oswald', sans-serif; font-size: 0.78rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.6px; color: rgba(245, 245, 244, 0.75); display: flex; align-items: center; gap: 8px;
}
.panel-title svg { color: var(--color-highlight, #3b82f6); }
.panel-hint { font-size: 0.72rem; color: rgba(245, 245, 244, 0.4); }

.fields-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px; }
.input-group { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.input-group label {
  font-family: 'Oswald', sans-serif; font-size: 0.68rem; font-weight: 600; color: rgba(245, 245, 244, 0.55);
  text-transform: uppercase; letter-spacing: 0.3px;
}
.styled-input, .styled-select {
  width: 100%; background: rgba(255, 255, 255, 0.035); border: 1.5px solid rgba(255, 255, 255, 0.1);
  color: #fff; padding: 11px 14px; border-radius: 10px; font-size: 0.88rem; font-weight: 600; outline: none;
  box-sizing: border-box; transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}
.styled-select {
  appearance: none; cursor: pointer;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.364%22%20height%3D%22292.364%22%3E%3Cpath%20fill%3D%22%2360a5fa%22%20d%3D%22M287.9 69.8c-4.3-4.3-11.3-4.3-15.6 0L146.1 195.8 20 69.8c-4.3-4.3-11.3-4.3-15.6 0s-4.3 11.3 0 15.6l133.4 133.4c4.3 4.3 11.3 4.3 15.6 0l133.5-133.4c4.3-4.3 4.3-11.3 0-15.6z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat; background-position: right 14px center; background-size: 9px auto; padding-right: 34px;
}
.styled-input:hover, .styled-select:hover { border-color: rgba(59, 130, 246, 0.4); }
.styled-input:focus, .styled-select:focus {
  border-color: var(--color-highlight, #3b82f6); background-color: rgba(59, 130, 246, 0.05);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
.styled-select option { background: #141414; color: #fff; }

.tab-strip-row { display: flex; gap: 8px; flex-wrap: wrap; }
.tab-strip-btn {
  background: rgba(255, 255, 255, 0.035); border: 1.5px solid rgba(255, 255, 255, 0.1);
  color: rgba(245, 245, 244, 0.65); font-family: 'Oswald', sans-serif; font-size: 0.76rem; font-weight: 700;
  padding: 10px 16px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 8px;
  transition: all 0.18s ease; white-space: nowrap;
}
.tab-strip-btn:hover { border-color: rgba(59, 130, 246, 0.4); color: #fff; transform: translateY(-1px); }
.tab-strip-btn.active {
  background: var(--color-botones, #3b82f6); border-color: var(--color-botones, #3b82f6);
  color: var(--color-texto-botones, #fff); box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
}

.tab-content { display: flex; flex-direction: column; gap: 18px; }

.imc-hero-card { display: flex; align-items: center; gap: 26px; flex-wrap: wrap; }
.imc-ring-wrapper { flex-shrink: 0; }
.imc-ring { width: 130px; height: 130px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.4s ease; }
.imc-ring-inner { width: 104px; height: 104px; border-radius: 50%; background: var(--bg-cards, #121212); display: flex; flex-direction: column; align-items: center; justify-content: center; }
.imc-value { font-family: 'Anton', sans-serif; font-size: 1.8rem; color: #fff; line-height: 1; }
.imc-unit { font-size: 0.68rem; text-transform: uppercase; color: rgba(245, 245, 244, 0.5); font-weight: 700; letter-spacing: 0.4px; margin-top: 2px; }

.imc-info { flex: 1; min-width: 220px; display: flex; flex-direction: column; gap: 8px; }
.imc-category-badge {
  align-self: flex-start; font-family: 'Oswald', sans-serif; font-size: 0.7rem; font-weight: 700; padding: 4px 12px;
  border-radius: 20px; border: 1px solid; text-transform: uppercase; letter-spacing: 0.4px;
}
.imc-info h3 { margin: 0; font-family: 'Oswald', sans-serif; font-size: 1.1rem; color: var(--color-titulos, #fff); }
.imc-info p { margin: 0; font-size: 0.82rem; color: rgba(245, 245, 244, 0.6); line-height: 1.55; }
.ideal-weight-row {
  display: flex; align-items: center; gap: 10px; margin-top: 4px; background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07); padding: 10px 14px; border-radius: 12px; flex-wrap: wrap;
}
.ideal-weight-label { font-size: 0.75rem; color: rgba(245, 245, 244, 0.55); font-weight: 600; }
.ideal-weight-value { font-family: 'Oswald', sans-serif; font-size: 0.95rem; color: #4ade80; font-weight: 700; }

.metrics-cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 14px; }
.metric-result-card {
  background: var(--bg-cards, #121212); border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.08));
  border-radius: var(--app-border-radius, 16px); padding: 16px 18px; display: flex; align-items: center; gap: 14px;
  box-shadow: 0 10px 24px rgba(0,0,0,0.3);
}
.metric-icon-box {
  width: 40px; height: 40px; border-radius: 12px; background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.25); color: var(--color-highlight, #3b82f6);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.metric-icon-box.accent-icon { background: rgba(52, 211, 153, 0.1); border-color: rgba(52, 211, 153, 0.3); color: #34d399; }
.metric-icon-box.info-icon { background: rgba(56, 189, 248, 0.1); border-color: rgba(56, 189, 248, 0.3); color: #38bdf8; }
.metric-icon-box.warning-icon { background: rgba(250, 204, 21, 0.1); border-color: rgba(250, 204, 21, 0.3); color: #facc15; }
.metric-icon-box.success-icon { background: rgba(74, 222, 128, 0.1); border-color: rgba(74, 222, 128, 0.3); color: #4ade80; }
.metric-icon-box.neutral-icon { background: rgba(148, 163, 184, 0.1); border-color: rgba(148, 163, 184, 0.3); color: #94a3b8; }
.metric-result-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.metric-result-value { font-family: 'Oswald', sans-serif; font-size: 1.1rem; font-weight: 700; color: #fff; }
.metric-result-label { font-size: 0.68rem; text-transform: uppercase; color: rgba(245, 245, 244, 0.5); font-weight: 600; letter-spacing: 0.3px; }
.metric-result-sub { font-size: 0.68rem; color: var(--color-highlight, #60a5fa); font-weight: 600; margin-top: 1px; }

.somatotype-row { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.somatotype-badge {
  background: var(--color-botones, #3b82f6); color: var(--color-texto-botones, #fff); font-family: 'Oswald', sans-serif;
  font-size: 0.85rem; font-weight: 700; padding: 8px 16px; border-radius: 10px; flex-shrink: 0;
}
.somatotype-row p { margin: 0; font-size: 0.82rem; color: rgba(245, 245, 244, 0.65); line-height: 1.6; }

.section-subtitle {
  font-family: 'Oswald', sans-serif; font-size: 0.95rem; font-weight: 700; text-transform: uppercase;
  color: var(--color-titulos, #fff); margin: 0 0 16px; letter-spacing: 0.4px; display: flex; align-items: center; gap: 8px;
}
.subtitle-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--color-highlight, #3b82f6); box-shadow: 0 0 6px var(--color-highlight, #3b82f6); flex-shrink: 0; }
.subtitle-dot.pink { background: #f472b6; box-shadow: 0 0 6px #f472b6; }

.save-record-row { display: flex; align-items: center; gap: 14px; }
.btn-save-record {
  background: var(--color-botones, #3b82f6); color: var(--color-texto-botones, white); border: none;
  padding: 13px 22px; border-radius: 12px; font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 0.82rem;
  text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 9px; cursor: pointer;
  transition: filter 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease; box-shadow: 0 6px 18px rgba(59, 130, 246, 0.35);
}
.btn-save-record:hover { filter: brightness(1.08); transform: translateY(-2px); }
.saved-toast { font-size: 0.78rem; font-weight: 700; color: #34d399; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.bmr-compare-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-bottom: 12px; }
.bmr-formula-box {
  background: rgba(59, 130, 246, 0.06); border: 1px solid rgba(59, 130, 246, 0.25); border-radius: 14px;
  padding: 16px; display: flex; flex-direction: column; gap: 6px; align-items: flex-start;
}
.bmr-formula-box.secondary { background: rgba(255, 255, 255, 0.03); border-color: rgba(255, 255, 255, 0.1); }
.bmr-formula-name { font-family: 'Oswald', sans-serif; font-size: 0.8rem; font-weight: 700; color: rgba(245, 245, 244, 0.7); }
.bmr-formula-value { font-family: 'Anton', sans-serif; font-size: 1.5rem; color: #fff; }
.bmr-formula-tag {
  font-size: 0.62rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px;
  background: rgba(74, 222, 128, 0.15); color: #4ade80; padding: 2px 8px; border-radius: 20px;
}
.bmr-note { font-size: 0.78rem; color: rgba(245, 245, 244, 0.45); line-height: 1.5; margin: 0; }

.calorie-goals-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; }
.calorie-goal-box {
  border-radius: 14px; padding: 18px; display: flex; flex-direction: column; align-items: center; gap: 4px;
  border: 1px solid; text-align: center;
}
.calorie-goal-box.cut { background: rgba(56, 189, 248, 0.07); border-color: rgba(56, 189, 248, 0.3); }
.calorie-goal-box.maintain { background: rgba(74, 222, 128, 0.07); border-color: rgba(74, 222, 128, 0.3); }
.calorie-goal-box.bulk { background: rgba(250, 204, 21, 0.07); border-color: rgba(250, 204, 21, 0.3); }
.goal-label { font-family: 'Oswald', sans-serif; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: rgba(245, 245, 244, 0.6); letter-spacing: 0.4px; }
.goal-value { font-family: 'Anton', sans-serif; font-size: 1.4rem; color: #fff; }
.goal-sub { font-size: 0.72rem; color: rgba(245, 245, 244, 0.4); font-weight: 600; }

.orm-hero-card { display: flex; align-items: center; gap: 30px; flex-wrap: wrap; }
.orm-ring {
  width: 120px; height: 120px; border-radius: 50%; flex-shrink: 0;
  background: conic-gradient(var(--color-botones, #3b82f6), #60a5fa);
  display: flex; align-items: center; justify-content: center;
}
.orm-ring-inner {
  width: 96px; height: 96px; border-radius: 50%; background: var(--bg-cards, #121212);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.orm-value { font-family: 'Anton', sans-serif; font-size: 1.5rem; color: #fff; }
.orm-unit { font-size: 0.62rem; text-transform: uppercase; color: rgba(245, 245, 244, 0.5); font-weight: 700; margin-top: 2px; }
.orm-formula-list { display: flex; flex-direction: column; gap: 10px; flex: 1; min-width: 160px; }
.orm-formula-item {
  display: flex; justify-content: space-between; background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07); padding: 10px 14px; border-radius: 10px; font-size: 0.85rem;
}
.orm-formula-item span { color: rgba(245, 245, 244, 0.6); }
.orm-formula-item strong { color: #fff; font-family: 'Oswald', sans-serif; }

.percent-table { display: flex; flex-direction: column; gap: 6px; }
.percent-row {
  display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; padding: 10px 12px; border-radius: 10px;
  background: rgba(255, 255, 255, 0.02); font-size: 0.82rem; color: rgba(245, 245, 244, 0.7);
}
.percent-row.percent-header {
  font-family: 'Oswald', sans-serif; font-size: 0.68rem; text-transform: uppercase; font-weight: 700;
  color: rgba(245, 245, 244, 0.45); background: none; padding: 0 12px;
}
.percent-row:not(.percent-header) span:first-child { color: var(--color-highlight, #60a5fa); font-weight: 700; }

.hr-hero-card { display: flex; justify-content: center; }
.hr-max-box { display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center; }
.hr-max-value { font-family: 'Anton', sans-serif; font-size: 2.6rem; color: #f87171; line-height: 1; }
.hr-max-label { font-family: 'Oswald', sans-serif; font-size: 0.85rem; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.4px; }
.hr-max-formula { font-size: 0.75rem; color: rgba(245, 245, 244, 0.45); }

.hr-zones-list { display: flex; flex-direction: column; gap: 12px; }
.hr-zone-row { display: grid; grid-template-columns: 150px 1fr 110px; align-items: center; gap: 12px; }
.hr-zone-label-col { display: flex; align-items: center; gap: 10px; }
.hr-zone-color-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
.hr-zone-name { display: block; font-family: 'Oswald', sans-serif; font-size: 0.82rem; font-weight: 700; color: #fff; }
.hr-zone-pct { display: block; font-size: 0.7rem; color: rgba(245, 245, 244, 0.45); }
.hr-zone-bar-track { height: 10px; border-radius: 6px; background: rgba(255, 255, 255, 0.06); overflow: hidden; }
.hr-zone-bar-fill { height: 100%; border-radius: 6px; transition: width 0.6s ease; }
.hr-zone-bpm { font-family: 'Oswald', sans-serif; font-size: 0.8rem; color: rgba(245, 245, 244, 0.7); text-align: right; }

.waiting-box { text-align: center; padding: 56px 24px; display: flex; flex-direction: column; align-items: center; gap: 16px; color: rgba(245, 245, 244, 0.6); }
.waiting-icon-ring {
  width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.25); color: var(--color-highlight, #3b82f6);
}
.waiting-box h3 { margin: 0; color: #fff; font-family: 'Anton', sans-serif; font-size: 1.15rem; text-transform: uppercase; letter-spacing: 0.3px; }
.waiting-box p { margin: 0; font-size: 0.85rem; max-width: 340px; line-height: 1.5; }

.sparkline-row { display: flex; align-items: flex-end; gap: 10px; height: 140px; overflow-x: auto; padding-bottom: 4px; }
.sparkline-bar-col { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 0 0 34px; height: 100%; justify-content: flex-end; }
.sparkline-bar-track { width: 18px; flex: 1; display: flex; align-items: flex-end; background: rgba(255,255,255,0.04); border-radius: 6px; overflow: hidden; }
.sparkline-bar-fill { width: 100%; border-radius: 6px; background: linear-gradient(180deg, #60a5fa, var(--color-botones, #3b82f6)); transition: height 0.5s ease; }
.sparkline-date { font-size: 0.62rem; color: rgba(245, 245, 244, 0.4); white-space: nowrap; }

.history-entries { display: flex; flex-direction: column; gap: 10px; }
.history-entry-row {
  display: flex; align-items: center; gap: 14px; background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.07); padding: 12px 16px; border-radius: 14px; flex-wrap: wrap;
}
.history-entry-date { font-size: 0.78rem; color: rgba(245, 245, 244, 0.55); flex: 1 1 160px; min-width: 0; }
.history-entry-stats { display: flex; gap: 14px; flex-wrap: wrap; }
.history-stat { font-size: 0.8rem; color: rgba(245, 245, 244, 0.6); }
.history-stat strong { color: #fff; font-family: 'Oswald', sans-serif; }
.history-delta {
  display: flex; align-items: center; gap: 4px; font-size: 0.76rem; font-weight: 700; padding: 4px 10px;
  border-radius: 20px; flex-shrink: 0;
}
.history-delta.down { color: #38bdf8; background: rgba(56, 189, 248, 0.1); }
.history-delta.up { color: #fb923c; background: rgba(251, 146, 60, 0.1); }
.history-delta.flat { color: rgba(245, 245, 244, 0.5); background: rgba(255,255,255,0.05); }
.history-delete-btn {
  background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); color: rgba(245, 245, 244, 0.5);
  width: 26px; height: 26px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0; transition: all 0.2s ease;
}
.history-delete-btn:hover { color: #f87171; border-color: rgba(248, 113, 113, 0.4); }

.disclaimer-text { font-size: 0.75rem; color: rgba(245, 245, 244, 0.4); line-height: 1.6; text-align: center; max-width: 700px; margin: 6px auto 0; }

@media (max-width: 640px) {
  .dashboard-main-container { padding: 16px 10px 40px; gap: 16px; }
  .glass-card { padding: 20px 18px; }
  .main-heading { font-size: 1.5rem; }
  .fields-grid { grid-template-columns: 1fr 1fr; }
  .imc-hero-card, .orm-hero-card { flex-direction: column; text-align: center; }
  .imc-info { align-items: center; }
  .imc-category-badge { align-self: center; }
  .ideal-weight-row { justify-content: center; }
  .metrics-cards-grid { grid-template-columns: 1fr 1fr; }
  .hr-zone-row { grid-template-columns: 1fr; gap: 6px; }
  .hr-zone-bpm { text-align: left; }
  .percent-row { grid-template-columns: 1fr 1fr 1fr; font-size: 0.76rem; }
  .tab-strip-row { overflow-x: auto; flex-wrap: nowrap; padding-bottom: 4px; }
}
@media (max-width: 420px) {
  .fields-grid { grid-template-columns: 1fr; }
  .metrics-cards-grid { grid-template-columns: 1fr; }
}
</style>