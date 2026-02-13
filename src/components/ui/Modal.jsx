import { X } from "lucide-react";
import { useBodyScrollLock } from "../../utils/hooks";

export default function Modal({ isOpen, onClose, ariaLabelledBy, children }) {
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const handleOverlayClick = () => onClose();
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      onClick={handleOverlayClick}
    >
      <div
        className="modal-contentWrapper bg-softWhite text-deepBlue border-lightBlue modal-scrollbar relative my-0 w-full max-w-lg overflow-y-auto border-2 p-4 sm:my-8 sm:p-6"
        style={{ maxHeight: "90dvh" }}
        onClick={handleContentClick}
      >
        <button
          type="button"
          onClick={onClose}
          className="border-darkBlue hover:bg-deepBlue hover:text-softWhite absolute top-0.5 right-0.5 z-10 cursor-pointer border p-1 transition-all duration-300 active:scale-95"
          aria-label="Close modal"
        >
          <X className="size-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
