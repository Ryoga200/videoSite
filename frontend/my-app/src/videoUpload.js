import React, { Component  } from 'react';
import { Container, FormControl, FormLabel, TextField, Button, Box }  from '@mui/material';
import { Link } from 'react-router-dom';
export default class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
      }
      
      clickUpload= async () => {
       
        try {
          await this.Upload()
    
          this.props.history.push({ pathname: 'videoUpload' });
        } catch (e) {
          this.setState({ errMessage: 'Wrong name or password.' });
        }
      };
   Upload = () => {
    const fetchFormUpload = document.querySelector('.fetchFormUpload');
    const url = 'http://localhost:8000/videoUpload';
    let formData = new FormData(fetchFormUpload);
    const id=localStorage.getItem('id');
    formData.append("id",id)
    // π Uploading the file using the fetch API to the server
    console.log(formData)
    console.log(fetchFormUpload)
    fetch(url, {
      method: 'POST',
      body:  formData,
      // π Set headers manually for single file upload

    }).then((response) => {
      if (!response.ok) {
        console.log('response error!');
        return false;
      } else {
        console.log('response good!');
        return response.json();
      }
  }).then((data)  => {
      if (data) {
        return data;
      } else { 
        return false;
      }
  }).catch((error) => {
      console.log(error);
      return false;
  });
  this.props.history.push({ pathname: 'videoUpload' });
  window.location.href = '/main';
  };
    render() {

        return (
            <Container>
            <form className="fetchFormUpload">
              <Box m={1}>
                <h2>εη»γγ’γγγ­γΌγ</h2>
              </Box>
              <Box m={1} p={1}>
                <FormControl>
                  <FormLabel>εη»:</FormLabel>
                  <TextField
                    name="video"
                    type="file"
                    placeholder=""
                  />
                </FormControl>
              </Box>
              <Box m={1} p={1}>
                <FormControl>
                  <FormLabel>title</FormLabel>
                  <TextField
                    name="title"
                    type="text"
                    placeholder="γΏγ€γγ«γε₯ε"
                    onChange={this.handleChange}
                    value={this.state.passwordLogin}
                  />
                </FormControl>
              </Box>
              <Box m={1} p={1}>
                <Button type="button" variant="contained" color="primary" onClick={this.clickUpload}>
               γ’γγγ­γΌγ
                </Button>
              </Box>
            </form>
            <div><Link to='/main'>γ‘γ€γ³γγΌγΈγΈ</Link></div>
            </Container>
        )
      }
  }
