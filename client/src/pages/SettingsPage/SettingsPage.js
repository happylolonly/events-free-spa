import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Checkbox } from 'components/common';

import './SettingsPage.scss';


const propTypes = {

}

class SettingsPage extends Component {
  constructor() {
    super();

    this.state = {
      sources: {
        meetupBy: true,
        eventsDevBy: true,
        imaguru: true,
        minskforfree: true,
        sportMts: false,
        freeFitnessMinsk: false,
        citydogVedy: false,
        citydogAfisha: false,
        freeLanguagesMinsk: false,
      },
      isAllChecked: false,
    }

    this.handleElementsChange = this.handleElementsChange.bind(this);
    this.toggleAll = this.toggleAll.bind(this);
  }

  componentDidMount() {
    const events = JSON.parse(localStorage.getItem('events')) || {};
    console.log(events);

    let score = 0;
    Object.keys(events).forEach(item => {
      score += events[item] ? 1 : -1;
    });


    // console.log(Object.values(events));

    this.setState({
      sources: {...events},
      isAllChecked: score >= 0,
    });
  }

  handleElementsChange(name, value) {
    console.log(value);
    this.setState({
      sources: {...this.state.sources, [name]: value}
    });
    const events = JSON.parse(localStorage.getItem('events')) || {};
    events[name] = value;
    localStorage.setItem('events', JSON.stringify(events));
  }

  saveToLocalStorage() {
    localStorage.setItem('events', JSON.stringify(this.state.sources));
  }

  toggleAll(name,bool) {
    const state = {...this.state.sources};
    Object.keys(state).forEach(item => {
      state[item] = bool;
    });
    this.setState({
      isAllChecked: !this.state.isAllChecked,
      sources: state,
    }, () => {
      this.saveToLocalStorage();
    });
  }

  render() {
    console.error(this.state);
    return (
      <div className="settings-page">
        <h3>Настройки</h3>
        <p>Выбери откуда хочешь получать события</p>

<div className="toggle">
  <h5>{this.state.isAllChecked ?  'Снять все' : 'Выбрать все'}</h5>

  <Checkbox
    value={this.state.isAllChecked}
    onChange={this.toggleAll}
    />

</div>

      <Checkbox
        name="meetupBy"
        value={this.state.sources.meetupBy}
        onChange={this.handleElementsChange}
        text="meetup.by"
      />
      <Checkbox
        name="eventsDevBy"
        value={this.state.sources.eventsDevBy}
        onChange={this.handleElementsChange}
        text="events.dev.by"
      />
      <Checkbox
        name="imaguru"
        value={this.state.sources.imaguru}
        onChange={this.handleElementsChange}
        text="imaguru.by"
      />
      <Checkbox
        name="minskforfree"
        value={this.state.sources.minskforfree}
        onChange={this.handleElementsChange}
        text="vk.com/minskforfree"
      />
      <Checkbox
        name="freeLanguagesMinsk"
        value={this.state.sources.freeLanguagesMinsk}
        onChange={this.handleElementsChange}
        text="vk.com/free_languages_minsk"
      />
      <Checkbox
        name="citydogAfisha"
        value={this.state.sources.citydogAfisha}
        onChange={this.handleElementsChange}
        text="citydog.by/afisha"
      />
      <Checkbox
        name="citydogVedy"
        value={this.state.sources.citydogVedy}
        onChange={this.handleElementsChange}
        text="citydog.by/vedy"
      />

    <hr />
    <h5>Фитнес</h5>
      <Checkbox
        name="sportMts"
        value={this.state.sources.sportMts}
        onChange={this.handleElementsChange}
        text="sport.mts.by"
      />
      <Checkbox
        name="freeFitnessMinsk"
        value={this.state.sources.freeFitnessMinsk}
        onChange={this.handleElementsChange}
        text="vk.com/free_fitness_minsk"
      />
      </div>
    )
  }
}

SettingsPage.propTypes = propTypes;

export default SettingsPage;
