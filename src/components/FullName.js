import React from 'react';
import PropTypes from 'prop-types';
import writeUserData from './helpers'
import { Input, Button } from 'antd';

class FullName extends React.Component {
    constructor (props) {
        super (props);
        this.state = {
          firstName: props.firstName,
          lastName: props.lastName,
          firebaseID: props.firebaseID,
          //inline editing UX pattern requires its own property in the state
          isEditingNames: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleEditNames = this.handleEditNames.bind(this);
        this.handleCancelSaveNames = this.handleCancelSaveNames.bind(this);
        this.handleSaveNames = this.handleSaveNames.bind(this);  
    }
    
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
        
    handleEditNames(e) {
        e.preventDefault();
        this.setState({
            //before starting with editing, let's backup the previous state so it can be restored on 'Cancel' button tap
            prevName: {
                first: this.state.firstName,
                last: this.state.lastName
            }, 
            isEditingNames: true
        });
    }
    
    handleCancelSaveNames(e) {
        e.preventDefault();
        this.setState({
            name: this.state.prevName,
            isEditingNames: false
        });
    }

    handleSaveNames(e) {
        e.preventDefault();
        writeUserData(
            'name',
            {first: this.state.firstName, last: this.state.lastName},
            this.state.firebaseID,
            {first: this.state.firstName, last: this.state.lastName}
        );
        this.setState({
            isEditingNames: false
        });
    }
    
    render() {
        const hiddenNamesForm = this.state.isEditingNames ? '' : 'hidden';
        const hiddenNamesLabel = this.state.isEditingNames ? 'hidden' : '';
        const fullName = this.state.firstName + ' ' + this.state.lastName;
        return (
            <div>
                <h2 className={"editable " + hiddenNamesLabel} onClick={this.handleEditNames}>
                    {fullName}
                </h2>
                <form className={"names-form " + hiddenNamesForm}>
                    <span>                    
                        <Input name="firstName" value={this.state.firstName} placeholder="Name" onChange={this.handleChange} size="large" />
                        <Input name="lastName" value={this.state.lastName} placeholder="Last name" onChange={this.handleChange} size="large" />
                    </span>
                    <span className="buttons">                    
                        <Button onClick={this.handleSaveNames} icon="check-circle" type="primary" size="large">Update</Button>
                        <Button onClick={this.handleCancelSaveNames} icon="close-circle-o" size="large">Cancel</Button>
                    </span>
                </form>
            </div>
        )
    }
}

FullName.propTypes = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    firebaseID: PropTypes.string.isRequired,
};
  
export default FullName;