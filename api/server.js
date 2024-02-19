const Express = require("express");
const dotenv = require("dotenv");
// const mongoose = require("mongoose");
const TextToSpeechV1 = require("ibm-watson/text-to-speech/v1");
const { IamAuthenticator } = require("ibm-watson/auth");
const fs = require("fs");

dotenv.config();

// const app = Express();

try {
  const textToSpeech = new TextToSpeechV1({
    authenticator: new IamAuthenticator({
      apikey: "sSa8nFjgWge6EtF4zLmrCPwcuT7emvtZQFSoCfrQw0kG",
    }),
    serviceUrl: "https://api.eu-gb.text-to-speech.watson.cloud.ibm.com",
  });
  console.log("✅ Connected to IBM Watson");
  const synthesizeParams = {
    text: "Hello world",
    accept: "audio/wav",
    voice: "en-GB_JamesV3Voice",
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
  //     fs.writeFileSync("hello_world.wav", buffer);
  //   })
  //   .catch((err) => {
  //     console.log("error:", err);
  //   });
} catch (error) {
  console.log(error);
}

// Connect to DB
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("✅ Connected to database");
//     // Listen to request
//     app.listen(process.env.PORT, process.env.DOMAIN, () => {
//       console.log(
//         `✅ Server started on ${process.env.DOMAIN}:${process.env.PORT}`
//       );
//     });
//   })
//   .catch((error) => {
//     console.error(error);
//   });
