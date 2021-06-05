import React, { Component } from 'react';

import SPUtilities from "../util/SPUtilities";

class LastUpdated extends Component {
  render() {
    return (
        <div>
            {SPUtilities.getLastUpdated(this.props.thisObj, false, false)}
        </div>
    );
  }
}

export default LastUpdated;
