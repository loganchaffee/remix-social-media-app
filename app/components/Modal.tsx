import { ReactNode, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

type Props = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  centerTitle?: boolean;
  hasCloseButton?: boolean;
};

let timeOutId1: NodeJS.Timeout | null = null;
let timeOutId2: NodeJS.Timeout | null = null;

export function Modal({
  children,
  title,
  centerTitle = false,
  isOpen,
  onClose,
  hasCloseButton = true,
}: Props) {
  const [isOpenInternal, setIsOpenInternal] = useState(isOpen);

  const internalClose = () => {
    setIsOpenInternal(false);

    timeOutId1 = setTimeout(() => {
      onClose();
    }, 200);
  };

  useEffect(() => {
    setIsOpenInternal(isOpen);
  }, [isOpen]);

  return (
    <div
      className={`
        fixed inset-0 flex justify-center items-center  transition-colors
        ${isOpenInternal ? "visible bg-black/20" : "invisible"}
      `}
      onClick={internalClose}
    >
      <div
        className={`
          bg-white p-6 rounded shadow-lg max-w-md w-full transition-all
          ${isOpenInternal ? "scale-100 opacity-100" : "scale-50 opacity-0"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3">
          <div className="border-b mb-3 flex justify-between items-center pb-3">
            <h2
              className={`text-xl font-bold ${
                centerTitle ? "text-center" : ""
              }`}
            >
              {title}
            </h2>
            {hasCloseButton && (
              <button
                onClick={internalClose}
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
