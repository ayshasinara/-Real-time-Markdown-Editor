import './App.css';
import { useState, useRef, useEffect } from 'react';
import {
  toolbarStyle,
  buttonStyle,
  resetButtonStyle,
  emojiPickerStyle,
  emojiButtonStyle,
  typingIndicatorStyle,
  editorContainerStyle,
  textareaStyle,
  previewStyle
} from './Style'; // Import your styles from styles.js

function App() {
  const [markdownText, setMarkdownText] = useState('');
  const [renderedHTML, setRenderedHTML] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);
  const typingTimeout = useRef(null);

  const fetchHTMLFromMarkdown = async (markdown) => {
    try {
      const res = await fetch('http://localhost:3001/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown }),
      });
      const data = await res.json();
      setRenderedHTML(data.html);
    } catch (err) {
      console.error('Failed to fetch converted HTML:', err);
    }
  };

  const insertAtCursor = (text) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = markdownText.slice(0, start);
    const after = markdownText.slice(end);
    const newText = before + text + after;
    setMarkdownText(newText);
    fetchHTMLFromMarkdown(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setMarkdownText(value);
    setIsTyping(true);
    fetchHTMLFromMarkdown(value);

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => setIsTyping(false), 1000);
  };

  const insertNextLine = () => {
    insertAtCursor('<br>'); // Insert HTML line break
  };
  
  const emojis = ['😊', '😂', '😍', '😎', '🥺', '😜', '👍', '🙏', '❤️', '💀', '😁', '🤔', '😏', '🥳', '🤩', '💩', '🧑‍💻', '🧑‍🎤', '🎉', '🫣', '🤖', '🧡', '💚', '💙', '💛'];

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
    setRenderedHTML('');
  };

  useEffect(() => {
    fetch('http://localhost:3001/ping')
      .then(res => res.text())
      .then(data => console.log('✅ Backend says:', data))
      .catch(err => console.error('❌ Could not connect to backend:', err));
  }, []);

  return (
    <div className="App">
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
        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={buttonStyle}>😊</button>
        <button onClick={insertNextLine} style={buttonStyle}>Next Line</button> {/* Next Line Button */}
        <button onClick={resetEditor} style={resetButtonStyle}>Reset</button>
      </div>

      {showEmojiPicker && (
        <div style={emojiPickerStyle}>
          {emojis.map((emoji, index) => (
            <button key={index} onClick={() => insertEmoji(emoji)} style={emojiButtonStyle}>
              {emoji}
            </button>
          ))}
        </div>
      )}

      <div style={editorContainerStyle}>
        <textarea
          ref={textareaRef}
          value={markdownText}
          onChange={handleTyping}
          placeholder="Write your markdown here..."
          style={textareaStyle}
        />
        <div style={previewStyle}>
          {isTyping && <div style={typingIndicatorStyle}>Typing...</div>}
          <div dangerouslySetInnerHTML={{ __html: renderedHTML }} />
        </div>
      </div>
    </div>
  );
}

export default App;
