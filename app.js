var restify = require('restify');
var builder = require('botbuilder');
var luis = require('./controller/LuisDialog');


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
<<<<<<< HEAD
    appId:'6d9a61ca-cb18-4c5a-b3a1-4bec646cfa74',
    appPassword:'ZL802-;apzjqqpUBSUR47%~'
=======
    appID:'6d9a61ca-cb18-4c5a-b3a1-4bec646cfa74',
    appPassword:'etdrFQT507_~*pxdNKGE74^'
>>>>>>> 328ffe281ce772d9df77e102e62d82ac90b02d66
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user
var bot = new builder.UniversalBot(connector, function (session) {
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});

// This line will call the function in your LuisDialog.js file
luis.startDialog(bot);