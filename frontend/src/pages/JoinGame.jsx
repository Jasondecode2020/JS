import { React, useState } from 'react'
import { Container, Button } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';

const JoinGame = () => {
  const gameId = useParams().gameID;
  const sessionId = useParams().sessionID;
  const [name, setName] = useState('');
  const [sessionID, setSessionID] = useState(sessionId);
  const history = useHistory();

  const playJoin = (e) => {
    e.preventDefault();
    if (name === '') {
      alert('Please enter your user name.')
    } else {
      const joinUrl = `http://localhost:5005/play/join/${sessionId}`;
      fetch(joinUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name })
      }).then(res => res.json())
        .then(res => {
          alert('You can play game now.')
          history.push(`/playGame/${gameId}/${res.playerId}`);
          console.log('player id:', res.playerId);
        }).catch(error => alert(error));
    }
  }

  return (
    <div className="main-container">
      <Container className="content">
        <form className='join-game-input-form' onSubmit={playJoin}>
          <h2>Join Game Now!</h2>
          <p>
            Please enter your user name to play this game.
          </p>

          <label>User Name:</label>
          <input type='text' onChange={(e) => setName(e.target.value)} />

          <b>Session ID is set by default. If you wanna play current game, no change required. </b>

          <label>Session ID:</label>
          <input type='text' onChange={(e) => setSessionID(e.target.value)} value={sessionID}/>
          <br />
          <Button type='submit' className="join-game-submit">Join Game</Button>
        </form>
      </Container>
    </div>
  )
}

export default JoinGame
