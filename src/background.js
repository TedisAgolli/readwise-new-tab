const BOOKS_ROUTE = "https://readwise.io/api/v2/books/";
const HIGHLIGHTS_ROUTE = "https://readwise.io/api/v2/highlights";
let cachedQuote;

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.update({ url: "https://readwise.io/access_token" });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "cached_quote") {
    console.log(
      "🚀 ~ file: background.js ~ line 10 ~ cachedQuote",
      cachedQuote
    );
    sendResponse(cachedQuote);
  }
  if (request.type === "get_highlight") {
    chrome.storage.sync.get("readwiseToken", ({ readwiseToken }) => {
      getHighlights(readwiseToken, sendResponse);
    });
  }
  return true;
});

async function getBooks(token) {
  return fetch(BOOKS_ROUTE, {
    method: "Get",
    mode: "cors",
    headers: {
      Authorization: `TOKEN ${token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      return res.results.map((x) => {
        return { id: x.id, cover_image_url: x.cover_image_url };
      });
    });
}

async function getRandomBook(token) {
  return getBooks(token).then((books) => {
    const randomBook = books[Math.floor(Math.random() * books.length)];
    return randomBook;
  });
}
async function getHighlights(token, setHighlight) {
  const randomBook = await getRandomBook(token);
  return fetch(
    `${HIGHLIGHTS_ROUTE}?${new URLSearchParams({ book_id: randomBook.id })}`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: `TOKEN ${token}`,
        contentType: "application/json",
      },
    }
  )
    .then((res) => res.json())
    .then((res) => {
      // {
      //     "count": 1163,
      //     "next": "https://readwise.io/api/v2/highlights?page=2",
      //     "previous": null,
      //     "results": [
      //       {
      //         "id": 59758950,
      //         "text": "The fundamental belief of metaphysicians is THE BELIEF IN ANTITHESES OF VALUES.",
      //         "note": "",
      //         "location": 9,
      //         "location_type": "order",
      //         "highlighted_at": null,
      //         "url": null,
      //         "color": "",
      //         "updated": "2020-10-01T12:58:44.716235Z",
      //         "book_id": 2608248,
      //         "tags": [
      //           {
      //              "id": 123456,
      //              "name": "philosophy"
      //           },
      //           ...
      //         ]
      //       },
      //       ...
      //     ]
      //   }
      if (res.count > 0) {
        const highlight =
          res.results[Math.floor(Math.random() * res.results.length)];

        const selectedQuote = {
          quote: highlight.text,
          id: highlight.id,
          cover: randomBook.cover_image_url,
        };
        chrome.storage.sync.set({ selectedQuote }, (e) => {
          console.log(
            "🚀 ~ file: background.js ~ line 70 ~ chrome.storage.sync.set ~ selectedQuote",
            selectedQuote,
            e
          );
        });

        cachedQuote = selectedQuote;
        console.log(
          "🚀 ~ file: background.js ~ line 85 ~ .then ~ cachedQuote",
          cachedQuote
        );
        setHighlight(selectedQuote);
      }
    })
    .catch((e) => console.log(e));
}
