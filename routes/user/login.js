var pgclient = require('../../models/pgclient');
var userHandler = require('../../lib/user');
var cache = require('../../lib/cache');
var chance = require('chance');

var login = function (req, res) {
  var resp = { 'status': 'fail', 'err': '', 'resp': {} };
  var phone = req.data.phone || ``;

  if (req && phone) {
    userHandler.markVerifiedUser(phone, function (err, result) {
      if (err) {
        resp.err = err;
        res.json(resp);
      } else {
        if (result.length) {
          cache.createToken(phone, function (err, token) {
            if (err) {
              console.log(`[ERR user/login] cache Error: ${err}`);
              resp.err = err;
            } else {
              resp.status = 'success';
              resp.resp = { 'token': token };
            }
            res.json(resp);
          });
        } else {
          console.log(`[ERR user/login] no such user: ${phone}`);
          resp.err = 'no such user';
          res.json(resp);
        }
      }
    });
  } else {
    console.log(`[ERR user/login] missing arguments: ${phone}`);
    resp.err = 'Missing arguments';
    res.json(resp);
  }
}
module.exports = login;
