import { React, useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Modal from './Modal.jsx';
import { StoreContext } from './StoreContext';
import Cookies from 'universal-cookie';

export const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const context = useContext(StoreContext);
  const { setToken } = context.tokens;
  const cookies = new Cookies();

  /** redirect to sign up page */
  const showSignUpPage = () => {
    history.push('/signup');
  }

  /** send login request to server */
  const sendLoginRequest = () => {
    const loginUrl = 'http://localhost:5005/admin/auth/login';
    const loginBody = {
      email: email,
      password: password,
    };

    fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginBody)
    }).then((res) => {
      if (res.status === 200) {
        res.json().then(res => {
          // store token in cookies and global variable
          setToken('Bearer ' + res.token);
          console.log(res.token);
          // path: '/' indicates this cookie is accessed across all pages
          cookies.set('user-token', 'Bearer ' + res.token, { path: '/' });
          alert('login success!');
          // go to dashboard
          history.push('/dashboard');
        })
      } else {
        alert('ERROR: Invalid Input!');
        // refresh page
        window.location.reload();
      }
    }).catch((error) => {
      console.log(error);
      setShowModal(true);
    });
  }

  /** check if login details are entered and send login request */
  const login = () => {
    if (!email || !password) {
      alert('Please complete login details!');
    } else {
      sendLoginRequest();
    }
  }

  return (
    <form>
      {showModal && <Modal />}
      <div className="main-container">
        <Container className="content">
          <div className="login-form">
            <h1 className="login-title">Login</h1>
            <input className="mb-2" type='text' placeholder='Email' value={ email } onChange={(e) => setEmail(e.target.value)} autoFocus />
            <input className="mb-5" type='password' placeholder='Password' value={ password } onChange={(e) => setPassword(e.target.value)} />
            <Button className="mb-2" variant="primary" onClick={ login }>Login</Button>
            <Button variant="secondary" onClick={ showSignUpPage }>Sign Up</Button>
          </div>
        </Container>
      </div>
    </form>
  )
}

// export default Login
