export function Spinner({ size = "lg" }: { size?: "sm" | "lg" }) {
  if (size === "lg") {
    return (
      <div className="w-8 h-8 border-4 border-b-transparent border-width rounded-full animate-spin" />
    );
  }

  return (
    <div className="w-5 h-5 border-4 border-b-transparent border-width rounded-full animate-spin" />
  );
}
