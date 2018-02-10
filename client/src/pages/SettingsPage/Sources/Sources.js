import React from 'react';
import PropTypes from 'prop-types';

import { Checkbox } from 'components/common';


const propTypes = {
    sources: PropTypes.object.isRequired,
    updateSources: PropTypes.func.isRequired,
    toggleSources: PropTypes.func.isRequired,
}

const Sources = ({ sources, updateSources, toggleSources }) => {

    let isAllChecked;
    let score = 0;
  
    Object.keys(sources).forEach(item => {
      score += sources[item] ? 1 : -1;
    });
  
    isAllChecked = (score >= 0);
  
    return (
      <div className="settings-page">
        <h3>Настройки</h3>
        <p>Выбери откуда хочешь получать события</p>
  
        <div className="toggle">
          <h5>{isAllChecked ? 'Снять все' : 'Выбрать все'}</h5>
  
          <Checkbox
            value={isAllChecked}
            onChange={toggleSources}
          />
  
        </div>
  
        <Checkbox
          name="meetupBy"
          value={sources.meetupBy}
          onChange={updateSources}
          text="meetup.by"
        />
        <Checkbox
          name="eventsDevBy"
          value={sources.eventsDevBy}
          onChange={updateSources}
          text="events.dev.by"
        />
        <Checkbox
          name="imaguru"
          value={sources.imaguru}
          onChange={updateSources}
          text="imaguru.by"
        />
        <Checkbox
          name="minskforfree"
          value={sources.minskforfree}
          onChange={updateSources}
          text="vk.com/minskforfree"
        />
        <Checkbox
          name="freeLanguagesMinsk"
          value={sources.freeLanguagesMinsk}
          onChange={updateSources}
          text="vk.com/free_languages_minsk"
        />
        <Checkbox
          name="citydogAfisha"
          value={sources.citydogAfisha}
          onChange={updateSources}
          text="citydog.by/afisha"
        />
        <Checkbox
          name="citydogVedy"
          value={sources.citydogVedy}
          onChange={updateSources}
          text="citydog.by/vedy"
        />
  
        <hr />
        <h5>Фитнес</h5>
        <Checkbox
          name="sportMts"
          value={sources.sportMts}
          onChange={updateSources}
          text="sport.mts.by"
        />
        <Checkbox
          name="freeFitnessMinsk"
          value={sources.freeFitnessMinsk}
          onChange={updateSources}
          text="vk.com/free_fitness_minsk"
        />
      </div>
    )
}

Sources.propTypes = propTypes;

export default Sources;