<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content glass-card">
      
      <!-- Contenedor interno con scroll que respeta esquinas -->
      <div class="modal-scroll-container custom-scrollbar">
        
        <div class="modal-header">
          <div class="modal-title-group">
            <span class="badge-level">{{ translateLevel(routine.level) }}</span>
            <h2>{{ routine.name }}</h2>
          </div>
          <button class="close-btn" @click="$emit('close')">&times;</button>
        </div>
        
        <div class="modal-media-preview" v-if="routine.image">
          <img :src="'/' + (routine.gif_url || routine.image)" :alt="routine.name" class="modal-gif" @error="(e) => { e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'; }">
        </div>

        <p class="modal-desc">{{ description }}</p>
        
        <div class="modal-prescription-grid">
          <div class="prescription-card">
            <span class="presc-label">{{ t.setsLabel }}</span>
            <span class="presc-value">{{ prescribedSets }}</span>
          </div>
          <div class="prescription-card">
            <span class="presc-label">{{ t.repsLabel }}</span>
            <span class="presc-value">{{ prescribedReps }}</span>
          </div>
          <div class="prescription-card">
            <span class="presc-label">{{ t.restLabel }}</span>
            <span class="presc-value">{{ prescribedRest }}</span>
          </div>
        </div>

        <div class="modal-meta-box">
          <div class="meta-item"><span>{{ t.targetLabel }}:</span> <strong>{{ routine.target }}</strong></div>
          <div class="meta-item"><span>{{ t.equipmentLabel }}:</span> <strong>{{ routine.equipment }}</strong></div>
          <div class="meta-item"><span>{{ t.bodyPartLabel }}:</span> <strong>{{ routine.body_part }}</strong></div>
        </div>

        <h3 class="exercises-title">{{ t.instructionsTitle }}</h3>
        <div class="exercises-list">
          <div v-for="(step, idx) in instructionsList" :key="idx" class="exercise-item">
            <div class="ex-number">{{ idx + 1 }}</div>
            <div class="ex-info">
              <span>{{ step }}</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-primary-action" @click="$emit('toggle-save', routine)">
            {{ isSaved ? t.removeRoutineBtn : t.addRoutineBtn }}
          </button>
          <button class="btn-secondary" @click="$emit('close')">{{ t.closeBtn }}</button>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
defineProps({
  routine: { type: Object, required: true },
  isSaved: { type: Boolean, default: false },
  t: { type: Object, required: true },
  description: { type: String, required: true },
  instructionsList: { type: Array, required: true },
  prescribedSets: { type: String, required: true },
  prescribedReps: { type: String, required: true },
  prescribedRest: { type: String, required: true },
  translateLevel: { type: Function, required: true }
});

defineEmits(['close', 'toggle-save']);
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 12px;
}

.modal-content {
  width: 100%;
  max-width: 650px;
  max-height: 92vh;
  background: #111111 !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 24px;
  padding: 0 !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-scroll-container {
  padding: 20px;
  overflow-y: auto;
  max-height: 92vh;
  width: 100%;
  box-sizing: border-box;
}

@media (min-width: 640px) {
  .modal-scroll-container {
    padding: 30px;
  }
}

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; margin: 10px 0; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.8); }

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.modal-title-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-right: 10px;
}

.modal-header h2 {
  margin: 0;
  font-family: 'Oswald', sans-serif;
  font-size: 1.4rem;
  color: #fff;
  letter-spacing: 0.5px;
  word-break: break-word;
}

@media (min-width: 640px) {
  .modal-header h2 {
    font-size: 1.6rem;
  }
}

.close-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
}
.close-btn:hover { background: rgba(255, 255, 255, 0.15); }

.modal-media-preview {
  width: 100%;
  height: 200px;
  background: #000000;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

@media (min-width: 640px) {
  .modal-media-preview {
    height: 240px;
    margin-bottom: 20px;
  }
}

.modal-gif {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

.modal-desc {
  font-size: 0.85rem;
  color: rgba(245, 245, 244, 0.85);
  margin-bottom: 16px;
  line-height: 1.5;
}

@media (min-width: 640px) {
  .modal-desc {
    font-size: 0.9rem;
    margin-bottom: 20px;
  }
}

.modal-prescription-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

@media (min-width: 640px) {
  .modal-prescription-grid {
    gap: 12px;
    margin-bottom: 20px;
  }
}

.prescription-card {
  background: rgba(59, 130, 246, 0.04);
  border: 1px solid rgba(59, 130, 246, 0.15);
  padding: 10px 6px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
}

@media (min-width: 640px) {
  .prescription-card {
    padding: 12px;
  }
}

.presc-label {
  font-size: 0.58rem;
  font-weight: 700;
  text-transform: uppercase;
  color: rgba(245, 245, 244, 0.5);
  letter-spacing: 0.3px;
}

@media (min-width: 640px) {
  .presc-label {
    font-size: 0.65rem;
  }
}

.presc-value {
  font-family: 'Oswald', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-highlight, #60a5fa);
  word-break: break-word;
}

@media (min-width: 640px) {
  .presc-value {
    font-size: 1.15rem;
  }
}

.modal-meta-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-bottom: 20px;
}

@media (min-width: 640px) {
  .modal-meta-box {
    flex-direction: row;
    justify-content: space-between;
    padding: 12px 16px;
    margin-bottom: 24px;
  }
}

.meta-item span { color: rgba(245, 245, 244, 0.45); }
.meta-item strong { color: #fff; margin-left: 4px; text-transform: capitalize; }

.exercises-title {
  font-size: 0.9rem;
  font-family: 'Oswald', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
  color: #fff;
}

@media (min-width: 640px) {
  .exercises-title {
    font-size: 0.95rem;
    margin-bottom: 12px;
  }
}

.exercises-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

@media (min-width: 640px) {
  .exercises-list {
    margin-bottom: 24px;
  }
}

.exercise-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 10px 12px;
  border-radius: 10px;
}

@media (min-width: 640px) {
  .exercise-item {
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
  }
}

.ex-number {
  background: var(--color-botones, #3b82f6);
  color: #fff;
  font-weight: 700;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  flex-shrink: 0;
  margin-top: 1px;
}

@media (min-width: 640px) {
  .ex-number {
    margin-top: 0;
  }
}

.ex-info span { font-size: 0.8rem; color: rgba(245, 245, 244, 0.8); line-height: 1.4; }

@media (min-width: 640px) {
  .ex-info span {
    font-size: 0.82rem;
  }
}

.modal-footer {
  display: flex;
  flex-direction: column-reverse;
  gap: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 16px;
}

@media (min-width: 480px) {
  .modal-footer {
    flex-direction: row;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 20px;
  }
}

.btn-primary-action {
  background: var(--color-botones, #3b82f6);
  color: var(--color-texto-botones, white);
  border: none;
  padding: 11px 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
  transition: opacity 0.2s;
  width: 100%;
}

@media (min-width: 480px) {
  .btn-primary-action {
    width: auto;
    padding: 11px 20px;
  }
}

.btn-primary-action:hover { opacity: 0.9; }

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 11px 16px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.82rem;
  cursor: pointer;
  width: 100%;
}

@media (min-width: 480px) {
  .btn-secondary {
    width: auto;
    padding: 11px 20px;
  }
}

.btn-secondary:hover { background: rgba(255, 255, 255, 0.1); }
</style>