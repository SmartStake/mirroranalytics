import React, { Component } from 'react';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

import constants from "../constants";

class FavIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.favourite = this.favourite.bind(this);
    this.unfavourite = this.unfavourite.bind(this);
  }

  unfavourite(e) {
    // console.log("in unfavourite: ");
    // console.log(this.props.id);
    this.props.thisObj.unfavourite(this.props.id);
  }

  favourite(e) {
    // console.log("in favourite: ");
    // console.log(this.props.id);
    this.props.thisObj.favourite(this.props.id);
  }

  render() {
    // console.log(this.props.thisObj.unfavourite);
    if(this.props.isFav === true) {
      return (<FavoriteIcon htmlColor={constants.colors.text} onClick={this.unfavourite} 
        id={this.props.id} />);
    }

    return (<FavoriteBorderIcon htmlColor={constants.colors.text} onClick={this.favourite} 
      id={this.props.id} />);
  }
}
// return (<span onClick={ onClick }><img src={"/images/heart.png"} title="Favorite. Click to remove from Favorites"
// className="imgicon" width="16" height="16" onClick={formatExtraData.unfavourite} id={row[FavUtils.getIdField()]} /></span>);
// } else {
// return (<span onClick={ onClick }><img src={"/images/heart-outline.png"} title="Not Favorite. Click to add to Favorites"
// className="imgicon" width="16" height="16" onClick={formatExtraData.favourite} id={row[FavUtils.getIdField()]} /></span>);


export default FavIcon;
