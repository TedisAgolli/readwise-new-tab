import * as chrome from "./ChromeCacheAccessor";
import * as fake from "./FakeCacheAccessor";

console.log(process.env.NODE_ENV);
let browserAPI;

if (process.env.NODE_ENV === "production") {
  browserAPI = chrome;
} else if (process.env.NODE_ENV === "development") {
  browserAPI = fake;
}

export default browserAPI;
