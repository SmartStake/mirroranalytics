import React from 'react';

import "./Footer.css";

class Footer extends React.Component {
  render() {
    if ( window.location !== window.parent.location ) {
      return <p>Powered by SmartStake.io</p>;
    }

    return (
      <div className="compFooter">
        <div className="leftFooter">
          <a href="http://t.me/SmartStake" class="fa fa-telegram fa-lg"/>&nbsp;&nbsp;&nbsp;
          <a href="https://twitter.com/SmartStake" class="fa fa-twitter fa-lg"/>
        </div>
        <div className="rightFooter">
          Powered by &nbsp;
          <a class="black-a" href="https://www.SmartStake.io">
            <img width="16px" height="16px" src="images/smartstake.png" />
          </a>
          &nbsp;
          <a class="black-a" href="https://www.SmartStake.io">Smart Stake</a>
        </div>
      </div>
    );
  }
}

export default Footer;
