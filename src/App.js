
import './App.css';
import * as Realm from "realm-web";
import React from 'react';
import ReactDOM from 'react-dom';
import GoogleLogin, { GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script'
const REALM_APP_ID = "webapp-knulu"; // from realm
const app = new Realm.App({ id: REALM_APP_ID });


const logout = (response) => {
  console.log(response);

}
// Create a component that displays the given user's details
function UserDetail({ user }) {
  return (
    <div>
      <h1>Logged in with id: {user.id}</h1>
    </div>
  );
}
//JswxMmn7L5q8KtbqyKjLfl26
/*
function getGoogleAuthCode() {
  return new Promise((reject, resolve) => {
    gapi.auth2.authorize({
      client_id: "871874346798-vvg44dttf84ev64d5fv7v52hgc82sil4",
      // Scopes should match the metadata fields in the provider configuration
      scope: "name",
      response_type: "code",
    }, ({ code, error }) => {
      if (error) {
        reject(error)
      }
      resolve(code)
    })
  })
}
*/

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
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

  googlelogin = async () => {
    var auth2 = gapi.auth2.getAuthInstance();
    var scope = {
      scope: 'email'
    }
    console.log(auth2.currentUser.get().getAuthResponse(true))
    auth2.grantOfflineAccess(scope).then(function (resp) {
      var auth_code = resp.code;
      console.log(auth_code)
      //    const credentials = Realm.Credentials.google(auth2.currentUser.get().getAuthResponse(true).access_token)
      const credentials = Realm.Credentials.google(auth_code)
      // Log the user in to your app
      var user = app.logIn(credentials)
      console.log(`Logged in with id: ${user.id}`);

    });
  }

  signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }
  callafunction = async () => {
    const result = await this.state.user.functions.testfunction();
    console.log(result)
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
          <button onClick={this.Login}>Log In anonymous</button> please dont press too many times, for testing purpose only before you have an account
        </div>
        <div>
          Email:
            <input type="text" value={this.state.email} onChange={this.handleChangeEmail} />

            Password:
            <input type="text" value={this.state.password} onChange={this.handleChangePassword} />
          <button onClick={this.LoginEmail}>Log In with email</button>
          <button onClick={this.logout}>Log Out</button>
          <button onClick={this.registeruser}>Register</button>

        </div>
        <div>
          <button onClick={this.callafunction}>callafunction</button>
          see result in console


        </div>
        Google is not yet working
        <div className="g-signin2" data-onsuccess="onSignIn"></div>

        <button onClick={this.googlelogin} > use google login</button >
        <button onClick={this.signOut}>Sign out google</button>
        <div>
          <p>After pressing "log in anonymous" or "login with email", id should be shown. </p>
          <p>After login you can call the function and see a demo result in console</p>
          <p>call function before login return error</p>
        </div>
      </div >

    );
  }
}

export default App;
