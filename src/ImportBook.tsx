import localforage from "localforage";
import React, { useState, useEffect } from "react";
import browserAPI from "./BrowserApi/CacheAccessor";
import ImportButton, { ButtonStates } from "./ImportButton";

interface BookToImport {
  id: string;
  href: string;
  source: string;
  sourceAttribution?: { image: string; href: string };
  description: string;
  author: { href: string; name: string; imageUrl: string };
}

function ImportBook(props: { post: BookToImport; token: string }) {
  const { post, token } = props;

  const [state, setState] = useState({
    importButtonState: ButtonStates.BASE,
    highlightBookUrl: "",
  });

  useEffect(() => {
    async function populateImportData() {
      localforage.getItem(
        post.href,
        (
          err,
          importData: {
            importedState: ButtonStates;
            bookUrl: string;
          } | null
        ) => {
          setState({
            importButtonState: importData?.importedState
              ? ButtonStates.LOADED
              : ButtonStates.BASE,
            highlightBookUrl: importData?.bookUrl || "",
          });
        }
      );
    }
    populateImportData();
  }, []);

  function importBook(token: string, post: BookToImport) {
    browserAPI.sendMessage(
      { type: "import_book", source: post.source, id: post.id, token },
      (res) => {
        console.log("import status", JSON.stringify(res));
        if (res.status === 200) {
          const bookUrl = res.res[0].highlights_url;
          localforage.setItem(post.href, {
            importedState: ButtonStates.LOADED,
            bookUrl,
          });
          setState({
            importButtonState: ButtonStates.LOADED,
            highlightBookUrl: bookUrl,
          });
        } else {
          setState({
            ...state,
            importButtonState: ButtonStates.FAILED,
          });
        }
      }
    );
    setState({
      ...state,
      importButtonState: ButtonStates.LOADING,
    });
  }

  return (
    <div
      key={post.description}
      className="flex flex-col rounded-lg shadow-lg overflow-hidden mb-3"
    >
      <div className="flex-1 bg-white p-3 flex flex-col">
        <div>
          <a href={post.href}>
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
            buttonState={state.importButtonState}
            importBook={() => importBook(token, post)}
            resetButton={() =>
              setState({ ...state, importButtonState: ButtonStates.BASE })
            }
          />{" "}
        </div>
        {state.importButtonState === ButtonStates.LOADED && (
          <a
            className="underline text-gray-400 hover:text-gray-600 visited:text-purple-400 self-center text-xs"
            // className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600 self-center"
            href={state.highlightBookUrl}
          >
            View book
          </a>
        )}
        <a
          className="underline text-gray-400 hover:text-gray-600 visited:text-purple-400 self-center text-xs"
          href={`${post.source}`}
        >
          Download CSV
        </a>
        {post.sourceAttribution && (
          <div className="flex justify-end items-center space-x-3 mt-2">
            <span className="text-xs text-gray-400">Provided by</span>
            <a href={post.sourceAttribution.href}>
              <img
                className="h-6 w-6 rounded-full"
                src={post.sourceAttribution.image}
                alt=""
              />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImportBook;
