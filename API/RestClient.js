var request = require('request');

exports.getHelpData = function getData(url, session, username, callback){
    request.get(url, { 'headers': { 'ZUMO-API-VERSION': '2.0.0' } }, function handleGetResponse(err, res, body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, username);
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
            "balance" : "0"
        }
      };
      
      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
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