import React from 'react';
import FavIcon from '../components/FavIcon';

import config from '../config';
import constants from '../constants';
import RespUtils from './RespUtils';

class FavUtils extends React.Component {
  static mirror = {"defaultView": "defaultView",
    "idField": "assetId",
    "favKey": "favPools",
  };

  static getDefaultViewKey() {
      return FavUtils.mirror.defaultView;
  }

  static getIdField() {
    return FavUtils.mirror.idField;
  }

  static getFavPoolsKey() {
    return FavUtils.mirror.favKey;
  }

  static getRedirectLocation() {
    // return FavUtils.mirror.location;
    return window.location;
  }

  static isFavourite(poolId) {
    let favs = window.localStorage.getItem(FavUtils.getFavPoolsKey());
    // console.log("isFavourite(poolId): " + poolId);
    if (favs != null) {
      let favArr = favs.split(",");
      for (let i = 0; i < favArr.length; i++) {
        if (favArr[i] == poolId) {
          // console.log("found fav pool : " + poolId);
          return true;
        }
      }
    }

    return false;
  }

  static favoriteFormatter(cell, row, rowIndex, formatExtraData) {
    // console.log("in favoriteFormatter for: ", formatExtraData)
    // const onClick = e => e.stopPropagation();
    if (cell && FavUtils.isFavourite(cell)) {//favourite
      // return (<span onClick={ onClick }><img src={"/images/heart.png"} title="Favorite. Click to remove from Favorites"
      //   className="imgicon" width="16" height="16" onClick={formatExtraData.unfavourite} id={row[FavUtils.getIdField()]} /></span>);
      return <FavIcon isFav={true} thisObj={formatExtraData} id={row[FavUtils.getIdField()]}/>
    } else {
      // return (<span onClick={ onClick }><img src={"/images/heart-outline.png"} title="Not Favorite. Click to add to Favorites"
      //   className="imgicon" width="16" height="16" onClick={formatExtraData.favourite} id={row[FavUtils.getIdField()]} /></span>);
      return <FavIcon isFav={false} thisObj={formatExtraData} id={row[FavUtils.getIdField()]}/>
    }
  }

  static showFavSwitch() {
    let defaultView = window.localStorage.getItem(FavUtils.getDefaultViewKey());
    // console.log("in favoriteFormatter for - cell: " + cell)
    if (defaultView != null && defaultView == 'Favs') {//favourite
      return (<img src={"/images/heart.png"} title="Showing favorites. Click to show all"
        className="imgicon" width="32" height="32" onClick={FavUtils.switchToAll}/>);
    } else {
      return (<img src={"/images/heart-outline.png"} title="Showing all. Click to show favorites"
        className="imgicon" width="32" height="32" onClick={FavUtils.switchToFav}/>);
    }
  }

  static switchToFav() {
    window.localStorage.setItem(FavUtils.getDefaultViewKey(), "Favs");
    window.location = FavUtils.getRedirectLocation();
  }

  static switchToAll() {
    window.localStorage.removeItem(FavUtils.getDefaultViewKey());
    window.location = FavUtils.getRedirectLocation();
  }

  static unfavourite(e, thisObj) {
    e.preventDefault();
    FavUtils.unfavourite(e.target.id, thisObj);
  }

  static unfavouriteById(id, thisObj) {
      // console.log("in unfavourite: " + e.target.id);
    let favs = window.localStorage.getItem(FavUtils.getFavPoolsKey());
    // console.log("unfavourite - favs: " + favs);
    if (favs != null) {
      let favArr = favs.split(",");
      let newFavs = "";
      let found = false;
      for (let i = 0; i < favArr.length; i++) {
        if (favArr[i] == id) {
          // console.log("removing pool");
          continue;
        }

        if (found) {
          newFavs += ",";
        }
        newFavs += favArr[i];
        found = true;
      }
      window.localStorage.setItem(FavUtils.getFavPoolsKey(), newFavs);
      // console.log("unfavourite - favs: " + newFavs);
    }
    window.location = FavUtils.getRedirectLocation();
  }

  // static unfavourite(e, thisObj) {
  //   e.preventDefault();
  //   // console.log("in unfavourite: " + e.target.id);
  //   let favs = window.localStorage.getItem(FavUtils.getFavPoolsKey());
  //   // console.log("unfavourite - favs: " + favs);
  //   if (favs != null) {
  //     let favArr = favs.split(",");
  //     let newFavs = "";
  //     let found = false;
  //     for (let i = 0; i < favArr.length; i++) {
  //       if (favArr[i] == e.target.id) {
  //         // console.log("removing pool");
  //         continue;
  //       }

  //       if (found) {
  //         newFavs += ",";
  //       }
  //       newFavs += favArr[i];
  //       found = true;
  //     }
  //     window.localStorage.setItem(FavUtils.getFavPoolsKey(), newFavs);
  //     // console.log("unfavourite - favs: " + newFavs);
  //   }
  //   window.location = FavUtils.getRedirectLocation();
  // }

  static favourite(e, thisObj) {
    e.preventDefault();
    FavUtils.favourite(e.target.id, thisObj);
  }

  static favouriteById(id, thisObj) {
    // window.localStorage.removeItem(FavUtils.getFavPoolsKey());
    // console.log("in favourite: " + id);
    let favs = window.localStorage.getItem(FavUtils.getFavPoolsKey());
    // console.log("favourite - favs: " + favs);
    if (favs != null) {
      favs += "," + id;
      window.localStorage.setItem(FavUtils.getFavPoolsKey(), favs);
      // console.log(favs);
    } else {
      favs = id;
      window.localStorage.setItem(FavUtils.getFavPoolsKey(), favs);
    }
    // console.log("favourite - favs: " + window.localStorage.getItem(FavUtils.getFavPoolsKey()));
    window.location = FavUtils.getRedirectLocation();
  }


  // static favourite(e, thisObj) {
  //   e.preventDefault();
  //   // window.localStorage.removeItem(FavUtils.getFavPoolsKey());
  //   // console.log("in favourite: " + e.target.id);
  //   let favs = window.localStorage.getItem(FavUtils.getFavPoolsKey());
  //   // console.log("favourite - favs: " + favs);
  //   if (favs != null) {
  //     favs += "," + e.target.id;
  //     window.localStorage.setItem(FavUtils.getFavPoolsKey(), favs);
  //     // console.log(favs);
  //   } else {
  //     favs = e.target.id;
  //     window.localStorage.setItem(FavUtils.getFavPoolsKey(), favs);
  //   }
  //   // console.log("favourite - favs: " + window.localStorage.getItem(FavUtils.getFavPoolsKey()));
  //   window.location = FavUtils.getRedirectLocation();
  // }

  static filterData(thisObj, poolData) {
    // window.localStorage.removeItem(FavUtils.getDefaultViewKey());
    // return;
    let defaultView = window.localStorage.getItem(FavUtils.getDefaultViewKey());
    let idField = FavUtils.getIdField();
    let newPoolData = [];

    // let favInd = window.localStorage.getItem(FavUtils.getFavPoolsKey());
    // console.log("favInd: '", favInd.trim(), "' - ", favInd.trim().length);
    // let showFavsOnly = (favInd != null && favInd.trim().replace(",","").length > 0);
    // console.log("showFavsOnly: ", showFavsOnly);
    // && favInd

    if (defaultView == 'Favs') {
      for(let i=0; i<poolData.length; i++) {
        if (FavUtils.isFavourite(poolData[i][idField])) {
          newPoolData[newPoolData.length]=poolData[i];
        }
      }

      if (newPoolData.length === 0) {
        newPoolData = poolData;
      }
      // console.log(newPoolData);
      // thisObj.setState({"pools": newPoolData});
    } else {
      // let newPoolData = [];
      let regularPoolData = [];
      for(let i=0; i<poolData.length; i++) {
        if (FavUtils.isFavourite(poolData[i][idField])) {
          newPoolData[newPoolData.length]=poolData[i];
        } else {
          regularPoolData[regularPoolData.length]=poolData[i];
        }
      }

      newPoolData.push.apply(newPoolData, regularPoolData)
      // console.log(newPoolData);
      // thisObj.setState({"pools": newPoolData});
    }

    return newPoolData;
  }

  static getColKey(prefix) {
    let key = prefix;
    if (RespUtils.isMobileView()) {
      key = prefix + "-MOB";
    } else if (RespUtils.isTabletView()) {
      key = prefix + "-TAB";
    } else {
      key = prefix + "-DEFAULT";
    }

    return key;
  }

  static removeCacheByKey(prefix) {
    console.log("in removeCacheByKey");
    console.log(window.localStorage.getItem(FavUtils.getColKey(prefix)));
    window.localStorage.removeItem(FavUtils.getColKey(prefix));
    console.log(window.localStorage.getItem(FavUtils.getColKey(prefix)));
  }

  static setCacheByKey(prefix, data) {
    window.localStorage.setItem(FavUtils.getColKey(prefix), data);
  }

  static setColCache(data) {
    window.localStorage.setItem(FavUtils.getColKey(constants.ASSETS_COLUMNS_KEY), data);
  }

  static getColCache() {
    return window.localStorage.getItem(FavUtils.getColKey(constants.ASSETS_COLUMNS_KEY))
  }

  
}

export default FavUtils;
