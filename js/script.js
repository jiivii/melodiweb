// ---------- Menú móvil ----------
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // ---------- Desplegable "Servicios" ----------
  document.querySelectorAll('.has-dropdown > button.nav-link').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = btn.closest('.has-dropdown');
      const isOpen = parent.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });

  document.addEventListener('click', (e) => {
    document.querySelectorAll('.has-dropdown.is-open').forEach((el) => {
      if (!el.contains(e.target)) {
        el.classList.remove('is-open');
      }
    });
  });

  // ---------- Formulario de contacto ----------
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = document.querySelector('#form-success');
      if (success) {
        success.classList.add('is-visible');
        success.setAttribute('role', 'status');
      }
      form.reset();
    });
  }
});
