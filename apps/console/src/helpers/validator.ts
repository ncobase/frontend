export const validator = {
  /**
   * 验证用户名
   * @example
   *  username.test('admin') // boolean
   */
  username: /^[a-zA-Z0-9_]{6,30}$/,
  /**
   * 验证邮箱
   * @example
   *  email.test('admin@example.com') // boolean
   */
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};
