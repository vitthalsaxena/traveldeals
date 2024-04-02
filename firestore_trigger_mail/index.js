require('dotenv').config()
const sgMail = require('@sendgrid/mail');
const {Firestore} = require('@google-cloud/firestore');

exports.sendMail = (event, context) => {
    const triggerResource = context.resource;
    console.log(`Function triggered by event on: ${triggerResource}`);
    console.log(`Event type: ${context.eventType}`);

    // Print the entire document object as a JavaScript object
    console.log("Event value as a JavaScript object:");
    console.log(event.value);

    // Print the entire document object as a JSON string
    console.log("Event value as a JSON string:");
    console.log(JSON.stringify(event.value));

    //Query fields
    event.value.fields.location.arrayValue.values.forEach((c)=>{
        queryFS(c.stringValue);
    });

    async function queryFS(location){
        //Connect to the database
        const db = new Firestore({
            projectId: 'visaxen-traveldeals'
        });
    
        const subInfo = db.collection('subscribers');
    
        //Query the 'subscriber' collection
        const queryRef = subInfo.where('watch_regions','array-contains',`${location}`);
    
        //Retrieve the query in a snapshot
        queryRef.get().then((querySnapshot) => {
            //Loop through the documetns in the snapshot
            querySnapshot.forEach((doc) => {
                console.log(doc.data().email_address);
                // GET OUR API KEY
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                // CREATE AN EMAIL MESSAGE
                const msg = {
                    to: doc.data().email_address,
                    from: process.env.SENDGRID_SENDER,
                    subject: 'visaxen '+event.value.fields.headline
                };

                // SEND THE MESSAGE THROUGH SENDGRID
                sgMail
                .send(msg)
                .then(() => {}, error => {
                    console.error(error);
                });
            });
        });
    }
}
