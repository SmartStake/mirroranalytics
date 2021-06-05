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
        <div className="compTitle">
          <div className="leftAlignComp">{this.props.title}
            &nbsp;
            {MirrorUtils.getNetwork(this, true)}
          </div>
          <div className="middleComp">
            {this.addDay()}
            <button onClick={this.handleChart} value="W" className="animLink">W</button>
            <button onClick={this.handleChart} value="M" className="animLink">M</button>
            <button onClick={this.handleChart} value="Y" className="animLink">Y</button>
            <button onClick={this.handleChart} value="All" className="animLink">All</button>
          </div>
          <div className="rightAlignComp"><Tooltip tip={this.props.tip} /></div>
        </div>
    );
  }

  addDay() {
    // console.log(this.props.disableDay);
    if (this.props.disableDay === 'false') {
      return (<button onClick={this.handleChart} value="D" className="animLink">D</button>);
    }
    
    return "";
  }

  handleChart(e) {
    // alert(e.target.value);
    this.props.handleChart(e.target.value);
  }
}

export default ChartTitle;
