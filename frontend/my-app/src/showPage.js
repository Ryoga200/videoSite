import React, { Component } from 'react';
import { Container }  from '@mui/material';
import { Link,useParams,useHistory,useLocation } from 'react-router-dom';
import ReactPlayer from 'react-player';
export default class showPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      userId:'',
      title:'',
      userName:'',
      ext:'',
      file:''
    };
}
async componentDidMount(){
    await this.searchVideos()
    this.searchUser()
    this.searchInd()
    }
    async searchVideos(){
        const url = 'http://localhost:8000/videoSearch';
        let formData = new FormData();
        const id=this.state.id
        formData.append("id",id)
        await fetch(url, {
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
            title:  data.title,
            userId: data.userid,
            ext:    data.ext,
      })
    }).catch((error) => {
          console.log(error);
          return false;
      })
      }
      searchInd(){
        const url = 'http://localhost:8000/videoInd';
        let formData = new FormData();
        const id=this.state.id
        const ext=this.state.ext
        formData.append("id",id)
        formData.append("ext",ext)
        fetch(url, {
          method: 'POST',
          body:  formData
      }).then((response) => {
        console.log(typeof response)
            return response.json();
      }).then((data)  => {
        const id = data.id
        console.log(data)
        this.setState({
            file:data
      })
    }).catch((error) => {
          console.log(error);
          return false;
      })
      }
      searchUser(){
        let formData = new FormData();
    const id=this.state.userId
    console.log(id)
    formData.append("id",id)
    console.log(formData.get('id'))
      const url = 'http://localhost:8000/userSearch';
      fetch(url, {
          method: 'POST',
          body:  formData
          
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
        console.log(data)
        this.setState({
          userName:data.name,
      })
    }).catch((error) => {
          console.log(error);
          return false;
      })
      
      }
      videoUrl(){
        return "http://localhost:8000/videoInd/"+String(this.state.id)+"."+this.state.ext
      }
  render() {
    return (
      <Container>
      <div>
      <p>タイトル：{this.state.title}</p>
      <p>投稿者：{this.state.userName}</p>
      </div>
      <ReactPlayer url={this.videoUrl()}  playing loop controls={true} width="800px" height="450px"/>
      </Container>
    );
  }
}