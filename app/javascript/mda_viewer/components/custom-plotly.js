/* eslint-disable global-require */
import Plotly from 'plotly.js/lib/core';

// Load in the trace types for pie, and choropleth
Plotly.register([require('plotly.js/lib/scatter')]);

// plotly.js >= 4 shows an "Upload to Cloud" button sending data to cloud.plotly.com:
// keep it disabled as in plotly.js 3.
Plotly.setPlotConfig({ showSendToCloud: false, plotlyServerURL: '' });

export default Plotly;
