import React from 'react';
import { createRoot } from 'react-dom/client';

import MdaViewer from 'mda_viewer';
import '@rails/actiontext';

import WhatsOptApi from '../utils/WhatsOptApi';
import { readData } from '../utils/dom';

document.addEventListener('DOMContentLoaded', () => {
  const csrfToken = document.getElementsByName('csrf-token')[0].getAttribute('content');
  const relativeUrlRoot = document
    .getElementsByName('relative-url-root')[0]
    .getAttribute('content');

  const mdaViewerElt = document.getElementById('mda-viewer');
  const mda = readData(mdaViewerElt, 'mda');
  const isEditing = readData(mdaViewerElt, 'isEditing');
  const apiKey = readData(mdaViewerElt, 'apiKey');
  const members = readData(mdaViewerElt, 'members');
  const coOwners = readData(mdaViewerElt, 'coOwners');
  const currentUser = readData(mdaViewerElt, 'currentUser');

  const api = new WhatsOptApi(csrfToken, apiKey, relativeUrlRoot, mda.updated_at);

  const root = createRoot(mdaViewerElt);
  root.render(
    <MdaViewer
      mda={mda}
      isEditing={isEditing}
      api={api}
      members={members}
      coOwners={coOwners}
      currentUser={currentUser}
    />
  );
});
