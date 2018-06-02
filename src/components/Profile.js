import Loadable from 'react-loading-overlay'
import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
import Avatar from './Avatar';
import FullName from './FullName';
import ValidatedDatePicker from './DatePicker';
import GenderSwitch from './GenderSwitch'
import firebase from '.././firebase.js';
import { Link } from "react-router-dom";

function renderFullName() {
  if (this.state.name.first) {
      return (
        <div>
          <FullName firstName={this.state.name.first} lastName={this.state.name.last} firebaseID={this.state.firebaseID} />
        </div>
      )
  }
  return;
}

function renderDatePicker() {
  if (this.state.birthday) {
      return (
        <div>
          <ValidatedDatePicker date={this.state.birthday} fieldType="birthday" firebaseID={this.state.firebaseID} name={this.state.name} />
          <ValidatedDatePicker date={this.state.lastContact} fieldType="lastContact" firebaseID={this.state.firebaseID} name={this.state.name} />
        </div>
      )
  }
  return;
}

function renderGenderSwitch() {
  if (this.state.gender) {
      return (
        <div>
          <GenderSwitch gender={this.state.gender} firebaseID={this.state.firebaseID} name={this.state.name} />
        </div>
      )
  }
  return;
}

class Profile extends Component {
    constructor(props) {
      super(props);
      this.state = {
        customerID: props.match.params.id,
        name: {
            first: '',
            last: ''
        },
        birthday: '',
        gender: '',
        lastContact: '',
        customerLifetimeValue: '',
        isLoading: true,
      };
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
      e.preventDefault();
      const customersRef = firebase.database().ref('customers');
      const customer = {
        customerID: +this.state.maxID +1,
        name: {
            first: this.state.name.first,
            last: this.state.name.last,
        },
        birthday: this.state.birthday,
        gender: this.state.gender,
        lastContact: this.state.lastContact,
        customerLifetimeValue: this.state.customerLifetimeValue
      }
      customersRef.push(customer);
    }

    removeCustomer(firebaseID) {
      this.setState({ 'isLoading': true });
      const customerRef = firebase.database().ref(`/customers/${firebaseID}`);
      customerRef.remove();
      window.location = '/';
    }

    componentDidMount() {
      this.customersRef = firebase.database().ref('customers');
      try { 
        this.customersRef.on('value', (snapshot) => {
          let customers = snapshot.val();
          let currentCustomerID = this.state.customerID;
          let maxID = 0;
          let currentCustomer = {};
          for (let customer in customers) {
            if (customers.hasOwnProperty(customer)) {
                if (customers[customer].customerID === +currentCustomerID) {
                  currentCustomer = customers[customer];
                  currentCustomer.firebaseID = customer;
                } 
                maxID = customer.customerID > maxID ? customer.customerID : maxID;
            }
          }
          currentCustomer.isLoading = false;
          currentCustomer.maxID = maxID;
          this.setState(currentCustomer);
        });
      } catch (e) {
        console.log(e);
      }
    }

    componentWillUnmount() {
      this.customersRef.off();
    } 

    render() {
      const hiddenCustomerDetails = this.state.isLoading ? 'invisible' : '';

      return (
        <div>
          <Loadable
            active={this.state.isLoading}
            spinner
            background = 'none'
            color = 'black'
          >
            <Row type="flex" justify="center" className="customer-profile">
              <Col xs={24} md={20} xl={18}>
                <Avatar 
                  customerID={+this.state.customerID} 
                  gender={this.state.gender}
                  size="big"
                  isLoading={this.state.isLoading}
                />
                <span className={hiddenCustomerDetails}>
                  <div className={'customer-lifetime-value ' + hiddenCustomerDetails}>
                    <div>
                      <span className="value">{this.state.customerLifetimeValue}</span>
                    </div>
                    <span className="label">Customer lifetime value</span>
                  </div>
                  <hr />

                  {renderFullName.call(this)}
                  {renderDatePicker.call(this)}
                  {renderGenderSwitch.call(this)}

                  <hr />

                  <form onSubmit={this.handleSubmit} className={hiddenCustomerDetails}>
                    <Button icon="check-circle" type="primary" size="large">Add profile</Button>
                  </form>

                  <p className={hiddenCustomerDetails}>
                    <Button onClick={() => this.removeCustomer(this.state.firebaseID)} type="danger" size="large">Remove this profile</Button>
                  </p>
                  
                  <Link to="/">Home</Link>
                </span>
              </Col>
            </Row>
          </Loadable>
        </div>
    );
  }
}

export default Profile;

