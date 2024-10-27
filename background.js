chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    
    if (request.action === "unbiasText") {

        const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBuEoKi-vBZ3tc6uGm9u32bQgetlGYn6Bg';
        
        fetch(apiUrl, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            contents: [
                {
                parts: [
                    { text: `Analyze the following text for racial, social, or economic bias: ${request.text}. If you detect bias, please provide just an alternative, unbiased sentence (no explanation required). If you are unable to detect bias, please indicate "No further suggestions."`}
                ]
                }
            ]
            })
        })
        .then(response => response.json())
        .then(data => {
            const unbiasedText = data.candidates[0].content.parts[0].text;
            chrome.storage.local.set({
            originalText: request.text,
            suggestedText: unbiasedText
            });
        });
          
    }else if(request.action == 'scanPageBiasMetric'){

        callApiBaisMetric(request.text, (data) => {
            sendResponse({ data: data });
        });

        return true;

    }else if(request.action === "scanSpeechBiasMetric"){
        
        callApiBaisMetric(request.transcript, (data) => {
            sendResponse({ data: data });
        });

        return true;
    }
});

function callApiBaisMetric(text, callback){

    fetch(`http://127.0.0.1:5000/api/baised-metric`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin':'*' 
        },
        body: JSON.stringify({
            data: text
        }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            callback(data);
        })
        .catch((error) => {
            console.error("Error:", error);
    });
}
