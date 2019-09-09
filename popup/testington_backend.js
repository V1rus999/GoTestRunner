function listenForClicks() {
  document.addEventListener("click", e => {
    console.error(`listenForClicks: ${e}`);
  });
}

function reportExecuteScriptError(error) {
  console.error(`Failed to execute content script: ${error.message}`);
}

function receivedMessage(message, sender, respond) {
  console.log(message);
  console.log(sender);
  console.log(respond);
  respond("I have received your message");
}

browser.runtime.onMessage.addListener(receivedMessage);

browser.tabs
  .executeScript({ file: "/content_scripts/testBot.js" })
  .then(listenForClicks)
  .catch(reportExecuteScriptError);
