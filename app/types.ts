export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
// export type ArgsType<T> = T extends (...args: infer A) => any ? A : never;
