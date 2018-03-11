import React from 'react';
import PropTypes from 'prop-types';

import cn from 'classnames';

import './Filters.scss';


const propTypes = {
  currentFilter: PropTypes.string.isRequired,
  handleFilter: PropTypes.func.isRequired,
}

const Filters = ({ currentFilter, handleFilter }) => {
  return (
    <div className="filters">

      <button className={cn({'filter-active': currentFilter === 'today'})} onClick={() => handleFilter('today')}>На сегодня</button>
      <button className={cn({'filter-active': currentFilter === 'tomorrow'})} onClick={() => handleFilter('tomorrow')}>На завтра</button>
      <button className={cn({'filter-active': currentFilter === 'certain'})} onClick={() => handleFilter('certain')}>На определенный день</button>
      <button className={cn({'filter-active': currentFilter === 'all'})} onClick={() => handleFilter('all')}>Все</button>
      <button className={cn({'filter-active': currentFilter === 'past'})} onClick={() => handleFilter('past')}>Прошедшие</button>

    </div>
  )
}

Filters.propTypes = propTypes;

export default Filters;
