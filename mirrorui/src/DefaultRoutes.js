import { Route, Switch } from 'react-router-dom';
import React from 'react';

import UnauthRoute from "./util/UnauthRoute";

import Home from './mirror/Home';

export default ({ childProps }) => (
	<Switch>
		<UnauthRoute exact={true} path='/' component={Home} props={childProps} />

		{/* Finally, catch all unmatched routes */}
		<Route component={Home} />
	</Switch>
);
