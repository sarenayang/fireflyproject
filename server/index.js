import express from 'express';
import pkg from 'request';
const { post } = pkg;
import { config } from 'dotenv';

const port = 5000

global.access_token = ''

config()

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET

var spotify_redirect_uri = 'http://localhost:5000/auth/callback'

var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var app = express();

app.get('/auth/login', (req, res) => {

  var scope = "streaming user-read-email user-read-private"
  var state = generateRandomString(16);

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: spotify_redirect_uri,
    state: state
  })

  res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
})

app.get('/auth/callback', (req, res) => {

  var code = req.query.code;

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: spotify_redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    json: true
  };

  post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      res.redirect('/')
    }
    console.log("fuck");
  });

})

app.get('/auth/token', (req, res) => {
  res.json({ access_token: access_token})
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})

// import express from "express"; // Express web server framework
// import { post } from "request";

// import { stringify } from "querystring";
// import cookieParser from "cookie-parser";
// import fs from "fs";
// import jwt from "jsonwebtoken";

// import cors from "cors";

// require("dotenv").config();

// const client_id = process.env.clientID; // Your client id
// const client_secret = process.env.clientSecret; // Your secret

// const redirect_uri = "http://localhost:5173/callback"; // Your redirect uri

// /**
//  * Generates a random string containing numbers and letters
//  * @param  {number} length The length of the string
//  * @return {string} The generated string
//  */
// var generateRandomString = function (length) {
//   var text = "";
//   var possible =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

//   for (var i = 0; i < length; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return text;
// };

// var stateKey = "spotify_auth_state";

// var app = express();

// app
//   .use(express.static(__dirname + "/public"))
//   .use(cors())
//   .use(cookieParser());

// app.get("/login", function (req, res) {
//   var state = generateRandomString(16);
//   res.cookie(stateKey, state);

//   // your application requests authorization
//   var scope = "user-read-private user-read-email user-top-read";
//   res.redirect(
//     "https://accounts.spotify.com/authorize?" +
//       stringify({
//         response_type: "code",
//         client_id: client_id,
//         scope: scope,
//         redirect_uri: redirect_uri,
//         state: state,
//       })
//   );
// });

// app.get("/callback", function (req, res) {
//   // your application requests refresh and access tokens
//   // after checking the state parameter

//   var code = req.query.code || null;
//   var state = req.query.state || null;
//   var storedState = req.cookies ? req.cookies[stateKey] : null;

//   if (state === null || state !== storedState) {
//     res.redirect(
//       "/#" +
//         stringify({
//           error: "state_mismatch",
//         })
//     );
//   } else {
//     res.clearCookie(stateKey);
//     var authOptions = {
//       url: "https://accounts.spotify.com/api/token",
//       form: {
//         code: code,
//         redirect_uri: redirect_uri,
//         grant_type: "authorization_code",
//       },
//       headers: {
//         Authorization:
//           "Basic " +
//           new Buffer(client_id + ":" + client_secret).toString("base64"),
//       },
//       json: true,
//     };

//     post(authOptions, function (error, response, body) {
//       if (!error && response.statusCode === 200) {
//         access_token = body.access_token;
//         var access_token = body.access_token,
//           refresh_token = body.refresh_token;

//         res.redirect(
//           "/#" +
//             stringify({
//               client: "spotify",
//               access_token: access_token,
//               refresh_token: refresh_token,
//             })
//         );

//       } else {
//         res.send("There was an error during authentication.");
//       }
//     });
//   }
// });

// app.get("/refresh_token", function (req, res) {
//   // requesting access token from refresh token
//   var refresh_token = req.query.refresh_token;
//   var authOptions = {
//     url: "https://accounts.spotify.com/api/token",
//     headers: {
//       Authorization:
//         "Basic " +
//         new Buffer(client_id + ":" + client_secret).toString("base64"),
//     },
//     form: {
//       grant_type: "refresh_token",
//       refresh_token: refresh_token,
//     },
//     json: true,
//   };
//   post(authOptions, function (error, response, body) {
//     if (!error && response.statusCode === 200) {
//       var access_token = body.access_token;
//       res.send({
//         access_token: access_token,
//       });
//     }
//   });
// });

// app.listen(5000, function () {
//   console.log("Server is running on port 5000");
// });