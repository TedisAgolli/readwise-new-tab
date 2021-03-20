import "./App.css";
import { useState } from "react";

const HIGHLIGHTS_ROUTE = "https://readwise.io/api/v2/highlights";
function App() {
  const [quote, setQuote] = useState("");
  const [token, setToken] = useState("");
  async function getHighlights(e) {
    e.preventDefault();
    const data = await fetch(HIGHLIGHTS_ROUTE, {
      method: "GET",
      mode: "cors",
      headers: { Authorization: `TOKEN ${token}` },
    })
      .then((res) => res.json())
      .then((res) => res.results[0].text)
      .catch((e) => console.log(e));
    setQuote(data);
    console.log(data);
  }
  return (
    <div className="App m-2">
      <form className="center max-w-2xl" onSubmit={getHighlights}>
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
      <p>{quote}</p>
    </div>
  );
}

export default App;
