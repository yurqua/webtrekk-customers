import React, { Component } from 'react';
import firebase from '.././firebase.js';
import Loadable from 'react-loading-overlay'
import { Table, Progress, Row, Col } from 'antd';
import { Link } from "react-router-dom";
import '../App.css';

const customersColumns = [{
  title: 'Name',
  dataIndex: 'name.full',
  key: 'name.full',
  render: (text, record) => 
    <span className="person">
      <img src={"https://randomuser.me/api/portraits/med/" + record.fullGender + "/" + record.customerID + ".jpg"} 
        width='72' 
        height='72'
        alt={record.name.full} 
      />
      <Link to={"/profile/" + record.customerID}>{text}</Link>
    </span>,
  sorter: (a, b) => a.name.full.toLowerCase() > b.name.full.toLowerCase(),
  defaultSortOrder: 'ascend',
}, {
  title: 'Customer lifetime value',
  dataIndex: 'customerLifetimeValue',
  key: 'customerLifetimeValue',
  render: (text, record) => 
      <span>
        <div className="text-center">{record.customerLifetimeValue}</div>
        <Progress percent={ record.customerLifetimeValuePercent } size="small" showInfo={false} />
      </span>,
  sorter: (a, b) => a.customerLifetimeValue - b.customerLifetimeValue,
}, {
  title: 'Last contact',
  dataIndex: 'lastContact',
  key: 'lastContact',
  sorter: (a, b) => a.lastContact < b.lastContact,
}, {
  title: '	Birthday (>soon)',
  dataIndex: 'birthday',
  key: 'birthday',
  sorter: (a, b) => a.birthday < b.birthday,
}];

class CustomersList extends Component {
    constructor (props) {
      super(props);
      this.state = {
        isLoading: true,
        noDataLoaded: true,    
      };
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
            });
            customers.forEach((customer) => {
              customer.name.full = customer.name.first + ' ' + customer.name.last;
              customer.fullGender = customer.gender === "m" ? "men" : "women";
              customer.customerLifetimeValuePercent = customer.customerLifetimeValue * 100 / maxCustomerLifetimeValue
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
            <Row type="flex" justify="center">
              <Col xs={24} md={20} xl={18}>
                { this.state.isLoading ? '' 
                : this.state.noDataLoaded ? <h2 className="mt-3">The database is empty</h2> 
                : <Table 
                  columns={customersColumns} 
                  dataSource={this.state.customers} 
                  rowKey="customerID" />
                }              
              </Col>
            </Row>
          </Loadable>
        </div>
      );
    }
}

export default CustomersList;

