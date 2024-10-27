// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "pageBiasMetric" && request.data) {
//         document.getElementById('biasedMetrics').textContent = request.data;
//     }
// });

document.getElementById("scanPageButton").addEventListener("click", function() {

    chrome.tabs.query({active: true, currentWindow: true}, tabs => {

        const currentTabId = tabs[0].id;

        document.getElementById('biasedMetrics').innerHTML = 'Loading...';
        chrome.tabs.sendMessage(currentTabId, {action: "scanPage"}, (response) => {
            if (response.data) {
                let str = '';
                for (const key in response.data) {
                    if (Object.prototype.hasOwnProperty.call(response.data, key)) {
                        const element = response.data[key];
                        str += '<div style="padding:10px 5px 0px 0px;">'+
                                    '<div style="width:calc(80% - 10px); float: left;">'+key+'</div>'+
                                    '<div style="width:20%; float:right">'+element+'</div>'+
                                '</div>';
                    }
                }
                document.getElementById('biasedMetrics').innerHTML = str;
            }else{
                document.getElementById('biasedMetrics').innerHTML = '';
            }
        });
    });
});

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

document.getElementById("listenBiasInSpeechButton").addEventListener("click", function() {

    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        main(stream).catch(error =>{
            console.error('Error:', error);
        });
    })
    .catch(error => {
        console.error('Error accessing microphone:', error);
    });
});

async function main(stream){

    const audioContext = new AudioContext();
    await audioContext.audioWorklet.addModule('audio-worklet-processor.js');
    const sourceNode = new MediaStreamAudioSourceNode(audioContext, {
        mediaStream: stream
    });
    const processorNode = new AudioWorkletNode(audioContext, 'audio-processor');

    sourceNode.connect(processorNode);
    processorNode.connect(audioContext.destination);

    // recognition.interimResults = true;
    recognition.continuous = true;
    recognition.lang = 'en-US'; // Set the language

    recognition.onresult = (event) => {
        const transcript = event.results[event.resultIndex][0].transcript;
        if(transcript){
            chrome.runtime.sendMessage(null, { action: "scanSpeechBiasMetric", transcript: transcript }, null, (response) => {
                try{
                    if(response.data){
                        str = '';
                        for (const key in response.data) {
                            if (Object.prototype.hasOwnProperty.call(response.data, key)) {
                                const element = response.data[key];
                                str += '<div style="padding:10px 5px 0px 0px;">'+
                                            '<div style="width:calc(80% - 10px); float: left;">'+key+'</div>'+
                                            '<div style="width:20%; float:right">'+element+'</div>'+
                                        '</div>';
                            }
                        }
                        document.getElementById('speechBiasedMetrics').innerHTML = str;
                    }
                }catch(e){
                    console.error('Error speech metric response:', e);
                }
            });
        }
    };

    recognition.start();
}
  