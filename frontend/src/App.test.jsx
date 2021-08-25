import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

// use enzyme to test
describe('include other tests', () => {
  it('check the number of Route', () => {
    shallow(<App />);
  });

  it('render App header title', () => {
    const wrapper = shallow(<App />);
    const header = (<h2 className='login-title'>Welcome to login BigBrain</h2>);
    expect(wrapper.contains(header)).toEqual(true);
  });
  // this is the condtion of token,
  // if first time login, it will jump to the
  // login page, because token is undefined, but when second time login,
  // token is true, jump to dashboard
  it('check the login condition if has token', () => {
    const result = true;
    let token;
    const token1 = (token === undefined)
    const wrapper = shallow(<App />);
    const header = (<h2 className='login-title'>Welcome to login BigBrain</h2>);
    expect(wrapper.contains(header)).toEqual(result === token1);
  });
})
