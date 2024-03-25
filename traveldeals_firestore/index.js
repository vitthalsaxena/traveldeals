const {Firestore}=require('@google-cloud/firestore')

exports.writeToFirestore = async (message, context) => {
  console.log(`Encoded message: ${message.data}`);

  const incomingMessage = Buffer.from(message.data, 'base64').toString('utf-8');

  const parsedMessage = JSON.parse(incomingMessage);

  console.log(`Decoded message: ${JSON.stringify(parsedMessage)}`);
  console.log(`Email address: ${parsedMessage.email_address}`);

  //Write to firestore
  const firestore=new Firestore({
    projectId: "visaxen-traveldeals"
  });
  //Create a dummy object for demo purposes
  let dataObject={};

  dataObject.email_address = parsedMessage.email_address;
  dataObject.watch_regions = parsedMessage.watch_regions;
  
  console.log('The dataobject: ');
  console.log(dataObject);

  let collectionRef=firestore.collection('subscribers');
  let docRef=await collectionRef.add(dataObject);

  console.log(`Document created: ${docRef.id}`);
}