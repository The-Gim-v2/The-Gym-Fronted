<template>
  <div class="modal-box glass-card-modal">
    <div class="modal-header">
      <div class="header-icon-title">
        <svg class="svg-modal" viewBox="0 0 24 24"><path d="M4 4h7V11H4V4M13 4h7V11h-7V4M4 13h7v7H4v-7M13 13h3v2h-3v-2M18 13h2v2h-2v-2M13 15h2v2h-2v-2M15 18h2v2h-2v-2M18 18h2v2h-2v-2M13 18h2v2h-2v-2M18 15h2v2h-2v-2z"/></svg>
        <h3>Mi Código QR de Acceso</h3>
      </div>
      <button class="close-btn" @click="$emit('close')">&times;</button>
    </div>

    <div class="modal-body qr-body-center">
      <p class="modal-desc">Muestra este código en la recepción del gimnasio para registrar tu ingreso.</p>
      
      <div class="qr-container-box">
        <!-- Código QR realista y detallado -->
        <div class="qr-mockup">
          <svg class="svg-qr-large" viewBox="0 0 21 21">
            <!-- Esquina superior izquierda (Patrón de posicionamiento) -->
            <rect x="0" y="0" width="7" height="7" fill="#000"/>
            <rect x="1" y="1" width="5" height="5" fill="#fff"/>
            <rect x="2" y="2" width="3" height="3" fill="#000"/>

            <!-- Esquina superior derecha (Patrón de posicionamiento) -->
            <rect x="14" y="0" width="7" height="7" fill="#000"/>
            <rect x="15" y="1" width="5" height="5" fill="#fff"/>
            <rect x="16" y="2" width="3" height="3" fill="#000"/>

            <!-- Esquina inferior izquierda (Patrón de posicionamiento) -->
            <rect x="0" y="14" width="7" height="7" fill="#000"/>
            <rect x="1" y="15" width="5" height="5" fill="#fff"/>
            <rect x="2" y="16" width="3" height="3" fill="#000"/>

            <!-- Sincronización y datos simulados -->
            <rect x="8" y="0" width="1" height="2" fill="#000"/>
            <rect x="10" y="1" width="2" height="1" fill="#000"/>
            <rect x="8" y="3" width="1" height="3" fill="#000"/>
            <rect x="11" y="3" width="2" height="2" fill="#000"/>
            <rect x="0" y="8" width="2" height="1" fill="#000"/>
            <rect x="3" y="8" width="1" height="2" fill="#000"/>
            <rect x="6" y="8" width="1" height="3" fill="#000"/>
            
            <!-- Bloques de datos centrales densos -->
            <rect x="8" y="8" width="5" height="5" fill="#000"/>
            <rect x="9" y="9" width="3" height="3" fill="#fff"/>
            <rect x="10" y="10" width="1" height="1" fill="#000"/>

            <rect x="14" y="8" width="2" height="2" fill="#000"/>
            <rect x="18" y="8" width="3" height="1" fill="#000"/>
            <rect x="15" y="11" width="2" height="3" fill="#000"/>
            <rect x="19" y="10" width="2" height="2" fill="#000"/>

            <rect x="8" y="14" width="2" height="2" fill="#000"/>
            <rect x="11" y="14" width="1" height="3" fill="#000"/>
            <rect x="13" y="13" width="2" height="2" fill="#000"/>

            <rect x="16" y="15" width="5" height="2" fill="#000"/>
            <rect x="14" y="18" width="3" height="3" fill="#000"/>
            <rect x="18" y="19" width="3" height="2" fill="#000"/>
          </svg>
        </div>
        <span class="member-code-id">ID: ATH-8942-MX</span>
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn-primary" @click="$emit('close')">Cerrar</button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close']);
</script>

<style scoped>
.modal-box {
  background: var(--bg-cards, #121212);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--app-border-radius, 20px);
  width: 90%;
  max-width: 450px;
  padding: 24px;
  color: var(--color-texto-general, #f5f5f4);
  box-shadow: 0 25px 50px rgba(0,0,0,0.7);
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-icon-title {
  display: flex;
  align-items: center;
  gap: 12px;
}
.header-icon-title h3 {
  margin: 0;
  font-family: 'Oswald', sans-serif;
  font-size: 1.3rem;
  color: var(--color-titulos, #fff);
}
.svg-modal {
  width: 24px;
  height: 24px;
  fill: var(--color-highlight, #3b82f6);
}
.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.8rem;
  cursor: pointer;
  opacity: 0.7;
}
.close-btn:hover { opacity: 1; }
.modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.qr-body-center {
  align-items: center;
  text-align: center;
}
.modal-desc {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.7;
}
.qr-container-box {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 24px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  width: 100%;
}
.qr-mockup {
  background: #ffffff;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.svg-qr-large {
  width: 140px;
  height: 140px;
}
.member-code-id {
  font-family: 'Oswald', sans-serif;
  font-size: 1.05rem;
  letter-spacing: 1px;
  color: var(--color-highlight, #3b82f6);
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
}
.btn-primary {
  background: var(--color-highlight, #3b82f6);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
}
.btn-primary:hover { filter: brightness(1.1); }
</style>