import React from "react";
import {ResponsiveContainer, ReferenceLine, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Label } from 'recharts';
import {BarChart, Bar } from 'recharts';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';

import '../styles/tsection.css';
import UIUtils from '../util/UIUtils';
import Utilities from '../util/Utilities';
import SPUtilities from '../util/SPUtilities';
import ChartUtils from '../util/ChartUtils';

class BidirectionalBarChart extends React.Component {
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

  renderBar() {
    // console.log("in render chart: " + (this.props.filter == true));
    // console.log(this.props);

    const CustomTooltip = ({ active, payload, label }) => {
      // console.log(active, "-", payload, "-", label);
      if (active) {
        if (payload === null || payload.length === 0) {
          return null;
        }

        let data = payload[0].payload;

        // return (
        //   <div className="custom-tooltip">
        //     <p className="label">{`${label} : ${payload[0].value}`}</p>
        //     <p className="desc">Anything you want can be displayed here.</p>
        //   </div>
        // );
        return this.props.customTooltip(data);
      }

      return null;
    };

    let width = UIUtils.getResponsiveWidth(this);
    // <Label value={this.props.xAxis} offset={-8} position="insideBottom"/>
    let height = UIUtils.getChartHeight(this);
    let showDataLabel = UIUtils.getShowDataLabel(this, this.props.data, 600);
    let barSize = 50;
    if (this.props.data.length > 25) {
      barSize = barSize * 25/this.props.data.length;
      if (barSize < 5) {
        barSize = 5;
      }
    }

    // console.log("height is: " + height);
     // domain={['auto', 'auto']}7773ba
     // <YAxis domain={Utilities.getRange(true, this.props.data, this.props.valueAttr)}>
     // <YAxis domain={this.props.range}>
     // {this.props.customTooltip != null ? <Tooltip content={this.props.customTooltip()}/> : <Tooltip/>}
    return (
      <div>
        <ResponsiveContainer width={width} height={height}>
          <BarChart data={this.props.data} barCategoryGap={2} stackOffset="sign"
                margin={{top: 5, right: 5, left: 15, bottom: 15}}>
            <CartesianGrid vertical={false} horizontal={false} strokeDasharray="3 3"/>
            <XAxis dataKey={this.props.xAxisValueAttr} angle={-10} stroke="black">
              <Label value={this.props.xAxis} offset={-3} position="insideBottom" />
            </XAxis>
            <YAxis domain={this.props.range} stroke="black">
              <Label value={this.props.yAxis} offset={8} position="insideBottomLeft" angle={-90} />
            </YAxis>
            {this.props.customTooltip != null ? <Tooltip content={<CustomTooltip />} /> : <Tooltip/>}
            <ReferenceLine y={0} stroke="black" strokeWidth="1" label={{ value: '0', angle: 0, position: 'center' }} />
            {showDataLabel && <Bar maxBarSize={50} strokeWidth={2} dataKey={this.props.valueAttr} fill="#8884d8" onClick={this.props.onClick} label={{ angle: -90, position: 'center' }}>
              {
                this.props.data.map((entry, index) => {
                	const color = entry[this.props.valueAttr] > 0 ? "green" : "red";
                	return <Cell fill={color} />;
                })
              }
            </Bar>}
            {!showDataLabel && <Bar maxBarSize={50} barSize={barSize} dataKey={this.props.valueAttr} fill="#8884d8" onClick={this.props.onClick}>
              {
                this.props.data.map((entry, index) => {
                  const color = entry[this.props.valueAttr] > 0 ? "green" : "red";
                  return <Cell fill={color} />;
                })
              }
            </Bar>}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  render () {
  	return (
      <div>
        <p className="compTitle">{this.props.title}</p>
        <p className="compSubTitle">{this.props.subtitle ? this.props.subtitle: ""}</p>
        {this.props.showTotalLabel ? Utilities.getTotalWithLabel(this.props.data, this.props.valueAttr, this.props.totalLabel) : ""}
        {this.renderBar()}
        {ChartUtils.getLandscapeMsg()}
      </div>
    );
  }
  // <p>Data for the latest window (hour or date) is partial. All times are in GMT.</p>

  truncDate(val) {
    return ChartUtils.truncDate(val, this.props.chartType, this.props.filter)
  }

}

export default BidirectionalBarChart;
