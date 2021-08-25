import { React, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const QuestionCard = ({ question }) => {
  const playerID = useParams().playerID;
  const [answerList, setAnswerList] = useState([]);

  function handleCheck (e, id) {
    const isChecked = e.target.checked;
    const answer = answerList;

    if (isChecked) {
      answer.push(id);
    } else {
      const index = answer.indexOf(id);
      if (index > -1) answer.splice(index, 1);
    }
    setAnswerList(answerList);
  }

  function submitAnswer () {
    const requestUrl = `http://localhost:5005/play/${playerID}/answer`;
    const answerBody = { answerIds: answerList };
    console.log(answerBody);
    fetch(requestUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(answerBody)
    }).then(res => {
      if (res.status === 200) {
        alert('Answer submit success.')
      } else {
        res.json().then(res => alert(res.error))
      }
    }).catch(err => {
      console.log(err);
    });
  }

  return (
    <div className="question-box">
      <div className="question-ask">
        {question.ask}
      </div>

      {question.answers.map((answer, index) => {
        return (
          <div key={index} className="answer-option">
            <input type="checkbox" id={'answer-' + index.toString} className="answer-checkbox"
            onChange={e => handleCheck(e, index)}/>
            <label htmlFor={index} className="answer-text">{answer.answer}</label><br />
          </div>
        )
      })}
      <Button className="answer-submit-button" onClick={submitAnswer}>Submit</Button>
    </div>
  )
}

export default QuestionCard

QuestionCard.propTypes = {
  question: PropTypes.object,
}
