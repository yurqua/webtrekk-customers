import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Row, Col } from 'antd';
import logo from './webtrekk-logo.svg';
import '../App.css';

function homeLink () {
  const logoHeader = (      
    <span>
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">Customers</h1>
    </span>
  );
  if (this.state.url === '/') return (
    {logoHeader}
  ) 
  else return (
    <Link to='/' >
      {logoHeader}
    </Link>
  )
} 

class Header extends Component {
  constructor (props) {
    super (props);
    this.state ({
      url: props.match.params.id //or whatever?
    });
  }
  render() {
    return (
      <div className="App">
        <Row type="flex" justify="center">
          <Col xs={24} md={20} xl={18}>
              <header className="App-header">
                {homeLink}
              </header>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Header;

