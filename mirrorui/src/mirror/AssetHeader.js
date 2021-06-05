import React, { Component } from 'react';

import UIUtils from "../util/UIUtils";
import "../components/PageHeader.css";
import LogoUtils from '../util/LogoUtils';
import MirrorUtils from './MirrorUtils';

class AssetHeader extends Component {
  // {/* {SPUtilities.getLastUpdated(this.props.thisObj, false, false)} */}

  render() {
    return (
        <div className="subHeader">
            <div className="subHeader__group">
              <div className="pageTitle">{LogoUtils.summaryLogoFormatter(MirrorUtils.getLogoName(this.props.asset.symbol), this.props.asset.symbol)}
                {this.props.asset.name} - {this.props.pageType}</div>
            </div>
            {this.props.notification != false && UIUtils.getNotification(this.props.thisObj.state.notification)}
        </div>
    );
  }

}

export default AssetHeader;
