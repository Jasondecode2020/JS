import { React, useState } from 'react'
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useParams, useHistory } from 'react-router-dom';
import Cookies from 'universal-cookie';

const Questions = ({ quiz, questions, question }) => {
  const cookies = new Cookies();
  const token = cookies.get('user-token');
  const history = useHistory(); // push edit question to another url
  const gameID = useParams().gameID; // need game ID first
  const questionID = question.id;
  const [questionContent, setQuestionContent] = useState(question.ask);
  const [answer1, setAnswer1] = useState(question.answers[0].answer);
  const [answer2, setAnswer2] = useState(question.answers[1].answer);
  const [answer3, setAnswer3] = useState(question.answers[2].answer);
  const [answer4, setAnswer4] = useState(question.answers[3].answer);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [deleteQuestionForm, setDeleteQuestionForm] = useState(true);
  const [showQuestionAterDelete, setShowQuestionAfterDelete] = useState(true);
  const [questionTypeOfQuiz, setQuestionTypeOfQuiz] = useState('');
  const [score, setScore] = useState(5);
  const [time, setTime] = useState(20);
  const [link, setLink] = useState('');
  const [imageUpload, setImageUpload] = useState(null);
  const editQuizQuestion = () => {
    setShowQuestionForm(true)
    history.push(`/edit/${gameID}/question/${questionID}`);
  }
  const deleteQuestion = (id) => {
    setDeleteQuestionForm(false);
    setShowQuestionForm(false);
    questions = (questions.filter((question) => question.id !== id));
    // quiz.questions = questions;
    const thumbnail = quiz.thumbnail;
    const quizName = quiz.name;
    console.log('questions', questions);
    const questionsUrl = `http://localhost:5005/admin/quiz/${gameID}`;
    const questionBody = {
      questions: questions,
      name: quizName,
      thumbnail: thumbnail
    };
    fetch(questionsUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify(questionBody)
    }).then(res => res.json())
      .then(res => {
        console.log('res', res);
        alert('Your question is deleted');
        setShowQuestionAfterDelete(false);
      })
  }
  // update all edit question
  const submitEditQuestions = () => {
    const question = questions.filter((question) => question.id === questionID)[0]; // TODO: fixed use filter
    console.log('question', question);
    question.question_type = questionTypeOfQuiz;
    question.ask = questionContent;
    question.score = score;
    question.timing = time;
    question.video_link = link;
    question.img_source = imageUpload;
    question.answers[0].answer = answer1;
    question.answers[1].answer = answer2;
    question.answers[2].answer = answer3;
    question.answers[3].answer = answer4;
    const thumbnail = quiz.thumbnail;
    const quizName = quiz.name;
    console.log('questions', questions);
    const questionsUrl = `http://localhost:5005/admin/quiz/${gameID}`;
    const questionBody = {
      questions: questions,
      name: quizName,
      thumbnail: thumbnail
    };
    fetch(questionsUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify(questionBody)
    }).then(res => res.json())
      .then(res => {
        console.log('res', res);
        alert('Your edited question is submitted')
      })
  };
  const setSingle = () => {
    setQuestionTypeOfQuiz('single');
  }
  const setMultiple = () => {
    setQuestionTypeOfQuiz('multiple');
  }
  const uploadYouTubeLink = (e) => {
    e.preventDefault();
    alert('YouTube link uploaded!');
  }
  const onChangeImage = (e) => {
    e.preventDefault();
    const file = new FileReader();
    file.readAsDataURL(e.target.files[0]);
    file.onloadend = () => {
      setImageUpload(file.result);
    }
  }
  const fileUploadHandler = (e) => {
    e.preventDefault();
    alert('Image uploaded success')
  }
  return (
    <div className='set-question'>
      {showQuestionAterDelete && (<div>
        <h3>{question.ask}</h3>
        <p>timing: {question.timing}</p>
        <h4>A {question.answers[0].answer}</h4>
        <h4>B {question.answers[1].answer}</h4>
        <h4>C {question.answers[2].answer}</h4>
        <h4>D {question.answers[3].answer}</h4>
      </div>)}
      {showQuestionForm && (<form className='add-form'>
        <div className='form-set'>
          <h4>Please select question type</h4>
          <label>Single Question
            <input type="radio" name="choice" id="single" value="single"
            onClick={setSingle} /></label><span> </span>
          <label>Multiple Question
            <input type="radio" name="choice" id="multiple" value="multiple"
            onClick={setMultiple} /></label>
        </div>
        <input className="form-control" type='text' placeholder={question.ask}
        value={ questionContent } onChange={(e) => setQuestionContent(e.target.value)} />
        <h5>score:</h5><input className="form-control" type='text' placeholder={question.score}
        onChange={(e) => setScore(e.target.value)} />
        <h5>time:</h5><input className="form-control" type='text' placeholder={question.timing}
        onChange={(e) => setTime(e.target.value)} />
        <h5>Upload image</h5>
        <input type='file' placeholder='upload image' onChange={onChangeImage}>
        </input><button onClick={fileUploadHandler}>uploadImage</button>
        <h5>YouTube link</h5>
        <input type='text' onChange={(e) => setLink(e.target.value)}>
        </input><button onClick={uploadYouTubeLink}>uploadLink</button><br />
        <h5>Please type your answers</h5>
        <input className="form-control" type='text' placeholder={question.answers[0].answer}
        value={ answer1 } onChange={(e) => setAnswer1(e.target.value)} />
        <input className="form-control" type='text' placeholder={question.answers[1].answer}
        value={ answer2 } onChange={(e) => setAnswer2(e.target.value)} />
        <input className="form-control" type='text' placeholder={question.answers[2].answer}
        value={ answer3 } onChange={(e) => setAnswer3(e.target.value)} />
        <input className="form-control" type='text' placeholder={question.answers[3].answer}
        value={ answer4 } onChange={(e) => setAnswer4(e.target.value)} />
      </form>)}
      {deleteQuestionForm && (<div>
        <Button className='my-btn' onClick={() => editQuizQuestion(question)}>Edit Questions</Button>
        <Button className='my-btn' onClick={() => deleteQuestion(question.id)}>Delete Questions</Button>
        <Button className='my-btn' onClick={submitEditQuestions}>Submit</Button><br />
      </div>)}
    </div>
  )
}

Questions.propTypes = {
  question: PropTypes.object,
  questions: PropTypes.array,
  quiz: PropTypes.object,
}

export default Questions
