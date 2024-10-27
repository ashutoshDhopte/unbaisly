// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "pageBiasMetric" && request.data) {
//         document.getElementById('biasedMetrics').textContent = request.data;
//     }
// });

document.getElementById("scanPageButton").addEventListener("click", function() {

    chrome.tabs.query({active: true, currentWindow: true}, tabs => {

        const currentTabId = tabs[0].id;

        chrome.tabs.sendMessage(currentTabId, {action: "scanPage"}, (response) => {
            if (response.data) {
                let str = '';
                for (const key in response.data) {
                    if (Object.prototype.hasOwnProperty.call(response.data, key)) {
                        const element = response.data[key];
                        str += key+' --> '+element+'</br>';
                    }
                }
                document.getElementById('biasedMetrics').innerHTML = str;
            }
        });
    });
});
  