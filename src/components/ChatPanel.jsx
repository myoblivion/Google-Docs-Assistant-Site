import React, { useEffect, useState, useRef, useCallback } from "react";
import StopIcon from "@mui/icons-material/Stop";
import AssistantIcon from "@mui/icons-material/AssistantOutlined";
import axios from "axios";

const PopularPromptsPopup = React.memo(
  ({
    popularPrompts,
    newPrompt,
    onPromptClick,
    onDeletePrompt,
    onAddPrompt,
    onClose,
    onNewPromptChange,
  }) => {
    const inputRef = useRef(null);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, []);

    return (
      <div className="prompts-popup">
        <div className="prompts-header">
          <h4>Popular Prompts</h4>
          <button onClick={onClose} className="google-icon-btn small">
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="prompts-list">
          {popularPrompts.map((prompt, index) => (
            <div key={index} className="prompt-item">
              <button
                onClick={() => onPromptClick(prompt)}
                className="prompt-text"
              >
                {prompt}
              </button>
              <button
                onClick={() => onDeletePrompt(index)}
                className="google-icon-btn small"
              >
                <span className="material-icons">delete</span>
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={onAddPrompt} className="add-prompt-form">
          <input
            ref={inputRef}
            type="text"
            value={newPrompt}
            onChange={(e) => onNewPromptChange(e.target.value)}
            placeholder="Add new prompt..."
            className="google-input-style small"
          />
          <button
            type="submit"
            className="google-icon-btn"
            disabled={!newPrompt.trim()}
          >
            <span className="material-icons">add</span>
          </button>
        </form>
      </div>
    );
  }
);

const formatMessageContent = (content) => {
  if (!content) return null;

  return content.split("\n").map((line, lineIndex) => {
    // First check for hashtag-wrapped headers
    const headerMatch = line.match(/^###\s+(.+)/);
    if (headerMatch) {
      const [_, headerContent] = headerMatch;
      const cleanContent = headerContent.trim();

      // Process bold text within header
      const boldRegex = /(\*\*[^*]+\*\*)/g;
      const parts = cleanContent.split(boldRegex);

      const processedContent = parts.map((part, partIndex) => {
        if (part.match(boldRegex)) {
          return (
            <strong key={`bold-${lineIndex}-${partIndex}`}>
              {part.replace(/\*\*/g, "")}
            </strong>
          );
        }
        return part;
      });

      // Determine header level based on number of #
      return (
        <h3 key={`h3-${lineIndex}`} className="docs-heading tertiary">
          {processedContent}
        </h3>
      );
    }

    // Process regular text with bold formatting
    const boldRegex = /(\*\*[^*]+\*\*)/g;
    const parts = line.split(boldRegex);

    const processedLine = parts.map((part, partIndex) => {
      if (!part) return null;

      // Handle bold patterns
      if (part.match(boldRegex)) {
        const cleanContent = part.replace(/\*\*/g, "");
        return (
          <strong key={`bold-${lineIndex}-${partIndex}`}>{cleanContent}</strong>
        );
      }
      return part;
    });

    // Check for lists
    if (line.startsWith("* ")) {
      return (
        <ul key={`ul-${lineIndex}`} className="docs-list">
          <li className="docs-list-item">{processedLine.slice(2)}</li>
        </ul>
      );
    }

    // Regular paragraph with line breaks
    return (
      <p key={`p-${lineIndex}`} className="docs-paragraph">
        {processedLine}
      </p>
    );
  });
};

// Add to the DocumentViewer component
const ChatPanel = ({ documentId, user, onClose }) => {
  const abortControllerRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);

  // Remove selectedText prop
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [showPrompts, setShowPrompts] = useState(false);
  const [popularPrompts, setPopularPrompts] = useState(() => {
    // Load from localStorage
    const saved = localStorage.getItem("popularPrompts");
    return saved
      ? JSON.parse(saved)
      : [
          "Summarize the key points of this document",
          "Identify the main research questions",
          "List important statistics mentioned",
          "Create an outline based on the content",
        ];
  });
  const [newPrompt, setNewPrompt] = useState("");

  useEffect(() => {
    localStorage.setItem("popularPrompts", JSON.stringify(popularPrompts));
  }, [popularPrompts]);

  // Add these handler functions
  const handlePromptClick = (prompt) => {
    setInputMessage(prompt);
    setShowPrompts(false);
  };
  const handleDeletePrompt = (index) => {
    setPopularPrompts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddPrompt = (e) => {
    e.preventDefault();
    if (newPrompt.trim()) {
      setPopularPrompts((prev) => [...prev, newPrompt.trim()]);
      setNewPrompt("");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // In ChatPanel component
  const getDocumentText = useCallback(async () => {
    try {
      const res = await axios.get(
        `https://docs.googleapis.com/v1/documents/${documentId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
          params: { fields: "body(content)" },
        }
      );

      console.log("Google Docs API Response:", res.data);

      if (!res?.data?.body?.content) {
        console.error("Unexpected API response structure");
        return "";
      }

      // Improved text extraction with depth handling
      const extractText = (content) => {
        return content.reduce((text, item) => {
          if (item.paragraph) {
            return (
              text +
              item.paragraph.elements
                .map((e) => e.textRun?.content || "")
                .join("")
            );
          }
          if (item.table) {
            // Convert tables to markdown format
            const markdownTable = item.table.tableRows
              .map(
                (row) =>
                  `| ${row.tableCells
                    .map((cell) => extractText(cell.content).trim())
                    .join(" | ")} |`
              )
              .join("\n");
            return `${text}\n${markdownTable}\n`; // Add newlines around table
          }
          if (item.sectionBreak) {
            return text + "\n";
          }
          return text;
        }, "");
      };

      const fullText = extractText(res.data.body.content);

      // Clean up text by replacing newlines/tabs with spaces and collapsing whitespace
      const cleanedText = fullText
        .replace(/\t/g, " ") // Replace tabs with single space
        .replace(/  +/g, " ") // Collapse multiple spaces
        .replace(/(\n\s*){2,}/g, "\n\n") // Preserve paragraph breaks
        .trim();

      console.log("Extracted document text:", fullText);
      return cleanedText;
    } catch (error) {
      console.error("Document fetch failed:", error.response?.data || error);
      return "";
    }
  }, [documentId, user.token]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      type: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const documentText = await getDocumentText();
      const payload = {
        document_id: documentId,
        token: user.token,
        prompt: inputMessage, // Remove text: documentText
        text: documentText,
      };
      const streamingMessageId = new Date().toISOString();
      abortControllerRef.current = new AbortController();
      setIsStreaming(true);
      // Create a new bot message entry for streaming
      setMessages((prev) => [
        ...prev,
        {
          id: streamingMessageId,
          type: "bot",
          content: "",
          timestamp: streamingMessageId,
          isStreaming: true,
        },
      ]);

      const response = await fetch(
        "http://127.0.0.1:8000/chat",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          signal: abortControllerRef.current.signal, // Add abort signal
        }
      );

      // Handle non-OK responses
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;

        if (value) {
          buffer += decoder.decode(value, { stream: true });

          // Process complete JSON objects only
          while (buffer.includes("\n")) {
            const lineEndIndex = buffer.indexOf("\n");
            const line = buffer.slice(0, lineEndIndex).trim();
            buffer = buffer.slice(lineEndIndex + 1);

            if (!line.startsWith("data: ")) continue;

            try {
              const jsonStr = line.replace("data: ", "");
              const data = JSON.parse(jsonStr);
              if (data.response) {
                setMessages((prev) =>
                  prev.map((msg) => {
                    if (msg.id === streamingMessageId) {
                      return {
                        ...msg,
                        content: msg.content + data.response,
                        isStreaming: !data.done,
                      };
                    }
                    return msg;
                  })
                );
              }
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }
        }
      }

      // Final buffer flush
      if (buffer.trim()) {
        try {
          const data = JSON.parse(buffer.trim().replace("data: ", ""));
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === streamingMessageId
                ? {
                    ...msg,
                    content: msg.content + (data.analysis || data.chunk || ""),
                    isStreaming: false,
                  }
                : msg
            )
          );
        } catch (error) {
          console.error("Error parsing final chunk:", error);
        }
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Request aborted by user");
      } else {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            content: `Error: ${error.message}`,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);

      // Add this to ensure any remaining streaming messages are marked complete
      setMessages((prev) =>
        prev.map((msg) =>
          msg.isStreaming ? { ...msg, isStreaming: false } : msg
        )
      );

      abortControllerRef.current = null;
    }
  };

  const handleStop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setMessages((prev) =>
        prev.map((msg) =>
          msg.isStreaming ? { ...msg, isStreaming: false } : msg
        )
      );
    }
  }, []);
  // Frontend: Unified Chat Panel (Single Input/Button)
  return (
    <div className="google-style-chat-panel">
      <div className="docs-chat-header">
        <div className="header-left">
          <span className="google-docs-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="#4285F4"
                d="M14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
              />
              <path
                fill="#34A853"
                d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"
              />
            </svg>
          </span>
          <h3>Research Assistant</h3>
          <button
            onClick={() => setShowPrompts(!showPrompts)}
            className="google-prompts-btn"
            type="button"
            aria-label="Suggested prompts"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 4.5C7.5 4.5 3.75 8.25 3.75 12.75H2.25C1.425 12.75 0.75 13.425 0.75 14.25V15.75C0.75 16.575 1.425 17.25 2.25 17.25H6.75V12.75C6.75 9.6 9.3 7.05 12.45 7.05C15.6 7.05 18.15 9.6 18.15 12.75V17.25H21.75C22.575 17.25 23.25 16.575 23.25 15.75V14.25C23.25 13.425 22.575 12.75 21.75 12.75H20.25C20.25 8.25 16.5 4.5 12 4.5ZM14.25 18.75H9.75V20.25C9.75 21.075 10.425 21.75 11.25 21.75H12.75C13.575 21.75 14.25 21.075 14.25 20.25V18.75ZM15.75 17.25V12.75C15.75 10.95 14.4 9.45 12.75 9.15V8.25H11.25V9.15C9.525 9.45 8.25 10.95 8.25 12.75V17.25H15.75Z"
                fill="#5F6368"
              />
            </svg>
          </button>
        </div>
        <button onClick={onClose} className="google-close-btn">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
              fill="#5F6368"
            />
          </svg>
        </button>
      </div>

      <div className="docs-chat-messages">
        {messages.map((msg) => (
          <div key={msg.timestamp} className={`docs-message ${msg.type}`}>
            {msg.type === "bot" && (
              <div className="bot-avatar">
                <AssistantIcon style={{ fontSize: 18, color: "#5F6368" }} />
              </div>
            )}
            <div className="docs-message-bubble">
              <div className="message-content">
                {formatMessageContent(msg.content)}
                {msg.isStreaming &&
                  isStreaming && ( // Change this line
                    <div className="google-loading-dots">
                      <div className="dot"></div>
                      <div className="dot"></div>
                      <div className="dot"></div>
                    </div>
                  )}
              </div>

              <div className="docs-message-time">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="docs-chat-input">
        <div className="input-container">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask anything or analyze document..."
            className="google-input-style"
            disabled={isLoading}
          />
          <button
            type={isStreaming ? "button" : "submit"}
            onClick={isStreaming ? handleStop : undefined}
            className="google-icon-btn"
            disabled={!isStreaming && isLoading}
          >
            {isStreaming ? (
              <StopIcon style={{ fontSize: 20, color: "#EA4335" }} />
            ) : isLoading ? (
              <div className="google-loading-dots small">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            ) : (
              <AssistantIcon style={{ fontSize: 20, color: "#1A73E8" }} />
            )}
          </button>
        </div>
      </form>

      {/* Prompts popup placed OUTSIDE the chat input form */}
      {showPrompts && (
        <PopularPromptsPopup
          popularPrompts={popularPrompts}
          newPrompt={newPrompt}
          onPromptClick={handlePromptClick}
          onDeletePrompt={handleDeletePrompt}
          onAddPrompt={handleAddPrompt}
          onClose={() => setShowPrompts(false)}
          onNewPromptChange={setNewPrompt}
        />
      )}
    </div>
  );
};

export default ChatPanel;
