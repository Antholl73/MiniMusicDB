const container = document.getElementById('toast-container');

/* icons mapeados por tipo */
const ICONS = {
  success: '✔',
  error:   '✖',
  info:    'ℹ',
  warning: '⚠',
};

/* ── Toast básico con título + descripción ── */
function showToast(type, title, msg, duration = 4000) {
  const el = document.createElement('div');
  el.className = `toast ${type}`;

  el.innerHTML = `
    <span class="toast-icon">${ICONS[type]}</span>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${msg}</div>
    </div>
    <button class="toast-close" aria-label="Cerrar">×</button>
    <div class="toast-progress"
         style="animation-duration:${duration}ms"></div>
  `;

  /* el × cierra el toast inmediatamente */
  el.querySelector('.toast-close').onclick = () => dismiss(el);

  container.appendChild(el);
  setTimeout(() => dismiss(el), duration);

  return el; // útil si quieres reemplazarlo (ej: loading → success)
}

/* ── Toast con botón de acción (Undo, Reintentar…) ── */
function showActionToast(title, msg, actionLabel, onAction, duration = 6000) {
  const el = document.createElement('div');
  el.className = 'toast action';

  el.innerHTML = `
    <span class="toast-icon">🔔</span>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${msg}</div>
      <button class="toast-action-btn">${actionLabel}</button>
    </div>
    <button class="toast-close" aria-label="Cerrar">×</button>
    <div class="toast-progress"
         style="animation-duration:${duration}ms"></div>
  `;

  el.querySelector('.toast-close').onclick = () => dismiss(el);
  /* al hacer click en el botón: cierra Y ejecuta el callback */
  el.querySelector('.toast-action-btn').onclick = () => {
    dismiss(el);
    onAction();
  };

  container.appendChild(el);
  setTimeout(() => dismiss(el), duration);
}

/* ── Toast loading → luego reemplaza con success/error ── */
function showLoadingToast(title = 'Procesando...', msg = '') {
  const el = document.createElement('div');
  el.className = 'toast info loading';

  el.innerHTML = `
    <div class="spinner"></div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${msg}</div>
    </div>
  `;

  container.appendChild(el);

  /* devuelve una función para reemplazarlo cuando termine */
  return {
    resolve(successMsg) {
      dismiss(el);
      showToast('success', '¡Listo!', successMsg);
    },
    reject(errorMsg) {
      dismiss(el);
      showToast('error', 'Error', errorMsg);
    }
  };
}

/* ── Animación de salida y eliminación del DOM ── */
function dismiss(el) {
  el.style.animation = 'fadeOut 0.2s ease forwards';
  setTimeout(() => el.remove(), 200);
}