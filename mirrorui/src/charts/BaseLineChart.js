import React from "react";
import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label } from 'recharts';

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
    let lineColor = "#faa84b";

    let width = UIUtils.getResponsiveWidth(this);
    // <Label value={this.props.xAxis} offset={-8} position="insideBottom"/>
    let height = UIUtils.getChartHeight(this);
    let showDataLabel = UIUtils.getShowDataLabel(this, this.props.data, 600);

    // console.log("height is: " + height);
    // domain={['auto', 'auto']}7773ba
    let range = this.props.range;
    if (this.props.range == null) {
      range = Utilities.getRangeWithBase0(true, this.props.data, this.props.valueAttr);
    }

    // {this.props.range == null && <YAxis stroke={textColor} domain={[0, 'auto']}><Label value={this.props.yAxis} offset={8} position="insideBottomLeft" angle={-90} /></YAxis>}
    return (
      <div>
        <ResponsiveContainer width={width} height={height}>
          <LineChart data={this.props.data}
            margin={{top: 5, right: 5, left: 15, bottom: 15}}>
            <CartesianGrid vertical={false} horizontal={false} strokeDasharray="3 3"/>
            <XAxis dataKey={this.props.xAxisValueAttr} angle={-10} stroke={textColor}>
              <Label value={this.props.xAxis} offset={-3} position="insideBottom" style={{fill: textColor }} />
            </XAxis>
            <YAxis stroke={textColor} domain={range}>
              <Label value={this.props.yAxis} offset={8} position="insideBottomLeft" angle={-90} style={{fill: textColor }} />
            </YAxis>
            <Tooltip/>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
            {showDataLabel && <Line type="monotone" dataKey={this.props.valueAttr} strokeWidth={3} dot={false} stroke={lineColor} label={{ angle: -90, position: 'center' }}/> }
            {!showDataLabel && <Line type="monotone" dataKey={this.props.valueAttr} strokeWidth={3} dot={false} stroke={lineColor} /> }
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
  // domain={Utilities.getRange(true, this.props.data, this.props.valueAttr)}

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
          statType={this.props.statType} isOverallOnly={this.props.isOverallOnly} />
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

}

export default BaseLineChart;
