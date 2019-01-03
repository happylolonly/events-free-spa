import React from 'react';
import PropTypes from 'prop-types';

import './Search.scss';

const propTypes = {
  handleSearch: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
};

const Search = ({ search, handleSearch }) => {
  return (
    <div className="search">
      <input
        type="text"
        className="form-control"
        value={search}
        onChange={event => handleSearch(event.target.value)}
        placeholder="Поиск..."
      />
    </div>
  );
};

Search.propTypes = propTypes;

export default Search;
