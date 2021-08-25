import { React, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Cookies from 'universal-cookie';
import ShowQuestions from './ShowQuestions';
import ShowAddQuestion from './ShowAddQuestion';
import NavBar from './NavBar';
import { Container, Button } from 'react-bootstrap';

const EditQuiz = () => { // FIXME: when fresh, the page cannot goto dashboard
  const [questionList, setQuestionList] = useState([]);
  const [questionText, setQuestionText] = useState('No questions to show');
  const [quiz, setQuiz] = useState({});
  const [addQuestion, setAddQuestion] = useState(false);
  const [textAddQuestion, setTextAddQuestion] = useState('Add Questions');
  const gameID = useParams().gameID;
  const cookies = new Cookies();
  const token = cookies.get('user-token');
  const history = useHistory();
  const questionsUrl = `http://localhost:5005/admin/quiz/${gameID}`;
  const fetchQuestions = () => {
    fetch(questionsUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    }).then(res => res.json())
      .then(res => {
        setQuestionList(res.questions);
        setQuiz(res);
      })
  };
  // if question is not changed, fetch only once
  useEffect(() => {
    fetchQuestions();
  }, []);
  const addQuestionToQuiz = (e) => {
    if (textAddQuestion === 'Add Questions') {
      e.preventDefault();
      setAddQuestion(true);
      setQuestionText('');
      setTextAddQuestion('Back to Dashboard')
    } else {
      history.push('/dashboard');
    }
  }
  return (
    <div className="main-container">
      <NavBar />
      <Container className="content">
        <Button onClick={ () => { history.push('/dashboard') } }>Return to Dashboard</Button>
        {questionList.length > 0 ? <ShowQuestions quiz={quiz} questions={questionList} /> : (<h2>{questionText}</h2>)}
        {addQuestion ? (<ShowAddQuestion quiz={quiz} questions={questionList} />) : null}
        <button className='my-btn' onClick={addQuestionToQuiz}>{textAddQuestion}</button><span></span>
      </Container>
    </div>
  )
}

export default EditQuiz;
