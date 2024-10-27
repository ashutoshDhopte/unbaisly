chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "showSuggestion") {
        // console.log(request);
        // document.getElementById("originalText").textContent = "Original: " + request.text;
        // document.getElementById("suggestedText").textContent = "Suggestion: " + request.suggestion;
        // chrome.runtime.sendMessage(request.senderID, { action: "showSuggestion", suggestion: result, text: request.text});
    }
});
  