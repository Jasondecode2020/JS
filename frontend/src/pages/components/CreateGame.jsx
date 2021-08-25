import { React, useState, useContext } from 'react'
import Cookies from 'universal-cookie';
import { StoreContext } from '../StoreContext';

const CreateGame = () => {
  const [name, setName] = useState('');
  const cookies = new Cookies();
  const token = cookies.get('user-token');
  const context = useContext(StoreContext);
  const { gameNum, setGameNum } = context.game;
  function sendCreateGameRequest (gameName) {
    const requestUrl = 'http://localhost:5005/admin/quiz/new';
    const requestBody = {
      name: gameName,
    };

    fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(requestBody)
    }).then((res) => {
      if (res.status === 200) {
        res.json().then(res => {
          alert('Create game success!');
          // increase gameNum to trigger Dashboard reload(see useEffect in dashboard.jsx)
          setGameNum(gameNum + 1);
        })
      } else if (res.status === 403) {
        alert('Invalid Token! Please logout then login again.')
      } else if (res.status === 400) {
        alert('Invalid Input!')
      }
    }).catch((error) => {
      alert(error);
    });
  }

  function onSubmit (e) {
    e.preventDefault();
    if (!name) {
      alert('Please enter name of the game');
    } else {
      sendCreateGameRequest(name);
      setName('');
    }
  }
  return (
    <form className="create-game-box" onSubmit={onSubmit}>
      <div>
        <h6>Game Name: </h6>
        <br />
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Game Name" />
      </div>

      <input type="submit" value="Save Game" />
    </form>
  )
}

export default CreateGame
