import React from 'react';
import PropTypes from 'prop-types';

import { Select, Textarea, Button } from 'components/common';

import './Search.scss';


const propTypes = {
    week: PropTypes.oneOf(['current', 'next']).isRequired,
    words: PropTypes.string.isRequired,
    handleData: PropTypes.func.isRequired,
    handleClick: PropTypes.func.isRequired,
};

const Search = ({ week, words, handleData, handleClick }) => {
  return (
    <div className="search">

        <Select
            name="week"
            title="Неделя"
            value={week}
            onChange={handleData}
            options={{
                current: "Текущая",
                next: "Следующая"
            }}
        />

        <Textarea
            name="words"
            title="Слова в ивенте (через запятую)"
            value={words}
            onChange={handleData}
        />

        <Button text="Поиск" onClick={handleClick} />
    </div>
  );
};

Search.propTypes = propTypes;

export default Search;
