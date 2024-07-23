/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onCall} = require("firebase-functions/v2/https");
const {onDocumentDeleted, onDocumentUpdated} = require("firebase-functions/v2/firestore");

const {initializeApp} = require("firebase-admin/app");

const deleteReferencesModule = require('./functionCalls/deleteReferencesModule');
const updateReferencesModule = require('./functionCalls/updateReferencesModule');
const changeReferencesModule = require('./functionCalls/changeReferencesModule');
const getDataModule = require('./functionCalls/getDataModule');
const filterDataModule = require('./functionCalls/filterDataModule');


initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started
exports.changeProposalReferences = onDocumentUpdated("/proposal/{docId}", changeReferencesModule.handleProposalReferences);
exports.changePropertyReferences = onDocumentUpdated("/property/{docId}", changeReferencesModule.handlePropertyReferences);
exports.changeBuildingReferences = onDocumentUpdated("/building/{docId}", changeReferencesModule.handleBuildingReferences);

exports.updateEntityReferences = onDocumentUpdated("/entity/{docId}", updateReferencesModule.handleEntityReferences);
exports.updateManagementReferences = onDocumentUpdated("/management/{docId}", updateReferencesModule.handleManagementReferences);
exports.updateTenantReferences = onDocumentUpdated("/tenant/{docId}", updateReferencesModule.handleTenantReferences);
exports.updatePropertyReferences = onDocumentUpdated("/property/{docId}", updateReferencesModule.handlePropertyReferences);

exports.deleteProposalReferences = onDocumentDeleted("/proposal/{docId}", deleteReferencesModule.handleProposalReferences);
exports.deletePropertyReferences = onDocumentDeleted("/property/{docId}", deleteReferencesModule.handlePropertyReferences);
exports.deleteBuildingReferences = onDocumentDeleted("/building/{docId}", deleteReferencesModule.handleBuildingReferences);

exports.getData = onCall({ cors: ['https://gc-roofing.web.app', "http://localhost:3000"] }, getDataModule.getData);

exports.filterData = onCall({ cors: ['https://gc-roofing.web.app', "http://localhost:3000"] }, filterDataModule.filterData);






