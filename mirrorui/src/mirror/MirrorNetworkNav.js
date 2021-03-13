import React from 'react';
import Table from 'react-bootstrap/Table';

class MirrorNetworkNav extends React.Component {
  render() {
    return (
      <div width="90%">
        <hr/>
        <Table striped bordered hover variant="dark" >
          <thead>
            <tr>
              <th><a className="white-a" href="/stats">Network Stats</a></th>
              <th><a className="white-a" href="/history">Supply Change History</a></th>
            </tr>
          </thead>
        </Table>
      </div>
    );
  }
}
// <th><a className="white-a" href="/calc">Rewards Calculator</a></th>


export default MirrorNetworkNav;
