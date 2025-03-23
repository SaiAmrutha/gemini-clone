import React from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Main from "./components/Main/Main";

const App = () => {
  return (
    <>
      <Sidebar /> {/*sidebar component has been mounted in the app component */}
      <Main /> {/* now main component has been mounted on the app component */}
    </>
  );
};

export default App;
