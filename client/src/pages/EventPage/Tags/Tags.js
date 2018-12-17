import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';
import { API } from 'constants/config';


import './Tags.scss';


const propTypes = {
  tags: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
  //routerHistory
  // adminMode
  // unconfirmedTags
};

// new component
const Tag = ({ text }) => {
  return (
    <div className='tag'>
      {text}
    </div>
  )
}


class Tags extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [],
      newTag: '',
      predictedTags: [],
    }

  }

  componentDidMount() {
    this.predict(this.props.id);
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
  }

  handleChange = (event) => {
    const newTag = event.target.value;

    this.setState({ newTag });

  }

  handleClick = () => {
    // const { tags, newTag } = this.state;
    // const tags = [ ...this.state.tags ];
    // tags.push(newTag);

    if (this.state.newTag) {
      this.setState({
        tags: [...this.state.tags, this.state.newTag], // check dyplicates
        newTag: ''
      })

    }
  }

  async predict(id) {

    try {
      const data = await axios.get(`${API}/event-tag-predict`, {
        params: {
          id,
        }
      });
      const predictedTags = data.data;

      this.setState({
        predictedTags,
      })
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    if (!this.props.adminMode) {
      return (
        <div className='tag__container'>
          {this.props.tags.map((item, i) => {
            console.log(item);
            return (
              <Tag key={i} text={item} />
            )
          })}
        </div>
      )
    }


    return (
      <div className="">

        {this.state.tags.map((item, i) => {
          console.log(item);
          return (
            <Tag key={i} text={item} />
          )
        })}

        {this.state.predictedTags.map((item, i) => {
          const { tag, probability } = item;
          return (
            <div>
              <Tag key={i} text={tag} />
              <p>Probability: {probability}</p>
            </div>
          )
        })}

        <input type="text" value={this.state.newTag} onChange={this.handleChange} />
        <button onClick={this.handleClick}>Добавить</button>
        <button onClick={this.saveTags}>Сохранить</button>
      </div>
    )
  }
}

Tags.propTypes = propTypes;

export default Tags;
