console.log("hello");
let globalErr = null;
if ("webkitSpeechRecognition" in window) {
    console.log("success");
    let speechRecognition = new webkitSpeechRecognition();
    let final_transcript = "";
  
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = document.querySelector("#select_dialect").value;
  
    speechRecognition.onstart = () => {
      document.querySelector("#status").style.display = "block";
    };
    speechRecognition.onerror = function(event) {
      document.querySelector("#status").style.display = "none";
      console.log('Speech recognition error detected: ' + event);
      globalErr = event;
      console.log("Speech Recognition Error");
    };
    speechRecognition.onend = () => {
      document.querySelector("#status").style.display = "none";
      console.log("Speech Recognition Ended");
    };
  
    speechRecognition.onresult = (event) => {
      let interim_transcript = "";
  
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      document.querySelector("#final").innerHTML = final_transcript;
      document.querySelector("#interim").innerHTML = interim_transcript;
    };
  
    document.querySelector("#start").onclick = () => {
      speechRecognition.start();
    };
    document.querySelector("#stop").onclick = () => {
      speechRecognition.stop();
    };
  } else {
    console.log("Speech Recognition Not Available");
  }