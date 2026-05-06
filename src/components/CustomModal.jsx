import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './CustomModal.css';

const CustomModal = ({ isOpen, title, message, type = 'info', onConfirm, onClose, confirmText, cancelText }) => {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(overlayRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(modalRef.current, 
        { y: 30, opacity: 0, scale: 0.95 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)', delay: 0.1 }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
    gsap.to(modalRef.current, { y: 20, opacity: 0, scale: 0.95, duration: 0.2, onComplete: onClose });
  };

  const handleConfirm = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
    gsap.to(modalRef.current, { y: -20, opacity: 0, scale: 0.95, duration: 0.2, onComplete: () => {
      onClose();
      if (onConfirm) onConfirm();
    }});
  };

  // Typy: 'info', 'danger', 'success', 'confirm'
  const isDanger = type === 'danger';
  const isConfirm = type === 'confirm' || type === 'danger';

  return (
    <div className="custom-modal-overlay" ref={overlayRef}>
      <div className="custom-modal-box" ref={modalRef}>
        
        <div className="modal-header">
          {type === 'danger' && <span className="material-symbols-outlined text-danger">warning</span>}
          {type === 'success' && <span className="material-symbols-outlined text-success">check_circle</span>}
          {type === 'info' && <span className="material-symbols-outlined text-info">info</span>}
          {type === 'confirm' && <span className="material-symbols-outlined text-primary">help</span>}
          <h2 className="modal-title">{title}</h2>
        </div>

        <div className="modal-body">
          <p>{message}</p>
        </div>

        <div className="modal-footer">
          {isConfirm && (
            <button className="btn-modal-cancel" onClick={handleClose}>
              {cancelText || 'Zrušit'}
            </button>
          )}
          <button 
            className={`btn-modal-confirm ${isDanger ? 'btn-modal-danger' : 'btn-modal-primary'}`} 
            onClick={isConfirm ? handleConfirm : handleClose}
          >
            {confirmText || (isConfirm ? 'Potvrdit' : 'Rozumím')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
