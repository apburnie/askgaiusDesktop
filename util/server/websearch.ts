export async function getArticleFromWikipediaAPI(title: string) {
  const wikiResp = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exlimit=1&titles=${title}&explaintext=1&exsectionformat=plain&format=json`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const wikiJSON = (await wikiResp.json()) as {
    query: { pages: { [key in number]: { extract: string } } };
  };

  const content = Object.values(wikiJSON.query.pages)[0].extract;

  return { content };
}
