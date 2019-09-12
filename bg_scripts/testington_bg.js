const runningList = new Set();

function receivedMessage(content, sender, respond) {
  console.log(runningList);
  console.log(content);
  if (content.message == "START_AUTORUN") {
    runningList.add(content.uniqueName);
    respond({
      message: content.message,
      result: "OK"
    });
  } else if (content.message == "STOP_AUTORUN") {
    console.log("Stopping");
    console.log("Found element to delete:",runningList.delete(content.uniqueName));
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
