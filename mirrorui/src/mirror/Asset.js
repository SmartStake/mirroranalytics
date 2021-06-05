import React from 'react';
import ReactTooltip from "react-tooltip";
import { Container } from 'react-bootstrap';

import './Asset.css';
import '../styles/tables.css';
import '../styles/tsection.css';

import ApiUtils from '../util/ApiUtils';
import tooltips from "../tooltips";
import Loading from "../components/Loading";
import BaseLineChart from "../charts/BaseLineChart";
import ChartUtils from '../util/ChartUtils';
import CoinUtils from '../util/CoinUtils';
import LastUpdated from '../components/LastUpdated';
import MirrorUtils from './MirrorUtils';
import AssetHeader from './AssetHeader';
import SectionTitle from '../components/SectionTitle';
import Utilities from '../util/Utilities';
import BootstrapTable from 'react-bootstrap-table-next';
import MultiLineChart from '../charts/MultiLineChart';


const MODE_DATE = "D";
const MODE_HOUR = "H";
const MODE_MIN = "M";
const FREQ_ALL = "All";
const FREQ_ANNUAL = "Y";
const FREQ_MONTH = "M";
const FREQ_WEEK = "W";
const FREQ_DAY = "D";

const FREQ_ANNUAL_DAYS = 365;
const FREQ_MONTH_DAYS = 30;
const FREQ_WEEK_DAYS = 7;
const FREQ_DAY_DAYS = 1;


class Asset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStats: {},
      allStats: {},
      statsHistory: [],
      notification: {},
      responsive: true,
      isLoading: true,
      mode: MODE_DATE,
      frequency: FREQ_ALL,
      latest24hActiveUsers: "N/A",
      lastUpdated: "",
    }

    this.handleChartUpdate = this.handleChartUpdate.bind(this);
    this.handleChartPoolPosition = this.handleChartPoolPosition.bind(this);

    // this.handleChartMAssetMcap = this.handleChartMAssetMcap.bind(this);
    this.handleChartPrice = this.handleChartPrice.bind(this);
    // this.handleChartTxFee = this.handleChartTxFee.bind(this);
    // this.handleChartMAssetMcap = this.handleChartMAssetMcap.bind(this);
    // this.handleChartTx = this.handleChartTx.bind(this);
    // this.handleChartUsers = this.handleChartTx.bind(this);
    // this.handleChartGovApr = this.handleChartGovApr.bind(this);
    // this.handleChartCollateral = this.handleChartCollateral.bind(this);
    // this.handleNetworkChange = this.handleNetworkChange.bind(this);
  }
 


  async componentDidMount() {
    this.prepareData(this.state.mode, this.state.frequency)
  }

  async prepareData(mode, frequency) {
    let url = "listData?type=asset&mode=" + mode + "&ticker=" + MirrorUtils.getTicker(this) + "&frequency=" + frequency;;
    // "&statType=" + statType + 
    // console.log("url:", url);
    const allData = await ApiUtils.get(url);
    // console.log("allData is:", allData);

    if (allData) {
      let lastUpdated = allData["lastUpdated"];
      let notification = allData["notification"];
      let asset = allData["asset"];
      let statHistory = allData["statHistory"];
      let priceHistory = allData["priceHistory"];
      let priceHistorySD = allData["priceHistorySD"];
      
      // this.filterData(mode, frequency, statHistory, priceHistory);
      // console.log("notification: ", notification);
      this.setState({"statHistory": statHistory, "dateOnlyStats": statHistory,
        "priceHistory": priceHistory, "priceHistorySD": priceHistorySD, "dateOnlyPrice": priceHistory,
        "notification": notification, "mode": mode, "isLoading": false, "lastUpdated": lastUpdated,
        "frequency": frequency, "asset": asset, "assetDetails": allData["assetDetails"],
      });
    }
  }

  handleChartUpdate(frequency) {
    // console.log("in frequency: ", frequency, ", current state: mode: ", 
    //   this.state.mode, ", freq: ", this.state.frequency);
    
    if (frequency == this.state.frequency) {
      //nothing changes
      return;
    }

    if (frequency === FREQ_ALL || frequency === FREQ_ANNUAL || frequency === FREQ_MONTH) {
      this.prepareData(MODE_DATE, frequency);
    } else if (frequency === FREQ_WEEK) {
      this.prepareData(MODE_HOUR, frequency);
    } else {
      this.prepareData(MODE_MIN, frequency);
    }
  }

  
  // filterData(mode, frequency, statHistory, priceHistory) {
  //   let finalStatHistory;
  //   let finalPriceHistory;
  //   if (frequency === FREQ_ALL) {
  //     finalStatHistory = statHistory;
  //     finalPriceHistory = priceHistory;
  //   } else if (frequency === FREQ_ANNUAL) {
  //     finalStatHistory = FilterUtils.removeOldData(statHistory, "statDate", FREQ_ANNUAL_DAYS);
  //     finalPriceHistory = FilterUtils.removeOldData(priceHistory, "statDate", FREQ_ANNUAL_DAYS);
  //   } else if (frequency === FREQ_MONTH) {
  //     finalStatHistory = FilterUtils.removeOldData(statHistory, "statDate", FREQ_MONTH_DAYS);
  //     finalPriceHistory = FilterUtils.removeOldData(priceHistory, "statDate", FREQ_MONTH_DAYS);
  //   } else if (frequency === FREQ_WEEK) {
  //     finalStatHistory = FilterUtils.removeOldData(statHistory, "statDate", FREQ_WEEK_DAYS);
  //     finalPriceHistory = FilterUtils.removeOldData(priceHistory, "statDate", FREQ_MONTH_DAYS);
  //   } else if (frequency === FREQ_DAY) {
  //     finalStatHistory = FilterUtils.removeOldData(statHistory, "statDate", FREQ_DAY_DAYS);
  //     finalPriceHistory = FilterUtils.removeOldData(priceHistory, "statDate", FREQ_DAY_DAYS);
  //   } 

  //   let dateOnlyStats = finalStatHistory;
  //   let dateOnlyPrice = finalPriceHistory;
  //   // console.log(mode);
  //   if (mode === MODE_HOUR) {
  //     dateOnlyStats = FilterUtils.retainLastStatPerDay(finalStatHistory, "statDate");
  //     dateOnlyPrice = FilterUtils.retainLastStatPerDay(finalPriceHistory, "statDate");
  //   }

  //   this.setState({"statHistory": finalStatHistory, "dateOnlyStats": dateOnlyStats,
  //     "priceHistory": finalPriceHistory, "dateOnlyPrice": dateOnlyPrice,
  //     "frequency": frequency});
  // }

  handleNetworkChange = (newNetwork) => {
    // console.log(newNetwork);
    // this.setState({"statType": newNetwork});
    this.prepareData(newNetwork, this.state.mode, this.state.frequency);
  }

  render() {
    if (this.state.isLoading) {
      return <Loading />;
    }

    return (
      <React.Fragment>
        <AssetHeader asset={this.state.asset} pageType="Summary" thisObj={this} />
        <p>{this.state.asset.description}</p>
        <ReactTooltip id="main" place="top" effect="float" multiline={true} className="infoTooltip" />
        <Container fluid className="containerLayout container-fluid chartContainer">
          <div class="sectionGridContainer">
            <div class="sectionBg">
              {this.renderBasicDetails()}
            </div>
            <div className="sectionBg">
              {this.renderAprDetails()}
            </div>
            <div className="sectionBg">
              {this.renderPriceDetails()}
            </div>
            <div className="sectionBg">
              {this.renderLPDetails()}
            </div>
          </div>
        </Container>
        <Container fluid className="containerLayout container-fluid chartContainer">
          <div class="chartGridContainer">
            <div class="chartBg">
              <MultiLineChart title="Price History (UST)" data={this.state.priceHistory} xAxis="Date"
                  xAxisValueAttr="date" yAxis="Price" valueAttr={["price", "oraclePrice"]} 
                  tip={tooltips.asset.price} handleChart={this.handleChartPrice}
                  disableDay="false" disableWeek="false" showVerticalLabel={false} showTotalLabel={false}                 
                  statType={this.state.statType} isOverallOnly={false} formatValues={true} />
            </div>

            <div className="chartBg">
              <MultiLineChart title="Price Standard Deviation (UST)" data={this.state.priceHistorySD} 
                  yAxis="Price" valueAttr={["priceStdDev", "oraclePriceStdDev"]} tip={tooltips.asset.priceDeviation} 
                  handleChart={this.handleChartPrice} xAxis="Date" xAxisValueAttr="date" 
                  disableDay="true" disableWeek="true" showVerticalLabel={false} showTotalLabel={false}                 
                  statType={this.state.statType} isOverallOnly={false} formatValues={true} />
           </div>
            <div className="chartBg">
              <MultiLineChart title="Positions (Asset Units)" data={this.state.statHistory} 
                  yAxis="Price" valueAttr={["mintPosition", "poolPosition", "lpStakedPosition"]} tip={tooltips.asset.positions} 
                  handleChart={this.handleChartPrice} xAxis="Date" xAxisValueAttr="date" 
                  disableDay="true" disableWeek="true" showVerticalLabel={false} showTotalLabel={false}                 
                  statType={this.state.statType} isOverallOnly={false} formatValues={true} />
            </div>
            <div className="chartBg">
              <BaseLineChart title="UST Pool Position" xAxis="Date" disableDay={false} disableWeek={false} zoomedRange={true}
                  showVerticalLabel={false} valueAttr="ustPoolPosition" showTotalLabel={false} xAxisValueAttr="date"
                  data={this.state.statHistory} tip={tooltips.asset.ustPoolPosition} handleChart={this.handleChartPoolPosition}
                  isOverallOnly={false} formatValues={true} />
            </div>
          </div>
        </Container>
        <LastUpdated thisObj={this} />
      </React.Fragment>
    );
  }
  // "asCollateralPosition", {/* <PageHeader title="Home" statType={this.state.statType} handleNetworkChange={this.handleNetworkChange} thisObj={this} />
  // <ReactTooltip id="main" place="top" effect="float" multiline={true} className="infoTooltip" />
  // {this.getSummary()}  
  // {this.getCharts()}   
  // <LastUpdated thisObj={this} /> */}
  /*
            static renderMultiLines(thisObj, title, data, xAxisAttr, 
              yAxisData, rangeAttr, 
              subtitle, tooltip, handleChart, 
              disableDay, statType, isOverallOnly, formatValues, disableWeek, zoomedRange) {
              {ChartUtils.renderMultiLines(this, "Price History (UST)", this.state.priceHistory,
                            "date", ["price", "oraclePrice"],
                            "oraclePrice", null, tooltips.asset.price, this.handleChartPrice, 
                            false, null, false, false, false, true)}

                            <div className="chartBg">
                            {ChartUtils.renderMultiLines(this, "Price Standard Deviation (UST)", this.state.priceHistorySD,
                                          "date", ["priceStdDev", "oraclePriceStdDev"],
                                          "oraclePriceStdDev", null, tooltips.asset.priceDeviation, this.handleChartPrice, 
                                          true, null, false, false, true, true)}
                          </div>
                          <div className="chartBg">
                            {ChartUtils.renderMultiLines(this, "Positions (Asset Units)", this.state.statHistory,
                                            "date", ["mintPosition", "poolPosition", "lpStakedPosition"],
                                            "oraclePrice", null, tooltips.asset.positions, this.handleChartPrice, 
                                            true, null, false, false, false, true)}
                          </div>
                          <div className="chartBg">
                            <BaseLineChart title="UST Pool Position" xAxis="Date" disableDay={false} disableWeek={false} zoomedRange={true}
                                showVerticalLabel={false} valueAttr="ustPoolPosition" showTotalLabel={false} xAxisValueAttr="date"
                                data={this.state.statHistory} tip={tooltips.asset.ustPoolPosition} handleChart={this.handleChartPoolPosition}
                                isOverallOnly={false} formatValues={true} />
                          </div>
                        </div>
*/              

  getCharts() {
    return (
      <Container fluid className="containerLayout container-fluid chartContainer">
        <div class="chartGridContainer">
          
          <div class="chartBg">
            <BaseLineChart title="Total Value Locked (millions)" xAxis="Date" yAxis="TVL (millions)" disableDay="false" 
                    showVerticalLabel={false} valueAttr="totalValueLockedInMil" showTotalLabel={false} xAxisValueAttr="date"
                    data={this.state.statHistory} tip={tooltips.homeCharts.tvl} handleChart={this.handleChartTVL}
                    statType={this.state.statType} isOverallOnly={true} />
          </div>

        </div>
      </Container>
    )    
  }
  
  renderAprDetails() {
    const headerSortingClasses = (column, sortOrder, isLastSorting, colIndex) => (
      sortOrder === 'asc' ? 'sorting-asc' : 'sorting-desc'
    );
    var columns = [
      {text: "Network",dataField: "statType", sort: true, headerStyle: Utilities.width(20), headerSortingClasses},
      {text: "Liquidity", dataField: "liquidity", formatter: CoinUtils.formatCoinsUst, sort: true,  sortFunc: Utilities.sortNumeric, headerStyle: Utilities.width(30), headerSortingClasses},
      {text: "Volume", dataField: "volume", formatter: CoinUtils.formatCoinsUst, sort: true, sortFunc: Utilities.sortNumeric, headerStyle: Utilities.width(30), headerSortingClasses},
      {text: "APR", dataField: "apr", formatter: CoinUtils.percentFormatter, sort: true,  sortFunc: Utilities.sortNumeric, headerStyle: Utilities.width(20), headerSortingClasses},
    ];

    return (
      <React.Fragment>
        <SectionTitle title="APR Details" tip={tooltips.asset.aprDetails} />
        <BootstrapTable keyField='statType' data={this.state.assetDetails}
          columns={ columns } condensed/>
      </React.Fragment>
    );
  }

  renderBasicDetails() {
    return (
      <React.Fragment>
        <SectionTitle title="Asset Details" tip={tooltips.asset.basicDetails} />
        <table>
          <tbody>
            <tr>
              <td>Ticker: </td>
              <td> {this.state.asset.symbol}</td>
            </tr>
            <tr>
              <td>Name: </td>
              <td> {this.state.asset.name}</td>
            </tr>
            <tr>
              <td>Mint Position: </td>
              <td> {CoinUtils.formatCoins(this.state.asset.mintPosition, this.state.asset)}</td>
            </tr>
            <tr>
              <td>LP Staked: </td>
              <td> {CoinUtils.formatCoins(this.state.asset.lpStakedPosition, this.state.asset)}</td>
            </tr>
          </tbody>
        </table>
      </React.Fragment>
    );
  }

  renderLPDetails() {
    return (
      <React.Fragment>
        <SectionTitle title="Liquidity/LP Details" tip={tooltips.asset.lpDetails} />
        <table>
          <tbody>
            <tr>
              <td>Mint Position: </td>
              <td> {CoinUtils.formatCoinsResp(this.state.asset.mintPosition)}</td>
            </tr>
            <tr>
              <td>Pool Position: </td>
              <td> {CoinUtils.formatCoinsResp(this.state.asset.poolPosition)}</td>
            </tr>
            <tr>
              <td>UST Pool Position: </td>
              <td> {CoinUtils.formatCoinsRespUst(this.state.asset.ustPoolPosition)}</td>
            </tr>
            <tr>
              <td>LP Staked Position: </td>
              <td> {CoinUtils.formatCoinsResp(this.state.asset.lpStakedPosition)}</td>
            </tr>
          </tbody>
        </table>
      </React.Fragment>
    );
  }
//   <tr>
//   <td>Collateral Position: </td>
//   <td> {CoinUtils.formatCoinsResp(this.state.asset.asCollateralPosition)}</td>
// </tr>


  renderPriceDetails() {
    return (
      <React.Fragment>
        <SectionTitle title="Price Details" tip={tooltips.asset.priceDetails} />
        <p/>
        <p>Price Spread: {this.state.asset.priceSpread}%</p>
        <table >
          <thead>
            <tr>
              <th>Type</th>
              <th>Price</th>
              <th>30 Day Price Deviation %</th>
              <th>30 Day Price Deviation UST</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>mAsset</td>
              <td> {this.state.asset.price}</td>
              <td> {this.state.asset.priceStdDevPercent}</td>
              <td> {this.state.asset.priceStdDev}</td>
            </tr>
            <tr>
              <td>Oracle</td>
              <td> {this.state.asset.oraclePrice}</td>
              <td> {this.state.asset.oraclePriceStdDevPercent}</td>
              <td> {this.state.asset.oraclePriceStdDev}</td>
            </tr>
          </tbody>
        </table>

      </React.Fragment>
    );
  }


  handleChartPoolPosition(frequency) {
    this.handleChartUpdate(frequency);
  }

//   handleChartMAssetMcap(frequency) {
//     this.handleChartUpdate(frequency);
//   }

  handleChartPrice(frequency) {
    this.handleChartUpdate(frequency);
  }

//   handleChartTxFee(frequency) {
//     this.handleChartUpdate(frequency);
//   }

//   handleChartMAssetMcap(frequency) {
//     this.handleChartUpdate(frequency);
//   }

//   handleChartTx(frequency) {
//     this.handleChartUpdate(frequency);
//   }

//   handleChartUsers(frequency) {
//     this.handleChartUpdate(frequency);
//   }

//   handleChartGovApr(frequency) {
//     this.handleChartUpdate(frequency);
//   }

//   handleChartCollateral(frequency) {
//     this.handleChartUpdate(frequency);
//   }
}

export default Asset;
