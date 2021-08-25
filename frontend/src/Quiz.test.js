import { shallow } from 'enzyme';
import React from 'react';
import Quiz from './pages/components/Quiz';
import { Button } from 'react-bootstrap';

describe('Quiz', () => {
  let wrapper;
  let quizQuestions;

  // set up quiz before each test
  beforeEach(() => {
    quizQuestions = [{
      id: '1',
      question_type: 'single',
      score: 20,
      ask: 'What is the largest mammal?',
      timing: 10,
      img_source: '',
      video_source: '',
      answers: [
        {
          id: '1',
          answer: 'Elephant',
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
    }];

    const quiz = {
      id: 123456,
      name: 'Animal',
      questions: quizQuestions,
    };

    const contextValues = { game: { gameNum: 1, setGameNum: () => {} } };

    jest.spyOn(React, 'useContext').mockImplementation(() => contextValues);
    // const context = contextValues;
    // <Quiz quiz /> has only quiz props
    wrapper = shallow(<Quiz quiz={quiz} />);
  });

  it('display correct quiz name', () => {
    expect(wrapper.find('.quiz-detail-box').childAt(0).text()).toEqual('Animal');
  })

  it('display correct number of question', () => {
    expect(wrapper.find('.quiz-detail-box').childAt(1).text()).toEqual('Question: 1');
  })

  it('display correct quiz total time', () => {
    expect(wrapper.find('.quiz-detail-box').childAt(2).text()).toEqual('Total Time: 10s');
  })

  it('trigger onClick event handler when clicked', () => {
    const onClick = jest.fn();
    shallow(<Button onClick={onClick} />).simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  })
})
