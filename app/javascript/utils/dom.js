// Small DOM/HTTP helpers for server-rendered pages (no jQuery).

// PATCH a JSON body to the WhatsOpt API with token authentication.
// Rejects with an Error carrying the API error message when the request fails.
export async function patchJson(url, apiKey, body) {
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`;
    try {
      ({ message } = await response.json());
    } catch {
      // no JSON error body
    }
    throw new Error(message);
  }
  return response;
}

// Re-fetch the current page and replace the content of the element(s)
// matching the given selector with their freshly rendered version.
export async function refreshFromCurrentPage(selector) {
  const response = await fetch(window.location.href, { headers: { Accept: 'text/html' } });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
  const fresh = doc.querySelector(selector);
  const current = document.querySelector(selector);
  if (fresh && current) {
    current.innerHTML = fresh.innerHTML;
  }
}

// Read a data-* attribute value converted like jQuery .data() did:
// "true"/"false"/"null", numbers and JSON objects/arrays are parsed,
// anything else is returned as a string (undefined if attribute is missing).
// The key is the camelCase dataset name (data-is-editing -> 'isEditing').
export function readData(element, key) {
  const value = element.dataset[key];
  if (value === undefined) return undefined;
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  if (value !== '' && String(+value) === value) return +value;
  if (/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/.test(value)) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}

// Escape text to be inserted in HTML markup.
export function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// Show or hide every element matching the selector (inline display style).
export function setVisible(selector, visible) {
  document.querySelectorAll(selector).forEach((el) => {
    // eslint-disable-next-line no-param-reassign
    el.style.display = visible ? '' : 'none';
  });
}
