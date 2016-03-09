import React, { Component, PropTypes }  from 'react';
import moment                           from 'moment';
import { shuffle }                      from 'lodash';
import classNames                       from 'classnames';

import FlipMove from 'react-flip-move';
import Toggle from './Toggle.jsx';


class ListItem extends Component {
  render() {
    const listClass = `list-item card ${this.props.view}`;

    return (
      <li id={this.props.id} className={listClass}>
        <a href={this.props.url}>
          <img src={this.props.thumb} />
        </a>
        <h3><a href={this.props.url}>{this.props.title}</a></h3>
      </li>
    );
  }
};


class Shuffle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'list',
      order: 'asc',
      sortingMethod: 'chronological',
      articles: []
    };
    
    this.connection = new WebSocket('ws://rocky-sierra-19135.herokuapp.com/');
    
    var that = this;
    // Log messages from the server
    this.connection.onmessage = function (e) {
      var array = JSON.parse(e.data);
      var tempList = that.state.articles;
      
      /*array.forEach( function(index) {
         tempList.push(index);
      }); */
      that.setState({
        articles: array
      })
    };

    this.toggleList   = this.toggleList.bind(this);
    this.toggleGrid   = this.toggleGrid.bind(this);
    this.toggleSort   = this.toggleSort.bind(this);
    this.sortShuffle  = this.sortShuffle.bind(this);
    this.sortRotate   = this.sortRotate.bind(this);
  }

  toggleList() {
    this.setState({
      view: 'list'
    });
  }

  toggleGrid() {
    this.setState({
      view: 'grid'
    });
  }

  toggleSort() {
    const sortAsc   = (a, b) => a.timestamp - b.timestamp;
    const sortDesc  = (a, b) => b.timestamp - a.timestamp;

    this.setState({
      order: (this.state.order === 'asc' ? 'desc' : 'asc'),
      sortingMethod: 'chronological',
      articles: this.state.articles.sort(
        this.state.order === 'asc' ? sortDesc : sortAsc
      )
    });
  }

  sortShuffle() {
    this.setState({
      sortingMethod: 'shuffle',
      articles: shuffle(this.state.articles)
    });
  }

  sortRotate() {
    let articles = this.state.articles.slice();
    articles.unshift(articles.pop())

    this.setState({
      sortingMethod: 'rotate',
      articles
    });
  }

  renderArticles() {
    return this.state.articles.map( (article, i) => {
      return (
        <ListItem
          key={article.id}
          view={this.state.view}
          style={{ zIndex: i }}
          {...article}
        />
      );
    });
  }

  render() {
    return (
      <div id="shuffle" className={this.state.view}>
        <ul>
          <FlipMove staggerDurationBy="30" duration={500}>
            { this.renderArticles() }
          </FlipMove>
        </ul>
      </div>
    );
  }
};

export default Shuffle;
