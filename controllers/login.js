var express = require('express');
var loginCtrl = express.Router();
var AccountModel = require('../models/AccountModel');
var bcrypt = require('bcryptjs');


loginCtrl.get('/', function (req,res,next) {
    res.render('login');
})
loginCtrl.post('/logged', attemptToLogin);

function attemptToLogin(req,res,next){
    var password = req.body.password;
    AccountModel.where('email', req.body.email).fetch().then(
        function(result) {
            var attempt = comparePasswordHashes(req.body.password, result.attributes.password_hash);
            // then we share the results
            if(attempt === true) {
                res.render('success', req.body);
            }
            else{
                res.render('loginFailed', {});
            }
        });
}

function comparePasswordHashes (input, db) {
    //input: user's attempted to login
    var hash = createPasswordHash(input);
    return bcrypt.compareSync(input, db);
};
function createPasswordHash (password) {
    var salt = 10; // salt factor of 10
    var hash = bcrypt.hashSync(password, salt);
    return hash;
};

module.exports = loginCtrl;