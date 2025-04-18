import './App.css';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3030');

function App() {
  const [markdownText, setMarkdownText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [roomId, setRoomId] = useState('default-room');
  const textareaRef = useRef(null);


  const typingTimeout = useRef(null);

  const insertAtCursor = (text) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = markdownText.slice(0, start);
    const after = markdownText.slice(end);
    const newText = before + text + after;
    setMarkdownText(newText);


    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  
  const handleTyping = (e) => {
    const value = e.target.value;
    setMarkdownText(value);
    setIsTyping(true);

    socket.emit('markdownUpdate', { roomId, markdown: value });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => setIsTyping(false), 1000);
  };


  const emojis = [
    '😊', '😂', '😍', '😎', '🥺', '😜', '👍', '🙏', '❤️', '💀',
    '😁', '🤔', '😏', '🥳', '🤩', '💩', '🧑‍💻', '🧑‍🎤', '🎉', '🫣',
    '🤖', '🧡', '💚', '💙', '💛'
  ];

  const insertEmoji = (emoji) => {
    insertAtCursor(emoji);
    setShowEmojiPicker(false); 
  };


  const insertHeading1 = () => insertAtCursor('# Heading 1\n');
  const insertHeading2 = () => insertAtCursor('## Heading 2\n');
  const insertBold = () => insertAtCursor('**Bold Text**');
  const insertItalic = () => insertAtCursor('_Italic Text_');
  const insertList = () => insertAtCursor('- List item\n');
  const insertQuote = () => insertAtCursor('> Quoted text\n');
  const insertInlineCode = () => insertAtCursor('`inline code`');
  const insertCodeBlock = () => insertAtCursor('```\ncode block\n```');
  const insertTable = () => insertAtCursor('| Name | Age |\n|------|-----|\n| John | 25  |\n');
  const insertImage = () => {
    const url = prompt("Enter image URL");
    if (url) insertAtCursor(`![Alt text](${url})\n`);
  };
  const insertLink = () => {
    const text = prompt("Link text:");
    const url = prompt("Link URL:");
    if (text && url) insertAtCursor(`[${text}](${url})`);
  };

  
  const insertNumberedList = () => {
    const matches = markdownText.match(/^(\d+)\.\s/gm);
    const lastNumber = matches ? Math.max(...matches.map(m => parseInt(m))) : 0;
    const nextNumber = lastNumber + 1;
    insertAtCursor(`${nextNumber}. List item\n`);
  };


  const resetEditor = () => {
    setMarkdownText('');
  };

  useEffect(() => {
  
    socket.emit('joinRoom', roomId);

    
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });


    socket.on('markdownUpdate', (incomingMarkdown) => {
      setMarkdownText(incomingMarkdown);
    });

    return () => {
      socket.disconnect();  
    };
  }, [roomId]);  

  return (
    <div className="App">
      {/* Toolbar */}
      <div style={toolbarStyle}>
        <button onClick={insertHeading1} style={buttonStyle}>H1</button>
        <button onClick={insertHeading2} style={buttonStyle}>H2</button>
        <button onClick={insertBold} style={buttonStyle}>Bold</button>
        <button onClick={insertItalic} style={buttonStyle}>Italic</button>
        <button onClick={insertList} style={buttonStyle}>List</button>
        <button onClick={insertNumberedList} style={buttonStyle}>Numbered List</button>
        <button onClick={insertQuote} style={buttonStyle}>Quote</button>
        <button onClick={insertInlineCode} style={buttonStyle}>Inline Code</button>
        <button onClick={insertCodeBlock} style={buttonStyle}>Code Block</button>
        <button onClick={insertTable} style={buttonStyle}>Table</button>
        <button onClick={insertImage} style={buttonStyle}>Image</button>
        <button onClick={insertLink} style={buttonStyle}>Link</button>
        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={buttonStyle}>😊</button> {/* Emoji Button */}
        <button onClick={resetEditor} style={resetButtonStyle}>Reset</button> {/* Reset Button */}
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div style={emojiPickerStyle}>
          {emojis.map((emoji, index) => (
            <button key={index} onClick={() => insertEmoji(emoji)} style={emojiButtonStyle}>
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Editor + Preview */}
      <div style={editorContainerStyle}>
        <textarea
          ref={textareaRef}
          value={markdownText}
          onChange={handleTyping}
          placeholder="Write your markdown here..."
          style={textareaStyle}
        />
        
        <div style={previewStyle}>
          {/* Typing Indicator */}
          {isTyping && <div style={typingIndicatorStyle}>Typing...</div>}

          <ReactMarkdown
            children={String(markdownText)} 
            components={{
              code({ node, inline, className, children, ...props }) {
                const language = className?.replace('language-', '') || 'text';
                return !inline ? (
                  <SyntaxHighlighter
                    style={prism}
                    language={language}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}  
                  </SyntaxHighlighter>
                ) : (
                  <code {...props}>{String(children)}</code>  
                );
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}



const toolbarStyle = {
  marginBottom: '15px',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  padding: '10px',
  backgroundColor: '#f7f7f7',
  borderBottom: '1px solid #ccc',
};

const buttonStyle = {
  padding: '8px 12px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  backgroundColor: '#4CAF50',
  color: '#fff',
  fontSize: '14px',
  cursor: 'pointer',
};

const resetButtonStyle = {
  padding: '8px 12px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  backgroundColor: '#f44336',
  color: '#fff',
  fontSize: '14px',
  cursor: 'pointer',
};

const emojiPickerStyle = {
  position: 'absolute',
  top: '60px',
  left: '10px',
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: '5px',
  backgroundColor: '#fff',
  padding: '10px',
  borderRadius: '8px',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  zIndex: '100',
};

const emojiButtonStyle = {
  fontSize: '20px',
  backgroundColor: '#f0f0f0',
  border: 'none',
  padding: '8px',
  cursor: 'pointer',
  borderRadius: '6px',
  transition: 'background-color 0.3s',
};

const typingIndicatorStyle = {
  fontSize: '14px',
  color: '#888',
  fontStyle: 'italic',
  marginBottom: '10px',
};

const editorContainerStyle = {
  display: 'flex',
  width: '100%',
  height: '80vh',
  gap: '20px',
  padding: '10px',
  boxSizing: 'border-box',
};

const textareaStyle = {
  width: '60%',
  height: '100%',
  fontSize: '16px',
  padding: '15px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
  fontFamily: 'monospace',
  resize: 'none',
  outline: 'none',
  color: '#333',
  boxSizing: 'border-box',
};

const previewStyle = {
  width: '40%',
  height: '100%',
  overflowY: 'auto',
  padding: '20px',
  borderRadius: '8px',
  backgroundColor: '#fff',
  boxSizing: 'border-box',
  border: '1px solid #ddd',
};

export default App;
