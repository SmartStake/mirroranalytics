import React, { Component } from 'react';

import "./Stat.css";
import Tooltip from './Tooltip';
import MirrorUtils from '../mirror/MirrorUtils';
import RespUtils from '../util/RespUtils';

class Stat extends Component {

  render() {
    if (this.props.link) {
      return (
        <div className="stat">
            <div className="statTitle">
              <div className="statLabel"><span class="textLabel"> {this.getLabel()} </span>  <div className="statLabelTip"><Tooltip tip={this.props.info}/></div> </div>
            </div>
            <p className="statValue">
              <a className="animLink" href={this.props.link} target={this.props.target}>{this.getValue()}</a>
            </p>
        </div>
      );
    }
    
    return (
        <div className="stat">
            <div className="statTitle">
              <div className="statLabel"><span class="textLabel"> {this.getLabel()} </span> <div className="statLabelTip"><Tooltip tip={this.props.info}/></div> </div>
              <div class="network">
              {MirrorUtils.getNetwork(this, false)}
              </div>
            </div>
            <p className="statValue">{this.getValue()}</p>
        </div>
    );
  }

  getLabel() {
    // console.log("in get label for: ", this.props.label);
    let label = this.props.label;
    if (RespUtils.isMobileView()) {
      // console.log("in mobile view label for: ", this.props.labelShort);
      if (this.props.labelShort) {
        // console.log("returning short label");
        return this.props.labelShort;
      }
      
      return label;
    } else {
      return label;
    }
  }

  getValue() {
    let value = this.props.value;
    if (RespUtils.isMobileView()) {
      if (this.props.valueShort) {
        return this.props.valueShort;
      }
      
      return value;
    } else {
      return value;
    }
  }
  
}

export default Stat;
