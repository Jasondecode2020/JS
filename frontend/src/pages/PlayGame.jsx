import { React } from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import QuestionCard from './components/QuestionCard';

const PlayGame = () => {
  const playerID = useParams().playerID;

  let question;

  function getQuestion () {
    const requestUrl = `http://localhost:5005/play/${playerID}/question`;
    return fetch(requestUrl)
      .then(res => res.json())
      .catch((err) => {
        console.log(err);
      });
  }

  // FIXME: question is not assigned
  setInterval(() => {
    getQuestion().then(res => {
      question = res.question;
    })
  }, 1000);

  return (
    <div className="main-container">
      <Container className="content">
        <h2>Hello! Welcome to Play BigBrain Game!</h2>
        <h3>Not yet implement</h3>
        {question ? (<QuestionCard question={question}/>) : ('No question available now.')}
      </Container>
    </div>
  )
}

export default PlayGame
