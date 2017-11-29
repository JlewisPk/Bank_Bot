var request = require('request'); //node module for http post requests
var help = require('./Help');

exports.retreiveMessage = function (session){
    request.post({
        url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/cfdf1f29-b6db-4ae8-b310-57d3ed8e2245/url?iterationId=901f6731-2735-42ba-940a-b23f994a6db3',
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Prediction-Key': '2c8600cda0a845ee834da798650406f7'
        },
        body: { 'Url': session.message.text }
    }, function(error, response, body){
        console.log(validResponse(body));
        session.send(validResponse(body));
        if (!session.conversationData["username"]) {
            help.displayStarterHelp(session);
        } else {
            help.displayHelperCards(session, session.conversationData["username"]);  
        }
    });
}

function validResponse(body){
    if (body && body.Predictions && body.Predictions[0].Tag){
        return "This is " + body.Predictions[0].Tag
    } else{
        console.log('Sorry we did not recognize this image, please try another');
    }
}