const BOOKS_ROUTE = "https://readwise.io/api/v2/books/";
const HIGHLIGHTS_ROUTE = "https://readwise.io/api/v2/highlights";

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.update({ url: "https://readwise.io/access_token" });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "cached_quote") {
    chrome.storage.local.get("cachedQuote", ({ cachedQuote }) => {
      sendResponse(cachedQuote);
    });
  } else if (request.type === "get_highlight") {
    getAllHighlights(request.token, sendResponse);
    cacheBooks(request.token);
  } else if (request.type === "cache_books") {
    cacheBooks(request.token);
  }
  return true;
});

async function cacheBooks(token) {
  return fetch(BOOKS_ROUTE, {
    method: "Get",
    mode: "cors",
    headers: {
      Authorization: `TOKEN ${token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      const bookToCover = Object.fromEntries(
        res.results.map((x) => {
          return [x.id, x.cover_image_url];
        })
      );
      chrome.storage.local.set(bookToCover);
    });
}

async function getAllHighlights(token, setHighlight) {
  const urlSearchParams = new URLSearchParams({
    page_size: 1,
  });
  chrome.storage.local.get(
    "cachedTotalHighlightsNumber",
    ({ cachedTotalHighlightsNumber }) => {
      if (cachedTotalHighlightsNumber) {
        const highlightNumber = Math.floor(
          Math.random() * cachedTotalHighlightsNumber
        );
        urlSearchParams.set("page", highlightNumber);
      }
      fetch(`${HIGHLIGHTS_ROUTE}?${urlSearchParams}`, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: `TOKEN ${token}`,
          contentType: "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.count > 0) {
            const highlight =
              res.results[Math.floor(Math.random() * res.results.length)];
            const bookId = highlight.book_id;

            chrome.storage.local.get([`${bookId}`], (books) => {
              const selectedQuote = {
                quote: highlight.text,
                id: highlight.id,
                cover: books[bookId],
              };

              chrome.storage.local.set({ cachedQuote: selectedQuote });
              chrome.storage.local.set({
                cachedTotalHighlightsNumber: res.count,
              });

              setHighlight(selectedQuote);
            });
          }
        })
        .catch((e) => console.log(e));
    }
  );
}
