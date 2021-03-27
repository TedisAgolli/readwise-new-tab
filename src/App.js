import "./App.css";
import { useState, useEffect } from "react";
import ReadwiseHighlight from "./ReadwiseHighlight";
import browserAPI from "./BrowserApi/CacheAccessor";

const HIGHLIGHTS_ROUTE = "https://readwise.io/api/v2/highlights";
const BOOKS_ROUTE = "https://readwise.io/api/v2/books/";
const READWISE_HIGHLIGHT = {
  bookQuote:
    "As a final word of discouragement: a great culture does not get you a great company. If your product isn’t superior or the market doesn’t want it, your company will fail no matter how good its culture is.",
  cover:
    "https://images-na.ssl-images-amazon.com/images/I/41qfMTnnWXL._SL200_.jpg",
};

const checkMark = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="text-green-600 h-8 w-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

function App() {
  const [quoteAndCover, setQuoteAndCover] = useState({ quote: "", cover: "" });

  const [token, setToken] = useState(
    "uuRHgSKj1lB6sBEy4HHVCWSZNudzDf5iSTWo5uFmadjKWJODTD"
  );
  const [tokenIsStored, setTokenIsStored] = useState(false);
  useEffect(() => {
    async function getToken() {
      await browserAPI.get("readwiseToken", (readwiseToken) => {
        console.log(`getting readwise token ${readwiseToken}`);
        setTokenIsStored(readwiseToken !== undefined);
        if (readwiseToken) {
          setToken(readwiseToken);
        }
      });
    }
    getToken();
    getHighlights();
  }, []);

  async function getBooks() {
    await fetch(BOOKS_ROUTE, {
      method: "Get",
      mode: "cors",
      headers: {
        Authorization: `TOKEN ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        res = res.results.map((x) => {
          return { id: x.id, cover_image_url: x.cover_image_url };
        });
        browserAPI.store("books", res);
      });
  }
  async function storeToken(e) {
    e.preventDefault();
    console.log(`Trying to store ${token}`);
    browserAPI.store("readwiseToken", token);
    return;
  }

  async function getRandomBook() {
    const books = await browserAPI.get("books", () => {});
    const randomBook = books[Math.floor(Math.random() * books.length)];
    return randomBook;
  }
  async function getHighlights() {
    const randomBook = await getRandomBook();
    await fetch(
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
        const randomQuote =
          res.results[Math.floor(Math.random() * res.results.length)].text;
        console.log(randomQuote);
        setQuoteAndCover({
          quote: randomQuote,
          cover: randomBook.cover_image_url,
        });
      })
      .catch((e) => console.log(e));
  }
  return (
    <div className="bg-indigo-600 w-screen h-screen overflow-hidden">
      {tokenIsStored ? (
        <div>{checkMark}</div>
      ) : (
        <form className="max-w-2xl m-2" onSubmit={storeToken}>
          <div>
            <label
              htmlFor="token"
              className="block text-sm font-medium text-white"
            >
              Token
            </label>
            <div className="mt-1">
              <input
                type="text"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                id="token"
                name="token"
                onChange={(e) => setToken(e.target.value)}
                value={token}
              />
            </div>
          </div>
          <button className="bg-blue-100 rounded p-2 m-1">Store token</button>
        </form>
      )}
      <p>{quoteAndCover.quote}</p>
      <button
        className="bg-red-400 rounded p-2 text-white font-semibold m-2"
        onClick={getBooks}
      >
        Get book list
      </button>
      <div className="flex h-screen">
        <ReadwiseHighlight quoteAndCover={quoteAndCover} />
      </div>
    </div>
  );
}

export default App;
