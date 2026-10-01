<template>
  <HeadingMember>
    <div class="saas-dashboard-wrapper">
      <main class="dashboard-main-container">

        <!-- HEADER -->
        <section class="glass-card header-card">
          <div class="header-top-row">
            <span class="gym-badge-tag">{{ t.badgeTag }}</span>
          </div>
          <div class="header-titles">
            <h1 class="main-heading">
              {{ t.mainTitle1 }} <span class="highlight-color">{{ t.mainTitle2 }}</span>
            </h1>
            <p class="hero-desc">{{ t.heroDesc }}</p>
          </div>
        </section>

        <!-- PERFIL BASE -->
        <section class="glass-card profile-panel">
          <div class="panel-title-row">
            <span class="panel-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              {{ t.basicDataTitle }}
            </span>
          </div>

          <div class="fields-grid">
            <div class="input-group">
              <label>{{ t.ageLabel }}</label>
              <input type="number" v-model.number="form.age" min="10" max="100" class="styled-input" />
            </div>
            <div class="input-group">
              <label>{{ t.genderLabel }}</label>
              <select v-model="form.gender" class="styled-select">
                <option value="male">{{ t.genderMale }}</option>
                <option value="female">{{ t.genderFemale }}</option>
              </select>
            </div>
            <div class="input-group">
              <label>{{ t.weightLabel }} (kg)</label>
              <input type="number" v-model.number="form.weight" min="30" max="250" class="styled-input" />
            </div>
            <div class="input-group">
              <label>{{ t.heightLabel }} (cm)</label>
              <input type="number" v-model.number="form.height" min="100" max="230" class="styled-input" />
            </div>
            <div class="input-group">
              <label>{{ t.activityLabel }}</label>
              <select v-model="form.activity" class="styled-select">
                <option value="sedentary">{{ t.activitySedentary }}</option>
                <option value="light">{{ t.activityLight }}</option>
                <option value="moderate">{{ t.activityModerate }}</option>
                <option value="active">{{ t.activityActive }}</option>
                <option value="veryActive">{{ t.activityVeryActive }}</option>
              </select>
            </div>
            <div class="input-group">
              <label>{{ t.mealsPerDayLabel }}</label>
              <select v-model.number="form.mealsPerDay" class="styled-select">
                <option :value="3">3 {{ t.mealsShort }}</option>
                <option :value="4">4 {{ t.mealsShort }}</option>
                <option :value="5">5 {{ t.mealsShort }}</option>
              </select>
            </div>
          </div>

          <div class="chip-section">
            <span class="chip-section-title">{{ t.goalLabel }}</span>
            <div class="chip-filter-row">
              <button
                v-for="opt in goalOptions"
                :key="opt.value"
                type="button"
                class="filter-chip"
                :class="{ active: form.goal === opt.value }"
                @click="form.goal = opt.value"
              >{{ opt.label }}</button>
            </div>
          </div>

          <div class="chip-section">
            <span class="chip-section-title">{{ t.dietStyleLabel }}</span>
            <div class="chip-filter-row">
              <button
                v-for="opt in dietOptions"
                :key="opt.value"
                type="button"
                class="filter-chip"
                :class="{ active: form.dietStyle === opt.value }"
                @click="form.dietStyle = opt.value"
              >{{ opt.label }}</button>
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

        <!-- ===================== TAB: CALORÍAS Y MACROS ===================== -->
        <div v-if="activeTab === 'macros'" class="tab-content">

          <section class="glass-card macro-hero-card">
            <div class="macro-ring-wrapper">
              <div class="macro-ring" :style="macroRingStyle">
                <div class="macro-ring-inner">
                  <span class="macro-value">{{ results.calories }}</span>
                  <span class="macro-unit">kcal / {{ t.dayShort }}</span>
                </div>
              </div>
            </div>

            <div class="macro-legend">
              <div class="macro-legend-item">
                <span class="macro-dot" style="background:#4ade80"></span>
                <div class="macro-legend-text">
                  <span class="macro-legend-name">{{ t.proteinLabel }}</span>
                  <span class="macro-legend-value">{{ results.proteinG }} g · {{ results.proteinPct }}%</span>
                </div>
              </div>
              <div class="macro-legend-item">
                <span class="macro-dot" style="background:#facc15"></span>
                <div class="macro-legend-text">
                  <span class="macro-legend-name">{{ t.carbsLabel }}</span>
                  <span class="macro-legend-value">{{ results.carbsG }} g · {{ results.carbsPct }}%</span>
                </div>
              </div>
              <div class="macro-legend-item">
                <span class="macro-dot" style="background:#38bdf8"></span>
                <div class="macro-legend-text">
                  <span class="macro-legend-name">{{ t.fatLabel }}</span>
                  <span class="macro-legend-value">{{ results.fatG }} g · {{ results.fatPct }}%</span>
                </div>
              </div>
            </div>
          </section>

          <section class="metrics-cards-grid">
            <div class="metric-result-card">
              <div class="metric-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
              </div>
              <div class="metric-result-text">
                <span class="metric-result-value">{{ results.bmr }} kcal</span>
                <span class="metric-result-label">{{ t.bmrLabel }}</span>
              </div>
            </div>
            <div class="metric-result-card accent">
              <div class="metric-icon-box accent-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div class="metric-result-text">
                <span class="metric-result-value">{{ results.tdee }} kcal</span>
                <span class="metric-result-label">{{ t.tdeeLabel }}</span>
              </div>
            </div>
            <div class="metric-result-card">
              <div class="metric-icon-box info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
              </div>
              <div class="metric-result-text">
                <span class="metric-result-value">{{ results.water }} L</span>
                <span class="metric-result-label">{{ t.waterLabel }}</span>
              </div>
            </div>
            <div class="metric-result-card">
              <div class="metric-icon-box success-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 20V10M18 20V4M6 20v-4"></path></svg>
              </div>
              <div class="metric-result-text">
                <span class="metric-result-value">{{ results.fiberG }} g</span>
                <span class="metric-result-label">{{ t.fiberLabel }}</span>
              </div>
            </div>
          </section>

          <!-- Distribución de comidas -->
          <section class="glass-card meals-card">
            <h3 class="section-subtitle"><span class="subtitle-dot"></span>{{ t.mealDistTitle }}</h3>
            <div class="meals-grid">
              <div v-for="meal in mealDistribution" :key="meal.key" class="meal-item">
                <div class="meal-item-header">
                  <span class="meal-name">{{ meal.label }}</span>
                  <span class="meal-pct">{{ meal.pct }}%</span>
                </div>
                <div class="meal-bar-track">
                  <div class="meal-bar-fill" :style="{ width: meal.pct + '%' }"></div>
                </div>
                <span class="meal-kcal">{{ meal.kcal }} kcal</span>
              </div>
            </div>
          </section>
        </div>

        <!-- ===================== TAB: PLAN SEMANAL ===================== -->
        <div v-if="activeTab === 'weekplan'" class="tab-content">
          <section class="glass-card weekplan-toolbar-card">
            <div class="weekplan-toolbar-row">
              <p class="weekplan-desc">{{ t.weekPlanDesc }}</p>
              <button class="btn-regenerate" @click="generateWeekPlan">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 4v6h6M20 20v-6h-6"></path><path d="M4.5 15a8 8 0 0 0 14.6 2.4M19.5 9a8 8 0 0 0-14.6-2.4"></path></svg>
                {{ t.regenerateBtn }}
              </button>
            </div>
          </section>

          <div class="day-strip-row">
            <button
              v-for="(day, idx) in weekPlan"
              :key="day.dayKey"
              class="day-strip-chip"
              :class="{ active: activeDayIdx === idx }"
              @click="activeDayIdx = idx"
            >
              {{ t.daysShort[day.dayKey] }}
              <span class="day-strip-kcal">{{ day.totalKcal }} kcal</span>
            </button>
          </div>

          <section class="glass-card day-meals-card" v-if="weekPlan.length">
            <h3 class="section-subtitle"><span class="subtitle-dot"></span>{{ t.days[weekPlan[activeDayIdx].dayKey] }}</h3>
            <div class="day-meals-list">
              <div v-for="meal in weekPlan[activeDayIdx].meals" :key="meal.slotKey" class="day-meal-row">
                <div class="day-meal-slot-tag">{{ t.meals[meal.slotKey] }}</div>
                <div class="day-meal-info">
                  <span class="day-meal-name">{{ meal.name }}</span>
                  <span class="day-meal-kcal">{{ meal.kcal }} kcal</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- ===================== TAB: TIMING NUTRICIONAL ===================== -->
        <div v-if="activeTab === 'timing'" class="tab-content">
          <section class="timing-grid">
            <div class="timing-card">
              <div class="timing-icon pre">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              </div>
              <h4>{{ t.preWorkoutTitle }}</h4>
              <p>{{ t.preWorkoutDesc }}</p>
            </div>
            <div class="timing-card">
              <div class="timing-icon post">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 6L9 17l-5-5"></path></svg>
              </div>
              <h4>{{ t.postWorkoutTitle }}</h4>
              <p>{{ t.postWorkoutDesc }}</p>
            </div>
            <div class="timing-card">
              <div class="timing-icon sleep">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              </div>
              <h4>{{ t.nightTitle }}</h4>
              <p>{{ t.nightDesc }}</p>
            </div>
            <div class="timing-card">
              <div class="timing-icon water">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
              </div>
              <h4>{{ t.hydrationTitle }}</h4>
              <p>{{ t.hydrationDesc(results.water) }}</p>
            </div>
          </section>
        </div>

        <!-- ===================== TAB: LISTA DE COMPRAS ===================== -->
        <div v-if="activeTab === 'shopping'" class="tab-content">
          <section v-if="!groceryGroups.length" class="waiting-box glass-card">
            <div class="waiting-icon-ring">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            </div>
            <h3>{{ t.emptyShoppingTitle }}</h3>
            <p>{{ t.emptyShoppingDesc }}</p>
          </section>

          <template v-else>
            <section class="glass-card shopping-summary-card">
              <span class="shopping-summary-text">{{ t.shoppingSummary(checkedCount, totalGroceryItems) }}</span>
              <button class="btn-clear-checks" @click="resetChecks">{{ t.clearChecksBtn }}</button>
            </section>

            <section class="glass-card shopping-list-card" v-for="group in groceryGroups" :key="group.category">
              <h3 class="section-subtitle">
                <span class="subtitle-dot" :style="{ background: group.color, boxShadow: '0 0 6px ' + group.color }"></span>
                {{ group.label }}
              </h3>
              <div class="grocery-items-grid">
                <label v-for="item in group.items" :key="item.name" class="grocery-item" :class="{ checked: checkedItems[item.name] }">
                  <input type="checkbox" v-model="checkedItems[item.name]" />
                  <span class="grocery-checkbox"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
                  <span class="grocery-name">{{ item.name }}</span>
                </label>
              </div>
            </section>
          </template>
        </div>

        <!-- ===================== TAB: SUPLEMENTACIÓN ===================== -->
        <div v-if="activeTab === 'supplements'" class="tab-content">
          <section class="supplements-grid">
            <div v-for="sup in supplementList" :key="sup.name" class="supplement-card">
              <div class="supplement-header">
                <span class="supplement-name">{{ sup.name }}</span>
                <span class="supplement-evidence" :class="sup.evidenceKey">{{ sup.evidenceLabel }}</span>
              </div>
              <p class="supplement-desc">{{ sup.desc }}</p>
              <span class="supplement-dose">{{ sup.dose }}</span>
            </div>
          </section>
          <p class="disclaimer-text">{{ t.supplementDisclaimer }}</p>
        </div>

        <p class="disclaimer-text" v-if="activeTab !== 'supplements'">{{ t.disclaimer }}</p>

      </main>
    </div>
  </HeadingMember>
</template>

<script setup>
import { reactive, ref, computed, watch, h } from 'vue';
import { useLang } from '../useLang.js';
import HeadingMember from '../HeadingMember.vue';

const { lang } = useLang();

/* ==================== TRADUCCIONES ==================== */
const traducciones = {
  es: {
    badgeTag: 'Herramientas Corporales',
    mainTitle1: 'Plan',
    mainTitle2: 'Nutricional',
    heroDesc: 'Calorías, macros, plan de comidas semanal, lista de compras y suplementación en un solo lugar.',
    basicDataTitle: 'Datos Básicos',
    ageLabel: 'Edad', genderLabel: 'Género', genderMale: 'Masculino', genderFemale: 'Femenino',
    weightLabel: 'Peso', heightLabel: 'Altura', activityLabel: 'Actividad',
    activitySedentary: 'Sedentario', activityLight: 'Ligero', activityModerate: 'Moderado',
    activityActive: 'Activo', activityVeryActive: 'Muy activo',
    mealsPerDayLabel: 'Comidas al día', mealsShort: 'comidas',
    goalLabel: 'Objetivo',
    goalLose: 'Perder grasa', goalMaintain: 'Mantener peso', goalGain: 'Ganar músculo',
    dietStyleLabel: 'Estilo de alimentación',
    dietBalanced: 'Balanceado', dietHighProtein: 'Alto en proteína', dietLowCarb: 'Bajo en carbohidratos',
    dietKeto: 'Cetogénica', dietMediterranean: 'Mediterránea',
    tabMacros: 'Calorías y Macros', tabWeekplan: 'Plan Semanal', tabTiming: 'Timing Nutricional',
    tabShopping: 'Lista de Compras', tabSupplements: 'Suplementación',
    dayShort: 'día',
    proteinLabel: 'Proteína', carbsLabel: 'Carbohidratos', fatLabel: 'Grasas',
    bmrLabel: 'Metabolismo Basal', tdeeLabel: 'Gasto Calórico (TDEE)', waterLabel: 'Hidratación', fiberLabel: 'Fibra sugerida',
    mealDistTitle: 'Distribución de comidas',
    meals: { breakfast: 'Desayuno', lunch: 'Comida', dinner: 'Cena', snack: 'Colación', snack2: 'Colación 2' },
    daysShort: { mon: 'Lun', tue: 'Mar', wed: 'Mié', thu: 'Jue', fri: 'Vie', sat: 'Sáb', sun: 'Dom' },
    days: { mon: 'Lunes', tue: 'Martes', wed: 'Miércoles', thu: 'Jueves', fri: 'Viernes', sat: 'Sábado', sun: 'Domingo' },
    weekPlanDesc: 'Plan de 7 días generado según tu objetivo y estilo de alimentación. Puedes regenerarlo cuando quieras.',
    regenerateBtn: 'Regenerar Semana',
    preWorkoutTitle: 'Antes de entrenar (1-2 h)',
    preWorkoutDesc: 'Prioriza carbohidratos de fácil digestión y algo de proteína magra para tener energía disponible sin sentirte pesado. Ej: avena con fruta o pan con pavo.',
    postWorkoutTitle: 'Después de entrenar (30-60 min)',
    postWorkoutDesc: 'Combina proteína de rápida absorción con carbohidratos para reponer glucógeno e iniciar la recuperación muscular. Ej: batido de proteína con plátano.',
    nightTitle: 'Antes de dormir',
    nightDesc: 'Una fuente de proteína de digestión lenta (como yogur griego o caseína) puede apoyar la recuperación muscular durante la noche.',
    hydrationTitle: 'Hidratación',
    hydrationDesc: (l) => `Distribuye tus ${l} L diarios a lo largo del día; aumenta la ingesta en días de entrenamiento intenso o clima caluroso.`,
    emptyShoppingTitle: 'Genera tu plan semanal primero',
    emptyShoppingDesc: 'Ve a la pestaña de Plan Semanal y genera tu semana para ver la lista de compras correspondiente.',
    shoppingSummary: (c, tot) => `${c} de ${tot} artículos marcados`,
    clearChecksBtn: 'Limpiar selección',
    groceryCategories: { protein: 'Proteínas', carbs: 'Carbohidratos', fat: 'Grasas saludables', veggie: 'Vegetales y fruta', other: 'Otros' },
    disclaimer: 'Este plan es una estimación general basada en fórmulas estándar y no sustituye la asesoría de un nutriólogo certificado. Ajusta las cantidades según tu respuesta individual.',
    supplementDisclaimer: 'La suplementación es un complemento, no un sustituto de una dieta balanceada. Consulta a un profesional de la salud antes de iniciar cualquier suplemento, especialmente si tienes alguna condición médica.',
    evidenceHigh: 'Evidencia sólida', evidenceMod: 'Evidencia moderada',
    supplements: [
      { name: 'Creatina monohidratada', evidenceKey: 'high', desc: 'Mejora el rendimiento en esfuerzos de alta intensidad y apoya la ganancia de fuerza y masa muscular.', dose: '3-5 g al día, cualquier momento' },
      { name: 'Proteína en polvo (whey/vegetal)', evidenceKey: 'high', desc: 'Práctica para alcanzar tu meta diaria de proteína, especialmente post-entreno.', dose: '20-40 g según déficit de proteína del día' },
      { name: 'Cafeína', evidenceKey: 'high', desc: 'Mejora el estado de alerta y el rendimiento en entrenamientos de fuerza y resistencia.', dose: '100-300 mg, 30-60 min antes de entrenar' },
      { name: 'Multivitamínico', evidenceKey: 'mod', desc: 'Cobertura general de micronutrientes si tu dieta tiene variedad limitada.', dose: '1 dosis diaria con alimento' },
      { name: 'Omega-3 (aceite de pescado)', evidenceKey: 'mod', desc: 'Apoyo antiinflamatorio general y salud cardiovascular.', dose: '1-2 g de EPA+DHA al día' },
      { name: 'Vitamina D', evidenceKey: 'mod', desc: 'Relevante si tienes poca exposición solar; apoya función ósea e inmune.', dose: '1000-2000 UI al día' }
    ]
  },
  en: {
    badgeTag: 'Body Tools',
    mainTitle1: 'Nutrition',
    mainTitle2: 'Plan',
    heroDesc: 'Calories, macros, weekly meal plan, shopping list and supplementation in one place.',
    basicDataTitle: 'Basic Data',
    ageLabel: 'Age', genderLabel: 'Gender', genderMale: 'Male', genderFemale: 'Female',
    weightLabel: 'Weight', heightLabel: 'Height', activityLabel: 'Activity',
    activitySedentary: 'Sedentary', activityLight: 'Light', activityModerate: 'Moderate',
    activityActive: 'Active', activityVeryActive: 'Very active',
    mealsPerDayLabel: 'Meals per day', mealsShort: 'meals',
    goalLabel: 'Goal',
    goalLose: 'Lose fat', goalMaintain: 'Maintain weight', goalGain: 'Gain muscle',
    dietStyleLabel: 'Eating style',
    dietBalanced: 'Balanced', dietHighProtein: 'High protein', dietLowCarb: 'Low carb',
    dietKeto: 'Ketogenic', dietMediterranean: 'Mediterranean',
    tabMacros: 'Calories & Macros', tabWeekplan: 'Weekly Plan', tabTiming: 'Nutrient Timing',
    tabShopping: 'Shopping List', tabSupplements: 'Supplements',
    dayShort: 'day',
    proteinLabel: 'Protein', carbsLabel: 'Carbs', fatLabel: 'Fat',
    bmrLabel: 'Basal Metabolic Rate', tdeeLabel: 'Total Energy Expenditure', waterLabel: 'Hydration', fiberLabel: 'Suggested fiber',
    mealDistTitle: 'Meal distribution',
    meals: { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack', snack2: 'Snack 2' },
    daysShort: { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' },
    days: { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' },
    weekPlanDesc: '7-day plan generated based on your goal and eating style. You can regenerate it anytime.',
    regenerateBtn: 'Regenerate Week',
    preWorkoutTitle: 'Before training (1-2 h)',
    preWorkoutDesc: 'Prioritize easily digestible carbs plus some lean protein for available energy without feeling heavy. E.g: oats with fruit or bread with turkey.',
    postWorkoutTitle: 'After training (30-60 min)',
    postWorkoutDesc: 'Combine fast-absorbing protein with carbs to replenish glycogen and kickstart muscle recovery. E.g: protein shake with banana.',
    nightTitle: 'Before sleep',
    nightDesc: 'A slow-digesting protein source (like Greek yogurt or casein) can support muscle recovery overnight.',
    hydrationTitle: 'Hydration',
    hydrationDesc: (l) => `Spread your ${l} L daily target throughout the day; increase intake on intense training days or in hot weather.`,
    emptyShoppingTitle: 'Generate your weekly plan first',
    emptyShoppingDesc: 'Go to the Weekly Plan tab and generate your week to see the matching shopping list.',
    shoppingSummary: (c, tot) => `${c} of ${tot} items checked`,
    clearChecksBtn: 'Clear selection',
    groceryCategories: { protein: 'Protein', carbs: 'Carbs', fat: 'Healthy fats', veggie: 'Veggies & fruit', other: 'Other' },
    disclaimer: 'This plan is a general estimate based on standard formulas and does not replace advice from a certified nutritionist. Adjust amounts based on your individual response.',
    supplementDisclaimer: 'Supplementation complements, not replaces, a balanced diet. Consult a healthcare professional before starting any supplement, especially if you have a medical condition.',
    evidenceHigh: 'Strong evidence', evidenceMod: 'Moderate evidence',
    supplements: [
      { name: 'Creatine monohydrate', evidenceKey: 'high', desc: 'Improves high-intensity performance and supports strength and muscle mass gains.', dose: '3-5 g daily, any time' },
      { name: 'Protein powder (whey/plant)', evidenceKey: 'high', desc: 'Convenient way to hit your daily protein target, especially post-workout.', dose: '20-40 g based on daily protein gap' },
      { name: 'Caffeine', evidenceKey: 'high', desc: 'Improves alertness and performance in strength and endurance training.', dose: '100-300 mg, 30-60 min before training' },
      { name: 'Multivitamin', evidenceKey: 'mod', desc: 'General micronutrient coverage if your diet has limited variety.', dose: '1 daily dose with food' },
      { name: 'Omega-3 (fish oil)', evidenceKey: 'mod', desc: 'General anti-inflammatory support and cardiovascular health.', dose: '1-2 g of EPA+DHA daily' },
      { name: 'Vitamin D', evidenceKey: 'mod', desc: 'Relevant if you get little sun exposure; supports bone and immune function.', dose: '1000-2000 IU daily' }
    ]
  }
};

const t = computed(() => traducciones[lang.value] || traducciones.es);

/* ==================== ICONOS DE TABS ==================== */
const iconPaths = {
  macros: () => h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2.5 }, [
    h('circle', { cx: 12, cy: 12, r: 10 }), h('path', { d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' })
  ]),
  weekplan: () => h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2.5 }, [
    h('rect', { x: 3, y: 4, width: 18, height: 18, rx: 2 }), h('line', { x1: 16, y1: 2, x2: 16, y2: 6 }), h('line', { x1: 8, y1: 2, x2: 8, y2: 6 }), h('line', { x1: 3, y1: 10, x2: 21, y2: 10 })
  ]),
  timing: () => h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2.5 }, [
    h('circle', { cx: 12, cy: 12, r: 10 }), h('polyline', { points: '12 6 12 12 16 14' })
  ]),
  shopping: () => h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2.5 }, [
    h('path', { d: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' }), h('line', { x1: 3, y1: 6, x2: 21, y2: 6 }), h('path', { d: 'M16 10a4 4 0 0 1-8 0' })
  ]),
  supplements: () => h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2.5 }, [
    h('path', { d: 'M10.5 20.5L3.5 13.5a4.95 4.95 0 1 1 7-7l7 7a4.95 4.95 0 1 1-7 7z' }), h('path', { d: 'M8.5 8.5l7 7' })
  ])
};

const activeTab = ref('macros');
const tabs = computed(() => [
  { key: 'macros', label: t.value.tabMacros, iconRender: iconPaths.macros },
  { key: 'weekplan', label: t.value.tabWeekplan, iconRender: iconPaths.weekplan },
  { key: 'timing', label: t.value.tabTiming, iconRender: iconPaths.timing },
  { key: 'shopping', label: t.value.tabShopping, iconRender: iconPaths.shopping },
  { key: 'supplements', label: t.value.tabSupplements, iconRender: iconPaths.supplements }
]);

const goalOptions = computed(() => [
  { value: 'lose', label: t.value.goalLose },
  { value: 'maintain', label: t.value.goalMaintain },
  { value: 'gain', label: t.value.goalGain }
]);

const dietOptions = computed(() => [
  { value: 'balanced', label: t.value.dietBalanced },
  { value: 'highProtein', label: t.value.dietHighProtein },
  { value: 'lowCarb', label: t.value.dietLowCarb },
  { value: 'keto', label: t.value.dietKeto },
  { value: 'mediterranean', label: t.value.dietMediterranean }
]);

const form = reactive({
  age: 28, gender: 'male', weight: 75, height: 175, activity: 'moderate',
  goal: 'maintain', dietStyle: 'balanced', mealsPerDay: 4
});

const activityFactors = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };
const goalAdjustments = { lose: -0.2, maintain: 0, gain: 0.12 };
const macroSplits = {
  balanced: { protein: 0.3, carbs: 0.4, fat: 0.3 },
  highProtein: { protein: 0.4, carbs: 0.35, fat: 0.25 },
  lowCarb: { protein: 0.35, carbs: 0.2, fat: 0.45 },
  keto: { protein: 0.25, carbs: 0.05, fat: 0.7 },
  mediterranean: { protein: 0.25, carbs: 0.45, fat: 0.3 }
};

/* ==================== CALORÍAS Y MACROS (reactivo) ==================== */
const results = computed(() => {
  const { age, gender, weight, height, activity, goal, dietStyle } = form;
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  bmr += gender === 'male' ? 5 : -161;

  const tdee = bmr * (activityFactors[activity] || 1.2);
  const adjusted = Math.round(tdee * (1 + (goalAdjustments[goal] || 0)));
  const split = macroSplits[dietStyle] || macroSplits.balanced;

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calories: adjusted,
    proteinPct: Math.round(split.protein * 100),
    carbsPct: Math.round(split.carbs * 100),
    fatPct: Math.round(split.fat * 100),
    proteinG: Math.round((adjusted * split.protein) / 4),
    carbsG: Math.round((adjusted * split.carbs) / 4),
    fatG: Math.round((adjusted * split.fat) / 9),
    fiberG: Math.round((adjusted / 1000) * 14),
    water: Math.round((weight * 35 * (activity === 'active' || activity === 'veryActive' ? 1.1 : 1) / 1000) * 10) / 10
  };
});

const macroRingStyle = computed(() => {
  const p1 = results.value.proteinPct;
  const p2 = p1 + results.value.carbsPct;
  return { background: `conic-gradient(#4ade80 0% ${p1}%, #facc15 ${p1}% ${p2}%, #38bdf8 ${p2}% 100%)` };
});

const mealDistribution = computed(() => {
  const cal = results.value.calories || 0;
  const layouts = {
    3: [{ key: 'breakfast', pct: 30 }, { key: 'lunch', pct: 40 }, { key: 'dinner', pct: 30 }],
    4: [{ key: 'breakfast', pct: 25 }, { key: 'lunch', pct: 35 }, { key: 'dinner', pct: 30 }, { key: 'snack', pct: 10 }],
    5: [{ key: 'breakfast', pct: 22 }, { key: 'snack', pct: 10 }, { key: 'lunch', pct: 30 }, { key: 'snack2', pct: 8 }, { key: 'dinner', pct: 30 }]
  };
  const dist = layouts[form.mealsPerDay] || layouts[4];
  return dist.map((m) => ({ key: m.key, label: t.value.meals[m.key], pct: m.pct, kcal: Math.round((cal * m.pct) / 100) }));
});

/* ==================== BIBLIOTECA DE COMIDAS ==================== */
const mealLibrary = {
  breakfast: [
    { name: lang => lang === 'es' ? 'Avena con claras y fruta' : 'Oats with egg whites and fruit', kcal: 380, diets: ['balanced', 'highProtein', 'lowCarb', 'mediterranean'], ingredients: [{ n: { es: 'Avena', en: 'Oats' }, c: 'carbs' }, { n: { es: 'Claras de huevo', en: 'Egg whites' }, c: 'protein' }, { n: { es: 'Plátano', en: 'Banana' }, c: 'veggie' }] },
    { name: lang => lang === 'es' ? 'Omelette de 3 huevos con espinaca' : '3-egg omelette with spinach', kcal: 350, diets: ['balanced', 'highProtein', 'lowCarb', 'keto', 'mediterranean'], ingredients: [{ n: { es: 'Huevos', en: 'Eggs' }, c: 'protein' }, { n: { es: 'Espinaca', en: 'Spinach' }, c: 'veggie' }, { n: { es: 'Aceite de oliva', en: 'Olive oil' }, c: 'fat' }] },
    { name: lang => lang === 'es' ? 'Yogur griego con nueces y miel' : 'Greek yogurt with walnuts and honey', kcal: 320, diets: ['balanced', 'highProtein', 'mediterranean'], ingredients: [{ n: { es: 'Yogur griego', en: 'Greek yogurt' }, c: 'protein' }, { n: { es: 'Nueces', en: 'Walnuts' }, c: 'fat' }, { n: { es: 'Miel', en: 'Honey' }, c: 'carbs' }] },
    { name: lang => lang === 'es' ? 'Batido de proteína con avena y mantequilla de maní' : 'Protein shake with oats and peanut butter', kcal: 420, diets: ['balanced', 'highProtein'], ingredients: [{ n: { es: 'Proteína en polvo', en: 'Protein powder' }, c: 'protein' }, { n: { es: 'Avena', en: 'Oats' }, c: 'carbs' }, { n: { es: 'Mantequilla de maní', en: 'Peanut butter' }, c: 'fat' }] },
    { name: lang => lang === 'es' ? 'Aguacate con huevo y tortilla de maíz' : 'Avocado with egg and corn tortilla', kcal: 400, diets: ['balanced', 'lowCarb', 'mediterranean'], ingredients: [{ n: { es: 'Aguacate', en: 'Avocado' }, c: 'fat' }, { n: { es: 'Huevo', en: 'Egg' }, c: 'protein' }, { n: { es: 'Tortilla de maíz', en: 'Corn tortilla' }, c: 'carbs' }] },
    { name: lang => lang === 'es' ? 'Huevos revueltos con queso y aguacate (keto)' : 'Scrambled eggs with cheese and avocado (keto)', kcal: 450, diets: ['keto', 'lowCarb'], ingredients: [{ n: { es: 'Huevos', en: 'Eggs' }, c: 'protein' }, { n: { es: 'Queso', en: 'Cheese' }, c: 'fat' }, { n: { es: 'Aguacate', en: 'Avocado' }, c: 'fat' }] }
  ],
  lunch: [
    { name: lang => lang === 'es' ? 'Pechuga de pollo con arroz y brócoli' : 'Chicken breast with rice and broccoli', kcal: 620, diets: ['balanced', 'highProtein', 'mediterranean'], ingredients: [{ n: { es: 'Pechuga de pollo', en: 'Chicken breast' }, c: 'protein' }, { n: { es: 'Arroz integral', en: 'Brown rice' }, c: 'carbs' }, { n: { es: 'Brócoli', en: 'Broccoli' }, c: 'veggie' }] },
    { name: lang => lang === 'es' ? 'Salmón al horno con camote y espárragos' : 'Baked salmon with sweet potato and asparagus', kcal: 650, diets: ['balanced', 'highProtein', 'mediterranean'], ingredients: [{ n: { es: 'Salmón', en: 'Salmon' }, c: 'protein' }, { n: { es: 'Camote', en: 'Sweet potato' }, c: 'carbs' }, { n: { es: 'Espárragos', en: 'Asparagus' }, c: 'veggie' }] },
    { name: lang => lang === 'es' ? 'Bowl de res magra con quinoa y vegetales' : 'Lean beef bowl with quinoa and veggies', kcal: 600, diets: ['balanced', 'highProtein'], ingredients: [{ n: { es: 'Res magra', en: 'Lean beef' }, c: 'protein' }, { n: { es: 'Quinoa', en: 'Quinoa' }, c: 'carbs' }, { n: { es: 'Pimiento', en: 'Bell pepper' }, c: 'veggie' }] },
    { name: lang => lang === 'es' ? 'Ensalada mediterránea con pollo y aceite de oliva' : 'Mediterranean salad with chicken and olive oil', kcal: 550, diets: ['balanced', 'lowCarb', 'mediterranean'], ingredients: [{ n: { es: 'Pollo', en: 'Chicken' }, c: 'protein' }, { n: { es: 'Aceite de oliva', en: 'Olive oil' }, c: 'fat' }, { n: { es: 'Jitomate', en: 'Tomato' }, c: 'veggie' }] },
    { name: lang => lang === 'es' ? 'Atún con aguacate y ensalada verde' : 'Tuna with avocado and green salad', kcal: 480, diets: ['balanced', 'lowCarb', 'keto', 'mediterranean'], ingredients: [{ n: { es: 'Atún', en: 'Tuna' }, c: 'protein' }, { n: { es: 'Aguacate', en: 'Avocado' }, c: 'fat' }, { n: { es: 'Lechuga', en: 'Lettuce' }, c: 'veggie' }] },
    { name: lang => lang === 'es' ? 'Muslo de pollo con mantequilla y ejotes (keto)' : 'Chicken thigh with butter and green beans (keto)', kcal: 580, diets: ['keto', 'lowCarb'], ingredients: [{ n: { es: 'Muslo de pollo', en: 'Chicken thigh' }, c: 'protein' }, { n: { es: 'Mantequilla', en: 'Butter' }, c: 'fat' }, { n: { es: 'Ejotes', en: 'Green beans' }, c: 'veggie' }] }
  ],
  dinner: [
    { name: lang => lang === 'es' ? 'Pescado blanco con verduras al vapor' : 'White fish with steamed vegetables', kcal: 420, diets: ['balanced', 'lowCarb', 'mediterranean'], ingredients: [{ n: { es: 'Pescado blanco', en: 'White fish' }, c: 'protein' }, { n: { es: 'Calabacita', en: 'Zucchini' }, c: 'veggie' }, { n: { es: 'Zanahoria', en: 'Carrot' }, c: 'veggie' }] },
    { name: lang => lang === 'es' ? 'Pechuga de pavo con puré de coliflor' : 'Turkey breast with cauliflower mash', kcal: 400, diets: ['balanced', 'lowCarb', 'keto', 'highProtein'], ingredients: [{ n: { es: 'Pechuga de pavo', en: 'Turkey breast' }, c: 'protein' }, { n: { es: 'Coliflor', en: 'Cauliflower' }, c: 'veggie' }, { n: { es: 'Aceite de oliva', en: 'Olive oil' }, c: 'fat' }] },
    { name: lang => lang === 'es' ? 'Tofu salteado con vegetales y arroz' : 'Sauteed tofu with vegetables and rice', kcal: 450, diets: ['balanced', 'mediterranean'], ingredients: [{ n: { es: 'Tofu', en: 'Tofu' }, c: 'protein' }, { n: { es: 'Arroz integral', en: 'Brown rice' }, c: 'carbs' }, { n: { es: 'Pimiento', en: 'Bell pepper' }, c: 'veggie' }] },
    { name: lang => lang === 'es' ? 'Sopa de lentejas con verduras' : 'Lentil soup with vegetables', kcal: 380, diets: ['balanced', 'mediterranean'], ingredients: [{ n: { es: 'Lentejas', en: 'Lentils' }, c: 'protein' }, { n: { es: 'Apio', en: 'Celery' }, c: 'veggie' }, { n: { es: 'Zanahoria', en: 'Carrot' }, c: 'veggie' }] },
    { name: lang => lang === 'es' ? 'Salmón con ensalada de aguacate (keto)' : 'Salmon with avocado salad (keto)', kcal: 520, diets: ['keto', 'lowCarb'], ingredients: [{ n: { es: 'Salmón', en: 'Salmon' }, c: 'protein' }, { n: { es: 'Aguacate', en: 'Avocado' }, c: 'fat' }, { n: { es: 'Espinaca', en: 'Spinach' }, c: 'veggie' }] },
    { name: lang => lang === 'es' ? 'Camarones al ajillo con espárragos' : 'Garlic shrimp with asparagus', kcal: 410, diets: ['balanced', 'lowCarb', 'keto', 'mediterranean'], ingredients: [{ n: { es: 'Camarones', en: 'Shrimp' }, c: 'protein' }, { n: { es: 'Ajo', en: 'Garlic' }, c: 'other' }, { n: { es: 'Espárragos', en: 'Asparagus' }, c: 'veggie' }] }
  ],
  snack: [
    { name: lang => lang === 'es' ? 'Yogur griego con almendras' : 'Greek yogurt with almonds', kcal: 220, diets: ['balanced', 'highProtein', 'lowCarb', 'mediterranean'], ingredients: [{ n: { es: 'Yogur griego', en: 'Greek yogurt' }, c: 'protein' }, { n: { es: 'Almendras', en: 'Almonds' }, c: 'fat' }] },
    { name: lang => lang === 'es' ? 'Fruta con mantequilla de maní' : 'Fruit with peanut butter', kcal: 250, diets: ['balanced', 'mediterranean'], ingredients: [{ n: { es: 'Manzana', en: 'Apple' }, c: 'veggie' }, { n: { es: 'Mantequilla de maní', en: 'Peanut butter' }, c: 'fat' }] },
    { name: lang => lang === 'es' ? 'Batido de proteína' : 'Protein shake', kcal: 180, diets: ['balanced', 'highProtein', 'lowCarb'], ingredients: [{ n: { es: 'Proteína en polvo', en: 'Protein powder' }, c: 'protein' }] },
    { name: lang => lang === 'es' ? 'Palitos de apio con queso crema (keto)' : 'Celery sticks with cream cheese (keto)', kcal: 190, diets: ['keto', 'lowCarb'], ingredients: [{ n: { es: 'Apio', en: 'Celery' }, c: 'veggie' }, { n: { es: 'Queso crema', en: 'Cream cheese' }, c: 'fat' }] },
    { name: lang => lang === 'es' ? 'Nueces mixtas' : 'Mixed nuts', kcal: 200, diets: ['balanced', 'keto', 'lowCarb', 'mediterranean'], ingredients: [{ n: { es: 'Nueces', en: 'Walnuts' }, c: 'fat' }, { n: { es: 'Almendras', en: 'Almonds' }, c: 'fat' }] }
  ]
};
mealLibrary.snack2 = mealLibrary.snack;

const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const pickForDiet = (pool, diet) => {
  let filtered = pool.filter((m) => m.diets.includes(diet));
  if (filtered.length < 3) filtered = pool.filter((m) => m.diets.includes('balanced'));
  return filtered;
};

const weekPlan = ref([]);
const activeDayIdx = ref(0);

const generateWeekPlan = () => {
  const slotLayouts = mealDistribution.value.map((m) => m.key);
  const diet = form.dietStyle;

  const rotations = {};
  slotLayouts.forEach((slotKey) => {
    const libKey = slotKey === 'snack2' ? 'snack' : slotKey;
    const pool = pickForDiet(mealLibrary[libKey] || mealLibrary.snack, diet);
    rotations[slotKey] = [...pool].sort(() => 0.5 - Math.random());
  });

  weekPlan.value = dayKeys.map((dayKey, dayIdx) => {
    const meals = slotLayouts.map((slotKey, slotIdx) => {
      const pool = rotations[slotKey];
      const meal = pool[dayIdx % pool.length];
      const target = mealDistribution.value[slotIdx];
      return {
        slotKey,
        name: meal.name(lang.value),
        kcal: meal.kcal,
        targetKcal: target ? target.kcal : meal.kcal,
        ingredients: meal.ingredients
      };
    });
    const totalKcal = meals.reduce((sum, m) => sum + m.kcal, 0);
    return { dayKey, meals, totalKcal };
  });

  activeDayIdx.value = 0;
  checkedItems.value = {};
};

watch(() => [form.dietStyle, form.mealsPerDay], () => {
  if (weekPlan.value.length) generateWeekPlan();
});

/* ==================== LISTA DE COMPRAS ==================== */
const categoryColors = { protein: '#4ade80', carbs: '#facc15', fat: '#38bdf8', veggie: '#f472b6', other: '#94a3b8' };
const checkedItems = ref({});

const groceryGroups = computed(() => {
  if (!weekPlan.value.length) return [];
  const seen = {};
  weekPlan.value.forEach((day) => {
    day.meals.forEach((meal) => {
      (meal.ingredients || []).forEach((ing) => {
        const name = ing.n[lang.value] || ing.n.es;
        if (!seen[name]) seen[name] = ing.c;
      });
    });
  });

  const grouped = {};
  Object.entries(seen).forEach(([name, cat]) => {
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push({ name });
  });

  const order = ['protein', 'carbs', 'fat', 'veggie', 'other'];
  return order
    .filter((cat) => grouped[cat] && grouped[cat].length)
    .map((cat) => ({
      category: cat,
      label: t.value.groceryCategories[cat],
      color: categoryColors[cat],
      items: grouped[cat].sort((a, b) => a.name.localeCompare(b.name))
    }));
});

const totalGroceryItems = computed(() => groceryGroups.value.reduce((sum, g) => sum + g.items.length, 0));
const checkedCount = computed(() => Object.values(checkedItems.value).filter(Boolean).length);
const resetChecks = () => { checkedItems.value = {}; };

/* ==================== SUPLEMENTOS ==================== */
const supplementList = computed(() => t.value.supplements.map((s) => ({
  ...s,
  evidenceLabel: s.evidenceKey === 'high' ? t.value.evidenceHigh : t.value.evidenceMod
})));
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
.header-top-row { display: flex; }
.gym-badge-tag {
  font-family: 'Oswald', sans-serif; font-size: 0.68rem;
  background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3);
  color: var(--color-highlight, #60a5fa); padding: 5px 12px; border-radius: 50px;
  font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px;
}
.header-titles { display: flex; flex-direction: column; gap: 8px; }
.main-heading {
  font-family: 'Anton', sans-serif; font-size: 2.1rem; font-weight: 400; margin: 0;
  color: var(--color-titulos, #ffffff); letter-spacing: 0.3px; line-height: 1.1; text-transform: uppercase;
}
.highlight-color { color: var(--color-highlight, #3b82f6); }
.hero-desc { font-size: 0.9rem; color: rgba(245, 245, 244, 0.6); margin: 0; font-weight: 500; line-height: 1.5; max-width: 600px; }

.profile-panel { display: flex; flex-direction: column; gap: 18px; }
.panel-title-row { display: flex; }
.panel-title {
  font-family: 'Oswald', sans-serif; font-size: 0.78rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.6px; color: rgba(245, 245, 244, 0.75); display: flex; align-items: center; gap: 8px;
}
.panel-title svg { color: var(--color-highlight, #3b82f6); }

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

.chip-section { display: flex; flex-direction: column; gap: 10px; }
.chip-section-title {
  font-family: 'Oswald', sans-serif; font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
  color: rgba(245, 245, 244, 0.55); letter-spacing: 0.5px;
}
.chip-filter-row { display: flex; flex-wrap: wrap; gap: 8px; }
.filter-chip {
  background: rgba(255, 255, 255, 0.035); border: 1.5px solid rgba(255, 255, 255, 0.1);
  color: rgba(245, 245, 244, 0.7); padding: 8px 15px; border-radius: 50px; font-family: 'Oswald', sans-serif;
  font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 0.18s ease; white-space: nowrap;
}
.filter-chip:hover { border-color: rgba(59, 130, 246, 0.5); color: #fff; transform: translateY(-1px); }
.filter-chip.active {
  background: var(--color-botones, #1c4fd6); border-color: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, #fff); box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35);
}

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

.macro-hero-card { display: flex; align-items: center; gap: 30px; flex-wrap: wrap; }
.macro-ring-wrapper { flex-shrink: 0; }
.macro-ring { width: 140px; height: 140px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.macro-ring-inner { width: 108px; height: 108px; border-radius: 50%; background: var(--bg-cards, #121212); display: flex; flex-direction: column; align-items: center; justify-content: center; }
.macro-value { font-family: 'Anton', sans-serif; font-size: 1.55rem; color: #fff; line-height: 1; }
.macro-unit { font-size: 0.66rem; text-transform: uppercase; color: rgba(245, 245, 244, 0.5); font-weight: 700; letter-spacing: 0.3px; margin-top: 4px; }

.macro-legend { display: flex; flex-direction: column; gap: 12px; flex: 1; min-width: 200px; }
.macro-legend-item { display: flex; align-items: center; gap: 12px; }
.macro-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
.macro-legend-text { display: flex; flex-direction: column; }
.macro-legend-name { font-family: 'Oswald', sans-serif; font-size: 0.85rem; font-weight: 700; color: #fff; }
.macro-legend-value { font-size: 0.78rem; color: rgba(245, 245, 244, 0.55); }

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
.metric-icon-box.success-icon { background: rgba(74, 222, 128, 0.1); border-color: rgba(74, 222, 128, 0.3); color: #4ade80; }
.metric-result-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.metric-result-value { font-family: 'Oswald', sans-serif; font-size: 1.1rem; font-weight: 700; color: #fff; }
.metric-result-label { font-size: 0.68rem; text-transform: uppercase; color: rgba(245, 245, 244, 0.5); font-weight: 600; letter-spacing: 0.3px; }

.section-subtitle {
  font-family: 'Oswald', sans-serif; font-size: 0.95rem; font-weight: 700; text-transform: uppercase;
  color: var(--color-titulos, #fff); margin: 0 0 16px; letter-spacing: 0.4px; display: flex; align-items: center; gap: 8px;
}
.subtitle-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--color-highlight, #3b82f6); box-shadow: 0 0 6px var(--color-highlight, #3b82f6); flex-shrink: 0; }

.meals-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; }
.meal-item {
  background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 14px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;
}
.meal-item-header { display: flex; justify-content: space-between; align-items: center; }
.meal-name { font-family: 'Oswald', sans-serif; font-size: 0.85rem; font-weight: 700; color: #fff; }
.meal-pct { font-size: 0.78rem; color: var(--color-highlight, #60a5fa); font-weight: 700; }
.meal-bar-track { height: 6px; border-radius: 4px; background: rgba(255, 255, 255, 0.08); overflow: hidden; }
.meal-bar-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--color-highlight, #3b82f6), #60a5fa); transition: width 0.6s ease; }
.meal-kcal { font-size: 0.76rem; color: rgba(245, 245, 244, 0.5); font-weight: 600; }

/* ===== PLAN SEMANAL ===== */
.weekplan-toolbar-row { display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-wrap: wrap; }
.weekplan-desc { margin: 0; font-size: 0.85rem; color: rgba(245, 245, 244, 0.6); line-height: 1.5; max-width: 520px; }
.btn-regenerate {
  background: var(--color-botones, #3b82f6); color: var(--color-texto-botones, white); border: none;
  padding: 11px 18px; border-radius: 10px; font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 0.78rem;
  text-transform: uppercase; letter-spacing: 0.4px; display: flex; align-items: center; gap: 8px; cursor: pointer;
  transition: filter 0.2s ease, transform 0.15s ease; box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35); flex-shrink: 0;
}
.btn-regenerate:hover { filter: brightness(1.08); transform: translateY(-2px); }

.day-strip-row { display: flex; gap: 8px; flex-wrap: wrap; overflow-x: auto; padding-bottom: 2px; }
.day-strip-chip {
  background: rgba(255, 255, 255, 0.035); border: 1.5px solid rgba(255, 255, 255, 0.1);
  color: rgba(245, 245, 244, 0.65); font-family: 'Oswald', sans-serif; font-weight: 700; padding: 10px 16px;
  border-radius: 12px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 2px;
  transition: all 0.18s ease; flex-shrink: 0;
}
.day-strip-chip:hover { border-color: rgba(59, 130, 246, 0.4); color: #fff; }
.day-strip-chip.active {
  background: var(--color-botones, #3b82f6); border-color: var(--color-botones, #3b82f6);
  color: var(--color-texto-botones, #fff); box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
}
.day-strip-kcal { font-size: 0.62rem; font-weight: 600; opacity: 0.75; text-transform: none; }

.day-meals-list { display: flex; flex-direction: column; gap: 10px; }
.day-meal-row {
  display: flex; align-items: center; gap: 14px; background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.07); border-radius: 14px; padding: 12px 16px; flex-wrap: wrap;
}
.day-meal-slot-tag {
  font-family: 'Oswald', sans-serif; font-size: 0.66rem; font-weight: 700; text-transform: uppercase;
  color: var(--color-highlight, #60a5fa); background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.25);
  padding: 4px 10px; border-radius: 8px; flex-shrink: 0; min-width: 90px; text-align: center;
}
.day-meal-info { display: flex; justify-content: space-between; align-items: center; flex: 1; gap: 10px; flex-wrap: wrap; }
.day-meal-name { font-size: 0.86rem; color: #fff; font-weight: 600; }
.day-meal-kcal { font-size: 0.78rem; color: rgba(245, 245, 244, 0.5); font-weight: 600; flex-shrink: 0; }

/* ===== TIMING ===== */
.timing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 16px; }
.timing-card {
  background: var(--bg-cards, #121212); border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.08));
  border-radius: var(--app-border-radius, 18px); padding: 20px; display: flex; flex-direction: column; gap: 10px;
  box-shadow: 0 10px 24px rgba(0,0,0,0.3);
}
.timing-icon {
  width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
  background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.25); color: var(--color-highlight, #3b82f6);
}
.timing-icon.pre { background: rgba(250, 204, 21, 0.1); border-color: rgba(250, 204, 21, 0.3); color: #facc15; }
.timing-icon.post { background: rgba(74, 222, 128, 0.1); border-color: rgba(74, 222, 128, 0.3); color: #4ade80; }
.timing-icon.sleep { background: rgba(168, 85, 247, 0.1); border-color: rgba(168, 85, 247, 0.3); color: #a855f7; }
.timing-icon.water { background: rgba(56, 189, 248, 0.1); border-color: rgba(56, 189, 248, 0.3); color: #38bdf8; }
.timing-card h4 { margin: 0; font-family: 'Oswald', sans-serif; font-size: 0.95rem; color: #fff; }
.timing-card p { margin: 0; font-size: 0.8rem; color: rgba(245, 245, 244, 0.6); line-height: 1.55; }

/* ===== LISTA DE COMPRAS ===== */
.waiting-box { text-align: center; padding: 56px 24px; display: flex; flex-direction: column; align-items: center; gap: 16px; color: rgba(245, 245, 244, 0.6); }
.waiting-icon-ring {
  width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.25); color: var(--color-highlight, #3b82f6);
}
.waiting-box h3 { margin: 0; color: #fff; font-family: 'Anton', sans-serif; font-size: 1.15rem; text-transform: uppercase; letter-spacing: 0.3px; }
.waiting-box p { margin: 0; font-size: 0.85rem; max-width: 340px; line-height: 1.5; }

.shopping-summary-card { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; padding: 18px 24px; }
.shopping-summary-text { font-size: 0.85rem; color: rgba(245, 245, 244, 0.7); font-weight: 600; }
.btn-clear-checks {
  background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.12); color: rgba(245, 245, 244, 0.7);
  padding: 8px 14px; border-radius: 10px; font-family: 'Oswald', sans-serif; font-size: 0.74rem; font-weight: 700;
  cursor: pointer; transition: all 0.2s ease;
}
.btn-clear-checks:hover { border-color: rgba(248, 113, 113, 0.4); color: #f87171; }

.grocery-items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; }
.grocery-item {
  display: flex; align-items: center; gap: 10px; background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.07); border-radius: 12px; padding: 10px 14px; cursor: pointer;
  transition: all 0.18s ease;
}
.grocery-item:hover { border-color: rgba(59, 130, 246, 0.3); }
.grocery-item input { display: none; }
.grocery-checkbox {
  width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid rgba(255, 255, 255, 0.25);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: transparent; transition: all 0.18s ease;
}
.grocery-item.checked .grocery-checkbox { background: var(--color-botones, #3b82f6); border-color: var(--color-botones, #3b82f6); color: #fff; }
.grocery-name { font-size: 0.82rem; color: rgba(245, 245, 244, 0.8); transition: color 0.18s ease, text-decoration 0.18s ease; }
.grocery-item.checked .grocery-name { color: rgba(245, 245, 244, 0.4); text-decoration: line-through; }

/* ===== SUPLEMENTOS ===== */
.supplements-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
.supplement-card {
  background: var(--bg-cards, #121212); border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.08));
  border-radius: var(--app-border-radius, 18px); padding: 20px; display: flex; flex-direction: column; gap: 10px;
  box-shadow: 0 10px 24px rgba(0,0,0,0.3);
}
.supplement-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
.supplement-name { font-family: 'Oswald', sans-serif; font-size: 0.95rem; font-weight: 700; color: #fff; }
.supplement-evidence {
  font-size: 0.62rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; padding: 3px 9px;
  border-radius: 20px; flex-shrink: 0; white-space: nowrap;
}
.supplement-evidence.high { background: rgba(74, 222, 128, 0.12); color: #4ade80; border: 1px solid rgba(74, 222, 128, 0.3); }
.supplement-evidence.mod { background: rgba(250, 204, 21, 0.12); color: #facc15; border: 1px solid rgba(250, 204, 21, 0.3); }
.supplement-desc { margin: 0; font-size: 0.8rem; color: rgba(245, 245, 244, 0.6); line-height: 1.55; }
.supplement-dose { font-size: 0.76rem; color: var(--color-highlight, #60a5fa); font-weight: 700; }

.disclaimer-text { font-size: 0.75rem; color: rgba(245, 245, 244, 0.4); line-height: 1.6; text-align: center; max-width: 700px; margin: 6px auto 0; }

/* ===== RESPONSIVE ===== */
@media (max-width: 640px) {
  .dashboard-main-container { padding: 16px 10px 40px; gap: 16px; }
  .glass-card { padding: 20px 18px; }
  .main-heading { font-size: 1.5rem; }
  .fields-grid { grid-template-columns: 1fr 1fr; }
  .macro-hero-card { flex-direction: column; text-align: center; }
  .macro-legend { align-items: center; }
  .macro-legend-item { flex-direction: column; gap: 4px; text-align: center; }
  .meals-grid { grid-template-columns: 1fr 1fr; }
  .metrics-cards-grid { grid-template-columns: 1fr 1fr; }
  .tab-strip-row { overflow-x: auto; flex-wrap: nowrap; padding-bottom: 4px; }
  .day-meal-row { flex-direction: column; align-items: flex-start; }
}
@media (max-width: 420px) {
  .fields-grid { grid-template-columns: 1fr; }
  .meals-grid { grid-template-columns: 1fr; }
  .metrics-cards-grid { grid-template-columns: 1fr; }
}
</style>