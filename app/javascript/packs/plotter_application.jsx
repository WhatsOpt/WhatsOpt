import React from 'react';
import { createRoot } from 'react-dom/client';

import Plotter from 'plotter';
import WhatsOptApi from '../utils/WhatsOptApi';
import { readData } from '../utils/dom';

document.addEventListener('DOMContentLoaded', () => {
  const csrfToken = document.getElementsByName('csrf-token')[0].getAttribute('content');
  const relativeUrlRoot = document
    .getElementsByName('relative-url-root')[0]
    .getAttribute('content');

  const plotterElt = document.getElementById('plotter');
  const mda = readData(plotterElt, 'mda');
  const ope = readData(plotterElt, 'ope');
  const apiKey = readData(plotterElt, 'apiKey');
  const uqMode = readData(plotterElt, 'uqMode');

  const api = new WhatsOptApi(csrfToken, apiKey, relativeUrlRoot);

  const root = createRoot(plotterElt);
  root.render(<Plotter mda={mda} ope={ope} api={api} uqMode={uqMode} />);
});
