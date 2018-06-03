import React from 'react';
import PropTypes from 'prop-types';
import writeUserData from './helpers'
import { Radio } from 'antd';

class GenderSwitch extends React.Component {
    constructor (props) {
        super (props);
        this.state = {
          gender: props.gender,
          firebaseID: props.firebaseID,
          name: props.name
        }
        this.handleGenderChange = this.handleGenderChange.bind(this);
    }

    handleGenderChange(e) {
        writeUserData('gender', e.target.value, this.state.firebaseID, this.state.name);
    }   
      
    render() {
        const RadioButton = Radio.Button;
        const RadioGroup = Radio.Group;      
        return (
            <div>
                <RadioGroup onChange={this.handleGenderChange} defaultValue={this.state.gender}>
                    <RadioButton value="w">Woman</RadioButton>
                    <RadioButton value="m">Man</RadioButton>
                    <RadioButton value="o">Other</RadioButton>
                </RadioGroup>
            </div>
        )
    }
}

GenderSwitch.propTypes = {
    gender: PropTypes.string.isRequired,
    firebaseID: PropTypes.string.isRequired,
    name: PropTypes.object.isRequired,
};

export default GenderSwitch;
