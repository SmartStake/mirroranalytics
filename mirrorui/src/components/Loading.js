import React, { Component } from 'react';
import Spinner from 'react-bootstrap/Spinner';

import "./Loading.css";

class Loading extends Component {
  render() {
    return (<div className="loading">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }
}

export default Loading;
