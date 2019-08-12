/*

    Open up the jobs tab in your acceptance tests
    Click on Autorun tests
    This will run the tests at a set interval if it failed

*/

(function () {
    if (window.hasRun) {
        console.log("Script already running");
        return;
    }
    window.hasRun = true;
    console.log("Running testbot script from func");

    console.log("Running testbot script");
    setTimeout(() => startTestRuns(), 5000);
    var intervalRef = setInterval(() => startTestRuns(), 30000);

    // setupButtons()
    // var buttonVisibilityRef = setInterval(setupButtons, 2000);

    function startTestRuns() {
        console.log("Autorunning tests for you");

        const rerunHolder = document.getElementById("job_actions");
        const rerunButton = rerunHolder.children.item(0);
        if (rerunButton && rerunButton.className.includes("submit")) {
            selectCheckboxes()
            rerunButton.click()
            console.log("Clicked on submit");
        } else {
            console.log("No submit button to click on");
        }
    }

    function selectCheckboxes() {
        console.log("Selecting checkboxes");
        const tableWithJobs = document.getElementsByClassName("jobs_summary list_table") || document.getElementsByClassName("jobs_summary list_table stage_with_rerun_jobs");
        console.log("Found table");
        console.log(tableWithJobs);
        const bodyWithJobs = tableWithJobs.item(0).firstElementChild;
        const jobs = bodyWithJobs.children;

        // i = 1 because we want to skip the table header
        for (var i = 1, row; row = jobs.item(i); i++) {
            const jobResult = row.getElementsByClassName("job_result").item(0)
            const jobName = row.getElementsByClassName("job_name").item(0)
            if (checkTestShouldRerun(jobResult, jobName)) {
                const selectorClass = row.getElementsByClassName("selector").item(0);
                const actualCheckBox = selectorClass.children.item(0);
                if (!actualCheckBox.checked) {
                    actualCheckBox.click();
                    console.log("Clicked on a failed checkbox");
                } else {
                    console.log("Failed checkbox already clicked on");
                }
            }
        }
    }

    function checkTestShouldRerun(jobResult, jobName) {
        if ((jobResult.children.item(0).className.includes("Failed") || jobResult.children.item(0).className.includes("Cancelled")) &&
            (jobName.children.item(0).innerHTML.includes("Test"))) {
            return true;
        } else {
            return false;
        }
    }

    function setupButtons() {
        const rerunHolder = document.getElementById("job_actions")
        if (document.getElementsByTagName("autoRunAtButton").length == 0) {
            var button = document.createElement("autoRunAtButton");
            button.innerHTML = 'Autorun Failed Jobs';
            button.style.fontSize = "medium";
            button.setAttribute("type", "button");
            button.style.marginLetf = "8px"
            button.style.marginRight = "8px"
            button.style.padding = "2px"
            button.style.border = "2px solid green";
            button.addEventListener("click", () => {
                console.log("Clicked on Autorun Failed Jobs");
                if (!intervalRef) {
                    //Lets run it as you click
                    startTestRuns();
                    //Then run it every 30 seconds
                    intervalRef = setInterval(startTestRuns, 30000);
                }

            });

            rerunHolder.appendChild(button);
        }

        if (document.getElementsByTagName("stopAutoRunAtButton").length == 0) {
            var button = document.createElement("stopAutoRunAtButton");
            button.innerHTML = 'Stop Autorunning Jobs';
            button.style.fontSize = "medium";
            button.setAttribute("type", "button");
            button.style.padding = "2px"
            button.style.border = "2px solid red";
            button.addEventListener("click", () => {
                console.log("Stopping autorun");
                if (intervalRef) {
                    clearInterval(intervalRef);
                }
            });

            rerunHolder.appendChild(button);
        }
    }

    function checkButtonsStillVisible() {
        return document.getElementsByTagName("autoRunAtButton").length > 0 && document.getElementsByTagName("stopAutoRunAtButton").length > 0;
    }
})();

