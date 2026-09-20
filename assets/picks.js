// Products from the videos, newest first. Add an entry here for each new video.
//   id: short slug, also the deep link (lpirro.com/#id)
//   platform: "youtube" | "tiktok" | "instagram"
//   cover: image in /assets/ (optional; YouTube falls back to the video thumbnail)
//   keywords: extra words the search should match (optional), e.g. "cuffie audio anc"
//
// { id: "brand-prodotto", product: "Nome prodotto", brand: "Brand", platform: "youtube",
//   url: "https://link-affiliato", video: "https://www.youtube.com/watch?v=...",
//   cover: "/assets/covers/brand-prodotto.jpg", keywords: "parole di ricerca" },
var PICKS = [];

var PLATFORMS = {
  youtube: { label: "YouTube", acc: "#ff4e45" },
  tiktok: { label: "TikTok", acc: "#25f4ee" },
  instagram: { label: "Instagram", acc: "#e1306c" }
};

function trackPick(name, pick) {
  if (typeof gtag === "function") gtag("event", name, { product: pick.product, brand: pick.brand, platform: pick.platform });
}

// Builds the <li> card: the whole row opens the affiliate link, "Guarda il video" opens the video.
function renderPick(pick) {
  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  }

  var platform = PLATFORMS[pick.platform];
  var item = el("li", "card pick");
  item.id = pick.id;
  item.style.setProperty("--acc", platform.acc);

  var cover = el("span", "cover");
  cover.setAttribute("aria-hidden", "true");
  var yt = pick.platform === "youtube" && /[?&]v=([\w-]{11})/.exec(pick.video);
  var src = pick.cover || (yt && "https://i.ytimg.com/vi/" + yt[1] + "/mqdefault.jpg");
  cover.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>';
  if (src) {
    var img = new Image();
    img.alt = "";
    img.loading = "lazy";
    img.onload = function () { cover.replaceChildren(img); };
    img.src = src;
  }

  var meta = el("span", "meta");
  var link = el("a", "pick-link platform", pick.product);
  link.href = pick.url;
  link.target = "_blank";
  link.rel = "sponsored nofollow noopener";
  link.addEventListener("click", function () { trackPick("affiliate_click", pick); });

  var sub = el("span", "pick-sub");
  sub.appendChild(el("span", "handle", pick.brand + " · " + platform.label));
  if (pick === PICKS[0]) sub.appendChild(el("span", "new", "Nuovo"));

  var watch = el("a", "watch", "▸ Guarda il video");
  watch.href = pick.video;
  watch.target = "_blank";
  watch.rel = "noopener";
  watch.addEventListener("click", function () { trackPick("video_click", pick); });

  meta.append(link, sub, watch);
  item.append(cover, meta);
  item.insertAdjacentHTML("beforeend", '<svg class="arrow" aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 11 11 3M5 3h6v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  return item;
}

// Highlights and scrolls to the card named in the URL hash (lpirro.com/#id).
function focusPick(id) {
  var hit = id && document.getElementById(id);
  if (!hit || !hit.classList.contains("pick")) return;
  hit.classList.add("is-target");
  hit.scrollIntoView({ block: "center" });
}
