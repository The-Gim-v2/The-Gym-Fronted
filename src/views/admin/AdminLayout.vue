<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
//import Heading from '../../components/Admin/HeadingAdmin.vue';
//import Sidebar from '../../components/Admin/Sidebar.vue';

const route = useRoute();
const router = useRouter();

// Define el rol requerido estrictamente para este layout
const REQUIRED_ROLE = 'Admin';

// Función centralizada para verificar permisos y bloquear accesos indebidos
const verifySecurityAccess = () => {
  const userRole = localStorage.getItem('user_role');

  // Si no hay rol o el rol no coincide exactamente con el permitido, expulsión total
  if (!userRole || userRole !== REQUIRED_ROLE) {
    // Limpiamos por seguridad cualquier rastro alterado
    localStorage.removeItem('user_role');
    
    // Redirección inmediata a la ruta pública o login para evitar visualización de datos
    router.replace({ name: 'home' });
  }
};

// Validar seguridad al cargar el componente por primera vez
onMounted(() => {
  verifySecurityAccess();
});

// Vigilar cambios en la ruta por si intentan navegar internamente de forma anómala
watch(
  () => route.fullPath,
  () => {
    verifySecurityAccess();
  }
);

// Extrae el nombre de la ruta para pasárselo al Heading automáticamente
const currentRouteName = computed(() => {
  return (route.name as string)?.replace('admin-', '').replace('-', ' ') || 'Dashboard';
});
</script>

<template>
  <!-- Contenedor blindado: Si no pasa la validación anterior, el router-view jamás se expone -->
  <div class="Admin-layout">
    <!-- <aside class="sidebar-container">
      <Sidebar /> 
    </aside>-->

    <div class="main-wrapper">
      <Heading :title="currentRouteName" />

      <main class="content-area">
        <router-view />
      </main>
    </div>
  </div>
</template>