import React from "react";
import {ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Label } from 'recharts';
import {AreaChart, Area} from 'recharts';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';

import UIUtils from '../util/UIUtils';
import Utilities from '../util/Utilities';
import SPUtilities from '../util/SPUtilities';
import ChartUtils from '../util/ChartUtils';

class BaseAreaChart extends React.Component {
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


  renderAreaChart() {
    let width = UIUtils.getResponsiveWidth(this);
    let height = UIUtils.getChartHeight(this);
    let showDataLabel = UIUtils.getShowDataLabel(this, this.props.data, 600);

    return (
      <div>
        <ResponsiveContainer width={width} height={height}>
          <AreaChart data={this.props.data} barCategoryGap={2}
                margin={{top: 5, right: 5, left: 15, bottom: 15}}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="title" angle={-10}>
              <Label value={this.props.xAxis} offset={-3} position="insideBottom" />
            </XAxis>
            <YAxis domain={Utilities.getRange(true, this.props.data, this.props.valueAttr)}>
              <Label value={this.props.yAxis} offset={8} position="insideBottomLeft" angle={-90} />
            </YAxis>
            <Tooltip/>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
            {showDataLabel && <Area dataKey={this.props.valueAttr} fill="#8884d8" label={{ angle: -90, position: 'center' }}/> }
            {!showDataLabel && <Area dataKey={this.props.valueAttr} fill="#8884d8" /> }
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  render () {
  	return (
      <div>
        <b><span align="left">{this.props.title}</span></b>
        <p/>
        <div align="center">
          {this.props.showTotalLabel ? Utilities.getTotalWithLabel(this.props.data, this.props.valueAttr, this.props.totalLabel) : ""}
          {this.props.subtitle}
          {this.renderAreaChart()}
        </div>
        {ChartUtils.getLandscapeMsg()}
      </div>
    );
  }

  truncDate(val) {
    return ChartUtils.truncDate(val, this.props.chartType, this.props.filter)
  }

}

export default BaseAreaChart;
