const runningList = new Set();

function receivedMessage(content, sender, respond) {
  if (content.message == "START_AUTORUN") {
    console.log("Starting");
    runningList.add(content.uniqueName);
    respond({
      message: content.message,
      result: "OK"
    });
  } else if (content.message == "STOP_AUTORUN") {
    console.log("Stopping");
    respond({
      message: content.message,
      result: "OK"
    });
  } else if (content.message == "ALREADY_RUNNING") {
    console.log('Already running');
    respond({
      message: content.message,
      result: `${runningList.has(content.uniqueName)}`
    });
  } else {
    respond({
      message: content.message,
      result: "UNHANDLED_MESSAGE"
    });
  }
}

browser.runtime.onMessage.addListener(receivedMessage);
