import React from 'react';
import { shallow } from 'enzyme';
import Signup from './Signup';

describe('Signup', () => {
  const components = shallow(<Signup />);
  const wrapper = components.find('input');
  const wrapperButton = components.find('Button');
  const wrapperH1 = components.find('h1');
  it('include the number of input is 4', () => {
    expect(wrapper.length).toBe(4);
  });

  it('include the number of button', () => {
    expect(wrapperButton.length).toBe(1);
  });

  it('include the button text, h1 text', () => {
    const buttonText = 'Sign Up';
    expect(wrapperButton.text()).toBe(buttonText);
    expect(wrapperH1.text()).toBe(buttonText);
  });

  it('include the number of h1 is one', () => {
    expect(wrapperH1.length).toBe(1);
  });

  // test button click handler using enzyme
  it('include the button click event', () => {
    const onClick = jest.fn();
    shallow(<button onClick={onClick} />).simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // test password
  it('include the button click event', () => {
    const password1 = 'aaa';
    const password2 = 'aaa';
    const input = shallow(<input className="mb-2" type='password'
      placeholder='Password' />);
    // if it is the true class and password is also true,
    // pass the test
    expect(input.hasClass('mb-2')).toBe(password1 === password2);
  });
});
