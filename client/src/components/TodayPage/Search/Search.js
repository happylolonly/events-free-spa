import React, { PropTypes } from 'react';

import './Search.css';


const propTypes = {
  handleSearch: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
}

const Search = ({ search, handleSearch }) => {
  return (
    <div className="search">
      <input type="text" className="form-control" value={search} onChange={(event) => handleSearch(event.target.value)}  placeholder="Поиск..." />
    </div>
  )
}

Search.propTypes = propTypes;

export default Search;
