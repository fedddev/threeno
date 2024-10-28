// worker.js
onmessage = function (event: MessageEvent<number>) {
  // Perform some computation
  const result = event.data + 1;

  // Send the result back to the main thread
  postMessage(result);
};
