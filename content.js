
// Set a delay time (in milliseconds)
const typingDelay = 1000; // 1 second

let typingTimer;

// Function to handle typing completion
function handleTypingComplete() {
  const activeTextBox = getActiveTextBox();
  if (activeTextBox) {
    if (activeTextBox.textContent.length > 0) {
        chrome.runtime.sendMessage(null, { action: "textSelected", text: activeTextBox.textContent }, null, (response) => {
            if (response) {
                console.log("Data received:", response.suggestion);
            }
        });
    }
  }
}

// Function to get the active text box
function getActiveTextBox() {
  const activeElement = document.activeElement;

  if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable) {
    return activeElement;
  } else {
    return null;
  }
}

// Function to handle input event
function handleInputEvent() {
  // Clear the previous timer
  clearTimeout(typingTimer);

  // Set a new timer
  typingTimer = setTimeout(handleTypingComplete, typingDelay);
}

// Attach event listeners to the document for input and blur events
document.addEventListener('input', handleInputEvent);
document.addEventListener('blur', handleTypingComplete, true); // 'true' for capturing phase

  