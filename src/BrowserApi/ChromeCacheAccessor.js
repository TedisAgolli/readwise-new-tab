/*global chrome*/
async function get(id, callback) {
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

async function store(id, item, callback) {
  chrome.storage.sync.set({ [id]: item }, (e) => {
    console.log(`Stored ${id} with value ${JSON.stringify(item)}`);
    chrome.storage.sync.get(id, (res) => {
      callback(res);
    });
  });
}

async function sendMessage(request, handler) {
  chrome.runtime.sendMessage(request, handler);
}

export { get, store, sendMessage };
