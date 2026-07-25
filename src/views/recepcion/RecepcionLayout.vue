<template>
  <div class="recepcion-layout">
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

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
//import Heading from '../../components/Admin/HeadingAdmin.vue';
import Sidebar from '../../components/Admin/Sidebar.vue';

const route = useRoute();

// Extrae el nombre de la ruta para pasárselo al Heading automáticamente
const currentRouteName = computed(() => {
  return (route.name as string)?.replace('recepcion-', '').replace('-', ' ') || 'Dashboard';
});
</script>

