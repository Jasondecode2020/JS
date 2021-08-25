import React from 'react';
import { shallow } from 'enzyme';
import { render, screen } from '@testing-library/react';
import Modal from './Modal';

// To run: 'yarn test' or 'npm run test'
// Testing text error using testing library
// testing button function and other text using enzyme
test('Modal text test', () => {
  render(<Modal />);
  const errorElement = screen.getByText(/TypeError: Failed to fetch/i);
  expect(errorElement).toBeInTheDocument();
});

// testing button text using testing library
test('Modal  test button', () => {
  render(<Modal />);
  const buttonElement = screen.getByText(/Close/i);
  expect(buttonElement).toBeInTheDocument();
});

describe('Modal testing div', () => {
  const components = shallow(<Modal />);
  const wrapper = components.find('div');
  const wrapperButton = components.find('button');
  const wrapperH2 = components.find('h2');
  it('include the number of div is one', () => {
    expect(wrapper.length).toBe(1);
  });
  // number of buttons
  it('include the number of button is one', () => {
    expect(wrapperButton.length).toBe(1);
  });
  // number of h2
  it('include the number of h2 is one', () => {
    expect(wrapperH2.length).toBe(1);
  });
  // test button click handler using enzyme
  it('include the button click event', () => {
    const backToLogin = () => {
      console.log('button');
    }
    const wrapper = shallow(<button onClick={backToLogin}>Close</button>)
    wrapper.find('button').simulate('click');
  });
});
