// src/workers/example.worker.js
self.addEventListener('message', function (e) {
  console.log('Worker received:', e.data);

  self.postMessage({ result: e.data });
})
