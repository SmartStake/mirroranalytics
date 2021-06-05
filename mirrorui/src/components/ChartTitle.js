import React, { Component } from 'react';
import MirrorUtils from '../mirror/MirrorUtils';
import Tooltip from './Tooltip';

class ChartTitle extends Component {
  constructor(props) {
    super(props);
    this.handleChart = this.handleChart.bind(this);
  }

  render() {
    return (
      <div className="chartHeader">
        <div className="chartTitle">{this.props.title}
          &nbsp;
          <span> {MirrorUtils.getNetwork(this, true)} </span>
          <div className="chartTooltip"><Tooltip tip={this.props.tip} /></div>
        </div>
        <div className="timeframePicker">
          {this.addDay()}
          {this.addWeek()}
          <button onClick={this.handleChart} value="M" className="animLink">M</button>
          <button onClick={this.handleChart} value="Y" className="animLink">Y</button>
          <button onClick={this.handleChart} value="All" className="animLink">All</button>
        </div>
      </div>
    );
  }

  addDay() {
    // console.log(this.props.disableDay);
    if (this.props.disableDay === 'false' || this.props.disableDay === false) {
      return (<button onClick={this.handleChart} value="D" className="animLink">D</button>);
    }
    
    return "";
  }

  addWeek() {
    // console.log(this.props.disableDay);
    if (this.props.disableWeek === 'false' || this.props.disableWeek === false) {
      return (
        <button onClick={this.handleChart} value="W" className="animLink">W</button>
      );
    }
    
    return "";
  }



  handleChart(e) {
    // alert(e.target.value);
    this.props.handleChart(e.target.value);
  }
}

export default ChartTitle;
