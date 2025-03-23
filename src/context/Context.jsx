import { createContext, useContext, useEffect, useState, useRef } from "react";
import run from "../config/gemini";
export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const loadingContainerRef = useRef(null);

  useEffect(() => {
    if (!userName) {
      const name = prompt("Please enter your name:");
      if (name) {
        setUserName(name);
        localStorage.setItem("userName", name);
      }
    }
  }, [userName]);
  // const containerRef = useRef(null); //reference for the container

  useEffect(() => {
    if (loadingContainerRef.current) {
      loadingContainerRef.current.scrollTop =
        loadingContainerRef.current.scrollHeight;
    }
  }, [loading]);

  //function to load each word slowly
  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  // after executing this function result screen will be hidden and greet,card section will be visible
  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };
  // this is nothing but the send button's functioning
  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;
    //this if stmt will work if we click something on the recent section on the sidebar that we received in the prompt
    if (prompt != undefined) {
      response = await run(prompt);
      setRecentPrompt(prompt);
    } else {
      //input and then ...prev will give the latest/last questions on top and old at the bottom, prev and input will give 1st question on top and last ques at last
      setPrevPrompts((prev) => [input, ...prev]); //everytime we call the onSent function, everytime in the prevPrompts array our input will be stored and we will use that input in our sidebar component in the recent section
      setRecentPrompt(input);
      response = await run(input);
    }
    let responseArray = response.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    let newResponse2 = newResponse.split("*").join("</br>");
    let newResponseArray = newResponse2.split(" ");
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayPara(i, nextWord + " ");
    }
    setLoading(false);
    setInput("");
  };

  //these functions are what show up on the sidebar and main page
  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
    userName,
    transcript,
    listening,
    darkMode,
    loading,
  };

  return (
    <Context.Provider
      value={{
        contextValue,
        input,
        setInput,
        transcript,
        setTranscript,
        onSent,
        darkMode,
        prevPrompts,
        showResult,
        resultData,
        recentPrompt,
        newChat,
        userName,
        loading,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

// export const useTheme = useContext(Context);
export default ContextProvider;
