import React, { Component, PropTypes }      from 'react';
import ReactDOM, { render }                 from 'react-dom';
import classNames                           from 'classnames';
import { Router, Route, Link, IndexRoute }  from 'react-router';

import Home       from './components/Home.jsx';
import Shuffle    from './components/1_Shuffle.jsx';

require('./scss/main.scss');


class App extends Component {
  availablePaths() { return this.props.route.childRoutes.map( route => route.path )}
  currentPath() { return this.props.location.pathname.replace(/^\//, '') }

  render() {
    return (
      <div className="app">
        <section id="main-content">
          { this.props.children }
        </section>
      </div>
    );
  }
};

render((
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="shuffle" component={Shuffle} />
    </Route>
  </Router>
), document.getElementById('render-target'))
