import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AddEvent from './AddEvent';
import axios from 'axios';

import { API } from 'constants/config';

const propTypes = {};

class AddEventContainer extends Component {
  constructor() {
    super();

    this.state = {
      data: {},

      dataErrors: {},

      serverError: null,
    };
  }

  async saveEvent() {
    try {
      const data = await axios.post(`${API}/event`, this.state.data);

      // notification

      browserHistory.push('/events');
    } catch (error) {
      this.setState({ serverError: error.reponse.data });
    }
  }

  validate() {}

  handleChange(value, name) {
    this.setState({
      data: {
        ...this.state.data,
        [name]: value,
      },
      dataErrors: {
        ...this.state.dataErrors,
        [name]: '',
      },
      serverError: null,
    });
  }

  handleButtonSaveClick() {
    if (!this.validate()) return;

    this.saveEvent();
  }

  render() {
    const { data, dataErrors } = this.state;
    return (
      <div>
        <h3>Добавить мероприятие</h3>
        <p>Пожалуйста, не создавай всякую ерунду, пока нету регистрации</p>

        <AddEvent
          title={data.title}
          description={data.description}
          date={data.date}
          time={data.time}
          address={data.address}
          contacts={data.contacts}
          images={data.images}
          titleError={dataErrors.title}
          descriptionError={dataErrors.description}
          dateError={dataErrors.date}
          timeError={dataErrors.time}
          addressError={dataErrors.address}
          contactsError={dataErrors.contacts}
          imagesError={dataErrors.images}
          handleData={this.handleChange}
        />

        <button onClick={this.handleButtonSaveClick}>Создать мероприятие</button>

        {this.state.serverError && <div className="error">{this.state.serverError}</div>}
      </div>
    );
  }
}

AddEventContainer.propTypes = propTypes;

export default AddEventContainer;
