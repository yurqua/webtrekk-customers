import React, { Component } from 'react';
import logo from './webtrekk-logo.svg';
import Button from './components/Button'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Customers</h1>
        </header>
        <p className="App-intro">
          <Button />
        </p>
      </div>
    );
  }
}

export default App;
