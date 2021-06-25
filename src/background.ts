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
    (err, value: { isLoadingData: boolean } | null) => {
      if (!(value && value.isLoadingData)) {
        let isFirst = true;
        localforage.setItem("loadingData", { isLoadingData: true });
        localforage.getItem(
          "lastFetch",
          async (err, lastFetch: string | null) => {
            localforage.setItem("lastFetch", new Date().toISOString());
            const books = (await readwiseApi.fetchData(
              "books",
              lastFetch ? lastFetch : undefined
            )) as Book[];
            readwiseApi
              .fetchData(
                "highlights",
                lastFetch ? lastFetch : undefined,
                undefined,
                (highlights) => {
                  localforage.getItem(
                    BOOKS_AND_HIGHLIGHTS,
                    (
                      err,
                      currentBooksAndHighlights: BooksAndHighlights | null
                    ) => {
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

                      localforage.setItem(
                        BOOKS_AND_HIGHLIGHTS,
                        booksAndHighlights
                      );
                      if (isFirst) {
                        isFirst = false;
                        callback(getRandomHighlight(booksAndHighlights));
                      }
                    }
                  );
                }
              )
              .then((highlights) => {
                localforage.setItem("loadingData", { isLoadingData: false });
                localforage.setItem(BOOKS_AND_HIGHLIGHTS, {
                  books,
                  highlights,
                });
              });
          }
        );
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
        console.info("Updating cache");
      });
    });
  }
});
chrome.alarms.get("cacheAlarm", (alarm) => {
  if (!alarm || (alarm && alarm.periodInMinutes === 12 * 60)) {
    chrome.alarms.clear("cacheAlarm");
    chrome.alarms.create("cacheAlarm", {
      delayInMinutes: 1,
      periodInMinutes: 60,
    });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "get_highlight") {
    const token = request.token;
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
  }

  return true;
});
