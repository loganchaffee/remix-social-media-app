import { useMatches } from "@remix-run/react";

export function useUser() {
  const data = useMatches().find((route) => route.id === "root");
}
