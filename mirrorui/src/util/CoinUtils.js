import React from 'react';
import numeral from 'numeral';

import SPCalc from './SPCalc';
import RespUtils from './RespUtils'

class CoinUtils extends React.Component {
  static btcFormatter(cell, row) {
    return cell;
  }

  static btcValueFormatter(cell, row) {
    if (!cell) {
      return cell;
    }

    return Number(cell).toPrecision(4);
  }

  static usdFormatter(cell, row) {
    if (!cell) {
      return cell;
    }
    return Number(cell).toPrecision(2);
  }

  static percentFormatter(cell, row) {
    if (!cell) {
      return cell;
    }
    let value = cell.toFixed(2);
    return (value + "%");
  }

  static moneyFormatter(amount) {
    return CoinUtils.moneyFormatterPrecision(amount, 3);
  }

  static moneyFormatterPrecision(amount, precision) {
      // Nine Zeroes for Billions
      return Math.abs(Number(amount)) >= 1.0e+9
        ? Number(Math.abs(Number(amount)) / 1.0e+9).toPrecision(precision) + "B"
        // Six Zeroes for Millions
        : Math.abs(Number(amount)) >= 1.0e+6
        ? Number(Math.abs(Number(amount)) / 1.0e+6).toPrecision(precision) + "M"
        // Three Zeroes for Thousands
        : Math.abs(Number(amount)) >= 1.0e+3
        ? Number(Math.abs(Number(amount)) / 1.0e+3).toPrecision(precision) + "K"
        : Number(Math.abs(Number(amount))).toPrecision(precision);
  }

  static moneyFormatterRounded(amount, decimals) {
      // Nine Zeroes for Billions
      return Math.abs(Number(amount)) >= 1.0e+9
        ? Number(Math.abs(Number(amount)) / 1.0e+9).toFixed(decimals)
        // Six Zeroes for Millions
        : Math.abs(Number(amount)) >= 1.0e+6
        ? Number(Math.abs(Number(amount)) / 1.0e+6).toFixed(decimals)
        // Three Zeroes for Thousands
        : Math.abs(Number(amount)) >= 1.0e+3
        ? Number(Math.abs(Number(amount)) / 1.0e+3).toFixed(decimals)
        : Number(Math.abs(Number(amount))).toFixed(decimals);
  }

  static formatDivBy18(cell, row) {
    if (!cell) {
      return cell;
    }

    // return SPUtilities.moneyFormatterPrecision(cell, 3);
    let value = cell / Math.pow(10, 18);
    // console.log(value, " - ", cell);
    return Math.floor(value).toLocaleString();
  }

  static formatCoins(cell, row) {
    if (!cell) {
      return cell;
    }

    return Math.floor(cell).toLocaleString();
  }

  static divByPower18(cell, row) {
    if (!cell) {
      return cell;
    }

    let value = cell / Math.pow(10, 18);
    return Math.floor(value);
  }


  static stakeFormatterRounded(cell, row) {
    if (!cell) {
      return cell;
    }

    // return SPUtilities.moneyFormatterPrecision(cell, 3);
    return numeral(cell).format('0.0a');
  }

  static stakeFormatterRoundedTwo(cell, row) {
    if (!cell) {
      return cell;
    }

    return numeral(cell).format('0.00a');
  }

  static stakeFormatterBySize(cell, row) {
    if (!cell) {
      return cell;
    }

    if(RespUtils.isMobileView()) {
      return numeral(cell).format('0.0a');
    } else {
      return cell;
    }

    return numeral(cell).format('0.0a');
  }

  static stakeFormatterDecimal(value) {
    if (!value) {
      return value;
    }

    return numeral(value).format('0[.]00000');
  }

  static moneyFormatterDesc(amount) {
      // Nine Zeroes for Billions
      return Math.abs(Number(amount)) >= 1.0e+9
        ? Number(Math.abs(Number(amount)) / 1.0e+9).toPrecision(3) + " Billion"
        // Six Zeroes for Millions
        : Math.abs(Number(amount)) >= 1.0e+6
        ? Number(Math.abs(Number(amount)) / 1.0e+6).toPrecision(3) + " Million"
        // Three Zeroes for Thousands
        : Math.abs(Number(amount)) >= 1.0e+3
        ? Number(Math.abs(Number(amount)) / 1.0e+3).toPrecision(3) + " Thousand"
        : Number(Math.abs(Number(amount))).toPrecision(3);
  }

  /*
  static numberFormatter(numericValue) {
      // Nine Zeroes for Billions
      return Math.abs(Number(numericValue)) >= 1.0e+9
        ? Number(Math.abs(Number(numericValue)) / 1.0e+9).toPrecision(2) + "B"
        // Six Zeroes for Millions
        : Math.abs(Number(numericValue)) >= 1.0e+6
        ? Number(Math.abs(Number(numericValue)) / 1.0e+6).toPrecision(2) + "M"
        // Three Zeroes for Thousands
        : Math.abs(Number(numericValue)) >= 1.0e+3
        ? Number(Math.abs(Number(numericValue)) / 1.0e+3).toPrecision(3) + "K"
        : Number(Math.abs(Number(numericValue))).toPrecision(3);
  }*/

  static coinCountCellFormatter(cell, row) {
    if (!cell) {
      return cell;
    }

    return SPCalc.formatCoinCount(cell);
  }

  static formatCoinsResp(cell, row) {
      if (RespUtils.isTabletView()) {
          return CoinUtils.stakeFormatterRounded(cell, row);
      }

      return CoinUtils.formatCoins(cell, row);
  }

  static formatCoinsUst(cell, row) {
    return CoinUtils.formatCoinsResp(cell, row) + " UST";
  }

  static formatCoinsMir(cell, row) {
    return CoinUtils.formatCoinsResp(cell, row) + " MIR";
  }
}

export default CoinUtils;
