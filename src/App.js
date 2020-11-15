
import './App.css';
import * as Realm from "realm-web";
import React from 'react';
import ReactDOM from 'react-dom';
import GoogleLogin, { GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script'
const REALM_APP_ID = "application-0-htjdc"; // e.g. myapp-abcde
const app = new Realm.App({ id: REALM_APP_ID });


const responseGoogle = async (response) => {
  //  getGoogleAuthCode()
  //    .then(code => {
  // Define credentials with the authorization code from the Google SDK
  console.log(response)
  const credentials = Realm.Credentials.google(response.accessToken)
  // Log the user in to your app
  const user = await app.logIn(credentials)
  //    })
  //   .then(user => {
  console.log(`Logged in with id: ${user.id}`);
  //    });
  console.log(response);
}

const logout = (response) => {
  console.log(response);

}
// Create a component that displays the given user's details
function UserDetail({ user }) {
  return (
    <div>
      <h1>Logged in with anonymous id: {user.id}</h1>
    </div>
  );
}
//JswxMmn7L5q8KtbqyKjLfl26

function getGoogleAuthCode() {
  return new Promise((resolve, reject) => {
    gapi.auth2.authorize({
      client_id: "871874346798-vvg44dttf84ev64d5fv7v52hgc82sil4.apps.googleusercontent.com",
      // Scopes should match the metadata fields in the provider configuration
      //scope: "<scopes>",
      response_type: "code",
    }, ({ code, error }) => {
      if (error) {
        reject(error)
      }
      resolve(code)
    })
  })
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      user: [],
      setUser: [],
    };
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  // Create a component that lets an anonymous user log in
  Login = async () => {
    const newuser = await app.logIn(Realm.Credentials.anonymous());
    this.setState({
      user: newuser
    })
  }

  LoginEmail = async () => {
    // Create an email/password credential
    const credentials = Realm.Credentials.emailPassword(
      this.state.email, this.state.password
    );
    try {
      const newuser = await app.logIn(credentials);
      console.log("Successfully logged in!", newuser.id);
      this.setState({
        user: newuser
      })
    } catch (err) {
      console.error("Failed to log in", err.message);
    }
  }

  logout = async () => {

    await app.currentUser.logOut();
    this.setState({
      user: []
    })
  };

  registeruser = async () => {
    await app.emailPasswordAuth.registerUser(this.state.email, this.state.password);
  };

  callafunction = async () => {
    const result = await this.state.user.functions.function0();
    console.log(result)
  }
  afterGooglelogin = async () => {
    getGoogleAuthCode()
      .then(code => {
        // Define credentials with the authorization code from the Google SDK
        const credentials = Realm.Credentials.google(code)
        // Log the user in to your app
        return app.logIn(credentials)
      })
      .then(user => {
        console.log(`Logged in with id: ${user.id}`);
      });
  }
  handleChangeEmail(e) {
    console.log(e.target.value)
    this.setState({
      email: e.target.value
    });
  }
  handleChangePassword(e) {
    this.setState({ password: e.target.value });
  }


  // If a user is logged in, show their details.
  // Otherwise, show the login screen.
  render() {
    return (

      <div className="App">
        <div>
          <UserDetail user={this.state.user} />
          <button onClick={this.Login}>Log In</button>

            Email:
            <input type="text" value={this.state.email} onChange={this.handleChangeEmail} />

            Password:
            <input type="text" value={this.state.password} onChange={this.handleChangePassword} />
          <button onClick={this.LoginEmail}>Log In</button>
          <button onClick={this.logout}>Log Out</button>;
          <button onClick={this.registeruser}>Register</button>
          <button onClick={this.callafunction}>callafunction</button>
        </div>

        <GoogleLogin
          clientId="871874346798-vvg44dttf84ev64d5fv7v52hgc82sil4.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
          isSignedIn={true}
        />

        <GoogleLogout
          clientId="871874346798-vvg44dttf84ev64d5fv7v52hgc82sil4.apps.googleusercontent.com"
          buttonText="Logout"
          onLogoutSuccess={logout}
        >
        </GoogleLogout>
        <button onClick={this.afterGooglelogin}>afterGooglelogin</button>
      </div>
    );
  }
}

export default App;
