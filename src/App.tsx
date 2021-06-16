import "./App.css";
import React, { useState, useEffect } from "react";
import ReadwiseHighlight from "./ReadwiseHighlight";
import browserAPI from "./BrowserApi/CacheAccessor";

const editIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className="text-green-300 h-8 w-8"
  >
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

function App() {
  const [quoteAndCover, setQuoteAndCover] = useState({
    quote: "",
    cover: "",
    id: "",
  });
  const [token, setToken] = useState("");
  const [tokenIsStored, setTokenIsStored] = useState(false);
  const [editingToken, setTokenIsEditing] = useState(false);

  useEffect(() => {
    async function getToken() {
      browserAPI.sendMessage(
        { type: "get_readwise_token" },
        (readwiseToken) => {
          setTokenIsStored(Boolean(readwiseToken));
          if (readwiseToken) {
            setToken(readwiseToken);
            browserAPI.sendMessage(
              { type: "get_highlight" },
              (quoteAndCover) => {
                if (quoteAndCover) {
                  setQuoteAndCover(quoteAndCover);
                }
              }
            );
          }
        }
      );
    }
    getToken();
  }, []);

  function storeToken(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    browserAPI.sendMessage({ type: "store_readwise_token", token }, () => {
      setTokenIsStored(true);
      setTokenIsEditing(false);
      browserAPI.sendMessage({ type: "get_highlight" }, (quoteAndCover) => {
        if (quoteAndCover) {
          setQuoteAndCover(quoteAndCover);
        }
      });
    });
  }

  return (
    <div className="bg-indigo-600">
      {tokenIsStored && !editingToken ? (
        <div className="m-3 flex space-x-2">
          <span className="text-white font-semibold"> Token stored </span>
          <button
            onClick={() => {
              setTokenIsEditing(!editingToken);
            }}
          >
            <span title="Change your token"> {editIcon}</span>
          </button>
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
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-1"
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
                  </a>{" "}
                  or click the extension icon
                </span>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="bg-red-400 text-white font-semibold rounded p-2 mt-5"
          >
            Store token
          </button>
        </form>
      )}
      <ReadwiseHighlight quoteAndCover={quoteAndCover} />
    </div>
  );
}

export default App;