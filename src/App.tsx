import "./App.css";
import React, { useState, useEffect } from "react";
import ReadwiseHighlight from "./ReadwiseHighlight";
import browserAPI from "./BrowserApi/CacheAccessor";

const editIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-green-300"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

function App() {
  const [quoteAndCover, setQuoteAndCover] = useState({
    quote: "",
    cover: "",
    id: "",
  });
  const [token, setToken] = useState("");
  const [showTokenForm, setShowTokenForm] = useState(false);
  const [tokenIsStored, setTokenIsStored] = useState(false);
  const [editingToken, setTokenIsEditing] = useState(false);
  async function getToken() {
    await browserAPI.get("readwiseToken", (token) => {
      setTokenIsStored(Boolean(token));
      setShowTokenForm(true);
      if (token) {
        setToken(token);
        browserAPI.sendMessage(
          { type: "get_highlight", token: token },
          (quoteAndCover) => {
            if (quoteAndCover) {
              setQuoteAndCover(quoteAndCover);
            }
          }
        );
      }
    });
  }

  useEffect(() => {
    getToken();
  }, []);

  function storeToken(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    browserAPI.store("readwiseToken", token, () => {
      setTokenIsStored(true);
      setTokenIsEditing(false);
      browserAPI.sendMessage(
        { type: "get_highlight", token },
        (quoteAndCover) => {
          if (quoteAndCover) {
            setQuoteAndCover(quoteAndCover);
          }
        }
      );
    });
  }

  return (
    <div className="bg-indigo-600">
      {showTokenForm &&
        (tokenIsStored && !editingToken ? (
          <div className="m-3 flex space-x-2 items-center">
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
          <form
            className="max-w-lg m-2 outline-white p-2"
            onSubmit={storeToken}
          >
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
        ))}
      <ReadwiseHighlight quoteAndCover={quoteAndCover} />
      <div className="absolute bottom-1 right-3">
        <span className="text-xs text-white italic">Made by </span>
        <a
          className="underline text-white"
          href="https://tedis.me"
          target="_blank"
        >
          Tedis
        </a>
        <span role="img" aria-label="wave">
          👋
        </span>
      </div>
    </div>
  );
}

export default App;
