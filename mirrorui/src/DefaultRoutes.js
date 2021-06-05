import { Route, Switch } from 'react-router-dom';
import React from 'react';

import UnauthRoute from "./util/UnauthRoute";

import Home from './mirror/Home';
import Assets from './mirror/Assets';
import Asset from './mirror/Asset';

export default ({ childProps }) => (
	<Switch>
		<UnauthRoute exact={true} path='/' component={Home} props={childProps} />
		<UnauthRoute exact={true} path='/assets' component={Assets} props={childProps} />
		<UnauthRoute path='/asset/:ticker' component={Asset} props={childProps} />

		{/* Finally, catch all unmatched routes */}
		<Route component={Home} />
	</Switch>
);
