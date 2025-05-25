import React from 'react';
import '../styles/Modal.css';

const Modal = ({ onClose, children, size = 'medium' }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-box modal-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모든 모달에 공통 적용되는 X 버튼 */}
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
