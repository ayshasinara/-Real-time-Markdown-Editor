// styles.js

export const toolbarStyle = {
    marginBottom: '15px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    padding: '10px',
    backgroundColor: '#f7f7f7',
    borderBottom: '1px solid #ccc',
  };
  
  export const buttonStyle = {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    backgroundColor: '#4CAF50',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
  };
  
  export const resetButtonStyle = {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    backgroundColor: '#f44336',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
  };
  
  export const emojiPickerStyle = {
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
  
  export const emojiButtonStyle = {
    fontSize: '20px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    padding: '8px',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'background-color 0.3s',
  };
  
  export const typingIndicatorStyle = {
    fontSize: '14px',
    color: '#888',
    fontStyle: 'italic',
    marginBottom: '10px',
  };
  
  export const editorContainerStyle = {
    display: 'flex',
    width: '100%',
    height: '80vh',
    gap: '20px',
    padding: '10px',
    boxSizing: 'border-box',
  };
  
  export const textareaStyle = {
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
  
  export const previewStyle = {
    width: '40%',
    height: '100%',
    overflowY: 'auto',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    border: '1px solid #ddd',
  };
  