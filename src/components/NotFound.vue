<template>
  <div class="not-found">
    <h1>404</h1>
    <p>¡Oops! La página que buscas no existe.</p>
    <router-link to="/">Volver al inicio</router-link>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 50px;
  color: #fff;
  background: #0a0a0a;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.not-found h1 {
  font-size: 5rem;
  color: #3a6bd6;
  margin: 0;
}
</style>