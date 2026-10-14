/* Defina a URL de integração apenas quando houver um endpoint real e aprovado.
   O endpoint deve aceitar JSON via POST e responder 2xx apenas após salvar o lead. */
const FORM_ENDPOINT = '';
const form = document.querySelector('#interest-form');
const status = document.querySelector('#form-status');
const phone = document.querySelector('#whatsapp');
phone.addEventListener('input', () => phone.setCustomValidity(''));
document.querySelector('.final-button').addEventListener('click', () => {
  document.querySelector('#name').focus({ preventScroll: true });
});
if (FORM_ENDPOINT) status.textContent = 'Receba os detalhes da oferta em primeira mão.';
form.addEventListener('submit', async event => {
  event.preventDefault();
  const digits = phone.value.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) {
    phone.setCustomValidity('Informe um WhatsApp válido, incluindo o DDD.');
    phone.reportValidity();
    return;
  }
  if (!FORM_ENDPOINT) {
    status.textContent = 'Esta é uma prévia. O cadastro ainda não foi enviado: a integração será conectada antes da campanha.';
    return;
  }
  const button = form.querySelector('button');
  button.disabled = true;
  button.setAttribute('aria-busy', 'true');
  status.textContent = 'Enviando seu cadastro…';
  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
      signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) throw new Error('Falha no cadastro');
    status.textContent = 'Você está na lista! Aguarde os detalhes da oferta em 16 de novembro.';
    form.reset();
  } catch {
    status.textContent = 'Não foi possível enviar seu cadastro. Tente novamente em instantes.';
  } finally {
    button.disabled = false;
    button.removeAttribute('aria-busy');
  }
});
