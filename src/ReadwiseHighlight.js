import React from "react";
import MarkdownIt from "markdown-it";
const md = new MarkdownIt();

function ReadwiseHighlight({ quoteAndCover }) {
  const { quote, cover, id } = quoteAndCover;
  return (
    // Default state if src or quote empty
    <div className="flex m-auto max-w-2xl bg-opacity-30 rounded-lg shadow-xl border-black bg-gradient-to-r from-red-400 to-pink-500">
      {quote ? (
        <>
          <img alt="Book Cover" src={cover} />
          <div className="flex flex-col items-end">
            <a
              title="Open in Readwise"
              target="_blank"
              href={`https://readwise.io/open/${id}`}
              className="m-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="feather feather-external-link"
              >
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </a>
            <div
              className="mx-2 text-white text-xl font-semibold"
              dangerouslySetInnerHTML={{
                __html: md.render(quote),
              }}
            ></div>
          </div>
        </>
      ) : (
        <p className="mx-2 p-2 text-white text-xl font-bold m-auto">
          No Readwise highlight to show
        </p>
      )}
    </div>
  );
}

export default ReadwiseHighlight;
