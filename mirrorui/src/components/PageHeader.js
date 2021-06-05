import React, { Component } from 'react';

import UIUtils from "../util/UIUtils";
import NetworkSwitch from './NetworkSwitch';

class PageHeader extends Component {
  // {/* {SPUtilities.getLastUpdated(this.props.thisObj, false, false)} */}

  render() {
    return (
        <div className="subHeader">
            <div className="subHeader__group">
              {this.getNetworkSwitch()}
            </div>
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
