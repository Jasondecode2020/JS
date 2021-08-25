import { React, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import Cookies from 'universal-cookie';
import { useHistory } from 'react-router-dom';
import { StoreContext } from '../StoreContext';
import defaultThumbnail from '../../defaultThumbnail.jpg';

const Quiz = ({ quiz }) => {
  const cookies = new Cookies();
  const token = cookies.get('user-token');
  const history = useHistory();
  const context = useContext(StoreContext);
  const { gameNum, setGameNum } = context.game;
  const [show, setShow] = useState(false);
  const [showStop, setShowStop] = useState(false);
  const handleClose = () => setShow(false);
  const handleCloseStop = () => setShowStop(false);
  const [isStarted, setIsStarted] = useState(false);
  const [sessionId, setSessionId] = useState(0);
  const [advanceDisable, setAdvanceDisable] = useState(true);

  const EditGame = () => {
    // click edit game goto the url edit game
    history.push(`/edit/${quiz.id}`);
  }

  const DeleteGame = () => {
    // add delete game function, only when refresh works like create game
    const deleteQuizzesUrl = `http://localhost:5005/admin/quiz/${quiz.id}`;
    fetch(deleteQuizzesUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      }
    }).then(res => res.json())
      .then(res => {
        alert('Game has been deleted')
        setGameNum(gameNum - 1);
      }).catch(err => alert(err));
  }

  function getSessionId () {
    const getQuizUrl = `http://localhost:5005/admin/quiz/${quiz.id}`
    return fetch(getQuizUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    }).then(res => res.json())
      .then(res => {
        res.id = quiz.id;
        return res.active;
      })
  }

  function startGame () {
    const requestUrl = `http://localhost:5005/admin/quiz/${quiz.id}/start`;
    fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      }
    }).then(res => res.json())
      .then(res => {
        console.log('game started.');
        getSessionId()
          .then(res => {
            setSessionId(res);
            console.log('session id:', res);
          })
      })
      .catch(err => alert(err));
  }

  /* advance game (go to next question) */
  function advanceGame () {
    const requestUrl = `http://localhost:5005/admin/quiz/${quiz.id}/advance`;
    fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    }).then(res => res.json())
      .then(res => {
        console.log(res);
      })
  }

  function stopGame () {
    const requestUrl = `http://localhost:5005/admin/quiz/${quiz.id}/end`;
    fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      }
    }).then(res => res.json())
      .then(res => {
        console.log('game stopped');
      })
      .catch(err => alert(err));
  }

  // handle Start or Stop Button
  function handleShow () {
    if (!isStarted) {
      // show [Copy Link] Pop Up
      startGame();
      setShow(true);
      setIsStarted(!isStarted);
      // set advance button available
      setAdvanceDisable(false);
    } else {
      stopGame();
      setIsStarted(false);
      // show [Result] Pop Up
      setShowStop(true);
      // set advance button available
      setAdvanceDisable(true);
    }
  }

  function copyLink () {
    const gameLink = `http://localhost:3000/joinGame/${quiz.id}/${sessionId}`;
    navigator.clipboard.writeText(gameLink);
    handleClose();
  }

  function displayResult () {
    // go to new route
    history.push(`/result/${quiz.id}/${sessionId}`)
  }

  // calculate total time of this quiz
  const totalTime = quiz.questions.reduce((total, currentValue) => total + currentValue.timing, 0);

  // change the button to stop when start and change it to start when stop
  const startStopButtonText = isStarted ? 'Stop' : 'Start';
  const startStopButtonColor = isStarted ? { backgroundColor: '#C82333' } : { backgroundColor: '#007BFF' }
  /* ----------------------------------------------------------------------
                                  HTML
  ------------------------------------------------------------------------ */
  return (
    <div className='quiz-box'>
      <div className="quiz-thumbnail-box">
        <img src={ defaultThumbnail } className="thumbnail" alt="default thumbnail" />
      </div>

      <div className="quiz-detail-box">
        <div className="quiz-title-box">
          {quiz.name}
        </div>

        <div>
          Question: {quiz.questions.length}
        </div>

        <div>
          Total Time: {totalTime}s
        </div>

        <div className='quiz-modify-box'>
          <Button className="quiz-modify-button" size="sm" onClick={ EditGame }>Edit</Button>
          <Button className="quiz-modify-button" variant="danger" size="sm" onClick={ DeleteGame }>Delete</Button>
        </div>

        <Button className="quiz-advance-button" onClick={advanceGame} disabled={advanceDisable}>Go To Next Question</Button>

        <Button className="quiz-start-button" size="lg" onClick={handleShow} style={startStopButtonColor}>{startStopButtonText}</Button>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Game Started</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Game ID: {quiz.id}
          <br />
          Session ID: {sessionId}
          <br />
          <p>To play this game, click Copy Link button to copy the game link to clipboard and go to that link.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={ copyLink }>Copy Link</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showStop}
        onHide={handleCloseStop}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Game Stopped</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Game ID: {quiz.id}
          <p>Would you like to view the results?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseStop}>
            Close
          </Button>
          <Button variant="primary" onClick={displayResult}>Yes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Quiz

Quiz.propTypes = {
  quiz: PropTypes.object,
}
