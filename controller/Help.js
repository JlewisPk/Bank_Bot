var rest = require('../API/Restclient');
var builder = require('botbuilder');


//Calls 'getNutritionData' in RestClient.js with 'getFoodNutrition' as callback to get ndbno of food
exports.displayHelperCards = function getHelpData(username, session){
    var url = 'http://msa-lewis-bankapp.azurewebsites.net/tables/accounts';
    rest.getHelpData(url, session,username, helpStarter);
}


function helpStarter(message, session, username) {
    var attachment = [];
    var restaurants = JSON.parse(message);
    var card = new builder.HeroCard(session)
        .title('Hello, %s! How can I help you?', username)
        .buttons([
            builder.CardAction.openUrl(session, url, 'More Information')
        ]);
    attachment.push(card);      
    //Displays restaurant hero card carousel in chat box 
    var message = new builder.Message(session)
    .attachmentLayout(builder.AttachmentLayout.carousel)
    .attachments(attachment);
    session.send(message);
}
