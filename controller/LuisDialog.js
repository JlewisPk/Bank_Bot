var builder = require('botbuilder');
var customVision = require('./CustomVision');
var help = require('./Help');
var bank = require('./BankProcess');
var rest = require('../API/Restclient');

// Some sections have been omitted
//var isAttachment = false;




exports.startDialog = function (bot) {
    // Replace {YOUR_APP_ID_HERE} and {YOUR_KEY_HERE} with your LUIS app ID and your LUIS key, respectively.
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/287254a8-8c2c-4782-a7aa-6039d2f3946e?subscription-key=8574fa955faf4544b341d6c1629b5bb2&verbose=true&timezoneOffset=0&q=');
    
    bot.recognizer(recognizer);

    //global variables here
    var exRate;


    bot.dialog('None', function (session, args) {
        session.send("I don't understand your request!");
    }).triggerAction({
        matches: 'None'
    });

    bot.dialog('BankGreeting', 
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                // session.send("Hello !!");
                help.displayStarterHelp(session);  // <---- THIS LINE HERE IS WHAT WE NEED 
                   
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                
                // session.send("Hello %s!!", session.conversationData["username"]);
                help.displayHelperCards(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            
        }
    ).triggerAction({
        matches: 'BankGreeting'
    });


    bot.dialog('Login', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");        
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                
                // session.send("Hello %s!!", session.conversationData["username"]);
                bank.checkUsername(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            
        }
    ]).triggerAction({
        matches: 'Login'
    });

    bot.dialog('Logout', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (session.conversationData["username"]) {
                session.send("Logging Off...");
                session.endConversation();
                session.send("Successfully logged off!");  
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
                
                session.send("No login is made before!!");
                help.displayStarterHelp(session);  // <---- THIS LINE HERE IS WHAT WE NEED 
            
        }
    ]).triggerAction({
        matches: 'Logout'
    });

    bot.dialog('BankBalance', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to log in to your account.");        
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                
                
                bank.displayBalance(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            
        }
    ]).triggerAction({
        matches: 'BankBalance'
    });


    bot.dialog('BankAddAcc', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to create your account.");        
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                
                // session.send("Hello %s!! Checking your balnce. Please Wait!", session.conversationData["username"]);
                bank.AddAccount(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            
        }
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
                next(); // Skip if we already have this info.
            }
        }},
        function (session, results,next) {
            if(!isAttachment(session)){
            //Add this code in otherwise your username will not work.
            if (results.response) {
                session.conversationData["username"] = results.response;
            }

            session.send("You want to delete this account.");
            
            session.send('Deleting \'%s\'...', session.conversationData["username"]);
            bank.deleteUser(session, session.conversationData["username"]); //<--- CALLL WE WANT
        }
    }
    ]).triggerAction({
        matches: 'BankDelAcc'
    });

    bot.dialog('CreateCheque', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");        
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
            if (results.response) {
                session.conversationData["username"] = results.response;
                bank.displayBalance2(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            }
            
            if (!session.conversationData["amount"]) {
                builder.Prompts.text(session, "Enter an amount you want to withdraw.");
            } else {
                next();
            }
        },
        function (session,results,next) {
            if (results.response) {
                session.conversationData["amount"] = results.response;
            }
            // session.send("Hello %s!!", session.conversationData["username"]);
            bank.addCheck(session, session.conversationData["username"], session.conversationData["amount"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
    
        }
                
        
    ]).triggerAction({
        matches: 'CreateCheque'
    });
    

    bot.dialog('BankDeposit', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");        
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
            if (results.response) {
                session.conversationData["username"] = results.response;
            }
            
            if (!session.conversationData["serialNumber"]) {
                builder.Prompts.text(session, "Enter a Serial Number to deposit.");
            } else {
                next();
            }
        },
        function (session,results,next) {
            if (results.response) {
                session.conversationData["serialNumber"] = results.response;
            }
            // session.send("Hello %s!!", session.conversationData["username"]);
            bank.deposit(session, session.conversationData["username"], session.conversationData["serialNumber"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
    
        }
    ]).triggerAction({
        matches: 'BankDeposit'
    })
    
    
    // bot.dialog('Currency', [
    //     function(session,args,next) {
    //     exRate = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');
    //     session.conversationData["lookingFor"] = exRate;
    //     builder.Prompts.text(session, 'You are looking for the exchange rate of '+ exRate.entity.toUpperCase() +' based on...');
    //     next();
    //     },
    //     function(session, results, next) {
    //         var lookingFor = results.response.toUpperCase();
    //         console.log(exRate.entity);
    //         console.log(results.response);
    //         var url = 'https://api.fixer.io/latest?base=' + exRate.entity;
    //         session.send("Retreiving exchange rate...");
    //         nutrition.displayExRate(url,session);

    //     }
    // ]).triggerAction({
    //     matches: 'Currency'
    // });

    bot.dialog('Currency', [
        function(session,args,next) {
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
        },
        function(session, results, next) {
            var lookingFor = results.response.toUpperCase();
            session.send("Retreiving exchange rate...");
            var url = 'https://openexchangerates.org/api/latest.json?app_id=bea63e3f26a64c23a25ae2320609a396'
            rest.displayExRate(url,lookingFor,session, exRateDisplayer);

        }
    ]).triggerAction({
        matches: 'Currency'
    });
    
    function exRateDisplayer(message, exRate, session) {
        var res = JSON.parse(message).rates;
        console.log(res);
        var exRateFound= res[exRate];
        if (exRateFound === null || exRateFound === undefined) {
            session.send("Exchange rate for %s is not found",exRate);
            session.send("Check currency you looking for is correct. Session ending...");
            session.endConversation();
        } else {
            session.send("Your USD $1 is equal to %s %s", exRate, exRateFound);
            session.send("Bye~");
            session.endConversation();
        }
    }

    function isAttachment(session) { 
        var msg = session.message.text;
        if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
            //call custom vision
            // customVision.retreiveMessage(session);
    
            return true;
        }
        else {
            return false;
        }
    }

}