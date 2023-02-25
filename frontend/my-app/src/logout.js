import React, { Component } from 'react';
import { Container }  from '@mui/material';
import { Link } from 'react-router-dom';
import User from './User';

export default class Logout extends Component {
  async componentDidMount() {
    await User.logout();
  }

  render() {
    return (
      <Container>
        <div>
          <h2>Logged out.</h2>
          <div>
            <Link to="/login">Go to Login</Link>
          </div>
        </div>
      </Container>
    );
  }
}