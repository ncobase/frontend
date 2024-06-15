/**
 * 转换 URL 参数
 * @param {object} params
 * @returns {string}
 */

import { cleanArray } from '../helpers/array';
import { isObject } from '../helpers/raw_type';

export function buildQueryString(params: Record<string, any>): string {
  if (!isObject(params)) {
    return '';
  }
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    searchParams.append(key, String(value));
  }
  return searchParams.toString();
}

/**
 * 将 JSON 对象转换为 URL 查询参数字符串
 * @param {object} json JSON 对象
 * @returns {string} URL 查询参数字符串
 */
export function param(json: Record<string, any> | null | undefined): string {
  if (!json) {
    return '';
  }
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) {
        return '';
      }
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
    })
  ).join('&');
}

/**
 * 将 URL 查询参数字符串转换为 JSON 对象
 * @param {string} url URL 查询参数字符串
 * @returns {object} JSON 对象
 */
export function param2Obj(url: string): Record<string, any> {
  const search = url.split('?')[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') +
      '"}'
  );
}

/**
 * 判断当前路径是否与目标路径匹配
 * @param {string} currentPath 当前路径
 * @param {string} to 目标路径
 * @param {number} depth 匹配深度，默认为 1
 * @returns {boolean}
 */
export const isPathMatching = (currentPath: string, to: string, depth: number = 1): boolean => {
  if (!!to && currentPath === to) {
    return true;
  }
  const currentPathParts = splitPath(currentPath);
  const toPathParts = splitPath(to);
  for (let i = 0; i < depth; i++) {
    if (currentPathParts[i] !== toPathParts[i]) {
      return false;
    }
  }
  return true;
};

/**
 * 将路径拆分为数组，去除空字符串
 * @param {string} path 路径
 * @returns {string[]}
 */
export const splitPath = (path: string): string[] => path.split('/').filter(p => p);

/**
 * 将数组拼接为路径
 * @param {string[]} pathParts 路径片段
 * @returns {string}
 */
export const joinPath = (...pathParts: string[]): string => {
  return pathParts.filter(p => p).join('/');
};

/**
 * 判断当前路径是否为外链
 * @param {string} path 路径
 * @returns {boolean}
 */
export const isExternal = (path: string): boolean => {
  return /^(https?:|mailto:|tel:)/.test(path);
};

/**
 * 判断当前路径是否为内链
 * @param {string} path 路径
 * @returns {boolean}
 */
export const isInLink = (path: string): boolean => {
  return !isExternal(path);
};

/**
 * 判断当前路径是否为绝对路径
 * @param {string} path 路径
 * @returns {boolean}
 */
export const isAbsolute = (path: string): boolean => {
  return path.startsWith('/');
};

/**
 * 判断当前路径是否为相对路径
 * @param {string} path 路径
 * @returns {boolean}
 */
export const isRelative = (path: string): boolean => {
  return !isAbsolute(path);
};

/**
 * 判断当前路径是否为根路径
 * @param {string} path 路径
 * @returns {boolean}
 */
export const isRoot = (path: string): boolean => {
  return path === '/';
};
