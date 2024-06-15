/**
 * 使用这种类型临时绕过 `any` 而不写 `any`
 * 注释该行以查找它的使用位置
 */
export type TODO = any;

/**
 * 使用此类型来使用显式的 `any`
 */
export type ExplicitAny = any;

/**
 * 使用此类型来声明异步或同步
 */
type AsyncOrSync<T> = Promise<T> | T;

/**
 * 使用此类型来声明异步或同步的返回
 */
export type AsyncOrSyncReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => AsyncOrSync<infer R>
  ? R
  : any;

/**
 * 使用此类型将第一种类型的键覆盖为第二种。
 */
export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

/**
 * 任意对象类型
 */
export type AnyObject = Record<string, unknown> | { [key: string]: unknown };

/**
 * 任意数组类型
 */
export type AnyArray = Array<Record<string, unknown> | { [key: string]: unknown }>;

/**
 * 使用此类型标记 react-query QueryKeys
 */
export type InferQueryKey<T extends (...args: any) => readonly any[]> = ReturnType<T>;

// /**
//  * 声明 Ethereum
//  */
//
// export interface Window {
//   ethereum?: any;
// }
