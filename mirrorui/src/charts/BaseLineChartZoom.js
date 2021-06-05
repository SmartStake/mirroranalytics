import React from "react";
import {ResponsiveContainer, ReferenceArea, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label } from 'recharts';
  
import UIUtils from '../util/UIUtils';
import Utilities from '../util/Utilities';
import ChartUtils from '../util/ChartUtils';

import "./charts.css";
import ChartTitle from "../components/ChartTitle";


class BaseLineChartZoom extends React.Component {
  constructor(props) {
    super(props);
    // console.log(this.props.data);
    this.state = {
        data: [],
        lineColor: "#faa84b",
        refAreaLeft: '',
        refAreaRight: '',
        left: 'dataMin',
        right: 'dataMax',
        top: 'dataMax+1',
        bottom: 'dataMin-1',
        top2: 'dataMax+20',
        bottom2: 'dataMin-20',
        animation: true,
    }
    this.getAxisYDomain = this.getAxisYDomain.bind(this);
    
  }

  async componentDidMount() {
    // console.log("in componentDidMount");
    // console.log(this.props.data);
    this.setState({data: this.props.data});
  }

  getAxisYDomain(from, to, ref, offset) {
    // console.log("in getAxisYDomain");
    // console.log("from: ", from, ", to: ", to, ", ref: ", ref, ", offset: ", offset);

    let newData = [];
    let fromDate = new Date(from);
    let toDate = new Date(to);
    // console.log("calculating data: ", this.props.xAxisValueAttr);
    // console.log(this.props.data.length);
    for (let i=0; i < this.props.data.length; i++) {
        // console.log("i: ", this.props.data[i]);
        let currentDate = new Date(this.props.data[i][this.props.xAxisValueAttr]);
        // console.log(currentDate);
        if (currentDate >= fromDate && currentDate <= toDate) {
            // console.log(i, ": adding record");
            newData.push(this.props.data[i]);
        } 
    }
    // console.log("newData is: ");
    // console.log(newData);
    const refData = newData;
    // const refData = this.props.data.slice(from - 1, to);
    let [bottom, top] = [refData[0][ref], refData[0][ref]];
    refData.forEach((d) => {
      if (d[ref] > top) top = d[ref];
      if (d[ref] < bottom) bottom = d[ref];
    });
  
    return [(bottom | 0) - offset, (top | 0) + offset];
  };

  zoom() {
    let { refAreaLeft, refAreaRight } = this.state;
    const { data } = this.state;

    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      this.setState(() => ({
        refAreaLeft: '',
        refAreaRight: '',
      }));
      return;
    }

    // xAxis domain
    if (refAreaLeft > refAreaRight) [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

    // yAxis domain
    const [bottom, top] = this.getAxisYDomain(refAreaLeft, refAreaRight, this.props.valueAttr, 1);
    const [bottom2, top2] = this.getAxisYDomain(refAreaLeft, refAreaRight, this.props.valueAttr, 50);

    this.setState(() => ({
      data: data.slice(),
      refAreaLeft: '',
      refAreaRight: '',
      left: refAreaLeft,
      right: refAreaRight,
      top,
      bottom,
      top2,
      bottom2,
    }));
  }

  zoomOut() {
    const { data } = this.state;
    this.setState(() => ({
      data: data.slice(),
      refAreaLeft: '',
      refAreaRight: '',
      left: 'dataMin',
      right: 'dataMax',
      top: 'dataMax+1',
      bottom: 'dataMin',
      top2: 'dataMax+50',
      bottom2: 'dataMin+50',
    }));
  }  

  renderLine() {
    const { data, left, right, refAreaLeft, refAreaRight, top, bottom, top2, bottom2 } = this.state;

    // console.log("in render chart: " + (this.props.filter == true));
    // console.log(this.state);
    let textColor = "white";
    let lineColor = this.state.lineColor;

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
        <button type="button" className="btn update" onClick={this.zoomOut.bind(this)}>
          Zoom Out
        </button>
        <ResponsiveContainer width={width} height={height}>
          <LineChart data={data} onMouseDown={(e) => this.setState({ refAreaLeft: e.activeLabel })}
            onMouseMove={(e) => this.state.refAreaLeft && this.setState({ refAreaRight: e.activeLabel })}
            // eslint-disable-next-line react/jsx-no-bind
            onMouseUp={this.zoom.bind(this)}
            margin={{top: 10, right: 0, left: 5, bottom: 0}}>
            <CartesianGrid vertical={false} horizontal={false} strokeDasharray="3 3"/>
            <XAxis allowDataOverflow domain={[left, right]} type="category" dataKey={this.props.xAxisValueAttr} stroke={textColor} padding={{ top: 10 }}>
  {/*             <Label value={this.props.xAxis} offset={-5} position="insideBottom" style={{fill: textColor }} /> */}
            </XAxis>
            <YAxis allowDataOverflow domain={[bottom, top]} type="number" yAxisId="1" stroke={textColor}>
  {/*           <Label value={this.props.yAxis} offset={8} position="insideBottomLeft" angle={-90} style={{fill: textColor }} /> */}
            </YAxis>
            <Tooltip labelStyle={ {color: 'black'}} />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
            {showDataLabel && <Line yAxisId="1" type="natural" animationDuration={300} type="monotone" dataKey={this.props.valueAttr} strokeWidth={3} dot={false} stroke={lineColor} label={{ angle: -90, position: 'center' }}/> }
            {!showDataLabel && <Line yAxisId="1" type="natural" animationDuration={300} type="monotone" dataKey={this.props.valueAttr} strokeWidth={3} dot={false} stroke={lineColor} /> }
            {refAreaLeft && refAreaRight ? (
              <ReferenceArea yAxisId="1" x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />
            ) : null}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
  // domain={Utilities.getRange(true, this.props.data, this.props.valueAttr)}

  // {this.props.showDateRange === true &&
  render () {
    // const selectionRange = {
    //   startDate: new Date(),
    //   endDate: new Date(),
    //   key: 'selection',
    // }
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

}

export default BaseLineChartZoom;
