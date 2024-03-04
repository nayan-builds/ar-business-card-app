const TextToSpeechV1 = require("ibm-watson/text-to-speech/v1");
const { IamAuthenticator, IamTokenManager } = require("ibm-watson/auth");
const WebSocket = require("ws");
const fs = require("fs");

const tokenManager = new IamTokenManager({
  apikey: process.env.IBM_API_KEY,
});

async function textToSpeech(req, res) {
  const { text, voice } = req.body;
  const audio = await synthesizeTTS(text, voice);
  res.send(audio);
}

async function synthesizeTTS(text, voice = "en-GB_JamesV3Voice") {
  var timings = [];
  var audio = Buffer.alloc(8);

  return new Promise(async (resolve, reject) => {
    var token = await tokenManager.getToken();
    var websocket = new WebSocket(
      `${process.env.IBM_SERVICE_URL}/v1/synthesize?access_token=${token}&voice=${voice}`
    );

    websocket.onopen = (e) => {
      var message = {
        text: text,
        timings: ["words"],
        accept: "audio/mp3",
      };

      websocket.send(JSON.stringify(message));
    };

    websocket.onmessage = (e) => {
      var chunk = e.data;
      if (typeof chunk === "string") {
        try {
          chunk = JSON.parse(chunk);
          if (chunk.words) {
            timings.push(...chunk.words);
          }
        } catch {
          //
        }
      } else {
        audio = Buffer.concat([audio, e.data]);
      }
    };

    websocket.onclose = () => {
      resolve({
        timings: timings,
        audio: audio.toString("base64"),
      });
    };
  });
}

module.exports = {
  textToSpeech,
};
