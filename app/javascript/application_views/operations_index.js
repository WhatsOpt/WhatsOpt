import { Modal } from 'bootstrap';
import { patchJson } from '../utils/dom';

function showError(message) {
  const placeHolder = document.getElementById('errorPlaceHolder');
  const alert = document.createElement('div');
  alert.className = 'alert alert-warning alert-dismissible';
  alert.setAttribute('role', 'alert');
  alert.textContent = message;
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'btn-close';
  close.setAttribute('data-bs-dismiss', 'alert');
  close.setAttribute('aria-label', 'Close');
  alert.appendChild(close);
  placeHolder.replaceChildren(alert);
}

class OperationsIndex {
  constructor(relRoot) {
    this.relRoot = relRoot;
  }

  start() {
    const { relRoot } = this;
    const modalElt = document.getElementById('editModal');
    const input = document.querySelector("input[name='operation[name]']");
    let invoker = null;

    modalElt.addEventListener('show.bs.modal', (event) => {
      invoker = event.relatedTarget;
      input.value = invoker.dataset.opeName;
    });
    modalElt.addEventListener('shown.bs.modal', () => input.focus());

    document.querySelector('button[data-save="true"]').addEventListener('click', async () => {
      const newName = input.value;
      const { opeId, apiKey } = invoker.dataset;
      try {
        await patchJson(`${relRoot}/api/v1/operations/${opeId}`, apiKey, {
          operation: { name: newName },
        });
        document.querySelectorAll(`a[id="${opeId}"]`).forEach((link) => {
          // eslint-disable-next-line no-param-reassign
          link.textContent = newName;
        });
        invoker.dataset.opeName = newName;
      } catch (error) {
        console.error(error.message);
        showError(error.message);
      }
      Modal.getOrCreateInstance(modalElt).hide();
    });
  }
}

export default OperationsIndex;
