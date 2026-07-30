<template>
  <div class="floating-cloud-container">
    <!-- SVG de una nube blanca optimizada para móviles -->
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      class="cloud-svg-icon"
    >
      <path 
        d="M19.36 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.64-4.96z" 
        fill="white"
        stroke="#cbd5e1" 
        stroke-width="0.8"
      />
    </svg>
  </div>
</template>

<style scoped>
.floating-cloud-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  /* Evita que elementos flotantes generen barras de desplazamiento horizontal en móviles */
  overflow: hidden; 
}

.cloud-svg-icon {
  /* Usamos clamp para que se adapte dinámicamente: 
     mínimo 24px en celulares pequeños, 
     ideal 7vw, 
     máximo 36px en pantallas grandes */
  width: clamp(24px, 7vw, 36px);
  height: auto;
  
  /* Animación suave de flotación */
  animation: float 3s ease-in-out infinite;
  
  /* Sombra sutil optimizada para rendimiento móvil */
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
}

/* Animación ajustada para pantallas pequeñas (movimiento más corto y elegante) */
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px); /* Reducido a 5px para que no desentone en pantallas compactas */
  }
  100% {
    transform: translateY(0px);
  }
}
</style>