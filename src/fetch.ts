function isValidURL(payload: unknown): payload is URL {
  try {
    if (typeof payload !== "string") { return false; }
    const parsedUrl = new URL(payload);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidJSON(payload: string): boolean {
  try {
    JSON.parse(payload);
    return true;
  } catch {
    return false;
  }
}

async function fetchAndParseJSON(url: URL): Promise<unknown> {
  const content = await fetch(url).then((response) => response.text());
  if (!isValidJSON(content)) { throw new SyntaxError(`Invalid JSON: data from ${url}`); }
  return JSON.parse(content);
}

export async function fetchLists(urlsString: string): Promise<string[]> {
  const urls = urlsString.split("\n").map((url: string) => url.trim()).filter(Boolean);
  const resultSet: Set<string> = new Set();

  for (const url of urls) {
    if (!isValidURL(url)) {
      throw new URIError(`Invalid URL: ${url}. Please ensure it leads to an online source like GitHub, Gist, Pastebin, etc.`);
    }

    try {
      const parsedData = await fetchAndParseJSON(url);
      if (!Array.isArray(parsedData)) { throw new TypeError(`Invalid array: data from ${url}`); }

      const strings: string[] = parsedData
        .filter((entry): entry is string => typeof entry === "string")
        .map((entry) => entry.trim())
        .filter(Boolean);

      for (const string of strings) { resultSet.add(string); }
    } catch (error) {
      if (error instanceof SyntaxError) { throw error; }
      throw new Error(`Fetch error: ${url}. Please check the URL or your network connection.`);
    }
  }

  return [...resultSet];
}
