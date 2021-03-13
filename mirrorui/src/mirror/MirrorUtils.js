import React from 'react';
import constants from '../constants';

import "../styles/MirrorUtils.css";

class MirrorUtils extends React.Component {
    static getNetwork(thisObj, inline) {
        // console.log(inline + " - stat.getNetwork: ", thisObj.props.statType);
        if (thisObj.props.statType != constants.STAT_TYPE_COMBINE) {
            // console.log("inside if block: ", thisObj.props.statType);
            let label = "";
            if (thisObj.props.statType === constants.STAT_TYPE_TERRA)  {
                label = "Terra";
            } else if (thisObj.props.statType === constants.STAT_TYPE_ETH)  {
                label = "ETH";
            }
            // console.log("initial label: " , label);

            if (thisObj.props.isOverallOnly && thisObj.props.isOverallOnly === true) {
            label = "Overall";
            }

            // console.log("final label: " , label);
            if (inline === true) {
                return (
                    <span className="statValueNetwork">
                        {label}
                    </span>
                )
            } else {
                return (
                    <p className="statValueNetwork">
                        {label}
                    </p>
                )
            }
        }

        // console.log("returning empty");
        return "";
    }
    
}

export default MirrorUtils;
