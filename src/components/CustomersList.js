import React, { Component } from 'react';
import { Link } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import { Progress } from 'reactstrap';
import firebase from '.././firebase.js';
import Loadable from 'react-loading-overlay'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import '../App.css';

class CustomersList extends Component {
    constructor (props) {
      super(props);
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
          text: 'Last contact (Log contact now or earlier, otherwise validation)',
          sort: true
        }, {
          dataField: 'birthday',
          text: 'Birthday (>soon)',
          sort: true
        }],
        isLoading: true,
        noDataLoaded: true
      };
    }
    linkFormatter = (cell, row) => {
      const profileLink = "/profile/" + row.customerID;
      const gender = row.gender === "m" ? "men" : "women"
      const profileImageLink = "https://randomuser.me/api/portraits/med/" + gender + "/" + row.customerID + ".jpg";
      const fullName = row.name.full;
      return (
        <span className="person">
          <img src={profileImageLink} alt={fullName} width='72' height='72' />
          <Link to={profileLink}>{row.name.full}</Link>
        </span>
      );
    }
      
    customerLifetimeValueFormatter = (cell, row) => {
      if (!this.state.maxCustomerLifetimeValue) return;
      const percentage = row.customerLifetimeValue * 100 / this.state.maxCustomerLifetimeValue;
      return (
        <span>
          <div className="text-center">{row.customerLifetimeValue}</div>
          <Progress value={ percentage } />
        </span>
      );
    }
      
    componentDidMount () {
      this.customersRef = firebase.database().ref('customers');
      try {
        this.customersRef.on('value', (snapshot) => {
          let customers = snapshot.val();
          if (customers) {
            let maxCustomerLifetimeValue = 0;
            customers = Object.values(customers); //fix Firebases array to object transform
            customers.forEach((customer) => {
              maxCustomerLifetimeValue = maxCustomerLifetimeValue < customer.customerLifetimeValue ? customer.customerLifetimeValue : maxCustomerLifetimeValue;
              customer.name.full = customer.name.first + ' ' + customer.name.last;
            });
            this.setState({ customers, maxCustomerLifetimeValue, 'isLoading': false,'noDataLoaded': false });
          } else {
            this.setState({ 'isLoading': false });
          }
        });
      } catch (e) {
        console.log(e);
      }
    }

    componentWillUnmount() {
      this.customersRef.off();
    } 

    render() {
      return (
        <div className="App">
          <Loadable
            active={this.state.isLoading}
            spinner
            background = 'none'
            color = 'black'
            >
            { this.state.isLoading ? '' 
            : this.state.noDataLoaded ? <h2 className="mt-3">The database is empty</h2> 
            : <BootstrapTable 
                  keyField="customerID"
                  data={ this.state.customers }
                  columns={ this.state.columns }
                  bordered={ false } 
              />}
          </Loadable>
        </div>
      );
    }
}

export default CustomersList;

