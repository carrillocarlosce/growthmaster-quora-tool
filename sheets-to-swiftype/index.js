/**
 * @license
 * Copyright Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// [START sheets_quickstart]
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const md5 = require("md5");
const AppSearchClient = require("@elastic/app-search-node");
const client = new AppSearchClient(
  "host-n5kv8j",
  "private-gch3qddbk2n4wx5aybtcb2ar"
);
const engineName = "growthmasters-viral-content-tool-new";
// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

// Load client secrets from a local file.
fs.readFile("credentials.json", (err, content) => {
  if (err) return console.log("Error loading client secret file:", err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), listMajors);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error(
          "Error while trying to retrieve access token",
          err
        );
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}
async function wait(time) {
  console.log("waiting " + time / 1000 + " seconds...");
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });
}
/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function listMajors(auth) {
  const sheets = require("./sheets");
  for (let i = 0; i < sheets.length; i++) {
    const sheetId = sheets[i];
    const rows = await getSheet(auth, sheetId);
    if (rows.length) {
      await parseRows(rows);
      wait(10000);
    } else {
      console.log("No data found.");
    }
  }
}

function getSheet(auth, sheetId) {
  return new Promise((resolve, reject) => {
    const sheets = google.sheets({ version: "v4", auth });
    sheets.spreadsheets.values.get(
      {
        spreadsheetId: sheetId,
        range: "Output!A2:AC",
      },
      (err, res) => {
        if (err) {
          reject("The API returned an error: " + err);
        }
        const rows = res.data.values;
        resolve(rows);
      }
    );
  });
}
// [END sheets_quickstart]
async function parseRows(rows) {
  const data = rows.map((row) => {
    const indexes = require("./columnsIndex");
    const question = row[indexes.question];
    const url = row[indexes.url];
    const upvotes = +row[indexes.upvotes].replace(",", "");
    const answer_preview = row[indexes.answer_preview];
    const audience = row[indexes.audience];
    const id = md5(url);
    return {
      id,
      question,
      url,
      upvotes,
      answer_preview,
      audience,
    };
  });
  const itemsSet = {};
  data.forEach((item) => {
    const fromSet = itemsSet[item.id];
    if (fromSet) {
      if (item.upvotes > fromSet.upvotes) {
        itemsSet[item.id] = item;
      }
      return;
    }
    return (itemsSet[item.id] = item);
  });
  const documentsRaw = Object.values(itemsSet);
  const documents = documentsRaw.filter((item) => {
    const hasQuestion = Boolean(item.question);
    const hasUrl = Boolean(item.url);
    return hasQuestion && hasUrl;
  });
  console.log("TOTAL ROWS: " + data.length);
  console.log("UNIQUE ROWS: " + documents.length);
  console.log(documents);
  const fragments = [];
  const fragmentLength = 100;
  for (let i = 0; i * fragmentLength < documents.length; i++) {
    fragments.push(
      documents.slice(i * fragmentLength, (i + 1) * fragmentLength)
    );
  }
  try {
    await postDocuments(fragments);
    console.log("Task completed succesfully...");
  } catch (error) {
    console.log("An error has ocurred.");
    console.log(error);
  }
}

async function postDocuments(fragments) {
  try {
    for (let i = 0; i < fragments.length; i++) {
      const documents = fragments[i];
      const docs = await client.indexDocuments(engineName, documents);
      await wait(10000);
      console.log(docs);
    }
  } catch (error) {
    throw error;
  }
}
module.exports = {
  SCOPES,
  listMajors,
};
