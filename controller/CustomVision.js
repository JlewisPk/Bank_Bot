var request = require('request'); //node module for http post requests
var help = require('./Help');

exports.retreiveMessage = function (session){
    request.post({
        url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/73f17766-0221-4ccf-9507-9d0a363526b0/url?iterationId=a7989323-a544-4914-b9b6-dced6f12af6e',
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Prediction-Key': '34b1b52fbb324d699cd3e52debec4c37'
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
// exports.retreiveMessage2 = function (session) {
//     request.post({
//         url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/73f17766-0221-4ccf-9507-9d0a363526b0/image?iterationId=a7989323-a544-4914-b9b6-dced6f12af6e',
//         json: true,
//         octet: true,
//         headers: {
//             'Content-Type': 'application/octet-stream',
//             'Prediction-Key': '34b1b52fbb324d699cd3e52debec4c37'
//         },
//         body: session.message.attachments[0]
//     }, function(error, response, body) {
//         console.log("HIHIHIHIHI");
//         console.log(validResponse(body));
//         session.send(validResponse(body));
//     });
// }

function validResponse(body){
    if (body && body.Predictions && body.Predictions[0].Tag){
        return "This is " + body.Predictions[0].Tag
    } else{
        console.log('Sorry we did not recognize this image, please try another');
    }
}