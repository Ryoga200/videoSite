import React, { Component } from 'react';
import { Container }  from '@mui/material';
import { Link } from 'react-router-dom';
export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      id: '',
      video:[],
    };
  }
  
  componentDidMount(){
    let formData = new FormData();
    const id=localStorage.getItem('id');
    formData.append("id",id)
    console.log(formData.get('id'))
      const url = 'http://localhost:8000/userSearch';
      fetch(url, {
          method: 'POST',
          body:  formData
          
      }).then((response) => {
          if (!response.ok) {
            console.log('response error!');
            return false;
          } else {
            console.log('response good!');
            return response.json();
          }
      }).then((data)  => {
        const id = data.id
        console.log(data)
        this.setState({
          name: data.name,
      email: data.email,
      id: data.id,
      })
    }).catch((error) => {
          console.log(error);
          return false;
      })
      this.showVideos()
    }
    showVideos(){
      const url = 'http://localhost:8000/video';
      fetch(url, {
        method: 'GET'
        
    }).then((response) => {
      console.log(typeof response)
        if (!response.ok) {
          console.log('response error!');
          return false;
        } else {
          console.log('response good!');
          return response.json();
        }
    }).then((data)  => {
      const id = data.id
      console.log(data)
      this.setState({
        video:data,
    })
      return data
  }).catch((error) => {
        console.log(error);
        return false;
    })
    }

  render() {
    return (
      <Container>
        <div>
          <h2>{this.state.name}さんようこそ！</h2>
          <div>
          <Link to="/videoUpload">動画をアップロード</Link>
          </div>
          <div>
            <Link to="/logout">ログアウト</Link>
          {console.log(typeof(this.state.video))}
          <ui>
         { this.state.video.map((d) =>  (
          <li key={d.id}>
            <Link to={'/showPage/' + d.id}>{d.title}</Link>
          </li>
        ))}
          </ui>
          </div>
        </div>
      </Container>
    );
  }
}