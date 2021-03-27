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

async function store(id, item) {
  chrome.storage.sync.set({ [id]: item }, (e) => {
    console.log(`Stored ${id} with value ${JSON.stringify(item)}`);
    chrome.storage.sync.get(id, (res) => {
      console.log(`Getting after store ${id} ${JSON.stringify(res)} ${e}`);
    });
  });
}

export { get, store };
