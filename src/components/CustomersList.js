import React, { Component } from 'react';
import { Link } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import customers from '../services/customers-sample'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import '../App.css';

const linkFormatter = (cell, row) => {
  const profileLink = "/profile/" + row.customerID;
  return (
    <span>
      <Link to={profileLink}>Profile</Link>
    </span>
  );
}

const columns = [{
  dataField: 'name.full',
  text: 'name.full',
  sort: true,
  formatter: linkFormatter
}, {
  dataField: 'birthday',
  text: 'birthday',
  sort: true
}, {
  dataField: 'gender',
  text: 'gender',
  sort: true
}, {
  dataField: 'lastContact',
  text: 'lastContact',
  sort: true
}, {
  dataField: 'customerLifetimeValue',
  text: 'customerLifetimeValue'
}];

class CustomersList extends Component {
    componentDidMount () {
        this.setState({ customers });
    }

    render() {
      return (
        <div className="App">
          <p className="App-intro">
            <Link to="/profile/1">Profile</Link>
          </p>
          <BootstrapTable keyField='customerID' data={ customers } columns={ columns } />
        </div>
      );
    }
}

export default CustomersList;

