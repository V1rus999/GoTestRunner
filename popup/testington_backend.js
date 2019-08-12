
function listenForClicks() {
    document.addEventListener("click", (e) => {
        console.error(`listenForClicks: ${e}`);
    });
  }


function reportExecuteScriptError(error) {
    console.error(`Failed to execute content script: ${error.message}`);
  }


browser.tabs.executeScript({file: "/content_scripts/testBot.js"})
.then(listenForClicks)
.catch(reportExecuteScriptError);