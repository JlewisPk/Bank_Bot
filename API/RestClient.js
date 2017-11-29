var request = require('request');
var bank = require('../controller/BankProcess');

exports.getHelpData = function getData(url, session, username, callback){
    request.get(url, { 'headers': { 'ZUMO-API-VERSION': '2.0.0' } }, function handleGetResponse(err, res, body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, username);
        }
    });
};

exports.getValidity =  function getValidity(url, serialNumber, idExist, balanceGot, session, callback) {
    request.get(url, { 'headers': { 'ZUMO-API-VERSION': '2.0.0' } }, function handleGetResponse(err, res, body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, idExist, balanceGot, serialNumber);
        }
    });
};

exports.getBalance2 = function getData2(url, amount, session, username, callback){
    request.get(url, { 'headers': { 'ZUMO-API-VERSION': '2.0.0' } }, function handleGetResponse(err, res, body){
        if(err){
            console.log(err);
        }else {
            callback(body, amount, session, username);
        }
    });
};
exports.getBalance = function getData(url, session, username, callback){
    request.get(url, { 'headers': { 'ZUMO-API-VERSION': '2.0.0' } }, function handleGetResponse(err, res, body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, username);
        }
    });
};

exports.userExist = function getData(url, session, username, callback){
    request.get(url, { 'headers': { 'ZUMO-API-VERSION': '2.0.0' } }, function handleGetResponse(err, res, body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, username);
        }
    });
};
exports.checkUsername = function getData(url, session, username, callback){
    request.get(url, { 'headers': { 'ZUMO-API-VERSION': '2.0.0' } }, function handleGetResponse(err, res, body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, username);
        }
    });
};

exports.AddAccount = function sendData(url, username){
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "username" : username,
            "balance" : "0.00"
        }
      };
      
      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
        } else if (!error && response.statusCode === 201) {
            console.log(body);
        }
        else{
            console.log(error);
        }
      });
};

exports.deleteUser = function deleteData(url,session, id, callback){
    var options = {
        url: url + "\\" + id,
        method: 'DELETE',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        }
    };

    request(options,function (err, res, body){
        if( !err && res.statusCode === 200){
            console.log(body);
            callback(body,session);
        }else {
            console.log(err);
            console.log(res);
        }
    })

};


exports.deductAmount = function deductAmount(url, greater, amount, session, callback){
    var options = {
        url: url,
        method: 'PATCH',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "balance" : greater
        }
      };
      
      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
            // console.log("lol");
            // console.log("amount from deductAmount: %s" , amount);
            callback(body, session, amount);
        }
        else{
            console.log(error);
        }
      });
};
exports.updateAmount = function updateAmount(url, greater, SNExist, session, callback){
    var options = {
        url: url,
        method: 'PATCH',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "balance" : greater
        }
      };
      
      request(options, function (error, response, body) {
        if (!error && (response.statusCode === 200 || response.statusCode === 201)) {
            console.log(body);
            // console.log("lol");
            // console.log("amount from deductAmount: %s" , amount);
            callback(body, session, greater, SNExist);
        }
        else{
            console.log(error);
        }
      });
};

exports.AddCheck = function sendData(url, session, amount, callback){
    // console.log("WE ARE IN ADDCHECK!!!!!!!!!!");
    // console.log(url);
    // console.log(amount);
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "receiverCheck" : false,
            "amount" : amount
        }
      };
      
      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
            // console.log("WE ARE IN ADDCHECK!!!!!!!!!!");
            callback(body,session);
        } else if (!error && response.statusCode === 201) {
            console.log(body);
            // console.log("WE ARE IN ADDCHECK!!!!!!!!!!");
            callback(body,session);
        }
        else{
            console.log(error);
        }
      });
};

exports.deleteCheque = function deleteData(url,session, greater, id, callback){
    var options = {
        url: url + "\\" + id,
        method: 'DELETE',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        }
    };

    request(options,function (err, res, body){
        if( !err && res.statusCode === 200){
            console.log(body);
            callback(body,session,greater);
        }else {
            console.log(err);
            console.log(res);
        }
    });

};

exports.displayExRate = function displayExRate(url,ExRate,session,callback) {
    request.get(url, { 'headers': { 'ZUMO-API-VERSION': '2.0.0', 'Content-Type':'application/json' } }, function handleGetResponse(err, res, body){
        if(err){
            console.log(err);
        }else {
            callback(body,ExRate, session);
        }
    });
};