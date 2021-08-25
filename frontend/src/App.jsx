import { React } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { StoreContextWrapper } from './pages/StoreContext';
import { Login } from './pages/Login';
import SignUp from './pages/Signup';
import Dashboard from './pages/Dashboard'
import Cookies from 'universal-cookie';
import EditQuiz from './pages/components/QuizEdit';
import EditQuestion from './pages/components/EditQuestion';
import GameResult from './pages/GameResult';
import JoinGame from './pages/JoinGame';
import PlayGame from './pages/PlayGame';

function App () {
  // cookie is used to implement stay logged in while refresh page
  const cookies = new Cookies();
  const token = cookies.get('user-token');
  const isLoggedIn = !(token === undefined);
  console.log('logged in:', isLoggedIn);
  console.log(token);
  // set title of website
  document.title = 'BigBrain';
  return (
    <Router>
      <div className="global-setting">
        {/* {!isLoggedIn && <Redirect to='/login' />} */}
        <StoreContextWrapper>
          <Switch>
              <Route exact path='/' component={Login} />
              <Route path='/login' component={Login} />
              <Route path='/signup' component={SignUp} />
              <Route path='/dashboard' component={Dashboard} />
              <Route path='/edit/:gameID' component={EditQuiz}/>
              <Route path='/edit/:gameID/question/:questionID' component={EditQuestion}/>
              <Route path='/result/:gameID/:sessionID' component={GameResult}/>
              <Route path='/joinGame/:gameID/:sessionID' component={JoinGame}/>
              <Route path='/playGame/:gameID/:playerID' component={PlayGame}/>
              <Redirect to='/dashboard' />
          </Switch>
        </StoreContextWrapper>
      </div>
    </Router>
  );
}

export default App;
