import React from 'react';
import PropTypes from 'prop-types';
// ImagesUploader
import { Input, Textarea, InputDatepicker, Timepicker } from 'components/common';

const propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  // date: PropTypes.
  // time: PropTypes.
  address: PropTypes.string,
  // contacts: PropTypes.array
  images: PropTypes.array,

  // errors

  handleData: PropTypes.func.isRequired,
};

const AddEvent = ({
  title,
  description,
  date,
  time,
  address,
  contacts,
  images,
  titleError,
  descriptionError,
  dateError,
  timeError,
  addressError,
  contactsError,
  imagesError,
  handleData,
}) => {
  return (
    <div>
      <Input
        name="title"
        title="Заголовок"
        placeholder="Введи заголовок"
        value={title}
        error={titleError}
        onChange={handleData}
      />

      <Textarea
        name="description"
        title="Заголовок"
        placeholder="Введи описание"
        value={description}
        error={descriptionError}
        onChange={handleData}
      />

      <InputDatepicker
        name="date"
        title="Дата мероприятия"
        value={date}
        error={dateError}
        onChange={handleData}
      />

      <Timepicker
        name="time"
        title="Время начала"
        value={time}
        error={timeError}
        onChange={handleData}
      />

      <Input
        name="address"
        title="Адрес"
        placeholder="Введи адрес"
        value={address}
        error={addressError}
        onChange={handleData}
      />

      {/* <Input
                name="contacts"
                title="Заголовок"
                placeholder="Контакты"
                value={contacts}
                error={contactsError}
                onChange={handleData}
            /> */}

      {/* <ImagesUploader
                name="images"
                title="Загрузить изображения"
                value={images}
                error={imagesError}
                onChange={handleData}
            /> */}
    </div>
  );
};

AddEvent.propTypes = propTypes;

export default AddEvent;
