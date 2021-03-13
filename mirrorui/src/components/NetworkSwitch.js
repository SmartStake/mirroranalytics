import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
// import { makeStyles } from '@material-ui/core/styles';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

//   background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
const useStyles = theme => ({
    selected: {
        // background: 'linear-gradient(45deg, #faa84b 30%, #faa84b 90%)',
        background: 'linear-gradient(45deg, #ffffff 30%, #ffffff 90%)',
        color: 'black!important',
        border: '2px solid #2d4075',
    },
});

class NetworkSwitch extends Component {
    handleNetworkChange = (event, newNetwork) => {
        // console.log(event);
        // console.log(newNetwork);
        if (newNetwork != null) {
            this.props.handleNetworkChange(newNetwork);
        }
    }

    render() {
        // const classes = useStyles();
        const { classes } = this.props;

        // console.log("in NetworkSwitch: ", this.props.statType);
        return (
            <ToggleButtonGroup size="small" value={this.props.statType} exclusive 
                onChange={this.handleNetworkChange}>
                <ToggleButton value="COMBINE" classes={{selected: classes.selected, }}>
                    All
                </ToggleButton>
                <ToggleButton value="TERRA" classes={{selected: classes.selected, }}>
                    Terra
                </ToggleButton>
                <ToggleButton value="ETH" classes={{selected: classes.selected, }}>
                    ETH
                </ToggleButton>
            </ToggleButtonGroup>
        );
    }
}

// export default NetworkSwitch;
export default withStyles(useStyles)(NetworkSwitch)