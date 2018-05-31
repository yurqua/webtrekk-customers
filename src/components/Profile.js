import Loadable from 'react-loading-overlay'
import React, { Component } from 'react';
import { Row, Col, Form, DatePicker, Input, Button, Radio, Icon, notification } from 'antd';
import ValidatedDatePicker from './DatePicker'
import firebase from '.././firebase.js';
import { Link } from "react-router-dom";

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
        isEditingNames: false
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleNameChange = this.handleNameChange.bind(this);
      this.handleLastChange = this.handleLastChange.bind(this);
      this.handleEditNames = this.handleEditNames.bind(this);
      this.handleCancelSaveNames = this.handleCancelSaveNames.bind(this);
      this.handleSaveNames = this.handleSaveNames.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleGenderChange = this.handleGenderChange.bind(this);
    }

    handleNameChange(e) {
      this.setState({
        name: {
          first: e.target.value,
          last: e.target.form[1].defaultValue
        }
      });
    }
   
    handleLastChange(e) {
      this.setState({
        name: {
          first: e.target.form[0].defaultValue,
          last: e.target.value
        }
      });
    }
    
    handleChange(e) {
      this.setState({
        [e.target.name]: e.target.value
      });
    }
    
    writeUserData(key, value) {
      let self = this;
      firebase.database().ref('customers/' + this.state.firebaseID).update({
        [key]: value
      }, function(error) {
        if (error) {
          const description = 'Failed to update ' + self.state.name.first + ' ' + self.state.name.last + ' details. ' + error;
          notification['error']({
            message: 'Error',
            description: description,
          });
        } else {
          const description = self.state.name.first + ' ' + self.state.name.last + ' details were successfully updated.';
          notification['success']({
            message: 'Success',
            description: description,
          });
        }
      });
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

    handleEditNames(e) {
      e.preventDefault();
      this.setState({
        prevName: {
          first: this.state.name.first,
          last: this.state.name.last
        }, 
        isEditingNames: true
      });
    }

    handleSaveNames(e) {
      e.preventDefault();
      this.writeUserData('name', {first: e.target.form[0].value, last: e.target.form[1].value});
      this.setState({
        isEditingNames: false
      });
    }

    handleCancelSaveNames(e) {
      e.preventDefault();
      this.setState({
        name: this.state.prevName,
        isEditingNames: false
      });
    }

    handleGenderChange(e) {
      const sexDictionary = [
        {'Woman': 'w'},
        {'Man': 'm'},
        {'Other': 'o'}
      ];
      console.log(`radio checked:${e.target.value}`);
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
      const isLoading = this.state.isLoading;
      const fullName = this.state.name.first + ' ' + this.state.name.last;
      const customerID = this.state.customerID;
      const gender = this.state.gender;
      //use dictionary instead:
      const genderURL = this.state.gender === "m" ? "men" : "women"
      const avatar = 'https://randomuser.me/api/portraits/' + genderURL + '/' + customerID + '.jpg';
      const hiddenCustomerDetails = isLoading ? 'invisible' : '';
      const hiddenNamesForm = this.state.isEditingNames ? '' : 'hidden';
      const hiddenNamesLabel = this.state.isEditingNames ? 'hidden' : '';
      const RadioButton = Radio.Button;
      const RadioGroup = Radio.Group;

      return (
        <div>
          <Loadable
            active={isLoading}
            spinner
            background = 'none'
            color = 'black'
            >
            <Row type="flex" justify="center" className="customer-profile">
              <Col xs={24} md={20} xl={18}>
                <img src={avatar} alt={fullName} className={'avatar ' + (isLoading ? 'invisible' : '')} width='172' height='172' />
                <span className={hiddenCustomerDetails}>
                  <div className="customer-lifetime-value">
                    <div>
                      <span className="value">{this.state.customerLifetimeValue}</span>
                    </div>
                    <span class="label">Customer lifetime value</span>
                  </div>
                  <h2 className={"editable " + hiddenNamesLabel} onClick={this.handleEditNames}>
                    {fullName}
                  </h2>
                  <form className={"names-form " + hiddenNamesForm}>
                    <span>                    
                      <Input value={this.state.name.first} placeholder="Name" onChange={this.handleNameChange} size="large" />
                      <Input value={this.state.name.last} placeholder="Last name" onChange={this.handleLastChange} size="large" />
                    </span>
                    <span className="buttons">                    
                      <Button onClick={this.handleSaveNames} icon="check-circle" type="primary" size="large">Update</Button>
                      <Button onClick={this.handleCancelSaveNames} icon="close-circle-o" size="large">Cancel</Button>
                    </span>
                  </form>
                  <hr />

                  {renderDatePicker.call(this)}

                  <RadioGroup onChange={this.handleGenderChange} defaultValue={gender}>
                    <RadioButton value="w">Woman</RadioButton>
                    <RadioButton value="m">Man</RadioButton>
                    <RadioButton value="o">Other</RadioButton>
                  </RadioGroup>






                  <form onSubmit={this.handleSubmit} className={hiddenCustomerDetails}>

                    <input type="text" name="birthday" value={this.state.birthday} placeholder="Birthday" onChange={this.handleChange} />
                    <input type="text" name="gender" value={this.state.gender} placeholder="Gender" onChange={this.handleChange} />
                    <input type="text" name="lastContact" value={this.state.lastContact} placeholder="Last contact" onChange={this.handleChange} />
                    <input type="text" name="customerLifetimeValue" value={this.state.customerLifetimeValue} placeholder="Lifetime value" onChange={this.handleChange} />
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

