import React from 'react'
import NavBar from './components/NavBar';
import { Container, Table, Button } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import Cookies from 'universal-cookie';

const GameResult = () => {
  // useParams().gameID get the gameID from url
  const cookies = new Cookies();
  const token = cookies.get('user-token');
  const history = useHistory();
  const gameId = useParams().gameID;
  const sessionId = useParams().sessionID;

  function getGameResult () {
    const requestUrl = `http://localhost:5005/admin/session/${sessionId}/results`;
    fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      }
    }).then(res => res.json())
      .then(res => {
        console.log(res);
      })
      .catch(err => alert(err));
  }

  return (
    <div className="main-container">
      <NavBar />
      <Container className="content">
        <Button onClick={ () => { history.push('/dashboard') } }>Return to Dashboard</Button>
        <div>
          Game ID: {gameId}
          <br />
          Session ID: {sessionId}
          <br />
          <h2>Not yet implement</h2>
          Top 5 Player:
        </div>
        <button onClick={getGameResult}>Test</button>
        {/* Top 5 Player */}
        <Table striped bordered hover className="top-five-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Mark</td>
              <td>Otto</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Jacob</td>
              <td>Thornton</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Jacob</td>
              <td>Thornton</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Jacob</td>
              <td>Thornton</td>
            </tr>
            <tr>
              <td>5</td>
              <td>Jacob</td>
              <td>Thornton</td>
            </tr>
          </tbody>
        </Table>
      </Container>
    </div>
  )
}

export default GameResult
