import React from 'react';
import ReactTooltip from "react-tooltip";
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import TuneIcon from '@material-ui/icons/Tune';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ToolkitProvider, { ColumnToggle } from 'react-bootstrap-table2-toolkit';

import '../styles/section.css';
import './Assets.css';
import ApiUtils from '../util/ApiUtils';
import tooltips from "../tooltips";
import Loading from "../components/Loading";
import NetworkSectionTitle from "../components/NetworkSectionTitle";
import PageHeader from '../components/PageHeader';
import Stat from '../components/Stat';
import CoinUtils from '../util/CoinUtils';
import SPUtilities from '../util/SPUtilities';
import constants from '../constants';
import RespUtils from '../util/RespUtils';
import Utilities from '../util/Utilities';
import UIUtils from '../util/UIUtils';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';
import SPCalc from '../util/SPCalc';
import LastUpdated from '../components/LastUpdated';
import MirrorUtils from './MirrorUtils';
import Tooltip from '../components/Tooltip';
import LogoUtils from '../util/LogoUtils';
import FavUtils from '../util/FavUtils';


class Assets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      statType: constants.STAT_TYPE_TERRA,
      assets: {},
      allStats: {},
      notification: {},
      responsive: true,
      isLoading: true,
      lastUpdated: "",
      showSettings: false,
    }
    this.showColumnSettings = this.showColumnSettings.bind(this);
    this.hideColumnSettings = this.hideColumnSettings.bind(this);
    this.handleNetworkChange = this.handleNetworkChange.bind(this);
    this.resetColumnSettings = this.resetColumnSettings.bind(this);
    this.favourite = this.favourite.bind(this);
    this.unfavourite = this.unfavourite.bind(this);
    
  }
 
  async componentDidMount() {
    // FavUtils.removeCacheByKey(constants.ASSETS_COLUMNS_KEY);
    this.getColumnConfig();

    this.prepareData(this.state.statType);
  }

  async prepareData(statType) {
    let params = "&statType=" + statType;
    let url = "listData?type=assets" + params;
    // console.log("url :", url);
    const allData = await ApiUtils.get(url);
    // console.log("allData is:", allData);

    if (allData) {
      let lastUpdated = allData["lastUpdated"];
      let notification = allData["notification"];
      let assets = allData["assets"];
      // console.log("notification: ", notification);

      this.setState({"lastUpdated": lastUpdated, "assets": MirrorUtils.addIndexAndSymol(assets, "assetId"),
        "notification": notification, "statType": statType, 
        "isLoading": false, 
      });
    }
  }

  handleNetworkChange = (newNetwork) => {
    // console.log(newNetwork);
    // this.setState({"statType": newNetwork});
    this.prepareData(newNetwork);
  }

  render() {
    if (this.state.isLoading) {
      return <Loading />;
    }

    return (
      <div>
        <PageHeader title="Assets" statType={this.state.statType} handleNetworkChange={this.handleNetworkChange} thisObj={this} />
        <ReactTooltip id="main" place="top" effect="float" multiline={true} className="infoTooltip" />
        {this.getAssets()}
        <LastUpdated thisObj={this} />
      </div>
    );
  }

  // {this.getAssetSummary()}  
  getAssetSummary() {
    return (
      <Container className="containerLayout" fluid>
        <Row className="statRowLayout">
          <Col className="statColLayout" xs={6} sm={6} md={4} lg={3}>
            <Stat label="# of mAssets" value={this.state.assets.length} 
              info={tooltips.home.mcap} statType={this.state.statType} isOverallOnly={true} />
          </Col>
        </Row>
      </Container>        
    )    
  }

  getAssets() {
    return (
      <Container fluid className="containerLayout container-fluid chartContainer">
        <div class="tablesGridContainer">
          <div class="tablesBg">
            <div className="sectionHeader">
              <div className="sectionTitle">Assets
                &nbsp;
                <span> {MirrorUtils.getNetwork(this, true)} </span>
                <div className="sectionTooltip"><Tooltip tip={tooltips.assets.assetList} /></div>
              </div>
              <button onClick={this.showColumnSettings} className="animLink"><TuneIcon /></button>
            </div>
            {this.getAssetList()}
          </div>
        </div>
      </Container>
    )
  }

  unfavourite(id) {
    FavUtils.unfavouriteById(id, this);
  }

  favourite(id) {
    FavUtils.favouriteById(id, this);
  }

  getAssetList() {
    // const { ToggleList } = ColumnToggle;
    const headerSortingClasses = (column, sortOrder, isLastSorting, colIndex) => (
      sortOrder === 'asc' ? 'sorting-asc' : 'sorting-desc'
    );

    var columns = [
      {text: "Fav", desc: "Favorite indicator", hidden: this.isHidden("fav"), dataField: "fav", sort: true, formatter: FavUtils.favoriteFormatter, align: "left", formatExtraData: this, headerStyle: Utilities.width(5), headerSortingClasses},
      {text: "#", desc: "Index", hidden: this.isHidden("index"), dataField: "index", sort: true,  sortFunc: Utilities.sortNumeric, headerStyle: Utilities.width(4), headerSortingClasses},
      {text: "Logo", desc: "Asset Logo", hidden: this.isHidden("logo"), dataField: "logo", sort: false, formatter: LogoUtils.formatLogo, headerStyle: Utilities.width(4)},
      {text: "Ticker", desc: "Asset Symbol", hidden: this.isHidden("symbol"), dataField: "symbol", formatter: MirrorUtils.formatTicker, sort: true, headerStyle: Utilities.width(8), headerSortingClasses},
      {text: "Name", desc: "Asset Name", hidden: this.isHidden("name"), dataField: "name", sort: true, headerStyle: Utilities.width(17), headerSortingClasses},
      {text: "Liquidity", desc: "Liquidity in millions", hidden: this.isHidden("liquidity"), dataField: "liquidity", formatter: CoinUtils.formatCoinsRoundedUst, sort: true,  sortFunc: Utilities.sortNumeric, headerStyle: Utilities.width(12), headerSortingClasses},
      {text: "Volume", desc: "Volume in millions", hidden: this.isHidden("volume"), dataField: "volume", formatter: CoinUtils.formatCoinsRoundedUst, sort: true,  sortFunc: Utilities.sortNumeric, headerStyle: Utilities.width(12), headerSortingClasses},
      {text: "Price", desc: "mAsset price in $UST", hidden: this.isHidden("price"), dataField: "price", formatter: CoinUtils.formatPriceUst, sort: true,  sortFunc: Utilities.sortNumeric, headerStyle: Utilities.width(10), headerSortingClasses},
      {text: "Oracle Price", desc: "mAsset market price in $UST", hidden: this.isHidden("oraclePrice"), dataField: "oraclePrice", formatter: CoinUtils.formatPriceUst, sort: true,  sortFunc: Utilities.sortNumeric, headerStyle: Utilities.width(10), headerSortingClasses},
      {text: "Spread", desc: "Price diff btw Oracle & Mirror price", hidden: this.isHidden("priceSpread"), dataField: "priceSpread", formatter: CoinUtils.percentFormatter, sort: true,  sortFunc: Utilities.sortNumeric, headerStyle: Utilities.width(7), headerSortingClasses},
      {text: "APR", desc: "APR for LP staking", hidden: this.isHidden("apr"), dataField: "apr", formatter: CoinUtils.percentFormatter, sort: true,  sortFunc: Utilities.sortNumeric, headerStyle: Utilities.width(6), headerSortingClasses},
      {text: "Mint Position", desc: "Mint Position (mAsset units)", hidden: this.isHidden("mintPosition"), dataField: "mintPosition", formatter: CoinUtils.formatCoinsResp, sort: true,  sortFunc: Utilities.sortNumeric, headerStyle: Utilities.width(12), headerSortingClasses},
      {text: "Pool Position", desc: "Pool Position (mAsset units)", hidden: this.isHidden("poolPosition"), dataField: "poolPosition", formatter: CoinUtils.formatCoinsResp, sort: true,  sortFunc: Utilities.sortNumeric, headerStyle: Utilities.width(12), headerSortingClasses},
      {text: "UST Pool Position", desc: "UST Pool Position", hidden: this.isHidden("usdPoolPosition"), dataField: "usdPoolPosition", formatter: CoinUtils.formatCoinsRespUst, sort: true,  sortFunc: Utilities.sortNumeric, headerStyle: Utilities.width(12), headerSortingClasses},
      {text: "LP Staked Position", desc: "LP Staked Position", hidden: this.isHidden("lpStakedPosition"), dataField: "lpStakedPosition", formatter: CoinUtils.formatCoinsResp, sort: true,  sortFunc: Utilities.sortNumeric, headerStyle: Utilities.width(12), headerSortingClasses},
      {text: "Price Std Deviation (%)", desc: "% Standard deviation in price in 30 days", hidden: this.isHidden("priceStdDevPercent"), dataField: "priceStdDevPercent", formatter: CoinUtils.percentFormatter, sort: true,  sortFunc: Utilities.sortNumeric, headerStyle: Utilities.width(9), headerSortingClasses},
      {text: "Price Std Deviation ($UST)", desc: "$ Standard deviation in price in 30 days", hidden: this.isHidden("priceStdDev"), dataField: "priceStdDev", sort: true,  sortFunc: Utilities.sortNumeric, headerStyle: Utilities.width(10), headerSortingClasses},
      {text: "Oracle Price Deviation (%)", desc: "% Standard deviation in Oracle price in 30 days", hidden: this.isHidden("oraclePriceStdDevPercent"), dataField: "oraclePriceStdDevPercent", formatter: CoinUtils.percentFormatter, sort: true,  sortFunc: Utilities.sortNumeric, headerStyle: Utilities.width(17), headerSortingClasses},
      {text: "Oracle Price Std Deviation ($UST)", desc: "$ Standard deviation in Oracle price in 30 days", hidden: this.isHidden("oraclePriceStdDev"), dataField: "oraclePriceStdDev", sort: true,  sortFunc: Utilities.sortNumeric, headerStyle: Utilities.width(17), headerSortingClasses},
    ];

    const options = UIUtils.getPageOptionsSmall(this, 25); 
    // {text: "Collateral Position", desc: "Collateral Position", hidden: this.isHidden("asCollateralPosition"), dataField: "asCollateralPosition", formatter: CoinUtils.formatCoinsResp, sort: true,  sortFunc: Utilities.sortNumeric, headerStyle: Utilities.width(12), headerSortingClasses},
    // pagination={ paginationFactory(options) } 
    // const defaultSorted = [{
    //   dataField: 'symbol',
    //   order: 'desc' // desc or asc
    // }];defaultSorted={defaultSorted}

    // console.log(this.state.assets);
    // console.log(this.state.showSettings);

    const CustomToggleList = ({
      columns,
      onColumnToggle,
      toggles
    }) => (
      <React.Fragment>
        {this.state.showSettings === true && 
          <Modal show={this.state.showSettings} onHide={this.hideColumnSettings} size="lg" 
            centered className="delegateWithUs">
            <Modal.Header closeButton>
                <Modal.Title>Change visibility of various asset data elements</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="customSettingsGroup btn-group btn-group-toggle btn-group-vertical" data-toggle="buttons">
                {
                  columns
                    .map(column => ({
                      ...column,
                      toggle: toggles[column.dataField]
                    }))
                    .map(column => (
                      <button type="button" key={ column.dataField } className={ `customSettingsButton btn btn-dark ${column.toggle ? 'active' : ''}` }
                        data-toggle="button" aria-pressed={ column.toggle ? 'true' : 'false' }
                        onClick={ () => {onColumnToggle(column.dataField); this.updateSetting(column.dataField); }}>
                        { column.toggle ? <VisibilityIcon /> : <VisibilityOffIcon /> } { column.text } - {column.desc}
                      </button>
                    ))
                }
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button className="animLink" onClick={this.resetColumnSettings}>Reset</button>
              <button className="animLink" onClick={this.hideColumnSettings}>Close</button>
            </Modal.Footer>
          </Modal>
        }
      </React.Fragment>
    );

    return (
      <div>
        <ToolkitProvider keyField="symbol" data={this.state.assets} columns={columns} columnToggle>
          {
            props => (
              <div>
                <CustomToggleList { ...props.columnToggleProps } />
                <BootstrapTable options={options} { ...props.baseProps }
                    condensed noDataIndication="Loading Assets" />
              </div>
            )
          }
        </ToolkitProvider>
      </div>
      
    );
  }

  updateSetting(dataField) {
    // console.log("in updateSetting");

    let columnsConfig = this.getColumnConfig();
    // console.log(columnsConfig);

    // console.log("in updateSetting for: ", dataField);
    // console.log("current setting for: ", dataField, " is: ", columnsConfig[dataField]);
    columnsConfig[dataField] = !columnsConfig[dataField];
    // console.log("new setting for: ", dataField, " is: ", columnsConfig[dataField]);

    // window.localStorage.setItem(constants.ASSETS_COLUMNS_KEY, JSON.stringify(columnsConfig));
    FavUtils.setColCache(JSON.stringify(columnsConfig));
    
    // console.log(this.getColumnConfig());
    // console.log("end of updateSetting");
  }

  getColumnConfig() {
    let columnsConfig = FavUtils.getColCache();
    if (!columnsConfig) {
      let initConfig = this.initConfig();
      return initConfig;
    }

    // make sure atleast one column is selected
    let finalConfig = JSON.parse(columnsConfig);
    let visibleColumns = 0;
    for (var key of Object.keys(finalConfig)) {
      if(finalConfig[key] === false) {
        visibleColumns++;
      }
    }

    if (visibleColumns === 0) {
      finalConfig["symbol"] = false;
      // window.localStorage.setItem(constants.ASSETS_COLUMNS_KEY, JSON.stringify(finalConfig));
      FavUtils.setColCache(JSON.stringify(finalConfig));
    }

    return finalConfig;
  }

  initConfig() {
    let columnsConfig = {};
    if (RespUtils.isMobileView()) {
      columnsConfig = {
        fav: false, index: true, logo:false, symbol: false, name: true,
        liquidity: true, volume: true, price: true,
        oraclePrice: true, priceSpread: true, apr: false,
        priceStdDevPercent: false, oraclePriceStdDevPercent: true,
        priceStdDev: true, oraclePriceStdDev: true, mintPosition: true, 
        poolPosition: true, usdPoolPosition: true, 
        lpStakedPosition: true,
      }
    } else if (RespUtils.isTabletView()) {
      columnsConfig = {
        fav: false, index: false, logo:false, symbol: false, name: true,
        liquidity: false, volume: true, price: true,
        oraclePrice: true, priceSpread: false, apr: false,
        priceStdDevPercent: false, oraclePriceStdDevPercent: false,
        priceStdDev: true, oraclePriceStdDev: true, mintPosition: true, 
        poolPosition: true, usdPoolPosition: true, 
        lpStakedPosition: true,
      }
    } else {
      columnsConfig = {
        fav: false, index: false, logo:false, symbol: false, name: false,
        liquidity: false, volume: false, price: false,
        oraclePrice: false, priceSpread: false, apr: false,
        priceStdDevPercent: false, oraclePriceStdDevPercent: false,
        priceStdDev: true, oraclePriceStdDev: true, mintPosition: true, 
        poolPosition: true, usdPoolPosition: true, 
        lpStakedPosition: true,
      }
    }

    FavUtils.setColCache(JSON.stringify(columnsConfig));
    return columnsConfig;
  }

  showColumnSettings() {
    // console.log("in showColumnSettings");
    if (this.state.showSettings === false) {
      this.setState({showSettings: true});
    } else {
      this.setState({showSettings: false});
    }
  }

  hideColumnSettings() {
    // console.log("in hideColumnSettings");
    this.setState({showSettings: false});
  }

  resetColumnSettings() {
    this.initConfig();
    this.setState({showSettings: false});
  }

  isHidden(dataField) {
    return this.getColumnConfig()[dataField];
  }

}
{/* <BootstrapTable keyField='symbol' data={this.state.assets}
columns={columns} options={options} { ...props.baseProps }
condensed noDataIndication="Loading Assets" /> */}
{/* 
  https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html?selectedKind=Column%20Toggle&selectedStory=Custom%20Column%20Toggle&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel
  <ToggleList { ...props.columnToggleProps } contextual="warning"
className="list-custom-class" btnClassName="list-btn-custom-class" /> */}

export default Assets;
