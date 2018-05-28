import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from './components/Header';
import CustomersList from './components/CustomersList';
import Profile from './components/Profile';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/" component={Header}/>
          <Route exact path="/" component={CustomersList}/>
          <Route path="/profile/:id" component={Profile}/>
        </div>
      </Router>
    );
  }
}

export default App;
