import React from 'react'
import { Nav, Navbar, Container } from 'react-bootstrap';
import Cookies from 'universal-cookie';
import { ReactComponent as Logo } from '../../logo.svg';

const NavBar = () => {
  const cookies = new Cookies();
  const token = cookies.get('user-token');

  /** clear token cookie to log out */
  function logOut () {
    cookies.remove('user-token');
    const logoutUrl = 'http://localhost:5005/admin/auth/logout';

    fetch(logoutUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    }).then((res) => {
      if (res.status === 200) {
        alert('logout success!');
      } else {
        alert('ERROR: Invalid Input!');
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/dashboard"><Logo className="logo" />BigBrain</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            <Nav.Link href="/login" onClick={ logOut }>Log out</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar
