import { React, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Modal from './Modal.jsx'
import Cookies from 'universal-cookie';

const Signup = () => {
  // const signUpUrl = 'http://localhost:5005/admin/auth/register';
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const cookies = new Cookies();

  const sendSignUpRequest = () => {
    const signUpUrl = 'http://localhost:5005/admin/auth/register';
    const signUpBody = {
      email: email,
      password: password,
      name: name
    };
    console.log(signUpBody);
    fetch(signUpUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(signUpBody)
    }).then((res) => {
      if (res.status === 200) {
        res.json().then(res => {
          console.log(res.token);
          // path: '/' indicates this cookie is accessed across all pages
          cookies.set('user-token', 'Bearer ' + res.token, { path: '/' });
          alert('sign up success!');
          // go to dashboard
          history.push('/dashboard');
        })
      } else {
        alert('ERROR: Invalid Input!');
      }
    }).catch((error) => {
      console.log(error);
      setShowModal(true);
    });
  }

  const signUp = () => {
    // check if all details are entered
    if (!name || !email || !password || !confirmPassword) {
      alert('Please complete all details.');
    } else {
      // check if password and confirm password are the same
      if (password !== confirmPassword) {
        alert('Password and Confirm Password are different.');
        setPassword('');
        setConfirmPassword('');
      } else {
        sendSignUpRequest();
      }
    }
  }

  return (
    <form>
      {showModal && <Modal />}
      <div className="signUp-form">
        <h1 className="signUp-title">Sign Up</h1>
        <input className="mb-2" type='text' placeholder='Name' value={ name } onChange={(e) => setName(e.target.value)} />
        <input className="mb-2" type='text' placeholder='Email' value={ email } onChange={(e) => setEmail(e.target.value)} />
        <input className="mb-2" type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value) } />
        <input className="mb-5" type='password' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value) } />
        <Button variant="primary" onClick={ signUp }>Sign Up</Button>
      </div>
    </form>
  )
}

export default Signup
