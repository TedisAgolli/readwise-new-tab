import React, { useState } from "react";
import browserAPI from "./BrowserApi/CacheAccessor";
import ImportButton, { ButtonStates } from "./ImportButton";

interface BookToImport {
  source: string;
  description: string;
  author: { href: string; name: string; imageUrl: string };
}

function ImportBook(props: { post: BookToImport; token: string }) {
  const { post, token } = props;
  const [importButtonState, setImportButtonState] = useState(ButtonStates.BASE);
  const [highlightBookUrl, setHighlightBookUrl] = useState("");

  function importBook(token: string) {
    browserAPI.sendMessage({ type: "import_book", token }, (res) => {
      console.log("import status", JSON.stringify(res));
      if (res.status === 200) {
        localStorage.setItem(
          "importButtonState",
          ButtonStates.LOADED.toString()
        );
        const highlightsURL = res.res[0].highlights_url;
        localStorage.setItem("importBookUrl", highlightsURL);

        setImportButtonState(ButtonStates.LOADED);
        setHighlightBookUrl(highlightsURL);
      } else {
        setImportButtonState(ButtonStates.FAILED);
      }
    });
    setImportButtonState(ButtonStates.LOADING);
  }

  return (
    <div
      key={post.description}
      className="flex flex-col rounded-lg shadow-lg overflow-hidden mb-3"
    >
      <div className="flex-1 bg-white p-3 flex flex-col">
        <div>
          <a href={post.author.href}>
            <span className="sr-only">{post.author.name}</span>
            <img
              className="h-12 w-12 rounded-full m-auto mb-3"
              src={post.author.imageUrl}
              alt=""
            />
          </a>
          <p className="text-sm font-medium text-gray-700 justify-center text-center">
            {post.description}
          </p>
        </div>
        <div className="my-2 mx-auto flex space-x-2">
          {/* todo: analytics on whether people use this */}
          <ImportButton
            buttonState={importButtonState}
            importBook={() => importBook(token)}
            resetButton={() => setImportButtonState(ButtonStates.BASE)}
          />{" "}
          {importButtonState === ButtonStates.LOADED ? (
            <a
              className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600 self-center"
              href={highlightBookUrl}
            >
              View book
            </a>
          ) : null}
        </div>
        <a
          className="underline text-gray-400 hover:text-gray-600 visited:text-purple-400 self-center text-xs"
          href={`${post.source}`}
        >
          Download CSV
        </a>
      </div>
    </div>
  );
}

export default ImportBook;
