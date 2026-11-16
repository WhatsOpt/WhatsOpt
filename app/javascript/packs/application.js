import '@popperjs/core';
import { Modal } from 'bootstrap';
import Rails from '@rails/ujs';
import AnalysesIndex from '../application_views/analyses_index';
import OperationsIndex from '../application_views/operations_index';
import UserShow from '../application_views/users_show';

// Views are used in corresponding views/**/*.html.erb files
// in document_ready section.
// Calling start() allow to attach js callbacks to DOM element
// specially for each views.
window.App = {
  AnalysesIndex,
  OperationsIndex,
  UserShow,
};

// Override default browser confirm dialog by bootstrap version
Rails.confirm = (message, element) => {
  const dialog = document.getElementById('confirmModal');
  const modal = Modal.getOrCreateInstance(dialog);
  dialog.querySelector('#modal-content').textContent = message;

  // Replace the OK button to drop handlers from previous confirmations
  const oldOk = dialog.querySelector('#ok-button');
  const ok = oldOk.cloneNode(true);
  oldOk.replaceWith(ok);
  ok.addEventListener(
    'click',
    (event) => {
      event.preventDefault();
      modal.hide();
      const old = Rails.confirm;
      Rails.confirm = () => true;
      element.click();
      Rails.confirm = old;
    },
    { once: true }
  );
  modal.show();
  return false;
};

Rails.start();
