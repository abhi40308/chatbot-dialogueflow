# Project Overview

Chatbot to order pizza and check for order status by using order ID. This repo contains the webhook template for dialogueflow to connect to firebase, the server script is deployed on cloud functions of firebase. Test the bot [here](https://bot.dialogflow.com/yoyopizzachatbot).

# Application Architecture 

This bot is using DialogueFlow intents to initiate a conversation, which can be used to order pizza. There are four intents: 
Welcome intent, Default fallback intent, OrderPizza intent and CheckStatus intent.

![intents](https://github.com/abhi40308/chatbot-dialogueflow/blob/master/2.png)

Intent OrderPizza is being used to input pizza and customer details and stores it in variables. This intent has a webhook call which passes this stored information to firebase realtime database, the script of which can be found in this repo.

Intent CheckStatus is being used to check status of the order given a `order_id`. This intent takes the `order_id` and calls the firebase database to get the status of order. The autogenerated `key` of Firebase database object array is being used as `order_id`. 

![firebase database](https://github.com/abhi40308/chatbot-dialogueflow/blob/master/1.png)

These intents are using NLP techniques to understand customer response and `fuzzy matching` is enabled to match custom generated parameters (For ex. if customer mispells in type of pizza, which should be veg, non-veg, etc.)

You can access the bot (here)[https://bot.dialogflow.com/yoyopizzachatbot]

![Screenshot](https://github.com/abhi40308/chatbot-dialogueflow/blob/master/3.png)

# Dialogflow: Webhook Template using Node.js and Cloud Functions for Firebase

## Setup Instructions

### Steps
1. Deploy the fulfillment webhook provided in the functions folder using [Google Cloud Functions for Firebase](https://firebase.google.com/docs/functions/):
   1. Follow the instructions to [set up and initialize Firebase SDK for Cloud Functions](https://firebase.google.com/docs/functions/get-started#set_up_and_initialize_functions_sdk). Make sure to select the project that you have previously generated in the Actions on Google Console and to reply `N` when asked to overwrite existing files by the Firebase CLI.
   2. Navigate to the <code>firebase/functions</code> directory and run <code>npm install</code>.
   3. Run `firebase deploy --only functions` and take note of the endpoint where the fulfillment webhook has been published. It should look like `Function URL (yourAction): https://${REGION}-${PROJECT}.cloudfunctions.net/yourAction`
2. Go to the Dialogflow console and select *Fulfillment* from the left navigation menu.
3. Enable *Webhook*, set the value of *URL* to the `Function URL` from the previous step, then click *Save*.
4. Select *Intents* from the left navigation menu. Select the `Default Welcome Intent` intent, scroll down to the end of the page and click *Fulfillment*, check *Use webhook* and then click *Save*. This will allow you to have the welcome intent be a basic webhook intent to test.
5. Build out your agent and business logic by adding function handlers for Dialogflow actions.
