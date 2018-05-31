import React from 'react';
import PropTypes from 'prop-types';
import { Form, DatePicker, Button } from 'antd';
import moment from 'moment';
import writeUserData from './helpers'

const FormItem = Form.Item;

class UIDatePicker extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      date: props.date,
      fieldType: props.fieldType,
      fieldTypeText: props.fieldType === 'birthday' ? 'Birthday: ' : 'Last contact: ',
      firebaseID: props.firebaseID,
      name: props.name
    }
    this.handleEdit = this.handleEdit.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleEdit(e) {
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
      // formatting date value before submit.
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
    return (
      <div className="date-picker-component">
        <div className={"editable " + hiddenLabel} onClick={this.handleEdit}>
          {this.state.fieldTypeText} {this.state.date}
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
  date: PropTypes.string.isRequired
};

const ValidatedDatePicker = Form.create()(UIDatePicker);

export default ValidatedDatePicker;