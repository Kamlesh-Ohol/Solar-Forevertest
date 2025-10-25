// /**
//  * Import function triggers from their respective submodules:
//  *
//  * const {onCall} = require("firebase-functions/v2/https");
//  * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
//  *
//  * See a full list of supported triggers at https://firebase.google.com/docs/functions
//  */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started

// // exports.helloWorld = onRequest((request, response) => {
// //   logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });



// This code goes in your Cloud Functions 'index.js' file, NOT script.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const twilio = require('twilio');

admin.initializeApp();

// Set your Twilio credentials securely
const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;
const twilioNumber = functions.config().twilio.number;

const client = new twilio(accountSid, authToken);

/**
 * Triggers when a sellQuery document is updated.
 */
exports.onSellQueryStatusChange = functions.firestore
    .document('sellQueries/{queryId}')
    .onUpdate(async (change, context) => {
        
        const newData = change.after.data();
        const oldData = change.before.data();

        // Check if the status has actually changed
        if (newData.status === oldData.status) {
            console.log("Status unchanged, exiting.");
            return null;
        }

        let message = '';
        const userPhone = newData.sellerPhone; // The user's phone number

        if (newData.status === 'approved') {
            message = `SolarForever: Great news! Your panel (${newData.panelParams}) has been approved and is now live in our marketplace.`;
        } else if (newData.status === 'rejected') {
            message = `SolarForever: Unfortunately, we could not approve your panel (${newData.panelParams}) at this time. Our team will contact you with more details.`;
        } else {
            // Not a status we care about (e.g., "sold")
            return null;
        }

        // Send the SMS
        try {
            await client.messages.create({
                body: message,
                from: twilioNumber,
                to: userPhone // Make sure this number is in E.164 format (e.g., +919999999999)
            });
            console.log(`SMS sent to ${userPhone}`);
            return null;
        } catch (error) {
            console.error(`Error sending SMS to ${userPhone}:`, error);
            return null;
        }
    });