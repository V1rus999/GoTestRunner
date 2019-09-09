const runningList = [];

function receivedMessage(content, sender, respond) {
  if (content.message == "START_AUTORUN") {
    runningList.push(content.uniqueName);
    respond({
      message: content.message,
      result: "OK"
    });
  } else if (content.message == "STOP_AUTORUN") {
    runningList.pop(content.uniqueName);
    respond({
      message: content.message,
      result: "OK"
    });
  } else if (content.message == "ALREADY_RUNNING") {
    respond({
      message: content.message,
      result: `${runningList.includes(content.uniqueName)}`
    });
  } else {
    respond({
      message: content.message,
      result: "UNHANDLED_MESSAGE"
    });
  }
}

browser.runtime.onMessage.addListener(receivedMessage);
