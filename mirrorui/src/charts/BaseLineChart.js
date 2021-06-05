import React from "react";
import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label } from 'recharts';

import SPCalc from '../util/SPCalc';
import UIUtils from '../util/UIUtils';
import Utilities from '../util/Utilities';
import ChartUtils from '../util/ChartUtils';

import "./charts.css";
import ChartTitle from "../components/ChartTitle";


class BaseLineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      responsive: true,
      lineColor: "#faa84b",
    }

    this.flipResponsive = this.flipResponsive.bind(this);
    this.truncDate = this.truncDate.bind(this);
  }

  flipResponsive() {
    ChartUtils.flipResponsive(this);
  }

  renderLine() {
    // console.log("in render chart: " + (this.props.filter == true));
    // console.log(this.props);
    let textColor = "white";
    let lineColor = this.state.lineColor;

    let width = UIUtils.getResponsiveWidth(this);
    // <Label value={this.props.xAxis} offset={-8} position="insideBottom"/>
    let height = UIUtils.getChartHeight(this);
    let showDataLabel = UIUtils.getShowDataLabel(this, this.props.data, 600);

    // console.log("height is: " + height);
    // domain={['auto', 'auto']}7773ba
    let range = this.props.range;
    if (this.props.range === null) {
      range = Utilities.getRangeWithBase0(true, this.props.data, this.props.valueAttr);
    } else if (this.props.zoomedRange === true) {
      range = Utilities.getRange(true, this.props.data, this.props.valueAttr);
      // console.log("range: ", range)
    }
    // let range = Utilities.getRangeWithZoom(true, data, rangeAttr, thisObj);

    const CustomTooltip = ({ active, payload, label }) => {
      // console.log(active, "-", payload, "-", label);
      if (active) {
        if (payload === null || payload.length === 0) {
          return null;
        }

        let data = payload[0].payload;
        return this.customTooltip(data);
      }

      return null;
    };

    // {this.props.range == null && <YAxis stroke={textColor} domain={[0, 'auto']}><Label value={this.props.yAxis} offset={8} position="insideBottomLeft" angle={-90} /></YAxis>}
    return (
      <div>
        <ResponsiveContainer width={width} height={height}>
          <LineChart data={this.props.data}
            margin={{top: 10, right: 10, left: 15, bottom: 0}}>
            <CartesianGrid vertical={false} horizontal={false} strokeDasharray="3 3"/>
            <XAxis dataKey={this.props.xAxisValueAttr} stroke={textColor} padding={{ top: 10 }}>
  {/*             <Label value={this.props.xAxis} offset={-5} position="insideBottom" style={{fill: textColor }} /> */}
            </XAxis>
            {this.props.formatValues && <YAxis stroke={textColor} domain={range} tickFormatter={SPCalc.formatNumberValue} /> }
            {!this.props.formatValues && <YAxis stroke={textColor} domain={range} /> }
            {this.props.formatValues != null ? <Tooltip content={<CustomTooltip labelStyle={ {color: 'black'}} />} /> : <Tooltip labelStyle={ {color: 'black'}} />}
            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
            {showDataLabel && <Line type="monotone" dataKey={this.props.valueAttr} strokeWidth={3} dot={false} stroke={lineColor} label={{ angle: -90, position: 'center' }}/> }
            {!showDataLabel && <Line type="monotone" dataKey={this.props.valueAttr} strokeWidth={3} dot={false} stroke={lineColor} /> }
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
  // domain={Utilities.getRange(true, this.props.data, this.props.valueAttr)}
  // {/*           <Label value={this.props.yAxis} offset={8} position="insideBottomLeft" angle={-90} style={{fill: textColor }} /> */}
  // 
  // {this.props.showDateRange === true &&
  render () {
    const selectionRange = {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    }
    // {<DateRangePicker ranges={[selectionRange]} onChange={this.handleSelect} months={2} />}
    return (
      <div>
        <ChartTitle title={this.props.title} tip={this.props.tip} handleChart={this.props.handleChart} disableDay={this.props.disableDay} 
          disableWeek={this.props.disableWeek} statType={this.props.statType} isOverallOnly={this.props.isOverallOnly} />
        <p/>
        <div align="center">
          {this.props.showTotalLabel ? Utilities.getTotalWithLabel(this.props.data, this.props.valueAttr, this.props.totalLabel) : ""}
          {this.props.subtitle && <p className="compSubTitle">{this.props.subtitle}</p> }
          {this.renderLine()}
        </div>
        {ChartUtils.getLandscapeMsg()}
      </div>
    );
  }
  // <p>Data for the latest window (hour or date) is partial. All times are in GMT.</p>

  truncDate(val) {
    return ChartUtils.truncDate(val, this.props.chartType, this.props.filter)
  }

  customTooltip(row) {
    // console.log(row);

    return (<div style={{"margin": "15px", "padding": "15px"}}>
        <table><tbody>
          <tr>
            <th>Date:</th>
            <th>{row[this.props.xAxisValueAttr]}</th>
          </tr>
          <tr>
            <th><font color={this.state.lineColor}>{this.props.valueAttr}:</font></th>
            <th><font color={this.state.lineColor}>{SPCalc.formatNumberValue(row[this.props.valueAttr])}</font></th>
          </tr>
        </tbody></table>
      </div>);
  }
}

export default BaseLineChart;
