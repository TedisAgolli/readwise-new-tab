import React from "react";

function ReadwiseHighlight({ quoteAndCover }) {
  const { quote, cover } = quoteAndCover;
  return (
    <div className="flex m-auto max-w-2xl bg-opacity-30 rounded-lg shadow-xl border-black bg-gradient-to-r from-red-400 to-pink-600">
      <img src={cover} />
      <p className="mx-2 text-white text-xl font-bold m-auto">{quote}</p>
    </div>
  );
}

export default ReadwiseHighlight;
