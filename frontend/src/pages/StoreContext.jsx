import { React, createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const StoreContext = createContext(null);

export const StoreContextWrapper = ({ children }) => {
  /* This component acts as a wrapper
   * to wrap to children with StoreContext (see the following return statement),
   * which allows children can use the value stored.
   */
  const [token, setToken] = useState('');
  const [gameNum, setGameNum] = useState(0);

  /* Store global variables in here */
  const store = {
    tokens: { token, setToken },
    game: { gameNum, setGameNum },
  }

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  )
};

StoreContextWrapper.propTypes = {
  children: PropTypes.node,
}
