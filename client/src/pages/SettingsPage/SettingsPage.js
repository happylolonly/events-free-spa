import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Sources from './Sources/Sources';
import { updateSources, toggleSources } from 'actions/sources';

import './SettingsPage.scss';


const propTypes = {
  sources: PropTypes.object.isRequired,
  updateSources: PropTypes.func.isRequired,
  toggleSources: PropTypes.func.isRequired,
};

const SettingsPage = ({ sources, updateSources, toggleSources }) => {
  return (
    <div className="settings-page">
      <Sources
        sources={sources}
        updateSources={updateSources}
        toggleSources={toggleSources}
      />
    </div>
  )
}

const mapStateToProps = ({ sources }) => {
  return {
    sources
  }
}

SettingsPage.propTypes = propTypes;

export default connect(mapStateToProps, { updateSources, toggleSources })(SettingsPage);
