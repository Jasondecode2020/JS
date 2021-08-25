import React from 'react';
import Quiz from './Quiz';
import PropTypes from 'prop-types';

const Quizzes = ({ quizzes }) => {
  return (
    <div className="all-quiz-box">
      {
        quizzes.map((quiz, index) => (
          <Quiz quiz={quiz} key={index} />
        ))
      }
    </div>
  )
}

export default Quizzes

Quizzes.propTypes = {
  quizzes: PropTypes.array,
}
