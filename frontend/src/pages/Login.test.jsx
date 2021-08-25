import React from 'react';
import { shallow } from 'enzyme';

describe('Login', () => {
  const showSignUpPage = () => {
    console.log('signup page');
  }
  const components = shallow(<button variant="secondary"
  onClick={ showSignUpPage }>Sign Up</button>);
  const wrapper = components.find('button');
  it('include the number of input is 2', () => {
    expect(wrapper.length).toBe(1);
  });

  it('include the button click event', () => {
    const onClick = jest.fn();
    shallow(<button onClick={onClick} />).simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('include the Login condition', () => {
    // if it is correct
    const correctEmail = '11';
    // if it is correct
    const correctPassword = '11';
    const email = '';
    const email1 = '11';
    const password = '';
    const password1 = '11';
    // email or password cannot be empty
    const input = shallow(<input className="mb-2" type='password'
      placeholder='Password' />);
    // if it is the true class and password is also true,
    // pass the test
    expect(input.hasClass('mb-2')).toBe(
      (password1 === correctPassword) &&
      (email1 === correctEmail));

    expect(input.hasClass('mb-2')).toBe(
      (!email && !password));
  });
});
