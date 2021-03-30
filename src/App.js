import "./App.css";
import { useState, useEffect } from "react";
import ReadwiseHighlight from "./ReadwiseHighlight";
import browserAPI from "./BrowserApi/CacheAccessor";

const checkMark = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="text-green-300 h-8 w-8"
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

  const [token, setToken] = useState("");
  const [tokenIsStored, setTokenIsStored] = useState(false);
  useEffect(() => {
    async function getToken() {
      await browserAPI.get("readwiseToken", (readwiseToken) => {
        setTokenIsStored(readwiseToken !== undefined);
        if (readwiseToken) {
          setToken(readwiseToken);
        }
      });
    }
    getToken();
    browserAPI.sendMessage(
      { type: "get_highlight", token },
      (quoteAndCover) => {
        setQuoteAndCover(quoteAndCover);
      }
    );
  }, []);

  async function getBooks() {
    // TODO: handle caching these boos
    browserAPI.sendMessage({ type: "get_books", token });
  }
  async function storeToken(e) {
    e.preventDefault();
    console.log(`Trying to store ${token}`);
    browserAPI.store("readwiseToken", token, () => setTokenIsStored(true));
    return;
  }

  return (
    <div className="bg-indigo-600 w-screen h-screen overflow-hidden">
      {!tokenIsStored ? (
        <div className="m-3" title="Your token has been stored">
          {checkMark}
        </div>
      ) : (
        <form className="max-w-lg m-2 outline-white p-2" onSubmit={storeToken}>
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
              <div>
                <span className="text-gray-300">
                  Your Readwise Auth Token.{" "}
                  <a
                    className="text-red-400"
                    href="https://readwise.io/access_token"
                    target="_blank"
                  >
                    Get it here
                  </a>
                </span>
              </div>
            </div>
          </div>
          <button className="bg-red-400 text-white font-semibold rounded p-2 mt-5">
            Store token
          </button>
        </form>
      )}
      <button
        className="bg-red-400 rounded p-2 text-white font-semibold ml-2 mt-5"
        onClick={getBooks}
      >
        Refresh book list
      </button>
      <div className="flex h-screen">
        <ReadwiseHighlight quoteAndCover={quoteAndCover} />
      </div>
    </div>
  );
}

export default App;
