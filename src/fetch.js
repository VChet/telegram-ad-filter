function isValidURL(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidJSON(payload) {
  try {
    JSON.parse(payload);
    return true;
  } catch {
    return false;
  }
}

async function fetchAndParseJSON(url) {
  const content = await fetch(url).then((response) => response.text());
  if (!isValidJSON(content)) { throw new SyntaxError(`Invalid JSON: data from ${url}`); }
  return JSON.parse(content);
}

export async function fetchLists(urlsString) {
  const urls = urlsString.split("\n").map((url) => url.trim()).filter(Boolean);
  const resultSet = new Set();

  for (const url of urls) {
    if (!isValidURL(url)) {
      throw new URIError(`Invalid URL: ${url}. Please ensure it leads to an online source like GitHub, Gist, Pastebin, etc.`);
    }

    try {
      let parsedData = await fetchAndParseJSON(url);
      if (!Array.isArray(parsedData)) { throw new TypeError(`Invalid array: data from ${url}`); }
      parsedData = parsedData.map((entry) => entry.trim()).filter(Boolean);
      for (const entry of parsedData) { resultSet.add(entry); }
    } catch (error) {
      if (error instanceof SyntaxError) { throw error; }
      throw new Error(`Fetch error: ${url}. Please check the URL or your network connection.`);
    }
  }

  return [...resultSet];
}
