import React, { Component } from 'react';

import SPUtilities from "../util/SPUtilities";
import UIUtils from "../util/UIUtils";
import NetworkSwitch from './NetworkSwitch';

class PageHeader extends Component {
  render() {
    return (
        <div className="subHeader">
          <p/>
          <p className="headerRow">
              <span className="headerTitle">{this.props.title}</span>
              {this.getNetworkSwitch()}
          </p>
          {SPUtilities.getLastUpdated(this.props.thisObj, false, false)}
          {UIUtils.getNotification(this.props.thisObj.state.notification)}
        </div>
    );
  }

  getNetworkSwitch() {
    let statType = this.props.statType;
    // console.log("in PageHeader.getNetworkSwitch: ", statType);
    if (statType && statType != null && statType.length > 0) {
        return (
          <div className="headerActions">
            <NetworkSwitch statType={statType} handleNetworkChange={this.props.handleNetworkChange} />
          </div>
        )
    }
    
    return "";
  }
}

export default PageHeader;
