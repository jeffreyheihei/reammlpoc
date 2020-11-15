
import './App.css';
import * as Realm from "realm-web";
import React from 'react';
const REALM_APP_ID = "application-0-htjdc"; // e.g. myapp-abcde
const app = new Realm.App({ id: REALM_APP_ID });

var user, setUser;

// Create a component that displays the given user's details
function UserDetail({ user }) {
    return (
        <div>
            <h1>Logged in with anonymous id: {user.id}</h1>
        </div>
    );
}

// Create a component that lets an anonymous user log in
function Login() {
    const loginAnonymous = async () => {
        const user = await app.logIn(Realm.Credentials.anonymous());
    };
    
    
    return <button onClick={loginAnonymous}>Log In</button>;
}

function LoginEmail(email,password) {
    // Create an email/password credential
    const credentials = Realm.Credentials.emailPassword(
        email,password
    );
    const loginEmail = async () => {
        const user = await app.logIn(credentials);
        console.log("Successfully logged in!", user.id);
    };


    return <button onClick={loginEmail}>Log In Email</button>;
}

function LogOut() {
    // Create an email/password credential
    const logout = async () => {
        await app.currentUser.logOut();
    };
    return <button onClick={logout}>Log Out</button>;
}

function SignUp(email,password) {
    // Create an email/password credential
    const registeruser = async () => {
        await app.emailPasswordAuth.registerUser(email, password);
    };
    return <button onClick={registeruser}>Register</button>;
}

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = { email: '', password: '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    componentDidMount() {
        
    }

    UserDetail({ user }) {
        return (
            <div>
                <h1>Logged in with anonymous id: {user.id}</h1>
            </div>
        );
    }

    handleChange(event) {
        this.setState({
            email: event.target.email, password: event.target.password
        });
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }

    render() {

        return (
            <div>
                {user ? <UserDetail user={user} /> : <Login setUser={setUser} />}
                {user ? <UserDetail user={user} /> : <LoginEmail />}
                {<LogOut />}
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Email:
            <input type="text" value={this.state.email} onChange={this.handleChange} />
                    </label>
                    <label>
                        Password:
            <input type="text" value={this.state.password} onChange={this.handleChange} />
                    </label>
                </form>
                {<SignUp/>}
            </div>
        );
    }
}
export default App;