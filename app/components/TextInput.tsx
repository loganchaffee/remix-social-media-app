import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  variant?: string;
};

export function TextInput({ className, type, ...props }: Props) {
  return (
    <input
      type={type ?? "text"}
      name="username"
      className={`border rounded block w-full p-1 ${className}`}
      {...props}
    />
  );
}
