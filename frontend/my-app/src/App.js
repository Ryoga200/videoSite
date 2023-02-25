import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import Auth from './auth';

import Login from './login';
import Logout from './logout';
import Main from './main';
import Upload from './videoUpload';
import ShowPage from './showPage';
export default class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/logout" component={Logout} />
          <Auth>
            <Switch>
              <Route exact path="/main" component={Main} />
              <Route path='/showPage/:id' component={ShowPage} />
              <Route exact path="/VideoUpload" component={Upload} />
              <Redirect from="/" to="/main" />
            </Switch>
          </Auth>
        </Switch>
      </Router>
    );
  }
}
