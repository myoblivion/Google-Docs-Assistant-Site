// In the message rendering part, modify the condition:
<div className="message-content">
  {formatMessageContent(msg.content)}
  {(msg.isStreaming && isStreaming) && ( // Change this line
    <div className="google-loading-dots">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  )}
</div>

// And in the handleSendMessage function, update the finally block:
} finally {
  setIsLoading(false);
  setIsStreaming(false);
  
  // Add this to ensure any remaining streaming messages are marked complete
  setMessages(prev => prev.map(msg => 
    msg.isStreaming ? {...msg, isStreaming: false} : msg
  ));
  
  abortControllerRef.current = null;
}