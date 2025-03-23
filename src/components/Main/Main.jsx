import React, { useState, useContext, useEffect, useRef } from "react";
import "./Main.css";
import { Context } from "../../context/Context";

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
    userName,
    loadingContainerRef,
  } = useContext(Context);
  const [listening, setListening] = useState(false);
  const { transcript, setTranscript } = useContext(Context);
  const inputRef = useRef(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSent();
    }
  };

  const handleCardClick = (promptText) => {
    setInput(promptText);
  };

  useEffect(() => {
    if (transcript) {
      setInput((prev) => prev + " " + transcript);
    }
  }, [transcript, setInput]);

  const voiceRecognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  voiceRecognition.continuous = true;
  voiceRecognition.interimResults = true;
  voiceRecognition.lang = "en-US";

  voiceRecognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    setTranscript(transcript);
  };

  voiceRecognition.onerror = (event) => {
    if (event.error === "aborted") {
      console.log("speech recog aborted");
      setListening(false);
      inputRef.current.focus();
    } else {
      console.error("Error occured:", event.error);
    }
  };

  voiceRecognition.onend = (event) => {
    console.log("Speech recog has stopped");
    setListening(false);
  };

  const startListening = () => {
    if (!listening) {
      voiceRecognition.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    // if (listening) {
    voiceRecognition.abort();
    setListening(false);
    // }
  };

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  React.useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);
  return (
    <div className="main">
      <div className={darkMode ? "dark" : "light"}>
        <button onClick={toggleTheme}>
          {darkMode ? (
            <i class="fa-solid fa-sun"></i>
          ) : (
            <i class="fa-solid fa-moon"></i>
          )}
        </button>
      </div>
      <div className="nav">
        <p>Gemini</p>
        <i className="fa-solid fa-user user-icon" />
      </div>
      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, {userName || "Dev"}!</span>
              </p>
              <p>How can I help you today?</p>
            </div>
            <div className="cards">
              <div
                className="card"
                onClick={() =>
                  handleCardClick(
                    "Suggest beautiful places to see on an upcoming road"
                  )
                }
              >
                <p>Suggest beautiful places to see on an upcoming road</p>
                <i className="fa-solid fa-compass card-icons" />
              </div>
              <div
                className="card"
                onClick={() =>
                  handleCardClick(
                    "Briefly summarize this concept: urban planning"
                  )
                }
              >
                <p>Briefly summarize this concept: urban planning</p>
                <i className="fa-solid fa-lightbulb card-icons" />
              </div>
              <div
                className="card"
                onClick={() =>
                  handleCardClick(
                    "Brainstorm team bonding activities for our work retreat"
                  )
                }
              >
                <p>Brainstorm team bonding activities for our work retreat</p>
                <i className="fa-solid fa-message card-icons" />
              </div>
              <div
                className="card"
                onClick={() =>
                  handleCardClick(
                    "Improve the readability of the following code"
                  )
                }
              >
                <p>Improve the readability of the following code</p>
                <i className="fa-solid fa-code card-icons" />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <i className="fa-solid fa-user result-icons" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data" ref={loadingContainerRef}>
              <i className="fa-solid fa-wand-magic-sparkles result-icons" />
              {/* If loading is true that means our response is not generated yet in that case we will display the div loader where there will be loading animation
              and if loading is false then in that case it has generated the response. 
              So then we will display the p tag where we are displaying the result data*/}
              {loading ? (
                <div className="loader">
                  <hr></hr>
                  <hr></hr>
                  <hr></hr>
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              // ref={inputRef}
              value={input}
              type="text"
              placeholder="Enter a prompt here.."
            />
            <div>
              <i className="fa-solid fa-camera text-box-icons" />
              <i
                onClick={startListening}
                disabled={listening}
                className="fa-solid fa-microphone text-box-icons"
              />
              Start
              <i
                onClick={stopListening}
                disabled={!listening}
                className="fa-solid fa-microphone-slash text-box-icons"
              />
              Stop
              <p>{listening ? "Listening..." : "Click to start listening."}</p>
              {/* <p>Transcript: {transcript}</p> */}
              {input ? (
                <i
                  onClick={() => onSent()}
                  className="fa-solid fa-paper-plane text-box-icons"
                />
              ) : null}
            </div>
          </div>
          <p className="bottom-info">
            Gemini may display inaccurate info, including about people, so
            double-check its response. Your privacy and Gemini Apps.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
