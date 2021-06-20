/*global chrome*/
import localforage from "localforage";
import {
  Book,
  ReadwiseApi,
  BooksAndHighlights,
  Highlight,
} from "./ReadwiseApi";
const BOOKS_AND_HIGHLIGHTS = "booksAndHighlights";

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.update({ url: "https://readwise.io/access_token" });
});

async function getAllReadwiseData(
  token: string,
  callback: (data: any) => void
) {
  const readwiseApi = new ReadwiseApi(token);
  localforage.getItem(
    "loadingData",
    async (err, value: { isLoadingData: boolean } | null) => {
      if (!(value && value.isLoadingData)) {
        let isFirst = true;
        localforage.setItem("loadingData", { isLoadingData: true });
        const books = (await readwiseApi.fetchData("books")) as Book[];
        readwiseApi
          .fetchData("highlights", undefined, undefined, (highlights) => {
            localforage.getItem(
              BOOKS_AND_HIGHLIGHTS,
              (err, currentBooksAndHighlights: BooksAndHighlights | null) => {
                let booksAndHighlights;
                if (currentBooksAndHighlights) {
                  booksAndHighlights = {
                    books: [...currentBooksAndHighlights.books, ...books],
                    highlights: [
                      ...currentBooksAndHighlights.highlights,
                      ...(highlights as Highlight[]),
                    ],
                  };
                } else {
                  booksAndHighlights = {
                    books,
                    highlights: highlights as Highlight[],
                  };
                }

                localforage.setItem(BOOKS_AND_HIGHLIGHTS, booksAndHighlights);
                if (isFirst) {
                  isFirst = false;
                  callback(getRandomHighlight(booksAndHighlights));
                }
              }
            );
          })
          .then((highlights) => {
            localforage.setItem("loadingData", { isLoadingData: false });
            localforage.setItem(BOOKS_AND_HIGHLIGHTS, { books, highlights });
          });
      } else {
        console.info("Data is currently being loaded");
        localforage.setItem("loadingData", { isLoadingData: true });
      }
    }
  );
}
function getRandomHighlight(booksAndHighlights: BooksAndHighlights) {
  let found = false;
  let selectedQuote;
  while (!found) {
    const highlightNumber = Math.floor(
      Math.random() * booksAndHighlights.highlights.length
    );
    const highlight = booksAndHighlights.highlights[highlightNumber];
    const selectedBook = booksAndHighlights.books.filter(
      (book) => book.id === highlight.book_id
    )[0];
    found = selectedBook.author !== "Readwise Team";
    selectedQuote = {
      quote: highlight.text,
      id: highlight.id,
      cover: selectedBook.cover_image_url,
    };
  }
  return selectedQuote;
}
chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "cacheAlarm") {
    localforage.getItem("token", (err, token: string | null) => {
      if (!token) return;
      getAllReadwiseData(token, (data) => {
        console.info("Updating cache", data);
      });
    });
  }
});
chrome.alarms.get("cacheAlarm", (alarm) => {
  if (alarm) return;
  chrome.alarms.create("cacheAlarm", {
    delayInMinutes: 1,
    periodInMinutes: 12 * 60,
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "get_highlight") {
    localforage.getItem("token", (err, token: string | null) => {
      if (!token) return;
      localforage.getItem(
        BOOKS_AND_HIGHLIGHTS,
        (err, booksAndHighlights: BooksAndHighlights | null) => {
          if (booksAndHighlights) {
            sendResponse(getRandomHighlight(booksAndHighlights));
          } else {
            getAllReadwiseData(token, sendResponse);
          }
        }
      );
    });
  } else if (request.type === "cache_data") {
    localforage.getItem("token", (err, token: string | null) => {
      if (!token) return;
      getAllReadwiseData(token, () => {});
    });
  } else if (request.type === "store_readwise_token") {
    localforage.setItem("token", request.token, (err, token) => {
      sendResponse(token);
    });
  } else if (request.type === "get_readwise_token") {
    localforage.getItem("token", (err, token: string | null) => {
      sendResponse(token);
    });
  } else if (request.type === "is_loading_data") {
    localforage.getItem(
      "loadingData",
      (err, value: { isLoadingData: boolean } | null) => {
        sendResponse(value && value.isLoadingData);
      }
    );
  }
  return true;
});
