import "./App.css";
import { useState } from "react";
import ReadwiseHighlight from "./ReadwiseHighlight";

const HIGHLIGHTS_ROUTE = "https://readwise.io/api/v2/highlights";
const READWISE_HIGHLIGHT = {
  quote:
    "As a final word of discouragement: a great culture does not get you a great company. If your product isn’t superior or the market doesn’t want it, your company will fail no matter how good its culture is.",
  cover:
    "https://images-na.ssl-images-amazon.com/images/I/41qfMTnnWXL._SL200_.jpg",
};
function App() {
  const [quote, setQuote] = useState("");
  const [token, setToken] = useState("");
  async function getHighlights(e) {
    e.preventDefault();
    const data = await fetch(HIGHLIGHTS_ROUTE, {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: `TOKEN ${token}`,
        "Access-Control-Allow-Credentials": true,
        contentType: "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => res.results[0].text)
      .catch((e) => console.log(e));
    setQuote(data);
    console.log(data);
  }
  return (
    <div className="bg-indigo-600 w-screen h-screen overflow-hidden">
      <form className="max-w-2xl m-2" onSubmit={getHighlights}>
        <div>
          <label
            htmlFor="token"
            className="block text-sm font-medium text-gray-700"
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
        <button className="bg-blue-100 rounded p-2 m-1">Get highlights</button>
      </form>

      <div className="flex h-screen">
        <ReadwiseHighlight
          quote={READWISE_HIGHLIGHT.quote}
          cover={READWISE_HIGHLIGHT.cover}
        />
      </div>
      <p>{quote}</p>
    </div>
  );
}

export default App;
