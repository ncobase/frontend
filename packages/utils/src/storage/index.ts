import { isArray, isObject } from '../helpers/raw_type';

const get = (key: string, parse = false) => {
  let value = localStorage.getItem(key) as any;
  if (parse) {
    value = JSON.parse(value);
  }
  return value;
};

const set = (key: string, value: any) => {
  if (isObject(value) || isArray(value)) {
    value = JSON.stringify(value);
  }
  return localStorage.setItem(key, value);
};

const remove = (key: string) => {
  return localStorage.removeItem(key);
};

const clear = () => {
  return localStorage.clear();
};

const key = (index: number) => {
  return localStorage.key(index);
};

export const locals = {
  clear,
  get,
  key,
  remove,
  set
};
