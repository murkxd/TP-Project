import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Sell from './components/Sell';
import Search from './components/Search';
import Profile from './components/Profile';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/sell" component={Sell} />
        <Route path="/search" component={Search} />
        <Route path="/profile" component={Profile} />
      </Switch>
    </Router>
  );
}

export default App;
