import React from 'react';
import constants from '../constants';

import "../styles/MirrorUtils.css";

class MirrorUtils extends React.Component {
    static getNetwork(thisObj, inline) {
        if (!thisObj.props.statType) {
            return "";
        }
        
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
 
    
    static getTicker(thisObj) {
        let ticker = null;
    
        if (thisObj.props.match) {
            ticker = thisObj.props.match.params.ticker;
        }
    
        if (!ticker && thisObj.props.ticker) {
            ticker = thisObj.props.ticker;
        }
    
        return ticker;
    }

    static formatTicker(cell, row) {
        if(!cell) return "";

        return (<a className="white-a" href={"/asset/" + cell}
        >{cell}</a>);
    }

    static addIndexAndSymol(data, favAttr) {
        if (!data) {
            return data;
        }

        for (let i = 0, tableDataLen = data.length; i < tableDataLen; i++) {
            data[i]["index"] = i + 1;
            data[i]["logo"] = MirrorUtils.getLogoName(data[i]["symbol"]);
            data[i]["fav"] = data[i][favAttr];
        }

        return data;
    }

    static getLogoName(symbol) {
        if (symbol.startsWith("m")) {
            return symbol.substring(1);
        }

        return symbol;
    }
    
}

export default MirrorUtils;
