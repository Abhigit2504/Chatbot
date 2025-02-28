import './App.css';
import gptlogo from './assets/assets/chatgpt.svg';
import addbtn from './assets/assets/add-30.png';
import msgicon from './assets/assets/message.svg';
import home from './assets/assets/home.svg';
import saved from './assets/assets/bookmark.svg';
import rocket from './assets/assets/rocket.svg';
import sendbtn from './assets/assets/send.svg';
import usericon from './assets/assets/user-icon.png';
import gptimglogo from './assets/assets/chatgptLogo.svg';
import bookmarkIcon from './assets/assets/bookmark.svg'; // Bookmark Icon
import bookmarkedIcon from './assets/assets/bookmark.svg'; // Active Bookmark Icon
import { sendMsgToGemini } from './openai';
import { useEffect, useRef, useState } from 'react';

function App() {
  const msgend = useRef(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [savedMessages, setSavedMessages] = useState([]); // State for saved messages
  const [showSaved, setShowSaved] = useState(false); // Toggle between chat and saved messages

  useEffect(() => {
    if (msgend.current) {
      msgend.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Auto-scroll on new messages

  const handleSend = async () => {
    if (!input.trim()) return; // Prevent sending empty messages

    const newMessages = [...messages, { sender: "user", text: input, saved: false }];
    setMessages(newMessages);
    setInput(""); // Clear input field

    const response = await sendMsgToGemini(input);
    setMessages([...newMessages, { sender: "bot", text: response, saved: false }]);
  };

  // Toggle Bookmark (Save/Unsave Message)
  const toggleBookmark = (msgText) => {
    setMessages(messages.map(msg =>
      msg.text === msgText ? { ...msg, saved: !msg.saved } : msg
    ));

    setSavedMessages(prevSaved => {
      const isSaved = prevSaved.includes(msgText);
      return isSaved ? prevSaved.filter(msg => msg !== msgText) : [...prevSaved, msgText];
    });
  };

  return (
    <div className="App">
      <div className="sidebar">
        <div className="upperside">
          <div className="uppersidetop">
            <img src={gptlogo} alt="ChatGPT Logo" className="logo" />
            <span className="brand">ChatGPT</span>
          </div>
          <button className="midbutton" onClick={() => window.location.reload()}>
            <img src={addbtn} alt="New Chat" className="addbtn" /> New Chat
          </button>
          <div className="uppersidebutton">
            <button className="query" onClick={() => setInput("What is Programming?")}>
              <img src={msgicon} alt="Message Icon" className="query-icon" /> What is Programming?
            </button>
            <button className="query" onClick={() => setInput("What is AI?")}>
              <img src={msgicon} alt="Message Icon" className="query-icon" /> What is AI?
            </button>
          </div>
        </div>

        <div className="lowerside">
          <div className="listitems">
            <div className="listitem" onClick={() => setShowSaved(false)}>
              <img src={home} alt="Home Icon" className="listitemsimg" />
              <span>Home</span>
            </div>
            <div className="listitem" onClick={() => setShowSaved(true)}>
              <img src={saved} alt="Saved Icon" className="listitemsimg" />
              <span>Saved</span>
            </div>
            <div className="listitem">
              <img src={rocket} alt="Upgrade Icon" className="listitemsimg" />
              <span>Upgrade</span>
            </div>
          </div>
        </div>
      </div>

      <div className="main">
        {!showSaved ? (
          <>
            <div className='chats'>
              {messages.map((msg, index) => (
                <div key={index} className={`chat ${msg.sender === "bot" ? "bot" : ""}`}>
                  <img className='chatimg' src={msg.sender === "bot" ? gptimglogo : usericon} alt='' />
                  <p className='txt'>{msg.text}</p>
                  <button 
  className="save-btn" 
  onClick={() => toggleBookmark(msg.text)}
  aria-label="Save Message"
>
  <img 
    src={msg.saved ? bookmarkedIcon : bookmarkIcon} 
    alt="Bookmark Icon" 
    className="bookmark-icon"
    style={{ filter: msg.saved ? 'brightness(0) saturate(100%) invert(64%) sepia(74%) saturate(272%) hue-rotate(1deg) brightness(98%) contrast(94%)' : 'none' }}
  />
</button>

                </div>
              ))}
              <div ref={msgend} /> {/* Auto-scroll reference */}
            </div>

            <div className='chatfooter'>
              <div className='inp'>
                <input 
                  type='text' 
                  placeholder='Send a message' 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()} 
                />
                <button className='send' onClick={handleSend}>
                  <img src={sendbtn} alt='send' />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className='saved-messages'>
            <h2>Saved Messages</h2>
            {savedMessages.length === 0 ? (
              <p>No messages saved yet.</p>
            ) : (
              savedMessages.map((msg, index) => (
                <div key={index} className="saved-chat">
                  <p>{msg}</p>
                  <button 
                    className="save-btn" 
                    onClick={() => toggleBookmark(msg)}
                    aria-label="Unbookmark Message"
                  >
                    <img 
                      src={bookmarkedIcon} 
                      alt="Unbookmark Icon" 
                      className="bookmark-icon"
                    />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
