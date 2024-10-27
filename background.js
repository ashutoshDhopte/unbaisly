chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    
    if (request.action === "textSelected") {

        const apiKey = "AIzaSyBuEoKi-vBZ3tc6uGm9u32bQgetlGYn6Bg"; 

        fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [
            {
                parts: [
                {
                    text: `Detect racial bias in the sentence and suggest an alternative unbiased sentence, and don't include any explaination of it, just give the unbaised version, and if unbaised version can't be generated say NA: ${request.text}`
                },
                ],
            },
            ],
        }),
        })
        .then((response) => {
            if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("Response data:", data);
            let result = '';
            if(data.candidates && data.candidates.length > 0 && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0 && data.candidates[0].content.parts[0]){
                result = data.candidates[0].content.parts[0].text;
            }
            sendResponse({ action: "showSuggestion", suggestion: result, text: request.text, senderID: sender.tab.id})
        })
        .catch((error) => {
            console.error("Error:", error);
        });

        return true;

    }else if(request.action == 'scanPageBiasMetric'){
        
        fetch(`http://127.0.0.1:5000/api/baised-metric`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                data: request.text
            }),
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                sendResponse({ data: data })
            })
            .catch((error) => {
                console.error("Error:", error);
        });

        return true;
    }
});