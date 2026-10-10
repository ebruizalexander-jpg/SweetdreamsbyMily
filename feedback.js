// M6.4: validate, process, and store the latest anonymous survey response locally.
(() => {
  const form = document.getElementById('feedbackForm');
  if (!form) return;
  const key = 'mily-feedback-v1';
  const status = document.getElementById('feedbackStatus');
  const receipt = document.getElementById('feedbackReceipt');
  const summary = document.getElementById('feedbackSummary');
  let saved = null;
  let notice = '';
  const messages = {
    success: ['Thank you! Your feedback was submitted successfully and saved in this browser. It has not been emailed.', '¡Gracias! Tu opinión se envió correctamente y se guardó en este navegador. No se ha enviado por correo.'],
    error: ['Your response could not be saved. Your entries are still here; enable browser storage and try again.', 'No se pudo guardar tu respuesta. Tus datos siguen aquí; habilita el almacenamiento del navegador e inténtalo de nuevo.'],
    deleted: ['Your saved response has been deleted from this browser.', 'Tu respuesta guardada se eliminó de este navegador.']
  };
  function valid(data) {
    return data && ['Birthday','Baby shower','Corporate event','Other'].includes(data.event) && Number.isInteger(data.rating) && data.rating >= 1 && data.rating <= 5 && typeof data.comments === 'string' && data.comments.length <= 1000 && typeof data.submittedAt === 'string';
  }
  function render() {
    const es = document.documentElement.lang === 'es';
    document.querySelectorAll('#feedback [data-en][data-es]').forEach(el => {el.textContent = es ? el.dataset.es : el.dataset.en;});
    status.textContent = notice ? messages[notice][es ? 1 : 0] : '';
    receipt.hidden = !saved;
    if (saved) summary.textContent = (es ? 'Evento: ' : 'Event: ') + saved.event + '\n' + (es ? 'Calificación: ' : 'Rating: ') + saved.rating + '/5\n' + (es ? 'Sugerencias: ' : 'Suggestions: ') + saved.comments + '\n' + (es ? 'Fecha: ' : 'Submitted: ') + saved.submittedAt;
  }
  try { const data = JSON.parse(localStorage.getItem(key)); if (valid(data)) saved = data; } catch {}
  form.addEventListener('submit', event => {
    event.preventDefault();
    const comments = document.getElementById('feedbackComments');
    comments.value = comments.value.trim();
    if (!form.reportValidity()) return;
    const data = {event:document.getElementById('feedbackEvent').value,rating:Number(document.getElementById('feedbackRating').value),comments:comments.value,submittedAt:new Date().toISOString()};
    if (!valid(data)) return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
      saved = data;
      form.reset();
      notice = 'success';
    } catch { notice = 'error'; }
    render();
    status.focus();
  });
  form.addEventListener('reset', () => { notice = ''; render(); });
  form.addEventListener('input', () => {notice = ''; render();});
  document.getElementById('feedbackDelete').addEventListener('click', () => {
    try {localStorage.removeItem(key);saved = null;summary.textContent = '';notice = 'deleted';} catch {notice = 'error';}
    render();status.focus();
  });
  document.getElementById('feedbackDownload').addEventListener('click', () => {
    if (!saved) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(saved,null,2)],{type:'application/json'}));
    const a = document.createElement('a');a.href = url;a.download = 'SweetdreamsbyMily-feedback.json';document.body.append(a);a.click();a.remove();setTimeout(() => URL.revokeObjectURL(url),1000);
  });
  new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  render();
})();
