import { LoaderFunctionArgs, TypedResponse } from "@remix-run/node";
import { useMatches } from "@remix-run/react";

type ExtractDataType<T> = T extends ({
  request,
}: LoaderFunctionArgs) => Promise<TypedResponse<infer U>>
  ? U
  : never;

export const useRouteData = <T>(routeId: string): ExtractDataType<T> => {
  const matches = useMatches();

  const data = matches.find((match) => match.id === routeId)?.data;

  return data as ExtractDataType<T>;
};
