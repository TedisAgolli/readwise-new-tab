import { CacheAccessor } from "./CacheAccessor";
class ChromeCacheAccessor implements CacheAccessor {
  constructor() {}

  async get(id: string, callback: (response: any) => void) {
    return await new Promise((resolve, reject) => {
      chrome.storage.sync.get(id, (res) => {
        const item = res[id];
        console.log(
          `Getting ${id} ${JSON.stringify(item)} ${JSON.stringify(res)}`
        );
        callback(item);
        resolve(item);
      });
    });
  }

  store(id: string, item: any, callback: Function) {
    chrome.storage.sync.set({ [id]: item }, () => {
      console.log(`Stored ${id} with value ${JSON.stringify(item)}`);
      chrome.storage.sync.get(id, (res) => {
        callback(res);
      });
    });
  }

  sendMessage(request: any, handler: (respnse: any) => void) {
    chrome.runtime.sendMessage(request, handler);
  }
}

export default ChromeCacheAccessor;
