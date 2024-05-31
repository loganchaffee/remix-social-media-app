import { ButtonHTMLAttributes } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "blue" | "blue-outline" | "red" | "red-outline";
};

export const Button = ({
  children,
  className,
  variant = "blue",
  ...props
}: ButtonProps) => {
  let classes = "";

  switch (variant) {
    case "blue":
      classes = "bg-blue-500 hover:bg-blue-400 disabled:bg-blue-300 text-white";
      break;
    case "blue-outline":
      classes =
        "hover:bg-blue-400 disabled:bg-blue-300 disabled:text-blue-300 border border-blue-500 hover:border-blue-400 disabled:border-blue-300 text-blue-500 hover:text-white";
      break;
    case "red":
      classes = "bg-red-500 hover:bg-red-400 disabled:bg-red-300 text-white";
      break;
    case "red-outline":
      classes =
        "hover:bg-red-400 focus:text-white disabled:bg-red-300 disabled:text-red-300 border border-red-500 hover:border-red-400 disabled:border-red-300 text-red-500 hover:text-white";
      break;
    default:
      break;
  }

  return (
    <button
      {...props}
      className={`py-1 px-4 rounded-lg transition-colors ${classes} ${className}`}
    >
      {children}
    </button>
  );
};
