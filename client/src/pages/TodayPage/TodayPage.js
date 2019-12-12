import React from 'react';
import throttle from 'lodash/throttle';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import EventItem from 'components/EventItem/EventItem';

class TodayPage extends React.PureComponent {
  static propTypes = {
    events: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    loadEvents: PropTypes.func.isRequired,
    currentFilter: PropTypes.string.isRequired,
    handleMouseOver: PropTypes.func.isRequired,
    totalEventsAmount: PropTypes.number.isRequired,
    amountOfLoadedEvents: PropTypes.number.isRequired,
  }

  componentDidMount() {
    window.addEventListener('scroll', this.trottledScrollHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.trottledScrollHandler);
  }

  handleScrolling = (e) => {
    const {
      amountOfLoadedEvents,
      totalEventsAmount,
      loadEvents,
    } = this.props;

    if (amountOfLoadedEvents === totalEventsAmount) return;

    const footer = document.getElementById('js-footer');

    const rect = footer.getBoundingClientRect();
    const isAtEnd = (
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );

    if (isAtEnd) {
      if (this.props.isLoading) return;
      loadEvents();
    }
  }

  trottledScrollHandler = throttle(this.handleScrolling, 200);

  getRef = (node) => {
    this.ref = node;
  }

  showTitle = () => {
    switch (this.props.currentFilter) {
      case 'today':
        return <h3>Мероприятия на сегодня</h3>;
      case 'tomorrow':
        return <h3>Мероприятия на завтра</h3>;
      case 'certain':
        if (!window.location.search) {
          // /events => certain
          return <h3>Все мероприятия</h3>;
        }
        const [day, month] = window.location.search.split('=')[1].split('_');

        if (!month) {
          // перерендер до колбека setState
          return <h3>Все мероприятия</h3>;
        }

        const monthRU = [
          'Января',
          'Февраля',
          'Марта',
          'Апреля',
          'Мая',
          'Июня',
          'Июля',
          'Августа',
          'Сентября',
          'Октября',
          'Ноября',
          'Декабря'
        ];

        return (
          <h3 className="today-page__title">
            Мероприятия на {`${+day} ${monthRU[+month - 1].toLowerCase()}`}
          </h3>
        );
      case 'past':
        return <h3 className="today-page__title">Прошедшие мероприятия</h3>;
      default:
        return <h3 className="today-page__title">Все мероприятия</h3>;
    }
  };

  render() {
    const { events, handleMouseOver } = this.props;

    return (
      <div className="today-page" ref={this.getRef}>
        {this.showTitle()}
        {events.map(item => {
          const { id } = item;
          return (
            <EventItem
              {...item}
              key={id}
              link={id}
              mouseOver={() => handleMouseOver(id)}
            />
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = ({ events }) => ({
  amountOfLoadedEvents: events.data.model.length,
  totalEventsAmount: events.data.totalCount,
  isLoading: events.isLoading,
  events: events.data.model,
});

export default connect(mapStateToProps)(TodayPage);
