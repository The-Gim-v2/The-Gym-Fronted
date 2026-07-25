<script setup>
import { computed } from 'vue';

const props = defineProps({
  nombre: { type: String, default: 'Entrenador' },
  nivel: { type: String, default: 'Nivel 90' },
  racha: { type: Number, default: 0 },
  tipo: { type: String, default: 'perro' }
});

const etapaMascota = computed(() => {
  if (props.racha === 0) return 'huevo';
  if (props.racha < 10) return 'bebe';
  if (props.racha < 30) return 'adolescente';
  if (props.racha < 100) return 'adulto';
  if (props.racha < 200) return 'senior';
  return 'musculoso';
});

const escalaMascota = computed(() => {
  switch (etapaMascota.value) {
    case 'huevo': return 0.70;
    case 'bebe': return 0.65;
    case 'adolescente': return 0.85;
    case 'adulto': return 1.00;
    case 'senior': return 1.15;
    case 'musculoso': return 1.45;
    default: return 1;
  }
});

const temaEvolucion = computed(() => `theme-${etapaMascota.value}`);
</script>

<template>
  <div class="pet-card-inner" :class="temaEvolucion">
    <div class="ambient-glow"></div>

    <div class="ambient-particles">
      <template v-if="tipo === 'perro'">
        <span class="particle bone">🦴</span>
        <span class="particle star delay-1">✨</span>
        <span class="particle paw delay-2">🐾</span>
      </template>
      <template v-else-if="tipo === 'gato'">
        <span class="particle fish">🐟</span>
        <span class="particle star delay-1">✨</span>
        <span class="particle paw delay-2">🐾</span>
      </template>
      <template v-else-if="tipo === 'pinguino'">
        <span class="particle ice">🧊</span>
        <span class="particle ice delay-1">❄️</span>
        <span class="particle ice delay-2">✨</span>
      </template>
      <template v-else-if="tipo === 'zorro'">
        <span class="particle flower">🌸</span>
        <span class="particle flower delay-1">🌼</span>
        <span class="particle leaf delay-2">🍃</span>
      </template>
      <template v-else-if="tipo === 'oso_pardo' || tipo === 'oso_polar'">
        <span class="particle snow">❄️</span>
        <span class="particle snow delay-1">❄️</span>
        <span class="particle leaf delay-2">🍂</span>
      </template>
      <template v-else-if="tipo === 'panda'">
        <span class="particle bamboo">🎋</span>
        <span class="particle leaf delay-1">🍃</span>
        <span class="particle bamboo delay-2">🎋</span>
      </template>
      <template v-else-if="tipo === 'rana'">
        <span class="particle bubble">💧</span>
        <span class="particle leaf delay-1">🍃</span>
        <span class="particle bubble delay-2">💧</span>
      </template>
      <template v-else-if="tipo === 'conejo'">
        <span class="particle flower">🌸</span>
        <span class="particle star delay-1">✨</span>
        <span class="particle leaf delay-2">🍃</span>
      </template>
      <template v-else>
        <span class="particle star">✨</span>
        <span class="particle star delay-1">⭐</span>
      </template>
    </div>

    <div class="pet-visual">
      <svg viewBox="0 0 200 200" class="pet-svg" :class="etapaMascota">
        <defs>
          <radialGradient id="eggGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="30%" stop-color="#fdfbf7" />
            <stop offset="70%" stop-color="#e2d8c5" />
            <stop offset="100%" stop-color="#b5a48b" />
          </radialGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#000" flood-opacity="0.4" />
          </filter>
        </defs>

        <ellipse cx="100" cy="172" rx="42" ry="10" fill="rgba(0,0,0,0.35)" filter="blur(3px)" />

        <!-- ESTADO: HUEVO -->
        <g v-if="etapaMascota === 'huevo'" class="body-group animate-float">
          <ellipse cx="100" cy="115" rx="44" ry="54" fill="url(#eggGrad)" stroke="#c4b59d" stroke-width="2" filter="url(#softShadow)" />
          <path d="M 85 110 Q 100 120 115 110" stroke="#b5a48b" stroke-width="2" fill="none" stroke-linecap="round" />
          <text x="105" y="55" font-size="18" class="animate-zzz">💤</text>
        </g>

        <!-- MASCOTAS -->
        <g v-else class="body-group animate-float" :transform="`translate(100, 115) scale(${escalaMascota}) translate(-100, -115)`" filter="url(#softShadow)">
          
          <!-- PINGÜINO SUPREMO KAWAII -->
          <template v-if="tipo === 'pinguino'">
            <ellipse cx="100" cy="132" rx="27" ry="31" fill="#1e293b" />
            <ellipse cx="100" cy="135" rx="18" ry="24" fill="#f8fafc" />
            <path d="M 74 120 Q 68 138 75 148" stroke="#1e293b" stroke-width="6" stroke-linecap="round" fill="none" />
            <path d="M 126 120 Q 132 138 125 148" stroke="#1e293b" stroke-width="6" stroke-linecap="round" fill="none" />
            <circle cx="100" cy="94" r="26" fill="#1e293b" />
            <path d="M 76 90 Q 100 110 124 90 Z" fill="#f8fafc" />
            <path d="M 74 106 Q 100 116 126 106 Q 130 112 122 116 Q 100 124 78 116 Z" fill="#ef4444" />
            <path d="M 110 112 Q 118 140 112 158 Q 106 158 106 140 Z" fill="#ef4444" />
            <circle cx="89" cy="92" r="5" fill="#0f172a" />
            <circle cx="111" cy="92" r="5" fill="#0f172a" />
            <circle cx="91" cy="90" r="2" fill="#fff" />
            <circle cx="113" cy="90" r="2" fill="#fff" />
            <ellipse cx="82" cy="98" rx="4" ry="2.5" fill="#f472b6" opacity="0.7" />
            <ellipse cx="118" cy="98" rx="4" ry="2.5" fill="#f472b6" opacity="0.7" />
            <polygon points="100,95 94,100 106,100" fill="#f97316" />
            <path d="M 76 82 Q 100 45 130 65 Q 110 82 76 82 Z" fill="#ef4444" />
            <circle cx="132" cy="62" r="6" fill="#f8fafc" />
            <ellipse cx="87" cy="164" rx="7" ry="4" fill="#f97316" />
            <ellipse cx="113" cy="164" rx="7" ry="4" fill="#f97316" />
          </template>

          <!-- ZORRO NUEVA CARITA KAWAII -->
          <template v-else-if="tipo === 'zorro'">
            <!-- Colita esponjosa -->
            <path d="M 116 134 Q 146 138 152 112 Q 158 88 138 100" fill="#ea580c" stroke="#7c2d12" stroke-width="2" />
            <ellipse cx="145" cy="102" rx="6" ry="8" fill="#f8fafc" transform="rotate(25 145 102)" />
            
            <!-- Cuerpo -->
            <ellipse cx="100" cy="132" rx="24" ry="20" fill="#ea580c" stroke="#7c2d12" stroke-width="2" />
            <path d="M 88 124 Q 100 134 112 124 Q 116 142 100 144 Q 84 142 88 124 Z" fill="#ffedd5" />
            
            <!-- Orejas -->
            <polygon points="76,80 66,42 94,66" fill="#ea580c" stroke="#7c2d12" stroke-width="2" stroke-linejoin="round" />
            <polygon points="78,76 72,50 88,66" fill="#fbcfe8" />
            <polygon points="124,80 134,42 106,66" fill="#ea580c" stroke="#7c2d12" stroke-width="2" stroke-linejoin="round" />
            <polygon points="122,76 128,50 112,66" fill="#fbcfe8" />
            
            <!-- Cabeza -->
            <circle cx="100" cy="98" r="30" fill="#ea580c" stroke="#7c2d12" stroke-width="2" />
            
            <!-- Hocico y mejillas unificadas (Estilo tierno ovalado) -->
            <ellipse cx="100" cy="104" rx="15" ry="12" fill="#fff" stroke="#7c2d12" stroke-width="1.5" />
            
            <!-- Ojos grandes expresivos con doble brillo -->
            <circle cx="87" cy="93" r="5" fill="#0f172a" />
            <circle cx="113" cy="93" r="5" fill="#0f172a" />
            <circle cx="85.5" cy="91.5" r="2" fill="#fff" />
            <circle cx="111.5" cy="91.5" r="2" fill="#fff" />
            <circle cx="88.5" cy="95" r="0.8" fill="#fff" />
            <circle cx="114.5" cy="95" r="0.8" fill="#fff" />
            
            <!-- Mejillas sonrosadas -->
            <ellipse cx="76" cy="101" rx="5" ry="3" fill="#f472b6" opacity="0.75" />
            <ellipse cx="124" cy="101" rx="5" ry="3" fill="#f472b6" opacity="0.75" />
            
            <!-- Nariz triangular y sonrisa tierna -->
            <polygon points="100,101 96,96 104,96" fill="#0f172a" />
            <path d="M 94 106 Q 100 111 106 106" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round" />
          </template>

          <!-- PERRITO KAWAII -->
          <template v-else-if="tipo === 'perro'">
            <ellipse cx="100" cy="138" rx="26" ry="20" fill="#fff" stroke="#451a03" stroke-width="2.5" />
            <path d="M 108 128 Q 126 128 124 148 Q 110 148 108 138 Z" fill="#78350f" />
            <path d="M 124 130 Q 142 115 138 128" stroke="#451a03" stroke-width="4" stroke-linecap="round" fill="none" />
            <ellipse cx="88" cy="154" rx="6" ry="12" fill="#fff" stroke="#451a03" stroke-width="2.5" />
            <ellipse cx="112" cy="154" rx="6" ry="12" fill="#fff" stroke="#451a03" stroke-width="2.5" />
            <path d="M 76 90 Q 50 110 60 135 Q 75 135 80 115 Z" fill="#78350f" stroke="#451a03" stroke-width="2.5" />
            <path d="M 124 90 Q 150 110 140 135 Q 125 135 120 115 Z" fill="#78350f" stroke="#451a03" stroke-width="2.5" />
            <circle cx="100" cy="98" r="34" fill="#fff" stroke="#451a03" stroke-width="2.5" />
            <ellipse cx="87" cy="94" rx="9" ry="11" fill="#451a03" />
            <ellipse cx="113" cy="94" rx="9" ry="11" fill="#451a03" />
            <circle cx="84" cy="91" r="3.5" fill="#fff" />
            <circle cx="110" cy="91" r="3.5" fill="#fff" />
            <ellipse cx="76" cy="104" rx="6" ry="3.5" fill="#f472b6" opacity="0.6" />
            <ellipse cx="124" cy="104" rx="6" ry="3.5" fill="#f472b6" opacity="0.6" />
            <ellipse cx="100" cy="106" rx="12" ry="9" fill="#fff" stroke="#451a03" stroke-width="1.5" />
            <ellipse cx="100" cy="101" rx="4.5" ry="3.5" fill="#451a03" />
            <path d="M 94 110 Q 100 114 106 110" stroke="#451a03" stroke-width="2" fill="none" stroke-linecap="round" />
          </template>

          <!-- GATO KAWAII -->
          <template v-else-if="tipo === 'gato'">
            <ellipse cx="100" cy="138" rx="26" ry="20" fill="#fff" stroke="#581c87" stroke-width="2.5" />
            <circle cx="112" cy="134" r="6" fill="#d8b4fe" />
            <path d="M 124 135 Q 145 120 138 100" stroke="#581c87" stroke-width="4" stroke-linecap="round" fill="none" />
            <ellipse cx="88" cy="154" rx="6" ry="12" fill="#fff" stroke="#581c87" stroke-width="2.5" />
            <ellipse cx="112" cy="154" rx="6" ry="12" fill="#fff" stroke="#581c87" stroke-width="2.5" />
            <polygon points="72,78 60,42 90,64" fill="#c084fc" stroke="#581c87" stroke-width="2.5" stroke-linejoin="round" />
            <polygon points="128,78 140,42 110,64" fill="#c084fc" stroke="#581c87" stroke-width="2.5" stroke-linejoin="round" />
            <circle cx="100" cy="98" r="34" fill="#fff" stroke="#581c87" stroke-width="2.5" />
            <ellipse cx="87" cy="94" rx="9" ry="11" fill="#581c87" />
            <ellipse cx="113" cy="94" rx="9" ry="11" fill="#581c87" />
            <circle cx="84" cy="91" r="3.5" fill="#fff" />
            <circle cx="110" cy="91" r="3.5" fill="#fff" />
            <polygon points="100,103 96,99 104,99" fill="#f472b6" />
            <path d="M 94 105 Q 97 109 100 105 Q 103 109 106 105" stroke="#581c87" stroke-width="2" fill="none" stroke-linecap="round" />
          </template>

          <!-- RANA KAWAII -->
          <template v-else-if="tipo === 'rana'">
            <ellipse cx="75" cy="152" rx="14" ry="8" fill="#16a34a" stroke="#14532d" stroke-width="2" />
            <ellipse cx="125" cy="152" rx="14" ry="8" fill="#16a34a" stroke="#14532d" stroke-width="2" />
            <ellipse cx="100" cy="138" rx="28" ry="22" fill="#22c55e" stroke="#14532d" stroke-width="2" />
            <ellipse cx="100" cy="142" rx="16" ry="12" fill="#86efac" />
            <circle cx="84" cy="142" r="5" fill="#16a34a" stroke="#14532d" stroke-width="1.5" />
            <circle cx="116" cy="142" r="5" fill="#16a34a" stroke="#14532d" stroke-width="1.5" />
            <ellipse cx="100" cy="98" rx="36" ry="28" fill="#22c55e" stroke="#14532d" stroke-width="2" />
            <ellipse cx="80" cy="88" rx="11" ry="13" fill="#0f172a" />
            <circle cx="77" cy="84" r="4" fill="#fff" />
            <ellipse cx="120" cy="88" rx="11" ry="13" fill="#0f172a" />
            <circle cx="117" cy="84" r="4" fill="#fff" />
            <ellipse cx="69" cy="98" rx="6" ry="3.5" fill="#f472b6" opacity="0.7" />
            <ellipse cx="131" cy="98" rx="6" ry="3.5" fill="#f472b6" opacity="0.7" />
            <path d="M 92 104 Q 100 112 108 104" stroke="#14532d" stroke-width="2.5" fill="none" stroke-linecap="round" />
          </template>

          <!-- OSO PARDO -->
          <template v-else-if="tipo === 'oso_pardo'">
            <circle cx="74" cy="72" r="12" fill="#78350f" stroke="#451a03" stroke-width="2" />
            <circle cx="126" cy="72" r="12" fill="#78350f" stroke="#451a03" stroke-width="2" />
            <ellipse cx="100" cy="135" rx="30" ry="24" fill="#92400e" stroke="#451a03" stroke-width="2" />
            <circle cx="100" cy="98" r="34" fill="#92400e" stroke="#451a03" stroke-width="2" />
            <ellipse cx="100" cy="106" rx="16" ry="12" fill="#fde68a" />
            <circle cx="100" cy="101" r="5.5" fill="#451a03" />
            <circle cx="87" cy="92" r="4" fill="#451a03" />
            <circle cx="113" cy="92" r="4" fill="#451a03" />
            <path d="M 94 113 Q 100 118 106 113" stroke="#451a03" stroke-width="2" fill="none" stroke-linecap="round" />
          </template>

          <!-- OSO POLAR -->
          <template v-else-if="tipo === 'oso_polar'">
            <circle cx="74" cy="72" r="12" fill="#cbd5e1" stroke="#334155" stroke-width="2" />
            <circle cx="126" cy="72" r="12" fill="#cbd5e1" stroke="#334155" stroke-width="2" />
            <ellipse cx="100" cy="135" rx="30" ry="24" fill="#f1f5f9" stroke="#334155" stroke-width="2" />
            <circle cx="100" cy="98" r="34" fill="#f1f5f9" stroke="#334155" stroke-width="2" />
            <ellipse cx="100" cy="106" rx="16" ry="12" fill="#e2e8f0" />
            <circle cx="100" cy="101" r="5.5" fill="#0f172a" />
            <circle cx="87" cy="92" r="4" fill="#0f172a" />
            <circle cx="113" cy="92" r="4" fill="#0f172a" />
            <path d="M 94 113 Q 100 118 106 113" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round" />
          </template>

          <!-- PANDA -->
          <template v-else-if="tipo === 'panda'">
            <circle cx="72" cy="74" r="13" fill="#1e293b" />
            <circle cx="128" cy="74" r="13" fill="#1e293b" />
            <ellipse cx="100" cy="135" rx="30" ry="24" fill="#f8fafc" stroke="#1e293b" stroke-width="2" />
            <circle cx="100" cy="98" r="34" fill="#f8fafc" stroke="#1e293b" stroke-width="2" />
            <ellipse cx="86" cy="96" rx="10" ry="12" fill="#1e293b" transform="rotate(-15 86 96)" />
            <ellipse cx="114" cy="96" rx="10" ry="12" fill="#1e293b" transform="rotate(15 114 96)" />
            <circle cx="85" cy="95" r="3.5" fill="#fff" />
            <circle cx="115" cy="95" r="3.5" fill="#fff" />
            <ellipse cx="100" cy="104" rx="6" ry="4" fill="#1e293b" />
            <path d="M 96 112 Q 100 116 104 112" stroke="#1e293b" stroke-width="2" fill="none" stroke-linecap="round" />
          </template>

          <!-- CONEJO -->
          <template v-else-if="tipo === 'conejo'">
            <ellipse cx="84" cy="60" rx="8" ry="25" fill="#cbd5e1" stroke="#334155" stroke-width="2" />
            <ellipse cx="116" cy="60" rx="8" ry="25" fill="#cbd5e1" stroke="#334155" stroke-width="2" />
            <ellipse cx="100" cy="135" rx="26" ry="22" fill="#e2e8f0" stroke="#334155" stroke-width="2" />
            <circle cx="100" cy="100" r="32" fill="#e2e8f0" stroke="#334155" stroke-width="2" />
            <circle cx="87" cy="94" r="4" fill="#0f172a" />
            <circle cx="113" cy="94" r="4" fill="#0f172a" />
            <ellipse cx="100" cy="102" rx="5" ry="3.5" fill="#f472b6" />
            <path d="M 96 110 Q 100 114 104 110" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round" />
          </template>

          <!-- GENÉRICO -->
          <template v-else>
            <circle cx="100" cy="130" r="26" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2" />
            <circle cx="85" cy="90" r="11" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2" />
            <circle cx="115" cy="90" r="11" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2" />
            <path d="M 88 112 Q 100 122 112 112" stroke="#1d4ed8" stroke-width="2.5" fill="none" stroke-linecap="round" />
          </template>

        </g>
      </svg>
    </div>

    <div class="pet-info-footer">
      <span class="pet-stage-tag">{{ nivel }} • {{ etapaMascota }}</span>
      <h3 class="pet-name">{{ nombre }}</h3>
    </div>
  </div>
</template>

<style scoped>
.pet-card-inner {
  width: 100%;
  height: 100%;
  min-height: 250px;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  transition: background 0.5s ease, border-color 0.5s ease;
  box-sizing: border-box;
}

.theme-huevo { background: linear-gradient(135deg, rgba(148, 163, 184, 0.25) 0%, rgba(15, 23, 42, 0.9) 100%); border: 1px solid rgba(148, 163, 184, 0.3); }
.theme-bebe { background: linear-gradient(135deg, rgba(234, 179, 8, 0.25) 0%, rgba(15, 23, 42, 0.9) 100%); border: 1px solid rgba(234, 179, 8, 0.4); }
.theme-adolescente { background: linear-gradient(135deg, rgba(249, 115, 22, 0.3) 0%, rgba(15, 23, 42, 0.9) 100%); border: 1px solid rgba(249, 115, 22, 0.4); }
.theme-adulto { background: linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(15, 23, 42, 0.9) 100%); border: 1px solid rgba(236, 72, 153, 0.4); }
.theme-senior { background: linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(15, 23, 42, 0.9) 100%); border: 1px solid rgba(168, 85, 247, 0.4); }
.theme-musculoso { background: linear-gradient(135deg, rgba(59, 130, 246, 0.35) 0%, rgba(15, 23, 42, 0.9) 100%); border: 1px solid rgba(59, 130, 246, 0.5); }

.ambient-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.particle {
  position: absolute;
  font-size: 14px;
  animation: floatParticle 4s ease-in-out infinite;
  opacity: 0.7;
}

.particle.bone, .particle.fish, .particle.flower { top: 20%; left: 15%; animation-duration: 3.5s; }
.particle.ice { top: 25%; right: 18%; animation-duration: 4s; }
.particle.snow { top: 15%; left: 75%; animation-duration: 4.5s; }
.particle.bamboo { top: 30%; left: 12%; animation-duration: 5s; }
.particle.bubble { top: 22%; right: 20%; animation-duration: 3s; }
.particle.leaf { top: 70%; left: 15%; animation-duration: 4.2s; }
.particle.paw { top: 75%; right: 15%; animation-duration: 3.8s; }
.particle.star { top: 20%; right: 25%; animation-duration: 3.2s; }

.particle.delay-1 { animation-delay: 1.2s; left: 80%; top: 60%; }
.particle.delay-2 { animation-delay: 2.4s; left: 45%; top: 15%; }

@keyframes floatParticle {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
  50% { transform: translateY(-12px) rotate(15deg); opacity: 0.9; }
}

.pet-visual {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  z-index: 2;
}

.pet-svg {
  width: 140px;
  height: 140px;
  transition: transform 0.5s ease;
}

@keyframes floatAnim {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

@keyframes pulseGlow {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.08); opacity: 1; }
}

.animate-float { animation: floatAnim 3s ease-in-out infinite; }
.animate-zzz { animation: floatAnim 2s ease-in-out infinite; }

.musculoso {
  animation: floatAnim 2.2s ease-in-out infinite, pulseGlow 2s ease-in-out infinite;
  filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
}

.pet-info-footer {
  text-align: center;
  z-index: 2;
}

.pet-stage-tag {
  font-family: 'Oswald', sans-serif;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 3px 8px;
  background: rgba(0, 0, 0, 0.4);
  color: #facc15;
  border-radius: 6px;
  letter-spacing: 0.5px;
}

.pet-name {
  font-family: 'Anton', sans-serif;
  font-size: 1.1rem;
  margin: 6px 0 0;
  color: #f5f5f4;
  letter-spacing: 0.5px;
}
</style>