const { JWT } = require("google-auth-library");
const fs = require("fs");

// Load Service Account JSON
const serviceAccount = JSON.parse(fs.readFileSync("./genweb-451721-ce2215dee627.json", "utf8"));

// Get Google Drive Access Token
async function getAccessToken() {
  const client = new JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: ["https://www.googleapis.com/auth/drive"]
  });

  const token = await client.authorize();
  console.log("Access Token:", token.access_token);
  return token.access_token;
}

// Run the function
getAccessToken().catch(console.error);
