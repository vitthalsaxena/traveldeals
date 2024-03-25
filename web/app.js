const express = require('express');
const path = require('path');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
const {PubSub} = require('@google-cloud/pubsub');

//Middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Set a variable pointing to our pubsub topic
const pubsubTopic = 'travel_deals_signup';

//Routes
app.get('/', (req, res) => {
  //res.status(200).send('Hello, world!');
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/subscribe', async(req,res) => {
  const email = req.body.email_address;
  const regions = req.body.watch_region;

  //Create a Pubsub client
  const pubsubClient = new PubSub();

  //Create the 'payload' for our message
  const msgdata = JSON.stringify({
    email_address:email,
    watch_regions:regions
  });

  //Create a data buffer that allows us to stream the message to the topic
  const dataBuffer = Buffer.from(msgdata);

  //Publish the message to the PubSub topic
  const msgId = await pubsubClient.topic(pubsubTopic).publishMessage({data:dataBuffer});

  console.log(`Message ID: ${msgId}`);
  res.status(200).send(`Thanks for signing up for TravelDeals.<br/>Message ID: ${msgId}`);

});

app.listen(port, () => {
  console.log(`TravelDeals Web App listening on port ${port}`);
});