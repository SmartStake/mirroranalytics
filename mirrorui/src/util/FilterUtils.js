import React from 'react';

class FilterUtils extends React.Component {

  static removeOldData(data, key, daysAllowed) {
    // console.log("in removeOldData - data is : ", data);
    if (!data || data.length == 0) {
      return data;
    }

    let finalData = JSON.parse(JSON.stringify(data));
    // console.log("starting data is : ", finalData);

    //doesnt handle GMT
    let oldestDate = new Date();
    oldestDate.setDate( oldestDate.getDate() - daysAllowed);

    // console.log("oldest date allowed is : ", oldestDate);
    for (let i = 0; i < finalData.length; i++) {
      let dateValue = new Date(finalData[i][key]);
      // console.log("comparing: record date: ", dateValue, ", with: ", oldestDate);
      if (dateValue != null && dateValue < oldestDate) {
        // console.log(i + " - removing element : " + dateValue);
        finalData.splice(i, 1);
        i--;
      }
    }

    // console.log("final data is : ", finalData);
    return finalData;
  }

  static retainLastStatPerDay(data, key) {
    // console.log("in retainLastStatPerDay - data is : ", data);
    if (!data || data.length == 0) {
      return data;
    }

    let finalData = JSON.parse(JSON.stringify(data));
    // console.log("starting data is : ", finalData);

    //doesnt handle GMT
    let lastDate = new Date(finalData[0][key]);
    lastDate.setHours(0, 0, 0);

    // console.log("oldest date allowed is : ", oldestDate);
    let newData = [];
    let prevRecord = finalData[0];
    for (let i = 0; i < finalData.length; i++) {
      let dateValue = new Date(finalData[i][key]);
      dateValue.setHours(0, 0, 0);

      // console.log("comparing: record date: ", dateValue, ", with: ", lastDate);
      if (dateValue > lastDate) {
        //date has changed, add prev record to new data
        // console.log(lastDate, " - adding last record of day: ", prevRecord)
        newData.push(prevRecord);
      }
      
      if (i + 1 === finalData.length) {
        //last record. add it as well
        newData.push(finalData[i]);
      }

      lastDate = dateValue;
      prevRecord = finalData[i];
    }

    // console.log("final data is : ", finalData);
    return newData;
  }


}

export default FilterUtils;
