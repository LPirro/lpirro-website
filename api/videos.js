// Latest long-form uploads from the YouTube channel, read from a public RSS feed (no API key needed).
// GET /api/videos → { videos: [{ id, title, url, published, views, short }] }, newest first.
// Cached at the edge for an hour; the home page hides the "Ultimi video" section if this fails.

var CHANNEL_ID = "UCUqEP6_UyK0GeqE6KJgMkXw"; // youtube.com/@itsleopirro
// "UULF" + channel id (minus "UC") is YouTube's auto playlist of long-form videos only;
// the plain channel feed (channel_id=...) would mix in Shorts.
var FEED = "https://www.youtube.com/feeds/videos.xml?playlist_id=UULF" + CHANNEL_ID.slice(2);

function tag(block, name) {
  var m = new RegExp("<" + name + ">([\\s\\S]*?)</" + name + ">").exec(block);
  return m ? m[1].trim() : "";
}

function unescapeXml(s) {
  return s
    .replace(/&#(\d+);/g, function (_, n) { return String.fromCodePoint(Number(n)); })
    .replace(/&#x([0-9a-f]+);/gi, function (_, n) { return String.fromCodePoint(parseInt(n, 16)); })
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}

module.exports = async function (req, res) {
  try {
    var upstream = await fetch(FEED, { headers: { "User-Agent": "lpirro.com (+https://lpirro.com)" } });
    if (!upstream.ok) throw new Error("feed " + upstream.status);
    var xml = await upstream.text();

    var videos = [];
    var entry = /<entry>([\s\S]*?)<\/entry>/g, m;
    while ((m = entry.exec(xml))) {
      var e = m[1];
      var id = tag(e, "yt:videoId");
      if (!/^[\w-]{11}$/.test(id)) continue;
      var link = /<link rel="alternate" href="([^"]+)"/.exec(e);
      var views = /views="(\d+)"/.exec(e);
      videos.push({
        id: id,
        title: unescapeXml(tag(e, "title")),
        url: link ? link[1] : "https://www.youtube.com/watch?v=" + id,
        published: tag(e, "published"),
        views: views ? Number(views[1]) : null,
        short: !!link && link[1].indexOf("/shorts/") !== -1
      });
    }

    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).json({ videos: videos });
  } catch (err) {
    res.setHeader("Cache-Control", "no-store");
    res.status(502).json({ error: "YouTube feed unavailable" });
  }
};
