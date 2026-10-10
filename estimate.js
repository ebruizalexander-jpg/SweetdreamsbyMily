// Shared JavaScript interactivity for Services and Packages.
(() => {
  const form = document.getElementById('estimateForm');
  if (!form) return;
  const result = document.getElementById('estimateResult');
  const packageInput = document.getElementById('estimatePackage');
  const countInput = document.getElementById('estimateCount');
  let estimate = null;
  function render() {
    const spanish = document.documentElement.lang === 'es';
    document.querySelectorAll('[data-en][data-es]').forEach(element => {
      element.textContent = spanish ? element.dataset.es : element.dataset.en;
    });
    if (estimate !== null) {
      const money = new Intl.NumberFormat(spanish ? 'es-US' : 'en-US', {style:'currency',currency:'USD'}).format(estimate.total);
      result.textContent = spanish
        ? `Presupuesto inicial: ${money}. Incluye el paquete y ${estimate.count} centros de mesa. Solicita una cotización final.`
        : `Starting estimate: ${money}. Includes the package and ${estimate.count} centerpieces. Request a final quote.`;
    }
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const price = Number(packageInput.value);
    const count = Number(countInput.value);
    if (![300,350,400].includes(price) || !Number.isInteger(count) || count < 0 || count > 100) return;
    estimate = {total:price + count * 40, count};
    result.hidden = false;
    render();
  });
  function clear() { estimate = null; result.hidden = true; result.textContent = ''; }
  form.addEventListener('input', clear);
  form.addEventListener('change', clear);
  form.addEventListener('reset', clear);
  new MutationObserver(render).observe(document.documentElement, {attributes:true,attributeFilter:['lang']});
  render();
})();
