import React from "react";

function ReadwiseHighlight({ quoteAndCover }) {
  const { quote, cover } = quoteAndCover;
  return (
    // Default state if src or quote empty
    <div className="flex m-auto max-w-2xl bg-opacity-30 rounded-lg shadow-xl border-black bg-gradient-to-r from-red-400 to-pink-500">
      {quote ? (
        <>
          <img alt="Book Cover" src={cover} />
          <p className="mx-2 text-white text-xl font-semibold m-auto">
            {quote}
          </p>
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
