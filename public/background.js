const BOOKS_ROUTE = "https://readwise.io/api/v2/books/";
const HIGHLIGHTS_ROUTE = "https://readwise.io/api/v2/highlights";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request, sender, sendResponse);
  chrome.storage.sync.get("readwiseToken", ({ readwiseToken }) => {
    if (request.type === "get_books") {
      getBooks(readwiseToken);
    } else if (request.type === "get_highlight") {
      getHighlights(readwiseToken, sendResponse);
    }
  });
  return true;
});

async function getBooks(token) {
  fetch(BOOKS_ROUTE, {
    method: "Get",
    mode: "cors",
    headers: {
      Authorization: `TOKEN ${token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      bookMap = res.results.map((x) => {
        return { id: x.id, cover_image_url: x.cover_image_url };
      });

      chrome.storage.sync.set({ books: bookMap }, (e) => {
        console.log(`Stored books with value ${JSON.stringify(bookMap)}`);
        chrome.storage.sync.get("books", (res) => {
          console.log(`Getting after store books ${JSON.stringify(res)} ${e}`);
        });
      });
    });
}

async function getRandomBook() {
  return new Promise((resolve, reject) =>
    chrome.storage.sync.get("books", (res) => {
      console.log(`Getting after store books ${JSON.stringify(res)}`);
      resolve(res);
    })
  ).then(({ books }) => {
    const randomBook = books[Math.floor(Math.random() * books.length)];
    console.log(randomBook, books);
    return randomBook;
  });
}
async function getHighlights(token, setHighlight) {
  const randomBook = await getRandomBook();
  console.log(randomBook);
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
      console.log(res);
      if (res.count > 0) {
        const randomQuote =
          res.results[Math.floor(Math.random() * res.results.length)].text;
        console.log(randomQuote, setHighlight);
        setHighlight({
          quote: randomQuote,
          cover: randomBook.cover_image_url,
        });
      }
    })
    .catch((e) => console.log(e));
}
