const TextToSpeechV1 = require("ibm-watson/text-to-speech/v1");
const { IamAuthenticator } = require("ibm-watson/auth");
const fs = require("fs");

function textToSpeech(req, res) {
  const { text, voice } = req.body;
  //   const audio = synthesizeTTS(text, voice);
  //   console.log(audio);
  //   res.send(audio);

  //Test
  fs.readFile("./hello_world.wav", function (err, result) {
    res.send(result.toString("base64"));
  });
}

async function synthesizeTTS(text, voice = "en-GB_JamesV3Voice") {
  const textToSpeech = new TextToSpeechV1({
    authenticator: new IamAuthenticator({
      apikey: process.env.IBM_API_KEY,
    }),
    serviceUrl: process.env.IBM_SERVICE_URL,
  });
  console.log("✅ Connected to IBM Watson");

  const synthesizeParams = {
    text,
    accept: "audio/wav",
    voice,
  };

  // textToSpeech
  //   .synthesize(synthesizeParams)
  //   .then((response) => {
  //     // The following line is necessary only for
  //     // wav formats; otherwise, `response.result`
  //     // can be directly piped to a file.
  //     return textToSpeech.repairWavHeaderStream(response.result);
  //   })
  //   .then((buffer) => {
  //     return buffer
  //   })
  //   .catch((err) => {
  //     console.log("error:", err);
  //   });

  // return textToSpeech;

  const audio = testAudio;
  return audio;
}

module.exports = {
  textToSpeech,
};
