import express from "express"
import cors from "cors"
import router from "./routes"


const { google } = require('googleapis');
import open from "open";
const readline = require('readline');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const oauth2Client = new google.auth.OAuth2(
  "581731260343-rvga46o34kknn3205gn4rmon73ndu01c.apps.googleusercontent.com",
    "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",
  'http://localhost:3000' // redirect URI for desktop app
);

const SCOPES = ['https://www.googleapis.com/auth/meetings.space.created'];

async function getRefreshToken() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });

  console.log('Opening browser for Google authentication...');
  await open(authUrl);

  rl.question('Enter the code from the page here: ', async (code :any) => {
    try {
      const { tokens } = await oauth2Client.getToken(code);
      console.log('\n✅ Your refresh token:\n');
      console.log(tokens.refresh_token);
      rl.close();
    } catch (error) {
      console.error('❌ Error retrieving access token', error);
      rl.close();
    }
  });
}



const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/v1' , router)
getRefreshToken()

app.listen(3000 , ()=>{
    console.log('App started')
})