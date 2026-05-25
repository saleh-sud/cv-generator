import fs from "fs";
import path from "path";
import https from "https";

// We want to download the following fonts in TTF format
const fonts = [
  {
    family: "Cairo",
    weights: [
      { name: "Regular", query: "400" },
      { name: "Bold", query: "700" }
    ]
  },
  {
    family: "Amiri",
    weights: [
      { name: "Regular", query: "400" },
      { name: "Bold", query: "700" }
    ]
  }
];

// Helper to make an HTTP GET request and return the response body as string
async function fetchText(url) {
  const userAgents = [
    // Android 2.2 browser (Very old, does not support WOFF/WOFF2, only TTF)
    "Mozilla/5.0 (Linux; U; Android 2.2; en-us; Nexus One Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
    // iPhone OS 4 (No WOFF, support TTF only)
    "Mozilla/5.0 (iPhone; CPU iPhone OS 4_0 like Mac OS X) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8A293 Safari/6531.22.7",
    // PhantomJS / Headless WebKit (Often mapped to TTF)
    "Mozilla/5.0 (Unknown; Linux x86_64) AppleWebKit/538.1 (KHTML, like Gecko) Safari/538.1",
    // Safari 5 (supports TTF but not WOFF2, usually triggers TTF)
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50"
  ];

  for (const ua of userAgents) {
    try {
      const data = await new Promise((resolve, reject) => {
        https.get(url, {
          headers: { "User-Agent": ua }
        }, (res) => {
          let body = "";
          res.on("data", (chunk) => { body += chunk; });
          res.on("end", () => resolve(body));
        }).on("error", reject);
      });

      if (data.includes(".ttf")) {
        console.log(`Successfully obtained TTF format using User-Agent: ${ua.substring(0, 40)}...`);
        return data;
      }
    } catch (err) {
      console.warn(`Failed with User-Agent ${ua.substring(0, 20)}: ${err.message}`);
    }
  }

  // Fallback to the first UA if none contained .ttf explicitly
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { "User-Agent": userAgents[0] }
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

// Helper to download a binary file
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download: status ${res.statusCode}`));
        return;
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on("finish", () => {
        fileStream.close();
        resolve();
      });
    }).on("error", reject);
  });
}

async function main() {
  const publicFontsDir = path.resolve("./public/fonts");
  if (!fs.existsSync(publicFontsDir)) {
    fs.mkdirSync(publicFontsDir, { recursive: true });
  }

  for (const font of fonts) {
    console.log(`\nFetching css for font family: ${font.family}...`);
    // Example: https://fonts.googleapis.com/css?family=Cairo:400,700&subset=arabic
    const cssUrl = `https://fonts.googleapis.com/css?family=${font.family}:${font.weights.map(w => w.query).join(",")}&subset=arabic`;
    
    try {
      const cssContent = await fetchText(cssUrl);
      console.log(`Successfully fetched Google Fonts CSS metadata.`);

      // Regular expressions to extract TTF urls
      // The CSS looks like:
      // @font-face {
      //   font-family: 'Cairo';
      //   font-style: normal;
      //   font-weight: 400;
      //   src: local('Cairo'), local('Cairo-Regular'), url(https://fonts.gstatic.com/s/cairo/v28/4UaGrENHsx2Y_O3uy-InzZqX0mg.ttf) format('truetype');
      // }
      // Let's break the CSS down by font-face blocks
      const fontFaceBlocks = cssContent.split("font-face");
      
      for (const w of font.weights) {
        let ttfUrl = null;
        
        // Find the block corresponding to this weight
        for (const block of fontFaceBlocks) {
          if (block.includes(`font-weight: ${w.query}`) || block.includes(`font-weight:  ${w.query}`)) {
            const match = block.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.ttf)\)/);
            if (match && match[1]) {
              ttfUrl = match[1];
              break;
            }
          }
        }

        // Fallback search if strict block matches fail
        if (!ttfUrl) {
          console.log(`Strict weight block match failed for ${font.family} weight ${w.query}. Trying general search...`);
          // General regex for URL
          const matches = cssContent.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.ttf)\)/g);
          if (matches && matches.length > 0) {
            // Pick first or corresponding
            ttfUrl = matches[w.query === "400" ? 0 : (matches.length > 1 ? 1 : 0)].replace(/url\(|\)/g, "");
          }
        }

        if (ttfUrl) {
          console.log(`Found TTF URL for ${font.family}-${w.name}: ${ttfUrl}`);
          const destFile = path.join(publicFontsDir, `${font.family}-${w.name}.ttf`);
          console.log(`Downloading and saving to ${destFile}...`);
          await downloadFile(ttfUrl, destFile);
          console.log(`Success! Saved ${font.family}-${w.name}.ttf`);
        } else {
          console.warn(`Could not find a TTF url for ${font.family} weight ${w.query} in Google Fonts CSS.`);
          console.log("CSS read:\n", cssContent);
        }
      }
    } catch (err) {
      console.error(`Error processing ${font.family}:`, err.message);
    }
  }
}

main().then(() => {
  console.log("\nFont download script complete.");
}).catch(console.error);
