import React from "react";
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';
import {ReactComponent as Logo} from "../images/Logo.svg";

import './NavBar.css';

class NavBar extends React.Component {
  constructor(props) {
		super(props);

		this.state = {
      username: "",
		};
	}

	async componentDidMount() {
	}

  showSettings (event) {
    event.preventDefault();
  }

  // {/* <object type="image/svg+xml" data="https://upload.wikimedia.org/wikipedia/commons/b/bd/Test.svg" width="400" height="600"> */}

  render() {
    return (
      <Navbar collapseOnSelect expand="lg" variant="light" sticky="top" className="customNavBar">
        <Navbar.Brand href="/"><img src="/images/logo.png" id = "mainLogo"
        className="d-inline-block align-top" alt="Mirror Analytics"
        /><span className="mainTitle">Mirror Analytics</span></Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="customNavbarToggle" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" className="customNavBar">
            <Nav.Link eventKey={1.10} className="customNavLink" href="/">Home</Nav.Link>
            {/* <Nav.Link eventKey={1.11} className="customNavLink" href="/history">MAssets</Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }

}

export default NavBar;
// <NavDropdown.Item href="/richdel">Rich Delegates</NavDropdown.Item>

// <Navbar.Toggle aria-controls="basic-navbar-nav" />
// <Navbar.Collapse id="basic-navbar-nav">
//   <Nav className="mr-auto">
//     <Nav.Link eventKey={1.12} href="/"></Nav.Link>
//   </Nav>
// </Navbar.Collapse>
//
// <NavDropdown.Item href="/stats">Network Stats</NavDropdown.Item>
