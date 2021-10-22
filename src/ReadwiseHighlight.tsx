import React from "react";
import MarkdownIt from "markdown-it";
const md = new MarkdownIt();

function ReadwiseHighlight(props: {
  quoteAndCover: { quote: string; cover: string; id: string };
  getHighlight: () => void;
}) {
  const { quote, cover, id } = props.quoteAndCover;
  return (
    // Default state if src or quote empty
    <div className="flex flex-col mt-8 mx-6 max-w-3xl mb-12">
      {quote ? (
        <>
          <div className="mx-auto relative -mb-4 max-h-48 ">
            <img
              alt="Book Cover"
              src={cover}
              className="-mb-1 max-h-48 max-w-48"
            />
          </div>
          <a
            title="Open in Readwise"
            target="_blank"
            href={`https://readwise.io/open/${id}`}
            className="m-1 ml-auto underline text-white"
          >
            Go to highlight
          </a>
          <div className="flex flex-col bg-opacity-30 rounded-lg shadow-xl border-black bg-gradient-to-r from-red-400 to-pink-500 dark:from-gray-500 dark:to-gray-500">
            <div
              className="m-3 p-2 italic text-xl text-white font-semibold"
              dangerouslySetInnerHTML={{
                __html: md.render(quote),
              }}
            ></div>
          </div>
          <button
            className="underline text-white text-center background-transparent px-8 py-3 outline-none focus:outline-none mr-1 mb-1"
            onClick={props.getHighlight}
            type="button"
          >
            See another highlight &gt;
          </button>
        </>
      ) : (
        <div className="bg-opacity-30 rounded-lg shadow-xl border-black bg-gradient-to-r from-red-400 to-pink-500">
          <div className="m-3 text-white text-xl text-center font-semibold">
            Add your Token to see your first highlight!
          </div>
        </div>
      )}
    </div>
  );
}

export default ReadwiseHighlight;
