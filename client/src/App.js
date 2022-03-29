import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
import PrivateRoute from './Utils/PrivateRoute';
import PublicRoute from './Utils/PublicRoute';
import axios from 'axios';

import Login from './components/login/login';
import Dashboard from './components/Dashboard/Dashboard';
import { getToken, removeUserSession, setUserSession } from './Utils/Common';


function App() {

  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if(!token){
      return;
    }

    axios.get(`http://localhost:3001/verifyToken?token=${token}`).then(response => {
      setUserSession(response.data.token, response.data.user);
      setAuthLoading(false);
    }).catch(error => {
      removeUserSession();
      setAuthLoading(false);
    });
  }, []);

  if(authLoading && getToken()){
    return <div className='content'>Checking Authentication...</div>
  }
  return (
    <div className = "App">
      <BrowserRouter>
        <div>
          <div className='header'>
            <NavLink exact activeClassName='active' to="/login">Login</NavLink>
            <NavLink exact activeClassName='active' to="/dashboard">Dashboard</NavLink>
          </div>
          <div className='content'>
            <Switch>
              <PublicRoute exact path="/login" component={Login} />
              <PrivateRoute exact path='/dashboard' component={Dashboard} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
