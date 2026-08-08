// src/components/Owner/useLang.js
import { ref, computed } from 'vue';
import { traducciones } from './i18n.js';

const lang = ref(localStorage.getItem('appLang') || 'es');

export function useLang() {
  const setLang = (newLang) => {
    lang.value = newLang;
    localStorage.setItem('appLang', newLang);
  };

  // Esto es la magia: una propiedad computada que devuelve 
  // el objeto de traducciones correspondiente al idioma actual.
  const t = computed(() => traducciones[lang.value] || traducciones.es);

  return {
    lang,
    setLang,
    t
  };
}