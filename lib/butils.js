"use strict";

var moment = require('moment-timezone');

var butils = {
  cleanPhone: function (phone) {      
    if (phone && (phone = phone.match(/\d+/g))) {
      phone = phone.join("").replace(/^0+/, '');
      phone = (phone.length == 10 && (['9','8','7'].indexOf(phone[0])> -1)) ? "91" + phone : phone;
      return phone.length > 5 ? phone : false;
    } else {
      return false;  
    }     
  },
  cleanLatLong: function (lat, long) {
    var rangeDict = [ [-90, +90], [-180, +180]]; // lat, long
    function between(v, rangeArr) {
      return parseFloat(v) >= rangeArr[0] && parseFloat(v) <= rangeArr[1] ? v : false;
    };
    try {
      var latStr = between(String(lat).match(/^[-+]?\d+([.]\d+)?$/g)[0], rangeDict[0]);
      var longStr = between(String(long).match(/^[-+]?\d+([.]\d+)?$/g)[0], rangeDict[1]);
      return latStr && longStr ? latStr + "," + longStr : false;
    } catch (e) {
      return false;
    } 
  },
  cleanObject: function (testObj) {
    return testObj === Object(testObj) ? testObj : false;
  },
  cleanContactArray: function (contactArray) {
    return contactArray.map((obj) => Object.keys(obj).length && obj.name && obj.phone ? obj : null).filter((element) => element); 
  },
  timeFormat: function (timeStamp) {
    console.log(timeStamp);
    if (timeStamp) {
      timeStamp = moment(moment.tz(timeStamp, 'Asia/Calcutta').format()).add({hours: 5, minutes: 30});
      let yesterday = moment().subtract(1, "days");
      let formatStr = ``;
      console.log(timeStamp, yesterday);
      if (timeStamp.isSame(yesterday, "days")) {
        formatStr += `[Yesterday,] `;
      } else if (!moment().isSame(timeStamp, "days")) {
        formatStr += `DD-MM-YYYY, `;
      }
      formatStr += `h:m a`;
      return timeStamp.format(formatStr);
    } else {
      return ``;
    }
  }
};

module.exports = butils;

//---------------------------------------------

if (require.main === module) {
  console.log(butils.cleanLatLong(process.argv[2] || '+91-99620-36295', process.argv[3] || '111'));
  console.log(butils.timeFormat('2017-05-07T19:56:06+00'));
}
