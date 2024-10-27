document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    chrome.runtime.sendMessage({ action: "unbiasText", text: selectedText });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "scanPage") {

    let textContent = document.body.textContent;
    
    if(textContent){
      chrome.runtime.sendMessage({ action: "scanPageBiasMetric", text: textContent }, (response) => {
        sendResponse(response);
      });
    }
  }

  return true;
});
