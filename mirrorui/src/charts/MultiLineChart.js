import React, { useState } from "react";
import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label, Legend } from 'recharts';

import SPCalc from '../util/SPCalc';
import UIUtils from '../util/UIUtils';
import Utilities from '../util/Utilities';
import ChartUtils from '../util/ChartUtils';

import "./charts.css";
import ChartTitle from "../components/ChartTitle";


class MultiLineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      responsive: true,
      lineColor: "#faa84b",
      lineProps: [],
      lineHover: null,
    }

    this.flipResponsive = this.flipResponsive.bind(this);
    // this.setLineProps = this.setLineProps.bind(this);
  }

  flipResponsive() {
    ChartUtils.flipResponsive(this);
  }

  async componentDidMount() {
    let lineProps = {};
    
    for(let i=0; i < this.props.valueAttr.length; i++) {
      let value = this.props.valueAttr[i];
      lineProps[value] = true;
    }

    this.setState({lineProps: lineProps});
  }

  // setLineProps(props, key, hover) {
  //   console.log("start of setLineProps: props: ", props, ", key: ", key, "hover: ", hover);
  //   let lineProps = this.props.valueAttr.reduce((a, { key }) => {
  //       a[key] = false;
  //       return a;
  //       },
  //       { hover: null }
  //   );
  //   console.log("after reduce: lineProps: ", lineProps);

  //   console.log("end of setLineProps: props: ", props, ", key: ", key, "hover: ", hover);
  //   this.setState({lineProps: lineProps});
  // }

  // setLineProps(props, key, hover) {
  //   console.log("start of setLineProps: props: ", props, ", key: ", key, "hover: ", hover);
  //   let lineProps = this.props.valueAttr.reduce((a, { key }) => {
  //       a[key] = false;
  //       return a;
  //       },
  //       { hover: null }
  //   );
  //   console.log("after reduce: lineProps: ", lineProps);

  //   console.log("end of setLineProps: props: ", props, ", key: ", key, "hover: ", hover);
  //   this.setState({lineProps: lineProps});
  // }

  renderLines() {
    let textColor = "white";
    let width = UIUtils.getResponsiveWidth(this);
    let height = UIUtils.getChartHeight(this);
    let colors = ["#faa84b", "lightblue", "lightgreen", "lightgray", "yellow", "purple", "green", "blue", "red"];
    let index = -1;
    // const BarGraph = ({title, dataKey, oxLabel, oyLabel, values, yLimit, labels}) => {

    // const [lineProps, setLineProps] = useState(
    //   this.props.valueAttr.reduce(
    //       (a, { key }) => {
    //       a[key] = false;
    //       return a;
    //       },
    //       { hover: null }
    //   )
    // );

    const handleLegendMouseEnter = (e) => {
      // console.log(e)
      // console.log(e.dataKey);
      // if (!this.state.lineProps[e.dataKey]) {
      //     this.setLineProps({ ...this.state.lineProps, hover: e.dataKey });
      // }
      this.setState({lineHover: e.dataKey});

    };

    const handleLegendMouseLeave = (e) => {
      // this.setLineProps({ ...this.state.lineProps, hover: null });
      this.setState({lineHover: null});
    };

    const selectLine = (e) => {
      // console.log("in select line");
      // console.log(e);
      // for
      // this.setLineProps({
      //     ...this.state.lineProps,
      //     [e.dataKey]: !this.props.valueAttr[e.dataKey],
      //     hover: null
      // });
      let lineProps = this.state.lineProps;
      // console.log("selectLine: starting lineProps: ", lineProps);
      let selectedItem = e.dataKey;
      // console.log("selectedItem: ", selectedItem);

      let itemVisibility = lineProps[selectedItem];
      // console.log("itemVisibility: ", itemVisibility);

      itemVisibility = !itemVisibility;
      // console.log("new itemVisibility: ", itemVisibility);
      lineProps[selectedItem] = itemVisibility;
      // console.log("ending lineProps: ", lineProps);
    
      // for(let i=0; i < lineProps.length; i++) {
      //   let currentItem = lineProps[i];
      //   // console.log
      //   if (currentItem )
      //   lineProps[value] = true;
      // }
  
      this.setState({lineProps: lineProps});
  
    };
    

    const CustomTooltip = ({ active, payload, label }) => {
      // console.log(active, "-", payload, "-", label);
      if (active) {
        if (payload === null || payload.length === 0) {
          return null;
        }

        let data = payload[0].payload;
        let tooltipIndex = -1;

        return (<div style={{"margin": "15px", "padding": "15px"}}>
            <table><tbody>
              <tr>
                <th>{this.props.xAxis}:</th>
                <th>{data[this.props.xAxisValueAttr]}</th>
              </tr>
              {
                this.props.valueAttr.map((id) => {
                    tooltipIndex++;
                    return (
                      <tr>
                        <th><font color={colors[tooltipIndex]}>{id}:</font></th>
                        <th><font color={colors[tooltipIndex]}>{SPCalc.formatNumberValue(data[id])}</font></th>
                      </tr>
                    )
                })
              }
            </tbody></table>
          </div>);
      }

      return null;
    };

    let range = Utilities.getRangeWithZoom(true, this);

    // {this.props.range == null && <YAxis stroke={textColor} domain={[0, 'auto']}><Label value={this.props.yAxis} offset={8} position="insideBottomLeft" angle={-90} /></YAxis>}
    return (
      <div>
        <ResponsiveContainer width={width} height={height}>
          <LineChart data={this.props.data}
            margin={UIUtils.getChartMargin(this)}>
            <CartesianGrid vertical={false} horizontal={false} stroke={textColor} strokeDasharray="3 3"/>
            <XAxis dataKey={this.props.xAxisValueAttr} stroke={textColor} padding={{ top: 10 }} />
            {this.props.formatValues != null ? <YAxis stroke={textColor} tickFormatter={SPCalc.formatNumberValue} domain={range} /> : <YAxis stroke={textColor} domain={range} />}
            {this.props.formatValues != null ? <Tooltip content={<CustomTooltip labelStyle={ {color: 'black'}} />} /> : <Tooltip labelStyle={ {color: 'black'}} />}
            {
              this.props.valueAttr.map((id) => {
                // console.log(id, " : ", this.state.lineHover);
                // console.log(Number(this.state.lineHover === id || !this.state.lineHover ? 1 : 0.6))
                index++;
                return (<Line type="monotone" key={colors[index]} dataKey={id} strokeWidth={3} connectNulls={true}
                  hide={this.state.lineProps[id] === false} opacity={Number(this.state.lineHover === id || !this.state.lineHover ? 1 : 0.3)}
                  label={false} dot={false} stroke={colors[index]} />)
              })
            }
            <Legend onClick={selectLine} onMouseOver={handleLegendMouseEnter} onMouseOut={handleLegendMouseLeave} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
  // hide={this.state.lineProps[id] === false} fillOpacity={Number(this.state.lineHover === id || !this.state.lineHover ? 1 : 0.6)}
  // domain={Utilities.getRange(true, this.props.data, this.props.valueAttr)}
  // {/*           <Label value={this.props.yAxis} offset={8} position="insideBottomLeft" angle={-90} style={{fill: textColor }} /> */}
  // 
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
          statType={this.props.statType} isOverallOnly={this.props.isOverallOnly} disableWeek={this.props.disableWeek} />
        <p/>
        <div align="center">
          {this.props.subtitle && <p className="compSubTitle">{this.props.subtitle}</p> }
          {this.renderLines()}
        </div>
        {ChartUtils.getLandscapeMsg()}
      </div>
    );
  }

}

export default MultiLineChart;
