import React from 'react';
import { ModalProps, defaultModalProps } from '../../types/componentProps';
import { Button } from './Button';

export const Modal: React.FC<ModalProps> = props => {
  const {
    isOpen,
    onClose,
    title,
    children,
    modalSize,
    showCloseButton,
    closeOnOverlay,
    closeOnEscape,
    className,
    ...restProps
  } = { ...defaultModalProps({}), ...props };

  const modalRef = React.useRef<HTMLDivElement>(null);
  const previousActiveElement = React.useRef<Element | null>(null);

  // Handle escape key
  React.useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Handle focus management
  React.useEffect(() => {
    if (!isOpen) return;

    // Store the previously focused element
    previousActiveElement.current = document.activeElement;

    // Focus the modal
    if (modalRef.current) {
      modalRef.current.focus();
    }

    // Return focus when modal closes
    return () => {
      if (previousActiveElement.current && 'focus' in previousActiveElement.current) {
        (previousActiveElement.current as HTMLElement).focus();
      }
    };
  }, [isOpen]);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizeClasses = React.useMemo(
    () => ({
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-full mx-4',
    }),
    []
  );

  const handleOverlayClick = React.useCallback(
    (event: React.MouseEvent) => {
      if (closeOnOverlay && event.target === event.currentTarget) {
        onClose();
      }
    },
    [closeOnOverlay, onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`
          relative
          bg-gray-800
          rounded-lg
          shadow-2xl
          w-full
          ${sizeClasses[modalSize as keyof typeof sizeClasses]}
          max-h-[90vh]
          overflow-hidden
          animate-in
          fade-in-0
          zoom-in-95
          duration-200
          ${className || ''}
        `}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        {...restProps}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            {title && (
              <h2 id="modal-title" className="text-xl font-semibold text-white">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="ml-4 text-gray-400 hover:text-white"
                aria-label="Close modal"
              >
                ✕
              </Button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">{children}</div>
      </div>
    </div>
  );
};

// Specialized modal components
interface ConfirmModalProps extends Omit<ModalProps, 'children'> {
  readonly message: string;
  readonly confirmText?: string;
  readonly cancelText?: string;
  readonly onConfirm: () => void;
  readonly variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onClose,
  variant = 'info',
  ...modalProps
}) => {
  const variantStyles = {
    danger: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  };

  const handleConfirm = React.useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  return (
    <Modal {...modalProps} onClose={onClose} size="sm">
      <div className="text-center">
        <div className={`text-lg font-medium mb-4 ${variantStyles[variant]}`}>{message}</div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={handleConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

interface AlertModalProps extends Omit<ModalProps, 'children'> {
  readonly message: string;
  readonly buttonText?: string;
  readonly variant?: 'success' | 'error' | 'warning' | 'info';
}

export const AlertModal: React.FC<AlertModalProps> = ({
  message,
  buttonText = 'OK',
  onClose,
  variant = 'info',
  ...modalProps
}) => {
  const variantStyles = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  };

  const variantIcons = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <Modal {...modalProps} onClose={onClose} size="sm">
      <div className="text-center">
        <div className={`text-4xl mb-4 ${variantStyles[variant]}`}>{variantIcons[variant]}</div>
        <div className="text-lg font-medium mb-6 text-gray-200">{message}</div>
        <Button onClick={onClose} fullWidth>
          {buttonText}
        </Button>
      </div>
    </Modal>
  );
};
