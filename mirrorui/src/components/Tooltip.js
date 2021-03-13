import React, { Component } from 'react';
import InfoIcon from '@material-ui/icons/Info';

class Tooltip extends Component {
  render() {
    return (
        <span data-for="main" data-tip={this.props.tip} data-iscapture="true">
            <InfoIcon className="mInfoIcon" fontSize="small" />
        </span>
    );
  }
}

export default Tooltip;
