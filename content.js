document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    chrome.runtime.sendMessage({ action: "unbiasText", text: selectedText });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "scanPage") {

    const paragraphs = document.querySelectorAll('p');
    const bodyText = Array.from(paragraphs)
      .map(paragraph => paragraph.textContent)
      .join(' ');
    
    if(bodyText){
      chrome.runtime.sendMessage({ action: "scanPageBiasMetric", text: bodyText }, (response) => {
        sendResponse(response);
      });
    }
  }

  return true;
});
