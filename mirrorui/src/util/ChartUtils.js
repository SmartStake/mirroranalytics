import React from 'react';
import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Label, Legend } from 'recharts';

import '../styles/tsection.css';

import Utilities from './Utilities';
import UIUtils from './UIUtils';
import RespUtils from './RespUtils';
import ChartTitle from '../components/ChartTitle';

class ChartUtils extends React.Component {

  static flipResponsive(thisObj) {
    if(thisObj.state.responsive) {
      // console.log("setting chart to not responsive")
      thisObj.setState({responsive: false});
    } else {
      // console.log("setting chart to responsive")
      thisObj.setState({responsive: true});
    }
  }

  static getLandscapeMsg() {
    let specialMessage = RespUtils.getSpecialMessage();
  }

  static truncDate(val, chartType, filter) {
    if (chartType == "hour" && filter != null) {
      return val.substring(11, 13) + ":00";
    }

    if (filter == null && val.length > 10) {
      return val.substring(0, 10);
    }

    return val;
  }

  static renderLines(thisObj, title, data, yAxisLabel, valueAttr1, valueAttr2, valueAttr3, subtitle) {
    let width = UIUtils.getResponsiveWidth(thisObj);
    let margin = UIUtils.getChartMargin(thisObj);
    // <YAxis domain={Utilities.getRange(true, data, rangeAttr)}>

    return (
      <div>
        <p className="compTitle">{title}</p>
        <p className="compSubTitle">{subtitle ? subtitle: ""}</p>
        <ResponsiveContainer width={width} height={250}>
          <LineChart data={data} margin={margin}>
            <XAxis dataKey="title" angle={-10} stroke="black">
              <Label value="Date" offset={-3} position="insideBottom" />
            </XAxis>
            <YAxis stroke="black">
              <Label value={yAxisLabel} offset={8} position="insideBottomLeft" angle={-90} />
            </YAxis>
            <Tooltip/>
            <Legend />
            <CartesianGrid vertical={false} horizontal={false} stroke="#eee" strokeDasharray="5 5"/>
            <Line type="monotone" dataKey={valueAttr1} connectNulls={true}
              label={false} strokeWidth={2} dot={false} stroke="red" />
            <Line type="monotone" dataKey={valueAttr2} connectNulls={true}
              label={false} strokeWidth={2} dot={false} stroke="green" />
            <Line type="monotone" dataKey={valueAttr3} connectNulls={true}
              label={false} strokeWidth={2} dot={false} stroke="blue" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  static render2Lines(thisObj, title, data, xAxisLabel, yAxisLabel, valueAttr1, valueAttr2, range, subtitle) {
    let width = UIUtils.getResponsiveWidth(thisObj);
    let margin = UIUtils.getChartMargin(thisObj);
    // console.log("width: ", width);
    // console.log("margin: ", margin);
    //Utilities.getRange(true, data, rangeAttr)
    return (
      <div>
        <p className="compTitle">{title}</p>
        <p className="compSubTitle">{subtitle ? subtitle: ""}</p>
        <ResponsiveContainer width={width} height={250}>
          <LineChart data={data} margin={margin}>
            <XAxis dataKey="title" angle={-10} stroke="black">
              <Label value={xAxisLabel} offset={-3} position="insideBottom" />
            </XAxis>
            <YAxis domain={range} stroke="black">
              <Label value={yAxisLabel} offset={8} position="insideBottomLeft" angle={-90} />
            </YAxis>
            <Tooltip/>
            <Legend />
            <CartesianGrid vertical={false} horizontal={false} stroke="#eee" strokeDasharray="5 5"/>
            <Line type="monotone" strokeWidth={2} dataKey={valueAttr1} connectNulls={true}
              label={false} dot={false} stroke="red" />
            <Line type="monotone" strokeWidth={2} dataKey={valueAttr2} connectNulls={true}
              label={false} dot={false} stroke="green" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  static renderMultiLines(thisObj, title, data, xAxisLabel, xAxisAttr, yAxisLabel, yAxisData,
    rangeAttr, subtitle, tooltip, handleChart, disableDay, statType, isOverallOnly) {

      let textColor = "white";
    let width = UIUtils.getResponsiveWidth(thisObj);
    let height = UIUtils.getResponsiveHeight(thisObj);
    let margin = UIUtils.getChartMargin(thisObj);
    let colors = ["#faa84b", "lightblue", "lightgreen", "lightgray", "yellow", "purple", "green", "blue", "red"];
    let index = -1;

    // <p>
    //   <b>
    //     <span align="left">{title}</span>
    //     <span className="buttonWithText"><span data-for="main" data-tip={tooltip} data-iscapture="true"><InfoIcon color="action"/></span></span>
    //   </b>
    // </p>
    return (
      <div>
        <ChartTitle title={title} tip={tooltip} handleChart={handleChart} disableDay={disableDay} 
          statType={statType} isOverallOnly={isOverallOnly} />
        <p className="compSubTitle">{subtitle ? subtitle: ""}</p>
        <ResponsiveContainer width={width} height={height}>
          <LineChart data={data} margin={margin}>
            <XAxis dataKey={xAxisAttr} angle={-10} stroke={textColor}>
              <Label value={xAxisLabel} offset={-3} position="insideBottom" style={{fill: textColor }} />
            </XAxis>
            <YAxis domain={Utilities.getRangeWithBase0(true, data, rangeAttr)} dx={6} stroke={textColor}>
              <Label value={yAxisLabel} offset={8} position="insideBottomLeft" angle={-90} style={{fill: textColor }} />
            </YAxis>
            <Tooltip/>
            <CartesianGrid vertical={false} horizontal={false} stroke={textColor} strokeDasharray="5 5"/>
            {
              yAxisData.map((id) => {
               index++;
               return (<Line type="monotone" key={colors[index]} dataKey={id} strokeWidth={3} connectNulls={true}
                   label={false} dot={false} stroke={colors[index]} />)
              })
            }

          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

}

export default ChartUtils;
