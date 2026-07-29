<template>
  <div class="app-wrapper" :class="{ 'sidebar-open': isSidebarOpen }">
  <main class="main-content-wrapper" >
    
      <slot /> 
    </main>

     </div>
     
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Oswald&display=swap');

.app-wrapper { min-height: 100vh; background: #0a0a0a; font-family: 'Inter', sans-serif; }

.sidebar-container { width: 280px; height: 100vh; position: fixed; top: 0; left: 0; background: #0f172a; transform: translateX(-100%); transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); z-index: 3000; }
.sidebar-open .sidebar-container { transform: translateX(0); }
.sidebar-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); z-index: 2999; cursor: pointer; }

.top-nav { 
  display: flex; justify-content: space-between; 
  padding: 12px 20px; background: #22212144; 
  border-bottom: 1px solid rgba(255, 255, 255, 0.09); 
}

.nav-left, .nav-right { display: flex; gap: 10px; align-items: center; }

.nav-action-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px; border-radius: 12px;
  cursor: pointer; display: flex; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-action-btn:hover { 
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.1); 
  border-color: #3b82f6; 
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.svg-icon { width: 24px; height: 24px; fill: #f5f5f4; pointer-events: none; }

.notification { position: relative; }
.dot { 
  position: absolute; top: 6px; right: 6px; 
  width: 7px; height: 7px; 
  background: #3b82f6; border-radius: 50%; 
}

.modal-wrapper {
  position: fixed; inset: 0; z-index: 4000;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px);
}

.custom-panel {
  background: #121212;
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: #f5f5f4;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  width: 92%;
  max-width: 440px;
}

.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.panel-header h3 { font-family: 'Oswald', sans-serif; font-size: 1.3rem; margin: 0; color: #1c4fd6; }

.close-panel {
  background: rgba(255, 255, 255, 0.03);
  border: none; color: #f5f5f4;
  font-size: 1.6rem; width: 36px; height: 36px;
  border-radius: 12px; cursor: pointer;
  transition: all 0.2s ease;
}
.close-panel:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

.panel-body { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 24px; }
.qr-container { background: #f5f5f4; padding: 16px; border-radius: 16px; }
.qr-container img { width: 180px; height: 180px; display: block; }

.web-preview {
  width: 70px; height: 70px; background: rgba(255, 255, 255, 0.03);
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.web-preview:hover {
  transform: translateY(-8px);
  background: rgba(28, 79, 214, 0.2);
  border-color: rgba(28, 79, 214, 0.5);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}
.large-svg { width: 32px; fill: #f5f5f4; pointer-events: none; }

.panel-body p { color: rgba(245, 245, 244, 0.55); font-size: 0.95rem; line-height: 1.6; margin: 0; }

.action-btn-full {
  width: 100%; padding: 14px; border-radius: 12px; border: none;
  background: #1c4fd6; color: #ffffff;
  font-family: 'Oswald', sans-serif; font-size: 0.95rem;
  cursor: pointer; transition: all 0.2s ease;
}
.action-btn-full.outline {
  background: transparent; border: 1.5px solid rgba(255, 255, 255, 0.15);
  color: #f5f5f4; margin-top: 8px;
}
.action-btn-full:hover { background: #123ba0; transform: translateY(-1px); }
</style>

<script setup>
import { ref } from 'vue';
import Sidebar from '../Owner/Sidebar.vue';

const isSidebarOpen = ref(false);
</script>