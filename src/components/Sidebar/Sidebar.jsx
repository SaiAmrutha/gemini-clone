import React, { useContext, useState } from "react";
import "./Sidebar.css";
import { Context } from "../../context/Context";

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const [pinned, setPinned] = useState(false);
  const { onSent, prevPrompts, setRecentPrompt, newChat } = useContext(Context);

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
  };

  const handlingMouseEnter = () => {
    if (!pinned) {
      setExtended(true);
    }
  };

  const handlingMouseLeave = () => {
    if (!pinned) {
      setExtended(false);
    }
  };

  const togglingPin = () => {
    setPinned(!pinned);
    setExtended(!pinned); //open if we are pinning else close if we are unpinning
  };

  return (
    <div
      className="sidebar"
      onMouseEnter={handlingMouseEnter}
      onMouseLeave={handlingMouseLeave}
    >
      <div className="top">
        <i onClick={togglingPin} className="fa-solid fa-bars icons" id="menu" />
        <div onClick={() => newChat()} className="new-chat">
          <i className="fa-solid fa-plus icons" />
          {extended ? <p>New Chat</p> : null}
        </div>
        {extended ? (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {prevPrompts.map((item, index) => {
              return (
                <div onClick={() => loadPrompt(item)} className="recent-entry">
                  <i className="fa-regular fa-message icons" />
                  <p>{item.slice(0, 18)}...</p>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <i className="fa-solid fa-question icons" />
          {extended ? <p>Help</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <i className="fa-solid fa-clock-rotate-left icons" />
          {extended ? <p>History</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <i className="fa-solid fa-gear icons" />
          {extended ? <p>Settings</p> : null}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
