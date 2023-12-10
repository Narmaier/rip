import React,{useState} from "react";
import Login from './login';
import MainPage from './Main';
import Chat from "./chat";
import { BrowserRouter, Route,Routes} from 'react-router-dom';
const App = () => {
  const [isLogged, SetIsLogged] = useState(window.localStorage.getItem('token') !== "");
  const handleLogOut = () =>{
    SetIsLogged(false)
  };
  const handleLogin = () =>{
    SetIsLogged(true)
  };
  return (<div>
    {(isLogged)? (
      <BrowserRouter>
        <Routes>
          <Route path="" element={<MainPage LogOut={handleLogOut}/>}></Route>
          <Route path="/chat" element={<Chat/>}></Route>
        </Routes>
      </BrowserRouter>
      ): 
    (<Login LogIn={handleLogin}/>)}
  </div>)
};

export default App;