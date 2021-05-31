async function get(id, callback) {
  console.log(`Getting item with id ${id}`);
  if (id === "books") {
    return [
      {
        id: 7492852,
        title: "Codus Operandi",
        author: "codusoperandi.com",
        category: "articles",
        num_highlights: 1,
        last_highlight_at: "2021-02-01T14:07:41Z",
        updated: "2021-03-27T19:18:17.888106Z",
        cover_image_url:
          "https://readwise-assets.s3.amazonaws.com/static/images/article4.6bc1851654a0.png",
        highlights_url: "https://readwise.io/bookreview/7492852",
        source_url:
          "https://www.codusoperandi.com/posts/increasing-your-luck-surface-area",
      },
      {
        id: 7917686,
        title: "The Confidence Gap",
        author: "Russ Harris",
        category: "supplementals",
        num_highlights: 10,
        last_highlight_at: null,
        updated: "2021-02-22T19:18:00.418528Z",
        cover_image_url:
          "https://images-na.ssl-images-amazon.com/images/I/51dRF-CdXtL._SL200_.jpg",
        highlights_url: "https://readwise.io/bookreview/7917686",
        source_url: null,
      },
      {
        id: 7917679,
        title: "Bullshit Jobs",
        author: "David Graeber",
        category: "supplementals",
        num_highlights: 10,
        last_highlight_at: null,
        updated: "2021-02-22T19:17:43.119808Z",
        cover_image_url:
          "https://images-na.ssl-images-amazon.com/images/I/41qfMTnnWXL._SL200_.jpg",
        highlights_url: "https://readwise.io/bookreview/7917679",
        source_url: null,
      },
      {
        id: 7917674,
        title: "The Dream Machine",
        author: "M. Mitchell Waldrop",
        category: "supplementals",
        num_highlights: 10,
        last_highlight_at: null,
        updated: "2021-02-22T19:17:31.380377Z",
        cover_image_url:
          "https://images-na.ssl-images-amazon.com/images/I/419WN-mJVgL._SL200_.jpg",
        highlights_url: "https://readwise.io/bookreview/7917674",
        source_url: null,
      },
      {
        id: 7917668,
        title: "Arrival",
        author: "Ted Chiang",
        category: "supplementals",
        num_highlights: 10,
        last_highlight_at: null,
        updated: "2021-02-22T19:16:34.232746Z",
        cover_image_url:
          "https://images-na.ssl-images-amazon.com/images/I/41jetWjkFaL._SL200_.jpg",
        highlights_url: "https://readwise.io/bookreview/7917668",
        source_url: null,
      },
    ];
  }
  return "TOKEN";
}

async function store(id, item, callback) {
  console.log(`Stored item with id ${id} and value ${JSON.stringify(item)}`);
  callback();
}
async function sendMessage(request, handler) {
  handler({
    quote:
      "As a final word of discouragement: a great culture does not get you a great company. If your product isn’t superior or the market doesn’t want it, your company will fail no matter how good its culture is.",
    cover:
      "https://images-na.ssl-images-amazon.com/images/I/41qfMTnnWXL._SL200_.jpg",
  });
  console.log("Sending message to background script");
}

export { get, store, sendMessage };
