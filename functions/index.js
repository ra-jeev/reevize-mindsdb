/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { setGlobalOptions } = require("firebase-functions/v2/options");
const { onRequest } = require("firebase-functions/v2/https");
const { storageBucket } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const { ImageAnnotatorClient } = require("@google-cloud/vision");

setGlobalOptions({ maxInstances: 10 });

// Creates a client
const client = new ImageAnnotatorClient();

exports.extractTextFromImages = onRequest(
  { cors: ["http://localhost:3000"] },
  async (request, response) => {
    logger.info("Hello ExtractTextFromImage!", { structuredData: true });

    const body = request.body;
    logger.debug("incoming request body", body);

    const promises = [];
    for (const image of body.images) {
      promises.push(
        client.textDetection(`gs://${storageBucket.value()}/${image}`)
      );
    }

    const fnRes = [];
    const extractResults = await Promise.all(promises);
    for (const [index, extractResult] of extractResults.entries()) {
      const [textDetections] = extractResult;
      const [annotation] = textDetections.textAnnotations;
      const text = annotation ? annotation.description.trim() : "";
      console.log("Extracted Text Length:", text.length);

      fnRes.push({
        image: body.images[index],
        text,
      });
    }

    response.send(fnRes);
  }
);
