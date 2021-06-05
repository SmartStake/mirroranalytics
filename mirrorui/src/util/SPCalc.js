import React from 'react';
import numeral from 'numeral';
import constants from '../constants';

import RespUtils from './RespUtils';
import SPUtilities from './SPUtilities';

class SPCalc extends React.Component {
  static getStakeWeight(poolStake, totalStake) {
    // console.info("getStakeWeight - ", poolStake, totalStake);
    if (totalStake == undefined || totalStake == 0) {
      return "";
    }

    if (poolStake == undefined || poolStake == 0) {
      return 0;
    }

    return (poolStake * 100 /totalStake).toFixed(3) + "%";
  }

  static getFreeCapacity(totalStake, selfStake) {
    if (selfStake == undefined || selfStake == 0) {
      return "";
    }

    return ((selfStake * 100 - totalStake)/selfStake).toFixed(2) + "%";
  }

  static calcWeight(cell, row, rowIndex, formatExtraData) {
    return SPCalc.getStakeWeight(cell, formatExtraData);
    // (cell * 100/formatExtraData).toFixed(2) + "%";
  }

  static getTotal(data, key, precisionInd) {
    let totalAmount = 0;
    for (let i = 0, tableDataLen = data.length; i < tableDataLen; i++) {
      if (!isNaN(data[i][key])) {
        totalAmount += parseFloat(data[i][key]);
      }
    }

    if (precisionInd) {
      totalAmount = totalAmount.toFixed(2);
    }

    return totalAmount;
  }

  static formatCoinCount(count) {
    if (count == undefined || count < 1000) {
      return count;
    }

    return numeral(count).format('0[.]0000');
    // return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  static calcNetARR(commission, avgBlockIndex, coinStat) {
    if (commission == undefined || avgBlockIndex == undefined || coinStat == undefined) {
      return "";
    }

    let fee = commission;
    let rewardRate = coinStat.currentRewardRate;
    let feeFactor = (100 - fee) / 100;
    // console.log("fee :", fee, ", rewardRate: ", rewardRate, ", feeFactor: ", feeFactor);

    let performanceFactor = avgBlockIndex/100;
    let netArr = coinStat.currentRewardRate * feeFactor * performanceFactor;
    // console.log("performanceFactor :", performanceFactor, ", netArr: ", netArr);

    return netArr.toFixed(2);
  }

  static calcNetARRCell(cell, row, rowIndex, formatExtraData) {
    return SPCalc.calcNetARR(cell, row.avgBlockIndex, formatExtraData);
  }

  static multiplyAndFormat(value1, value2, precision) {
    return (value1 * value2).toFixed(precision);
  }

  static calcTotalUSD(cell, row, rowIndex, formatExtraData) {
    if (!cell) {
      return cell;
    }

    if (!formatExtraData.state.coinStat.usdPrice) {
      return "N/A";
    }
    let value = cell * parseFloat(formatExtraData.state.coinStat.usdPrice);
    return "$" + value.toFixed(0);
  }

  static calcTotalBTC(cell, row, rowIndex, formatExtraData) {
    if (!cell) {
      return cell;
    }

    if (!formatExtraData.state.coinStat.btcPrice) {
      return "N/A";
    }
    let value = cell * parseFloat(formatExtraData.state.coinStat.btcPrice);
    return String.fromCharCode(8383) + value.toFixed(4);
  }

  static getFee(fee, feeChange) {
    // console.log(fee + " - " + feeChange);
    if (feeChange) {
      return (<span style={{"backgroundColor": "orange"}}>{feeChange}</span>);
    }

    return fee;
  }

  static calcPendingRewards(cell, row) {
    if (!cell || !row.stake) {
      return 0;
    }
    return (cell * row.stake / row.totalStake).toFixed(2);
  }

  static formatCoinSmall(cell, row) {
    if (!cell) {
      return cell;
    }
    return cell.toFixed(2);
  }

  static formatElapsedTime(cell, row) {
    if (!cell) {
      return "";
    }

    if (cell < 5) {
      return RespUtils.isMobileView() ? "Few mins":"Few minutes";
    } else if (cell < 60) {
      let unit = RespUtils.isMobileView() ? "min":"minute";
      return SPCalc.getDesc(cell, unit);
    } else if (cell < 1440) {
      let unit = RespUtils.isMobileView() ? "hr":"hour";
      return SPCalc.getDesc(cell, unit, 60);
    }

    return SPCalc.getDesc(cell, "day", 1440);
  }

  static getDesc(cell, type, roundFactor) {
    let value = cell;
    if (roundFactor) {
      value = Math.round(cell/roundFactor);
    }

    if (value == 1) {
      return value + " " + type;
    }

    return value + " " + type + "s";
  }

  static formatIntCount(count) {
    if (!count) {
      return count;
    }

    return count.toFixed(0);
  }

  static formatBigCoinCount(count) {
    if (window.innerWidth < constants.MEDIUM) {
      return SPUtilities.stakeFormatterRounded(count);
    } else {
      return SPCalc.formatCoinCount(count);
    }
  }

  static formatTimeLeft(seconds) {
    if (!seconds) {
      return "";
    }

    if (seconds < 60) {
      return "Soon";
    } else if (seconds < 3600) {
      let unit = RespUtils.isMobileView() ? "min":"minute";
      return SPCalc.getDesc(seconds, unit, 60);
    }

    let days = parseInt(seconds / 86400);
    let dayLabel = "d ";
    // let dayLabel = days > 1 ? " days " : " day ";

    let remTime = seconds % 86400;
    let hours = parseInt(remTime / 3600);
    let hourLabel = "h ";
    // let hourLabel = hours > 1 ? " hours " : " hour ";

    remTime = remTime % 3600;
    let minutes = parseInt(remTime / 60);
    let minuteLabel = "m ";
    // let minuteLabel = minutes > 1 ? " minutes " : " minute ";

    return days + dayLabel + hours + hourLabel + minutes + minuteLabel;
  }

  static roundPrecision(value, precision) {
    if (!value) return value;

    return value.toFixed(precision)
  }

  static formatNumberValue(number) {
    if (!number) {
      return number;
    }

    let formattedValue = "";

    // console.log(number);
    // console.log(typeof number);
    if (typeof number === 'string') {
      if(number.indexOf(".") != -1) {
        //float
        number = parseFloat(number);
      } else {
        number = parseInt(number);
      }
    }

    // console.log("final number: ");
    // console.log(number);

    if(number > 1000000000){
      formattedValue = (number/1000000000).toFixed(3) + 'B';
    }else if(number > 1000000){
      formattedValue = (number/1000000).toFixed(3) + 'M';
    }else if(number > 1000){
      formattedValue = (number/1000).toFixed(3) + 'K';
    }else{
      // console.log("formatting number");
      // console.log(number);
      // console.log(typeof number);
      formattedValue = number;
    }

    // console.log(formattedValue);
    return formattedValue;
  }

}

export default SPCalc;
