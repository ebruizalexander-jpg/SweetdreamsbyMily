// Only a public Formspree endpoint belongs in the form action; no secret keys.
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const form = document.getElementById('bookingForm');
if (form) {
  const button = document.getElementById('bookingSubmit');
  const message = document.getElementById('formMessage');
  const help = document.getElementById('bookingHelp');
  const draft = document.getElementById('inquiryDraft');
  const summary = document.getElementById('inquirySummary');
  const date = document.getElementById('bookingDate');
  const endpoint = (form.getAttribute('action') || '').trim();
  const configured = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint);
  let sending = false;
  const today = () => {
    const now = new Date();
    return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
  };
  date.min = today();
  button.disabled = false;
  button.textContent = configured ? 'Send inquiry' : 'Prepare inquiry';
  if (configured) help.textContent = 'Send your event inquiry below. SweetdreamsbyMily will contact you to discuss availability and pricing. An inquiry does not reserve your date. Your details are processed by Formspree to deliver your request.';
  const showMessage = (text, state) => {
    message.textContent = text;
    message.dataset.state = state;
    message.focus();
  };
  const prepareDraft = () => {
    const data = new FormData(form);
    summary.value = 'SweetdreamsbyMily booking inquiry\n\n' +
      [['Name', 'name'], ['Email', 'email'], ['Phone', 'phone'], ['Event date', 'event_date'], ['Location', 'location'], ['Package', 'package'], ['Details', 'details']]
        .map(([label, key]) => label + ': ' + (data.get(key) || 'Not provided')).join('\n');
    draft.hidden = false;
  };
  form.addEventListener('input', () => {
    message.textContent = '';
    draft.hidden = true;
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending) return;
    date.min = today();
    form.querySelectorAll('input:not([type="date"]), textarea').forEach(field => {
      field.value = field.value.trim();
    });
    if (!form.reportValidity()) return;
    if (!configured) {
      prepareDraft();
      showMessage('Your inquiry is ready to copy. It has not been sent. Use the contact details below to send it to SweetdreamsbyMily.', 'fallback');
      return;
    }
    sending = true;
    button.disabled = true;
    button.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    showMessage('Sending your inquiry…', 'pending');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
        signal: controller.signal
      });
      if (!response.ok) throw new Error('Submission rejected');
      form.reset();
      draft.hidden = true;
      summary.value = '';
      showMessage('Thank you! Your inquiry was sent successfully. SweetdreamsbyMily will contact you about availability and pricing. Your date is not reserved until your booking is confirmed.', 'success');
    } catch (error) {
      prepareDraft();
      showMessage('We could not confirm that your inquiry was sent. Your details are still here. Please use the contact details below to follow up, or try again.', 'error');
    } finally {
      clearTimeout(timeout);
      sending = false;
      button.disabled = false;
      button.textContent = 'Send inquiry';
      form.removeAttribute('aria-busy');
    }
  });
}
