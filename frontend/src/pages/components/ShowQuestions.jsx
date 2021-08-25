import { React } from 'react';
import Questions from './Questions';
import PropTypes from 'prop-types';

const ShowQuestions = ({ quiz, questions }) => {
  return (
    <>
      {questions.map((question, index) => (
        <Questions quiz={quiz} questions={questions} question={question} key={index} />
      ))
      }
    </>
  )
}

ShowQuestions.propTypes = {
  questions: PropTypes.array,
  quiz: PropTypes.object,
}

export default ShowQuestions
