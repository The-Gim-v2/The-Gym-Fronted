<template>
  <div class="form-panel glass-effect">
    <NotificationSystem ref="toastRef" />
    
    <div class="panel-header">
      <div class="title-group">
        <h2 class="form-title">{{ t('emailTitle') }} <span class="highlight">{{ t('emailHighlight') }}</span></h2>
        <p class="form-subtitle">{{ t('emailSubtitle') }}</p>
      </div>
      <button class="close-x" @click="$emit('close')" :aria-label="t('close')">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
    
    <div class="form-body">
      <div class="input-group">
        <label>{{ t('recipients') }}</label>
        <input 
          type="text" 
          v-model="emailForm.destinatarios" 
          class="custom-input" 
          :placeholder="t('recipientsPlaceholder')"
        >
      </div>

      <div class="input-group">
        <label>{{ t('subject') }}</label>
        <input 
          type="text" 
          v-model="emailForm.asunto" 
          class="custom-input" 
          :placeholder="t('subjectPlaceholder')"
        >
      </div>

      <div class="editor-container">
        <div class="toolbar">
          <button type="button" class="tool-btn" @click="execCommand('bold')" :title="t('bold')">
            <b>B</b>
          </button>
          <button type="button" class="tool-btn" @click="execCommand('italic')" :title="t('italic')">
            <i>I</i>
          </button>
          <button type="button" class="tool-btn" @click="execCommand('underline')" :title="t('underline')">
            <u>U</u>
          </button>
          <div class="toolbar-separator"></div>
          <button type="button" class="tool-btn" @click="fileInput?.click()" :title="t('attachImage')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M21 15l-5-5L5 21"/>
            </svg>
          </button>
          <input type="file" ref="fileInput" @change="handleImage" style="display: none" accept="image/*">
        </div>

        <div 
          ref="editor" 
          class="custom-input editor-area" 
          contenteditable="true" 
          @input="updateContent"
          :data-placeholder="t('editorPlaceholder')"
        ></div>
      </div>

      <button class="btn-send" @click="sendEmail">
        <span>{{ t('btnSend') }}</span>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import NotificationSystem from '../../Modals/NotificationSystem.vue';

const toastRef = ref<any>(null);
const editor = ref<HTMLElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const settings = reactive({
  idioma: localStorage.getItem('Recepcion-idioma') || 'es'
});

const translations: Record<string, Record<string, string>> = {
  es: {
    emailTitle: "ENVIAR",
    emailHighlight: "CORREO",
    emailSubtitle: "Redacta y personaliza tu mensaje",
    close: "Cerrar modal",
    recipients: "Destinatarios",
    recipientsPlaceholder: "ejemplo@mail.com, otro@mail.com",
    subject: "Asunto",
    subjectPlaceholder: "Ej. Promoción especial de temporada",
    bold: "Negrita",
    italic: "Cursiva",
    underline: "Subrayado",
    attachImage: "Adjuntar imagen",
    editorPlaceholder: "Escribe tu mensaje aquí...",
    btnSend: "Enviar Correo",
    imgAdded: "Imagen añadida al contenido",
    completeFields: "Completa el asunto y el mensaje",
    emailSent: "Correo enviado correctamente"
  },
  en: {
    emailTitle: "SEND",
    emailHighlight: "EMAIL",
    emailSubtitle: "Draft and customize your message",
    close: "Close modal",
    recipients: "Recipients",
    recipientsPlaceholder: "example@mail.com, other@mail.com",
    subject: "Subject",
    subjectPlaceholder: "E.g. Special seasonal promotion",
    bold: "Bold",
    italic: "Italic",
    underline: "Underline",
    attachImage: "Attach image",
    editorPlaceholder: "Write your message here...",
    btnSend: "Send Email",
    imgAdded: "Image added to content",
    completeFields: "Complete subject and message",
    emailSent: "Email sent successfully"
  }
};

const t = (key: string) => {
  return translations[settings.idioma]?.[key] || translations['es']?.[key] || key;
};

const emailForm = reactive({ asunto: '', destinatarios: '', mensaje: '' });

const execCommand = (cmd: string) => {
  document.execCommand(cmd, false, undefined);
  if (editor.value) editor.value.focus();
};

const updateContent = (e: Event) => { 
  const target = e.target as HTMLElement;
  emailForm.mensaje = target.innerHTML; 
};

const handleImage = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      document.execCommand('insertImage', false, ev.target?.result as string);
      if (toastRef.value?.notify) {
        toastRef.value.notify(t('imgAdded'), 'success');
      }
    };
    reader.readAsDataURL(file);
  }
};

const sendEmail = () => {
  if (!emailForm.asunto || !emailForm.mensaje.trim()) {
    if (toastRef.value?.notify) {
      toastRef.value.notify(t('completeFields'), 'error');
    }
    return;
  }
  if (toastRef.value?.notify) {
    toastRef.value.notify(t('emailSent'), 'success');
  }
};

onMounted(() => {
  window.addEventListener('idioma-changed', (e: Event) => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail?.idioma) settings.idioma = customEvent.detail.idioma;
  });
});
</script>

<style scoped>
.form-panel { 
  background: var(--bg-cards, #121214); 
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.08)); 
  color: var(--color-texto-general, #f5f5f4); 
  border-radius: var(--app-border-radius, 20px); 
  padding: 24px; 
  width: 95%; 
  max-width: 460px; 
  max-height: 90vh; 
  overflow-y: auto; 
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

.panel-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: flex-start;
  margin-bottom: 20px; 
}

.title-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.form-title { 
  font-family: 'Oswald', sans-serif; 
  color: var(--color-titulos, #fff); 
  font-size: 1.15rem; 
  letter-spacing: 0.8px;
  margin: 0;
}

.form-subtitle {
  font-size: 0.78rem;
  color: var(--color-texto-secundario, #888);
  margin: 0;
}

.input-group { 
  margin-bottom: 14px; 
}

.input-group label { 
  font-family: 'Oswald', sans-serif; 
  font-size: 0.72rem; 
  text-transform: uppercase; 
  display: block; 
  margin-bottom: 5px; 
  color: var(--color-texto-secundario, #888);
  letter-spacing: 0.5px;
  font-weight: 600;
}

.custom-input { 
  background: var(--bg-input, #09090b); 
  border: 1.5px solid var(--border-input, rgba(255, 255, 255, 0.08)); 
  color: var(--color-texto-input, var(--color-texto-general, white)); 
  padding: 10px 14px; 
  border-radius: var(--app-border-radius, 10px); 
  width: 100%; 
  box-sizing: border-box; 
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s ease;
}

.custom-input:focus {
  border-color: var(--color-highlight, rgba(59, 130, 246, 0.5));
  background: var(--bg-cards, rgba(255, 255, 255, 0.02));
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.editor-container {
  margin-bottom: 18px;
}

.toolbar { 
  display: flex; 
  align-items: center;
  gap: 6px; 
  margin-bottom: 6px; 
  padding: 6px; 
  background: var(--bg-input, #09090b); 
  border: 1px solid var(--border-input, rgba(255, 255, 255, 0.08)); 
  border-radius: var(--app-border-radius, 10px); 
}
.highlight { color: var(--color-highlight, #3b82f6); }

.tool-btn { 
  background: rgba(255, 255, 255, 0.03); 
  border: 1px solid rgba(255, 255, 255, 0.06); 
  color: var(--color-texto-secundario, #ccc); 
  padding: 6px 12px; 
  border-radius: 6px; 
  cursor: pointer; 
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.tool-btn:hover { 
  background: rgba(255, 255, 255, 0.08); 
  color: var(--color-titulos, white); 
  border-color: rgba(255, 255, 255, 0.15);
}

.toolbar-separator {
  width: 1px;
  height: 16px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 4px;
}

.editor-area { 
  min-height: 130px; 
  max-height: 220px;
  outline: none; 
  overflow-y: auto; 
  text-align: left; 
  line-height: 1.4;
}

.editor-area:empty:before {
  content: attr(data-placeholder);
  color: var(--color-texto-secundario, #555);
  pointer-events: none;
  display: block;
}

.btn-send { 
  background: var(--color-highlight, linear-gradient(135deg, #2563eb, #1d4ed8)); 
  color: white; 
  border: none; 
  border-radius: var(--app-border-radius, 10px); 
  height: 44px; 
  width: 100%; 
  font-family: 'Oswald', sans-serif; 
  font-size: 1rem;
  letter-spacing: 0.5px;
  cursor: pointer; 
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 0.2s, transform 0.1s;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-send:hover { 
  opacity: 0.92; 
}

.btn-send:active {
  transform: scale(0.98);
}

@media (max-width: 480px) {
  .form-panel { padding: 16px; }
  .toolbar { gap: 4px; }
  .btn-send { height: 40px; }
}

.close-x { 
  background: rgba(255, 255, 255, 0.05); 
  border: 1px solid rgba(255, 255, 255, 0.08); 
  color: var(--color-texto-secundario, #aaa); 
  cursor: pointer; 
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-x:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-titulos, #fff);
}
</style>