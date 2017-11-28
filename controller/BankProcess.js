var rest = require('../API/Restclient');
var builder = require('botbuilder');
var help = require('./Help');

// Deposit Money
exports.deposit = function deposit(session, username, serialNumber) {
    //var urlChequeTable = 'http://msa-lewis-bankapp.azurewebsites.net/tables/chequeTable';
    var urlAccounts = 'http://msa-lewis-bankapp.azurewebsites.net/tables/accounts';
    // console.log(username);
    // console.log(amount);
    // console.log("==================")
    rest.getBalance2(urlAccounts, serialNumber, session, username, checkSerial);
}
function checkSerial(message, serialNumber, session, username) {
    // console.log("===at enoughBalance function =====");
    var handleUser = JSON.parse(message);
    var balanceGot;
    // var balance = parseFloat(0).toFixed(2);
    var idExist;
    var amount;
    for (var index in handleUser) {
        var usernameReceived = handleUser[index].username;
        var subBalance = parseFloat(handleUser[index].balance);
        // balance = +balance + +subBalance.toFixed(2);
        if (username.toLowerCase()===usernameReceived.toLowerCase()) {
            balanceGot = subBalance.toFixed(2);
            idExist = handleUser[index].id;;
            break;
        }
    }
    if (idExist === null || idExist === undefined) {
        session.send("There is no matching Username in the system!");
        session.send("Please login again!");
        session.endConversation();
        
    } else {// Print all favourite foods for the user that is currently logged in
        // check serial number valid - is receiverCheck false?
        // if so save amount allocated to 'amount' and set serial number validity to true and delete
        //
        var urlChequeTable = 'http://msa-lewis-bankapp.azurewebsites.net/tables/chequeTable';
        rest.getValidity(urlChequeTable, serialNumber, idExist, balanceGot, session, serialValid);
        
    }          
    
}
function serialValid(message, session, idExist, balanceGot, serialNumber) {
    var chequeList = JSON.parse(message);
    var isValid;
    var SNExist;
    for (var index in chequeList) {
        var serialNumberListed = chequeList[index].id;
        var validityCheck = chequeList[index].receiverCheck;
        var amount = chequeList[index].amount;
        // balance = +balance + +subBalance.toFixed(2);
        if (serialNumber.toLowerCase()===serialNumberListed.toLowerCase()) {
            isValid = validityCheck;
            SNExist = chequeList[index].id;;
            break;
        }
    }
    if (SNExist === null  || SNExist === undefined) {
        session.send("Serial Number entered does not exist!");
        session.send("Session ending...");
        session.endConversation();
    } else if (isValid === true) {
        session.send("Failure: Serial Number entered has already been used!");
        session.send("Session ending...");
        session.endConversation();
    }
    amount = parseFloat(amount);
    amount = amount.toFixed(2);
    var greater = +balanceGot + +amount;
    greater = parseFloat(greater);
    greater = greater.toFixed(2);
    // console.log("====balancegot = %s",balanceGot);
    // console.log("====amount = %s",amount);
    // console.log("========serial number worth: %s" , amount);
    //var urlChequeTable = 'http://msa-lewis-bankapp.azurewebsites.net/tables/chequeTable';
    var urlAccounts = 'http://msa-lewis-bankapp.azurewebsites.net/tables/accounts/' + idExist;
    
    rest.updateAmount(urlAccounts, greater, SNExist, session, beforeIDHolder2);
    // console.log("====deduct finished ===");
    
    // console.log("====check finished finished ===");
}
function beforeIDHolder2(message, session, greater, SNExist) {
    // console.log("IN BEFOREIDHOLDER");
    // console.log("amount = %s",amount);
    // console.log("Accounts update completed");
    var urlChequeTable = 'http://msa-lewis-bankapp.azurewebsites.net/tables/chequeTable';
    rest.deleteCheque(urlChequeTable, session, greater, SNExist, idHolder2);
}

function idHolder2(message, session, greater) {
    //console.log("IN idHolder");
    var res = JSON.parse(message);
    // console.log("========id1 is %s", res.id);
    session.send("Serial Number %s has been terminated!" , res.id);
    session.send("Amount deposited:  $ %s" , res.amount);
    session.send("%s, now you have $ %s in your account!", session.conversationData["username"], greater);
    session.send("Deposit Completed!");
    help.displayHelperCards(session, session.conversationData["username"]);  
}

//////////////////////// deposit finished!


// add cheque (withdraw)
exports.displayBalance2 = function getBalance(session, username){
    var url = 'http://msa-lewis-bankapp.azurewebsites.net/tables/accounts';
    rest.getBalance(url, session, username, handleBalanceResponse2)
};
function handleBalanceResponse2(message, session, username) {
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
        // help.displayHelperCards(session, username);
        // if (!session.conversationData["amount"]) {
        //     builder.Prompts.text(session, "Enter an amount you want to withdraw.");
        // } else {
        //     next();
        // }   
    }          
    
}
exports.addCheque = function addCheque(session, username, amount) {
    //var urlChequeTable = 'http://msa-lewis-bankapp.azurewebsites.net/tables/chequeTable';
    var urlAccounts = 'http://msa-lewis-bankapp.azurewebsites.net/tables/accounts';
    // console.log(username);
    // console.log(amount);
    // console.log("==================")
    rest.getBalance2(urlAccounts, amount, session, username, enoughBalance);
}
function enoughBalance(message, amount, session, username) {
    // console.log("===at enoughBalance function =====");
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
        session.send("Please login again!");
        session.endConversation();
        
    } else {// Print all favourite foods for the user that is currently logged in
        if (isNaN(amount) || amount === null || amount === undefined) {
            session.send("The amount you entered is not valid number!");
            session.send("Session terminated! Try again!");
            session.endConversation();
        }
        amount = parseFloat(amount);
        amount = amount.toFixed(2);
        // console.log("====balancegot = %s",balanceGot);
        // console.log("====amount = %s",amount);
        var greater = +balanceGot - +amount;
        greater.toFixed(2);
        console.log(greater);
        if (greater >= 0.00) {
            //var urlChequeTable = 'http://msa-lewis-bankapp.azurewebsites.net/tables/chequeTable';
            var urlAccounts = 'http://msa-lewis-bankapp.azurewebsites.net/tables/accounts/' + idExist;
            
            rest.deductAmount(urlAccounts, greater, amount, session, beforeIDHolder);
            // console.log("====deduct finished ===");
            
            // console.log("====check finished finished ===");
        } else {
            // return saying not enough money in this account!! end session.
            session.send("Not enough money in the account! Session terminated.");
            session.endConversation();
        }
    }          
    
}
function beforeIDHolder(message, session, amount) {
    // console.log("IN BEFOREIDHOLDER");
    // console.log("amount = %s",amount);
    var urlChequeTable = 'http://msa-lewis-bankapp.azurewebsites.net/tables/chequeTable';
    rest.AddCheck(urlChequeTable, session, amount, idHolder);
}

function idHolder(message, session) {
    //console.log("IN idHolder");
    console.log("========id1 is %s", message.id);
    session.send("Serial Number:  %s" , message.id);
    session.send("Withdrawal Amount:  $ %s" , message.amount);
    session.send("Withdrawal Completed! Please save Serial Number provided to use cheque issued.");
    // session.send("Session ending...");
    // session.endConversation();
    help.displayHelperCards(session, session.conversationData["username"]);  

}
//////////////////////// add cheque ends


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

//delete user
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

function handleDeletedUserResponse(message, session) {
    session.send("%s is now deleted from the server! Session ending...", message.username);
    session.endConversation();
    console.log('Done');
}
//////////////////////////////////////////////////// delete finished







