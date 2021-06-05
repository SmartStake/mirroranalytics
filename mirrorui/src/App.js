import React, { Component } from "react";
// import Routes from './Routes-auth';
import {BrowserRouter as Router} from 'react-router-dom';
import Fullscreen from "react-full-screen";

import "./App.css";
import "./styles/mirror.css";
import DefaultRoutes from './DefaultRoutes';
import NavBar from './mirror/NavBar';
import Footer from './base/Footer';
import config from './config';
import Contact from "./base/Contact";
// import { withAuthenticator } from 'aws-amplify-react'; // or 'aws-amplify-react-native';

// FIXME TODO removed margin from react-bootstrap-table-pagination

class App extends Component {
  constructor(props) {
		super(props);

		this.state = {
      isFull: false,
		};

	}

  componentDidCatch(error, errorInfo) {
    // Catch errors in any child components and re-renders with an error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

	async componentDidMount() {
     // loadReCaptcha();
	}

  goFull = () => {
    this.setState({ isFull: !this.state.isFull });
  }

  getNonProdWarning() {
    if (config.apiGateway.ENV == "prod") {
      return "";
    }

    return "";
    // return (<div className="headerWarning"><p/><p/>This is a test website. Contact the website operator to report the issue.</div>);
  }

  render() {
    if (this.state.error) {
      // Fallback UI if an error occurs
      console.log(this.state.error);
      console.log(this.state.errorInfo.componentStack);
      return (
       <div>
         <h3>{"Oh-no! Something went wrong"}</h3>
         <p className="red">Please <a href="javascript:location.reload(true);">reload</a> the screen and try again. Please contact the website operator <a href='https://t.me/SmartStake'>here</a> if the issue persists.</p>
         <p align="center"><a href="javascript:window.location='/'">Home</a>&nbsp;&nbsp;&nbsp;<a href="javascript:window.location.reload(true);">Reload</a></p>
       </div>
      );
    }

    return this.renderDefaultContainer();
  }

  // setupAnalytics() {
  //   ReactGA.initialize(config.apiGateway.GA_ID);
  //   ReactGA.pageview('/');
  //   const history = createBrowserHistory();
  //
  //   // Initialize google analytics page view tracking
  //   history.listen(location => {
  //     ReactGA.set({ page: location.pathname }); // Update the user's current page
  //     ReactGA.pageview(location.pathname); // Record a pageview for the given page
  //   });
  //
  //   return history;
  // history={this.setupAnalytics()}
  // }

  renderDefaultContainer() {
    document.title = "Mirror Analytics";

    const childProps = {
		};

    return (
      <Router>
        <Fullscreen enabled={this.state.isFull} onChange={isFull => this.setState({isFull})} >
          <div className="App">
            <div id="outer-container" className="divWithText">
              <NavBar {...childProps} handleLogout={this.handleLogout} onFullScreen={this.goFull}/>
              <main id="page-wrap">
                {this.getNonProdWarning()}
                <DefaultRoutes childProps={childProps} />
              </main>
              <Footer/>
            </div>
          </div>
        </Fullscreen>
      </Router>
    );
  }
}
export default App;

// {/* <Contact /> */}
