import React, { Component } from 'react';
import { Link } from "react-router-dom";

class Profile extends Component {
    constructor(props) {
      super(props);
      this.state = {
        id: props.match.params.id
      };
    }
    
    render() {
      const id = this.state.id;

      return (
        <div>
          <p>
            Profile of {id}
          </p>
          <Link to="/">Home</Link>
        </div>
    );
}
}

export default Profile;

