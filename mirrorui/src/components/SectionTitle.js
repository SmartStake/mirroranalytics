import React, { Component } from 'react';

import Tooltip from './Tooltip';
import "../charts/charts.css";

class SectionTitle extends Component {
  render() {
    return (
        <div className="chartHeader">
          <div className="chartTitle">{this.props.title}
            &nbsp;
            <div className="chartTooltip"><Tooltip tip={this.props.tip} /></div>
          </div>
        </div>
    );
  }
}

export default SectionTitle;
