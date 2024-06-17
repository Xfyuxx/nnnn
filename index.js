const express = require("express");
const bodyParser = require("body-parser");
const cheerio = require("cheerio");
const { execSync } = require("child_process");
const req = require("./request.js"); // Assuming you have a custom request module
const app = express();

const commoncookie =
  "Anti-Bypass=BypassersKHTTP_VERSION5069e4e61337c2fbea2368f9da1a07725f2a65bb1eab2d8de6dc9cf83e7a683e; .pipe=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJLMGc4SjNsRmY1TW43UWw4bVh5bytpNnVBeGh4aWFSYTU2bldDZEcxQnlNPSIsImUiOjE2ODkyNTAyODEsImlzc3VlZCI6MTY4OTI0NjY4MS44MzksInNhbHQiOiJzYWx0eSIsImNvbm5lY3RvciI6LTF9.tHnUGnosgCctAafGTgta4F1_1KQezhvdIATrj9YwQU0";

const commonheader = {
  Referer: "https://work.ink/",
  "User-Agent":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
  Cookie: commoncookie,
};

async function bypassLogic() {
  try {
    const response = await req.request(
      "https://banana-hub.xyz/getkey",
      commonheader,
    );
    console.log("\nBypassed final checkpoint & getting key...");

    const responseHtml = response.data;
    const $ = cheerio.load(responseHtml);
    const url = $("a").attr("href");
    console.log("\nLINK :", url);

    const resKeyUrl = await req.request(url, commonheader);
    const keyHtmlUrl = resKeyUrl.data;

    const parsed = cheerio.load(keyHtmlUrl);
    const keyUrl = parsed("a").attr("href");
    console.log("\nLINK KEY:", keyUrl);

    const keyPol = await req.request(keyUrl, commonheader);
    const keyHtml = keyPol.data;

    const get = cheerio.load(keyHtml);
    const script = get(".box").text().trim().replace(/\s+/g, " ");

    const ambilKey = /getgenv\(\)\.Key\s*=\s*"([^"]+)"/;
    const hasilKey = script.match(ambilKey);

    const key = hasilKey ? hasilKey[1] : null;
    console.log("\nKey :", key);

    return key;
  } catch (error) {
    throw new Error(`Failed to bypass: ${error.message}`);
  }
}

// API endpoint
app.get("/api/bananahub", async (req, res) => {
  try {
    const key = await bypassLogic();
    res.json({ key, server: "https://discord.gg/sNzhShv8V8" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
