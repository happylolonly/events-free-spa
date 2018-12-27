import React from 'react';
import PropTypes from 'prop-types';

import { Select, Textarea, Button } from 'components/common';

import './Search.scss';

const propTypes = {
  week: PropTypes.oneOf(['current', 'next']).isRequired,
  words: PropTypes.string.isRequired,
  handleData: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,

  weekError: PropTypes.string,
  wordsError: PropTypes.string,
};

const Search = ({ week, words, handleData, handleClick, weekError, wordsError }) => {
  return (
    <div className="search">
      <Select
        name="week"
        title="Неделя"
        value={week}
        onChange={handleData}
        options={{
          current: 'Текущая',
          next: 'Следующая',
        }}
        error={weekError}
      />

      <Textarea
        name="words"
        title="Слова в ивенте (через запятую)"
        value={words}
        onChange={handleData}
        error={wordsError}
      />

      <Button type="success" text="Поиск" onClick={handleClick} />
    </div>
  );
};

Search.propTypes = propTypes;

export default Search;
