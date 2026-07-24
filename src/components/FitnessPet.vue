<script setup>
import { computed } from 'vue';

const props = defineProps({
  nombre: { type: String, default: 'Entrenador' },
  nivel: { type: String, default: 'Nivel 1' },
  racha: { type: Number, default: 0 },
  // Tipo de mascota: 'zorro', 'perro', 'gato', 'oso', 'pinguino', 'pollito', 'dragon'
  tipo: { type: String, default: 'zorro' }
});

const estadoMascota = computed(() => {
  if (props.racha === 0) return 'triste';
  if (props.racha < 3) return 'normal';
  if (props.racha < 7) return 'feliz';
  return 'celebrando';
});
</script>

<template>
  <div class="pet-scene-container">
    <div class="pet-visual">
      <svg viewBox="0 0 200 200" class="pet-svg">
        
        <!-- ================= 1. ZORRO ================= -->
        <g v-if="tipo === 'zorro'" class="body-group" :class="{'animate-float': estadoMascota !== 'celebrando'}">
          <path d="M130 150 C 160 130, 170 170, 140 180 Z" fill="#c16529" />
          <path d="M135 155 C 155 140, 165 165, 145 175 Z" fill="#fff" />
          <ellipse cx="100" cy="140" rx="45" ry="40" fill="#e07a35" />
          <path d="M 75 120 C 80 100, 120 100, 125 120 Z" fill="#fff" />
          <polygon points="65,90 85,45 105,90" fill="#e07a35" />
          <polygon points="70,85 85,55 100,85" fill="#fbcfe8" />
          <polygon points="95,90 115,45 135,90" fill="#e07a35" />
          <polygon points="100,85 115,55 130,85" fill="#fbcfe8" />
          <circle cx="100" cy="105" r="35" fill="#e07a35" />
          <!-- Expresiones Zorro -->
          <g v-if="estadoMascota === 'triste'">
            <line x1="85" y1="100" x2="95" y2="102" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round" />
            <line x1="105" y1="102" x2="115" y2="100" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round" />
            <path d="M 90 122 Q 100 115 110 122" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round" />
          </g>
          <g v-else-if="estadoMascota === 'normal'">
            <circle cx="90" cy="100" r="4" fill="#1a1a1a" />
            <circle cx="110" cy="100" r="4" fill="#1a1a1a" />
            <path d="M 88 120 Q 100 128 112 120" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round" />
          </g>
          <g v-else-if="estadoMascota === 'feliz'" class="animate-bounce">
            <path d="M 85 100 Q 90 92 95 100" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round" />
            <path d="M 105 100 Q 110 92 115 100" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round" />
            <path d="M 86 116 Q 100 132 114 116" stroke="#1a1a1a" stroke-width="3.5" fill="none" stroke-linecap="round" />
          </g>
          <g v-else class="animate-spin-slow">
            <text x="35" y="45" font-size="20">✨</text>
            <text x="145" y="45" font-size="20">✨</text>
            <circle cx="90" cy="100" r="5" fill="#fff" /><circle cx="110" cy="100" r="5" fill="#fff" />
          </g>
          <ellipse cx="100" cy="116" rx="10" ry="7" fill="#1a1a1a" />
        </g>

        <!-- ================= 2. PERRO ================= -->
        <g v-else-if="tipo === 'perro'" class="body-group" :class="{'animate-float': estadoMascota !== 'celebrando'}">
          <!-- Orejas caídas -->
          <ellipse cx="65" cy="105" rx="14" ry="25" fill="#b45309" transform="rotate(-15 65 105)" />
          <ellipse cx="135" cy="105" rx="14" ry="25" fill="#b45309" transform="rotate(15 135 105)" />
          <!-- Cuerpo -->
          <ellipse cx="100" cy="140" rx="46" ry="38" fill="#d97706" />
          <ellipse cx="100" cy="145" rx="25" ry="22" fill="#fde68a" />
          <!-- Cabeza -->
          <circle cx="100" cy="100" r="38" fill="#d97706" />
          <ellipse cx="100" cy="110" rx="22" ry="16" fill="#fde68a" />
          <!-- Expresiones Perro -->
          <g v-if="estadoMascota === 'triste'">
            <path d="M 82 95 Q 88 98 94 95" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round" />
            <path d="M 106 95 Q 112 98 118 95" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round" />
            <path d="M 90 124 Q 100 118 110 124" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round" />
          </g>
          <g v-else-if="estadoMascota === 'normal'">
            <circle cx="88" cy="95" r="4" fill="#1a1a1a" />
            <circle cx="112" cy="95" r="4" fill="#1a1a1a" />
            <path d="M 90 120 Q 100 128 110 120" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round" />
          </g>
          <g v-else-if="estadoMascota === 'feliz'" class="animate-bounce">
            <path d="M 83 96 Q 88 88 93 96" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round" />
            <path d="M 107 96 Q 112 88 117 96" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round" />
            <path d="M 88 116 Q 100 130 112 116" stroke="#1a1a1a" stroke-width="3.5" fill="none" stroke-linecap="round" />
            <!-- Lengua fuera -->
            <path d="M 97 122 Q 100 135 103 122 Z" fill="#f43f5e" />
          </g>
          <g v-else>
            <text x="35" y="45" font-size="20">✨</text><text x="145" y="45" font-size="20">✨</text>
            <circle cx="88" cy="95" r="5" fill="#fff" /><circle cx="112" cy="95" r="5" fill="#fff" />
          </g>
          <ellipse cx="100" cy="110" rx="8" ry="6" fill="#1a1a1a" />
        </g>

        <!-- ================= 3. GATO ================= -->
        <g v-else-if="tipo === 'gato'" class="body-group" :class="{'animate-float': estadoMascota !== 'celebrando'}">
          <!-- Cola elegante -->
          <path d="M135 145 C 170 140, 160 100, 150 90" stroke="#64748b" stroke-width="8" fill="none" stroke-linecap="round" />
          <!-- Cuerpo -->
          <ellipse cx="100" cy="140" rx="40" ry="38" fill="#94a3b8" />
          <!-- Cabeza y Orejas puntiagudas -->
          <polygon points="70,80 60,45 85,70" fill="#94a3b8" />
          <polygon points="130,80 140,45 115,70" fill="#94a3b8" />
          <polygon points="72,78 66,53 82,70" fill="#fbcfe8" />
          <polygon points="128,78 134,53 118,70" fill="#fbcfe8" />
          <circle cx="100" cy="100" r="35" fill="#94a3b8" />
          <!-- Expresiones Gato (Ojos rasgados) -->
          <g v-if="estadoMascota === 'triste'">
            <path d="M 82 98 Q 88 94 94 98" stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round" />
            <path d="M 106 98 Q 112 94 118 98" stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round" />
            <path d="M 92 118 Q 100 114 108 118" stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round" />
          </g>
          <g v-else-if="estadoMascota === 'normal'">
            <line x1="84" y1="96" x2="94" y2="98" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round" />
            <line x1="106" y1="98" x2="116" y2="96" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round" />
            <path d="M 90 116 Q 100 122 110 116" stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round" />
          </g>
          <g v-else-if="estadoMascota === 'feliz'" class="animate-bounce">
            <path d="M 84 98 Q 89 90 94 98" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round" />
            <path d="M 106 98 Q 111 90 116 98" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round" />
            <path d="M 90 115 Q 100 122 110 115" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round" />
          </g>
          <g v-else>
            <text x="35" y="45" font-size="20">✨</text><text x="145" y="45" font-size="20">✨</text>
            <circle cx="89" cy="96" r="4" fill="#fff" /><circle cx="111" cy="96" r="4" fill="#fff" />
          </g>
          <!-- Nariz triangular de gato y bigotes -->
          <polygon points="100,108 96,104 104,104" fill="#1a1a1a" />
          <line x1="75" y1="110" x2="90" y2="108" stroke="#1a1a1a" stroke-width="1.5" />
          <line x1="75" y1="115" x2="90" y2="113" stroke="#1a1a1a" stroke-width="1.5" />
          <line x1="125" y1="110" x2="110" y2="108" stroke="#1a1a1a" stroke-width="1.5" />
          <line x1="125" y1="115" x2="110" y2="113" stroke="#1a1a1a" stroke-width="1.5" />
        </g>

        <!-- ================= 4. OSO ================= -->
        <g v-else-if="tipo === 'oso'" class="body-group" :class="{'animate-float': estadoMascota !== 'celebrando'}">
          <!-- Orejas redondas -->
          <circle cx="72" cy="72" r="14" fill="#78350f" />
          <circle cx="128" cy="72" r="14" fill="#78350f" />
          <circle cx="72" cy="72" r="7" fill="#fde68a" />
          <circle cx="128" cy="72" r="7" fill="#fde68a" />
          <!-- Cuerpo -->
          <ellipse cx="100" cy="140" rx="48" ry="42" fill="#92400e" />
          <ellipse cx="100" cy="145" rx="28" ry="24" fill="#fde68a" />
          <!-- Cabeza -->
          <circle cx="100" cy="100" r="40" fill="#92400e" />
          <!-- Hocico -->
          <ellipse cx="100" cy="112" rx="22" ry="16" fill="#fde68a" />
          <!-- Expresiones Oso -->
          <g v-if="estadoMascota === 'triste'">
            <circle cx="88" cy="95" r="3.5" fill="#1a1a1a" />
            <circle cx="112" cy="95" r="3.5" fill="#1a1a1a" />
            <path d="M 90 126 Q 100 120 110 126" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round" />
          </g>
          <g v-else-if="estadoMascota === 'normal'">
            <circle cx="88" cy="95" r="4" fill="#1a1a1a" />
            <circle cx="112" cy="95" r="4" fill="#1a1a1a" />
            <path d="M 90 122 Q 100 128 110 122" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round" />
          </g>
          <g v-else-if="estadoMascota === 'feliz'" class="animate-bounce">
            <path d="M 84 96 Q 88 88 92 96" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round" />
            <path d="M 108 96 Q 112 88 116 96" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round" />
            <path d="M 88 118 Q 100 130 112 118" stroke="#1a1a1a" stroke-width="3.5" fill="none" stroke-linecap="round" />
          </g>
          <g v-else>
            <text x="35" y="45" font-size="20">✨</text><text x="145" y="45" font-size="20">✨</text>
            <circle cx="88" cy="95" r="5" fill="#fff" /><circle cx="112" cy="95" r="5" fill="#fff" />
          </g>
          <ellipse cx="100" cy="108" rx="10" ry="7" fill="#1a1a1a" />
        </g>

        <!-- ================= 5. PINGUINO ================= -->
        <g v-else-if="tipo === 'pinguino'" class="body-group" :class="{'animate-float': estadoMascota !== 'celebrando'}">
          <!-- Cuerpo ovalado negro -->
          <ellipse cx="100" cy="130" rx="42" ry="48" fill="#1e293b" />
          <!-- Panza blanca -->
          <ellipse cx="100" cy="135" rx="30" ry="38" fill="#f8fafc" />
          <!-- Patitas naranjas -->
          <ellipse cx="80" cy="180" rx="10" ry="5" fill="#f59e0b" />
          <ellipse cx="120" cy="180" rx="10" ry="5" fill="#f59e0b" />
          <!-- Cabeza / Cara -->
          <circle cx="100" cy="85" r="35" fill="#1e293b" />
          <path d="M 75 80 C 75 60, 125 60, 125 80 C 125 100, 100 110, 100 110 C 100 110, 75 100, 75 80 Z" fill="#f8fafc" />
          <!-- Pico naranja -->
          <polygon points="100,92 90,84 110,84" fill="#f59e0b" />
          <!-- Expresiones Pingüino -->
          <g v-if="estadoMascota === 'triste'">
            <circle cx="88" cy="78" r="3" fill="#1a1a1a" />
            <circle cx="112" cy="78" r="3" fill="#1a1a1a" />
          </g>
          <g v-else-if="estadoMascota === 'normal'">
            <circle cx="88" cy="76" r="3.5" fill="#1a1a1a" />
            <circle cx="112" cy="76" r="3.5" fill="#1a1a1a" />
          </g>
          <g v-else-if="estadoMascota === 'feliz'" class="animate-bounce">
            <path d="M 85 78 Q 88 72 91 78" stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round" />
            <path d="M 109 78 Q 112 72 115 78" stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round" />
          </g>
          <g v-else>
            <text x="35" y="45" font-size="20">✨</text><text x="145" y="45" font-size="20">✨</text>
            <circle cx="88" cy="76" r="4" fill="#fff" /><circle cx="112" cy="76" r="4" fill="#fff" />
          </g>
        </g>

        <!-- ================= 6. POLLITO ================= -->
        <g v-else-if="tipo === 'pollito'" class="body-group" :class="{'animate-float': estadoMascota !== 'celebrando'}">
          <!-- Cuerpo redondo y esponjoso -->
          <circle cx="100" cy="130" r="42" fill="#facc15" />
          <!-- Patitas y pico naranja -->
          <polygon points="100,108 90,100 110,100" fill="#f97316" />
          <line x1="88" y1="172" x2="88" y2="182" stroke="#f97316" stroke-width="3" stroke-linecap="round" />
          <line x1="112" y1="172" x2="112" y2="182" stroke="#f97316" stroke-width="3" stroke-linecap="round" />
          <!-- Expresiones Pollito -->
          <g v-if="estadoMascota === 'triste'">
            <circle cx="85" cy="95" r="3.5" fill="#1a1a1a" />
            <circle cx="115" cy="95" r="3.5" fill="#1a1a1a" />
          </g>
          <g v-else-if="estadoMascota === 'normal'">
            <circle cx="86" cy="95" r="4" fill="#1a1a1a" />
            <circle cx="114" cy="95" r="4" fill="#1a1a1a" />
          </g>
          <g v-else-if="estadoMascota === 'feliz'" class="animate-bounce">
            <path d="M 82 96 Q 86 90 90 96" stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round" />
            <path d="M 110 96 Q 114 90 118 96" stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round" />
          </g>
          <g v-else>
            <text x="35" y="45" font-size="20">✨</text><text x="145" y="45" font-size="20">✨</text>
            <circle cx="86" cy="95" r="4.5" fill="#fff" /><circle cx="114" cy="95" r="4.5" fill="#fff" />
          </g>
        </g>

        <!-- ================= 7. DRAGÓN ================= -->
        <g v-else-if="tipo === 'dragon'" class="body-group" :class="{'animate-float': estadoMascota !== 'celebrando'}">
          <!-- Alas pequeñas -->
          <path d="M 65 130 L 40 100 L 65 120 Z" fill="#059669" />
          <path d="M 135 130 L 160 100 L 135 120 Z" fill="#059669" />
          <!-- Cuerpo -->
          <ellipse cx="100" cy="140" rx="44" ry="40" fill="#10b981" />
          <!-- Cresta en la espalda -->
          <polygon points="100,95 95,85 105,85" fill="#f59e0b" />
          <polygon points="112,102 110,92 118,94" fill="#f59e0b" />
          <!-- Cabeza -->
          <circle cx="100" cy="100" r="36" fill="#10b981" />
          <!-- Cuernitos -->
          <polygon points="78,72 70,50 85,68" fill="#f59e0b" />
          <polygon points="122,72 130,50 115,68" fill="#f59e0b" />
          <!-- Expresiones Dragón -->
          <g v-if="estadoMascota === 'triste'">
            <circle cx="88" cy="95" r="3.5" fill="#1a1a1a" />
            <circle cx="112" cy="95" r="3.5" fill="#1a1a1a" />
            <path d="M 90 120 Q 100 114 110 120" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round" />
          </g>
          <g v-else-if="estadoMascota === 'normal'">
            <circle cx="88" cy="95" r="4" fill="#1a1a1a" />
            <circle cx="112" cy="95" r="4" fill="#1a1a1a" />
            <path d="M 90 118 Q 100 124 110 118" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round" />
          </g>
          <g v-else-if="estadoMascota === 'feliz'" class="animate-bounce">
            <path d="M 84 96 Q 88 88 92 96" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round" />
            <path d="M 108 96 Q 112 88 116 96" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round" />
            <path d="M 88 116 Q 100 126 112 116" stroke="#1a1a1a" stroke-width="3.5" fill="none" stroke-linecap="round" />
          </g>
          <g v-else>
            <text x="35" y="45" font-size="20">🔥</text><text x="145" y="45" font-size="20">🔥</text>
            <circle cx="88" cy="95" r="5" fill="#fff" /><circle cx="112" cy="95" r="5" fill="#fff" />
          </g>
          <!-- Hocico y fosas nasales humeantes -->
          <ellipse cx="100" cy="110" rx="14" ry="9" fill="#059669" />
          <circle cx="95" cy="108" r="2" fill="#1a1a1a" />
          <circle cx="105" cy="108" r="2" fill="#1a1a1a" />
        </g>

      </svg>
    </div>

    <!-- Información de la mascota -->
    <div class="pet-info-display">
      <span class="pet-level-tag">{{ nivel }}</span>
      <h3 class="pet-name-text">{{ nombre }}</h3>
      <span class="pet-status-tag" :class="estadoMascota">{{ estadoMascota }}</span>
    </div>
  </div>
</template>

<style scoped>
.pet-scene-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 100%;
  position: relative;
}

.pet-visual {
  width: 100px;
  height: 100px;
  position: relative;
}

.pet-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

@keyframes floatAnimation {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(2deg); }
}

@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulseScale {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.3); opacity: 1; }
}

@keyframes bounceFast {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.animate-float { animation: floatAnimation 4s ease-in-out infinite; }
.animate-spin-slow { animation: spinSlow 10s linear infinite; }
.animate-bounce { animation: bounceFast 0.4s ease-in-out infinite; }

.pet-info-display {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.pet-level-tag {
  font-family: 'Oswald', sans-serif;
  font-size: 10px;
  font-weight: 700;
  background: rgba(234, 179, 8, 0.2);
  color: #facc15;
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid rgba(234, 179, 8, 0.4);
  text-transform: uppercase;
}

.pet-name-text {
  font-family: 'Anton', sans-serif;
  font-size: 1.1rem;
  color: #fff;
  text-transform: uppercase;
  margin: 0;
  letter-spacing: 0.5px;
}

.pet-status-tag {
  font-size: 10px;
  font-weight: 600;
  text-transform: capitalize;
  padding: 1px 6px;
  border-radius: 4px;
  margin-top: 2px;
}

.pet-status-tag.triste { background: rgba(239, 68, 68, 0.2); color: #f87171; }
.pet-status-tag.normal { background: rgba(245, 245, 244, 0.1); color: rgba(245, 245, 244, 0.6); }
.pet-status-tag.feliz { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
.pet-status-tag.celebrando { background: rgba(250, 204, 21, 0.25); color: #facc15; animation: pulseScale 1s infinite; }
</style>