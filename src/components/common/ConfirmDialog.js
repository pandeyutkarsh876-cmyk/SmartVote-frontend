import React, { useState } from 'react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmWord = 'DELETE' }) => {
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <p className="confirm-instruction">
          Please type <strong>{confirmWord}</strong> to confirm.
        </p>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder={confirmWord}
          className="confirm-input"
        />
        <div className="confirm-modal-actions">
          <button 
            className="btn btn-secondary" 
            onClick={() => { setInput(''); onClose(); }}
          >
            Cancel
          </button>
          <button 
            className="btn btn-danger" 
            disabled={input !== confirmWord}
            onClick={() => { setInput(''); onConfirm(); }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
