import React, { Component } from 'react';
import firebase from '.././firebase.js';
import Loadable from 'react-loading-overlay'
import { Link } from "react-router-dom";

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
        isActive: true
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleNameChange = this.handleNameChange.bind(this);
      this.handleLastChange = this.handleLastChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
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

    componentDidMount() {
      this.customersRef = firebase.database().ref('customers');
      this.customersRef.on('value', (snapshot) => {
        let customers = snapshot.val();
        let currentCustomerID = this.state.customerID;
        let maxID = 0;
        let currentCustomer = null;
        customers = Object.values(customers); //fix Firebases array to object transform        
        customers.forEach(function (customer) {
          if (customer.customerID === +currentCustomerID) currentCustomer = customer;
          maxID = customer.customerID > maxID ? customer.customerID : maxID;
        });
        currentCustomer.isActive = false;
        currentCustomer.maxID = maxID;
        this.setState(currentCustomer);
      });
    }

    componentWillUnmount() {
      this.customersRef.off();
    } 

    render() {
      const fullName = this.state.name.first + ' ' + this.state.name.last;
      const customerID = this.state.customerID;
      const gender = this.state.gender === "m" ? "men" : "women"
      const avatar = 'https://randomuser.me/api/portraits/' + gender + '/3' + customerID + '.jpg';
      const isActive = this.state.isActive;
      return (
        <div>
          <Loadable
            active={isActive}
            spinner
            background = 'none'
            color = 'black'
            >
            <img src={avatar} alt={fullName} width='128' height='128' />
            <p>
              Profile of {fullName}
            </p>
            <form onSubmit={this.handleSubmit}>
              <input type="text" name="first" value={this.state.name.first} placeholder="" onChange={this.handleNameChange} />
              <input type="text" name="last" value={this.state.name.last} placeholder="" onChange={this.handleLastChange} />
              <input type="text" name="birthday" value={this.state.birthday} placeholder="" onChange={this.handleChange} />
              <input type="text" name="gender" value={this.state.gender} placeholder="" onChange={this.handleChange} />
              <input type="text" name="lastContact" value={this.state.lastContact} placeholder="" onChange={this.handleChange} />
              <input type="text" name="customerLifetimeValue" value={this.state.customerLifetimeValue} placeholder="" onChange={this.handleChange} />
              <button>Update</button>
            </form>
            <Link to="/">Home</Link>
          </Loadable>
        </div>
    );
  }
}

export default Profile;

