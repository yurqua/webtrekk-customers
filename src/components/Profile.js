import Loadable from 'react-loading-overlay'
import React, { Component } from 'react';
import { Row, Col, Button, notification } from 'antd';
import Avatar from './Avatar';
import FullName from './FullName';
import ValidatedDatePicker from './DatePicker';
import GenderSwitch from './GenderSwitch'
import firebase from '.././firebase.js';

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
      this.handleDuplicate = this.handleDuplicate.bind(this);
    }

    handleDuplicate(self) {
      //until a separate 'New customer' page is developed this serves as a stub
      //the actual pattern is copying the existing customer profile into a new record
      const customersRef = firebase.database().ref('customers');
      const customer = {
        customerID: +self.state.maxID +1,
        name: {
            first: self.state.name.first,
            last: self.state.name.last,
        },
        birthday: self.state.birthday,
        gender: self.state.gender,
        lastContact: self.state.lastContact,
        customerLifetimeValue: self.state.customerLifetimeValue
      }
      customersRef.push(customer, function(error) {
        if (error) {
          const description = 'Failed to duplicate this profile. ' + error;
          notification['error']({
            message: 'Error',
            description: description,
          });
        } else {
          const description = 'Profile was successfully duplicated.';
          notification['success']({
            message: 'Success',
            description: description,
          });
          window.location = '/';
        }
      });
    }

    removeCustomer(firebaseID) {
      //a place to implement either classic confirmation UX pattern or, which is even better, a post-confirmation pattern where the user gets immediate result of its action but is able to undo it immedeately after
      this.setState({ 'isLoading': true });
      const customerRef = firebase.database().ref(`/customers/${firebaseID}`);
      customerRef.remove();
      window.location = '/';
    }

    componentDidMount() {
      this.customersRef = firebase.database().ref('customers');
      try { 
        this.customersRef.on('value', (snapshot) => {
          //the profile page requires not only the specific profile itself but also a way to get the maximum existing ID. while there is no separate 'New customer' page it comes handy when adding a new record
          //switching to native Firebase IDs instead would eliminate the need in getting the full list of customers
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
                maxID = customers[customer].customerID > maxID ? customers[customer].customerID : maxID;
            }
          }
          currentCustomer.isLoading = false;
          currentCustomer.maxID = maxID;
          this.setState(currentCustomer);
        });
      } catch (e) {
        //naturally the user deserves to see a more friendly communication than just a console message here
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
                <Row type="flex">
                  <Col xs={24} md={{ span: 8, offset: 3 }} xl={{ span: 4, offset: 4 }}>
                    <Avatar 
                      customerID={+this.state.customerID} 
                      gender={this.state.gender}
                      size="big"
                      isLoading={this.state.isLoading}
                    />
                    {/*Customer lifetime value seems to be a value calulated somewhere on the backend, so it's not editable within this component*/}
                    <div className={'customer-lifetime-value ' + hiddenCustomerDetails}>
                      <div>
                        <span className="value">{this.state.customerLifetimeValue}</span>
                      </div>
                      <span className="label">Customer lifetime value</span>
                    </div>
                  </Col>
                  <Col xs={24} md={12} xl={{ span: 14, offset: 1 }}>
                    <span className={'personal-details ' + hiddenCustomerDetails}>
                      {renderFullName.call(this)}
                      {renderDatePicker.call(this)}
                      {renderGenderSwitch.call(this)}
                      <span className={'admin-button ' + hiddenCustomerDetails}>
                        <span 
                          className="delete-button"
                          onClick={() => this.removeCustomer(this.state.firebaseID)} 
                        >
                          [Delete profile]
                        </span>
                        <span 
                          className="duplicate-button"
                          onClick={() => this.handleDuplicate(this)} 
                        >
                          [Duplicate profile]
                        </span>
                      </span>
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
            <br />
            <br />
          </Loadable>
        </div>
    );
  }
}

export default Profile;