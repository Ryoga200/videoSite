class User {
    isLoggedIn = () => this.get('isLoggedIn') === 'true';
    set = (key, value) => localStorage.setItem(key, value);
    get = key => this.getLocalStorage(key);
    
    getLocalStorage = key => {
      const ret = localStorage.getItem(key);
      const retTtoken = localStorage.getItem('token');
      if (ret && retTtoken) {
        return ret;
      }
      return null;
    };
  
    signup = async (name, password) => {
      const fetchFormSignup = document.querySelector('.fetchFormSignup');
      const url = 'http://localhost:8000/signup';
      let formDataSignup = new FormData(fetchFormSignup);
      fetch(url, {
          method: 'POST',
          body: formDataSignup
      }).then((response) => {
          if(!response.ok) {
              console.log('response error!');
              return false;
          } else {
            console.log('response good!');
            return response.json();
          }
      }).then((data)  => {
          const title = data.title
          console.log(data)
          if (data) {
            console.log('title = ' + title);
            window.location.href = '/login';
            return true;
          } else { 
            console.log("error!");
            return false;
          }
      }).catch((error) => {
          console.log(error);
          return false;
      });
    };
  
    login = async (email, password) => {
      const fetchFormLogin = document.querySelector('.fetchFormLogin');
      const url = 'http://localhost:8000/login';
      let formDataLogin = new FormData(fetchFormLogin);
      fetch(url, {
          method: 'POST',
          body: formDataLogin
      }).then((response) => {
          if (!response.ok) {
            console.log('response error!');
            return false;
          } else {
            console.log('response good!');
            return response.json();
          }
      }).then((data)  => {
          const token = data.token
          const id = data.id
          if (token) {
            console.log('token = ' + token)
            this.rReq(token,id)
          } else { 
            console.log("token error!");
            return false;
          }
      }).catch((error) => {
          console.log(error);
          return false;
      });
    };
  
    logout = async () => {
      localStorage.removeItem('token');
      if (this.isLoggedIn()) {
        this.set('isLoggedIn', false);
      }
    };
  
    rReq = async (token,id) => {
      const url = 'http://localhost:8000/restricted';
      fetch(url, {
        method: "GET",
        headers: {
        Authorization:
            `Bearer ${token}`,
        },
      }).then(function(response) {
          return response.json();
      }).then(function(json) {
          if (token) {
            console.log('tokenreq = ' + token)
            localStorage.setItem('token', token)
            localStorage.setItem('id', id)
            localStorage.setItem('isLoggedIn', true);
            window.location.href = '/main'
          } else { 
            console.log("token error2");
            return false;
          }
      });
    };
  }
  
  export default new User();