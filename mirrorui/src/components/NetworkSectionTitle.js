import React, { Component } from 'react';
import MirrorUtils from '../mirror/MirrorUtils';
import Tooltip from './Tooltip';

import "../styles/section.css";

class NetworkSectionTitle extends Component {
  render() {
    return (
        <div className="sectionHeader">
          <div className="sectionTitle">{this.props.title}
            &nbsp;
            <span> {MirrorUtils.getNetwork(this, true)} </span>
            <div className="sectionTooltip"><Tooltip tip={this.props.tip} /></div>
          </div>
        </div>
    );
  }

}

export default NetworkSectionTitle;
