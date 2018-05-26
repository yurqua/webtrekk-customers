import React, { Component } from 'react';
import { Link } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import { Progress } from 'reactstrap';
import customers from '../services/customers-sample'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import '../App.css';

class CustomersList extends Component {
    constructor (props) {
      super(props);
      //this.linkFormatter=this.linkFormatter.bind(this);
      //this.customerLifetimeValueFormatter=this.customerLifetimeValueFormatter.bind(this);
      this.state = {
        columns: [{
          dataField: 'name.full',
          text: '',
          sort: true,
          formatter: this.linkFormatter
        }, {
          dataField: 'customerLifetimeValue',
          text: 'Customer lifetime value',
          sort: true,
          formatter: this.customerLifetimeValueFormatter,
        }, {
          dataField: 'lastContact',
          text: 'Last contact',
          sort: true
        }, {
          dataField: 'birthday',
          text: 'Birthday (>soon)',
          sort: true
        }]
      };
    }
    linkFormatter = (cell, row) => {
      const profileLink = "/profile/" + row.customerID;
      const gender = row.gender === "m" ? "men" : "women"
      const profileImageLink = "https://randomuser.me/api/portraits/med/" + gender + "/3" + row.customerID + ".jpg";
      return (
        <span className="person">
          <img src={profileImageLink} />
          <Link to={profileLink}>{row.name.full}</Link>
        </span>
      );
    }
      
    customerLifetimeValueFormatter = (cell, row) => {
      if (!this.state.maxCustomerLifetimeValue) return;
      const percentage = row.customerLifetimeValue * 100 / this.state.maxCustomerLifetimeValue;
      console.log(percentage);
      return (
        <span>
          <div className="text-center">{row.customerLifetimeValue}</div>
          <Progress value={ percentage } />
        </span>
      );
    }
      
    componentDidMount () {
      let maxCustomerLifetimeValue = 0;
      customers.forEach((customer) => {
        maxCustomerLifetimeValue = maxCustomerLifetimeValue < customer.customerLifetimeValue ? customer.customerLifetimeValue : maxCustomerLifetimeValue;
      });
      this.setState({ customers, maxCustomerLifetimeValue });
        console.log(maxCustomerLifetimeValue);
    }

    render() {
      return (
        <div className="App">
          <BootstrapTable keyField='customerID' data={ customers } columns={ this.state.columns } bordered={ false } />
        </div>
      );
    }
}

export default CustomersList;

