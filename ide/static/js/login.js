import React from 'react';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.checkLogin = this.checkLogin.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
  }
  componentWillMount() {
    this.setState({ loginState: false });
    this.checkLogin();
  }
  checkLogin() {
    $.ajax({
      url: '/backendAPI/checkLogin',
      type: 'GET',
      processData: false,  // tell jQuery not to process the data
      contentType: false,
      success: function (response) {
        if (response.result) {
          this.setState({ loginState: response.result });
          this.props.setUserId(response.user_id);
          this.props.setUserName(response.username);
        }
      }.bind(this),
      error: function () {
        this.setState({ loginState: false });
      }.bind(this)
    });
  }
  logoutUser() {
    $.ajax({
      url: '/accounts/logout',
      type: 'GET',
      processData: false,  // tell jQuery not to process the data
      contentType: false,
      success: function (response) {
        if (response) {
          this.setState({ loginState: false });
          this.props.setUserId(null);
          this.props.setUserName(null);
        }
      }.bind(this),
      error: function () {
        this.setState({ loginState: true });
        this.addError("Error occurred while logging out");
      }.bind(this)
    });
  }
  componentDidMount() {
    let base = $('#login-prepanel')[0];
    base.parentNode.removeChild(base);
    document.body.appendChild(base);
  }
  openLoginPanel() {
    $('#login-prepanel')[0].classList.add('login-prepanel-enabled');
  }
  closeLoginPanel() {
    $('#login-prepanel')[0].classList.remove('login-prepanel-enabled');
  }
  tryLogin() {
    let username = $('#login-input')[0].value;
    $.ajax({
      url: '/backendAPI/checkLogin',
      type: 'GET',
      processData: false,  // tell jQuery not to process the data
      contentType: false,
      success: function (response) {
        if (response.result) {
          $('#successful-login-notification')[0].style.display = 'block';
          $('#successful-login-notification-message')[0].innerHTML = 'Welcome, ' + username + '!';

          setTimeout(() => {
            $('#successful-login-notification')[0].style.display = 'none';
          }, 3000);

          this.closeLoginPanel();
          $('#sidebar-login-button div')[0].innerHTML = 'LOGOUT';
          $('#sidebar-login-button span')[0].classList.remove('fa-sign-in');
          $('#sidebar-login-button span')[0].classList.add('fa-sign-out');

          this.setState({ loginState: response.result });
          this.props.setUserId(response.user_id);
          this.props.setUserName(response.username);
        }
        else {
          $('#login-error-message-text')[0].innerHTML = response.error; 
          $('#login-error-message')[0].style.display = 'block'; 
        }
      }.bind(this),
      error: function () {
        this.setState({ loginState: false });
      }.bind(this)
    });
  }
  render() {
    if(this.state.loginState) {
      return (
        <div>
          <a className="btn btn-block extra-buttons text-left" onClick={ () => this.logoutUser() }>Logout</a>
        </div>
      )
    }
    else {
      return (
        <div>
          <h5 className="sidebar-heading" id="sidebar-login-button" onClick={
            () => {
              if (!this.state.loginState) {
                this.openLoginPanel();
              } else {
                this.logoutUser();
              }
          }}>
            <span className="fa fa-sign-in">
            </span>
            <div>LOGIN</div>
          </h5>
          <div id="successful-login-notification">
            <i className="material-icons">done</i>
            <div id="successful-login-notification-message"></div>
          </div>
          <div id="login-prepanel" onClick={
              (e) => {
                if (e.target.id == "login-prepanel" || e.target.id == "login-panel-close")
                  this.closeLoginPanel()
              }
            }>
            <div className="login-panel">
              <i className="material-icons" id="login-panel-close">close</i>
              <div className="login-logo">
                <a href="http://fabrik.cloudcv.org">
                  <img src="/static/img/fabrik_t.png" className="img-responsive" alt="logo" id="login-logo"></img>
                </a>
              </div>
              <div className="login-panel-main">
                <h5 className="sidebar-heading">
                  LOGIN
                  <div className="login-invalid">- invalid</div>
                </h5>
                <h5 className="sidebar-heading">
                  <input placeholder="login" autoCorrect="off" id="login-input"></input>
                </h5>
                <h5 className="sidebar-heading">
                  PASSWORD
                  <div className="login-invalid">- invalid</div>
                </h5>
                <h5 className="sidebar-heading">
                  <input type="password" placeholder="password" id="password-input"></input>
                </h5>

                <div id="login-error-message">
                  <i className="material-icons">close</i>
                  <div id="login-error-message-text"></div>
                </div>

                <h5 className="sidebar-heading login-prebtn">
                  <div className="col-md-6 login-button" id="login-button">
                    <a className="btn btn-block btn-social" onClick={ () => this.tryLogin() } style={{width: '105px'}}>
                      <span className="fa fa-sign-in"></span>Login
                    </a>
                  </div>
                </h5>

                <h5 className="sidebar-heading login-prebtn">
                  <div className="col-md-5 login-button">
                    <a className="btn btn-block btn-social" onClick={() => window.location="/accounts/google/login"}  style={{width: '105px'}}>
                      <span className="fa fa-user-plus"></span>Sign up
                    </a>
                  </div>
                </h5>

                <h5 className="sidebar-heading extra-login">
                  OTHER
                </h5>

                <h5 className="sidebar-heading login-prebtn">
                  <div className="col-md-6">
                    <a className="btn btn-block btn-social btn-github" onClick={
                        () => window.location="/accounts/github/login"
                      } style={{width: '105px'}}>
                      <span className="fa fa-github"></span>Github
                    </a>
                  </div>
                </h5>

                <h5 className="sidebar-heading login-prebtn">
                  <div className="col-md-5">
                    <a className="btn btn-block btn-social btn-google" onClick={
                        () => window.location="/accounts/google/login"
                      }  style={{width: '105px'}}>
                      <span className="fa fa-google"></span>Google
                    </a>
                  </div>
                </h5>

              </div>
            </div> 
          </div>
        </div>
      )
    }
  }
}

Login.propTypes = {
  setUserId: React.PropTypes.func,
  setUserName: React.PropTypes.func
};

export default Login;
