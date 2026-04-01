import Turndownservice from "turndown";

export async function getArticleFromWikipediaAPI({ title }: { title: string }) {
  console.log("received wikititle", title);

  console.log("first search Wikipedia");

  const wikiSearchParam = new URLSearchParams();
  wikiSearchParam.append("action", "query");
  wikiSearchParam.append("list", "search");
  wikiSearchParam.append("format", "json");
  wikiSearchParam.append("srlimit", "1");
  wikiSearchParam.append("srsearch", title);

  const wikiResp = await fetch(
    `https://en.wikipedia.org/w/api.php?${wikiSearchParam}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const wikiJSON = (await wikiResp.json()) as {
    query: { search: { title: string; snippet: string }[] };
  };

  const { title: refinedTitle, snippet } = wikiJSON.query.search[0]!;

  const duckduckGoResp = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/mobile-html/${refinedTitle}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "text/html",
      },
    },
  );

  let text = await duckduckGoResp.text();

  // Remove last section:
  const lastSection = text.slice(
    text.lastIndexOf("<section"),
    text.lastIndexOf("</section") + 10,
  );

  text = text.replace(lastSection, "");

  const turndown = new Turndownservice();
  turndown.remove(["a"]);
  const extra_content = turndown.turndown(text);

  console.log("SNIPPET", snippet);
  console.log("DDG gave", extra_content);
  return { content: snippet + extra_content };
}
