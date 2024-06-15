/**
 * 从原始数据中获取指定路径的字段值
 * @param obj 原始数据
 * @param path 字符串路径由点号分隔嵌套路径或者字符串数组
 * @param defaultValue 当字段值是 null 或 undefined 时，返回默认值。否则返回 null
 * @returns 指定路径的字段值
 */
export function getValueByPath(obj: any, path: string | string[], defaultValue?: any): any {
  const paths = Array.isArray(path) ? path : path.split('.');
  const _isNull = (v: any) => v === null || v === undefined;
  let value = obj;

  for (let i = 0; i < paths.length; i++) {
    if (_isNull(value)) {
      break;
    }
    value = value[paths[i]];
  }

  return _isNull(value) ? (_isNull(defaultValue) ? null : defaultValue) : value;
}
