export async function fetchLists(urlsString) {
  const urls = urlsString.trim().split("\n");
  const lists = await Promise.all(
    urls.map((url) => fetch(url)
      .then((response) => response.json())
      .catch((error) => alert(error))
    )
  );
  return [...new Set(lists.flat())];
}
