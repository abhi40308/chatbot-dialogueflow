'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
// initialise firebase sdk
var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://pizzaordering-afmxvx.firebaseio.com"
});

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  function checkStatus(agent){
	return admin.database().ref('/orders/'+agent.parameters.id).once('value').then(function(snapshot) {
    	const value = snapshot.val().status;
      	if(value !== null)
           agent.add(`Your order status is : ${value}`);
      	else
           agent.add(`Value was not found`);
    });
  }
  
  function createOrder(agent){
    const pizzatype = agent.parameters.pizza_type;
    const pizzasize = agent.parameters.pizza_size;
    const pizzacount = agent.parameters.pizza_no;
    const customername = agent.parameters.name;
    const customerphone = agent.parameters.phone_no;
    const customeraddress = agent.parameters.address;
    const status = "order-received";
    
    return admin.database().ref('orders').push({
    	pizzatype: pizzatype,
      	pizzasize: pizzasize,
      	pizzacount: pizzacount,
      customername: customername,
      customerphone: customerphone,
      customeraddress: customeraddress,
      status: status
    }).then((snap) => {
     const key = snap.key;
     agent.add(`Please note that your order id is "${key}", use this id to check order status`);
  	});
  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('OrderPizza', createOrder);
  intentMap.set('CheckStatus', checkStatus);
  agent.handleRequest(intentMap);
});
