import { ReactNode } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

type Props = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  hasCloseButton?: boolean;
};

export function Modal({
  children,
  title,
  isOpen,
  onClose,
  hasCloseButton = true,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded shadow-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3">
          <div className="border-b mb-3 flex justify-between items-center pb-3">
            <h2 className="text-xl font-bold">{title}</h2>
            {hasCloseButton && (
              <button
                onClick={onClose}
                className="border border-gray-300 text-gray-300 rounded px-3 py-1 hover:text-white hover:bg-gray-500 hover:border-gray-500 transition-colors"
              >
                <XMarkIcon className="size-4" />
              </button>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
