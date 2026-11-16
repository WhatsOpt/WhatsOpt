import React from 'react';
import { createRoot } from 'react-dom/client';

import SwaggerApiDoc from 'api_doc_viewer';
import WhatsOptApi from '../utils/WhatsOptApi';
import { readData } from '../utils/dom';

document.addEventListener('DOMContentLoaded', () => {
  const csrfToken = document.getElementsByName('csrf-token')[0].getAttribute('content');
  const relativeUrlRoot = document
    .getElementsByName('relative-url-root')[0]
    .getAttribute('content');

  const runnerElt = document.getElementById('apidoc');
  const apiKey = readData(runnerElt, 'apiKey');
  // const wsServer = readData(runnerElt, 'wsServer');

  const api = new WhatsOptApi(csrfToken, apiKey, relativeUrlRoot);

  const root = createRoot(runnerElt);
  root.render(<SwaggerApiDoc api={api} />);
});
