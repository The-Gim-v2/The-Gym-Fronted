<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// import Heading from '../../components/Member/HeadingMember.vue';
import Sidebar from '../../components/Member/Sidebar.vue';

const route = useRoute();
const router = useRouter();

// Define el rol requerido estrictamente para este layout de miembros
const REQUIRED_ROLE = 'Member';

// Función centralizada para verificar permisos y bloquear accesos indebidos
const verifySecurityAccess = () => {
  const userRole = localStorage.getItem('user_role');

  // Si no hay rol o el rol no coincide exactamente con el permitido, expulsión total
  if (!userRole || userRole !== REQUIRED_ROLE) {
    localStorage.removeItem('user_role');
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
  return (route.name as string)?.replace('member-', '').replace('-', ' ') || 'Dashboard';
});
</script>

<template>
  <!-- Contenedor blindado: Protege la vista completa del miembro -->
  <div class="member-layout">
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