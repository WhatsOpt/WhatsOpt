import { patchJson, refreshFromCurrentPage, setVisible } from '../utils/dom';

const SPINNER_TIMEOUT = 1500; // ms

class AnalysesIndex {
  constructor(relRoot, apiKey, userId) {
    this.relRoot = relRoot;
    this.apiKey = apiKey;
    this.userId = userId;
  }

  // Save user settings then refresh the analyses list,
  // showing the spinner if it takes some time.
  async updateSettings(settings) {
    const { relRoot, apiKey, userId } = this;
    const timeout = setTimeout(() => setVisible('.spinner', true), SPINNER_TIMEOUT);
    try {
      await patchJson(`${relRoot}/api/v1/users/${userId}`, apiKey, { user: { settings } });
      await refreshFromCurrentPage('#analyses');
    } catch (error) {
      console.error(error);
    } finally {
      clearTimeout(timeout);
      setVisible('.spinner', false);
    }
  }

  start() {
    const filterElt = document.getElementById('user_settings_analyses_filter');

    const setAnalysesListSettings = (event) => {
      const { analysesQuery, analysesOrder } = event?.currentTarget?.dataset ?? {};
      this.updateSettings({
        analyses_query: analysesQuery,
        analyses_order: analysesOrder,
        analyses_filter: filterElt.value,
      });
    };

    document
      .querySelectorAll('input[data-analyses-query], input[data-analyses-order]')
      .forEach((input) => input.addEventListener('click', setAnalysesListSettings));
    document.getElementById('analyses-filter').addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        // Cancel the default action, if needed
        event.preventDefault();
        setAnalysesListSettings();
      }
    });
    document
      .getElementById('btn_user_settings_analyses_filter')
      .addEventListener('click', setAnalysesListSettings);

    const projectSelect = document.getElementById('designProjectScope');
    let currentDesignProjectId = projectSelect.dataset.designProjectScope || '';
    projectSelect.addEventListener('change', () => {
      const designProjectId = projectSelect.value;
      if (designProjectId !== currentDesignProjectId) {
        currentDesignProjectId = designProjectId;
        this.updateSettings({ analyses_scope_design_project_id: designProjectId });
      }
    });

    setVisible('.spinner', false);
  }
}

export default AnalysesIndex;
