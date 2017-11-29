var builder = require('botbuilder');
var customVision = require('./CustomVision');
var help = require('./Help');
var bank = require('./BankProcess');
var rest = require('../API/Restclient');


exports.startDialog = function (bot) {
    // Replace {YOUR_APP_ID_HERE} and {YOUR_KEY_HERE} with your LUIS app ID and your LUIS key, respectively.
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/287254a8-8c2c-4782-a7aa-6039d2f3946e?subscription-key=8574fa955faf4544b341d6c1629b5bb2&verbose=true&timezoneOffset=0&q=');
    
    bot.recognizer(recognizer);

    //global variables here
    var exRate;

    bot.dialog('None', function (session, args) {
        if(!isAttachment(session)){
        session.send("I don't understand your request!");
        }
    }).triggerAction({
        matches: 'None'
    });

    bot.dialog('BankGreeting', 
        function (session, args, next) {
            if(!isAttachment(session)){
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                help.displayStarterHelp(session);
                   
            } else {
                next();
            }
        }},
        function (session, results,next) {
            if(!isAttachment(session)){
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                help.displayHelperCards(session, session.conversationData["username"]);
        }}
    ).triggerAction({
        matches: 'BankGreeting'
    });


    bot.dialog('Login', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");        
            } else {
                next();
            }
        },
        function (session, results,next) {
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                bank.checkUsername(session, session.conversationData["username"]);
        }
    ]).triggerAction({
        matches: 'Login'
    });

    bot.dialog('Logout', [
        function (session, args, next) {
            if(!isAttachment(session)){
            session.dialogData.args = args || {};        
            if (session.conversationData["username"]) {
                session.send("Logging Off...");
                session.endConversation();
                session.send("Successfully logged off!");  
            } else {
                next();
            }
        }},
        function (session, results,next) {
            if(!isAttachment(session)){
                session.send("No login is made before!!");
                help.displayStarterHelp(session);
            }
        }
    ]).triggerAction({
        matches: 'Logout'
    });

    bot.dialog('BankBalance', [
        function (session, args, next) {
            if(!isAttachment(session)){
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to log in to your account.");        
            } else {
                next();
            }
        }},
        function (session, results,next) {
            if(!isAttachment(session)){
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                
                
                bank.displayBalance(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            
        }}
    ]).triggerAction({
        matches: 'BankBalance'
    });


    bot.dialog('BankAddAcc', [
        function (session, args, next) {
            if(!isAttachment(session)){
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to create your account.");        
            } else {
                next();
            }
        }},
        function (session, results,next) {
            if(!isAttachment(session)){
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                bank.AddAccount(session, session.conversationData["username"]);
        }}
    ]).triggerAction({
        matches: 'BankAddAcc'
    });

    bot.dialog('BankDelAcc', [
        function (session, args, next) {
            if(!isAttachment(session)){
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to log in to your account first.");
            } else {
                next();
            }
        }},
        function (session, results,next) {
            if(!isAttachment(session)){
            if (results.response) {
                session.conversationData["username"] = results.response;
            }

            session.send("You want to delete this account.");
            
            session.send('Deleting \'%s\'...', session.conversationData["username"]);
            bank.deleteUser(session, session.conversationData["username"]);
        }
    }
    ]).triggerAction({
        matches: 'BankDelAcc'
    });

    bot.dialog('CreateCheque', [
        function (session, args, next) {
            if(!isAttachment(session)){
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");        
            } else {
                next();
            }
        }},
        function (session, results,next) {
            if(!isAttachment(session)){
            if (results.response) {
                session.conversationData["username"] = results.response;
                bank.displayBalance2(session, session.conversationData["username"]);
            }
            
            if (!session.conversationData["amount"]) {
                builder.Prompts.text(session, "Enter an amount you want to withdraw.");
            } else {
                next();
            }
        }},
        function (session,results,next) {
            if(!isAttachment(session)){
            if (results.response) {
                session.conversationData["amount"] = results.response;
            }
            bank.addCheque(session, session.conversationData["username"], session.conversationData["amount"]);   
        }}     
        
    ]).triggerAction({
        matches: 'CreateCheque'
    });
    

    bot.dialog('BankDeposit', [
        function (session, args, next) {
            if(!isAttachment(session)){
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");        
            } else {
                next();
            }
        }},
        function (session, results,next) {
            if(!isAttachment(session)){
            if (results.response) {
                session.conversationData["username"] = results.response;
            }
            if (!session.conversationData["serialNumber"]) {
                builder.Prompts.text(session, "Enter a Serial Number to deposit.");
            } else {
                next();
            }
        }},
        function (session,results,next) {
            if(!isAttachment(session)){
            if (results.response) {
                session.conversationData["serialNumber"] = results.response;
            }
            bank.deposit(session, session.conversationData["username"], session.conversationData["serialNumber"]);
        }}
    ]).triggerAction({
        matches: 'BankDeposit'
    });

    bot.dialog('BankPayments', [
        function (session, args, next) {
            if(!isAttachment(session)){
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");        
            } else {
                next();
            }
        }},
        function(session,results,next) {
            if(!isAttachment(session)){
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                if (!session.conversationData["receiver"]) {
                    builder.Prompts.text(session, 'Enter the receiver ID ');
                } else {
                    next();
                }
        }},
        function(session, results, next) {
            if(!isAttachment(session)){
            if (!session.conversationData["receiver"]) {
                session.conversationData["receiver"] = results.response;
            }
            if (!session.conversationData["payamount"]) {
                builder.Prompts.text(session, 'Enter the amount you want to pay ');
            } 
            else {
                next();
            }
        }},
        function(session, results, next) {
            if(!isAttachment(session)){
            if (!session.conversationData["payamount"]) {
                session.conversationData["payamount"] = results.response;
            }
            session.send("%s, we are processing payment to %s...", session.conversationData["username"],session.conversationData["receiver"]);
            bank.displayId(session);

        }}
    ]).triggerAction({
        matches: 'BankPayments'
    });

    bot.dialog('Currency', [
        function(session,args,next) {
            if(!isAttachment(session)){
            exRate = builder.EntityRecognizer.findEntity(args.intent.entities, 'bank');
            
            if (exRate === null || exRate === undefined) {
                builder.Prompts.text(session, 'Enter the exchange rate you looking for');
                next();
            } else {
                exRate = exRate.entity.toUpperCase();
                session.send("Retreiving exchange rate...");
                var url = 'https://openexchangerates.org/api/latest.json?app_id=bea63e3f26a64c23a25ae2320609a396'
                rest.displayExRate(url,exRate,session, exRateDisplayer);
            }
        }},
        function(session, results, next) {
            if(!isAttachment(session)){
            var lookingFor = results.response.toUpperCase();
            session.send("Retreiving exchange rate...");
            var url = 'https://openexchangerates.org/api/latest.json?app_id=bea63e3f26a64c23a25ae2320609a396'
            rest.displayExRate(url,lookingFor,session, exRateDisplayer);

        }}
    ]).triggerAction({
        matches: 'Currency'
    });
    
    function exRateDisplayer(message, exRate, session) {
        if(!isAttachment(session)){
        var res = JSON.parse(message).rates;
        var exRateFound= res[exRate];
        if (exRateFound === null || exRateFound === undefined) {
            session.send("Exchange rate for %s is not found",exRate);
            session.send("Check currency you looking for is correct.");
            if (!session.conversationData["username"]) {
                help.displayStarterHelp(session);
            } else {
                help.displayHelperCards(session, session.conversationData["username"]);  
            }
        } else {
            session.send("Your USD $1 is equal to %s %s", exRate, exRateFound);
            if (!session.conversationData["username"]) {
                help.displayStarterHelp(session);
            } else {
                help.displayHelperCards(session, session.conversationData["username"]);  
            }
        }
    }};

    function isAttachment(session) { 
        var msg = session.message.text;
        if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
            customVision.retreiveMessage(session);
            return true;
        }
        else {
            return false;
        }
    }
    
}