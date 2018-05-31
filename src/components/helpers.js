import React from 'react';
import { notification } from 'antd';
import firebase from '.././firebase.js';

export default function writeUserData(key, value, firebaseID , name) {
    firebase.database().ref('customers/' + firebaseID).update({
      [key]: value
    }, function(error) {
      if (error) {
        const description = 'Failed to update ' + name.first + ' ' + name.last + ' details. ' + error;
        notification['error']({
          message: 'Error',
          description: description,
        });
      } else {
        const description = name.first + ' ' + name.last + ' details were successfully updated.';
        notification['success']({
          message: 'Success',
          description: description,
        });
      }
    });
  }
