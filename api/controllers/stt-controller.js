const { IamAuthenticator } = require("ibm-watson/auth");
const SpeechToTextV1 = require("ibm-watson/speech-to-text/v1");
const fs = require("fs");

const speechToTextV1 = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_STT_API_KEY,
  }),
  serviceUrl: process.env.IBM_STT_SERVICE_URL,
});

async function speechToText(req, res) {
  const { audio } = req.body;
  const text = await transcribeAudio(audio);
  res.send(text);
}

async function transcribeAudio(audio) {
  const recognizeParams = {
    audio: fs.createReadStream("sample-4.mp3"),
    contentType: "audio/mp3",
    model: "en-GB_BroadbandModel",
    wordAlternativesThreshold: 0.9,
  };

  speechToTextV1
    .recognize(recognizeParams)
    .then((speechRecognitionResults) => {
      speechRecognitionResults.result.results.forEach((result) => {
        if (result.final) {
          console.log(result.alternatives[0].transcript);
          return result.alternatives[0].transcript;
        }
      });
    })
    .catch((err) => {
      console.log("error:", err);
      return err;
    });
}

module.exports = { speechToText };
