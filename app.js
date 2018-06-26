var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});



// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var inMemoryStorage = new builder.MemoryBotStorage();

// Create your bot with a function to receive messages from the user

var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send("Welcome ");
        session.beginDialog('askForDateTime');
    }
]).set('storage', inMemoryStorage);

bot.dialog('askForDateTime', [
    function (session) {
        var msg = new builder.Message(session)
            .text("Thank you for expressing interest in our premium golf shirt! What color of shirt would you like?")
            .suggestedActions(
                builder.SuggestedActions.create(
                    session, [
                        builder.CardAction.imBack(session, "productId=1&color=green", "Green"),
                        builder.CardAction.imBack(session, "productId=1&color=blue", "Blue"),
                        builder.CardAction.imBack(session, "productId=1&color=red", "Red")
                    ]
                ));
        session.send(msg).endDialog();
    },

    function (session, results) {
        session.endDialog();
    }
]);