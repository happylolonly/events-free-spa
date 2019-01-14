import React from 'react';
import PropTypes from 'prop-types';

import { Checkbox } from 'components/common';

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
    }
  ],
  fitness: [
    {
      name: 'sportMts',
      text: 'sport.mts.by',
    },
    {
      name: 'freeFitnessMinsk',
      text: 'vk.com/free_fitness_minsk',
    }
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
    <div className="settings-page">
      <h3>Настройки</h3>
      <p>Выбери откуда хочешь получать события</p>

      <div className="toggle">
        <h5>{isAllChecked ? 'Снять все' : 'Выбрать все'}</h5>

        <Checkbox value={isAllChecked} onChange={toggleSources} />
      </div>

      <div className="content-checkboxes">
        <div className="content-checkboxes__left">
          {common.map((item, i) => {
            return (
              <Checkbox
                key={i}
                name={item.name}
                value={sources[item.name]}
                onChange={updateSources}
                text={item.text}
              />
            );
          })
          }
        </div>
        <div className="content-checkboxes__right">
          <h5>Фитнес</h5>
          {fitness.map((item, i) => {
            return (
              <Checkbox
                key={i}
                name={item.name}
                value={sources[item.name]}
                onChange={updateSources}
                text={item.text}
              />
            );
          })
          }
        </div>
      </div>
    </div>
  );
};

Sources.propTypes = propTypes;

export default Sources;
