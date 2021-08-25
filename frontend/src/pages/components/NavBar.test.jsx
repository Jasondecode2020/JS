import React from 'react';
import { shallow } from 'enzyme';
import NavBar from './NavBar';
import { Nav } from 'react-bootstrap';
import renderer from 'react-test-renderer';

describe('NavBar', () => {
  const components = shallow(<NavBar />);
  const wrapper = components.find('Logo');
  it('include the length of input is 0', () => {
    expect(wrapper.length).toBe(0);
  });

  it('include the text, BigBrain', () => {
    const NavText = 'BigBrainTo be addedLog out';
    expect(components.text()).toBe(NavText);
  });

  // test button click handler using enzyme
  it('include the button click event', () => {
    const onClick = jest.fn();
    shallow(<button onClick={onClick} />).simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // test link
  it('include the Nav.Link text', () => {
    const NavLinkText = 'To be added';
    const newWrapper = shallow(<Nav.Link href='#features'>To be added</Nav.Link>)
    expect(newWrapper.text()).toBe(NavLinkText);
  });

  // snapshot
  it('renders with minimal props', () => {
    const logout = () => {
      console.log('check logout');
    }
    const button = renderer.create(<Nav.Link href='/login' onClick={ logout }>Log out</Nav.Link>).toJSON();
    expect(button).toMatchSnapshot();
  })
});
