var builder = require('botbuilder');
var customVision = require('./CustomVision');
var help = require('./Help');
var bank = require('./BankProcess');

// Some sections have been omitted
//var isAttachment = false;




exports.startDialog = function (bot) {
    // Replace {YOUR_APP_ID_HERE} and {YOUR_KEY_HERE} with your LUIS app ID and your LUIS key, respectively.
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/13702282-9cad-4130-8385-2e193543d98d?subscription-key=56878aa5033a475abfe27372bb74580d&verbose=true&timezoneOffset=0&q=');
    
    bot.recognizer(recognizer);

    //global variables here



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