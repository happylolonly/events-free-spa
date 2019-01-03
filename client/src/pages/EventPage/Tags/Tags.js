/**
 * Component show tags on event's page and allow to check them on admin's
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Tag from '../../../components/Tag/Tag';

import axios from 'axios';
import { API } from 'constants/config';

import './Tags.scss';

const propTypes = {
  tags: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
  routerHistory: PropTypes.object.isRequired,
  adminMode: PropTypes.bool,
  // unconfirmedTags: PropTypes.array.isRequired
};

class Tags extends Component {
  state = {
    tags: this.props.tags,
    newTag: '',
    predictions: {},
  };

  componentDidMount() {
    if (this.props.adminMode) {
      this.predict(this.props.id);
    }
  }

  async predict(id) {
    try {
      const data = await axios.get(`${API}/event-tag-predict`, {
        params: {
          id,
        },
      });

      const { topics, tags } = data.data;

      this.setState({
        predictions: {
          topics,
          tags,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  saveTags = async () => {
    try {
      await axios.patch(`${API}/event-tag`, {
        id: this.props.id,
        tags: this.state.tags,
      });

      this.props.routerHistory.push('/somepath');
    } catch (error) {
      console.log(error);
    }
  };

  handleChange = event => {
    const { value } = event.target;

    this.setState({ newTag: value });
  };

  handleClick = () => {
    // const { tags, newTag } = this.state;
    // const tags = [ ...this.state.tags ];
    // tags.push(newTag);
    // this.state.newTag.split(' ')

    if (this.state.newTag) {
      this.setState({
        tags: [...this.state.tags, this.state.newTag], // check dyplicates
        newTag: '',
      });
    }
  };

  renderPredictionTags() {
    const renderTags = items => {
      return items.map((item, i) => {
        const { label, probability } = item;
        return (
          <div>
            <Tag
              key={i}
              text={label}
              onClick={() => {
                this.setState({
                  tags: [...this.state.tags, label],
                });
              }}
            />
            <p>{probability * 100} %</p>
          </div>
        );
      });
    };

    const { tags, topics } = this.state.predictions;

    return (
      <div className="predictions">
        <div>
          <h5>Tags</h5>
          {renderTags(tags)}
        </div>
        <div>
          <h5>Topics</h5>
          {renderTags(topics)}
        </div>
      </div>
    );
  }

  render() {
    if (!this.props.adminMode) {
      return (
        <div className="tag__container">
          {this.props.tags.map((item, i) => {
            return <Tag key={i} text={item} />;
          })}
        </div>
      );
    }

    return (
      <div className="tags">
        {this.state.tags.map((item, i) => {
          return <Tag key={i} text={item} />;
        })}

        <hr />

        {Object.keys(this.state.predictions).length > 0 && this.renderPredictionTags()}

        <input type="text" value={this.state.newTag} onChange={this.handleChange} />

        {/* TODO: use common components */}

        <button onClick={this.handleClick}>Добавить</button>
        <button onClick={this.saveTags}>Сохранить</button>
      </div>
    );
  }
}

Tags.propTypes = propTypes;

export default Tags;
