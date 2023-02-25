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
    // 👇 Uploading the file using the fetch API to the server
    console.log(formData)
    console.log(fetchFormUpload)
    fetch(url, {
      method: 'POST',
      body:  formData,
      // 👇 Set headers manually for single file upload

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
                <h2>動画をアップロード</h2>
              </Box>
              <Box m={1} p={1}>
                <FormControl>
                  <FormLabel>動画:</FormLabel>
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
                    placeholder="タイトルを入力"
                    onChange={this.handleChange}
                    value={this.state.passwordLogin}
                  />
                </FormControl>
              </Box>
              <Box m={1} p={1}>
                <Button type="button" variant="contained" color="primary" onClick={this.clickUpload}>
               アップロード
                </Button>
              </Box>
            </form>
            <div><Link to='/main'>メインページへ</Link></div>
            </Container>
        )
      }
  }
