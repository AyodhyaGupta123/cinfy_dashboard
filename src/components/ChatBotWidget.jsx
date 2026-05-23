import React, { useState, useRef } from "react";
import { Phone, Send, ChevronLeft, X } from "lucide-react";
// import api from "../services/api";

const ChatBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStarted, setCallStarted] = useState(false);
  const [conversation, setConversation] = useState([]);

  const recognitionRef = useRef(null);
  const isCallActiveRef = useRef(false);
  const silenceTimerRef = useRef(null);

  const isMobile = window.innerWidth <= 640;

  const sendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    setConversation((prev) => [...prev, { role: "user", content: textToSend }]);
    setLoading(true);

    setTimeout(() => {
      setConversation((prev) => [
        ...prev,
        {
          role: "ai",
          content: "This is demo UI response. Backend API is currently disabled.",
        },
      ]);
      setLoading(false);
      setIsSpeaking(false);
    }, 800);

    /*
    try {
      const response = await api.post("/chat", {
        message: textToSend,
      });

      setLoading(false);
      setIsSpeaking(true);

      const aiText = response.data.answer || "";
      const audioBase64 = response.data.audio;

      setConversation((prev) => [
        ...prev,
        { role: "ai", content: aiText },
      ]);

      if (audioBase64) {
        playAudio(audioBase64);
      } else {
        setIsSpeaking(false);
        if (isCallActiveRef.current) {
          recognitionRef.current?.start();
        }
      }
    } catch (error) {
      console.error("API Error:", error);
      setConversation((prev) => [
        ...prev,
        { role: "ai", content: "Network issue. Please try again." },
      ]);
      setLoading(false);
      setIsSpeaking(false);

      if (isCallActiveRef.current) {
        setTimeout(() => recognitionRef.current?.start(), 2000);
      }
    }
    */
  };

  /*
  const playAudio = (base64Audio) => {
    const audioStr = `data:audio/mp3;base64,${base64Audio}`;
    const audioInstance = new Audio(audioStr);

    audioInstance.playbackRate = 0.85;

    audioInstance.onended = () => {
      setIsSpeaking(false);
      if (isCallActiveRef.current) {
        recognitionRef.current?.start();
      }
    };

    audioInstance.onerror = () => {
      setIsSpeaking(false);
      if (isCallActiveRef.current) recognitionRef.current?.start();
    };

    audioInstance.play().catch((e) => {
      console.error("Audio playback blocked:", e);
      setIsSpeaking(false);
      if (isCallActiveRef.current) recognitionRef.current?.start();
    });
  };
  */

  const toggleCall = () => {
    if (isCallActiveRef.current) {
      isCallActiveRef.current = false;
      setCallStarted(false);
      setIsListening(false);
      setLoading(false);
      setIsSpeaking(false);
    } else {
      isCallActiveRef.current = true;
      setCallStarted(true);
      setConversation([
        {
          role: "ai",
          content:
            "Hello there! Need help? Reach out to us right here, and we'll get back to you as soon as we can!",
        },
      ]);
    }
  };

  const handleSendManualText = () => {
    if (!message.trim()) return;

    const textToProcess = message;
    setMessage("");
    sendMessage(textToProcess);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          right: 22,
          bottom: 22,
          width: 78,
          height: 70,
          border: "none",
          borderRadius: "34px 34px 34px 8px",
          background: "#02B870",
          boxShadow: "0 10px 20px rgba(0,0,0,0.25)",
          cursor: "pointer",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            border: "3px solid #fff",
            color: "#fff",
            fontSize: 18,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          C
        </div>
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        right: isMobile ? 0 : 18,
        bottom: isMobile ? 0 : 18,
        width: isMobile ? "100vw" : 390,
        maxWidth: "100vw",
        height: isMobile ? "100vh" : 620,
        maxHeight: "100vh",
        background: "#f4f5f7",
        borderRadius: isMobile ? 0 : 12,
        overflow: "hidden",
        boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
        zIndex: 9999,
        border: "1px solid #e5e7eb",
      }}
    >
      <button
        onClick={() => {
          setIsOpen(false);
          setCallStarted(false);
        }}
        style={{
          position: "absolute",
          right: 8,
          top: 8,
          width: 42,
          height: 32,
          borderRadius: 20,
          border: "none",
          background: "#3d5362",
          color: "#fff",
          cursor: "pointer",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <X size={18} />
      </button>

      {!callStarted ? (
        <>
          <div
            style={{
              background: "#02B870",
              padding: isMobile ? "42px 18px 74px" : "44px 18px 70px",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                border: "4px solid #dadada",
                color: "#fff",
                fontWeight: 900,
                fontSize: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              C
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: isMobile ? 26 : 24,
                fontWeight: 800,
                color: "#fff",
              }}
            >
              Cinfy Assistant
            </h2>
          </div>

          <div
            style={{
              background: "#fff",
              margin: "-52px 8px 0",
              borderRadius: 10,
              boxShadow: "0 3px 12px rgba(0,0,0,0.14)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "18px",
                fontSize: 18,
                fontWeight: 800,
                color: "#283c5a",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              Support
            </div>

            <button
              onClick={toggleCall}
              style={{
                width: "100%",
                border: "none",
                background: "#fff",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                cursor: "pointer",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <Phone size={26} color="#9ca3af" />

              <div style={{ flex: 1, textAlign: "left" }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#02B870",
                  }}
                >
                  Chat with us
                </div>

                <div
                  style={{
                    fontSize: 14,
                    color: "#a0a8b5",
                    marginTop: 4,
                  }}
                >
                  Hello there! Need help? Reach o...
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setCallStarted(true);
                setConversation([
                  {
                    role: "ai",
                    content:
                      "Are you facing any issue with the registration?",
                  },
                ]);
              }}
              style={{
                width: "100%",
                border: "none",
                background: "#f3f4f6",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  background: "#02B870",
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                C
              </div>

              <div style={{ flex: 1, textAlign: "left" }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#283c5a",
                  }}
                >
                  Sign-up
                </div>

                <div
                  style={{
                    fontSize: 14,
                    color: "#a0a8b5",
                    marginTop: 4,
                  }}
                >
                  Are you facing any issue with the...
                </div>
              </div>
            </button>
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              background: "#02B870",
              padding: "34px 18px 26px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <button
              onClick={() => setCallStarted(false)}
              style={{
                width: 38,
                height: 38,
                border: "none",
                borderRadius: 6,
                background: "rgba(255,255,255,0.45)",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChevronLeft size={22} />
            </button>

            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#fff",
                }}
              >
                Chat with us
              </h3>

              <p
                style={{
                  margin: "3px 0 0",
                  fontSize: 13,
                  color: "#dcfce7",
                  fontWeight: 500,
                }}
              >
                Typically replies within 1 minute
              </p>
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              margin: "-22px 12px 0",
              height: isMobile ? "calc(100vh - 165px)" : 430,
              borderRadius: 10,
              padding: "22px 16px",
              overflowY: "auto",
            }}
          >
            {conversation.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    background:
                      msg.role === "user" ? "#02B870" : "#f1f1f1",
                    color:
                      msg.role === "user" ? "#fff" : "#172b4d",
                    padding: "12px 16px",
                    borderRadius:
                      msg.role === "user"
                        ? "18px 18px 0 18px"
                        : "0 20px 20px 20px",
                    maxWidth: 260,
                    fontSize: 15,
                    lineHeight: 1.5,
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ color: "#6b7280", fontSize: 14 }}>
                Typing...
              </div>
            )}
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 62,
              background: "#fff",
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              padding: "0 14px",
              gap: 10,
            }}
          >
            <input
              type="text"
              placeholder="Reply here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSendManualText()
              }
              style={{
                border: "none",
                outline: "none",
                flex: 1,
                fontSize: 15,
                color: "#283c5a",
                background: "transparent",
              }}
            />

            <button
              onClick={handleSendManualText}
              style={{
                width: 42,
                height: 42,
                border: "none",
                borderRadius: 8,
                background: message.trim() ? "#02B870" : "#cbd5e1",
                color: message.trim() ? "#fff" : "#9ca3af",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Send size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBotWidget;