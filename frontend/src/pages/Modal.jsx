import React from 'react';
import '../App.css';

const Modal = () => {
  const backToLogin = (e) => {
    e.preventDefault();
    // refresh page
    alert('Please check if it is the right fetch URL')
    window.location.reload();
  }
  return (
      <>
        <div className='login-title'>
            <h2>TypeError: Failed to fetch</h2>
            <button onClick={backToLogin}>Close</button>
        </div>
      </>
  )
};

export default Modal;
