import ChromeCacheAccessor from "./ChromeCacheAccessor";
import FakeCacheAccessor from "./FakeCacheAccessor";

export interface CacheAccessor {
  get(id: string, callback: (response: any) => void): any;
  store(id: string, item: any, callback: Function): void;
  sendMessage(req: any, handler: (response: any) => void): void;
}
console.log(process.env.NODE_ENV);
let browserAPI;

// if (process.env.NODE_ENV === "production") {
//   browserAPI = new ChromeCacheAccessor();
// } else if (process.env.NODE_ENV === "development") {
//   browserAPI = new FakeCacheAccessor();
// }
browserAPI = new ChromeCacheAccessor();

export default browserAPI as CacheAccessor;
