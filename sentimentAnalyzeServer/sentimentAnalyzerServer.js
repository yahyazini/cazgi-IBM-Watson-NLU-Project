const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const getNLUInstance = () => {
  const apiKey = process.env.API_KEY;
  const apiUrl = process.env.API_URL;
  const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
  const { IamAuthenticator } = require("ibm-watson/auth");

  return new NaturalLanguageUnderstandingV1({
    version: "2020-08-01",
    authenticator: new IamAuthenticator({
      apikey: apiKey,
    }),
    serviceUrl: apiUrl,
  });
};

const app = new express();

app.use(express.static("client"));

const cors_app = require("cors");
app.use(cors_app());

app.get("/", (req, res) => {
  res.render("index.html");
});

app.get("/url/emotion", async (req, res) => {
  try {
    const response = await getNLUInstance().analyze({
      url: req.query.url,
      features: {
        emotion: {},
      },
    });
    return res.send(response.result.emotion.document.emotion);
  } catch (err) {
    console.log("Failed to get emotion:", err);
  }
});

app.get("/url/sentiment", async (req, res) => {
  try {
    const response = await getNLUInstance().analyze({
      url: req.query.url,
      features: {
        sentiment: {},
      },
    });
    return res.send(response.result.sentiment.document);
  } catch (err) {
    console.log("Failed to get sentiment:", err);
  }
});

app.get("/text/emotion", async (req, res) => {
  try {
    const response = await getNLUInstance().analyze({
      text: req.query.text,
      features: {
        emotion: {},
      },
    });
    return res.send(response.result.emotion.document.emotion);
  } catch (err) {
    console.log("Failed to get emotion:", err);
  }
});

app.get("/text/sentiment", async (req, res) => {
  try {
    const response = await getNLUInstance().analyze({
      text: req.query.text,
      features: {
        sentiment: {},
      },
    });
    return res.send(response.result.sentiment.document);
  } catch (err) {
    console.log("Failed to get sentiment:", err);
  }
});

let server = app.listen(8080, () => {
  console.log("Listening", server.address().port);
});
