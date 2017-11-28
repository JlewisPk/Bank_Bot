var rest = require('../API/Restclient');
var builder = require('botbuilder');


//Calls 'getNutritionData' in RestClient.js with 'getFoodNutrition' as callback to get ndbno of food
exports.displayHelperCards = function getHelpData(session, username){
    var url = 'http://msa-lewis-bankapp.azurewebsites.net/tables/accounts';
    rest.getHelpData(url, session,username, helpUser);
}


exports.displayStarterHelp = function getHelpData2(session){
    var attachment = [];
    var sendCall = 'login';
    var sendCall1 = 'create account';
    var sendCall2 = 'exchange rate';
    var card = new builder.HeroCard(session)
        .title('Hello! How can I help you?')
        .buttons([
            builder.CardAction.imBack(session, sendCall, 'Login'),
            builder.CardAction.imBack(session, sendCall1, 'Create Account'),
            builder.CardAction.imBack(session, sendCall2, 'Check Exchange Rate')
        ]);
    attachment.push(card);      
    //Displays restaurant hero card carousel in chat box 
    var message = new builder.Message(session)
    .attachmentLayout(builder.AttachmentLayout.carousel)
    .attachments(attachment);
    session.send(message);
}


function helpUser(message, session, username) {
    var attachment = [];
    var restaurants = JSON.parse(message);
    var sendCall = 'balance';
    var sendCall1 = 'deposit';
    var sendCall2 = 'withdraw';
    var sendCall3 = 'payment';
    var sendCall4 = 'exchange rate';
    var sendCall5 = 'logout';
    var card = new builder.HeroCard(session)
        .title('Hello, %s! How can I help you?', username)
        .buttons([
            builder.CardAction.imBack(session, sendCall, 'Check Balance'),
            builder.CardAction.imBack(session, sendCall1, 'Deposit'),
            builder.CardAction.imBack(session, sendCall2, 'Withdraw'),
            builder.CardAction.imBack(session, sendCall3, 'Make Payments'),
            builder.CardAction.imBack(session, sendCall4, 'Check Exchange Rate'),
            builder.CardAction.imBack(session, sendCall5, 'Logout')
        ]);
    attachment.push(card);      
    //Displays restaurant hero card carousel in chat box 
    var message = new builder.Message(session)
    .attachmentLayout(builder.AttachmentLayout.carousel)
    .attachments(attachment);
    session.send(message);
}
