import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Sources from './Sources/Sources';
import LoadAll from './LoadAll/LoadAll';
import { updateSources, toggleSources } from 'actions/sources';
import { loadAllEvents } from 'actions/events';

import './SettingsPage.scss';

const propTypes = {
  sources: PropTypes.object.isRequired,
  updateSources: PropTypes.func.isRequired,
  toggleSources: PropTypes.func.isRequired,
};

const SettingsPage = ({ sources, updateSources, toggleSources, loadAllEvents }) => {
  return (
    <div className="settings-page">
      <Sources sources={sources} updateSources={updateSources} toggleSources={toggleSources} />

      <hr />
      <LoadAll sources={sources} loadAllEvents={loadAllEvents} />
    </div>
  );
};

const mapStateToProps = ({ sources }) => {
  return {
    sources,
  };
};

SettingsPage.propTypes = propTypes;

export default connect(
  mapStateToProps,
  { updateSources, toggleSources, loadAllEvents }
)(SettingsPage);
