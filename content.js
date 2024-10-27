document.addEventListener("mouseup", () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
        chrome.runtime.sendMessage(null, { action: "textSelected", text: selectedText }, null, (response) => {
            if (response) {
                console.log("Data received:", response.suggestion);
            }
        });
    }
});
  