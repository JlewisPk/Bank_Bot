var rest = require('../API/Restclient');
var builder = require('botbuilder');
var help = require('./Help');

// fetching balance
exports.displayBalance = function getBalance(session, username){
    var url = 'http://msa-lewis-bankapp.azurewebsites.net/tables/accounts';
    rest.getBalance(url, session, username, handleBalanceResponse)
};
function handleBalanceResponse(message, session, username) {
    var handleBalanceResponse = JSON.parse(message);
    var balanceGot;
    var balance = parseFloat(0).toFixed(2);
    var idExist;
    for (var index in handleBalanceResponse) {
        var usernameReceived = handleBalanceResponse[index].username;
        var subBalance = parseFloat(handleBalanceResponse[index].balance);
        // balance = +balance + +subBalance.toFixed(2);
        if (username.toLowerCase()===usernameReceived.toLowerCase()) {
            balanceGot = subBalance.toFixed(2);
            idExist = handleBalanceResponse[index].id;;
            break;
        }
    }
    if (idExist === null || idExist === undefined) {
        session.send("There is no matching Username in the system!");
        session.send("Please try again after creating account!");
        session.endConversation();
        
    } else {// Print all favourite foods for the user that is currently logged in
        session.send("%s, your current balance is: USD %s", usernameReceived, balanceGot);
        help.displayHelperCards(session, username);    
    }          
    
}
//////////////////////////// fetching balance done

// handle login
exports.checkUsername = function checkUsername(session, username){
    var url = 'http://msa-lewis-bankapp.azurewebsites.net/tables/accounts';
    rest.checkUsername(url, session, username, handleUndefinedUser)
};
function handleUndefinedUser(message,session,username) {
    var url = 'http://msa-lewis-bankapp.azurewebsites.net/tables/accounts';
    var handleExistance = JSON.parse(message);
    var idExist;
    for (var index in handleExistance) {
        var usernameReceived = handleExistance[index].username;
        if (username.toLowerCase() ===usernameReceived.toLowerCase()) {
            idExist = handleExistance[index].id;
        }
    }
    if (idExist === null || idExist === undefined) {
        session.send("Username does not exist in the server! Please check username!");
        session.endConversation();
    } else {
        help.displayHelperCards(session, username);  // <---- THIS LINE HERE IS WHAT WE NEED 
    }
}
/////////////////////////////////////////handle login done

// add new user
exports.AddAccount = function AddAccount(session, username){
    var url = 'http://msa-lewis-bankapp.azurewebsites.net/tables/accounts';
    rest.userExist(url,session,username,handleExistance);
};
function handleExistance(message,session,username) {
    var url = 'http://msa-lewis-bankapp.azurewebsites.net/tables/accounts';
    var handleExistance = JSON.parse(message);
    var idExist;
    for (var index in handleExistance) {
        var usernameReceived = handleExistance[index].username;
        if (username.toLowerCase() ===usernameReceived.toLowerCase()) {
            idExist = handleExistance[index].id;
        }
    }
    if (idExist === null || idExist === undefined) {
        rest.AddAccount(url, username);
        // session.send("welcome %s", username);
        help.displayHelperCards(session,username);
    } else {
        session.send("Username already exist in the server! Use other username!");
        session.endConversation();
    }
}
//////////////////////////////////////// add new user finished

//delete user related
exports.deleteUser = function deleteUser(session, username){
    var url = 'http://msa-lewis-bankapp.azurewebsites.net/tables/accounts';
    rest.userExist(url,session,username,handleUserForDelete);
};

function handleUserForDelete(message,session,username) {
    var url = 'http://msa-lewis-bankapp.azurewebsites.net/tables/accounts';
    var handleExistance = JSON.parse(message);
    var idExist;
    for (var index in handleExistance) {
        var usernameReceived = handleExistance[index].username;
        if (username.toLowerCase() ===usernameReceived.toLowerCase()) {
            idExist = handleExistance[index].id;
        }
    }
    rest.deleteUser(url,session,idExist, handleDeletedUserResponse);
}

function handleDeletedUserResponse(body, session) {
    session.endConversation();
    console.log('Done');
}
//////////////////////////////////////////////////// delete finished







