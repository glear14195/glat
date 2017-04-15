"use strict";

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
  }
};

module.exports = butils;

//---------------------------------------------

if (require.main === module) {
  console.log(butils.cleanLatLong(process.argv[2] || '+91-99620-36295', process.argv[3] || '111'));
}
