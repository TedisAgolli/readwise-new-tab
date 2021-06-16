/*global chrome*/
import localforage from "localforage";
import { ReadwiseApi, BooksAndHighlights } from "./ReadwiseApi";
const BOOKS_AND_HIGHLIGHTS = "booksAndHighlights";

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.update({ url: "https://readwise.io/access_token" });
});

function getRandomHighlight(booksAndHighlights: BooksAndHighlights) {
  const highlightNumber = Math.floor(
    Math.random() * booksAndHighlights.highlights.length
  );
  const highlight = booksAndHighlights.highlights[highlightNumber];
  const selectedBook = booksAndHighlights.books.filter(
    (book) => book.id === highlight.book_id
  )[0];
  const selectedQuote = {
    quote: highlight.text,
    id: highlight.id,
    cover: selectedBook.cover_image_url,
  };
  return selectedQuote;
}
chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "cacheAlarm") {
    localforage.getItem("token", (err, token: string | null) => {
      if (!token) return;
      const readwiseApi = new ReadwiseApi(token);
      readwiseApi.fetchAllHighlightsAndBooks().then((data) => {
        localforage.setItem(BOOKS_AND_HIGHLIGHTS, data);
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
      const readwiseApi = new ReadwiseApi(token);
      localforage.getItem(
        BOOKS_AND_HIGHLIGHTS,
        (err, booksAndHighlights: BooksAndHighlights | null) => {
          if (booksAndHighlights) {
            sendResponse(getRandomHighlight(booksAndHighlights));
          } else {
            readwiseApi.fetchAllHighlightsAndBooks().then((data) => {
              sendResponse(getRandomHighlight(data));
              localforage.setItem(BOOKS_AND_HIGHLIGHTS, data);
            });
          }
        }
      );
    });
  } else if (request.type === "cache_data") {
    localforage.getItem("token", (err, token: string | null) => {
      if (!token) return;
      const readwiseApi = new ReadwiseApi(token);
      readwiseApi.fetchAllHighlightsAndBooks().then((data) => {
        localforage.setItem(BOOKS_AND_HIGHLIGHTS, data);
      });
    });
  } else if (request.type === "store_readwise_token") {
    localforage.setItem("token", request.token, (err, token) => {
      sendResponse(token);
    });
  } else if (request.type === "get_readwise_token") {
    localforage.getItem("token", (err, token: string | null) => {
      sendResponse(token);
    });
  }
  return true;
});
