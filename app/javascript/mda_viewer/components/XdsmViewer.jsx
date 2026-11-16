import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { XDSMjs, XDSM_V2 } from 'xdsmjs';
import { escapeHtml } from '../../utils/dom';

const DEFAULT_XDSM_VERSION = XDSM_V2;

class XdsmViewer extends React.Component {
  static _setTooltips() {
    // bootstrap tooltip for connections
    document.querySelectorAll('.ellipsized').forEach((el) => {
      el.setAttribute('data-bs-toggle', 'tooltip');
      el.setAttribute('data-bs-placement', 'right');
    });
  }

  constructor(props) {
    super(props);
    this.state = { version: DEFAULT_XDSM_VERSION };
  }

  componentDidMount() {
    const { version } = this.state;
    const config = {
      labelizer: {
        ellipsis: 5,
        subSupScript: false,
        showLinkNbOnly: true,
      },
      layout: {
        origin: { x: 50, y: 20 },
        cellsize: { w: 150, h: 50 },
        padding: 10,
      },
      withTitleTooltip: false,
      withDefaultDriver: false,
      version,
    };
    const { mda, filter } = this.props;
    const xdsmMda = update(mda, {
      nodes: {
        0: {
          name: { $set: 'Driver' },
          type: { $set: 'driver' },
        },
      },
    });
    this.selectableXdsm = XDSMjs(config).createSelectableXdsm(
      xdsmMda,
      this._onSelectionChange.bind(this)
    );
    this.setSelection(filter);
    this._setLinks();
    XdsmViewer._setTooltips();
  }

  shouldComponentUpdate() {
    return false;
  }

  setSelection(filter) {
    this.selectableXdsm.setSelection(filter);
  }

  update(mda) {
    const xdsmMda = update(mda, {
      nodes: { 0: { name: { $set: 'Driver' }, type: { $set: 'driver' } } },
    });
    this.selectableXdsm.updateMdo(xdsmMda);

    // links
    this._setLinks();
    // select current
    const { filter } = this.props;
    this.setSelection(filter);
    // reattach tooltips
    XdsmViewer._setTooltips();
  }

  _onSelectionChange(filter) {
    const { onFilterChange } = this.props;
    onFilterChange(filter);
  }

  _setLinks() {
    const { mda, isEditing, api } = this.props;
    mda.nodes.forEach((node) => {
      if (node.link) {
        const edit = isEditing ? '/edit' : '';
        const link = `/analyses/${node.link.id}${edit}`;
        const tspans = document.querySelectorAll(`.id${node.id} tspan`);
        const label = Array.from(tspans, (tspan) => tspan.textContent).join('');
        tspans.forEach((tspan) => {
          // eslint-disable-next-line no-param-reassign
          tspan.innerHTML = `<a class='analysis-link' href="${escapeHtml(api.url(link))}">${escapeHtml(label)}</a>`;
        });
      }
    });
    document.querySelectorAll('.analysis-link').forEach((a) => {
      a.addEventListener('click', (e) => e.stopPropagation());
    });
  }

  render() {
    const { version } = this.state;
    return <div className={version} />;
  }
}

XdsmViewer.propTypes = {
  api: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  mda: PropTypes.object.isRequired,
  filter: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default XdsmViewer;
