function toggleForm(id) {
  const allForms = document.querySelectorAll('[id^="form"]');
  allForms.forEach(form => {
    if (form.id !== id) form.style.display = 'none'; // close others
  });

  const target = document.getElementById(id);
  target.style.display = target.style.display === 'none' ? 'block' : 'none';
}