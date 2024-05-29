import { ReactNode } from "react";
import { Button } from "./Button";

type Props = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

export function Modal({ children, title, isOpen, onClose }: Props) {
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
            <Button onClick={onClose}>Close</Button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
