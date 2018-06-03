import React from 'react';
import PropTypes from 'prop-types';
import { Form, DatePicker, Button } from 'antd';
import TimeAgo from 'react-timeago'
import moment from 'moment';
import writeUserData from './helpers'

//As a general note to this component, it would be nice to have a kind of 'Just contacted' button that would set the 'Last contact date' value to the current moment. Seems the expected user workflow would benefit from this
//Also, it would make sense to keep history of such events 
class UIDatePicker extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      date: props.date,
      fieldType: props.fieldType,
      //Figuring out a suitable label for the control
      fieldTypeText: props.fieldType === 'birthday' ? 'Birthday: ' : 'Last contact: ',
      firebaseID: props.firebaseID,
      name: props.name
    }
    this.handleEdit = this.handleEdit.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleEdit(e) {
    //before starting with editing let's backup the previous state so it can be restored on 'Cancel' button tap
    e.preventDefault();
    this.setState({
      prevValue: this.state.date, 
      isEditing: true
    });
  }

  handleSave = function (e) {
    e.preventDefault();
    let date = null;
    this.props.form.validateFields(function (err, fieldsValue, self) {
      if (err) {
        return;
      }
      // formatting date value before submitting it to Firebase
      const values = {
        ...fieldsValue,
        'date-picker': fieldsValue['date-picker'].format('YYYY-MM-DD'),
      };
      date = values['date-picker'];
    });
    writeUserData(this.state.fieldType, date, this.state.firebaseID, this.state.name);
    this.setState({
      date: date,
      isEditing: false
    });
  }

  handleCancel(e) {
    e.preventDefault();
    this.setState({
      date: this.state.prevValue,
      isEditing: false
    });
  }

  render() {
    const hiddenForm = this.state.isEditing ? '' : 'hidden';
    const hiddenLabel = this.state.isEditing ? 'hidden' : '';
    const { getFieldDecorator } = this.props.form;
    const config = {
      rules: [{ type: 'object', required: true, message: 'Please select date!' }],
      initialValue: moment(this.state.date, 'YYYY-MM-DD')
    };
    //Unlike birthday date, the 'Last contact date' is easier to read when it's provided in the '...time ago' format
    const dateRender = this.state.fieldType === 'lastContact' ? (
      <TimeAgo date={this.state.date} />
    ) : (
      <span>
        {this.state.date}
      </span>
    );
    return (
      <div className="date-picker-component">
        <div className={"editable " + hiddenLabel} onClick={this.handleEdit}>
          {this.state.fieldTypeText} {dateRender}
        </div>
        <Form className={"date-form " + hiddenForm}>
          <span>
            {getFieldDecorator('date-picker', config)(
              <DatePicker />
            )}
          </span>
          <span>
            <span className="buttons">                    
              <Button onClick={this.handleSave} icon="check-circle" type="primary" size="large">Update</Button>
              <Button onClick={this.handleCancel} icon="close-circle-o" size="large">Cancel</Button>
            </span>
          </span>
        </Form>
      </div>
    );
  }
}

UIDatePicker.propTypes = {
  date: PropTypes.string.isRequired,
  fieldType: PropTypes.string.isRequired,
  firebaseID: PropTypes.string.isRequired,
  name: PropTypes.object.isRequired
};

// Ant validation mechanism requires a wrapper for the validated form elements
const ValidatedDatePicker = Form.create()(UIDatePicker);

export default ValidatedDatePicker;