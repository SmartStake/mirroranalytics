import React from 'react';
import ReactTooltip from "react-tooltip";
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';

import '../styles/tsection.css';
import ApiUtils from '../util/ApiUtils';
import tooltips from "../tooltips";
import Loading from "../components/Loading";
import PageHeader from '../components/PageHeader';
import Stat from '../components/Stat';
import BaseLineChart from "../charts/BaseLineChart";
import ChartUtils from '../util/ChartUtils';
import CoinUtils from '../util/CoinUtils';
import FilterUtils from '../util/FilterUtils';
import SPUtilities from '../util/SPUtilities';
import constants from '../constants';
import SPCalc from '../util/SPCalc';


const MODE_DATE = "D";
const MODE_HOUR = "H";
const FREQ_ALL = "All";
const FREQ_ANNUAL = "Y";
const FREQ_MONTH = "M";
const FREQ_WEEK = "W";
const FREQ_DAY = "D";

const FREQ_ANNUAL_DAYS = 365;
const FREQ_MONTH_DAYS = 30;
const FREQ_WEEK_DAYS = 7;
const FREQ_DAY_DAYS = 1;


class Home extends React.Component {
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
      statType: constants.STAT_TYPE_COMBINE,
      latest24hActiveUsers: "N/A",
      lastUpdated: "",
    }

    this.handleChartUpdate = this.handleChartUpdate.bind(this);
    this.handleChartTVL = this.handleChartTVL.bind(this);
    this.handleChartMAssetMcap = this.handleChartMAssetMcap.bind(this);
    this.handleChartVolume = this.handleChartVolume.bind(this);
    this.handleChartTxFee = this.handleChartTxFee.bind(this);
    this.handleChartMAssetMcap = this.handleChartMAssetMcap.bind(this);
    this.handleChartTx = this.handleChartTx.bind(this);
    this.handleChartUsers = this.handleChartTx.bind(this);
    this.handleChartGovApr = this.handleChartGovApr.bind(this);
    this.handleChartCollateral = this.handleChartCollateral.bind(this);
    this.handleNetworkChange = this.handleNetworkChange.bind(this);
  }
 
  async componentDidMount() {
    this.prepareData(this.state.statType, this.state.mode, this.state.frequency)
  }

  async prepareData(statType, mode, frequency) {
    let params = "&mode=" + mode + "&statType=" + statType;
    const allData = await ApiUtils.get("listData?type=statSummary" + params);
    // console.log("allData is:", allData);

    if (allData) {
      let lastUpdated = allData["lastUpdated"];
      let notification = allData["notification"];
      let currentStats = allData["allStats"][statType];
      let statHistory = allData["statHistoryMap"][statType];
      this.filterData(mode, frequency, statHistory);
      // console.log("notification: ", notification);

      let latest24hActiveUsers = "N/A";
      if (statType != constants.STAT_TYPE_ETH) {
        latest24hActiveUsers = CoinUtils.formatCoins(currentStats.latest24hActiveUsers);
      }

      this.setState({"lastUpdated": lastUpdated, "currentStats": currentStats,
        "notification": notification, "allStats": allData["allStats"],
        "statHistoryMap": allData["statHistoryMap"], "coinStat": allData["coinStat"],
        "statType": statType, "mode": mode, "snapshotTime": allData["snapshotTime"],
        "isLoading": false, "latest24hActiveUsers": latest24hActiveUsers,
      });
    }
  }

  filterData(mode, frequency, statHistory) {
    let finalStatHistory;
    if (frequency === FREQ_ALL) {
      finalStatHistory = statHistory;
    } else if (frequency === FREQ_ANNUAL) {
      finalStatHistory = FilterUtils.removeOldData(statHistory, "syncTime", FREQ_ANNUAL_DAYS);
    } else if (frequency === FREQ_MONTH) {
      finalStatHistory = FilterUtils.removeOldData(statHistory, "syncTime", FREQ_MONTH_DAYS);
    } else if (frequency === FREQ_WEEK) {
      finalStatHistory = FilterUtils.removeOldData(statHistory, "syncTime", FREQ_WEEK_DAYS);
    } else if (frequency === FREQ_DAY) {
      finalStatHistory = FilterUtils.removeOldData(statHistory, "syncTime", FREQ_DAY_DAYS);
    } 

    let dateOnlyStats = finalStatHistory;
    // console.log(mode);
    if (mode === MODE_HOUR) {
      dateOnlyStats = FilterUtils.retainLastStatPerDay(finalStatHistory, "syncTime");
    }

    this.setState({"statHistory": finalStatHistory, "dateOnlyStats": dateOnlyStats,
      "frequency": frequency});
  }

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
      <div>
        <PageHeader title="Home" statType={this.state.statType} handleNetworkChange={this.handleNetworkChange} thisObj={this} />
        <ReactTooltip id="main" place="top" effect="float" multiline={true} className="infoTooltip" />
        {this.getSummary()}  
        {this.getCharts()}   
      </div>
    );
  }
  // range={Utilities.getRange(true, this.state.statHistory, "feeInK")}
  // className="containerLayout" 
  // <Container fluid>
  getCharts() {
    return (
      <Container fluid>
        <Row>
          <Col md className="chartBg">
            <BaseLineChart title="Total Value Locked" xAxis="Date" yAxis="TVL (millions)" disableDay="false" 
                showVerticalLabel={false} valueAttr="totalValueLockedInMil" showTotalLabel={false} xAxisValueAttr="date"
                data={this.state.statHistory} tip={tooltips.homeCharts.tvl} handleChart={this.handleChartTVL}
                statType={this.state.statType} isOverallOnly={true} />
          </Col>
          <Col md className="chartBg">
            <BaseLineChart title="mAsset Marketcap" xAxis="Date" yAxis="Marketcap (millions)" disableDay="false" 
                  showVerticalLabel={false} valueAttr="mAssetMcapInMil" showTotalLabel={false} xAxisValueAttr="date"
                  data={this.state.statHistory} tip={tooltips.homeCharts.mAssetMcap} handleChart={this.handleChartMAssetMcap}
                  statType={this.state.statType} isOverallOnly={true} />
          </Col>
        </Row>
        <Row>
          <Col md className="chartBg">
            {ChartUtils.renderMultiLines(this, "Volume", this.state.dateOnlyStats,
                    "Date", "date", "Volume (millions)", ["totalVolumeInMil", "mirVolumeInMil"],
                    "totalVolumeInMil", null, tooltips.homeCharts.volume, this.handleChartVolume, 
                    true, this.state.statType, false)}
          </Col>
          <Col md className="chartBg">
            <BaseLineChart title="Tx Fee" xAxis="Date" yAxis="Tx Fee ('000s)" disableDay="true" 
                showVerticalLabel={false} valueAttr="feeInK" showTotalLabel={false} xAxisValueAttr="date"
                data={this.state.dateOnlyStats} tip={tooltips.homeCharts.fee} handleChart={this.handleChartTxFee}
                statType={this.state.statType} isOverallOnly={false} />
          </Col>
        </Row>
        {this.getNonEthCharts()}
        <Row>
          <Col md className="chartBg">
            <BaseLineChart title="Tx Count" xAxis="Date" yAxis="Transactions" disableDay="true" 
                    showVerticalLabel={false} valueAttr="txCountInK" showTotalLabel={false} xAxisValueAttr="date"
                    data={this.state.dateOnlyStats} tip={tooltips.homeCharts.txCount} handleChart={this.handleChartTx}
                    statType={this.state.statType} isOverallOnly={false} />
          </Col>
          <Col md className="chartBg">
            <BaseLineChart title="Collateral Ratio" xAxis="Date" yAxis="Collateral Ratio" disableDay="false" 
                  showVerticalLabel={false} valueAttr="collateralRatioPercent" showTotalLabel={false} xAxisValueAttr="date"
                  data={this.state.statHistory} tip={tooltips.homeCharts.collateralRatio} handleChart={this.handleChartCollateral}
                  statType={this.state.statType} isOverallOnly={false} />
          </Col>
        </Row>
      </Container>
    )    
  }

  getNonEthCharts() {
    if (this.state.statType != constants.STAT_TYPE_ETH) {
      return (
        <Row>
          <Col md className="chartBg">
            <BaseLineChart title="Active Users" xAxis="Date" yAxis="Users" disableDay="false" 
                showVerticalLabel={false} valueAttr="activeUsers" showTotalLabel={false} xAxisValueAttr="date"
                data={this.state.statHistory} tip={tooltips.homeCharts.activeUsers} handleChart={this.handleChartUsers} 
                statType={this.state.statType} isOverallOnly={false} />
          </Col>
          <Col md className="chartBg">
            <BaseLineChart title="Governance APR" xAxis="Date" yAxis="APR" disableDay="false" 
                  showVerticalLabel={false} valueAttr="govApr" showTotalLabel={false} xAxisValueAttr="date"
                  data={this.state.statHistory} tip={tooltips.homeCharts.apr} handleChart={this.handleChartGovApr}
                  statType={this.state.statType} isOverallOnly={false} />
          </Col>
        </Row>
      );
    }

    return "";
  }

  getSummary() {
    let snapshotTime = this.getNextSnapshotTime(this.state.snapshotTime);
    // console.log("getting summary again: ", this.state.statType);

    return (
      <Container className="containerLayout" fluid>
        <Row className="statRowLayout">
          <Col className="statColLayout" xs={6} sm={6} md={4} lg={3}>
            <Stat label="mAsset Market Cap" labelShort="mAsset MCap" value={CoinUtils.formatCoinsUst(this.state.currentStats.assetMarketCap)} 
              info={tooltips.home.mcap} statType={this.state.statType} isOverallOnly={true} />
          </Col>
          <Col className="statColLayout" xs={6} sm={6} md={4} lg={3}>
            <Stat label="Total Value Locked" value={CoinUtils.formatCoinsUst(this.state.currentStats.totalValueLocked)} 
              info={tooltips.home.totalValueLocked} statType={this.state.statType} isOverallOnly={true}/>
          </Col>
          <Col className="statColLayout" xs={6} sm={6} md={4} lg={3}>
            <Stat label="Tx Count - 24h" value={CoinUtils.formatCoins(this.state.currentStats.latest24hTransactions)} 
              info={tooltips.home.latest24hTransactions} statType={this.state.statType} isOverallOnly={false}/>
          </Col>
          <Col className="statColLayout" xs={6} sm={6} md={4} lg={3}>
            <Stat label="Collateral Ratio" value={CoinUtils.percentFormatter(this.state.currentStats.collateralRatio)} 
              info={tooltips.home.collateralRatio} statType={this.state.statType} isOverallOnly={false}/>
          </Col>
          <Col className="statColLayout" xs={6} sm={6} md={4} lg={3}>
            <Stat label="Governance APR" value={CoinUtils.percentFormatter(this.state.currentStats.govApr)} 
              info={tooltips.home.govApr} statType={this.state.statType} isOverallOnly={true}/>
          </Col>
          <Col className="statColLayout" xs={6} sm={6} md={4} lg={3}>
            <Stat label="Active Users - 24h" value={this.state.latest24hActiveUsers} 
              info={tooltips.home.latest24hActiveUsers} statType={this.state.statType} isOverallOnly={false}/>
          </Col>
          <Col className="statColLayout" xs={6} sm={6} md={4} lg={3}>
            <Stat label="Volume - 24h" value={CoinUtils.formatCoinsUst(this.state.currentStats.latest24hVolume)} 
              info={tooltips.home.latest24hVolume} statType={this.state.statType} isOverallOnly={false}/>
          </Col>
          <Col className="statColLayout" xs={6} sm={6} md={4} lg={3}>
            <Stat label="MIR Volume - 24h" value={CoinUtils.formatCoinsUst(this.state.currentStats.latest24hMirVolume)} 
              info={tooltips.home.latest24hMirVolume} statType={this.state.statType} isOverallOnly={false}/>
          </Col>
          <Col className="statColLayout" xs={6} sm={6} md={4} lg={3}>
            <Stat label="Tx Fee - 24h" value={CoinUtils.formatCoinsUst(this.state.currentStats.latest24hFeeVolume)} 
              info={tooltips.home.latest24hFeeVolume} statType={this.state.statType} isOverallOnly={false}/>
          </Col>
          <Col className="statColLayout" xs={6} sm={6} md={4} lg={3}>
            <Stat label="Circulating Supply" value={CoinUtils.formatCoinsMir(this.state.currentStats.mirCirculatingSupply)} 
              info={tooltips.home.mirCirculatingSupply.replace("$value1", this.state.currentStats.mirCirculatingSupply)}
              statType={this.state.statType} isOverallOnly={true}/>
          </Col>
          <Col className="statColLayout" xs={6} sm={6} md={4} lg={3}>
            <Stat label="Total Supply" value={CoinUtils.formatCoinsMir(this.state.currentStats.mirTotalSupply)} 
              info={tooltips.home.mirTotalSupply.replace("$value1", this.state.currentStats.mirTotalSupply)}
              statType={this.state.statType} isOverallOnly={true}/>
          </Col>
          <Col className="statColLayout" xs={6} sm={6} md={4} lg={3}>
            <Stat label="Next MIR Snapshot Time" labelShort="Next MIR Snapshot" link="https://terra.smartstake.io" target="_blank" 
              info={tooltips.home.nextMirAirdrop.replace("$value1", snapshotTime)} statType={this.state.statType} isOverallOnly={true}
              value={snapshotTime}/>
          </Col>
        </Row>
      </Container>        
    )    
  }

  handleChartUpdate(frequency) {
    // console.log("in frequency: ", frequency, ", current state: mode: ", 
    //   this.state.mode, ", freq: ", this.state.frequency, ", statType: ", this.state.statType);
    if (frequency == this.state.frequency) {
      //nothing changes
      return;
    }

    if (frequency === FREQ_ALL || frequency === FREQ_ANNUAL || frequency === FREQ_MONTH) {
      if (this.state.mode != MODE_DATE) {
        this.prepareData(this.state.statType, MODE_DATE, frequency);
      } else {
        let statHistory = this.state.statHistoryMap[this.state.statType];
        this.filterData(this.state.mode, frequency, statHistory);
      }
    } else if (frequency === FREQ_WEEK || frequency === FREQ_DAY) {
      if (this.state.mode != MODE_HOUR) {
        this.prepareData(this.state.statType, MODE_HOUR, frequency);
      } else {
        let statHistory = this.state.statHistoryMap[this.state.statType];
        this.filterData(this.state.mode, frequency, statHistory);
      }
    }
  }

  getNextSnapshotTime(timeForNextDrop) {
    var seconds = parseInt(timeForNextDrop);
    // // console.log(seconds);
    // var timeObject = new Date()
    // timeObject.setSeconds(timeObject.getSeconds() + seconds);

    // let localTimeForNextDrop = SPUtilities.formatDateTime(timeObject);
    // return localTimeForNextDrop;
    return SPCalc.formatTimeLeft(seconds)
  }

  handleChartTVL(frequency) {
    this.handleChartUpdate(frequency);
  }

  handleChartMAssetMcap(frequency) {
    this.handleChartUpdate(frequency);
  }

  handleChartVolume(frequency) {
    this.handleChartUpdate(frequency);
  }

  handleChartTxFee(frequency) {
    this.handleChartUpdate(frequency);
  }

  handleChartMAssetMcap(frequency) {
    this.handleChartUpdate(frequency);
  }

  handleChartTx(frequency) {
    this.handleChartUpdate(frequency);
  }

  handleChartUsers(frequency) {
    this.handleChartUpdate(frequency);
  }

  handleChartGovApr(frequency) {
    this.handleChartUpdate(frequency);
  }

  handleChartCollateral(frequency) {
    this.handleChartUpdate(frequency);
  }
}

export default Home;
