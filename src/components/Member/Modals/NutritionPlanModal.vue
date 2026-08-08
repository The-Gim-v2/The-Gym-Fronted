<template>
  <div class="modal-box glass-card-modal">
    <!-- Header del Modal -->
    <div class="modal-header">
      <div class="header-icon-title">
        <svg class="svg-modal" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
        <div>
          <h3>{{ t.modalTitle }}</h3>
          <span class="sub-title">{{ t.modalSubTitle }}</span>
        </div>
      </div>
      <button class="close-btn" @click="$emit('close')">&times;</button>
    </div>

    <!-- Pestañas de Navegación -->
    <div class="health-tabs-bar">
      <button 
        :class="['tab-btn', { active: activeTab === 'nutricion' }]"
        @click="activeTab = 'nutricion'"
      >
        {{ t.tabNutrision }}
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'biometria' }]"
        @click="activeTab = 'biometria'"
      >
        {{ t.tabBiometria }}
      </button>
    </div>

    <!-- Cuerpo del Modal -->
    <div class="modal-body custom-scroll">
      
      <!-- VISTA 1: PLAN NUTRICIONAL -->
      <div v-if="activeTab === 'nutricion'" class="tab-content">
        <div class="nutrition-banner">
          <div class="nutri-info">
            <span class="label">{{ t.nutriLabel }}:</span>
            <strong>Lic. Andrea Montero</strong>
          </div>
          <div class="nutri-badge">{{ t.goalLabel }}: {{ t.goalValue }}</div>
        </div>

        <!-- Macros del día -->
        <div class="macros-grid">
          <div class="macro-card">
            <span class="macro-val">2,450</span>
            <span class="macro-name">{{ t.macroCalories }}</span>
          </div>
          <div class="macro-card">
            <span class="macro-val">180g</span>
            <span class="macro-name">{{ t.macroProteins }}</span>
          </div>
          <div class="macro-card">
            <span class="macro-val">220g</span>
            <span class="macro-name">{{ t.macroCarbs }}</span>
          </div>
          <div class="macro-card">
            <span class="macro-val">65g</span>
            <span class="macro-name">{{ t.macroFats }}</span>
          </div>
        </div>

        <!-- Registro de Agua Interactivo -->
        <div class="water-tracker-box">
          <div class="water-header">
            <span>{{ t.waterMeta }}</span>
            <strong>{{ waterDrank }} / 3.0 {{ t.litersLabel }}</strong>
          </div>
          <div class="water-progress-bar">
            <div class="water-fill" :style="{ width: (waterDrank / 3.0) * 100 + '%' }"></div>
          </div>
          <div class="water-actions">
            <button class="btn-water" @click="addWater(0.25)">{{ t.addWaterBtn }}</button>
            <button class="btn-water-reset" @click="waterDrank = 0">{{ t.resetWaterBtn }}</button>
          </div>
        </div>

        <!-- Comidas sugeridas -->
        <div class="meals-list">
          <h4 class="section-title">{{ t.mealsTitle }}</h4>
          <div class="meal-item">
            <span class="meal-time">08:30 hrs</span>
            <div class="meal-desc"><strong>{{ t.breakfastLabel }}:</strong> {{ t.breakfastDesc }}</div>
          </div>
          <div class="meal-item">
            <span class="meal-time">13:30 hrs</span>
            <div class="meal-desc"><strong>{{ t.lunchLabel }}:</strong> {{ t.lunchDesc }}</div>
          </div>
          <div class="meal-item">
            <span class="meal-time">19:00 hrs</span>
            <div class="meal-desc"><strong>{{ t.dinnerLabel }}:</strong> {{ t.dinnerDesc }}</div>
          </div>
        </div>
      </div>

      <!-- VISTA 2: CONTROL BIOMÉTRICO -->
      <div v-if="activeTab === 'biometria'" class="tab-content">
        <div class="bio-summary-card">
          <div class="bio-item">
            <span class="bio-label">{{ t.bioWeight }}</span>
            <strong class="bio-val">78.4 kg</strong>
            <span class="bio-trend positive">{{ t.trendWeight }}</span>
          </div>
          <div class="bio-item">
            <span class="bio-label">{{ t.bioFat }}</span>
            <strong class="bio-val">14.5%</strong>
            <span class="bio-trend positive">-0.8%</span>
          </div>
          <div class="bio-item">
            <span class="bio-label">{{ t.bioMuscle }}</span>
            <strong class="bio-val">38.2 kg</strong>
            <span class="bio-trend neutral">{{ t.trendStable }}</span>
          </div>
        </div>

        <div class="history-section">
          <h4 class="section-title">{{ t.historyTitle }}</h4>
          <div class="history-row">
            <div class="history-date">{{ t.dateAug }}</div>
            <div class="history-details">{{ t.detAug }}</div>
          </div>
          <div class="history-row">
            <div class="history-date">{{ t.dateJul }}</div>
            <div class="history-details">{{ t.detJul }}</div>
          </div>
          <div class="history-row">
            <div class="history-date">{{ t.dateJun }}</div>
            <div class="history-details">{{ t.detJun }}</div>
          </div>
        </div>
      </div>

    </div>

    <!-- Footer del Modal -->
    <div class="modal-footer">
      <div class="footer-info">
        {{ t.lastUpdated }} <strong>{{ t.dateUpdated }}</strong>
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
    modalTitle: "Salud y Nutrición",
    modalSubTitle: "Seguimiento clínico y nutricional",
    tabNutrision: "Plan Nutricional",
    tabBiometria: "Control Biométrico",
    nutriLabel: "Nutriólogo Asignado",
    goalLabel: "Objetivo",
    goalValue: "Definición muscular",
    macroCalories: "Calorías Diarias",
    macroProteins: "Proteínas",
    macroCarbs: "Carbohidratos",
    macroFats: "Grasas",
    waterMeta: "Hidratación diaria (Meta: 3.0 L)",
    litersLabel: "Litros",
    addWaterBtn: "+ 250 ml vaso",
    resetWaterBtn: "Reiniciar",
    mealsTitle: "Tus comidas de hoy",
    breakfastLabel: "Desayuno",
    breakfastDesc: "Omelet de 3 claras con espinacas y 1 taza de avena con frutos rojos.",
    lunchLabel: "Comida",
    lunchDesc: "200g de pechuga de pollo a la plancha, arroz integral y ensalada verde.",
    dinnerLabel: "Cena",
    dinnerDesc: "Salmón al vapor con espárragos y puré de camote.",
    bioWeight: "Peso Actual",
    trendWeight: "-1.2 kg este mes",
    bioFat: "% Grasa Corporal",
    bioMuscle: "Masa Muscular",
    trendStable: "Estable",
    historyTitle: "Historial de Evaluaciones",
    dateAug: "01 Ago 2026",
    detAug: "Peso: 78.4 kg • Grasa: 14.5% • IMC: 23.4",
    dateJul: "01 Jul 2026",
    detJul: "Peso: 79.6 kg • Grasa: 15.3% • IMC: 23.8",
    dateJun: "01 Jun 2026",
    detJun: "Peso: 81.0 kg • Grasa: 16.5% • IMC: 24.2",
    lastUpdated: "Actualizado por última vez el",
    dateUpdated: "01 de Ago, 2026",
    closeBtn: "Cerrar"
  },
  en: {
    modalTitle: "Health & Nutrition",
    modalSubTitle: "Clinical and nutritional tracking",
    tabNutrision: "Nutrition Plan",
    tabBiometria: "Biometric Control",
    nutriLabel: "Assigned Nutritionist",
    goalLabel: "Goal",
    goalValue: "Muscle definition",
    macroCalories: "Daily Calories",
    macroProteins: "Proteins",
    macroCarbs: "Carbohydrates",
    macroFats: "Fats",
    waterMeta: "Daily hydration (Goal: 3.0 L)",
    litersLabel: "Liters",
    addWaterBtn: "+ 250 ml glass",
    resetWaterBtn: "Reset",
    mealsTitle: "Today's meals",
    breakfastLabel: "Breakfast",
    breakfastDesc: "3-egg white omelet with spinach and 1 cup of oatmeal with berries.",
    lunchLabel: "Lunch",
    lunchDesc: "200g grilled chicken breast, brown rice, and green salad.",
    dinnerLabel: "Dinner",
    dinnerDesc: "Steamed salmon with asparagus and sweet potato mash.",
    bioWeight: "Current Weight",
    trendWeight: "-1.2 kg this month",
    bioFat: "Body Fat %",
    bioMuscle: "Muscle Mass",
    trendStable: "Stable",
    historyTitle: "Evaluation History",
    dateAug: "Aug 01, 2026",
    detAug: "Weight: 78.4 kg • Fat: 14.5% • BMI: 23.4",
    dateJul: "Jul 01, 2026",
    detJul: "Weight: 79.6 kg • Fat: 15.3% • BMI: 23.8",
    dateJun: "Jun 01, 2026",
    detJun: "Weight: 81.0 kg • Fat: 16.5% • BMI: 24.2",
    lastUpdated: "Last updated on",
    dateUpdated: "Aug 01, 2026",
    closeBtn: "Close"
  }
};

const t = computed(() => traducciones[lang.value] || traducciones.es);

const activeTab = ref('nutricion');
const waterDrank = ref(1.75); // Litros iniciales

const addWater = (amount) => {
  if (waterDrank.value < 3.0) {
    waterDrank.value = parseFloat(Math.min(3.0, waterDrank.value + amount).toFixed(2));
  }
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

/* Pestañas de Salud */
.health-tabs-bar {
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.02);
  padding: 4px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.tab-btn {
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
  text-align: center;
}

.tab-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.04);
}

.tab-btn.active {
  background: var(--color-highlight, #3b82f6);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Cuerpo y scroll */
.modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  max-height: 420px;
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

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Banner Nutricional */
.nutrition-banner {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  padding: 12px 16px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.nutri-info .label {
  opacity: 0.6;
  margin-right: 6px;
}

.nutri-badge {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
}

/* Grid de Macros */
.macros-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

@media(max-width: 500px) {
  .macros-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.macro-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.macro-val {
  font-family: 'Oswald', sans-serif;
  font-size: 1.2rem;
  color: var(--color-highlight, #3b82f6);
}

.macro-name {
  font-size: 0.7rem;
  opacity: 0.6;
  margin-top: 2px;
}

/* Tracker de Agua */
.water-tracker-box {
  background: rgba(59, 130, 246, 0.04);
  border: 1px solid rgba(59, 130, 246, 0.15);
  padding: 14px 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.water-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.water-header strong {
  color: var(--color-highlight, #3b82f6);
}

.water-progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
}

.water-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.water-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-water {
  background: rgba(59, 130, 246, 0.15);
  color: var(--color-highlight, #3b82f6);
  border: 1px solid var(--color-highlight, #3b82f6);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-water:hover { background: var(--color-highlight, #3b82f6); color: #fff; }

.btn-water-reset {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  cursor: pointer;
}
.btn-water-reset:hover { color: #fff; border-color: rgba(255, 255, 255, 0.3); }

/* Comidas sugeridas */
.section-title {
  font-family: 'Oswald', sans-serif;
  font-size: 1rem;
  color: var(--color-titulos, #fff);
  margin: 4px 0 2px 0;
}

.meals-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meal-item {
  display: flex;
  gap: 12px;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.82rem;
}

.meal-time {
  font-weight: 700;
  color: var(--color-highlight, #3b82f6);
  min-width: 75px;
}

.meal-desc {
  opacity: 0.85;
}

/* Biometría */
.bio-summary-card {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.bio-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 14px 10px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
}

.bio-label {
  font-size: 0.75rem;
  opacity: 0.6;
}

.bio-val {
  font-family: 'Oswald', sans-serif;
  font-size: 1.25rem;
  color: #fff;
}

.bio-trend {
  font-size: 0.7rem;
  font-weight: 600;
}
.bio-trend.positive { color: #10b981; }
.bio-trend.neutral { color: #94a3b8; }

.history-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}

.history-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.8rem;
}

.history-date {
  font-weight: 600;
  color: var(--color-highlight, #3b82f6);
}

.history-details {
  opacity: 0.7;
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
  color: #fff;
}

.btn-primary {
  background: var(--color-highlight, #3b82f6);
  color: white;
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