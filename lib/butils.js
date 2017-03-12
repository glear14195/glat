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
  }
};

module.exports = butils;

//---------------------------------------------

if (require.main === module) {
  console.log(butils.cleanPhone(process.argv[2] || '+91-99620-36295'));
}
