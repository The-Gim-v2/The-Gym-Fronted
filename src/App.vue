<script setup lang="ts">
import { RouterView } from 'vue-router'
import HelpButton from './components/Owner/HelpButton.vue';
</script>



<template>
  <RouterView />
  <HelpButton />
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #0f172a; 
  color: white;
  overflow-x: hidden;
}


::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #0f172a;
}
::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #334155;
}
</style>