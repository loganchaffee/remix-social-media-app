import { InformationCircleIcon } from "@heroicons/react/24/solid";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

interface ToastContextType {
  message: string | null;
  isOpen: boolean;
  toast: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

let timeoutId: NodeJS.Timeout | null = null;

export function ToastProvider({ children }: ToastProviderProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const toast = useCallback((message: string, duration: number = 3000) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setMessage(message);

    setIsOpen(true);

    timeoutId = setTimeout(() => {
      setIsOpen(false);
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ message, isOpen, toast }}>
      {children}
    </ToastContext.Provider>
  );
}

function useToastContext(): ToastContextType {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }

  return context;
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }

  return context.toast;
}

export function ToastNotification() {
  const { message, isOpen } = useToastContext();

  return (
    <div
      className="fixed top-3 right-3 bg-white p-3 w-fit max-w-80 border rounded z-20 flex items-center transition-all"
      style={
        isOpen
          ? { transform: "translateX(0)" }
          : { transform: "translateX(120%)" }
      }
    >
      <InformationCircleIcon className="size-5 text-blue-500 mr-2" />
      {message}
    </div>
  );
}
