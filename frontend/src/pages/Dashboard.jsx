import { React, useState, useEffect, useContext } from 'react';
import { Button, Container, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Quizzes from './components/Quizzes';
import CreateGame from './components/CreateGame';
import { StoreContext } from './StoreContext';
import Cookies from 'universal-cookie';
import NavBar from './components/NavBar';

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [showCreateGame, setShowCreateGame] = useState(false);
  const context = useContext(StoreContext);
  const { gameNum, setGameNum } = context.game;
  const cookies = new Cookies();
  const token = cookies.get('user-token');
  const history = useHistory();

  if (!token) {
    history.push('/login');
  }

  /**  get detailed information of a quiz */
  function getQuizById (quizId) {
    const getQuizUrl = `http://localhost:5005/admin/quiz/${quizId}`
    return fetch(getQuizUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    }).then(res => res.json())
      .then(res => {
        res.id = quizId;
        return res;
      })
  }

  /** get all quizzes then get detailed information of all quizzes */
  function getQuizzes () {
    const getQuizzesUrl = 'http://localhost:5005/admin/quiz'
    fetch(getQuizzesUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      }
    }).then(res => res.json())
      .then(res => {
        const quizzes = res.quizzes;

        if (quizzes) {
          setGameNum(quizzes.length);
          Promise.all(
            quizzes.map(quiz => getQuizById(quiz.id))
          ).then(quizzesDetail => setQuizzes(quizzesDetail))
        }
      })
  }

  /**
   * useEffect to enable get quizzes only when gameNum is changed
   * as the parameter [gameNum] indicates
   */
  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      getQuizzes();
    }
    // FIXME: BUG: when reload the page at Dashboard pop up warning
    // used to stop memory leaking
    // ref: https://stackoverflow.com/questions/58038008/how-to-stop-memory-leak-in-useeffect-hook-react
    return () => { unmounted = true };
  }, [gameNum])

  const textCreateGame = showCreateGame ? 'Close' : 'Create New Game';
  const createGameStyle = showCreateGame ? { backgroundColor: '#5A6268' } : { backgroundColor: '#007BFF' }
  return (
    <div className="main-container">
      <NavBar />
      <Container className="content">
        <Col lg={12}>
          <h1>Hello, Welcome to BigBrain</h1>
          <Button className='create-quiz-button'
            onClick={() => setShowCreateGame(!showCreateGame)} style={createGameStyle}>{textCreateGame}</Button>
          {showCreateGame && <CreateGame />}
          <br />
          {quizzes.length > 0 ? (<Quizzes quizzes={ quizzes } />) : ('There is no quiz')}
        </Col>
      </Container>
    </div>
  )
}

export default Dashboard
