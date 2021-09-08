const functions = require('firebase-functions');
const cors = require('cors')({ origin: true});
const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

//initializing firebase admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  //databaseURL: "https://fireship-lessons.firebaseio.com"
});

//importing session client from dialogflow
const { SessionsClient } = require('dialogflow');

//setting up cloud function called 'dialogflowGateway' on firebase 
exports.dialogflowGateway = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    const { queryInput, sessionId } = request.body; 

    //initiating session client using service account credentials
    const sessionClient = new SessionsClient({ credentials: serviceAccount  });
    //setting up session path and storinf in session variable
    const session = sessionClient.sessionPath('appointmentbot-ribw', sessionId);

    //store array of responses
    const responses = await sessionClient.detectIntent({ session, queryInput});

    //
    const result = responses[0].queryResult;

    response.send(result);
  });
});

/*
let intentMap = new Map();
intentMap.set('Book an Appointment', bookingHandler);
intentMap.set('Cancel an Appointment', cancelingHandler);
agent.handleRequest(intentMap);*/