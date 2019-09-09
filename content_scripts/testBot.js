/*

    Open up the jobs tab in your acceptance tests
    Click on Autorun tests
    This will run the tests at a set interval if it failed

*/

(function() {
  console.log("Running testbot content script");
  if (window.hasRun) {
    console.log("Script already injected, not injecting again.");
    return;
  }
  window.hasRun = true;
  var runningReference = null;
  var mutationObserver = null;

  const uniqueName = extractBuildUniqueName();
  sendMessage(queryAutorunningMessage(uniqueName), browser).then(res => {
    console.log(res);
    const shouldRun = res == "true";
    main(shouldRun);
  });

  function main(isCurrentlyRunning) {
    console.log(`Main is running ${isCurrentlyRunning}`);
    const buttonText = isCurrentlyRunning
      ? "Stop Autorun AT"
      : "Start Autorun AT";

    if (!checkAutorunButtonVisible()) {
      console.log("Button is not visible");
      const eventListener = () => {
        console.log(`Eventlistener ran ${isCurrentlyRunning}`);
          if (!isCurrentlyRunning) {
            setupAutoTestRuns();
          } else {
            sendMessage(stopAutorunMessage(uniqueName), browser);
            clearInterval(runningReference);
          }
      };

      addAutoRunButton(buttonText, eventListener);
    } else {
      console.log("Button is visible");
      changeAutoRunButtonText(buttonText);
    }

    if (isCurrentlyRunning && !runningReference) {
      setupAutoTestRuns();
    }
  }

  function setupAutoTestRuns() {
    sendMessage(startAutorunMessage(uniqueName), browser);
    clearInterval(runningReference);
    //Lets run it as you click
    startTestRuns();
    //Then run it every 30 seconds
    runningReference = setInterval(startTestRuns, 30000);
  }

  function startTestRuns() {
    console.log("Autorunning tests for you");

    const rerunHolder = document.getElementById("job_actions");
    const rerunButton = rerunHolder.children.item(0);
    if (rerunButton && rerunButton.className.includes("submit")) {
      if (selectCheckboxes()) {
        // rerunButton.click();
        console.log("Clicked on submit");
      } else {
        console.log("Nothing to run");
      }
    } else {
      console.log("No submit button to click on");
    }
  }

  function selectCheckboxes() {
    console.log("Looking for checkboxes to select");
    const tableWithJobs =
      document.getElementsByClassName("jobs_summary list_table") ||
      document.getElementsByClassName(
        "jobs_summary list_table stage_with_rerun_jobs"
      );
    const bodyWithJobs = tableWithJobs.item(0).firstElementChild;
    const jobs = bodyWithJobs.children;
    const clickedOnSomething = false;

    // i = 1 because we want to skip the table header
    for (var i = 1, row; (row = jobs.item(i)); i++) {
      const jobResult = row.getElementsByClassName("job_result").item(0);
      const jobName = row.getElementsByClassName("job_name").item(0);
      if (checkTestShouldRerun(jobResult, jobName)) {
        const selectorClass = row.getElementsByClassName("selector").item(0);
        const actualCheckBox = selectorClass.children.item(0);
        if (!actualCheckBox.checked) {
          actualCheckBox.click();
          clickedOnSomething = true;
          console.log("Clicked on a failed checkbox");
        } else {
          console.log("Failed checkbox already clicked on");
        }
      }
    }
    return clickedOnSomething;
  }

  function checkTestShouldRerun(jobResult, jobName) {
    if (
      (jobResult.children.item(0).className.includes("Failed") ||
        jobResult.children.item(0).className.includes("Cancelled")) &&
      jobName.children.item(0).innerHTML.includes("Test")
    ) {
      return true;
    } else {
      return false;
    }
  }

  function extractBuildUniqueName() {
    const header = document.getElementById("pipeline_header");
    const titleHolder = header.getElementsByClassName("entity_title").item(0);
    return titleHolder.getElementsByClassName("name").item(0).innerText;
  }

  function changeAutoRunButtonText(text) {
    const button = document.getElementById("autoRunAtButton");
    if (button.length > 0) {
      button.innerHTML = text;
    }
  }

  function addAutoRunButton(text, eventListener) {
    const rerunHolder = document.getElementById("job_actions");
    if (!document.getElementById("autoRunAtButton")) {
      var button = document.createElement("button");
      button.innerHTML = text;
      button.id = "autoRunAtButton";
      button.style.fontSize = "medium";
      button.setAttribute("type", "button");
      button.style.marginLeft = "8px";
      button.style.marginRight = "8px";
      button.style.padding = "2px";
      button.style.border = "2px solid green";
      button.addEventListener("click", () => {
        console.log(`Clicked on Autorun ${text}`);
        eventListener();
      });

      rerunHolder.appendChild(button);

      if (!mutationObserver) {
        const whatToTarget = document.getElementsByTagName("body")[0];
        console.log("Adding mutation observer");
        mutationObserver = new MutationObserver(e => {
          if (e[0].removedNodes) addAutoRunButton(text, eventListener);
        });
        mutationObserver.observe(whatToTarget, {
          attributes: true,
          childList: true,
          subtree: true
        });
      }
    }
  }

  function checkAutorunButtonVisible() {
    return document.getElementById("autoRunAtButton") != null;
  }
  

  function stopAutorunMessage(name) {
    return {
      message: "STOP_AUTORUN",
      uniqueName: name
    };
  }

  function startAutorunMessage(name) {
    return {
      message: "START_AUTORUN",
      uniqueName: name
    };
  }

  function queryAutorunningMessage(name) {
    return {
      message: "ALREADY_RUNNING",
      uniqueName: name
    };
  }

  function sendMessage(message, browser) {
    return browser.runtime.sendMessage(message);
  }
})();
