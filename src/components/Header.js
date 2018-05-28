import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Row, Col } from 'antd';
import logo from './webtrekk-logo.svg';
import '../App.css';

class Header extends Component {
  render() {
    return (
      <div className="App">
        <Row type="flex" justify="center">
          <Col xs={24} md={20} xl={18}>
              <header className="App-header">
                  <Link to='/' >
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Customers</h1>
                  </Link>
              </header>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Header;

