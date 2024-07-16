/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onCall} = require("firebase-functions/v2/https");
const {onDocumentDeleted, onDocumentUpdate} = require("firebase-functions/v2/firestore");

const {initializeApp} = require("firebase-admin/app");

const deleteReferencesModule = require('./functionCalls/deleteReferencesModule');
const getDataModule = require('./functionCalls/getDataModule');
const filterDataModule = require('./functionCalls/filterDataModule');


initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.deleteProposalReferences = onDocumentDeleted("/proposal/{docId}", deleteReferencesModule.handleProposalReferences);

exports.deletePropertyReferences = onDocumentDeleted("/property/{docId}", deleteReferencesModule.handlePropertyReferences);

exports.deleteBuildingReferences = onDocumentDeleted("/building/{docId}", deleteReferencesModule.handleBuildingReferences);

exports.getData = onCall({ cors: ['https://gc-roofing.web.app', "http://localhost:3000"] }, getDataModule.getData);

exports.filterData = onCall({ cors: ['https://gc-roofing.web.app', "http://localhost:3000"] }, filterDataModule.filterData);






