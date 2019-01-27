import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Checkbox } from 'components/common';

import { updateSources, toggleSources } from 'actions/sources';

import './Sources.scss';

const SOURCES = {
  common: [
    {
      name: 'meetupBy',
      text: 'meetup.by',
    },
    {
      name: 'eventsDevBy',
      text: 'events.dev.by',
    },
    {
      name: 'imaguru',
      text: 'imaguru.by',
    },
    {
      name: 'afishaTutBy',
      text: 'afisha.tut.by',
    },
    {
      name: 'minskforfree',
      text: 'vk.com/minskforfree',
    },
    {
      name: 'freeLanguagesMinsk',
      text: 'vk.com/free_languages_minsk',
    },
    {
      name: 'citydogAfisha',
      text: 'citydog.by/afisha',
    },
    {
      name: 'citydogVedy',
      text: 'citydog.by/vedy',
    },
  ],
  fitness: [
    {
      name: 'sportMts',
      text: 'sport.mts.by',
    },
    {
      name: 'freeFitnessMinsk',
      text: 'vk.com/free_fitness_minsk',
    },
  ],
};

const propTypes = {
  sources: PropTypes.object.isRequired,
  updateSources: PropTypes.func.isRequired,
  toggleSources: PropTypes.func.isRequired,
};

const Sources = ({ sources, updateSources, toggleSources }) => {
  let isAllChecked;
  let score = 0;

  Object.keys(sources).forEach(item => {
    score += sources[item] ? 1 : -1;
  });

  isAllChecked = score >= 0;

  const { common, fitness } = SOURCES;

  return (
    <div className="sources">
      <p>Выбери откуда хочешь получать мероприятия</p>

      <div className="toggle">
        <h5>{isAllChecked ? 'Снять все' : 'Выбрать все'}</h5>

        <Checkbox value={isAllChecked} onChange={toggleSources} />
      </div>

      <div className="content-checkboxes">
        <div className="content-checkboxes__left">
          {common.map((item, i) => {
            const { name, text: link } = item;
            return (
              <div className="content-checkboxes__wrapper">
                <Checkbox key={i} name={name} value={sources[name]} onChange={updateSources} />
                <a target="_blank" href={`//${link}`}>
                  {link}
                </a>
              </div>
            );
          })}
        </div>
        <div className="content-checkboxes__right">
          <h5>Фитнес</h5>
          {fitness.map((item, i) => {
            const { name, text: link } = item;
            return (
              <div className="content-checkboxes__wrapper">
                <Checkbox key={i} name={name} value={sources[name]} onChange={updateSources} />
                <a target="_blank" href={`//${link}`}>
                  {link}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

Sources.propTypes = propTypes;

function mapStateToProps({ sources }) {
  return {
    sources,
  };
}

export default connect(
  mapStateToProps,
  { updateSources, toggleSources }
)(Sources);
