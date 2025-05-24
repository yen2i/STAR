import React from 'react';
import '../styles/Modal.css';

const Modal = ({ onClose, children, size = 'medium' }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-box modal-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
