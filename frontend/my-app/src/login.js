import React, { Component } from 'react';
import { Container, FormControl, FormLabel, TextField, Button, Box }  from '@mui/material';
import { Alert } from '@mui/lab';
import { withRouter } from 'react-router-dom';
import User from './User';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      password: '',
      errMessage: '',
    };
    if (User.isLoggedIn() && localStorage.getItem('token') !== null) {
      this.props.history.push({ pathname: 'main' });
    }
  }

  clickLogin = async () => {
    try {
      await User.login(this.state.name, this.state.password);

      this.props.history.push({ pathname: 'main' });
    } catch (e) {
      this.setState({ errMessage: 'Wrong name or password.' });
    }
  };

  clickSignup = async () => {
    try {
      await User.signup(this.state.name, this.state.password);

      this.props.history.push({ pathname: 'login' });
    } catch (e) {
      this.setState({ errMessage: 'Wrong name or password.' });
    }
  };

  handleChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    return (
      <Container>
        <form className="fetchFormLogin">
          <Box m={1}>
            <h2>ログイン</h2>
            {this.state.errMessage && (
              <Alert>{this.props.message}</Alert>
            )}
          </Box>
          <Box m={1} p={1}>
            <FormControl>
              <FormLabel>Email:</FormLabel>
              <TextField
                name="email"
                type="email"
                placeholder="Enter your name"
                onChange={this.handleChange}
                value={this.state.nameLogin}
              />
            </FormControl>
          </Box>
          <Box m={1} p={1}>
            <FormControl>
              <FormLabel>パスワード</FormLabel>
              <TextField
                name="password"
                type="password"
                placeholder="Enter your password"
                onChange={this.handleChange}
                value={this.state.passwordLogin}
              />
            </FormControl>
          </Box>
          <Box m={1} p={1}>
            <Button type="button" variant="contained" color="primary" onClick={this.clickLogin}>
            ログイン
            </Button>
          </Box>
        </form>
        
        <form className="fetchFormSignup">
          <Box m={1}>
            <h2>サインアップ</h2>
            {this.state.errMessage && (
              <Alert>{this.props.message}</Alert>
            )}
          </Box>
          <Box m={1} p={1}>
          <FormControl>
            <FormLabel>Email:</FormLabel>
            <TextField
              name="email"
              type="email"
              placeholder="Enter your name"
              onChange={this.handleChange}
              value={this.state.nameLogin}
            />
          </FormControl>
        </Box>
          <Box m={1} p={1}>
            <FormControl>
              <FormLabel>名前:</FormLabel>
              <TextField
                name="name"
                type="text"
                placeholder="Enter your name"
                onChange={this.handleChange}
                value={this.state.nameSignup}
              />
            </FormControl>
          </Box>
          <Box m={1} p={1}>
            <FormControl>
              <FormLabel>パスワード</FormLabel>
              <TextField
                name="password"
                type="password"
                placeholder="Enter your password"
                onChange={this.handleChange}
                value={this.state.passwordSignup}
              />
            </FormControl>
          </Box>
          <Box m={1} p={1}>
            <Button type="button" variant="contained" color="secondary" onClick={this.clickSignup}>
            サインアップ
            </Button>
          </Box>
        </form>
      </Container>
    );
  }
}
        
export default withRouter(Login);