import { React, useState } from 'react'
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const ShowAddQuestion = ({ quiz, questions }) => {
  const gameID = useParams().gameID; // need game ID first
  const questionType = { // this is only an example for easily access the edit question
    id: '',
    ask: 'What the largest mammal?',
    timing: 10,
    answers: [
      {
        id: '1',
        answer: 'Elephant1',
        isCorrect: false
      },
      {
        id: '2',
        answer: 'Blue Whale',
        isCorrect: true
      },
      {
        id: '3',
        answer: 'people',
        isCorrect: false
      },
      {
        id: '4',
        answer: 'tiger',
        isCorrect: false
      }
    ]
  }
  const cookies = new Cookies();
  const token = cookies.get('user-token');
  const [questionContent, setQuestionContent] = useState(questionType.ask); // ask a question
  const [answer1, setAnswer1] = useState(questionType.answers[0].answer);
  const [answer2, setAnswer2] = useState(questionType.answers[1].answer);
  const [answer3, setAnswer3] = useState(questionType.answers[2].answer);
  const [answer4, setAnswer4] = useState(questionType.answers[3].answer);
  const [questionTypeOfQuiz, setQuestionTypeOfQuiz] = useState('');
  const [score, setScore] = useState(5);
  const [time, setTime] = useState(20);
  const [link, setLink] = useState('');
  const [imageUpload, setImageUpload] = useState(null);
  const id = Math.floor(Math.random() * 10000) + 1;
  console.log(quiz, questions);
  const submitEditQuestions = (e) => { // update all edit question
    e.preventDefault();
    questionType.id = id;
    questionType.question_type = questionTypeOfQuiz;
    questionType.ask = questionContent;
    questionType.score = score;
    questionType.timing = time;
    questionType.video_link = link;
    questionType.img_source = imageUpload;
    questionType.answers[0].answer = answer1;
    questionType.answers[1].answer = answer2;
    questionType.answers[2].answer = answer3;
    questionType.answers[3].answer = answer4;
    questionType.timing = time;
    const thumbnail = quiz.thumbnail;
    const quizName = quiz.name;
    questions.push(questionType);
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
        alert('Your edit question is submitted')
      })
  };
  const deleteQuestion = ({ id, e }) => {
    e.preventDefault();
    questions = (questions.filter((question) => question.id !== id));
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
      })
  }
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
    <div className="add-question-box">
      {<form className='add-form'>
        <h3>You can also edit question here below</h3>
        <div className='form-set'>
          <h4>Please select question type</h4>
          <label>Single Question
            <input type="radio" name="choice" id="single" value="single"
            onClick={setSingle} /></label><span> </span>
          <label>Multiple Question
            <input type="radio" name="choice" id="multiple" value="multiple"
            onClick={setMultiple} /></label>
        </div>
        <input className="form-control" id="add-question-input" type='text' placeholder='ask a question'
        value={ questionContent } onChange={(e) => setQuestionContent(e.target.value)} />
        <h5>score:</h5>
        <input className="form-control" id="add-question-input" type='text' placeholder={questionType.score}
        onChange={(e) => setScore(e.target.value)} />
        <h5>time:</h5>
        <input className="form-control" id="add-question-input" type='text' placeholder={questionType.timing}
        onChange={(e) => setTime(e.target.value)} />
        <h5>Upload image</h5>
        <input type='file' placeholder='upload image' onChange={onChangeImage}>
        </input><Button onClick={fileUploadHandler}>uploadImage</Button>
        <h5>YouTube link</h5>
        <input type='text' className="form-control" id="add-question-input" onChange={(e) => setLink(e.target.value)}>
        </input><Button onClick={uploadYouTubeLink}>uploadLink</Button><br />
        <h5>Please type your answers</h5>
        <input className="form-control" id="add-question-input" type='text' placeholder={questionType.answers[0].answer}
        value={ answer1 } onChange={(e) => setAnswer1(e.target.value)} />
        <input className="form-control" id="add-question-input" type='text' placeholder={questionType.answers[1].answer}
        value={ answer2 } onChange={(e) => setAnswer2(e.target.value)} />
        <input className="form-control" id="add-question-input" type='text' placeholder={questionType.answers[2].answer}
        value={ answer3 } onChange={(e) => setAnswer3(e.target.value)} />
        <input className="form-control" id="add-question-input" type='text' placeholder={questionType.answers[3].answer}
        value={ answer4 } onChange={(e) => setAnswer4(e.target.value)} />
        <Button className='my-btn' onClick={() => deleteQuestion(id)}>Delete Questions</Button>
        <Button className='my-btn' onClick={submitEditQuestions}>Submit</Button><br />
      </form>}
    </div>
  )
}
ShowAddQuestion.propTypes = {
  questions: PropTypes.array,
  quiz: PropTypes.object,
}

export default ShowAddQuestion
