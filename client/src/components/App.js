import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Header from './Header';
import Landing from './Landing';
import Dashboard from './Dashboard';
import BlogNew from './blogs/BlogNew';
import BlogShow from './blogs/BlogShow';

function App(props) {
  useEffect(() => {
    props.fetchUser();
  });

  return (
    <div>
      <BrowserRouter>
        <Header />
        <Switch>
          <Route path="/blogs/new" component={BlogNew} />
          <Route exact path="/blogs/:_id" component={BlogShow} />
          <Route path="/blogs" component={Dashboard} />
          <Route path="/" component={Landing} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default connect(
  null,
  actions
)(App);
